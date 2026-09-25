"use client";

import { useLocale, useTranslations } from "next-intl";
import { Award, AlertTriangle, CheckCircle2, IdCard, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { localized } from "@/data/sops/types";
import type { KasbSimResult, ProfessionSim } from "@/data/kasblar/types";
import { outcome } from "@/lib/kasb/simEngine";
import { cn } from "@/lib/utils";

const bar = (v: number) => (v >= 75 ? "bg-success" : v >= 50 ? "bg-accent" : "bg-destructive");

export function ResultScreen({
  sim,
  result,
  compLabel,
  onRetry,
}: {
  sim: ProfessionSim;
  result: KasbSimResult;
  compLabel: (id: string) => string;
  onRetry: () => void;
}) {
  const t = useTranslations("kasbsim.result");
  const locale = useLocale();
  const total = result.total ?? 0;
  const out = outcome(total);
  const byStage = new Map(result.stages.map((s) => [s.stageId, s]));
  const anyUngraded = result.stages.some((s) => s.ungraded);

  return (
    <div className="mx-auto max-w-3xl space-y-4" data-testid="kasb-result">
      <Card
        className={cn(
          "p-6 text-center",
          out === "success" ? "border-success/40 bg-success/5" : out === "fail" ? "border-destructive/40 bg-destructive/5" : "border-accent/40 bg-accent/5"
        )}
      >
        {out === "success" ? <Award className="mx-auto h-12 w-12 text-success" /> : <AlertTriangle className={cn("mx-auto h-12 w-12", out === "fail" ? "text-destructive" : "text-accent")} />}
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {sim.code} · {localized(sim.title, locale)}
        </p>
        <p className="mt-2 text-5xl font-bold tabular-nums">{total}%</p>
        <p className="mt-1 text-lg font-semibold">{t(`outcome.${out}`)}</p>
        {anyUngraded && <p className="mt-2 text-xs text-muted-foreground">{t("ungradedNote")}</p>}
      </Card>

      <Card className="space-y-3 p-5">
        <h3 className="font-bold">{t("competencies")}</h3>
        {Object.entries(result.competencyScores).map(([id, v]) => (
          <div key={id}>
            <div className="mb-1 flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0 truncate">{compLabel(id)}</span>
              <b className="tabular-nums">{v}%</b>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full rounded-full transition-all", bar(v))} style={{ width: `${v}%` }} />
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-5">
        <h3 className="mb-2 font-bold">{t("stages")}</h3>
        <ol className="divide-y">
          {sim.stages.map((s, i) => {
            const r = byStage.get(s.id);
            return (
              <li key={s.id} className="flex items-center gap-3 py-2 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{i + 1}</span>
                <span className="min-w-0 flex-1">{localized(s.title, locale)}</span>
                <b className={cn("tabular-nums", !r || r.ungraded ? "text-muted-foreground" : r.score >= 75 ? "text-success" : r.score >= 50 ? "text-accent" : "text-destructive")}>
                  {!r ? "—" : r.ungraded ? t("ungraded") : `${r.score}%`}
                </b>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card className="flex flex-col items-start gap-3 border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center">
        <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
        <p className="flex-1 text-sm font-medium">{t("passportAdded")}</p>
        <Button asChild className="min-h-11">
          <Link href="/pasport">
            <IdCard className="h-4 w-4" /> {t("toPassport")}
          </Link>
        </Button>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="min-h-11" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" /> {t("retry")}
        </Button>
        <Button variant="ghost" asChild className="min-h-11">
          <Link href="/kasb-simulyator">
            <ArrowLeft className="h-4 w-4" /> {t("backToHub")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
