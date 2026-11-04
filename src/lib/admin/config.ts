import { validAdminPath } from "./rules";

export type AdminConfig = {
  path: string;
  passwordHash: string;
  totpSecret: string;
  recoveryHashes: string[];
  doorHash: string;
};

/**
 * Everything the admin area needs, or null when anything is missing. It is also null
 * on Vercel preview deployments, so they can never sign in even if a value leaks there.
 */
export function adminConfig(): AdminConfig | null {
  if (process.env.VERCEL_ENV === "preview") return null;
  const { ADMIN_PATH, ADMIN_PASSWORD_HASH, ADMIN_TOTP_SECRET, ADMIN_DOOR_HASH, ADMIN_RECOVERY_HASHES } = process.env;
  if (!validAdminPath(ADMIN_PATH) || !ADMIN_PASSWORD_HASH || !ADMIN_TOTP_SECRET || !ADMIN_DOOR_HASH) return null;
  return {
    path: ADMIN_PATH,
    passwordHash: ADMIN_PASSWORD_HASH,
    totpSecret: ADMIN_TOTP_SECRET,
    doorHash: ADMIN_DOOR_HASH,
    recoveryHashes: (ADMIN_RECOVERY_HASHES ?? "").split(",").filter(Boolean),
  };
}
