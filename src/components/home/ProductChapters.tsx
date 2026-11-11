"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTS, stageLevel, type Product } from "@/lib/constants";
import { useInView } from "@/hooks/useInView";
import { prefersReducedMotion } from "@/lib/scroll";
import { CreatorPipeline, DrivSyncDevice, TravelConverge } from "./ProductGraphics";
import styles from "./ProductChapters.module.css";

gsap.registerPlugin(ScrollTrigger);

/** How long each card stays before the carousel moves on by itself (phones). */
const AUTO_MS = 6000;

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

function Chapter({
  product,
  index,
  active,
  timer,
}: {
  product: Product;
  index: number;
  active: number;
  timer?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, 0.35);
  // Pinned (desktop) or carousel (phones): only the current chapter plays, and only on screen
  const on = active === index && seen;
  const level = stageLevel(product.status);
  const Graphic = GRAPHICS[product.slug];

  return (
    <article
      ref={ref}
      className={`${styles.item} ${on ? styles.on : ""}`}
      data-chapter={index}
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${PRODUCTS.length}: ${product.title}`}
    >
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

      {timer}
    </article>
  );
}

export default function ProductChapters({ heading = true }: { heading?: boolean }) {
  const pin = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  /* ── Phones: a swipeable card carousel that moves on by itself ── */
  const track = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [holding, setHolding] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const inView = useInView(track, 0.25);

  useEffect(() => {
    setAutoplay(!prefersReducedMotion());
    const onVis = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const cards = () => Array.from(track.current?.querySelectorAll<HTMLElement>("[data-chapter]") ?? []);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    const card = cards()[i];
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  }, []);

  // Whichever card sits nearest the middle is the current one
  useEffect(() => {
    const el = track.current;
    if (!el || pinned) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      cards().forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < dist) [best, dist] = [i, d];
      });
      setSlide(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pinned]);

  const next = () => goTo((slide + 1) % PRODUCTS.length);
  const running = autoplay && inView && !holding && !pageHidden;

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
    <section id="products" className={`surface-night ${styles.section}`}>
      {heading && (
        <div className={`container ${styles.head}`}>
          <p className="eyebrow">What we&apos;re building</p>
          <h2 className={`lines ${styles.h2}`}>
            <span className="line">
              <span>Three products, each solving one everyday problem.</span>
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
          <div
            ref={track}
            className={styles.slider}
            role="region"
            aria-roledescription="carousel"
            aria-label="Our products"
            onTouchStart={() => setHolding(true)}
            onTouchEnd={() => setHolding(false)}
            onTouchCancel={() => setHolding(false)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHolding(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setHolding(false)}
            onFocus={() => setHolding(true)}
            onBlur={() => setHolding(false)}
          >
            {PRODUCTS.map((p, i) => (
              <Chapter
                key={p.slug}
                product={p}
                index={i}
                active={pinned ? active : slide}
                timer={
                  /* Fills across the bottom of the card on show; when full, the next product slides in */
                  <span className={`${styles.timer} ${i === slide ? styles.timing : ""}`} aria-hidden="true">
                    <b
                      key={i === slide ? `run-${slide}` : "idle"}
                      style={i === slide ? { animationDuration: `${AUTO_MS}ms`, animationPlayState: running ? "running" : "paused" } : undefined}
                      onAnimationEnd={i === slide && autoplay ? next : undefined}
                    />
                  </span>
                }
              />
            ))}
          </div>
        </div>

        {/* Where you are, and a tap target to jump */}
        <div className={`container ${styles.dots}`}>
          {PRODUCTS.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              className={`${styles.dot} ${i === slide ? styles.current : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Show ${p.title}`}
              aria-current={i === slide ? "true" : undefined}
            >
              <i />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
