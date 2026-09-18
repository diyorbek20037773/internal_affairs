"use client";

import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Timer, XCircle, Scale, AlertTriangle, CheckCircle2, Mic, PenLine, ScanEye, ListOrdered, Zap } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDecisionSim } from "@/hooks/useDecisionSim";
import { useSessionBootstrap } from "@/hooks/useSessionBootstrap";
import { newDecisionSession } from "@/lib/training/sessionFactory";
import { localized } from "@/data/sops/types";
import { LAWS } from "@/data/sops/laws";
import type { LawRef } from "@/data/sops/types";
import type { DecisionScenario, DecisionStep, DecisionTaskKind } from "@/data/scenarios/types";
import type { TrainingSession } from "@/lib/storage/trainingSchema";
import { ProfileGate } from "../profile/ProfileGate";
import { ScanTask, ScanReview } from "./tasks/ScanTask";
import { OrderTask, OrderReview } from "./tasks/OrderTask";
import { SpeakWriteTask } from "./tasks/SpeakWriteTask";
import { cn } from "@/lib/utils";

export function DecisionSimClient({ scenario, sessionId, exam }: { scenario: DecisionScenario; sessionId?: string; exam?: { examId: string; examStageIndex: number } }) {
  const create = useCallback(
    (traineeId: string, exam?: { examId: string; examStageIndex: number }) =>
      newDecisionSession(scenario, { traineeId, ...exam }),
    [scenario]
  );
  const { session, ready, needsProfile } = useSessionBootstrap({ scenarioId: scenario.id, sessionId, create, exam });
  if (needsProfile) return <ProfileGate />;
  if (!ready || !session) return null;
  return <DecisionRunner scenario={scenario} initial={session} />;
}

function DecisionRunner({ scenario, initial }: { scenario: DecisionScenario; initial: TrainingSession }) {
  const t = useTranslations("sim.decision");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const sim = useDecisionSim(scenario, initial);

  const stepNo = sim.payload.path.length + 1;
  const timerPct = sim.timerSec ? Math.min(100, (sim.elapsedMs / (sim.timerSec * 1000)) * 100) : 0;
  const urgent = sim.remainingSec != null && sim.remainingSec <= 5;

  if (sim.finished) {
    const outcome = sim.payload.outcome ?? "partial";
    return (
      <Card
        className={cn(
          "mx-auto max-w-2xl p-8 text-center",
          outcome === "success" ? "border-success/40 bg-success/5" : outcome === "fail" ? "border-destructive/40 bg-destructive/5" : "border-accent/40 bg-accent/5"
        )}
      >
        {outcome === "success" ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        ) : (
          <AlertTriangle className={cn("mx-auto h-12 w-12", outcome === "fail" ? "text-destructive" : "text-accent")} />
        )}
        <h3 className="mt-4 text-xl font-bold">{t(`outcome.${outcome}`)}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("hint")}</p>
        <Button className="mt-6" size="lg" onClick={() => router.push(`/simulyator/debrif/${sim.session.id}`)}>
          {tc("next")}: {tc("toDebrief")} <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>
    );
  }

  const node = sim.node;
  if (!node) return null;
  const task = node.task;
  const pending = sim.pending;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        {/* Situation */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Badge variant="outline">{scenario.code}</Badge>
              <span>#{stepNo}</span>
              <Badge variant="accent" className="gap-1">
                <TaskIcon kind={task.kind} className="h-3 w-3" /> {t(`task.${task.kind}.label`)}
              </Badge>
            </div>
            {sim.timerSec && !pending && (
              <div className={cn("flex items-center gap-1.5 font-mono text-sm font-bold", urgent ? "text-destructive" : "text-foreground")}>
                <Timer className={cn("h-4 w-4", urgent && "animate-pulse")} />
                {sim.remainingSec}s
              </div>
            )}
          </div>
          {sim.timerSec && !pending && (
            <Progress value={timerPct} className="h-1 rounded-none" indicatorClassName={cn(urgent ? "bg-destructive" : "bg-primary", "transition-all duration-200")} />
          )}
          <div className="space-y-2 p-5">
            <p className="text-base leading-relaxed md:text-lg">{localized(node.situation, locale)}</p>
            {task.kind !== "choice" && !pending && (
              <p className="rounded-lg bg-primary/5 px-3 py-2 text-sm font-medium text-primary">{localized(task.prompt, locale)}</p>
            )}
          </div>
        </Card>

        {pending ? (
          <ResultCard scenario={scenario} nodeId={node.id} pending={pending} onContinue={() => void sim.proceed()} />
        ) : task.kind === "choice" ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("chooseOption")}</p>
            {task.options.map((o, i) => (
              <button
                key={o.id}
                onClick={() => sim.pick(o.id)}
                className="group flex w-full items-start gap-3 rounded-xl border border-border/80 bg-card p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-card-hover active:scale-[0.99]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm leading-relaxed md:text-base">{localized(o.text, locale)}</span>
              </button>
            ))}
          </div>
        ) : task.kind === "scan" ? (
          <ScanTask key={node.id} task={task} onSubmit={sim.submit} />
        ) : task.kind === "order" ? (
          <OrderTask key={node.id} task={task} onSubmit={sim.submit} />
        ) : (
          <SpeakWriteTask key={node.id} scenarioId={scenario.id} nodeId={node.id} task={task} situation={node.situation} onSubmit={sim.submit} />
        )}

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={async () => {
              if (!window.confirm(tc("abandonConfirm"))) return;
              await sim.abandon();
              router.push("/mashgulotlarim");
            }}
          >
            <XCircle className="h-4 w-4" /> {tc("abandonSession")}
          </Button>
        </div>
      </div>

      {/* Task track */}
      <div className="space-y-4">
        <Card className="p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("steps")}</p>
          <ol className="space-y-2">
            {sim.payload.path.map((st, i) => {
              const n = scenario.nodes[st.nodeId];
              const v = stepScore(scenario, st);
              return (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <TaskIcon kind={n?.task.kind ?? "choice"} className="h-3.5 w-3.5" />
                  </span>
                  <span className="mr-auto text-muted-foreground">{n ? t(`task.${n.task.kind}.label`) : st.nodeId}</span>
                  {st.ungraded ? (
                    <Badge variant="accent" className="text-[10px]">?</Badge>
                  ) : v != null ? (
                    <Badge variant={v >= 3 ? "success" : v >= 2 ? "secondary" : "destructive"} className="text-[10px]">{v}/3</Badge>
                  ) : null}
                </li>
              );
            })}
            <li className="flex items-center gap-2 text-sm font-semibold">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-primary/30">
                <TaskIcon kind={task.kind} className="h-3.5 w-3.5" />
              </span>
              {t(`task.${task.kind}.label`)}
            </li>
          </ol>
          <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">{t("hint")}</p>
        </Card>
      </div>
    </div>
  );
}

