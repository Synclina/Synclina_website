"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/lib/scroll";

const R = 22;
const C = 2 * Math.PI * R;

/** Appears once you've scrolled down; the ring shows how far through the page you are. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setVisible(window.scrollY > window.innerHeight * 0.6);
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      className={`back-to-top ${visible ? "is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 50 50" aria-hidden="true">
        <circle cx="25" cy="25" r={R} className="back-to-top__track" />
        <circle ref={ring} cx="25" cy="25" r={R} className="back-to-top__ring" strokeDasharray={C} strokeDashoffset={C} />
      </svg>
      <ArrowUp size={18} />
    </button>
  );
}
