import { readTicketChange } from "@/lib/admin/rules";
import { hasSession, refuseCrossSite } from "@/lib/admin/session";
import { changeTicket } from "@/lib/admin/tickets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const refused = refuseCrossSite(req);
  if (refused) return refused;
  if (!(await hasSession())) return Response.json({ error: "Please sign in again." }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const change = readTicketChange(body);
  if (!change) return Response.json({ error: "That change wasn't valid." }, { status: 422 });

  try {
    const saved = await changeTicket(change);
    if (!saved) return Response.json({ error: "This ticket no longer exists. The rider may have deleted their account." }, { status: 404 });
    return Response.json({ ok: true, ...saved });
  } catch (e) {
    console.error("[tickets] not saved", e instanceof Error ? e.message : "error");
    return Response.json({ error: "Not saved. Please try again." }, { status: 503 });
  }
}
