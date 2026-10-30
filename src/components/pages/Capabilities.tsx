"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { CAPABILITIES } from "@/lib/constants";
import styles from "./Pages.module.css";

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section ref={root} className="section">
      <div className="container">
        <header className="section-header">
          <span className="section-label" data-reveal>
            What we build with
          </span>
          <h2 data-reveal data-reveal-delay="0.1">
            From idea to <span className="text-gradient">production.</span>
          </h2>
        </header>
        <div className={styles.capGrid}>
          {CAPABILITIES.map((c, i) => (
            <div key={c.title} className={styles.cap} data-reveal data-reveal-delay={(i % 3) * 0.08}>
              <span className={styles.capNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
