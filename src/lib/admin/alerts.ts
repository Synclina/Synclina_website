import { SITE } from "../constants";

/** Emails the owner about a sign-in or a lockout. A failed email never blocks anything. */
export async function sendAlert(subject: string, lines: string[]): Promise<void> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return;
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Synclina security", email: process.env.ADMIN_ALERT_SENDER ?? SITE.email },
        to: [{ email: process.env.ADMIN_ALERT_TO ?? SITE.email }],
        subject,
        textContent: lines.join("\n"),
        tags: ["admin-alert"],
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) console.error("[alert] Brevo answered", res.status);
  } catch (e) {
    console.error("[alert] not sent", e instanceof Error ? e.name : "error");
  }
}

/** Who made a request, for the alert email and the activity log. */
export function requestPlace(headers: Headers): string {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown address";
  const city = headers.get("x-vercel-ip-city");
  return city ? `${ip} (${decodeURIComponent(city)})` : ip;
}
