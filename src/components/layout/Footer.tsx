import Link from "next/link";
import SynclinaMark from "@/components/brand/SynclinaMark";
import SynclinaWordmark from "@/components/brand/SynclinaWordmark";
import SocialIcon, { type SocialName } from "@/components/ui/SocialIcons";
import { PRODUCTS, SITE } from "@/lib/constants";
import styles from "./Footer.module.css";

const COMPANY = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Technology", href: "/technology" },
  { label: "Journey", href: "/journey" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const socials = Object.entries(SITE.socials) as [SocialName, string][];

  return (
    <footer className={styles.footer}>
      <div className={styles.glowLine} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="Synclina home">
            <SynclinaMark size={34} />
            <SynclinaWordmark height={15} />
          </Link>
          <p className={styles.tagline}>
            IDEAS IN <span>SYNC</span>.
          </p>
          <p className={styles.blurb}>
            Human-first AI that turns everyday problems into useful products. Multiple ideas, one philosophy.
          </p>
          <div className={styles.socials}>
            {socials.map(([k, url]) => (
              <a key={k} href={url} target="_blank" rel="noreferrer" aria-label={`Synclina on ${k}`}>
                <SocialIcon name={k} />
              </a>
            ))}
          </div>
        </div>

        <nav className={styles.col} aria-label="Products">
          <h4>Products</h4>
          {PRODUCTS.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`} style={{ "--accent": p.accent } as React.CSSProperties}>
              <i />
              {p.title}
            </Link>
          ))}
          <Link href="/products">All ideas →</Link>
        </nav>

        <nav className={styles.col} aria-label="Company">
          <h4>Company</h4>
          {COMPANY.map((l) => (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.col}>
          <h4>Work with us</h4>
          <Link href="/contact?topic=service">Request a service</Link>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <span className={styles.note}>{SITE.location} · We read every message.</span>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} Synclina. All rights reserved.</span>
        <span>Built with love by Synclina</span>
      </div>

      <div className={styles.giant} aria-hidden="true">
        <SynclinaWordmark height={200} className={styles.giantSvg} />
      </div>
    </footer>
  );
}
