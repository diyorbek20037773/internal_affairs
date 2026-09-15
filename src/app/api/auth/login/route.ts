import { NextRequest } from "next/server";
import { authEnabled, cookieHeader, issueToken, login } from "@/lib/auth/server";
import * as store from "@/lib/storage/serverStore";
import { LoginSchema } from "../_schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!authEnabled()) return Response.json({ error: "auth_disabled" }, { status: 501 });
  const parsed = LoginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });
  try {
    const r = await login(parsed.data.badgeId, parsed.data.pin);
    if (r === "locked") return Response.json({ error: "locked" }, { status: 423 });
    if (r === "invalid") return Response.json({ error: "invalid_credentials" }, { status: 401 });
    const profile = await store.getProfile(r.id);
    return Response.json(
      { profile: profile ? { ...profile, role: r.role } : null },
      { headers: { "set-cookie": cookieHeader(issueToken(r.id), req) } }
    );
  } catch (e) {
    console.error("[auth/login]", e);
    return Response.json({ error: "store_unavailable" }, { status: 503 });
  }
}
