"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll";
import styles from "./Approach.module.css";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "AI should simplify everyday life. We build apps people open daily and automations businesses forget are running.";

/** The belief, stated once. Words light up as you scroll; then "simplify" gets its underline. */
export default function Approach() {
  const text = useRef<HTMLParagraphElement>(null);
  const underline = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = text.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      underline.current?.classList.add(styles.drawn);
      return;
    }
    const words = gsap.utils.toArray<HTMLElement>("[data-w]", el);
    const tween = gsap.fromTo(
      words,
      { opacity: 0.18 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 40%",
          scrub: true,
          onLeave: () => underline.current?.classList.add(styles.drawn),
          onEnterBack: () => underline.current?.classList.remove(styles.drawn),
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className={`surface-night section ${styles.approach}`}>
      <div className="container">
        <p className="eyebrow">Approach</p>
        <p ref={text} className={styles.statement}>
          {STATEMENT.split(" ").map((w, i) => {
            const isKey = w === "simplify";
            return (
              <span key={i}>
                <span data-w className={isKey ? styles.key : undefined}>
                  {w}
                  {isKey && <span ref={underline} className={styles.underline} aria-hidden="true" />}
                </span>{" "}
              </span>
            );
          })}
        </p>
        <p className={styles.facts}>Own products. Custom builds. Privacy first.</p>
      </div>
    </section>
  );
}
