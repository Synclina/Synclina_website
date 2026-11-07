"use client";

import { useRef, useState } from "react";
import { getProduct } from "@/lib/constants";
import { useInView } from "@/hooks/useInView";
import styles from "./ProductGraphics.module.css";

/** Plays a loop only while 40% of it is visible. */
function usePlaying() {
  const ref = useRef<HTMLDivElement>(null);
  const playing = useInView(ref, 0.4);
  return { ref, playing };
}

/* ── DrivSync: exploded device (CSS 3D) ── */
export function DrivSyncDevice({ active = false }: { active?: boolean }) {
  const { ref, playing } = usePlaying();
  const [hover, setHover] = useState(false);
  const screen = getProduct("drivsync")?.screen;
  const bars = [42, 64, 38, 80, 56, 70];

  return (
    <div
      ref={ref}
      className={`${styles.stage} ${styles.device} ${active || hover ? styles.exploded : ""}`}
      data-play={playing || undefined}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      role="img"
      aria-label="DrivSync app, example screen: weekly fuel efficiency, a fuel gauge, spending bars and the AI Copilot"
    >
      <div className={styles.rig} aria-hidden="true">
        <div className={`${styles.layer} ${styles.phone}`}>
          <div className={styles.status}>
            <span>9:41</span>
            <span>DrivSync</span>
          </div>
          <p className={styles.screenTitle}>{screen?.title}</p>
          <p className={styles.metric}>
            {screen?.metric}
            <small>{screen?.metricLabel}</small>
          </p>
        </div>

        <div className={`${styles.layer} ${styles.fuel}`}>
          <span className={styles.cardLabel}>Fuel · this month</span>
          <svg viewBox="0 0 120 72" className={styles.gauge}>
            <path d="M10 64 A50 50 0 0 1 110 64" pathLength={1} className={styles.gaugeTrack} />
            <path d="M10 64 A50 50 0 0 1 110 64" pathLength={1} className={styles.gaugeFill} />
            <line x1="60" y1="64" x2="60" y2="24" className={styles.needle} />
            <circle cx="60" cy="64" r="4" className={styles.hub} />
          </svg>
          <div className={styles.bars}>
            {bars.map((h, i) => (
              <i key={i} style={{ "--h": `${h}%`, "--i": i } as React.CSSProperties} />
            ))}
          </div>
        </div>

        <div className={`${styles.layer} ${styles.copilot}`}>
          <span className={styles.cardLabel}>AI Copilot</span>
          <p>&ldquo;What did fuel cost me this month?&rdquo;</p>
        </div>
      </div>
      <span className={styles.example}>Example data</span>
    </div>
  );
}

/* ── Creator Automation: four-stage pipeline ── */
const STAGES = ["Idea", "Draft", "Schedule", "Insights"];

export function CreatorPipeline() {
  const { ref, playing } = usePlaying();
  const xs = [70, 230, 390, 550];
  return (
    <div ref={ref} className={`${styles.stage} ${styles.pipeline}`} data-play={playing || undefined}>
      <svg viewBox="0 0 620 300" role="img" aria-label="Creator Automation pipeline: idea, draft, schedule, insights">
        <path d="M70 150 H550" className={styles.track} />
        <path d="M70 150 H550" className={styles.flow} />
        {xs.map((x, i) => (
          <g key={STAGES[i]} className={styles.node} style={{ "--i": i } as React.CSSProperties}>
            <circle cx={x} cy={150} r={26} className={styles.nodeRing} />
            <circle cx={x} cy={150} r={7} className={styles.nodeDot} />
            <text x={x} y={210} textAnchor="middle" className={styles.svgLabel}>
              {String(i + 1).padStart(2, "0")} {STAGES[i]}
            </text>
          </g>
        ))}
      </svg>
      <span className={styles.example}>Illustration</span>
    </div>
  );
}

/* ── Travel Planning: three travellers converge on one shared trip ── */
export function TravelConverge() {
  const { ref, playing } = usePlaying();
  const starts = [
    [40, 60],
    [40, 150],
    [40, 240],
  ];
  return (
    <div ref={ref} className={`${styles.stage} ${styles.travel}`} data-play={playing || undefined}>
      <svg viewBox="0 0 620 300" role="img" aria-label="Travel Planning: three travellers' plans converge into one shared trip">
        {starts.map(([x, y], i) => (
          <g key={i}>
            <path d={`M${x} ${y} C 260 ${y}, 330 150, 470 150`} className={styles.track} />
            <path d={`M${x} ${y} C 260 ${y}, 330 150, 470 150`} className={styles.flow} style={{ "--i": i } as React.CSSProperties} />
            <circle cx={x} cy={y} r={7} className={styles.nodeDot} />
            <text x={x} y={y - 16} className={styles.svgLabel}>
              Traveller {i + 1}
            </text>
          </g>
        ))}
        <circle cx={470} cy={150} r={30} className={styles.pulse} />
        <circle cx={470} cy={150} r={22} className={styles.tripNode} />
        <text x={512} y={155} className={styles.svgLabel}>
          Shared trip
        </text>
      </svg>
      <span className={styles.example}>Illustration</span>
    </div>
  );
}
