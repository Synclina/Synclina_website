"use client";

import { useEffect, useRef } from "react";
import { isIntroDone, resetScroll } from "@/lib/scroll";

/**
 * Per-route entrance: a quick, light fade-up so page changes feel seamless
 * without slowing navigation down. (First load is handled by the door intro.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = content.current;
    if (!el || !isIntroDone()) return;
    resetScroll();
    el.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 240, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  }, []);

  return <div ref={content}>{children}</div>;
}
