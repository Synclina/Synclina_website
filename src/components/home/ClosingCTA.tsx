"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { finePointer, prefersReducedMotion } from "@/lib/scroll";
import styles from "./ClosingCTA.module.css";

type Props = { title?: string; sub?: string; label?: string; href?: string };

/** One clear ask: giant type and a ribbon line that draws into the button. (The email is in the footer.) */
export default function ClosingCTA({
  title = "Tell us what to automate.",
  sub = "Free first call. Clear plan, clear price.",
  label = "Book a free call",
  href = "/contact?topic=service",
}: Props) {
  const btn = useRef<HTMLAnchorElement>(null);

  // Magnetic button, fine pointers only
  useEffect(() => {
    const el = btn.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section className={`surface-night ${styles.cta}`}>
      <div className={`container ${styles.inner}`} data-reveal>
        <svg className={styles.wire} viewBox="0 0 200 240" preserveAspectRatio="none" aria-hidden="true">
          <path d="M8 0 V150 Q8 200 58 200 H200" pathLength={1} />
        </svg>
        <h2 className={`lines ${styles.title}`}>
          <span className="line">
            <span>{title}</span>
          </span>
        </h2>
        <p className={styles.sub}>{sub}</p>
        <div className={styles.actions}>
          <Link ref={btn} href={href} className={`btn btn-primary ${styles.button}`}>
            {label} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
