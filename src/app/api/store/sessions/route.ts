import { NextRequest } from "next/server";
import { TrainingSessionSchema } from "@/lib/storage/trainingSchema";
import * as store from "@/lib/storage/serverStore";
import { canAccess, FORBIDDEN, isResponse, requireUser, storeError } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (isResponse(user)) return user;
  const id = req.nextUrl.searchParams.get("id");
  const traineeId = req.nextUrl.searchParams.get("traineeId") || undefined;
  try {
    if (id) {
      const s = await store.getSession(id);
      if (s && !canAccess(user, s.traineeId)) return FORBIDDEN();
      return Response.json({ session: s ?? null });
    }
    if (user.role !== "instructor") return Response.json({ items: await store.listSessions(user.id) });
    return Response.json({ items: await store.listSessions(traineeId) });
  } catch (e) {
    return storeError("store/sessions", e);
  }
}

export async function PUT(req: NextRequest) {
  const user = await requireUser(req);
  if (isResponse(user)) return user;
  const body = await req.json().catch(() => null);
  // Accept one session or a batch (client-side sync of local-only sessions).
  const list = Array.isArray(body?.items) ? body.items : [body];
  const items = [];
  for (const raw of list) {
    const p = TrainingSessionSchema.safeParse(raw);
    if (!p.success) return Response.json({ error: "bad_request" }, { status: 400 });
    if (!canAccess(user, p.data.traineeId)) return FORBIDDEN();
    items.push(p.data);
  }
  try {
    for (const s of items) await store.saveSession(s);
    return Response.json({ ok: true, count: items.length });
  } catch (e) {
    return storeError("store/sessions", e);
  }
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser(req);
  if (isResponse(user)) return user;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return Response.json({ error: "bad_request" }, { status: 400 });
  try {
    const s = await store.getSession(id);
    if (s && !canAccess(user, s.traineeId)) return FORBIDDEN();
    await store.removeSession(id);
    return Response.json({ ok: true });
  } catch (e) {
    return storeError("store/sessions", e);
  }
}
