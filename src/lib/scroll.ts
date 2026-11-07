import type Lenis from "lenis";

/* ── Smooth scroll (Lenis, set up by MotionLayer) ── */

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenis = l);
export const getLenis = () => lenis;

export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
};

/** Jump to the top without animation (route changes). */
export const resetScroll = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: "instant" });
};

/* ── Intro coordination ── */

export const INTRO_DONE_EVENT = "synclina:intro-done";

export const isIntroDone = () =>
  typeof document !== "undefined" && document.documentElement.dataset.intro === "done";

/** Run `cb` once the intro has lifted (immediately if it already has). */
export const onIntroDone = (cb: () => void) => {
  if (isIntroDone()) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_DONE_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_DONE_EVENT, cb);
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
