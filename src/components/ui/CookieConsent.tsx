"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { OPEN_CONSENT_EVENT, getConsent, openConsent, setConsent, type Consent } from "@/lib/consent";
import { onIntroDone } from "@/lib/scroll";
import styles from "./CookieConsent.module.css";

/** Asks once (after the intro), remembers the answer for ~6 months, reopens from the footer. */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Consent | null>(null);
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = getConsent();
    setCurrent(saved);
    const stop = saved ? () => {} : onIntroDone(() => window.setTimeout(() => setOpen(true), 900));
    const reopen = () => {
      setCurrent(getConsent());
      setOpen(true);
      requestAnimationFrame(() => first.current?.focus());
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => {
      stop();
      window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
    };
  }, []);

  const choose = (value: Consent) => {
    setConsent(value);
    setCurrent(value);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className={styles.banner} role="region" aria-label="Cookie preferences" data-floating>
      <p className={styles.title}>Cookies</p>
      <p className={styles.text}>
        We only use what the site needs to work. With your OK, we may also use privacy-friendly analytics to learn which
        pages are useful. No ads, and we never sell data.{" "}
        <Link href="/legal/drivsync/privacy" className={styles.link}>
          Privacy policy
        </Link>
      </p>
      {current && (
        <p className={styles.state}>Current choice: {current === "all" ? "analytics allowed" : "essential only"}</p>
      )}
      <div className={styles.actions}>
        <button ref={first} type="button" className="btn btn-ghost btn-sm" onClick={() => choose("essential")}>
          Essential only
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => choose("all")}>
          Accept all
        </button>
      </div>
    </div>
  );
}

/** Footer link that reopens the banner. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openConsent}>
      Cookie settings
    </button>
  );
}
