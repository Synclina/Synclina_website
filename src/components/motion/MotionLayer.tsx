"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { finePointer, prefersReducedMotion, setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

const REVEAL = "[data-reveal]:not([data-in]), .lines:not([data-in])";

/**
 * Site-wide motion: Lenis smoothing (wheel only, never touch), reveal-on-enter,
 * the scroll-progress hairline and the desktop cursor ring.
 */
export default function MotionLayer() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const io = useRef<IntersectionObserver | null>(null);

  // Smooth scroll + progress bar
  useEffect(() => {
    const reduce = prefersReducedMotion();
    let instance: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };

    if (!reduce) {
      instance = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -88 } });
      instance.on("scroll", () => {
        ScrollTrigger.update();
        progress();
      });
      tick = (t) => instance?.raf(t * 1000);
      gsap.ticker.add(tick);
      setLenis(instance);
    }

    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), progress()));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    progress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      setLenis(null);
    };
  }, []);

  // Reveal-on-enter, re-scanned whenever the page content changes
  useEffect(() => {
    // Content inside a still-streaming Suspense boundary isn't hydrated yet; marking it
    // early makes React report a mismatch, so wait until React owns the node.
    const hydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber"));
    const timers = new Set<number>();
    const show = (el: Element) => {
      if (hydrated(el)) return el.setAttribute("data-in", "");
      const t = window.setTimeout(() => (timers.delete(t), show(el)), 100);
      timers.add(t);
    };
    io.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            show(e.target);
            io.current?.unobserve(e.target);
          }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const scan = () => document.querySelectorAll(REVEAL).forEach((el) => io.current?.observe(el));
    scan();
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (!queued) queued = requestAnimationFrame(() => ((queued = 0), scan()));
    });
    mo.observe(document.getElementById("main") ?? document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.current?.disconnect();
      cancelAnimationFrame(queued);
      timers.forEach(clearTimeout);
    };
  }, []);

  // New route: re-measure pinned scenes
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Cursor ring (fine pointers only); follows the pointer directly so it never lags
  useEffect(() => {
    const el = ring.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      el.classList.add("is-on");
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.("a, button, [role='button'], input, select, textarea, label, [data-cursor]");
      el.classList.toggle("is-hover", Boolean(hit));
    };
    const leave = () => el.classList.remove("is-on");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={bar} className="scroll-progress" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
