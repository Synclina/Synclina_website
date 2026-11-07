"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTS, stageLevel, type Product } from "@/lib/constants";
import { useInView } from "@/hooks/useInView";
import { CreatorPipeline, DrivSyncDevice, TravelConverge } from "./ProductGraphics";
import styles from "./ProductChapters.module.css";

gsap.registerPlugin(ScrollTrigger);

const GRAPHICS: Record<string, (p: { active: boolean }) => React.ReactNode> = {
  drivsync: ({ active }) => <DrivSyncDevice active={active} />,
  "creator-growth": () => <CreatorPipeline />,
  travel: () => <TravelConverge />,
};

/** One concrete sentence per product: what it does, not how it feels. */
const DOES: Record<string, string> = {
  drivsync: "Fuel, expenses, service, paperwork, rides and safety tools for drivers and riders, with an AI Copilot.",
  "creator-growth": "Automation and insights for creators and small businesses.",
  travel: "Plan trips together and split expenses.",
};

function Chapter({ product, index, pinned, active }: { product: Product; index: number; pinned: boolean; active: number }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, 0.35);
  const on = pinned ? active === index : seen;
  const level = stageLevel(product.status);
  const Graphic = GRAPHICS[product.slug];

  return (
    <article ref={ref} className={`${styles.item} ${on ? styles.on : ""}`} data-chapter={index}>
      <div className={styles.text} data-chapter-text>
        <p className={styles.code}>
          <span>{String(index + 1).padStart(2, "0")}</span> / {String(PRODUCTS.length).padStart(2, "0")}
        </p>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.tagline}>{product.tagline}</p>
        <p className={styles.does}>{DOES[product.slug] ?? product.summary}</p>

        <div className={styles.meter} style={{ "--level": level / 100 } as React.CSSProperties}>
          <div className={styles.meterHead}>
            <span>Stage</span>
            <span>{product.status}</span>
          </div>
          <div className={styles.track} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={level} aria-label={`${product.title} stage: ${product.status}`}>
            <i />
          </div>
        </div>

        <Link href={`/products/${product.slug}`} className={styles.more}>
          Release info and updates <ArrowRight size={16} />
        </Link>
      </div>

      <div className={styles.visual} data-chapter-visual>
        {Graphic ? <Graphic active={on} /> : null}
      </div>
    </article>
  );
}

export default function ProductChapters({ heading = true }: { heading?: boolean }) {
  const pin = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = pin.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      setPinned(true);
      const texts = gsap.utils.toArray<HTMLElement>("[data-chapter-text]", el);
      const visuals = gsap.utils.toArray<HTMLElement>("[data-chapter-visual]", el);
      const n = texts.length;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => "+=" + window.innerHeight * (n - 1),
          pin: true,
          scrub: 0.6,
          snap: { snapTo: 1 / (n - 1), duration: 0.48, ease: "power2.inOut" },
          onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
        },
      });
      if (rail.current) tl.fromTo(rail.current, { scaleY: 1 / n }, { scaleY: 1, duration: n - 1 }, 0);
      texts.forEach((_, i) => {
        if (!i) return;
        tl.to(texts[i - 1], { autoAlpha: 0, y: -24, duration: 0.4 }, i - 0.6)
          .to(visuals[i - 1], { autoAlpha: 0, scale: 0.96, duration: 0.4 }, i - 0.6)
          .fromTo(texts[i], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4 }, i - 0.4)
          .fromTo(visuals[i], { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.4 }, i - 0.4);
      });
      return () => {
        setPinned(false);
        setActive(0);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="products" className={`surface-paper ${styles.section}`}>
      {heading && (
        <div className={`container ${styles.head}`}>
          <p className="eyebrow">What we&apos;re building</p>
          <h2 className={`lines ${styles.h2}`}>
            <span className="line">
              <span>Three products, each solving</span>
            </span>
            <span className="line">
              <span>one everyday problem.</span>
            </span>
          </h2>
        </div>
      )}

      <div ref={pin} className={styles.pin}>
        <div className={`container ${styles.chapters}`}>
          <div className={styles.rail} aria-hidden="true">
            <i ref={rail} />
          </div>
          <div className={styles.stagePanel} aria-hidden="true" />
          {PRODUCTS.map((p, i) => (
            <Chapter key={p.slug} product={p} index={i} pinned={pinned} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
