"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Number that rolls up from 0 when it scrolls into view. */
export default function AnimatedCounter({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const o = { v: 0 };
    gsap.to(o, {
      v: value,
      duration,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-US")),
    });
  }, [value]);

  return (
    <span>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}
