"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MARK_PATHS, MARK_VIEWBOX } from "@/components/brand/SynclinaMark";
import SynclinaWordmark from "@/components/brand/SynclinaWordmark";
import { INTRO_DONE_EVENT, prefersReducedMotion } from "@/lib/scroll";
import styles from "./Intro.module.css";

const SEEN_KEY = "synclina-intro-seen";

/** One door's artwork. Both doors render the same copy; each is clipped to its half. */
function Stage() {
  return (
    <div className={styles.stage}>
      <svg className={styles.mark} viewBox={MARK_VIEWBOX} aria-hidden="true">
        <defs>
          <linearGradient id="intro-grad" x1="380" y1="860" x2="930" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A12FF" />
            <stop offset="55%" stopColor="#7C22FF" />
            <stop offset="100%" stopColor="#C42BFF" />
          </linearGradient>
        </defs>
        {(["upper", "lower"] as const).map((k) => (
          <path
            key={k}
            data-intro={`piece-${k}`}
            d={MARK_PATHS[k]}
            fill="url(#intro-grad)"
            fillOpacity={0}
            stroke="url(#intro-grad)"
            strokeWidth={3}
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <div className={styles.word}>
        <SynclinaWordmark height={40} clip letterAttr="data-intro-char" className={styles.wordSvg} />
      </div>
      <p className={styles.tagline} data-intro="tagline">
        Ideas in sync.
      </p>
    </div>
  );
}

/**
 * First visit per session: two night doors carry the Synclina mark. The two pieces of the
 * S slide in and lock, the wordmark rises, a seam opens down the middle and the doors part.
 * The hero starts animating the moment the doors begin to open, so the intro hands straight
 * over to the page underneath. Skippable (button, Esc, Enter); never shown with reduced motion.
 */
export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    let released = false;

    // The page underneath takes over: hero lines rise, the 3D mark assembles.
    const release = () => {
      if (released) return;
      released = true;
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
      release();
      setGone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const q = (name: string) => gsap.utils.toArray<SVGPathElement>(`[data-intro="${name}"]`, el);
      const upper = q("piece-upper");
      const lower = q("piece-lower");
      const pieces = [...upper, ...lower];
      pieces.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const t = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => setGone(true) });
      tl.current = t;

      t.from(`.${styles.corner}`, { opacity: 0, y: 8, duration: 0.5, stagger: 0.08 }, 0)
        // 1. The two pieces of the S arrive from opposite sides, outlines drawing…
        .fromTo(upper, { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0.1)
        .fromTo(lower, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0.1)
        .to(pieces, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0.1)
        // 2. …and lock: the outline fills into the solid logo.
        .to(pieces, { fillOpacity: 1, strokeOpacity: 0, duration: 0.4, ease: "power2.out" }, 0.85)
        // 3. Wordmark rises letter by letter, the line follows.
        .from(gsap.utils.toArray("[data-intro-char]", el), { y: 90, duration: 0.7, stagger: 0.035, ease: "expo.out" }, 0.95)
        .fromTo(q("tagline"), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 1.25)
        // 4. A hairline seam opens down the middle.
        .addLabel("seam", 1.75)
        .fromTo(`.${styles.seam}`, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: "expo.inOut" }, "seam")
        // 5. The doors part and the page takes over.
        .addLabel("open", "seam+=0.35")
        .call(release, [], "open")
        .to(`.${styles.left}`, { xPercent: -52, rotateY: 8, duration: 1.05, ease: "power4.inOut" }, "open")
        .to(`.${styles.right}`, { xPercent: 52, rotateY: -8, duration: 1.05, ease: "power4.inOut" }, "open")
        .to(`.${styles.seam}`, { opacity: 0, duration: 0.3 }, "open+=0.1")
        .to([`.${styles.skip}`, `.${styles.corner}`], { opacity: 0, duration: 0.25 }, "open");
    }, el);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") skipNow();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      ctx.revert();
      release();
    };
  }, []);

  // Skipping jumps straight to the doors opening, then plays that part quickly.
  const skipNow = () => {
    const t = tl.current;
    if (!t) return;
    if (t.time() < t.labels.open) t.seek(t.labels.open - 0.01, false);
    t.timeScale(2);
  };

  if (gone) return null;

  return (
    <div ref={root} id="intro" className={styles.intro}>
      <div className={`${styles.door} ${styles.left}`} aria-hidden="true">
        <Stage />
      </div>
      <div className={`${styles.door} ${styles.right}`} aria-hidden="true">
        <Stage />
      </div>
      <div className={styles.seam} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerLeft}`} aria-hidden="true">
        Synclina · AI product studio
      </span>
      <span className={`${styles.corner} ${styles.cornerRight}`} aria-hidden="true">
        Hyderabad, India
      </span>
      <button type="button" className={styles.skip} onClick={skipNow}>
        Skip intro
      </button>
    </div>
  );
}
