import { NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Local (no-database) mode: the instructor role on a device is unlocked with
 * the centre's code from `INSTRUCTOR_CODE`. When the variable is not set the
 * role picker is open (demo / single-instructor setups) and GET reports
 * `required: false`. In server (auth) mode roles come from `INSTRUCTOR_BADGES`
 * and this endpoint is not used.
 */
const code = () => (process.env.INSTRUCTOR_CODE ?? "").trim();

export async function GET() {
  return Response.json({ required: code().length > 0 });
}

export async function POST(req: NextRequest) {
  const expected = code();
  if (!expected) return Response.json({ ok: true });
  const body = (await req.json().catch(() => ({}))) as { code?: unknown };
  const given = typeof body.code === "string" ? body.code.trim() : "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) await new Promise((r) => setTimeout(r, 400)); // slow brute force
  return Response.json({ ok }, { status: ok ? 200 : 403 });
}
