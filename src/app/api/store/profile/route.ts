import { NextRequest } from "next/server";
import { TraineeProfileSchema } from "@/lib/storage/trainingSchema";
import * as store from "@/lib/storage/serverStore";
import { storeDisabled, storeError } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const off = storeDisabled();
  if (off) return off;
  const id = req.nextUrl.searchParams.get("id");
  try {
    if (id) return Response.json({ profile: await store.getProfile(id) });
    return Response.json({ items: await store.listProfiles() });
  } catch (e) {
    return storeError("store/profile", e);
  }
}

export async function PUT(req: NextRequest) {
  const off = storeDisabled();
  if (off) return off;
  const parsed = TraineeProfileSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });
  try {
    await store.saveProfile(parsed.data);
    return Response.json({ ok: true });
  } catch (e) {
    return storeError("store/profile", e);
  }
}
