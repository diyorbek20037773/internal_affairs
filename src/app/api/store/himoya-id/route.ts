import { NextRequest } from "next/server";
import { HimoyaIdSchema } from "@/lib/storage/trainingSchema";
import * as store from "@/lib/storage/serverStore";
import { storeDisabled, storeError } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const off = storeDisabled();
  if (off) return off;
  const traineeId = req.nextUrl.searchParams.get("traineeId");
  try {
    if (traineeId) return Response.json({ himoyaId: (await store.getHimoyaId(traineeId)) ?? null });
    return Response.json({ items: await store.listHimoyaIds() });
  } catch (e) {
    return storeError("store/himoya-id", e);
  }
}

export async function PUT(req: NextRequest) {
  const off = storeDisabled();
  if (off) return off;
  const parsed = HimoyaIdSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });
  try {
    await store.saveHimoyaId(parsed.data);
    return Response.json({ ok: true });
  } catch (e) {
    return storeError("store/himoya-id", e);
  }
}
