"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReveal } from "@/hooks/useReveal";
import { TIMELINE } from "@/lib/constants";
import styles from "./TimelineSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function TimelineSection({ bare = false }: { bare?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      // The glowing progress line draws itself as you scroll
      gsap.fromTo(
        `.${styles.progress}`,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: `.${styles.track}`, start: "top 65%", end: "bottom 65%", scrub: 0.6 },
        },
      );

      gsap.utils.toArray<HTMLElement>(`.${styles.item}`).forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 65%",
          onEnter: () => item.classList.add(styles.active),
          onLeaveBack: () => item.classList.remove(styles.active),
        });
        gsap.from(item.querySelector(`.${styles.body}`), {
          x: item.dataset.side === "left" ? -60 : 60,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="journey" className="section">
      <div className="container">
        {!bare && (
        <header className="section-header">
          <span className="section-label" data-reveal>
            The journey
          </span>
          <h2 data-reveal data-reveal-delay="0.1">
            Just getting <span className="text-gradient">started.</span>
          </h2>
          <p data-reveal data-reveal-delay="0.2">
            From a single idea to a growing family of products — here&apos;s where we&apos;ve been and where we&apos;re headed.
          </p>
        </header>
        )}

        <div className={styles.track}>
          <div className={styles.rail} aria-hidden="true">
            <div className={styles.progress} />
          </div>
          <ol>
            {TIMELINE.map((m, i) => (
              <li key={m.title} className={styles.item} data-side={i % 2 ? "right" : "left"}>
                <span className={styles.node} aria-hidden="true" />
                <div className={styles.body}>
                  <span className={styles.date}>{m.date}</span>
                  <h3>{m.title}</h3>
                  <p>{m.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
