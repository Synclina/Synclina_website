import assert from "node:assert/strict";
import { test } from "node:test";
import { hashSecret, newRecoveryCode, normalizeRecoveryCode, safeEqual, verifySecret } from "../src/lib/admin/crypto.ts";
import { base32Decode, base32Encode, codeForStep, matchTotp, newTotpSecret, stepAt } from "../src/lib/admin/totp.ts";
import {
  IDLE_LIMIT_MS,
  SESSION_LIMIT_MS,
  lockAfter,
  readStatus,
  readTicketChange,
  sameOrigin,
  sessionAlive,
  validAdminPath,
} from "../src/lib/admin/rules.ts";

test("a password matches its hash and nothing else", async () => {
  const stored = await hashSecret("correct horse battery", 14);
  assert.equal(await verifySecret("correct horse battery", stored), true);
  assert.equal(await verifySecret("correct horse batterz", stored), false);
  assert.equal(await verifySecret("", stored), false);
  assert.equal(await verifySecret("x", "not-a-hash"), false);
  assert.ok(!stored.includes("$"), "dollar signs get expanded in .env files");
  assert.ok(!stored.includes("correct"));
});

test("hashing the same password twice gives different stored values", async () => {
  assert.notEqual(await hashSecret("same", 14), await hashSecret("same", 14));
});

test("safeEqual", () => {
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abd"), false);
  assert.equal(safeEqual("abc", "abcd"), false);
});

test("recovery codes have a fixed form and ignore case and spaces", () => {
  const code = newRecoveryCode();
  assert.match(code, /^[A-Z2-9]{5}-[A-Z2-9]{5}$/);
  assert.equal(normalizeRecoveryCode(` ${code.toLowerCase()} `), code);
});

test("TOTP matches the RFC 6238 published values", () => {
  const secret = base32Encode(Buffer.from("12345678901234567890"));
  assert.equal(codeForStep(secret, Math.floor(59 / 30)), "287082");
  assert.equal(codeForStep(secret, Math.floor(1111111109 / 30)), "081804");
  assert.equal(codeForStep(secret, Math.floor(1234567890 / 30)), "005924");
  assert.equal(codeForStep(secret, Math.floor(2000000000 / 30)), "279037");
});

test("base32 survives a round trip", () => {
  const data = Buffer.from([0, 1, 2, 250, 251, 252, 253, 254, 255, 7]);
  assert.deepEqual(base32Decode(base32Encode(data)), data);
});

test("a code works now and one step either side, not further", () => {
  const secret = newTotpSecret();
  const now = Date.now();
  const step = stepAt(now);
  assert.equal(matchTotp(secret, codeForStep(secret, step), now), step);
  assert.equal(matchTotp(secret, codeForStep(secret, step - 1), now), step - 1);
  assert.equal(matchTotp(secret, codeForStep(secret, step + 1), now), step + 1);
  const old = codeForStep(secret, step - 5);
  if (![step - 1, step, step + 1].some((s) => codeForStep(secret, s) === old)) {
    assert.equal(matchTotp(secret, old, now), null);
  }
});

test("a code that was used can't be used again", () => {
  const secret = newTotpSecret();
  const now = Date.now();
  const step = stepAt(now);
  const code = codeForStep(secret, step);
  assert.equal(matchTotp(secret, code, now, step - 2), step);
  assert.equal(matchTotp(secret, code, now, step), null);
});

test("bad codes are refused", () => {
  const secret = newTotpSecret();
  for (const code of ["", "12345", "1234567", "abcdef", "12 456"]) assert.equal(matchTotp(secret, code, Date.now()), null);
});

test("sign-in locks after 5 wrong tries, for an hour at most", () => {
  assert.equal(lockAfter(4), 0);
  assert.equal(lockAfter(5), 15 * 60 * 1000);
  assert.equal(lockAfter(6), 30 * 60 * 1000);
  assert.equal(lockAfter(7), 60 * 60 * 1000);
  assert.equal(lockAfter(50), 60 * 60 * 1000);
});

test("a session ends when idle or too old", () => {
  const t0 = 1_000_000_000;
  assert.equal(sessionAlive(t0, t0, t0 + 1000), true);
  assert.equal(sessionAlive(t0, t0, t0 + IDLE_LIMIT_MS), false);
  assert.equal(sessionAlive(t0, t0 + SESSION_LIMIT_MS - 1, t0 + SESSION_LIMIT_MS), false);
  assert.equal(sessionAlive(t0, t0 + SESSION_LIMIT_MS - 1000, t0 + SESSION_LIMIT_MS - 1), true);
});

test("statuses read the way the app reads them", () => {
  assert.equal(readStatus("open"), "open");
  assert.equal(readStatus("in_progress"), "in_progress");
  assert.equal(readStatus("In progress"), "in_progress");
  assert.equal(readStatus("inprogress"), "in_progress");
  for (const v of ["fixed", "Resolved", "closed", "done"]) assert.equal(readStatus(v), "fixed");
  assert.equal(readStatus("whatever"), "open");
  assert.equal(readStatus(null), "open");
});

test("ticket changes are checked", () => {
  const good = { uid: "abc123", reference: "FS-ABC234", status: "fixed", note: " Done " };
  assert.deepEqual(readTicketChange(good), { uid: "abc123", reference: "FS-ABC234", status: "fixed", note: "Done" });
  assert.equal(readTicketChange({ ...good, reference: "DS-ABC234" })?.reference, "DS-ABC234");
  for (const bad of [
    null,
    "x",
    { ...good, uid: "../deletions/x" },
    { ...good, uid: "" },
    { ...good, reference: "FS-abc" },
    { ...good, reference: "../../x" },
    { ...good, status: "pending" },
    { ...good, status: undefined },
    { ...good, note: 5 },
    { ...good, note: "x".repeat(1001) },
  ]) {
    assert.equal(readTicketChange(bad), null);
  }
});

test("only the same site may make changes", () => {
  assert.equal(sameOrigin("https://synclina.vercel.app", "synclina.vercel.app"), true);
  assert.equal(sameOrigin("https://evil.example", "synclina.vercel.app"), false);
  assert.equal(sameOrigin("https://synclina.vercel.app.evil.example", "synclina.vercel.app"), false);
  assert.equal(sameOrigin(null, "synclina.vercel.app"), false);
  assert.equal(sameOrigin("not a url", "synclina.vercel.app"), false);
});

test("the private address must be long and plain", () => {
  assert.equal(validAdminPath("a1b2c3d4e5f6a1b2c3d4e5f6"), true);
  assert.equal(validAdminPath("admin"), false);
  assert.equal(validAdminPath("../console/console/x"), false);
  assert.equal(validAdminPath(undefined), false);
});
