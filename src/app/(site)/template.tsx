"use client";

import { useEffect, useRef } from "react";
import { isIntroDone, prefersReducedMotion, resetScroll } from "@/lib/scroll";

/**
 * Per-route entrance. The page arrives behind the night veil (see MotionLayer), the
 * scroll resets while it is covered, then the content rises in as the veil lifts.
 * (First load is handled by the door intro.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = content.current;
    if (!el || !isIntroDone()) return;
    resetScroll();
    if (prefersReducedMotion()) return;
    el.animate(
      [
        { opacity: 0, transform: "translateY(28px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 700, delay: 60, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
    );
  }, []);

  return <div ref={content}>{children}</div>;
}
