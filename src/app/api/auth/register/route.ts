import { NextRequest } from "next/server";
import { authEnabled, cookieHeader, issueToken, register } from "@/lib/auth/server";
import { uid } from "@/lib/utils";
import type { TraineeProfile } from "@/lib/storage/trainingSchema";
import { RegisterSchema } from "../_schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!authEnabled()) return Response.json({ error: "auth_disabled" }, { status: 501 });
  const parsed = RegisterSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });
  const { badgeId, pin, name, rank, district } = parsed.data;
  const profile: TraineeProfile = {
    id: uid(),
    badgeId,
    name,
    rank,
    district,
    role: "trainee", // overwritten by INSTRUCTOR_BADGES inside register()
    createdAt: new Date().toISOString(),
  };
  try {
    const r = await register(badgeId, pin, profile);
    if (r === "exists") return Response.json({ error: "badge_taken" }, { status: 409 });
    return Response.json(
      { profile: { ...profile, role: r.role } },
      { status: 201, headers: { "set-cookie": cookieHeader(issueToken(r.id), req) } }
    );
  } catch (e) {
    console.error("[auth/register]", e);
    return Response.json({ error: "store_unavailable" }, { status: 503 });
  }
}
