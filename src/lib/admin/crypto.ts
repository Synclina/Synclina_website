import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Secrets are stored as "scrypt:<log2 N>:<r>:<p>:<salt>:<hash>" (base64url, no "$",
 * which .env files would try to expand). Keep this file free of imports from the
 * app: the setup script and the tests load it directly.
 */
const KEY_LENGTH = 32;

function derive(secret: string, salt: Buffer, logN: number, r: number, p: number): Promise<Buffer> {
  const N = 2 ** logN;
  return new Promise((resolve, reject) => {
    scrypt(secret.normalize("NFKC"), salt, KEY_LENGTH, { N, r, p, maxmem: 256 * N * r }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

export async function hashSecret(secret: string, logN = 17): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(secret, salt, logN, 8, 1);
  return ["scrypt", logN, 8, 1, salt.toString("base64url"), key.toString("base64url")].join(":");
}

export async function verifySecret(secret: string, stored: string): Promise<boolean> {
  const [kind, logN, r, p, salt, key] = stored.split(":");
  if (kind !== "scrypt" || !salt || !key) return false;
  const expected = Buffer.from(key, "base64url");
  const actual = await derive(secret, Buffer.from(salt, "base64url"), Number(logN), Number(r), Number(p));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const newToken = () => randomBytes(32).toString("base64url");

export const sha256 = (value: string) => createHash("sha256").update(value).digest("base64url");

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(sha256(a));
  const y = Buffer.from(sha256(b));
  return timingSafeEqual(x, y);
}

/** A one-time recovery code such as "7K2QM-9XRT4". */
export function newRecoveryCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(10);
  const text = Array.from(bytes, (b) => chars[b % chars.length]).join("");
  return `${text.slice(0, 5)}-${text.slice(5)}`;
}

export const normalizeRecoveryCode = (code: string) => code.trim().toUpperCase().replace(/\s+/g, "");
