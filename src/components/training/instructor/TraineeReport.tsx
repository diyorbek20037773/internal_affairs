"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FileDown, Printer, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExamSignoff, HimoyaId, TraineeProfile, TrainingSession } from "@/lib/storage/trainingSchema";
import { getScenario, getExamScenario } from "@/data/scenarios";
import { COMPETENCIES, COMPETENCY_LABELS } from "@/data/scenarios/competencies";
import { localized } from "@/data/sops/types";
import { formatDate } from "@/lib/utils";
import { avgScore } from "./cabinetFilters";
import type { ReportDoc } from "@/lib/pdf/traineeReport";

/**
 * Printable trainee report (Klaster-ID + sessions + exam sign-offs). Two ways
 * out: the browser's print dialog (`@media print` in globals.css keeps only
 * `#h360-print` on the page) and a real PDF from `/api/report/pdf` — the
 * component sends its already-localised rows, the server lays them out.
 */
export function TraineeReport({
  profile,
  traineeId,
  himoyaId,
  sessions,
  signoffs,
  instructorName,
  onClose,
}: {
  profile?: TraineeProfile;
  traineeId: string;
  himoyaId?: HimoyaId;
  sessions: TrainingSession[];
  signoffs: ExamSignoff[];
  instructorName: string;
  onClose: () => void;
}) {
  const t = useTranslations("sim.instructor.report");
  const ti = useTranslations("sim.instructor");
  const locale = useLocale();
  const completed = sessions.filter((s) => s.status === "completed");
  const confirmed = completed.filter((s) => s.debrief?.status === "confirmed");
  const avg = himoyaId ? Math.round(COMPETENCIES.reduce((a, c) => a + himoyaId.scores[c], 0) / COMPETENCIES.length) : null;
  const [busy, setBusy] = useState(false);

  const buildDoc = (): ReportDoc => ({
    locale: (["uz", "ru", "en"].includes(locale) ? locale : "uz") as ReportDoc["locale"],
    labels: {
      title: t("title"), generated: t("generated"), instructor: t("instructor"), trainee: t("trainee"),
      exams: ti("exams"), sessions: ti("allSessions"), date: ti("date"), scenario: ti("scenario"), score: ti("score"), debrief: t("debrief"),
      confirmed: ti("signed"), provisional: ti("awaitingSignoff"),
    },
    trainee: {
      name: profile?.name ?? traineeId,
      badge: profile?.badgeId ?? "",
      meta: [profile?.rank, profile?.district].filter(Boolean).join(" · "),
    },
    generatedAt: formatDate(new Date().toISOString(), locale),
    instructorName,
    himoya: {
      avg,
      rows: COMPETENCIES.map((c) => ({ label: localized(COMPETENCY_LABELS[c], locale), value: himoyaId && (himoyaId.samples[c] ?? 0) > 0 ? himoyaId.scores[c] : null })),
    },
    summary: t("summary", { total: completed.length, confirmed: confirmed.length }),
    exams: signoffs.slice(0, 50).map((x) => {
      const ex = getExamScenario(x.examId.split("~")[0]);
      return {
        title: ex ? localized(ex.title, locale) : x.examId,
        verdict: ti(`verdict.${x.verdict}`),
        tone: x.verdict === "passed" ? "ok" : x.verdict === "failed" ? "bad" : "neutral",
        date: formatDate(x.updatedAt, locale),
        by: x.signedByName || x.signedBy.slice(0, 8),
        note: x.note || undefined,
      };
    }),
    sessions: completed.slice(0, 200).map((s) => {
      const sc = getScenario(s.scenarioId);
      return {
        date: formatDate(s.endedAt ?? s.updatedAt, locale),
        scenario: sc ? `${sc.code} — ${localized(sc.title, locale)}` : s.scenarioId,
        score: String(avgScore(s) ?? "—"),
        debrief: s.debrief ? (s.debrief.status === "confirmed" ? "✓" : "…") : "—",
      };
    }),
  });

  const downloadPdf = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/report/pdf", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(buildDoc()) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `klaster-${(profile?.badgeId ?? traineeId).replace(/[^\w-]+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (e) {
      console.error("[report/pdf]", e);
      toast.error(t("pdfFailed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="space-y-4 p-4 print:border-0 print:p-0 print:shadow-none" id="h360-print" data-testid="trainee-report">
      <div className="flex items-start justify-between gap-3 print:hidden">
        <h3 className="text-lg font-bold tracking-tight">{t("title")}</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="accent" onClick={downloadPdf} disabled={busy} data-testid="report-pdf"><FileDown className="mr-1 h-4 w-4" /> {t("download")}</Button>
          <Button size="sm" variant="outline" onClick={() => window.print()} data-testid="report-print"><Printer className="mr-1 h-4 w-4" /> {t("print")}</Button>
          <Button size="icon" variant="ghost" className="h-9 w-9" onClick={onClose} aria-label={ti("close")}><X className="h-4 w-4" /></Button>
        </div>
      </div>

      <header className="border-b pb-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{"O'quv klasteri"} · {t("title")}</p>
        <p className="text-xl font-bold">{profile?.name ?? traineeId}</p>
        <p className="text-sm text-muted-foreground">
          {profile?.badgeId ?? "—"}{profile?.rank ? ` · ${profile.rank}` : ""}{profile?.district ? ` · ${profile.district}` : ""}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{t("generated")}: {formatDate(new Date().toISOString(), locale)} · {t("instructor")}: {instructorName}</p>
      </header>

      <section>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Klaster-ID {avg != null && <Badge>{avg}%</Badge>}
        </h4>
        <table className="w-full text-sm">
          <tbody>
            {COMPETENCIES.map((c) => {
              const v = himoyaId && (himoyaId.samples[c] ?? 0) > 0 ? himoyaId.scores[c] : null;
              return (
                <tr key={c} className="border-t">
                  <td className="py-1 pr-2">{localized(COMPETENCY_LABELS[c], locale)}</td>
                  <td className="w-40 py-1">
                    <div className="h-2 w-full rounded bg-muted print:border print:border-black/30">
                      <div className="h-2 rounded bg-primary print:bg-black" style={{ width: `${v ?? 0}%` }} />
                    </div>
                  </td>
                  <td className="w-12 py-1 text-right font-mono text-xs">{v ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-1 text-xs text-muted-foreground">{t("summary", { total: completed.length, confirmed: confirmed.length })}</p>
      </section>

      {signoffs.length > 0 && (
        <section>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{ti("exams")}</h4>
          <ul className="space-y-1 text-sm">
            {signoffs.map((x) => {
              const ex = getExamScenario(x.examId.split("~")[0]);
              return (
                <li key={x.examId} className="flex flex-wrap items-center gap-2 border-t py-1">
                  <span className="font-medium">{ex ? localized(ex.title, locale) : x.examId}</span>
                  <Badge variant={x.verdict === "passed" ? "success" : x.verdict === "failed" ? "destructive" : "secondary"}>{ti(`verdict.${x.verdict}`)}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(x.updatedAt, locale)} · {x.signedByName || x.signedBy.slice(0, 8)}</span>
                  {x.note && <span className="w-full text-xs text-muted-foreground">{x.note}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section>
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{ti("allSessions")} ({completed.length})</h4>
        <table className="w-full text-xs">
          <thead className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="py-1">{ti("date")}</th><th className="py-1">{ti("scenario")}</th><th className="py-1 text-right">{ti("score")}</th><th className="py-1 text-right">{t("debrief")}</th></tr>
          </thead>
          <tbody>
            {completed.slice(0, 60).map((s) => {
              const sc = getScenario(s.scenarioId);
              const a = avgScore(s);
              return (
                <tr key={s.id} className="border-t">
                  <td className="py-1 pr-2 whitespace-nowrap">{formatDate(s.endedAt ?? s.updatedAt, locale)}</td>
                  <td className="py-1 pr-2">{sc ? `${sc.code} — ${localized(sc.title, locale)}` : s.scenarioId}</td>
                  <td className="py-1 text-right font-mono">{a ?? "—"}</td>
                  <td className="py-1 text-right">{s.debrief ? (s.debrief.status === "confirmed" ? "✓" : "…") : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <footer className="hidden border-t pt-6 text-xs print:block">
        <div className="flex justify-between">
          <span>{t("instructor")}: ____________________</span>
          <span>{t("trainee")}: ____________________</span>
        </div>
      </footer>
    </Card>
  );
}
