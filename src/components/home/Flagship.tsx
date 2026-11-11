"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "@/hooks/useInView";
import { prefersReducedMotion } from "@/lib/scroll";
import styles from "./Flagship.module.css";

gsap.registerPlugin(ScrollTrigger);

const STEPS = ["Describe the task.", "Get a plan and a price.", "We build it and hand it over."];

const INPUTS = ["Forms & email", "Spreadsheets", "Chats"];
const OUTPUTS = ["Reports", "Replies", "Updates"];
type Box = { x: number; y: number; w: number; h: number };
type Layout = { viewBox: string; inputs: Box[]; outputs: Box[]; engine: Box; inPath: (i: number) => string; outPath: (i: number) => string };

/* Wide screens: inputs left, outputs right. Phones: the same diagram stacked vertically. */
const WIDE: Layout = (() => {
  const Y = [70, 180, 290];
  return {
    viewBox: "0 0 620 360",
    inputs: Y.map((y) => ({ x: 10, y: y - 18, w: 140, h: 36 })),
    outputs: Y.map((y) => ({ x: 470, y: y - 18, w: 140, h: 36 })),
    engine: { x: 262, y: 140, w: 96, h: 80 },
    inPath: (i) => `M150 ${Y[i]} C 215 ${Y[i]}, 225 180, 262 180`,
    outPath: (i) => `M358 180 C 395 180, 405 ${Y[i]}, 470 ${Y[i]}`,
  };
})();

const TALL: Layout = (() => {
  const X = [60, 180, 300];
  return {
    viewBox: "0 0 360 420",
    inputs: X.map((x) => ({ x: x - 56, y: 22, w: 112, h: 36 })),
    outputs: X.map((x) => ({ x: x - 56, y: 362, w: 112, h: 36 })),
    engine: { x: 132, y: 170, w: 96, h: 80 },
    inPath: (i) => `M${X[i]} 58 C ${X[i]} 120, 180 116, 180 170`,
    outPath: (i) => `M180 250 C 180 304, ${X[i]} 300, ${X[i]} 362`,
  };
})();

const REQUEST = "Every Monday, email each store manager last week's sales summary from our sheet.";
const PLAN = [
  "1  Read last week's rows from the sales sheet",
  "2  Total them per store",
  "3  Email each manager their summary, Monday 09:00",
  "→  Runs every Monday. Nobody has to remember.",
];

