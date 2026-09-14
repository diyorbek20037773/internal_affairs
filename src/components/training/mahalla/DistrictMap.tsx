"use client";

import { useLocale } from "next-intl";
import type { MahallaPoint, MahallaScenario } from "@/data/scenarios/types";
import { localized } from "@/data/sops/types";
import { cn } from "@/lib/utils";

const RISK_FILL: Record<MahallaPoint["risk"], string> = {
  green: "fill-success",
  yellow: "fill-accent",
  red: "fill-destructive",
};

const KIND_GLYPH: Record<MahallaPoint["kind"], string> = {
  uy: "⌂",
  maktab: "✎",
  dokon: "▤",
  park: "♣",
  bekat: "⊓",
  masjid: "☾",
  punkt: "★",
};

/** Pure-SVG district grid (pptx slide 4: "Mahalla xaritasi: yashil–sariq–qizil"). */
export function DistrictMap({
  scenario,
  activePointId,
  onSelect,
}: {
  scenario: MahallaScenario;
  activePointId?: string | null;
  onSelect?: (pointId: string | null) => void;
}) {
  const locale = useLocale();
  const { grid: { cols, rows }, points } = scenario.district;
  const cell = 60;
  const w = cols * cell;
  const h = rows * cell;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full rounded-lg border bg-muted/30" role="img">
      {/* streets */}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line key={`v${i}`} x1={i * cell} y1={0} x2={i * cell} y2={h} className="stroke-border" strokeWidth={1} />
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * cell} x2={w} y2={i * cell} className="stroke-border" strokeWidth={1} />
      ))}
      {points.map((p) => {
        const cx = p.x * cell + cell / 2;
        const cy = p.y * cell + cell / 2;
        const active = activePointId === p.id;
        return (
          <g
            key={p.id}
            className="cursor-pointer"
            onClick={() => onSelect?.(active ? null : p.id)}
          >
            {active && <circle cx={cx} cy={cy} r={24} className="fill-primary/15 stroke-primary" strokeWidth={2} />}
            <circle cx={cx} cy={cy} r={16} className={cn(RISK_FILL[p.risk], "opacity-90 transition-all")} />
            <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize={14} className="fill-white font-bold">
              {KIND_GLYPH[p.kind]}
            </text>
            <text x={cx} y={cy + 27} textAnchor="middle" fontSize={9} className="fill-foreground">
              {localized(p.label, locale)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
