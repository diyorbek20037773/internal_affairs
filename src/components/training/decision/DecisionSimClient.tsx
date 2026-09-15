"use client";

import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Timer, XCircle, Scale, AlertTriangle, CheckCircle2 } from "lucide-react";
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
import { CHAIN_PROMPTS, type DecisionScenario } from "@/data/scenarios/types";
import type { TrainingSession } from "@/lib/storage/trainingSchema";
import { ProfileGate } from "../profile/ProfileGate";
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

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        {/* Situation */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Badge variant="outline">{scenario.code}</Badge>
              <span>#{stepNo}</span>
              {node.chainPrompt && <Badge variant="accent">{t(`chain.${node.chainPrompt}`)}</Badge>}
            </div>
            {sim.timerSec && !sim.pending && (
              <div className={cn("flex items-center gap-1.5 font-mono text-sm font-bold", urgent ? "text-destructive" : "text-foreground")}>
                <Timer className={cn("h-4 w-4", urgent && "animate-pulse")} />
                {sim.remainingSec}s
              </div>
            )}
          </div>
          {sim.timerSec && !sim.pending && (
            <Progress value={timerPct} className="h-1 rounded-none" indicatorClassName={cn(urgent ? "bg-destructive" : "bg-primary", "transition-all duration-200")} />
          )}
          <div className="p-5">
            <p className="text-base leading-relaxed md:text-lg">{localized(node.situation, locale)}</p>
          </div>
        </Card>

        {/* Consequence sheet */}
        {sim.pending ? (
          <Card
            className={cn(
              "p-5",
              sim.pending.timedOut
                ? "border-destructive/40 bg-destructive/5"
                : (sim.pending.option?.legality ?? 0) >= 3 && (sim.pending.option?.proportionality ?? 0) >= 3
                  ? "border-success/40 bg-success/5"
                  : "border-accent/40 bg-accent/5"
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {sim.pending.timedOut ? t("timeout") : t("consequence")}
            </p>
            {sim.pending.option && (
              <p className="mt-1 text-sm font-medium">→ {localized(sim.pending.option.text, locale)}</p>
            )}
            <p className="mt-2 leading-relaxed">
              {sim.pending.timedOut
                ? localized(scenario.nodes[sim.pending.next.currentNodeId ?? ""]?.situation ?? { uz: "" }, locale) || t("timeout")
                : localized(sim.pending.option!.consequence, locale)}
            </p>
            {sim.pending.option && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <ScoreBadge label={t("legality")} v={sim.pending.option.legality} />
                <ScoreBadge label={t("proportionality")} v={sim.pending.option.proportionality} />
                {sim.pending.option.laws?.map((k) => {
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
            <Button className="mt-4" onClick={() => void sim.proceed()}>
              {t("continue")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("chooseOption")}</p>
            {node.options.map((o, i) => (
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

      {/* Chain hints */}
      <div className="space-y-4">
        <Card className="p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("chainTitle")}</p>
          <ol className="space-y-2">
            {CHAIN_PROMPTS.map((c, i) => {
              const cur = node.chainPrompt === c;
              return (
                <li key={c} className="flex items-center gap-2 text-sm">
                  <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold", cur ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-secondary text-muted-foreground")}>
                    {i + 1}
                  </span>
                  <span className={cur ? "font-semibold" : "text-muted-foreground"}>{t(`chain.${c}`)}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">{t("hint")}</p>
        </Card>
      </div>
    </div>
  );
}

function ScoreBadge({ label, v }: { label: string; v: number }) {
  return (
    <Badge variant={v >= 3 ? "success" : v >= 2 ? "secondary" : "destructive"}>
      {label} {v}/3
    </Badge>
  );
}
