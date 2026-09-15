import { loadKeys } from "@/lib/gemini/keyPool";
import { dbEnabled } from "@/lib/db/pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: "ok",
    keysConfigured: loadKeys().length,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    store: dbEnabled() ? "postgres" : "local",
  });
}
