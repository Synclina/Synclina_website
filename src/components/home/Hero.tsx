"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SynclinaMark from "@/components/brand/SynclinaMark";
import { formatUpdateDate, latestUpdates, productBySlug } from "@/lib/constants";
import { onIntroDone, prefersReducedMotion } from "@/lib/scroll";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const HeroMark = dynamic(() => import("@/components/three/HeroMark"), { ssr: false });

const latest = latestUpdates(1)[0];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const [mount3d, setMount3d] = useState(false);
  const [ready3d, setReady3d] = useState(false);
  const [failed3d, setFailed3d] = useState(false);

  // H1 lines reveal once the intro lifts
  useEffect(() => onIntroDone(() => headline.current?.classList.add("in")), []);

  // Load three.js only after first paint and when the visitor isn't saving data
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const id = idle(() => setMount3d(true));
    return () => (window.cancelIdleCallback ?? clearTimeout)(id as number);
  }, []);

  // As the hero scrolls away, the copy rises 8%
  useEffect(() => {
    if (prefersReducedMotion() || !root.current || !copy.current) return;
    const tween = gsap.to(copy.current, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const onReady = useCallback(() => setReady3d(true), []);
  const onFail = useCallback(() => setFailed3d(true), []);

  return (
    <section ref={root} className={`surface-night ${styles.hero}`}>
      <div className={`container ${styles.grid}`}>
        <div ref={copy} className={styles.copy}>
          <p className="eyebrow">Synclina · AI product studio · Hyderabad</p>
          <h1 ref={headline} className={`lines ${styles.title}`}>
            <span className="line">
              <span>Software that</span>
            </span>
            <span className="line">
              <span>does the work.</span>
            </span>
          </h1>
          <p className={styles.sub}>
            We build our own AI apps (DrivSync, Creator Automation, Travel Planning) and custom automations for businesses
            tired of repetitive tasks.
          </p>
          <div className={styles.actions}>
            <Link href="#products" className="btn btn-primary">
              See what we&apos;re building <ArrowRight size={16} />
            </Link>
            <Link href="/contact?topic=service" className="btn btn-ghost">
              Book a free call
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={`${styles.fallback} ${ready3d && !failed3d ? styles.hide : ""}`}>
            <SynclinaMark size="100%" title="The Synclina mark" />
          </div>
          {mount3d && !failed3d && <HeroMark onReady={onReady} onFail={onFail} />}
        </div>
      </div>

      <div className={`container ${styles.live}`}>
        {latest && (
          <Link href="/build-log" className={styles.chip}>
            <i aria-hidden="true" />
            Latest update: {productBySlug(latest.product)?.title} · {formatUpdateDate(latest.date)}
          </Link>
        )}
      </div>
    </section>
  );
}
