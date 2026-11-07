import Link from "next/link";
import SynclinaMark from "@/components/brand/SynclinaMark";
import SynclinaWordmark from "@/components/brand/SynclinaWordmark";
import Clock from "@/components/ui/Clock";
import { PRODUCTS, SITE } from "@/lib/constants";
import styles from "./Footer.module.css";

const STUDIO = [
  { label: "Services", href: "/services" },
  { label: "Build log", href: "/build-log" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy policy", href: "/legal/drivsync/privacy" },
  { label: "Terms", href: "/legal/drivsync/terms" },
  { label: "Account deletion (DrivSync)", href: "/legal/drivsync/delete-account" },
];

const SOCIAL_LABELS: Record<string, string> = { linkedin: "LinkedIn", instagram: "Instagram", github: "GitHub", x: "X" };

export default function Footer() {
  return (
    <footer className={`surface-night ${styles.footer}`}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="Synclina home">
            <SynclinaMark size={28} />
            <SynclinaWordmark height={12} />
          </Link>
          <p className={styles.tagline}>Ideas in Sync.</p>
          <p className={styles.blurb}>
            An AI product studio in {SITE.location}. Our own apps, and custom automations for businesses.
          </p>
          <a href={`mailto:${SITE.email}`} className={`link-draw ${styles.email}`}>
            {SITE.email}
          </a>
          <p className={styles.note}>We read every message.</p>
        </div>

        <nav className={styles.col} aria-label="Products">
          <h2>Products</h2>
          {PRODUCTS.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`} className="link-draw">
              {p.title}
            </Link>
          ))}
        </nav>

        <nav className={styles.col} aria-label="Studio">
          <h2>Studio</h2>
          {STUDIO.map((l) => (
            <Link key={l.href} href={l.href} className="link-draw">
              {l.label}
            </Link>
          ))}
        </nav>

        <nav className={styles.col} aria-label="Legal">
          <h2>Legal</h2>
          {LEGAL.map((l) => (
            <Link key={l.href} href={l.href} className="link-draw">
              {l.label}
            </Link>
          ))}
        </nav>

        <nav className={styles.col} aria-label="Social">
          <h2>Social</h2>
          {Object.entries(SITE.socials).map(([k, url]) => (
            <a key={k} href={url} target="_blank" rel="noreferrer" className="link-draw">
              {SOCIAL_LABELS[k] ?? k}
            </a>
          ))}
        </nav>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} Synclina</span>
        <span>
          {SITE.location} · <Clock />
        </span>
      </div>

      <div className={`lines ${styles.giant}`} aria-hidden="true">
        <span className="line">
          <span>
            <SynclinaWordmark height={200} className={styles.giantSvg} letterAttr="data-letter" />
          </span>
        </span>
      </div>
    </footer>
  );
}
