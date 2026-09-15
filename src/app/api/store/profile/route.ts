import { NextRequest } from "next/server";
import { TraineeProfileSchema } from "@/lib/storage/trainingSchema";
import * as store from "@/lib/storage/serverStore";
import { roleOf } from "@/lib/auth/server";
import { FORBIDDEN, isResponse, requireUser, storeError } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (isResponse(user)) return user;
  const id = req.nextUrl.searchParams.get("id");
  try {
    if (id) {
      if (user.role !== "instructor" && id !== user.id) return FORBIDDEN();
      return Response.json({ profile: await store.getProfile(id) });
    }
    if (user.role !== "instructor") {
      return Response.json({ items: [await store.getProfile(user.id)].filter(Boolean) });
    }
    return Response.json({ items: await store.listProfiles() });
  } catch (e) {
    return storeError("store/profile", e);
  }
}

export async function PUT(req: NextRequest) {
  const user = await requireUser(req);
  if (isResponse(user)) return user;
  const parsed = TraineeProfileSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });
  if (user.role !== "instructor" && parsed.data.id !== user.id) return FORBIDDEN();
  try {
    // Role and badge are owned by h360_auth: the client cannot change them here.
    const role = (await roleOf(parsed.data.id)) ?? parsed.data.role;
    const badgeId = parsed.data.id === user.id ? user.badgeId : parsed.data.badgeId;
    await store.saveProfile({ ...parsed.data, role, badgeId });
    return Response.json({ ok: true });
  } catch (e) {
    return storeError("store/profile", e);
  }
}
