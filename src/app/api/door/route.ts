import { adminConfig } from "@/lib/admin/config";
import { handleSignIn } from "@/lib/admin/login";
import { hasSession } from "@/lib/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Best effort per server instance, so one visitor can't use up the shared lock below. */
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

/** Already signed in: the address, so the box needn't ask again. Otherwise nothing. */
export async function GET() {
  const cfg = adminConfig();
  try {
    if (cfg && (await hasSession())) return Response.json({ to: `/${cfg.path}/home` });
  } catch {
    // Ask for the password as usual.
  }
  return Response.json({});
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";
  if (tooMany(ip, Date.now())) {
    return Response.json({ error: "Too many wrong tries. Please try again later." }, { status: 429 });
  }
  return handleSignIn(req);
}
