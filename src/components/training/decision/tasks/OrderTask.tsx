"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localized } from "@/data/sops/types";
import type { DecisionTask } from "@/data/scenarios/types";
import { scoreOrder, type TaskResult } from "@/lib/training/decisionEngine";
import { cn } from "@/lib/utils";

type OrderTaskDef = Extract<DecisionTask, { kind: "order" }>;

/** Tap-to-sequence priority task (no drag — works with a thumb on a tablet). */
export function OrderTask({ task, onSubmit }: { task: OrderTaskDef; onSubmit: (r: TaskResult) => void }) {
  const t = useTranslations("sim.decision.task.order");
  const locale = useLocale();
  const [seq, setSeq] = useState<string[]>([]);
  const toggle = (id: string) => setSeq((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const done = seq.length === task.items.length;

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {task.items.map((it) => {
          const pos = seq.indexOf(it.id);
          return (
            <button
              key={it.id}
              onClick={() => toggle(it.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left shadow-card transition-all active:scale-[0.99]",
                pos >= 0 ? "border-primary/60 bg-primary/5" : "border-border/80 bg-card hover:border-primary/40"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                  pos >= 0 ? "border-primary bg-primary text-primary-foreground" : "border-dashed border-muted-foreground/40 text-muted-foreground"
                )}
              >
                {pos >= 0 ? pos + 1 : ""}
              </span>
              <span className="text-sm leading-relaxed md:text-base">{localized(it.text, locale)}</span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" disabled={!seq.length} onClick={() => setSeq([])}>
          <RotateCcw className="h-4 w-4" /> {t("reset")}
        </Button>
        <Button disabled={!done} onClick={() => onSubmit({ score: scoreOrder(task, seq), picks: seq })}>
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}

export function OrderReview({ task, picks }: { task: OrderTaskDef; picks: string[] }) {
  const t = useTranslations("sim.decision.task.order");
  const locale = useLocale();
  const name = useMemo(() => new Map(task.items.map((i) => [i.id, localized(i.text, locale)])), [task, locale]);
  return (
    <div className="grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("yourOrder")}</p>
        <ol className="space-y-1">
          {picks.map((id, i) => (
            <li key={id} className={cn("flex gap-2 rounded-md px-2 py-1", task.answer[i] === id ? "bg-success/10" : "bg-destructive/10")}>
              <span className="font-mono font-bold">{i + 1}.</span> {name.get(id) ?? id}
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("correctOrder")}</p>
        <ol className="space-y-1">
          {task.answer.map((id, i) => (
            <li key={id} className="flex gap-2 rounded-md bg-muted/60 px-2 py-1">
              <span className="font-mono font-bold">{i + 1}.</span> {name.get(id) ?? id}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
