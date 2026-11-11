/**
 * Cookie consent, stored in a first-party cookie so the server can read it too.
 *
 * "essential": only what the site needs to work (this cookie itself, session storage for the intro).
 * "all":       essential + analytics. Anything non-essential (analytics, pixels, embeds that track)
 *              must check `hasConsent("analytics")` before it loads.
 */

export type Consent = "all" | "essential";

export const CONSENT_COOKIE = "synclina_consent";
export const CONSENT_EVENT = "synclina:consent";
export const OPEN_CONSENT_EVENT = "synclina:open-consent";

/* Bump when the categories change, so everyone is asked again */
const VERSION = "1";
const MAX_AGE = 60 * 60 * 24 * 180; // ask again after ~6 months

export function getConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(CONSENT_COOKIE + "="))
    ?.slice(CONSENT_COOKIE.length + 1);
  if (!raw) return null;
  const [version, value] = decodeURIComponent(raw).split(":");
  return version === VERSION && (value === "all" || value === "essential") ? value : null;
}

export function setConsent(value: Consent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(`${VERSION}:${value}`)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }));
}

export const hasConsent = (category: "analytics") => category === "analytics" && getConsent() === "all";

/** Reopen the banner (footer "Cookie settings"). */
export const openConsent = () => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
