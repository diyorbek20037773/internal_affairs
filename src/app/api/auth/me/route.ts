import { NextRequest } from "next/server";
import { authEnabled, getSessionUser } from "@/lib/auth/server";
import * as store from "@/lib/storage/serverStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** `{ enabled, profile }` — profile is null when auth is on but nobody is logged in. */
export async function GET(req: NextRequest) {
  if (!authEnabled()) return Response.json({ enabled: false, profile: null });
  try {
    const user = await getSessionUser(req);
    const profile = user ? await store.getProfile(user.id) : null;
    return Response.json({ enabled: true, profile: profile ? { ...profile, role: user!.role } : null });
  } catch (e) {
    console.error("[auth/me]", e);
    return Response.json({ enabled: true, profile: null, error: "store_unavailable" }, { status: 503 });
  }
}
