"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, ArrowRight, CheckCircle2, Flag, Layers, Play, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { localized } from "@/data/sops/types";
import type { KasbSimResult, ProfessionSim, StageResult } from "@/data/kasblar/types";
import { getProfession } from "@/data/kasblar";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { kasbRepo } from "@/lib/storage/kasb";
import { finishResult, scoreTask, withStage, type SimAnswer } from "@/lib/kasb/simEngine";
import { uid } from "@/lib/utils";
import { ProfileGate } from "@/components/training/profile/ProfileGate";
import { EnvPanel } from "./env/EnvPanel";
import { ChoiceWidget, GridWidget, MatchWidget, MultiWidget, NumericWidget, OrderWidget } from "./tasks/TaskWidgets";
import { TextTaskWidget, type TextGradeExtra } from "./tasks/TextTaskWidget";
import { TaskReview } from "./tasks/TaskReview";
import { ResultScreen } from "./ResultScreen";
import { cn } from "@/lib/utils";

/** Entry: requires a trainee profile, then runs the profession simulator. */
export function KasbSimClient({ sim }: { sim: ProfessionSim }) {
  const { profile, loaded } = useTraineeProfile();
  if (!loaded) return null;
  if (!profile) return <ProfileGate />;
  return <KasbRunner sim={sim} traineeId={profile.id} />;
}

type Phase = "intro" | "task" | "review" | "done";
interface Review {
  answer: SimAnswer;
  score: number;
  ungraded?: boolean;
  extra?: TextGradeExtra;
}

function newResult(sim: ProfessionSim, traineeId: string): KasbSimResult {
  return {
    id: uid(),
    simId: sim.id,
    professionId: sim.professionId,
    traineeId,
    startedAt: new Date().toISOString(),
    stages: [],
    competencyScores: {},
  };
}

export function scoreTone(score: number) {
  return score >= 75 ? "text-success" : score >= 50 ? "text-accent" : "text-destructive";
}

