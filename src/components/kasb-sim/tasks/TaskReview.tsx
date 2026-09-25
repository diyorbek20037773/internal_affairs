"use client";

import { useTranslations } from "next-intl";
import { Check, X, Minus } from "lucide-react";
import { localized } from "@/data/sops/types";
import type { SimTask } from "@/data/kasblar/types";
import type { SimAnswer } from "@/lib/kasb/simEngine";
import { GridView } from "./TaskWidgets";
import type { TextGradeExtra } from "./TextTaskWidget";
import { cn } from "@/lib/utils";

/** After-stage review: the trainee's answer next to the authored correct answer. */
export function TaskReview({ task, answer, extra, locale }: { task: SimTask; answer: SimAnswer; extra?: TextGradeExtra; locale: string }) {
  const t = useTranslations("kasbsim.review");
  const L = (x: Parameters<typeof localized>[0]) => localized(x, locale);

  switch (task.kind) {
    case "choice": {
      const a = answer.kind === "choice" ? answer.optionId : "";
      const chosen = task.options.find((o) => o.id === a);
      const best = task.options.find((o) => o.score === 3);
      return (
        <div className="space-y-2 text-sm">
          {chosen && (
            <div className={cn("rounded-lg border p-3", chosen.score === 3 ? "border-success/40 bg-success/5" : chosen.score === 0 ? "border-destructive/40 bg-destructive/5" : "border-accent/40 bg-accent/5")}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("yourAnswer")}</p>
              <p className="mt-1 font-medium">{L(chosen.text)}</p>
              <p className="mt-1.5 text-muted-foreground">{L(chosen.feedback)}</p>
            </div>
          )}
          {best && best.id !== a && (
            <div className="rounded-lg border border-success/40 bg-success/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-success">{t("best")}</p>
              <p className="mt-1 font-medium">{L(best.text)}</p>
              <p className="mt-1.5 text-muted-foreground">{L(best.feedback)}</p>
            </div>
          )}
        </div>
      );
    }
    case "multi": {
      const picked = new Set(answer.kind === "multi" ? answer.optionIds : []);
      return (
        <ul className="space-y-1.5 text-sm">
          {task.options.map((o) => {
            const on = picked.has(o.id);
            const state = o.correct ? (on ? "hit" : "miss") : on ? "wrong" : "ok";
            return (
              <li
                key={o.id}
                className={cn(
                  "flex gap-2 rounded-lg border p-2",
                  state === "hit" && "border-success/40 bg-success/5",
                  state === "miss" && "border-accent/50 bg-accent/5",
                  state === "wrong" && "border-destructive/40 bg-destructive/5",
                  state === "ok" && "border-border opacity-70"
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {state === "hit" ? <Check className="h-4 w-4 text-success" /> : state === "wrong" ? <X className="h-4 w-4 text-destructive" /> : state === "miss" ? <Minus className="h-4 w-4 text-accent" /> : <span className="block h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <p>{L(o.text)}</p>
                  {state === "miss" && <p className="text-xs font-medium text-accent">{t("missed")}</p>}
                  {(state === "wrong" || state === "miss") && o.feedback && <p className="text-xs text-muted-foreground">{L(o.feedback)}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      );
    }
    case "order": {
      const seq = answer.kind === "order" ? answer.sequence : [];
      const byId = new Map(task.items.map((i) => [i.id, i]));
      return (
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("yourAnswer")}</p>
            <ol className="space-y-1">
              {seq.map((id, i) => (
                <li key={id} className={cn("flex gap-2 rounded-md border p-1.5", task.correct[i] === id ? "border-success/40 bg-success/5" : "border-destructive/30")}>
                  <b className="w-5 shrink-0 text-center">{i + 1}</b> <span>{byId.get(id) ? L(byId.get(id)!.text) : id}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-success">{t("correct")}</p>
            <ol className="space-y-1">
              {task.correct.map((id, i) => (
                <li key={id} className="flex gap-2 rounded-md border border-success/30 p-1.5">
                  <b className="w-5 shrink-0 text-center">{i + 1}</b> <span>{byId.get(id) ? L(byId.get(id)!.text) : id}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      );
    }
    case "numeric": {
      const v = answer.kind === "numeric" ? answer.value : NaN;
      return (
        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap gap-4">
            <p>
              <span className="text-muted-foreground">{t("yourAnswer")}: </span>
              <b className="font-mono">{Number.isFinite(v) ? v.toLocaleString("ru-RU") : "—"}</b> {task.unit}
            </p>
            <p>
              <span className="text-muted-foreground">{t("correct")}: </span>
              <b className="font-mono text-success">{task.answer.toLocaleString("ru-RU")}</b> {task.unit}
              {task.tolerance > 0 && <span className="text-muted-foreground"> (±{task.tolerance})</span>}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("solution")}</p>
            <p className="mt-1 whitespace-pre-line font-mono text-[13px] leading-relaxed">{L(task.solution)}</p>
          </div>
        </div>
      );
    }
    case "match": {
      const pairs = answer.kind === "match" ? answer.pairs : {};
      const right = new Map(task.right.map((r) => [r.id, r]));
      const correct = new Map(task.pairs);
      return (
        <ul className="space-y-1.5 text-sm">
          {task.left.map((l) => {
            const mine = pairs[l.id];
            const ok = mine === correct.get(l.id);
            return (
              <li key={l.id} className={cn("rounded-lg border p-2", ok ? "border-success/40 bg-success/5" : "border-destructive/30 bg-destructive/5")}>
                <p className="font-medium">{L(l.text)}</p>
                <p className="text-xs">
                  {ok ? <Check className="mr-1 inline h-3.5 w-3.5 text-success" /> : <X className="mr-1 inline h-3.5 w-3.5 text-destructive" />}
                  {mine && right.get(mine) ? L(right.get(mine)!.text) : "—"}
                </p>
                {!ok && correct.get(l.id) && (
                  <p className="text-xs text-success">
                    {t("correct")}: {L(right.get(correct.get(l.id)!)!.text)}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      );
    }
    case "grid": {
      const cells = answer.kind === "grid" ? answer.cells : [];
      return (
        <div className="space-y-2">
          <GridView task={task} picked={cells} reveal />
          <p className="text-xs text-muted-foreground">{t("gridLegend")}</p>
        </div>
      );
    }
    case "text":
      return (
        <div className="space-y-2 text-sm">
          {extra?.feedback && <p className="rounded-lg bg-primary/5 p-3">{extra.feedback}</p>}
          {extra?.tooShort && <p className="text-xs text-accent">{t("tooShort")}</p>}
          {!!extra?.missing?.length && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("missing")}</p>
              <ul className="ml-4 list-disc text-muted-foreground">
                {extra.missing.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          <details className="rounded-lg border border-border p-3" open={!extra?.feedback}>
            <summary className="min-h-8 cursor-pointer text-xs font-semibold uppercase tracking-wider text-success">{t("model")}</summary>
            <p className="mt-2 whitespace-pre-line leading-relaxed">{L(task.model)}</p>
          </details>
        </div>
      );
  }
}

