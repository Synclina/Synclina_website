import type { Product } from "@/lib/constants";
import styles from "./PhoneMockup.module.css";

/** CSS-3D phone showing a stylised screen for a product (plan §6.4). */
export default function PhoneMockup({ product, className = "" }: { product: Product; className?: string }) {
  const { screen } = product;
  return (
    <div
      className={`${styles.phone} ${className}`}
      style={{ "--accent": product.accent, "--accent-rgb": product.accentRgb } as React.CSSProperties}
      data-phone
    >
      <div className={styles.frame}>
        <div className={styles.notch} />
        <div className={styles.screen}>
          <div className={styles.status}>
            <span>9:41</span>
            <span className={styles.icons}>
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className={styles.appHeader}>
            <span className={styles.appName}>{product.code}</span>
            <span className={styles.appTitle}>{screen.title}</span>
          </div>

          <div className={styles.hero}>
            <svg viewBox="0 0 120 120" className={styles.ring}>
              <circle cx="60" cy="60" r="50" className={styles.ringTrack} />
              <circle cx="60" cy="60" r="50" className={styles.ringValue} pathLength={100} />
            </svg>
            <div className={styles.metric}>
              <strong>{screen.metric}</strong>
              <span>{screen.metricLabel}</span>
            </div>
          </div>

          <div className={styles.bars}>
            {[40, 65, 50, 80, 58, 92, 74].map((h, i) => (
              <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>

          <ul className={styles.rows}>
            {screen.rows.map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </li>
            ))}
          </ul>
          <div className={styles.tabbar}>
            <i className={styles.active} />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className={styles.shadow} />
    </div>
  );
}
