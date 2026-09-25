"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, RotateCcw, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localized } from "@/data/sops/types";
import type { SimTask } from "@/data/kasblar/types";
import type { SimAnswer } from "@/lib/kasb/simEngine";
import { heatColor } from "../env/shared";
import { cn } from "@/lib/utils";

type T<K extends SimTask["kind"]> = Extract<SimTask, { kind: K }>;
export interface WidgetProps<K extends SimTask["kind"]> {
  task: T<K>;
  locale: string;
  seed: string;
  onSubmit: (a: SimAnswer) => void;
}

/** Deterministic shuffle (same order on server and client, differs per stage). */
export function seededShuffle<X>(xs: X[], seed: string): X[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const rnd = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Never show the authored (= correct) order unchanged.
  if (a.length > 1 && a.every((x, i) => x === xs[i])) a.push(a.shift() as X);
  return a;
}

const letter = (i: number) => String.fromCharCode(65 + i);
const PAIR_COLORS = ["#2b6cb0", "#c05621", "#2f855a", "#6b46c1", "#b83280", "#2c7a7b", "#975a16", "#4a5568"];

function SubmitBar({ disabled, onSubmit, onReset, hint }: { disabled: boolean; onSubmit: () => void; onReset?: () => void; hint?: string }) {
  const t = useTranslations("kasbsim.run");
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
      <span className="text-xs text-muted-foreground">{hint}</span>
      <div className="flex gap-2">
        {onReset && (
          <Button variant="ghost" onClick={onReset} className="min-h-11">
            <RotateCcw className="h-4 w-4" /> {t("reset")}
          </Button>
        )}
        <Button onClick={onSubmit} disabled={disabled} className="min-h-11" data-testid="kasb-submit">
          <Send className="h-4 w-4" /> {t("submit")}
        </Button>
      </div>
    </div>
  );
}

/* ---------------- choice ---------------- */
export function ChoiceWidget({ task, locale, seed, onSubmit }: WidgetProps<"choice">) {
  const [pick, setPick] = useState<string | null>(null);
  const options = useMemo(() => seededShuffle(task.options, seed), [task.options, seed]);
  return (
    <div className="space-y-2">
      {options.map((o, i) => (
        <button
          key={o.id}
          onClick={() => setPick(o.id)}
          className={cn(
            "flex min-h-12 w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-all active:scale-[0.99]",
            pick === o.id ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card hover:border-primary/40"
          )}
        >
          <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold", pick === o.id ? "bg-primary text-primary-foreground" : "bg-muted")}>
            {letter(i)}
          </span>
          <span className="leading-relaxed">{localized(o.text, locale)}</span>
        </button>
      ))}
      <SubmitBar disabled={!pick} onSubmit={() => pick && onSubmit({ kind: "choice", optionId: pick })} />
    </div>
  );
}

/* ---------------- multi ---------------- */
export function MultiWidget({ task, locale, seed, onSubmit }: WidgetProps<"multi">) {
  const t = useTranslations("kasbsim.run");
  const [sel, setSel] = useState<string[]>([]);
  const options = useMemo(() => seededShuffle(task.options, seed), [task.options, seed]);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <div className="space-y-2">
      {options.map((o) => {
        const on = sel.includes(o.id);
        return (
          <button
            key={o.id}
            role="checkbox"
            aria-checked={on}
            onClick={() => toggle(o.id)}
            className={cn(
              "flex min-h-12 w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-all",
              on ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
            )}
          >
            <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2", on ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40")}>
              {on && <Check className="h-4 w-4" />}
            </span>
            <span className="leading-relaxed">{localized(o.text, locale)}</span>
          </button>
        );
      })}
      <SubmitBar disabled={sel.length === 0} onSubmit={() => onSubmit({ kind: "multi", optionIds: sel })} hint={t("selected", { n: sel.length })} />
    </div>
  );
}

