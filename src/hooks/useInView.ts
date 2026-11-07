"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while at least `threshold` of the element is visible. Used to play and pause loops. */
export function useInView(ref: RefObject<Element | null>, threshold = 0.4, once = false) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting && once) io.disconnect();
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);

  return inView;
}
