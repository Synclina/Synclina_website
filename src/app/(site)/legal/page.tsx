import type { Metadata } from "next";
import Link from "next/link";
import { DRIVSYNC_DOCS } from "./documents";
import styles from "./Legal.module.css";

export const metadata: Metadata = {
  title: "Legal",
  description: "Privacy policy, terms and account deletion for Synclina's apps.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <section className={`container ${styles.page}`}>
      <span className="section-label">Legal</span>
      <h1 className={styles.heading}>Policies for our apps</h1>
      <h2 className={styles.appName}>DrivSync</h2>
      <div className={styles.cards}>
        {DRIVSYNC_DOCS.map((d) => (
          <Link key={d.slug} href={`/legal/drivsync/${d.slug}`} className={styles.card}>
            <strong>{d.label}</strong>
            <span>{d.text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
