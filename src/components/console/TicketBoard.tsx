"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { NOTE_LIMIT, STATUS_LABELS, TICKET_STATUSES, type TicketStatus } from "@/lib/admin/rules";
import type { Ticket } from "@/lib/admin/tickets";
import styles from "./Console.module.css";

export type BoardTicket = Ticket & { createdLabel: string };
type Filter = TicketStatus | "all";

const STATUS_STYLE: Record<TicketStatus, string> = {
  open: styles.statusOpen,
  in_progress: styles.statusProgress,
  fixed: styles.statusFixed,
};

export default function TicketBoard({ base, tickets: loaded }: { base: string; tickets: BoardTicket[] }) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [tickets, setTickets] = useState(loaded);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openRef, setOpenRef] = useState<string | null>(null);

  useEffect(() => setTickets(loaded), [loaded]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: tickets.length, open: 0, in_progress: 0, fixed: 0 };
    for (const t of tickets) c[t.status] += 1;
    return c;
  }, [tickets]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter(
      (t) =>
        (filter === "all" || t.status === filter) &&
        (!q || [t.reference, t.subject, t.topic, t.message, t.riderName, t.riderEmail].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [tickets, filter, query]);

  const replaced = (next: BoardTicket) => setTickets((all) => all.map((t) => (t.reference === next.reference && t.uid === next.uid ? next : t)));

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter by status">
          {(["all", ...TICKET_STATUSES] as Filter[]).map((f) => (
            <button key={f} type="button" className={filter === f ? styles.filterActive : styles.filter} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : STATUS_LABELS[f]} <span>{counts[f]}</span>
            </button>
          ))}
        </div>
        <div className={styles.searchRow}>
          <input type="search" className={styles.search} placeholder="Search tickets" aria-label="Search tickets" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="button" className={styles.secondary} disabled={refreshing} onClick={() => startRefresh(() => router.refresh())}>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className={styles.emptyNote}>{tickets.length === 0 ? "No tickets yet." : "No tickets match."}</p>
      ) : (
        <ul className={styles.tickets}>
          {shown.map((t) => (
            <TicketRow
              key={`${t.uid}/${t.reference}`}
              base={base}
              ticket={t}
              open={openRef === t.reference}
              onToggle={() => setOpenRef(openRef === t.reference ? null : t.reference)}
              onSaved={replaced}
            />
          ))}
        </ul>
      )}
    </>
  );
}

function TicketRow({ base, ticket, open, onToggle, onSaved }: { base: string; ticket: BoardTicket; open: boolean; onToggle: () => void; onSaved: (t: BoardTicket) => void }) {
  const [note, setNote] = useState(ticket.teamNote);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; bad: boolean } | null>(null);

  useEffect(() => setNote(ticket.teamNote), [ticket.teamNote]);

  const save = async (status: TicketStatus, nextNote: string) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${base}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: ticket.uid, reference: ticket.reference, status, note: nextNote }),
      });
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string; updatedAt?: string };
      if (!res.ok) {
        setMessage({ text: data.error ?? "Not saved. Please try again.", bad: true });
      } else {
        onSaved({ ...ticket, status, teamNote: nextNote.trim(), updatedAt: data.updatedAt ?? ticket.updatedAt });
        setMessage({ text: "Saved. The rider sees it next time they open Get help.", bad: false });
      }
    } catch {
      setMessage({ text: "No connection. Not saved.", bad: true });
    }
    setSaving(false);
  };

  const mail = ticket.riderEmail
    ? `mailto:${ticket.riderEmail}?subject=${encodeURIComponent(`[DrivSync ${ticket.reference}] ${ticket.subject}`)}`
    : null;

  return (
    <li className={styles.ticket}>
      <button type="button" className={styles.ticketHead} aria-expanded={open} onClick={onToggle}>
        <span className={STATUS_STYLE[ticket.status]}>{STATUS_LABELS[ticket.status]}</span>
        <span className={styles.ticketSubject}>{ticket.subject}</span>
        <span className={styles.ticketMeta}>
          {ticket.reference} · {ticket.createdLabel}
          {ticket.riderName ? ` · ${ticket.riderName}` : ""}
        </span>
      </button>

      {open && (
        <div className={styles.ticketBody}>
          <section>
            <h2>Message</h2>
            {ticket.message ? (
              <p className={styles.message}>{ticket.message}</p>
            ) : (
              <p className={styles.muted}>Sent before messages were saved with tickets. It&apos;s in the email with this reference.</p>
            )}
          </section>

          <dl className={styles.details}>
            <div>
              <dt>Topic</dt>
              <dd>{ticket.topic || "None"}</dd>
            </div>
            <div>
              <dt>From</dt>
              <dd>
                {ticket.riderName ?? "Name not available"}
                {ticket.riderEmail ? ` · ${ticket.riderEmail}` : ""}
              </dd>
            </div>
            <div>
              <dt>Sent</dt>
              <dd>{ticket.channel === "emailApp" ? "Through the rider's email app" : "Through the app"}</dd>
            </div>
            {ticket.deviceInfo && (
              <div>
                <dt>App details</dt>
                <dd>{ticket.deviceInfo}</dd>
              </div>
            )}
          </dl>

          <section>
            <h2>Status</h2>
            <div className={styles.statusPicker} role="group" aria-label="Status">
              {TICKET_STATUSES.map((s) => (
                <button key={s} type="button" disabled={saving} aria-pressed={ticket.status === s} className={ticket.status === s ? styles.statusChosen : styles.statusChoice} onClick={() => ticket.status !== s && save(s, note)}>
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2>Note for the rider</h2>
            <textarea rows={3} maxLength={NOTE_LIMIT} aria-label="Note for the rider" placeholder="The rider sees this in the app." value={note} onChange={(e) => setNote(e.target.value)} />
            <div className={styles.actions}>
              <button type="button" className={styles.primary} disabled={saving || note.trim() === ticket.teamNote} onClick={() => save(ticket.status, note)}>
                {saving ? "Saving…" : "Save note"}
              </button>
              {mail && (
                <a className={styles.secondary} href={mail}>
                  Reply by email
                </a>
              )}
            </div>
          </section>

          {message && (
            <p className={message.bad ? styles.problem : styles.saved} role="status">
              {message.text}
            </p>
          )}
        </div>
      )}
    </li>
  );
}
