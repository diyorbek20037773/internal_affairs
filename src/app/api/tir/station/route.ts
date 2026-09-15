import { NextRequest } from "next/server";
import { z } from "zod";
import { authEnabled, getSessionUser } from "@/lib/auth/server";
import { listLive, publish, read } from "@/lib/tir/relayStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * TIR range ⇄ instructor station relay (cross-device). With badge+PIN auth on,
 * any logged-in user may publish range state, only instructors may read a
 * range or send commands, and the live list is instructor-only. Without auth
 * (device mode / LAN) the relay is open — session ids are unguessable uuids.
 */

const Role = z.enum(["range", "station"]);
const PostSchema = z.object({
  session: z.string().min(8).max(80),
  from: Role,
  msg: z.object({ type: z.string() }).passthrough(),
  scenarioId: z.string().max(80).optional(),
  traineeId: z.string().max(80).optional(),
});

async function gate(req: NextRequest, role: "range" | "station") {
  if (!authEnabled()) return null;
  const user = await getSessionUser(req).catch(() => null);
  if (!user) return Response.json({ error: "unauthenticated" }, { status: 401 });
  if (role === "station" && user.role !== "instructor") return Response.json({ error: "forbidden" }, { status: 403 });
  return null;
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  if (p.get("list") === "1") {
    const denied = await gate(req, "station");
    if (denied) return denied;
    return Response.json({ items: listLive() });
  }
  const session = p.get("session") ?? "";
  const role = Role.safeParse(p.get("role") ?? "station");
  if (!session || !role.success) return Response.json({ error: "bad_request" }, { status: 400 });
  const denied = await gate(req, role.data);
  if (denied) return denied;
  const after = Number(p.get("after") ?? "-1");
  return Response.json(read(session, role.data, Number.isFinite(after) ? after : -1));
}

export async function POST(req: NextRequest) {
  const parsed = PostSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });
  const { session, from, msg, scenarioId, traineeId } = parsed.data;
  const denied = await gate(req, from);
  if (denied) return denied;
  const seq = publish(session, from, msg, { scenarioId, traineeId });
  return Response.json({ ok: true, seq });
}
