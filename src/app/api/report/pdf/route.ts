import { NextRequest } from "next/server";
import { authEnabled, getSessionUser } from "@/lib/auth/server";
import { errorDetail } from "@/lib/training/apiErrors";
import { ReportDocSchema, renderTraineeReportPdf } from "@/lib/pdf/traineeReport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST a localised report document → `application/pdf`. Lets the cabinet hand
 * out a real file on tablets (no print dialog). With badge+PIN auth on, only
 * instructors may render; in device mode the payload is the client's own data.
 */
export async function POST(req: NextRequest) {
  if (authEnabled()) {
    const user = await getSessionUser(req).catch(() => null);
    if (!user) return Response.json({ error: "unauthenticated" }, { status: 401 });
    if (user.role !== "instructor") return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const parsed = ReportDocSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request", issues: parsed.error.issues.slice(0, 5) }, { status: 400 });
  try {
    const pdf = await renderTraineeReportPdf(parsed.data);
    const safe = parsed.data.trainee.badge.replace(/[^\w-]+/g, "_") || "trainee";
    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="klaster-${safe}.pdf"`,
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    console.error("[report/pdf]", e);
    return Response.json({ error: "pdf_failed", ...errorDetail(e) }, { status: 500 });
  }
}
