"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Boxes, ShieldCheck, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import SynclinaMark from "@/components/brand/SynclinaMark";
import { onIntroDone } from "@/lib/scroll";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(useGSAP);

// Three.js stays out of the server bundle; a flat logo shows while it loads.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className={styles.fallback}>
      <SynclinaMark size={220} />
    </div>
  ),
});

const POINTS = [
  { icon: Boxes, text: "AI-powered apps" },
  { icon: Zap, text: "Business automation" },
  { icon: ShieldCheck, text: "Privacy first" },
];

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Resolve targets now: play() fires later from an event, outside this context's selector scope.
      const items = gsap.utils.toArray<HTMLElement>("[data-hero-in]");
      gsap.set(items, { y: 24, opacity: 0 });
      return onIntroDone(() =>
        gsap.to(items, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "transform" }),
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className={styles.eyebrow} data-hero-in>
            <span className={styles.pulse} /> AI product studio · Hyderabad, India
          </span>
          <h1 className={styles.title} data-hero-in>
            Ideas in <span className="text-gradient">Sync.</span>
          </h1>
          <p className={styles.lead} data-hero-in>
            Synclina builds <strong>AI-powered apps</strong> that make everyday life simpler, and{" "}
            <strong>automates repetitive work</strong> for businesses.
          </p>
          <div className={styles.ctas} data-hero-in>
            <Button href="/products">
              See our products <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" href="/services">
              Automate my work
            </Button>
          </div>
          <ul className={styles.points} data-hero-in>
            {POINTS.map((p) => (
              <li key={p.text}>
                <p.icon size={16} /> {p.text}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.glow} />
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
