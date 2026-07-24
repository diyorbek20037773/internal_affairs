import { loadKeys } from "@/lib/gemini/keyPool";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: "ok",
    keysConfigured: loadKeys().length,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });
}
