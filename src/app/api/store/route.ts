import { NextRequest } from "next/server";
import { query } from "@/lib/db/pg";
import { authEnabled, getSessionUser } from "@/lib/auth/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Store health: `{ mode: "postgres" | "local", authenticated }`. The client
 * uses the server only when mode is postgres AND it is logged in; otherwise
 * it stays on localStorage until the user signs in on /profil.
 */
export async function GET(req: NextRequest) {
  // No DB, or production without AUTH_SECRET → nobody can log in → the store is effectively local.
  if (!authEnabled()) return Response.json({ mode: "local", ok: true, authenticated: false });
  try {
    await query("SELECT 1");
    const user = await getSessionUser(req);
    return Response.json({ mode: "postgres", ok: true, authenticated: Boolean(user), role: user?.role ?? null });
  } catch (e) {
    console.error("[store] health", e);
    return Response.json(
      { mode: "local", ok: false, authenticated: false, error: "store_unavailable" },
      { status: 503 }
    );
  }
}
