export const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

/* ── Intro (door) coordination ── */

export const INTRO_DONE_EVENT = "synclina:intro-done";

export const isIntroDone = () =>
  typeof document !== "undefined" && document.documentElement.dataset.intro === "done";

/** Run `cb` once the door intro has opened (immediately if it already has). */
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
