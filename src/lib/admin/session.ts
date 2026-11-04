import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminConfig } from "./config";
import { newToken, safeEqual, sha256 } from "./crypto";
import { db } from "./firebase";
import { SEEN_WRITE_EVERY_MS, SESSION_LIMIT_MS, sameOrigin, sessionAlive } from "./rules";

const COOKIE = "__Host-sl_session";

/** One admin, one session: signing in ends any earlier one. Only a hash of the cookie is stored. */
const sessionDoc = () => db().collection("admin_state").doc("session");

export async function startSession(): Promise<void> {
  const token = newToken();
  const now = Date.now();
  await sessionDoc().set({ tokenHash: sha256(token), createdAt: now, lastSeenAt: now });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_LIMIT_MS / 1000,
  });
}

export async function endSession(): Promise<void> {
  await sessionDoc().delete();
  (await cookies()).delete(COOKIE);
}

/** True when this request carries the live session. Checked once per request. */
export const hasSession = cache(async (): Promise<boolean> => {
  if (!adminConfig()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const snap = await sessionDoc().get();
  const data = snap.data();
  if (!data || !safeEqual(sha256(token), String(data.tokenHash))) return false;
  const now = Date.now();
  if (!sessionAlive(data.createdAt, data.lastSeenAt, now)) {
    await sessionDoc().delete();
    return false;
  }
  if (now - data.lastSeenAt > SEEN_WRITE_EVERY_MS) await sessionDoc().update({ lastSeenAt: now });
  return true;
});

export const adminBase = () => `/${adminConfig()?.path ?? ""}`;

/** For pages: anyone without the session goes back to the sign-in form. */
export async function requireSession(): Promise<void> {
  if (!(await hasSession())) redirect(adminBase());
}

/** For changes: same site only, JSON only. Returns the refusal, or null to carry on. */
export function refuseCrossSite(req: Request): Response | null {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!sameOrigin(req.headers.get("origin"), host)) return Response.json({ error: "Not allowed." }, { status: 403 });
  if (!req.headers.get("content-type")?.startsWith("application/json")) {
    return Response.json({ error: "Not allowed." }, { status: 415 });
  }
  return null;
}
