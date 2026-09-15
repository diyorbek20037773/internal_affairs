"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Award, AlertTriangle, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { COMPETENCIES, type CompetencyScores } from "@/data/scenarios/competencies";
import type { ExamScenario } from "@/data/scenarios/types";
import type { TrainingSession } from "@/lib/storage/trainingSchema";
import { CompetencyRadar } from "../debrief/CompetencyRadar";
import { cn } from "@/lib/utils";

export interface ExamVerdict {
  verdict: "passed" | "conditional" | "failed";
  headline: string;
  narrative: string;
  strengths: string[];
  risks: string[];
  nextWeek: string[];
  independentSituations: string[];
  supervisedSituations: string[];
  createdAt: string;
}

const key = (examId: string, traineeId: string) => `h360:exam:${examId}:${traineeId}`;

/** 16:30 — whole-day verdict, cached per trainee in localStorage. */
export function ExamSummary({ exam, sessions, traineeId }: { exam: ExamScenario; sessions: (TrainingSession | undefined)[]; traineeId: string }) {
  const t = useTranslations("sim.exam");
  const tc = useTranslations("common");
  const tk = useTranslations("sim.competencies");
  const locale = useLocale();
  const [data, setData] = useState<ExamVerdict | null>(null);
  const [loading, setLoading] = useState(false);

  const done = sessions.filter((s): s is TrainingSession => !!s && s.status === "completed");
  const stageKey = done.map((s) => s.id).join("|");

  const mean: CompetencyScores = Object.fromEntries(
    COMPETENCIES.map((c) => [c, done.length ? Math.round(done.reduce((a, s) => a + (s.finalScores?.[c] ?? s.debrief?.scores[c] ?? 50), 0) / done.length) : 0])
  ) as CompetencyScores;

  const generate = async (force = false) => {
    if (loading) return;
    const k = key(exam.id, traineeId);
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(k) || "null") as (ExamVerdict & { stageKey?: string }) | null;
        if (cached && cached.stageKey === stageKey) { setData(cached); return; }
      } catch {}
    }
    setLoading(true);
    try {
      const res = await fetch("/api/sim/exam-summary", {
        method: "POST",
        signal: AbortSignal.timeout(90000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          examId: exam.id,
          stages: exam.stages.map((st, i) => {
            const s = sessions[i];
            return {
              time: st.time,
              scenarioId: st.scenarioId,
              outcome: s?.payload.kind === "tir" ? s.payload.outcome : s?.payload.kind === "dialog" ? s.payload.endReason : s?.status,
              scores: s?.finalScores ?? s?.debrief?.scores,
              summary: s?.debrief?.summary,
              mistakes: s?.debrief?.mistakes.map((m) => `${m.ref}: ${m.text}`),
            };
          }),
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(j.error === "no_keys_configured" ? tc("noKeys") : j.error === "ai_unavailable" ? tc("aiUnavailable") : tc("errorGeneric"));
        return;
      }
      const v = (await res.json()) as ExamVerdict;
      setData(v);
      try { localStorage.setItem(k, JSON.stringify({ ...v, stageKey })); } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageKey]);

  const tone = data?.verdict === "passed" ? "success" : data?.verdict === "conditional" ? "accent" : "destructive";

  return (
    <Card className={cn("overflow-hidden", data && (data.verdict === "passed" ? "border-success/40" : data.verdict === "conditional" ? "border-accent/40" : "border-destructive/40"))}>
      <div className="brand-gradient p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">16:30 · {t("finalStage")}</p>
        {data ? (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {data.verdict === "passed" ? <Award className="h-8 w-8 text-emerald-300" /> : <AlertTriangle className={cn("h-8 w-8", data.verdict === "conditional" ? "text-amber-300" : "text-red-300")} />}
            <div>
              <p className="text-xl font-bold">{t(`verdict.${data.verdict}`)}</p>
              <p className="text-sm text-white/85">{data.headline}</p>
            </div>
          </div>
        ) : (
          <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> {t("summaryLoading")}
          </p>
        )}
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-[240px_1fr]">
        <div>
          <CompetencyRadar scores={mean} />
          <ul className="mt-2 space-y-1 text-xs">
            {COMPETENCIES.map((c) => (
              <li key={c} className="flex justify-between"><span>{tk(c)}</span><span className="font-mono">{mean[c]}</span></li>
            ))}
          </ul>
        </div>
        {data ? (
          <div className="space-y-4 text-sm">
            <p className="leading-relaxed">{data.narrative}</p>
            <Section icon={<ShieldCheck className="h-4 w-4 text-success" />} title={t("independent")} items={data.independentSituations} />
            <Section icon={<AlertTriangle className="h-4 w-4 text-accent" />} title={t("supervised")} items={data.supervisedSituations} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Section title={t("strengths")} items={data.strengths} />
              <Section title={t("risks")} items={data.risks} />
            </div>
            <Section icon={<Sparkles className="h-4 w-4 text-primary" />} title={t("nextWeek")} items={data.nextWeek} />
            <div className="flex items-center justify-between border-t pt-3">
              <Badge variant={tone}>{t(`verdict.${data.verdict}`)}</Badge>
              <Button variant="ghost" size="sm" onClick={() => void generate(true)} disabled={loading}>
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> {t("regenerate")}
              </Button>
            </div>
            <p className="text-xs italic text-muted-foreground">{t("passed")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
      </div>
    </Card>
  );
}

function Section({ icon, title, items }: { icon?: React.ReactNode; title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{icon}{title}</p>
      <ul className="space-y-1">
        {items.map((x, i) => (
          <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />{x}</li>
        ))}
      </ul>
    </div>
  );
}
