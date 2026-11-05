import { after } from "next/server";
import { adminConfig } from "@/lib/admin/config";
import { requestPlace, sendAlert } from "@/lib/admin/alerts";
import { refuseCrossSite, startSession } from "@/lib/admin/session";
import { checkSignIn } from "@/lib/admin/signin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const whenIndia = () =>
  new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

export async function POST(req: Request) {
  const refused = refuseCrossSite(req);
  if (refused) return refused;
  if (!adminConfig()) return new Response(null, { status: 404 });

  let password: unknown, code: unknown;
  try {
    ({ password, code } = (await req.json()) as { password?: unknown; code?: unknown });
  } catch {
    return Response.json({ error: "Not allowed." }, { status: 400 });
  }
  if (typeof password !== "string" || typeof code !== "string" || password.length > 200 || code.length > 20) {
    return Response.json({ error: "That didn't work. Check both and try again." }, { status: 401 });
  }

  try {
    const place = requestPlace(req.headers);
    const result = await checkSignIn(password, code, place);
    if (result.outcome === "ok") {
      await startSession();
      // Sent after answering, so the email never slows signing in.
      after(() =>
        sendAlert("Synclina admin: someone signed in", [
          `Signed in at ${whenIndia()} IST, from ${place}.`,
          result.usedRecovery ? "A recovery code was used. It can't be used again." : "",
          "If this wasn't you, change the password and the authenticator key in Vercel straight away.",
        ]),
      );
      return Response.json({ ok: true });
    }
    if (result.lockedNow) {
      after(() =>
        sendAlert("Synclina admin: sign-in locked", [
          `Too many wrong tries at ${whenIndia()} IST, from ${place}. Sign-in is locked for a while.`,
        ]),
      );
    }
    if (result.outcome === "locked" || result.lockedNow) {
      return Response.json({ error: "Too many wrong tries. Please try again later." }, { status: 429 });
    }
    return Response.json({ error: "That didn't work. Check both and try again." }, { status: 401 });
  } catch (e) {
    console.error("[login] failed", e instanceof Error ? e.message : "error");
    return Response.json({ error: "Sign-in isn't available right now." }, { status: 503 });
  }
}
