import ConsoleShell, { LoadProblem } from "@/components/console/ConsoleShell";
import styles from "@/components/console/Console.module.css";
import { recentAudit, type AuditEntry } from "@/lib/admin/audit";
import { adminBase, requireSession } from "@/lib/admin/session";

const label = (iso: string) =>
  iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) : "";

export default async function ConsoleActivity() {
  await requireSession();
  let entries: AuditEntry[] | null = null;
  try {
    entries = await recentAudit();
  } catch (e) {
    console.error("[activity] not loaded", e instanceof Error ? e.message : "error");
  }

  return (
    <ConsoleShell base={adminBase()} active="activity">
      <h1 className={styles.pageTitle}>Activity</h1>
      <p className={styles.muted}>The last 100 sign-ins and ticket changes.</p>
      {!entries && <LoadProblem />}
      <ul className={styles.activity}>
        {entries?.map((e) => (
          <li key={e.id}>
            <span>{e.action}</span>
            {e.detail && <span className={styles.muted}>{e.detail}</span>}
            <time className={styles.muted}>{label(e.at)}</time>
          </li>
        ))}
      </ul>
    </ConsoleShell>
  );
}