function KasbRunner({ sim, traineeId }: { sim: ProfessionSim; traineeId: string }) {
  const t = useTranslations("kasbsim");
  const locale = useLocale();
  const [result, setResult] = useState<KasbSimResult>(() => newResult(sim, traineeId));
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [review, setReview] = useState<Review | null>(null);
  const [showEnv, setShowEnv] = useState(true);

  const stage = sim.stages[idx];
  const materials = useMemo(() => sim.stages.slice(0, idx + 1).flatMap((s) => s.materials), [sim, idx]);
  const newIds = useMemo(() => new Set(stage?.materials.map((m) => m.id) ?? []), [stage]);
  const profession = getProfession(sim.professionId);
  const compLabel = useCallback(
    (id: string) => {
      const c = profession?.competencies.find((x) => x.id === id);
      return c ? localized(c.label, locale) : id;
    },
    [profession, locale]
  );

  // Scroll to top of the task column on stage change (tablets: long pages).
  useEffect(() => {
    if (phase === "task" && typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx, phase]);

  const submit = (answer: SimAnswer, extra?: TextGradeExtra) => {
    const s = scoreTask(stage.task, answer);
    const feedback =
      extra?.feedback ??
      (stage.task.kind === "choice" && answer.kind === "choice"
        ? localized(stage.task.options.find((o) => o.id === answer.optionId)?.feedback ?? { uz: "" }, locale)
        : undefined);
    const sr: StageResult = { stageId: stage.id, score: s.score, answer, feedback: feedback || undefined, ungraded: s.ungraded || undefined };
    let next = withStage(sim, result, sr);
    if (idx === sim.stages.length - 1) next = finishResult(sim, next);
    setResult(next);
    void kasbRepo.saveResult(next);
    setReview({ answer, score: s.score, ungraded: s.ungraded, extra });
    setPhase("review");
  };

  const proceed = () => {
    setReview(null);
    if (idx >= sim.stages.length - 1) {
      setPhase("done");
      return;
    }
    setIdx(idx + 1);
    setPhase("task");
  };

  const restart = () => {
    setResult(newResult(sim, traineeId));
    setIdx(0);
    setReview(null);
    setPhase("intro");
  };

  if (phase === "done") return <ResultScreen sim={sim} result={result} compLabel={compLabel} onRetry={restart} />;

  const header = (
    <Card className="flex flex-wrap items-center gap-3 p-3 md:p-4">
      <Badge variant="outline" className="font-mono">
        {sim.code}
      </Badge>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold md:text-lg">{localized(sim.title, locale)}</h1>
        <p className="truncate text-xs text-muted-foreground">{localized(sim.setting, locale)}</p>
      </div>
      {phase !== "intro" && (
        <div className="flex items-center gap-1" aria-label={t("run.stageOf", { n: idx + 1, total: sim.stages.length })}>
          {sim.stages.map((s, i) => {
            const r = result.stages.find((x) => x.stageId === s.id);
            return (
              <span
                key={s.id}
                className={cn(
                  "h-2.5 w-5 rounded-full",
                  r ? (r.ungraded ? "bg-muted-foreground/40" : r.score >= 75 ? "bg-success" : r.score >= 50 ? "bg-accent" : "bg-destructive") : i === idx ? "bg-primary" : "bg-muted"
                )}
              />
            );
          })}
        </div>
      )}
    </Card>
  );

  if (phase === "intro") {
    return (
      <div className="space-y-4">
        {header}
        <Card className="space-y-4 p-5 md:p-6">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">{t(`envKind.${sim.env}`)}</Badge>
            <Badge variant="secondary">{t("hub.minutes", { n: sim.minutes })}</Badge>
            <Badge variant="secondary">{t("hub.stages", { n: sim.stages.length })}</Badge>
            {profession && <Badge variant="outline">{localized(profession.title, locale)}</Badge>}
          </div>
          <p className="text-base leading-relaxed">{localized(sim.intro, locale)}</p>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("run.trains")}</p>
            <div className="flex flex-wrap gap-1.5">
              {[...new Set(sim.stages.flatMap((s) => s.competencies))].map((c) => (
                <Badge key={c} variant="outline" className="font-normal">
                  {compLabel(c)}
                </Badge>
              ))}
            </div>
          </div>
          <Button size="lg" className="min-h-12" onClick={() => setPhase("task")} data-testid="kasb-start">
            <Play className="h-4 w-4" /> {t("run.begin")}
          </Button>
        </Card>
      </div>
    );
  }

  const task = stage.task;
  const seed = `${sim.id}:${stage.id}`;

  return (
    <div className="space-y-4">
      {header}
      <div className="flex gap-2 md:hidden">
        <Button variant={showEnv ? "default" : "outline"} className="min-h-11 flex-1" onClick={() => setShowEnv(true)}>
          <Layers className="h-4 w-4" /> {t("run.environment")}
        </Button>
        <Button variant={!showEnv ? "default" : "outline"} className="min-h-11 flex-1" onClick={() => setShowEnv(false)}>
          <Flag className="h-4 w-4" /> {t("run.task")}
        </Button>
      </div>
      <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr]">
        {/* LEFT: environment */}
        <section className={cn("min-w-0", !showEnv && "hidden md:block")} aria-label={t("run.environment")}>
          <div className="md:sticky md:top-4 md:max-h-[calc(100vh-2rem)] md:overflow-y-auto md:pr-1">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Layers className="h-4 w-4" /> {t(`envKind.${sim.env}`)}
            </p>
            <EnvPanel env={sim.env} materials={materials} newIds={newIds} locale={locale} />
          </div>
        </section>

        {/* RIGHT: stage brief + task */}
        <section className={cn("min-w-0 space-y-3", showEnv && "hidden md:block")}>
          <Card className="space-y-2 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t("run.stageOf", { n: idx + 1, total: sim.stages.length })} · {t(`kind.${task.kind}`)}
            </p>
            <h2 className="text-lg font-bold leading-snug">{localized(stage.title, locale)}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{localized(stage.brief, locale)}</p>
            {stage.materials.length > 0 && (
              <button className="text-xs font-medium text-primary underline-offset-2 hover:underline md:hidden" onClick={() => setShowEnv(true)}>
                {t("run.newMaterials", { n: stage.materials.length })}
              </button>
            )}
          </Card>

          <Card className="space-y-3 p-4">
            <p className="font-medium leading-relaxed">{localized(task.prompt, locale)}</p>
            {phase === "task" && (
              <div key={stage.id}>
                {task.kind === "choice" && <ChoiceWidget task={task} locale={locale} seed={seed} onSubmit={submit} />}
                {task.kind === "multi" && <MultiWidget task={task} locale={locale} seed={seed} onSubmit={submit} />}
                {task.kind === "order" && <OrderWidget task={task} locale={locale} seed={seed} onSubmit={submit} />}
                {task.kind === "numeric" && <NumericWidget task={task} locale={locale} seed={seed} onSubmit={submit} />}
                {task.kind === "match" && <MatchWidget task={task} locale={locale} seed={seed} onSubmit={submit} />}
                {task.kind === "grid" && <GridWidget task={task} locale={locale} seed={seed} onSubmit={submit} />}
                {task.kind === "text" && <TextTaskWidget simId={sim.id} stageId={stage.id} task={task} locale={locale} onSubmit={submit} />}
              </div>
            )}

            {phase === "review" && review && (
              <div className="space-y-3" data-testid="kasb-review">
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  {review.ungraded ? (
                    <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                  ) : review.score >= 50 ? (
                    <CheckCircle2 className={cn("h-6 w-6", scoreTone(review.score))} />
                  ) : (
                    <XCircle className="h-6 w-6 text-destructive" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("run.stageScore")}</p>
                    <p className={cn("text-2xl font-bold", review.ungraded ? "text-muted-foreground" : scoreTone(review.score))}>
                      {review.ungraded ? t("run.ungraded") : `${review.score}%`}
                    </p>
                  </div>
                </div>
                <TaskReview task={task} answer={review.answer} extra={review.extra} locale={locale} />
                {!review.ungraded && review.score < 50 && (
                  <div className="rounded-lg border-2 border-destructive/40 bg-destructive/5 p-3">
                    <p className="flex items-center gap-2 text-sm font-bold text-destructive">
                      <AlertTriangle className="h-4 w-4" /> {t("run.consequence")}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{localized(stage.consequence, locale)}</p>
                  </div>
                )}
                <Button size="lg" className="min-h-12 w-full" onClick={proceed} data-testid="kasb-next">
                  {idx >= sim.stages.length - 1 ? t("run.finish") : t("run.next")} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
