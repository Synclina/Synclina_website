import { notFound } from "next/navigation";
import { LoadProblem } from "@/components/console/ConsoleShell";
import TicketBoard from "@/components/console/TicketBoard";
import styles from "@/components/console/Console.module.css";
import { adminApp } from "@/lib/admin/apps";
import { adminBase, requireSession } from "@/lib/admin/session";
import { TICKET_LIMIT, listTickets, type Ticket } from "@/lib/admin/tickets";

const label = (iso: string) =>
  iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) : "";

export default async function ConsoleApp({ params }: { params: Promise<{ app: string }> }) {
  await requireSession();
  const app = adminApp((await params).app);
  if (!app) notFound();
  const base = adminBase();

  let tickets: Ticket[] | null = app.takesTickets ? null : [];
  if (app.takesTickets) {
    try {
      tickets = await listTickets();
    } catch (e) {
      console.error("[tickets] not loaded", e instanceof Error ? e.message : "error");
    }
  }

  return (
    <div className={styles.pageIn}>
      <h1 className={styles.pageTitle}>{app.title}</h1>
      {!app.takesTickets ? (
        <p className={styles.emptyNote}>This app isn&apos;t sending tickets yet. They&apos;ll show here once it does.</p>
      ) : tickets ? (
        <>
          <TicketBoard base={base} tickets={tickets.map((t) => ({ ...t, createdLabel: label(t.createdAt) }))} />
          {tickets.length >= TICKET_LIMIT && <p className={styles.muted}>Showing the newest {TICKET_LIMIT} tickets.</p>}
          <p className={styles.footNote}>Requests sent while signed out of the app arrive by email, and show here once the rider signs in.</p>
        </>
      ) : (
        <LoadProblem />
      )}
    </div>
  );
}
