"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ribbon from "@/components/brand/Ribbon";
import SynclinaWordmark from "@/components/brand/SynclinaWordmark";
import { INTRO_DONE_EVENT, prefersReducedMotion } from "@/lib/scroll";
import styles from "./Intro.module.css";

const SEEN_KEY = "synclina-intro-seen";

/**
 * First visit only, 1.4s at most: the ribbon draws itself, the wordmark fades in,
 * and the overlay lifts off a hero that is already rendered underneath.
 */
export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const timers: number[] = [];

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      html.dataset.intro = "done";
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      ScrollTrigger.refresh();
    };

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}

    if (seen || prefersReducedMotion()) {
      finish();
      setGone(true);
      return;
    }

    // 0-900ms ribbon draws, 600-900ms wordmark fades, 900-1400ms overlay lifts
    el.classList.add(styles.play);
    timers.push(window.setTimeout(finish, 900));
    timers.push(window.setTimeout(() => setGone(true), 1400));

    const skip = (e: KeyboardEvent) => e.key === "Escape" && lift();
    const lift = () => {
      el.classList.add(styles.lifting);
      finish();
      timers.push(window.setTimeout(() => setGone(true), 500));
    };
    (el as HTMLDivElement & { lift?: () => void }).lift = lift;
    window.addEventListener("keydown", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} id="intro" className={styles.intro} aria-hidden="false">
      <button
        className={styles.skip}
        onClick={() => (root.current as (HTMLDivElement & { lift?: () => void }) | null)?.lift?.()}
      >
        Skip intro
      </button>
      <div className={styles.center} aria-hidden="true">
        <Ribbon size={120} className={styles.ribbon} pathAttr="data-stroke" />
        <SynclinaWordmark height={16} className={styles.word} />
      </div>
    </div>
  );
}
