import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import BuildLog from "@/components/home/BuildLog";
import ClosingCTA from "@/components/home/ClosingCTA";
import { TIMELINE } from "@/lib/constants";
import styles from "@/components/pages/Pages.module.css";

export const metadata: Metadata = {
  title: "Build log",
  description: "Every dated update from Synclina's products, newest first, plus the studio's milestones since May 2026.",
  alternates: { canonical: "/build-log" },
};

export default function BuildLogPage() {
  return (
    <>
      <PageHero
        label="Build log"
        title="What changed,"
        accent="and when."
        lead="Every dated update across our products, newest first. Started in May 2026 and still going."
      />
      <BuildLog heading={false} id="log" />
      <section className="surface-night section">
        <div className="container">
          <p className="eyebrow">Studio milestones</p>
          <ol className={styles.milestones}>
            {TIMELINE.map((m) => (
              <li key={m.title} data-reveal>
                <span className="mono">{m.date}</span>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ClosingCTA title="Follow along, or start something." sub="We build in public. Bring us a task, or ask for early access." label="Get in touch" href="/contact" />
    </>
  );
}
