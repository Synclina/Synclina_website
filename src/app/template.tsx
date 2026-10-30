"use client";

import { useEffect, useRef } from "react";
import { isIntroDone } from "@/lib/scroll";

/**
 * Per-route entrance: a quick, light fade-up so page changes feel seamless
 * without slowing navigation down. (First load is handled by the door intro.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = content.current;
    if (!el || !isIntroDone()) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    el.animate(
      [
        { opacity: 0, transform: "translateY(14px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 400, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
    );
  }, []);

  return <div ref={content}>{children}</div>;
}
