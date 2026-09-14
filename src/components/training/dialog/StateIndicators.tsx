"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DIALOG_PHASES, type DialogHiddenState, type DialogTurnAssessment } from "@/data/scenarios/types";
import { cn } from "@/lib/utils";

/**
 * Live panel — pptx slide 5: "AI HOLATI: vaziyat yumshayapti ▼ / OHANG: xotirjam ✓".
 * Shows tension bar, trend, officer tone and the 6-step phase stepper.
 * Trust/cooperation numbers are intentionally hidden until the debrief.
 */
/** One-line version shown above the chat on tablets/phones (< lg). */
export function StateStrip({ state, last }: { state: DialogHiddenState; last?: DialogTurnAssessment }) {
  const t = useTranslations("sim.dialog");
  const tensionColor =
    state.tension >= 70 ? "bg-destructive" : state.tension >= 40 ? "bg-accent" : "bg-success";
  const trendVariant =
    last?.trendLabel === "yumshayapti" ? "success" : last?.trendLabel === "keskinlashyapti" ? "destructive" : "secondary";
  const toneGood = last && (last.tone === "xotirjam" || last.tone === "hamdard" || last.tone === "rasmiy");
  return (
    <div className="flex items-center gap-3 border-b border-border/70 bg-muted/30 px-4 py-2 lg:hidden">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>{t("tension")}</span>
          <span>{t(`phases.${state.phase}`)}</span>
        </div>
        <Progress value={state.tension} indicatorClassName={cn("transition-all duration-700", tensionColor)} className="h-2" />
      </div>
      <Badge variant={trendVariant} className="shrink-0 text-[10px]">{last ? t(`trend_${last.trendLabel}`) : "—"}</Badge>
      <Badge variant={last ? (toneGood ? "success" : "destructive") : "secondary"} className="hidden shrink-0 text-[10px] sm:inline-flex">
        {last ? t(`tones.${last.tone}`) : "—"}
      </Badge>
    </div>
  );
}

export function StateIndicators({
  state,
  last,
  turns,
  maxTurns,
}: {
  state: DialogHiddenState;
  last?: DialogTurnAssessment;
  turns: number;
  maxTurns: number;
}) {
  const t = useTranslations("sim.dialog");

  const tensionColor =
    state.tension >= 70 ? "bg-destructive" : state.tension >= 40 ? "bg-accent" : "bg-success";
  const trendVariant =
    last?.trendLabel === "yumshayapti"
      ? "success"
      : last?.trendLabel === "keskinlashyapti"
        ? "destructive"
        : "secondary";
  const toneGood = last && (last.tone === "xotirjam" || last.tone === "hamdard" || last.tone === "rasmiy");
  const phaseIdx = DIALOG_PHASES.indexOf(state.phase);

  return (
    <Card className="space-y-5 p-4">
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-muted-foreground">{t("tension")}</span>
          <span className="font-mono text-muted-foreground">
            {t("turns")} {turns}/{maxTurns}
          </span>
        </div>
        <Progress value={state.tension} indicatorClassName={cn("transition-all duration-700", tensionColor)} className="h-3" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("trend")}</p>
          <Badge variant={trendVariant}>{last ? t(`trend_${last.trendLabel}`) : "—"}</Badge>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("tone")}</p>
          <Badge variant={last ? (toneGood ? "success" : "destructive") : "secondary"}>
            {last ? `${t(`tones.${last.tone}`)}${toneGood ? " ✓" : ""}` : "—"}
          </Badge>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("phase")}</p>
        <ol className="space-y-1.5">
          {DIALOG_PHASES.map((ph, i) => {
            const done = i < phaseIdx;
            const cur = i === phaseIdx;
            return (
              <li key={ph} className="flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    done && "bg-success text-success-foreground",
                    cur && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                    !done && !cur && "bg-secondary text-muted-foreground"
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={cn(cur ? "font-semibold" : "text-muted-foreground", done && "line-through opacity-70")}>
                  {t(`phases.${ph}`)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}
