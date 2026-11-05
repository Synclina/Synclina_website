// Creates the admin area's secrets on this computer. Run it yourself: npm run admin:setup
// It writes .env.admin (never committed) with the values for Vercel.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
import QRCode from "qrcode";
import { hashSecret, newRecoveryCode, normalizeRecoveryCode, sha256 } from "../src/lib/admin/crypto.ts";
import { newTotpSecret, otpauthUrl } from "../src/lib/admin/totp.ts";

const OUTPUT = ".env.admin";
const FIREBASE_PROJECT = "drivsync-2034b";

if (existsSync(OUTPUT)) {
  console.error(`${OUTPUT} already exists. Delete it first if you want new secrets.`);
  process.exit(1);
}

/** Reads a line without showing what is typed. */
function askHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const input = process.stdin;
    input.setRawMode?.(true);
    input.resume();
    input.setEncoding("utf8");
    let text = "";
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n") {
          input.setRawMode?.(false);
          input.pause();
          input.off("data", onData);
          process.stdout.write("\n");
          resolve(text);
          return;
        }
        if (ch === "\u0003") process.exit(1);
        text = ch === "\b" || ch === "\u007f" ? text.slice(0, -1) : text + ch;
      }
    };
    input.on("data", onData);
  });
}

async function askTwice(what, minimum) {
  for (;;) {
    const first = await askHidden(`Choose your ${what} (at least ${minimum} characters): `);
    if (first.length < minimum) {
      console.log(`Too short. It needs at least ${minimum} characters.`);
      continue;
    }
    if ((await askHidden("Type it again: ")) === first) return first;
    console.log("They didn't match. Try again.");
  }
}

const password = await askTwice("admin password", 14);

const rl = createInterface({ input: process.stdin, output: process.stdout });
const keyPath = (await rl.question("Path of the Firebase key file (press Enter to add it later): ")).trim().replace(/^"|"$/g, "");
rl.close();

let keyLine = "FIREBASE_SERVICE_ACCOUNT_B64=";
if (keyPath) {
  const text = readFileSync(keyPath, "utf8");
  const key = JSON.parse(text);
  if (key.project_id !== FIREBASE_PROJECT) console.log(`Careful: this key is for "${key.project_id}", not ${FIREBASE_PROJECT}.`);
  keyLine = `FIREBASE_SERVICE_ACCOUNT_B64=${Buffer.from(text).toString("base64")}`;
}

console.log("Working…");
const totp = newTotpSecret();
const recovery = Array.from({ length: 8 }, newRecoveryCode);
const path = randomBytes(12).toString("hex");

writeFileSync(
  OUTPUT,
  [
    `ADMIN_PATH=${path}`,
    `ADMIN_PASSWORD_HASH=${await hashSecret(password)}`,
    `ADMIN_TOTP_SECRET=${totp}`,
    `ADMIN_RECOVERY_HASHES=${recovery.map((c) => sha256(normalizeRecoveryCode(c))).join(",")}`,
    keyLine,
    "",
  ].join("\n"),
  { mode: 0o600 },
);

const url = otpauthUrl(totp, "admin", "Synclina");
console.log("\n1. Scan this with your authenticator app (Google Authenticator, Authy…):\n");
console.log(await QRCode.toString(url, { type: "terminal", small: true }));
console.log(`   Can't scan it? Enter this key by hand: ${totp}\n`);
console.log("2. Save these recovery codes somewhere safe. Each one works once, if you lose your phone:\n");
for (const code of recovery) console.log(`   ${code}`);
console.log(`\n3. Your private admin address: https://synclina.vercel.app/${path}`);
console.log(`\n4. Add the contents of ${OUTPUT} to Vercel, for Production only. Then delete ${OUTPUT}.\n`);
