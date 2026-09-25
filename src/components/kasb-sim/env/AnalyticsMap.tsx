"use client";

import { useTranslations } from "next-intl";
import { BarChart3 } from "lucide-react";
import { localized } from "@/data/sops/types";
import type { SimMaterial } from "@/data/kasblar/types";
import { Body, DataTable, EmptyEnv, MaterialCard, NewBadge, heatColor, type EnvProps } from "./shared";

/** Rows whose cells after the first are all numbers → a heat matrix. */
function matrixOf(m: SimMaterial): { rows: string[]; cols: string[]; values: number[][] } | null {
  if (!m.table || m.table.rows.length < 2 || m.table.head.length < 3) return null;
  const ok = m.table.rows.every((r) => r.slice(1).every((c) => typeof c === "number"));
  if (!ok) return null;
  return {
    rows: m.table.rows.map((r) => String(r[0])),
    cols: m.table.head.slice(1),
    values: m.table.rows.map((r) => r.slice(1) as number[]),
  };
}

export function HeatGrid({ rows, cols, values, title }: { rows: string[]; cols: string[]; values: number[][]; title: string }) {
  const flat = values.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const cw = 44;
  const ch = 30;
  const lw = 90;
  const hh = 22;
  const w = lw + cols.length * cw;
  const h = hh + rows.length * ch;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full" role="img" aria-label={title}>
      {cols.map((c, j) => (
        <text key={j} x={lw + j * cw + cw / 2} y={15} textAnchor="middle" fontSize="10" className="fill-muted-foreground">
          {c.length > 7 ? c.slice(0, 7) + "…" : c}
        </text>
      ))}
      {rows.map((r, i) => (
        <g key={i}>
          <text x={lw - 6} y={hh + i * ch + ch / 2 + 4} textAnchor="end" fontSize="10" className="fill-foreground">
            {r.length > 14 ? r.slice(0, 14) + "…" : r}
          </text>
          {values[i].map((v, j) => (
            <g key={j}>
              <rect x={lw + j * cw + 1} y={hh + i * ch + 1} width={cw - 2} height={ch - 2} rx="3" fill={heatColor(v, min, max)} />
              <text x={lw + j * cw + cw / 2} y={hh + i * ch + ch / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1f2933">
                {v}
              </text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/** Tahlilchi: statistics tables, rendered as a colour heat grid ("xarita") next to the raw data. */
export function AnalyticsMap({ materials, newIds, locale }: EnvProps) {
  const t = useTranslations("kasbsim.env.analytics");
  if (!materials.length) return <EmptyEnv />;
  return (
    <div className="space-y-3">
      {materials.map((m) => {
        const mx = matrixOf(m);
        if (!mx) return <MaterialCard key={m.id} m={m} locale={locale} isNew={newIds.has(m.id)} />;
        return (
          <div key={m.id} className="space-y-2 rounded-lg border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4 text-primary" /> {localized(m.title, locale)}
              </p>
              <NewBadge show={newIds.has(m.id)} />
            </div>
            <Body m={m} locale={locale} className="text-xs text-muted-foreground" />
            <div className="rounded-md bg-muted/40 p-2">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("heatmap")}</p>
              <HeatGrid rows={mx.rows} cols={mx.cols} values={mx.values} title={localized(m.title, locale)} />
              <div className="mt-1 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
                {t("low")}
                <span className="h-2 w-24 rounded-full" style={{ background: "linear-gradient(90deg,hsl(120,75%,55%),hsl(60,75%,50%),hsl(0,75%,45%))" }} />
                {t("high")}
              </div>
            </div>
            <details>
              <summary className="min-h-10 cursor-pointer py-2 text-xs font-medium text-primary">{t("raw")}</summary>
              <DataTable m={m} />
            </details>
          </div>
        );
      })}
    </div>
  );
}