/** Score on the task track: choice = min(legality, proportionality), other tasks = their 0–3 score. */
function stepScore(scenario: DecisionScenario, st: DecisionStep): number | null {
  if (st.timedOut) return 0;
  const n = scenario.nodes[st.nodeId];
  if (!n) return null;
  if (n.task.kind === "choice") {
    const o = n.task.options.find((x) => x.id === st.optionId);
    return o ? Math.min(o.legality, o.proportionality) : null;
  }
  return st.score ?? null;
}

const TASK_ICONS: Record<DecisionTaskKind, typeof Mic> = {
  choice: Zap,
  scan: ScanEye,
  order: ListOrdered,
  voice: Mic,
  text: PenLine,
};

function TaskIcon({ kind, className }: { kind: DecisionTaskKind; className?: string }) {
  const I = TASK_ICONS[kind];
  return <I className={className} />;
}

type Pending = NonNullable<ReturnType<typeof useDecisionSim>["pending"]>;

function ResultCard({ scenario, nodeId, pending, onContinue }: { scenario: DecisionScenario; nodeId: string; pending: Pending; onContinue: () => void }) {
  const t = useTranslations("sim.decision");
  const locale = useLocale();
  const task = scenario.nodes[nodeId]?.task;
  const opt = pending.option;
  const res = pending.result;
  const score = opt ? Math.min(opt.legality, opt.proportionality) : res?.score ?? 0;
  const good = !pending.timedOut && score >= 3;

  return (
    <Card className={cn("space-y-3 p-5", pending.timedOut ? "border-destructive/40 bg-destructive/5" : good ? "border-success/40 bg-success/5" : "border-accent/40 bg-accent/5")}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-auto text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {pending.timedOut ? t("timeout") : t("consequence")}
        </p>
        {res && !res.ungraded && <ScoreBadge label={t("score")} v={res.score} />}
        {res?.ungraded && <Badge variant="accent">{t("ungraded")}</Badge>}
      </div>

      {opt && <p className="text-sm font-medium">→ {localized(opt.text, locale)}</p>}
      <p className="leading-relaxed">
        {pending.timedOut
          ? localized(scenario.nodes[pending.next.currentNodeId ?? ""]?.situation ?? { uz: "" }, locale) || t("timeout")
          : opt
            ? localized(opt.consequence, locale)
            : pending.branch
              ? localized(pending.branch.consequence, locale)
              : null}
      </p>

      {opt && (
        <div className="flex flex-wrap gap-2 text-xs">
          <ScoreBadge label={t("legality")} v={opt.legality} />
          <ScoreBadge label={t("proportionality")} v={opt.proportionality} />
          {opt.laws?.map((k) => {
            const l = LAWS[k] as LawRef;
            return (
              <Badge key={k} variant="outline" className="gap-1">
                <Scale className="h-3 w-3" /> {l.code}
                {l.article ? ` ${l.article}` : ""}
              </Badge>
            );
          })}
        </div>
      )}

      {res && task?.kind === "scan" && <ScanReview task={task} picks={res.picks ?? []} misses={res.misses ?? 0} />}
      {res && task?.kind === "order" && <OrderReview task={task} picks={res.picks ?? []} />}
      {res && (task?.kind === "voice" || task?.kind === "text") && (
        <div className="space-y-3 text-sm">
          {pending.extra?.violation && <p className="rounded-md bg-destructive/10 px-3 py-2 font-medium text-destructive">{t("violation")}</p>}
          {pending.extra?.tooShort && <p className="rounded-md bg-accent/10 px-3 py-2 font-medium">{t("tooShort")}</p>}
          {res.rubric && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("rubricTitle")}</p>
              <ul className="space-y-1">
                {task.rubric.map((r) => (
                  <li key={r.id} className="flex items-start gap-2">
                    {res.rubric?.[r.id] ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
                    <span>{localized(r.text, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {pending.extra?.strength && (
            <p>
              <b>{t("strength")}:</b> {pending.extra.strength}
            </p>
          )}
          {res.feedback && <p className="text-muted-foreground">{res.feedback}</p>}
          <details className="rounded-lg border bg-card p-3">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("sample")}</summary>
            <p className="mt-2 leading-relaxed">{localized(task.sample, locale)}</p>
          </details>
        </div>
      )}

      <Button onClick={onContinue}>
        {t("continue")} <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  );
}

function ScoreBadge({ label, v }: { label: string; v: number }) {
  return (
    <Badge variant={v >= 3 ? "success" : v >= 2 ? "secondary" : "destructive"}>
      {label} {v}/3
    </Badge>
  );
}
