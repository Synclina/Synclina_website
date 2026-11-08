"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCTS, formatUpdateDate, latestUpdates, productBySlug, SITE } from "@/lib/constants";
import { useInView } from "@/hooks/useInView";
import { prefersReducedMotion } from "@/lib/scroll";
import styles from "./ProofStrip.module.css";

const latest = latestUpdates(1)[0];

/** Counts up to a true number once, 1.2s ease-out. */
function Count({ to, run }: { to: number; run: boolean }) {
  const [v, setV] = useState(to);
  const started = useRef(false);
  useEffect(() => {
    if (!run || started.current || prefersReducedMotion()) return;
    started.current = true;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1200);
      setV(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    setV(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{v}</>;
}

/** Facts a visitor can check, read from the same data as the build log. */
export default function ProofStrip() {
  const root = useRef<HTMLElement>(null);
  const seen = useInView(root, 0.3, true);

  const facts = [
    { value: <Count to={PRODUCTS.length} run={seen} />, label: "products in development" },
    {
      value: latest ? formatUpdateDate(latest.date) : "—",
      label: latest ? `latest update · ${productBySlug(latest.product)?.title}` : "latest update",
    },
    { value: SITE.location.split(",")[0], label: "studio base" },
    { value: "Public", label: "privacy policy, terms and account deletion" },
  ];

  return (
    <section ref={root} className={`surface-paper ${styles.proof}`} aria-label="Facts about Synclina">
      <div className={`container ${styles.grid}`}>
        {facts.map((f, i) => (
          <div key={i} className={styles.fact} style={{ "--i": i } as React.CSSProperties}>
            <span className={styles.value}>{f.value}</span>
            <span className={styles.label}>{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
