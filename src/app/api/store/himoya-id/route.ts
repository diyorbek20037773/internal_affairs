import { NextRequest } from "next/server";
import { HimoyaIdSchema } from "@/lib/storage/trainingSchema";
import * as store from "@/lib/storage/serverStore";
import { canAccess, FORBIDDEN, isResponse, requireUser, storeError } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (isResponse(user)) return user;
  const traineeId = req.nextUrl.searchParams.get("traineeId");
  try {
    if (traineeId) {
      if (!canAccess(user, traineeId)) return FORBIDDEN();
      return Response.json({ himoyaId: (await store.getHimoyaId(traineeId)) ?? null });
    }
    if (user.role !== "instructor") {
      return Response.json({ items: [await store.getHimoyaId(user.id)].filter(Boolean) });
    }
    return Response.json({ items: await store.listHimoyaIds() });
  } catch (e) {
    return storeError("store/himoya-id", e);
  }
}

export async function PUT(req: NextRequest) {
  const user = await requireUser(req);
  if (isResponse(user)) return user;
  const parsed = HimoyaIdSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });
  if (!canAccess(user, parsed.data.traineeId)) return FORBIDDEN();
  let h = parsed.data;
  // A trainee may only add/refresh PROVISIONAL entries; finalised ones stay as the instructor left them.
  if (user.role !== "instructor") {
    const prev = await store.getHimoyaId(h.traineeId).catch(() => undefined);
    const finalised = new Map((prev?.history ?? []).filter((e) => e.provisional === false).map((e) => [e.sessionId, e]));
    h = {
      ...h,
      history: h.history.map((e) => (e.provisional === false ? finalised.get(e.sessionId) ?? { ...e, provisional: true } : e)),
    };
  }
  try {
    await store.saveHimoyaId(h);
    return Response.json({ ok: true });
  } catch (e) {
    return storeError("store/himoya-id", e);
  }
}