/** Types an example request, then a short plan. Clearly labelled as an example. */
function Console() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, 0.5, true);
  const [typed, setTyped] = useState("");
  const [lines, setLines] = useState(0);

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) {
      setTyped(REQUEST);
      setLines(PLAN.length);
      return;
    }
    let i = 0;
    const timers: number[] = [];
    const type = window.setInterval(() => {
      i += 1;
      setTyped(REQUEST.slice(0, i));
      if (i >= REQUEST.length) {
        clearInterval(type);
        PLAN.forEach((_, k) => timers.push(window.setTimeout(() => setLines(k + 1), 450 + k * 380)));
      }
    }, 22);
    return () => {
      clearInterval(type);
      timers.forEach(clearTimeout);
    };
  }, [seen]);

  return (
    <div ref={ref} className={styles.console} aria-label="Example: a task turned into a plan">
      <div className={styles.consoleHead}>
        <span>Task to plan</span>
        <span className={styles.tag}>Example</span>
      </div>
      <p className={styles.request}>
        <span className={styles.prompt}>&gt;</span> {typed || " "}
        {typed.length < REQUEST.length && <span className={styles.caret} aria-hidden="true" />}
      </p>
      <ul className={styles.plan}>
        {PLAN.map((l, k) => (
          <li key={l} className={k < lines ? styles.shown : undefined}>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Home: the services teaser (three steps + link to /services).
 * Services page (`onServicesPage`): just the worked example, because that page
 * already has the full four-step "How it works" and is the link target.
 */
export default function Flagship({ onServicesPage = false }: { onServicesPage?: boolean }) {
  const diagram = useRef<SVGSVGElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, 0.2);
  const [step, setStep] = useState(0);
  const [wired, setWired] = useState(false);
  const [tall, setTall] = useState(false);
  const L = tall ? TALL : WIDE;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const sync = () => setTall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Lines draw with scroll; steps light up in sequence
  useEffect(() => {
    const svg = diagram.current;
    if (!svg) return;
    const paths = svg.querySelectorAll<SVGPathElement>("[data-draw]");
    if (prefersReducedMotion()) {
      paths.forEach((p) => (p.style.strokeDashoffset = "0"));
      setStep(STEPS.length - 1);
      setWired(true);
      return;
    }
    const tween = gsap.fromTo(
      paths,
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: {
          trigger: svg,
          start: "top 80%",
          end: "bottom 45%",
          scrub: true,
          onUpdate: (self) => {
            setStep(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
            setWired(self.progress > 0.92);
          },
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [tall]);

  // Packets only travel while the diagram is on screen
  useEffect(() => {
    const svg = diagram.current;
    if (!svg) return;
    if (inView && !prefersReducedMotion()) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [inView, tall]);

  return (
    <section className={`surface-night section ${styles.flagship}`} id="services">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="eyebrow">{onServicesPage ? "Example · workflow automation" : "Services · workflow automation"}</p>
          <h2 className={styles.h2}>Repetitive work, handled.</h2>
          <p className={styles.sub}>We connect the tools you already use, so weekly chores run on their own.</p>
          {!onServicesPage && (
            <>
              <ol className={styles.steps}>
                {STEPS.map((s, i) => (
                  <li key={s} className={i <= step ? styles.lit : undefined}>
                    <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <Link href="/services" className={styles.more}>
                All services <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        <div ref={wrap} className={styles.side}>
          <div className={styles.panel}>
            <svg
              key={tall ? "tall" : "wide"}
              ref={diagram}
              viewBox={L.viewBox}
              className={`${styles.diagram} ${wired ? styles.wired : ""}`}
              role="img"
              aria-label="Example workflow: forms, spreadsheets and chats go into a Synclina build, which sends out reports, replies and updates"
            >
              {[0, 1, 2].map((i) => (
                <g key={`l${i}`}>
                  <path d={L.inPath(i)} className={styles.wire} pathLength={1} data-draw />
                  <path d={L.outPath(i)} className={styles.wire} pathLength={1} data-draw />
                </g>
              ))}
              {[0, 1, 2].map((i) => {
                const a = L.inputs[i];
                const b = L.outputs[i];
                return (
                  <g key={`n${i}`}>
                    <rect x={a.x} y={a.y} width={a.w} height={a.h} rx={8} className={styles.box} />
                    <text x={a.x + a.w / 2} y={a.y + 23} textAnchor="middle" className={styles.label}>
                      {INPUTS[i]}
                    </text>
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={8} className={styles.box} />
                    <text x={b.x + b.w / 2} y={b.y + 23} textAnchor="middle" className={styles.label}>
                      {OUTPUTS[i]}
                    </text>
                    <circle r={4} className={styles.packet}>
                      <animateMotion dur="4s" repeatCount="indefinite" begin={`${i * 0.35}s`} path={L.inPath(i)} keyPoints="0;1;1" keyTimes="0;0.45;1" calcMode="linear" />
                    </circle>
                    <circle r={4} className={styles.packet}>
                      <animateMotion dur="4s" repeatCount="indefinite" begin={`${i * 0.35}s`} path={L.outPath(i)} keyPoints="0;0;1" keyTimes="0;0.55;1" calcMode="linear" />
                    </circle>
                  </g>
                );
              })}
              <rect x={L.engine.x} y={L.engine.y} width={L.engine.w} height={L.engine.h} rx={12} className={styles.engine} />
              <text x={L.engine.x + L.engine.w / 2} y={L.engine.y + 36} textAnchor="middle" className={styles.engineText}>
                Synclina
              </text>
              <text x={L.engine.x + L.engine.w / 2} y={L.engine.y + 54} textAnchor="middle" className={styles.label}>
                build
              </text>
            </svg>
            <span className={styles.panelTag}>Example workflow</span>
          </div>
          <Console />
        </div>
      </div>
    </section>
  );
}
