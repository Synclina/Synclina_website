"use client";

import { useRef } from "react";
import { Activity, BrainCircuit, ShieldCheck, Workflow } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useReveal } from "@/hooks/useReveal";
import { PILLARS, STATS } from "@/lib/constants";
import styles from "./TechSection.module.css";

const ICONS = { brain: BrainCircuit, workflow: Workflow, activity: Activity, shield: ShieldCheck };

function Pillar({ pillar, i }: { pillar: (typeof PILLARS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = ICONS[pillar.icon];
  return (
    <div ref={ref} className={styles.pillarWrap} data-reveal data-reveal-delay={i * 0.1}>
      <div className={styles.pillar}>
        <div className={styles.iconWrap}>
          <Icon size={26} strokeWidth={1.6} />
        </div>
        <h3>{pillar.title}</h3>
        <p>{pillar.description}</p>
        <span className={styles.num}>0{i + 1}</span>
      </div>
    </div>
  );
}

export default function TechSection({ bare = false }: { bare?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="tech" className={`section ${styles.tech}`}>
      <div className={styles.streams} aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} style={{ left: `${(i + 0.5) * (100 / 14)}%`, animationDelay: `${(i * 0.73) % 5}s`, animationDuration: `${4 + (i % 4)}s` }} />
        ))}
      </div>

      <div className="container">
        {!bare && (
        <header className="section-header">
          <span className="section-label" data-reveal>
            Technology &amp; AI DNA
          </span>
          <h2 data-reveal data-reveal-delay="0.1">
            Built on four <span className="text-gradient">pillars.</span>
          </h2>
          <p data-reveal data-reveal-delay="0.2">
            Every product we ship shares the same core: intelligence that helps, automation that frees you, and respect for
            your data.
          </p>
        </header>
        )}

        <div className={styles.pillars}>
          {PILLARS.map((p, i) => (
            <Pillar key={p.title} pillar={p} i={i} />
          ))}
        </div>

        <div className={styles.stats}>
          {STATS.map((s, i) => (
            <div key={s.label} className={styles.stat} data-reveal data-reveal-delay={i * 0.08}>
              <strong>
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
