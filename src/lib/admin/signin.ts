import { adminConfig } from "./config";
import { auditFields, auditLog } from "./audit";
import { normalizeRecoveryCode, sha256, verifySecret } from "./crypto";
import { db } from "./firebase";
import { lockAfter } from "./rules";
import { matchTotp } from "./totp";

type Guard = { fails?: number; lockedUntil?: number; lastTotpStep?: number; usedRecovery?: string[] };

const guardDoc = () => db().collection("admin_state").doc("guard");

export type SignInResult = { outcome: "ok" | "wrong" | "locked"; usedRecovery?: boolean; lockedNow?: boolean };

/** Checks password and code together, counted in Firestore so it holds across server instances. */
export async function checkSignIn(password: string, code: string, place: string): Promise<SignInResult> {
  const cfg = adminConfig();
  if (!cfg) return { outcome: "wrong" };
  const now = Date.now();
  const before = ((await guardDoc().get()).data() ?? {}) as Guard;
  if ((before.lockedUntil ?? 0) > now) return { outcome: "locked" };

  const passwordOk = await verifySecret(password, cfg.passwordHash);
  const totpStep = matchTotp(cfg.totpSecret, code.trim(), now, before.lastTotpStep ?? 0);
  const recoveryHash = sha256(normalizeRecoveryCode(code));
  const recoveryOk =
    totpStep === null && cfg.recoveryHashes.includes(recoveryHash) && !(before.usedRecovery ?? []).includes(recoveryHash);

  return db().runTransaction(async (tx) => {
    const ref = guardDoc();
    const guard = ((await tx.get(ref)).data() ?? {}) as Guard;
    // Checked again inside the transaction, so one code can't be used twice at the same moment.
    const stillFresh =
      totpStep !== null ? totpStep > (guard.lastTotpStep ?? 0) : recoveryOk && !(guard.usedRecovery ?? []).includes(recoveryHash);

    if (passwordOk && stillFresh) {
      tx.set(ref, {
        fails: 0,
        lockedUntil: 0,
        lastTotpStep: totpStep ?? guard.lastTotpStep ?? 0,
        usedRecovery: recoveryOk ? [...(guard.usedRecovery ?? []), recoveryHash] : guard.usedRecovery ?? [],
      });
      tx.create(auditLog().doc(), auditFields(recoveryOk ? "Signed in with a recovery code" : "Signed in", place));
      return { outcome: "ok" as const, usedRecovery: recoveryOk };
    }

    const fails = (guard.fails ?? 0) + 1;
    const lock = lockAfter(fails);
    tx.set(ref, { ...guard, fails, lockedUntil: lock ? now + lock : 0 });
    tx.create(auditLog().doc(), auditFields(lock ? "Sign-in locked after wrong tries" : "Wrong sign-in try", place));
    return { outcome: "wrong" as const, lockedNow: lock > 0 };
  });
}
