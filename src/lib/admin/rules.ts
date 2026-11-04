/** Plain rules with no outside dependencies, so the tests can load them directly. */

export const IDLE_LIMIT_MS = 30 * 60 * 1000;
export const SESSION_LIMIT_MS = 8 * 60 * 60 * 1000;
export const SEEN_WRITE_EVERY_MS = 5 * 60 * 1000;

const MAX_LOCK_MS = 60 * 60 * 1000;
const FREE_TRIES = 5;

/** 5 wrong tries lock sign-in for 15 minutes, then 30, then an hour at most. */
export function lockAfter(fails: number): number {
  if (fails < FREE_TRIES) return 0;
  return Math.min(15 * 60 * 1000 * 2 ** (fails - FREE_TRIES), MAX_LOCK_MS);
}

export function sessionAlive(createdAt: number, lastSeenAt: number, now: number): boolean {
  return now - createdAt < SESSION_LIMIT_MS && now - lastSeenAt < IDLE_LIMIT_MS;
}

export type TicketStatus = "open" | "in_progress" | "fixed";
export const TICKET_STATUSES: TicketStatus[] = ["open", "in_progress", "fixed"];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Pending",
  in_progress: "In progress",
  fixed: "Fixed",
};

/** Reads a stored status the way the app does: anything unknown counts as pending. */
export function readStatus(value: unknown): TicketStatus {
  const text = typeof value === "string" ? value.trim().toLowerCase().replace(/[\s-]+/g, "_") : "";
  if (text === "in_progress" || text === "inprogress") return "in_progress";
  if (["fixed", "resolved", "closed", "done"].includes(text)) return "fixed";
  return "open";
}

export const NOTE_LIMIT = 1000;

export type TicketChange = { uid: string; reference: string; status: TicketStatus; note: string };

/** A ticket change from the admin page, checked; null when anything is off. */
export function readTicketChange(body: unknown): TicketChange | null {
  if (typeof body !== "object" || body === null) return null;
  const { uid, reference, status, note } = body as Record<string, unknown>;
  if (typeof uid !== "string" || !/^[A-Za-z0-9]{1,128}$/.test(uid)) return null;
  if (typeof reference !== "string" || !/^FS-[A-Z0-9]{6}$/.test(reference)) return null;
  if (typeof status !== "string" || !TICKET_STATUSES.includes(status as TicketStatus)) return null;
  if (typeof note !== "string" || note.length > NOTE_LIMIT) return null;
  return { uid, reference, status: status as TicketStatus, note: note.trim() };
}

/** Whether a page's request came from this same site. */
export function sameOrigin(origin: string | null, host: string | null): boolean {
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** The private address: letters, digits and dashes, long enough that it can't be guessed. */
export const validAdminPath = (path: string | undefined): path is string =>
  typeof path === "string" && /^[a-z0-9-]{16,64}$/.test(path);
