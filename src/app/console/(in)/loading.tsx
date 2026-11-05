import styles from "@/components/console/Console.module.css";

/** Shown at once when moving between pages. */
export default function Loading() {
  return (
    <div className={styles.skeleton} aria-busy="true" aria-label="Loading">
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonRow} />
      <div className={styles.skeletonRow} />
      <div className={styles.skeletonRow} />
    </div>
  );
}
