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
  const company = str(body.company, 120);
  const budget = str(body.budget, 60);
  const timeline = str(body.timeline, 60);

  if (!name || !EMAIL.test(email) || message.length < 10) {
    return Response.json({ error: "Please fill in your name, a valid email and a message (10+ characters)." }, { status: 422 });
  }

  // Delivers to the inbox through Brevo's "Website enquiry" template, so mail from the
  // site is easy to tell apart (subject starts with [Website], tagged website-contact).
  const key = process.env.BREVO_API_KEY;
  const templateId = Number(process.env.BREVO_TEMPLATE_ID);
  if (key && templateId) {
    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        templateId,
        to: [{ email: process.env.CONTACT_TO ?? SITE.email, name: "Synclina" }],
        replyTo: { email, name },
        tags: ["website-contact"],
        params: { name, email, topic: category, company, budget, timeline, message, submitted_at: `${submittedAt} IST` },
      }),
    });
    if (!res.ok) {
      console.error("[contact] Brevo failed:", res.status, await res.text());
      return Response.json({ error: "We couldn't send your message right now. Please email us directly." }, { status: 502 });
    }
    return Response.json({ ok: true, delivered: true });
  }

  // No mail service configured: the client falls back to a prefilled mailto: link.
  console.log("[contact] New message (BREVO_API_KEY not set):", { name, email, category, company, budget, timeline, message });
  return Response.json({ ok: true, delivered: false });
}
