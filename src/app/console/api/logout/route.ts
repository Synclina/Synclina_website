import { auditFields, auditLog } from "@/lib/admin/audit";
import { endSession, hasSession, refuseCrossSite } from "@/lib/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const refused = refuseCrossSite(req);
  if (refused) return refused;
  if (await hasSession()) {
    await endSession();
    await auditLog().add(auditFields("Signed out", ""));
  }
  return Response.json({ ok: true });
}