/* ---------------- order (tap to sequence) ---------------- */
export function OrderWidget({ task, locale, seed, onSubmit }: WidgetProps<"order">) {
  const t = useTranslations("kasbsim.run");
  const pool = useMemo(() => seededShuffle(task.items, seed), [task.items, seed]);
  const [seq, setSeq] = useState<string[]>([]);
  const byId = new Map(task.items.map((i) => [i.id, i]));
  return (
    <div className="space-y-3">
      <ol className="min-h-[3rem] space-y-1.5 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-2">
        {seq.length === 0 && <li className="p-2 text-xs text-muted-foreground">{t("orderEmpty")}</li>}
        {seq.map((id, i) => (
          <li key={id}>
            <button
              onClick={() => setSeq((s) => s.filter((x) => x !== id))}
              className="flex min-h-11 w-full items-center gap-2 rounded-lg bg-card p-2 text-left text-sm shadow-sm"
              aria-label={t("remove")}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
              <span className="flex-1 leading-snug">{localized(byId.get(id)!.text, locale)}</span>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ol>
      <div className="space-y-1.5">
        {pool
          .filter((i) => !seq.includes(i.id))
          .map((i) => (
            <button
              key={i.id}
              onClick={() => setSeq((s) => [...s, i.id])}
              className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-border bg-card p-2 text-left text-sm hover:border-primary/40"
            >
              <span className="h-7 w-7 shrink-0 rounded-full border-2 border-dashed border-muted-foreground/40" />
              <span className="leading-snug">{localized(i.text, locale)}</span>
            </button>
          ))}
      </div>
      <SubmitBar
        disabled={seq.length !== task.items.length}
        onReset={seq.length ? () => setSeq([]) : undefined}
        onSubmit={() => onSubmit({ kind: "order", sequence: seq })}
        hint={t("placed", { n: seq.length, total: task.items.length })}
      />
    </div>
  );
}

/* ---------------- numeric ---------------- */
export function NumericWidget({ task, onSubmit }: WidgetProps<"numeric">) {
  const t = useTranslations("kasbsim.run");
  const [raw, setRaw] = useState("");
  const value = Number(raw.replace(/\s/g, "").replace(",", "."));
  const valid = raw.trim() !== "" && Number.isFinite(value);
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2">
        <input
          inputMode="decimal"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={t("numberPlaceholder")}
          className="h-12 w-full min-w-0 max-w-xs rounded-lg border border-input bg-background px-3 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-ring"
          data-testid="kasb-numeric"
        />
        <span className="shrink-0 text-sm font-semibold text-muted-foreground">{task.unit}</span>
      </label>
      <SubmitBar disabled={!valid} onSubmit={() => onSubmit({ kind: "numeric", value })} />
    </div>
  );
}

/* ---------------- match (tap left, then right) ---------------- */
export function MatchWidget({ task, locale, seed, onSubmit }: WidgetProps<"match">) {
  const t = useTranslations("kasbsim.run");
  const right = useMemo(() => seededShuffle(task.right, seed), [task.right, seed]);
  const [active, setActive] = useState<string | null>(task.left[0]?.id ?? null);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const rIndex = new Map(right.map((r, i) => [r.id, i]));
  const assign = (rid: string) => {
    if (!active) return;
    const next = { ...pairs, [active]: rid };
    setPairs(next);
    const nextLeft = task.left.find((l) => !next[l.id]);
    setActive(nextLeft?.id ?? null);
  };
  const done = task.left.every((l) => pairs[l.id]);
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        {task.left.map((l, i) => {
          const rid = pairs[l.id];
          const ri = rid !== undefined ? rIndex.get(rid) : undefined;
          return (
            <button
              key={l.id}
              onClick={() => setActive(l.id)}
              className={cn(
                "flex min-h-11 w-full items-center gap-2 rounded-lg border p-2 text-left text-sm transition-colors",
                active === l.id ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "border-border bg-card"
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: PAIR_COLORS[i % PAIR_COLORS.length] }}>
                {i + 1}
              </span>
              <span className="flex-1 leading-snug">{localized(l.text, locale)}</span>
              <span
                className={cn("flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md border-2 px-1 text-xs font-bold", ri === undefined ? "border-dashed border-muted-foreground/40 text-muted-foreground" : "border-transparent bg-muted")}
              >
                {ri === undefined ? "?" : letter(ri)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{active ? t("matchPickRight", { n: task.left.findIndex((l) => l.id === active) + 1 }) : t("matchDone")}</p>
      <div className="grid gap-1.5">
        {right.map((r, i) => {
          const usedBy = task.left.map((l, li) => (pairs[l.id] === r.id ? li : -1)).filter((x) => x >= 0);
          return (
            <button
              key={r.id}
              onClick={() => assign(r.id)}
              disabled={!active}
              className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-border bg-card p-2 text-left text-sm hover:border-primary/40 disabled:opacity-60"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold">{letter(i)}</span>
              <span className="flex-1 leading-snug">{localized(r.text, locale)}</span>
              {usedBy.map((li) => (
                <span key={li} className="h-3 w-3 shrink-0 rounded-full" style={{ background: PAIR_COLORS[li % PAIR_COLORS.length] }} />
              ))}
            </button>
          );
        })}
      </div>
      <SubmitBar
        disabled={!done}
        onReset={Object.keys(pairs).length ? () => { setPairs({}); setActive(task.left[0]?.id ?? null); } : undefined}
        onSubmit={() => onSubmit({ kind: "match", pairs })}
        hint={t("placed", { n: Object.keys(pairs).length, total: task.left.length })}
      />
    </div>
  );
}

/* ---------------- grid (tap heat cells) ---------------- */
export function GridView({
  task,
  picked,
  onToggle,
  reveal,
}: {
  task: T<"grid">;
  picked: string[];
  onToggle?: (k: string) => void;
  reveal?: boolean;
}) {
  const flat = task.values.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const correct = new Set(task.correct);
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th />
            {task.colLabels.map((c, j) => (
              <th key={j} className="px-1 text-center font-semibold text-muted-foreground">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {task.rowLabels.map((r, i) => (
            <tr key={i}>
              <th className="whitespace-nowrap pr-1 text-right font-semibold text-muted-foreground">{r}</th>
              {task.values[i].map((v, j) => {
                const k = `${i}-${j}`;
                const on = picked.includes(k);
                const ok = correct.has(k);
                return (
                  <td key={j} className="p-0">
                    <button
                      onClick={() => onToggle?.(k)}
                      disabled={!onToggle}
                      aria-pressed={on}
                      className={cn(
                        "relative flex h-11 w-11 items-center justify-center rounded-md font-mono text-xs font-bold text-[#1f2933] transition-transform sm:w-12",
                        onToggle && "active:scale-95",
                        on && "ring-[3px] ring-primary ring-offset-1",
                        reveal && ok && "outline outline-[3px] outline-offset-2 outline-[#2f855a]"
                      )}
                      style={{ background: heatColor(v, min, max) }}
                    >
                      {v}
                      {reveal && on && !ok && <X className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-destructive p-0.5 text-white" />}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GridWidget({ task, onSubmit }: WidgetProps<"grid">) {
  const t = useTranslations("kasbsim.run");
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (k: string) =>
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : p.length >= task.picks ? p : [...p, k]));
  return (
    <div className="space-y-3">
      <GridView task={task} picked={picked} onToggle={toggle} />
      <SubmitBar
        disabled={picked.length !== task.picks}
        onReset={picked.length ? () => setPicked([]) : undefined}
        onSubmit={() => onSubmit({ kind: "grid", cells: picked })}
        hint={t("placed", { n: picked.length, total: task.picks })}
      />
    </div>
  );
}
