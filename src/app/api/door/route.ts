import { adminConfig } from "@/lib/admin/config";
import { verifySecret } from "@/lib/admin/crypto";

export const runtime = "nodejs";

/** Best effort per server instance; the sign-in itself is limited in Firestore. */
const tries = new Map<string, { count: number; since: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_TRIES = 8;

function tooMany(ip: string, now: number): boolean {
  if (tries.size > 5000) tries.clear();
  const entry = tries.get(ip);
  if (!entry || now - entry.since > WINDOW_MS) {
    tries.set(ip, { count: 1, since: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_TRIES;
}

export async function POST(req: Request) {
  const nothing = Response.json({});
  const cfg = adminConfig();
  if (!cfg) return nothing;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";
  if (tooMany(ip, Date.now())) return nothing;
  let word: unknown;
  try {
    word = ((await req.json()) as { word?: unknown }).word;
  } catch {
    return nothing;
  }
  if (typeof word !== "string" || !word || word.length > 200) return nothing;
  return (await verifySecret(word.trim(), cfg.doorHash)) ? Response.json({ to: `/${cfg.path}` }) : nothing;
}
