"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MARK_PATHS, MARK_VIEWBOX } from "@/components/brand/SynclinaMark";
import SynclinaWordmark from "@/components/brand/SynclinaWordmark";
import { INTRO_DONE_EVENT, prefersReducedMotion } from "@/lib/scroll";
import styles from "./DoorIntro.module.css";

const SEEN_KEY = "synclina-intro-seen";

/** One door's artwork. Both doors render an identical copy; each is clipped to its half. */
function Stage() {
  return (
    <div className={styles.stage}>
      <div className={styles.glow} data-intro="glow" />
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

      <div className={styles.word} aria-hidden="true">
        <SynclinaWordmark height={56} clip letterAttr="data-intro-char" className={styles.wordSvg} />
      </div>
      <div className={styles.tagline} data-intro="tagline">
        IDEAS IN <span>SYNC</span>.
      </div>

      <div className={`${styles.corner} ${styles.cornerLeft}`} data-intro="corner">
        SYNCLINA — AI PRODUCT STUDIO
      </div>
      <div className={`${styles.corner} ${styles.cornerRight}`} data-intro="corner">
        <span data-intro="counter">000</span>
      </div>
    </div>
  );
}

export default function DoorIntro() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const site = document.getElementById("site");
    const html = document.documentElement;

    const finish = () => {
      html.dataset.intro = "done";
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setDone(true);
    };

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    // The intro plays once per session; reduced-motion users never see it.
    if (seen || prefersReducedMotion()) {
      gsap.to(el, { autoAlpha: 0, duration: 0.25, onComplete: finish });
      return;
    }
    const speed = 1.45;

    const ctx = gsap.context(() => {
      const q = (name: string) => gsap.utils.toArray<Element>(`[data-intro="${name}"]`, el);
      const upper = q("piece-upper") as SVGPathElement[];
      const lower = q("piece-lower") as SVGPathElement[];
      [...upper, ...lower].forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const counter = { v: 0 };
      const counters = q("counter");

      if (site) gsap.set(site, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
      tlRef.current = tl;
      tl.timeScale(speed);

      tl.from(q("corner"), { opacity: 0, y: 10, duration: 0.6, stagger: 0.1 }, 0)
        .to(counter, {
          v: 100,
          duration: 2.6,
          ease: "power2.inOut",
          onUpdate: () => counters.forEach((c) => (c.textContent = String(Math.round(counter.v)).padStart(3, "0"))),
        }, 0)
        // 1. The two strokes of the S arrive from opposite sides…
        .fromTo(upper, { x: -140, opacity: 0 }, { x: 0, opacity: 1, duration: 1.3, ease: "expo.out" }, 0.15)
        .fromTo(lower, { x: 140, opacity: 0 }, { x: 0, opacity: 1, duration: 1.3, ease: "expo.out" }, 0.15)
        .to([...upper, ...lower], { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0.15)
        // 2. …and lock into sync.
        .to([...upper, ...lower], { fillOpacity: 1, strokeOpacity: 0, duration: 0.6, ease: "power2.out" }, 1.2)
        .fromTo(q("glow"), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "expo.out" }, 1.1)
        .to(el.querySelectorAll(`.${styles.mark}`), { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.inOut" }, 1.3)
        // 3. Wordmark rises in.
        .from(gsap.utils.toArray("[data-intro-char]", el), { y: 95, duration: 0.9, stagger: 0.045, ease: "expo.out" }, 1.45)
        .fromTo(q("tagline"), { opacity: 0, letterSpacing: "0.9em" }, { opacity: 1, letterSpacing: "0.42em", duration: 1.1, ease: "expo.out" }, 1.8)
        // 4. A seam of light splits the door.
        .addLabel("seam", 2.75)
        .fromTo(`.${styles.seam}`, { scaleY: 0, opacity: 1 }, { scaleY: 1, duration: 0.55, ease: "expo.inOut" }, "seam")
        .to(`.${styles.edge}`, { opacity: 1, duration: 0.3 }, "seam+=0.35")
        .to(`.${styles.leak}`, { opacity: 1, duration: 0.4 }, "seam+=0.4")
        // 5. Doors slide apart — half the logo to each side.
        .addLabel("open", "seam+=0.7")
        .to(`.${styles.left}`, { xPercent: -58, rotateY: 10, duration: 1.45, ease: "power4.inOut" }, "open")
        .to(`.${styles.right}`, { xPercent: 58, rotateY: -10, duration: 1.45, ease: "power4.inOut" }, "open")
        .to(`.${styles.seam}`, { scaleX: 24, opacity: 0, duration: 0.9, ease: "power2.out" }, "open+=0.1")
        .to(`.${styles.leak}`, { scaleX: 6, opacity: 0, duration: 1.2, ease: "power2.out" }, "open+=0.2");

      if (site) {
        tl.to(site, { opacity: 1, duration: 1.2, ease: "power2.out", clearProps: "opacity" }, "open+=0.1");
      }
    }, el);

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") tlRef.current?.timeScale(4);
    };
    window.addEventListener("keydown", skip);

    return () => {
      window.removeEventListener("keydown", skip);
      ctx.revert();
      if (site) gsap.set(site, { clearProps: "opacity" });
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} id="intro" className={styles.intro} role="presentation">
      <div className={styles.leak} aria-hidden="true" />
      <div className={`${styles.door} ${styles.left}`}>
        <Stage />
        <span className={styles.edge} />
      </div>
      <div className={`${styles.door} ${styles.right}`}>
        <Stage />
        <span className={styles.edge} />
      </div>
      <div className={styles.seam} aria-hidden="true" />
      <button className={styles.skip} onClick={() => tlRef.current?.timeScale(4)}>
        Skip intro
      </button>
    </div>
  );
}
