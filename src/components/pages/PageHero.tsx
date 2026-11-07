import styles from "./Pages.module.css";

/** Shared header for inner pages: label, a two-line headline that mask-reveals, and a lead. */
export default function PageHero({ label, title, accent, lead }: { label: string; title: string; accent: string; lead: string }) {
  return (
    <section className={`surface-night ${styles.hero}`}>
      <div className="container">
        <p className="eyebrow">{label}</p>
        <h1 className={`lines ${styles.title}`}>
          <span className="line">
            <span>{title}</span>
          </span>
          <span className="line">
            <span>{accent}</span>
          </span>
        </h1>
        <p className={styles.lead} data-reveal>
          {lead}
        </p>
      </div>
    </section>
  );
}
