"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "./Footer.module.css";

const SignInCard = dynamic(() => import("@/components/console/SignInForm").then((m) => m.SignInCard), { ssr: false });

const TAPS = 7;
const WITHIN_MS = 4000;

/** The footer's copyright line. */
export default function Copyright() {
  const taps = useRef<number[]>([]);
  const [open, setOpen] = useState(false);

  const tapped = async () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < WITHIN_MS), now];
    if (taps.current.length < TAPS) return;
    taps.current = [];
    setOpen(true);
    try {
      // Already signed in on this browser: straight in, without using up a code.
      const { to } = (await (await fetch("/api/door")).json()) as { to?: string };
      if (to) window.location.assign(to);
    } catch {
      // The form is showing.
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <span className={styles.copyright} onClick={tapped}>
        © {new Date().getFullYear()} Synclina. All rights reserved.
      </span>
      {open && (
        <div className={styles.doorBackdrop} onClick={() => setOpen(false)}>
          <div className={styles.doorCard} onClick={(e) => e.stopPropagation()}>
            <SignInCard endpoint="/api/door" />
          </div>
        </div>
      )}
    </>
  );
}
