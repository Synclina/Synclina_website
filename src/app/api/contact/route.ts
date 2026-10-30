import { SITE } from "@/lib/constants";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → silently accept and drop
  if (str(body.website, 200)) return Response.json({ ok: true, delivered: true });

  const name = str(body.name, 100);
  const email = str(body.email, 200);
  const category = str(body.category, 100);
  const message = str(body.message, 5000);
  const extras = [
    ["Company", str(body.company, 120)],
    ["Budget", str(body.budget, 60)],
    ["Timeline", str(body.timeline, 60)],
  ].filter(([, v]) => v);

  if (!name || !EMAIL.test(email) || message.length < 10) {
    return Response.json({ error: "Please fill in your name, a valid email and a message (10+ characters)." }, { status: 422 });
  }

  // Delivers straight to the inbox via Resend when RESEND_API_KEY is configured.
  const key = process.env.RESEND_API_KEY;
  if (key) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Synclina Website <onboarding@resend.dev>",
        to: process.env.CONTACT_TO ?? SITE.email,
        reply_to: email,
        subject: `[Synclina] ${category} — ${name}`,
        text: [`From: ${name} <${email}>`, `Topic: ${category}`, ...extras.map(([k, v]) => `${k}: ${v}`), "", message].join("\n"),
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend failed:", res.status, await res.text());
      return Response.json({ error: "We couldn't send your message right now. Please email us directly." }, { status: 502 });
    }
    return Response.json({ ok: true, delivered: true });
  }

  // No mail service configured: the client falls back to a prefilled mailto: link.
  console.log("[contact] New message (RESEND_API_KEY not set):", { name, email, category, extras, message });
  return Response.json({ ok: true, delivered: false });
}
