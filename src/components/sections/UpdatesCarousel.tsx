"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { formatUpdateDate, getProduct, latestUpdates } from "@/lib/constants";
import styles from "./UpdatesCarousel.module.css";

const INTERVAL = 5000;

/** "Latest updates" — auto-advancing, swipeable cards; each opens its product page. */
export default function UpdatesCarousel() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const updates = latestUpdates();
  useReveal(root);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const n = updates.length;
      const next = ((i % n) + n) % n;
      const card = el.children[next] as HTMLElement | undefined;
      if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
      setIndex(next);
    },
    [updates.length],
  );

  // Timed advance — pauses on hover/focus/touch, when off screen, or when the tab is hidden.
  useEffect(() => {
    if (paused || !inView || updates.length < 2) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") goTo(index + 1);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [index, paused, inView, goTo, updates.length]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the dots in sync when the user swipes / scrolls the track by hand.
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const left = el.scrollLeft;
    let best = 0;
    cards.forEach((c, i) => {
      if (Math.abs(c.offsetLeft - el.offsetLeft - left) < Math.abs(cards[best].offsetLeft - el.offsetLeft - left)) best = i;
    });
    if (best !== index) setIndex(best);
  };

  if (!updates.length) return null;

  return (
    <section ref={root} className="section" aria-roledescription="carousel" aria-label="Latest updates">
      <div className="container">
        <header className={styles.head}>
          <div data-reveal>
            <span className="section-label">Latest updates</span>
            <h2>What we&apos;ve shipped lately</h2>
          </div>
          <div className={styles.controls} data-reveal>
            <button onClick={() => goTo(index - 1)} aria-label="Previous update">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => goTo(index + 1)} aria-label="Next update">
              <ArrowRight size={18} />
            </button>
          </div>
        </header>

        <div
          ref={track}
          className={styles.track}
          onScroll={onScroll}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          data-reveal
        >
          {updates.map((u, i) => {
            const p = getProduct(u.product);
            if (!p) return null;
            return (
              <Link
                key={u.date + u.title}
                href={`/products/${p.slug}`}
                className={`${styles.card} ${i === index ? styles.current : ""}`}
                style={{ "--accent": p.accent, "--accent-rgb": p.accentRgb } as React.CSSProperties}
                aria-label={`${p.title}: ${u.title}`}
              >
                <div className={styles.cardTop}>
                  <span className={styles.product}>
                    <i /> {p.code} · {p.title}
                  </span>
                  <time dateTime={u.date}>{formatUpdateDate(u.date)}</time>
                </div>
                <h3>{u.title}</h3>
                <ul>
                  {u.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <span className={styles.open}>
                  Open product page <ArrowUpRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>

        <div className={styles.dots} role="tablist" aria-label="Choose update">
          {updates.map((u, i) => (
            <button
              key={u.date + u.title}
              role="tab"
              aria-selected={i === index}
              aria-label={`Update ${i + 1}`}
              className={i === index ? styles.dotActive : ""}
              onClick={() => goTo(i)}
            >
              {i === index && <span key={index} className={`${styles.fill} ${paused || !inView ? styles.fillPaused : ""}`} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
