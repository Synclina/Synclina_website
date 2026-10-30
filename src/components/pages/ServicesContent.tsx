"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Bot, Megaphone, Plug, Smartphone, Sparkles, Workflow } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { SERVICES, SERVICE_STEPS } from "@/lib/constants";
import styles from "./Pages.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ICONS = { workflow: Workflow, bot: Bot, megaphone: Megaphone, smartphone: Smartphone, plug: Plug, sparkles: Sparkles };

export default function ServicesContent() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      gsap.fromTo(
        `.${styles.stepsLine}`,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: `.${styles.steps}`, start: "top 75%", end: "bottom 60%", scrub: 0.6 } },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.serviceGrid}>
            {SERVICES.map((s, i) => {
              const Icon = ICONS[s.icon];
              return (
                <div key={s.title} className={styles.service} data-reveal data-reveal-delay={(i % 3) * 0.08}>
                  <div className={styles.serviceIcon}>
                    <Icon size={24} strokeWidth={1.6} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <header className="section-header">
            <span className="section-label" data-reveal>
              How it works
            </span>
            <h2 data-reveal data-reveal-delay="0.1">
              Four steps to <span className="text-gradient">done.</span>
            </h2>
          </header>
          <div className={styles.steps}>
            <div className={styles.stepsTrack} aria-hidden="true">
              <div className={styles.stepsLine} />
            </div>
            {SERVICE_STEPS.map((s, i) => (
              <div key={s.title} className={styles.step} data-reveal data-reveal-delay={i * 0.1}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
