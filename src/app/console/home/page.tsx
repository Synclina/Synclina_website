import Link from "next/link";
import ConsoleShell, { LoadProblem } from "@/components/console/ConsoleShell";
import styles from "@/components/console/Console.module.css";
import { ADMIN_APPS } from "@/lib/admin/apps";
import { adminBase, requireSession } from "@/lib/admin/session";
import { countTickets, type TicketCounts } from "@/lib/admin/tickets";

export default async function ConsoleHome() {
  await requireSession();
  const base = adminBase();
  let counts: TicketCounts | null = null;
  try {
    counts = await countTickets();
  } catch (e) {
    console.error("[home] counts not loaded", e instanceof Error ? e.message : "error");
  }

  return (
    <ConsoleShell base={base} active="home">
      <h1 className={styles.pageTitle}>Tickets by app</h1>
      {!counts && <LoadProblem />}
      <div className={styles.appGrid}>
        {ADMIN_APPS.map((app) => (
          <Link key={app.slug} href={`${base}/apps/${app.slug}`} className={styles.appCard} style={{ "--accent": app.accent } as React.CSSProperties}>
            <strong>{app.title}</strong>
            {app.takesTickets && counts ? (
              <dl className={styles.counts}>
                <div>
                  <dt>Pending</dt>
                  <dd>{counts.open}</dd>
                </div>
                <div>
                  <dt>In progress</dt>
                  <dd>{counts.in_progress}</dd>
                </div>
                <div>
                  <dt>Fixed</dt>
                  <dd>{counts.fixed}</dd>
                </div>
              </dl>
            ) : (
              <span className={styles.muted}>{app.takesTickets ? "Open to see tickets" : "No tickets yet"}</span>
            )}
          </Link>
        ))}
      </div>
    </ConsoleShell>
  );
}
