"use client";

import { useTranslations } from "next-intl";
import { COMPETENCIES, type Competency, type CompetencyScores } from "@/data/scenarios/competencies";

/** Pure-SVG 8-axis radar. `rated` axes drawn solid; unrated dimmed. */
export function CompetencyRadar({
  scores,
  rated,
  size = 220,
  compare,
}: {
  scores: CompetencyScores;
  rated?: Competency[];
  size?: number;
  /** Optional second polygon (e.g. previous profile) drawn dashed. */
  compare?: CompetencyScores;
}) {
  const tk = useTranslations("sim.competencies");
  const n = COMPETENCIES.length;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 34;
  const ratedSet = new Set(rated ?? COMPETENCIES);

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, v: number) => {
    const a = angle(i);
    const rr = (r * v) / 100;
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)] as const;
  };
  const poly = (s: CompetencyScores) =>
    COMPETENCIES.map((c, i) => pt(i, ratedSet.has(c) ? s[c] : 0).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-auto w-full max-w-[260px]" role="img">
      {[25, 50, 75, 100].map((lvl) => (
        <polygon
          key={lvl}
          points={COMPETENCIES.map((_, i) => pt(i, lvl).join(",")).join(" ")}
          className="fill-none stroke-border"
          strokeWidth={lvl === 100 ? 1 : 0.5}
        />
      ))}
      {COMPETENCIES.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="stroke-border" strokeWidth={0.5} />;
      })}
      {compare && (
        <polygon points={poly(compare)} className="fill-none stroke-muted-foreground" strokeWidth={1} strokeDasharray="3 3" />
      )}
      <polygon points={poly(scores)} className="fill-primary/25 stroke-primary" strokeWidth={1.5} />
      {COMPETENCIES.map((c, i) => {
        const [x, y] = pt(i, ratedSet.has(c) ? scores[c] : 0);
        return <circle key={c} cx={x} cy={y} r={2.5} className={ratedSet.has(c) ? "fill-primary" : "fill-muted-foreground/40"} />;
      })}
      {COMPETENCIES.map((c, i) => {
        const [x, y] = pt(i, 122);
        const a = angle(i);
        const anchor = Math.cos(a) > 0.2 ? "start" : Math.cos(a) < -0.2 ? "end" : "middle";
        return (
          <text
            key={c}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className={ratedSet.has(c) ? "fill-foreground" : "fill-muted-foreground/60"}
            fontSize={8.5}
          >
            {tk(c)}
          </text>
        );
      })}
    </svg>
  );
}
