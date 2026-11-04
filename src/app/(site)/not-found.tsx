import Button from "@/components/ui/Button";
import styles from "./legal/Legal.module.css";

export default function NotFound() {
  return (
    <section className={`container ${styles.missing}`}>
      <span className="section-label">404</span>
      <h1>This page isn&apos;t here.</h1>
      <p>The link may be old, or the address may have a typo.</p>
      <Button href="/">Back to home</Button>
    </section>
  );
}
