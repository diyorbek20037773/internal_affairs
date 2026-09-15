import { NextRequest } from "next/server";
import { ExamSignoffSchema } from "@/lib/storage/trainingSchema";
import * as store from "@/lib/storage/serverStore";
import { canAccess, FORBIDDEN, isResponse, requireUser, storeError } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Exam sign-offs: a trainee reads their own, an instructor reads all and is the only one who can write. */
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (isResponse(user)) return user;
  const traineeId = req.nextUrl.searchParams.get("traineeId") ?? (user.role === "instructor" ? undefined : user.id);
  if (traineeId && !canAccess(user, traineeId)) return FORBIDDEN();
  try {
    return Response.json({ items: await store.listSignoffs(traineeId) });
  } catch (e) {
    return storeError("store/signoffs", e);
  }
}

export async function PUT(req: NextRequest) {
  const user = await requireUser(req);
  if (isResponse(user)) return user;
  if (user.role !== "instructor") return FORBIDDEN();
  const parsed = ExamSignoffSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });
  try {
    // The signer is the logged-in instructor, whatever the client sent.
    await store.saveSignoff({ ...parsed.data, signedBy: user.id });
    return Response.json({ ok: true });
  } catch (e) {
    return storeError("store/signoffs", e);
  }
}
