import { dbEnabled, query } from "@/lib/db/pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Store health: `{ mode: "postgres" | "local" }`. The client picks the hybrid repo from this. */
export async function GET() {
  if (!dbEnabled()) return Response.json({ mode: "local", ok: true });
  try {
    await query("SELECT 1");
    return Response.json({ mode: "postgres", ok: true });
  } catch (e) {
    console.error("[store] health", e);
    return Response.json({ mode: "local", ok: false, error: "store_unavailable" }, { status: 503 });
  }
}
