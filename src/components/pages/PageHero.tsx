"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Pages.module.css";

gsap.registerPlugin(useGSAP);

/** Shared hero for secondary pages: label + big headline that rises in word by word. */
export default function PageHero({ label, title, accent, lead }: { label: string; title: string; accent: string; lead: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: "expo.out" }, delay: 0.35 })
        .from("[data-w]", { yPercent: 110, duration: 1.2, stagger: 0.06 })
        .from("[data-fade]", { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, 0.3);
    },
    { scope: root },
  );

  const words = (text: string, cls?: string) =>
    text.split(" ").map((w, i) => (
      <span key={i} className={styles.wordMask}>
        <span data-w className={cls}>
          {w}
        </span>
      </span>
    ));

  return (
    <section ref={root} className={styles.hero}>
      <div className={`glow-orb glow-orb--purple ${styles.heroOrb}`} aria-hidden="true" />
      <div className="container">
        <span className="section-label" data-fade>
          {label}
        </span>
        <h1 className={styles.title}>
          {words(title)}
          {words(accent, "text-gradient")}
        </h1>
        <p className={styles.lead} data-fade>
          {lead}
        </p>
      </div>
    </section>
  );
}
