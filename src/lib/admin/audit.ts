import { FieldValue } from "firebase-admin/firestore";
import { db } from "./firebase";

export type AuditEntry = { id: string; at: string; action: string; detail: string };

/** Admin-only records. No Firestore rule allows the apps to read or write them. */
export const auditLog = () => db().collection("admin_audit");

export const auditFields = (action: string, detail: string) => ({ action, detail, at: FieldValue.serverTimestamp() });

export async function recentAudit(limit = 100): Promise<AuditEntry[]> {
  const snap = await auditLog().orderBy("at", "desc").limit(limit).get();
  return snap.docs.map((d) => ({
    id: d.id,
    at: d.get("at")?.toDate?.().toISOString() ?? "",
    action: String(d.get("action") ?? ""),
    detail: String(d.get("detail") ?? ""),
  }));
}
