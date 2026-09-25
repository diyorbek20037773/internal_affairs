"use client";

import { useTranslations } from "next-intl";
import { localized } from "@/data/sops/types";
import type { SimMaterial } from "@/data/kasblar/types";
import { cn } from "@/lib/utils";

export interface EnvProps {
  materials: SimMaterial[];
  /** Ids of materials added at the current stage (highlighted as "new"). */
  newIds: Set<string>;
  locale: string;
}

export function NewBadge({ show }: { show: boolean }) {
  const t = useTranslations("kasbsim.env");
  if (!show) return null;
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
      {t("new")}
    </span>
  );
}

export function Body({ m, locale, className }: { m: SimMaterial; locale: string; className?: string }) {
  const text = localized(m.body, locale);
  if (!text) return null;
  return <p className={cn("whitespace-pre-line text-sm leading-relaxed", className)}>{text}</p>;
}

export function MetaTable({ m, locale, className }: { m: SimMaterial; locale: string; className?: string }) {
  if (!m.meta?.length) return null;
  return (
    <dl className={cn("grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs", className)}>
      {m.meta.map((x, i) => (
        <div key={i} className="contents">
          <dt className="text-muted-foreground">{localized(x.label, locale)}</dt>
          <dd className="break-words font-medium">{x.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DataTable({ m, className, heat }: { m: SimMaterial; className?: string; heat?: boolean }) {
  if (!m.table) return null;
  const nums = m.table.rows.flat().filter((v): v is number => typeof v === "number");
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return (
    <div className={cn("max-w-full overflow-x-auto rounded-md border border-border/70", className)}>
      <table className="w-full border-collapse text-xs">
        <thead className="bg-muted/60">
          <tr>
            {m.table.head.map((h, i) => (
              <th key={i} className="whitespace-nowrap px-2 py-1.5 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {m.table.rows.map((r, ri) => (
            <tr key={ri} className="border-t border-border/60">
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className="px-2 py-1.5 align-top"
                  style={heat && typeof c === "number" && ci > 0 ? { background: heatColor(c, min, max, 0.55) } : undefined}
                >
                  {typeof c === "number" ? c.toLocaleString("ru-RU") : c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Sequential green→yellow→red scale for heat cells. */
export function heatColor(v: number, min: number, max: number, alpha = 1): string {
  const t = max > min ? (v - min) / (max - min) : 0.5;
  const hue = 120 - 120 * t; // 120 green → 0 red
  return `hsla(${hue.toFixed(0)}, 75%, ${(55 - 10 * t).toFixed(0)}%, ${alpha})`;
}

/** Plain material card — used as the generic fallback and for secondary props. */
export function MaterialCard({ m, locale, isNew, className }: { m: SimMaterial; locale: string; isNew?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "space-y-2 rounded-lg border bg-card p-3 shadow-sm",
        m.tone === "warn" ? "border-accent/50" : "border-border/70",
        isNew && "ring-2 ring-accent/40",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug">{localized(m.title, locale)}</p>
        <NewBadge show={!!isNew} />
      </div>
      <Body m={m} locale={locale} />
      <MetaTable m={m} locale={locale} />
      <DataTable m={m} />
    </div>
  );
}

export function EmptyEnv() {
  const t = useTranslations("kasbsim.env");
  return <p className="p-4 text-sm text-muted-foreground">{t("empty")}</p>;
}

/** Horizontal tab strip that scrolls inside its container (never the page). */
export function TabStrip<T extends string>({
  items,
  active,
  onPick,
  className,
}: {
  items: { id: T; label: string; isNew?: boolean; icon?: React.ReactNode }[];
  active: T;
  onPick: (id: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-full gap-1 overflow-x-auto", className)} role="tablist">
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          aria-selected={active === it.id}
          onClick={() => onPick(it.id)}
          className={cn(
            "relative flex min-h-10 shrink-0 items-center gap-1.5 rounded-t-md border border-b-0 px-3 text-xs font-medium transition-colors",
            active === it.id ? "border-border bg-card text-foreground" : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          {it.icon}
          <span className="max-w-[11rem] truncate">{it.label}</span>
          {it.isNew && <span className="h-2 w-2 rounded-full bg-accent" />}
        </button>
      ))}
    </div>
  );
}
