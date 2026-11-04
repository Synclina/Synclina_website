import { FieldValue, type DocumentSnapshot } from "firebase-admin/firestore";
import { auditFields, auditLog } from "./audit";
import { auth, db } from "./firebase";
import { STATUS_LABELS, readStatus, type TicketChange, type TicketStatus } from "./rules";

export type Ticket = {
  uid: string;
  reference: string;
  subject: string;
  topic: string;
  channel: string;
  message: string | null;
  deviceInfo: string | null;
  status: TicketStatus;
  teamNote: string;
  createdAt: string;
  updatedAt: string | null;
  riderName: string | null;
  riderEmail: string | null;
};

/** How many of the newest tickets are shown. The page says so when there are more. */
export const TICKET_LIMIT = 500;

const uidOf = (doc: DocumentSnapshot) => {
  const account = doc.ref.parent.parent;
  return account?.parent.id === "accounts" ? account.id : null;
};

const iso = (value: unknown): string | null => {
  const date = (value as { toDate?: () => Date } | null)?.toDate?.();
  return date ? date.toISOString() : null;
};

const toTicket = (doc: DocumentSnapshot, uid: string): Ticket => ({
  uid,
  reference: doc.id,
  subject: String(doc.get("subject") ?? ""),
  topic: String(doc.get("topic") ?? ""),
  channel: String(doc.get("channel") ?? "sent"),
  message: (doc.get("message") as string | undefined) ?? null,
  deviceInfo: (doc.get("deviceInfo") as string | undefined) ?? null,
  status: readStatus(doc.get("status")),
  teamNote: (doc.get("teamNote") as string | undefined) ?? "",
  createdAt: iso(doc.get("createdAt")) ?? "",
  updatedAt: iso(doc.get("updatedAt")),
  riderName: null,
  riderEmail: null,
});

const newestTickets = () => db().collectionGroup("support").orderBy("createdAt", "desc").limit(TICKET_LIMIT);

/** The tickets with each rider's name and email from their account. */
export async function listTickets(): Promise<Ticket[]> {
  const snap = await newestTickets().get();
  const tickets = snap.docs.flatMap((doc) => {
    const uid = uidOf(doc);
    return uid ? [toTicket(doc, uid)] : [];
  });

  const uids = [...new Set(tickets.map((t) => t.uid))];
  const riders = new Map<string, { name: string | null; email: string | null }>();
  try {
    for (let i = 0; i < uids.length; i += 100) {
      const { users } = await auth().getUsers(uids.slice(i, i + 100).map((uid) => ({ uid })));
      for (const u of users) riders.set(u.uid, { name: u.displayName ?? null, email: u.email ?? null });
    }
  } catch (e) {
    // Tickets still show without names if the key can't read accounts.
    console.error("[tickets] rider details not loaded", e instanceof Error ? e.message : "error");
  }
  return tickets.map((t) => ({ ...t, riderName: riders.get(t.uid)?.name ?? null, riderEmail: riders.get(t.uid)?.email ?? null }));
}

export type TicketCounts = Record<TicketStatus, number> & { total: number };

/** Counts for the overview; reads only the status of each ticket. */
export async function countTickets(): Promise<TicketCounts> {
  const snap = await newestTickets().select("status").get();
  const counts: TicketCounts = { open: 0, in_progress: 0, fixed: 0, total: 0 };
  for (const doc of snap.docs) {
    if (!uidOf(doc)) continue;
    counts[readStatus(doc.get("status"))] += 1;
    counts.total += 1;
  }
  return counts;
}

/** Saves a status and note on the rider's ticket; the app reads them from there. */
export async function changeTicket(change: TicketChange): Promise<{ updatedAt: string } | null> {
  const ref = db().collection("accounts").doc(change.uid).collection("support").doc(change.reference);
  const saved = await db().runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) return false;
    const before = readStatus(doc.get("status"));
    const noteChanged = (doc.get("teamNote") ?? "") !== change.note;
    tx.update(ref, {
      status: change.status,
      teamNote: change.note ? change.note : FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const moved = before === change.status ? STATUS_LABELS[before] : `${STATUS_LABELS[before]} → ${STATUS_LABELS[change.status]}`;
    tx.create(auditLog().doc(), auditFields("Ticket updated", `${change.reference}: ${moved}${noteChanged ? ", note changed" : ""}`));
    return true;
  });
  return saved ? { updatedAt: new Date().toISOString() } : null;
}
