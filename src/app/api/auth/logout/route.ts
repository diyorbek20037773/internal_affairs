import { NextRequest } from "next/server";
import { cookieHeader } from "@/lib/auth/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return Response.json({ ok: true }, { headers: { "set-cookie": cookieHeader(null, req) } });
}
