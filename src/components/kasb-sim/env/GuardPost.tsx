"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Radio } from "lucide-react";
import { localized } from "@/data/sops/types";
import { Body, EmptyEnv, MaterialCard, MetaTable, NewBadge, type EnvProps } from "./shared";
import { cn } from "@/lib/utils";

/** Event points on the post schema (x, y in a 400×240 viewBox). */
const POINTS: [number, number][] = [
  [70, 60], [330, 60], [200, 120], [70, 190], [330, 190], [200, 40], [200, 205], [130, 120], [270, 120],
];
const EVENT_KINDS = new Set(["evidence", "photo", "note", "document", "application"]);

/** Gvardiya: a guarded-object / event schema with numbered event points + a radio log. */
export function GuardPost({ materials, newIds, locale }: EnvProps) {
  const t = useTranslations("kasbsim.env.guard");
  const radio = materials.filter((m) => m.kind === "message");
  const events = materials.filter((m) => EVENT_KINDS.has(m.kind));
  const other = materials.filter((m) => !radio.includes(m) && !events.includes(m));
  const [sel, setSel] = useState(events[0]?.id ?? "");
  const newest = events.filter((m) => newIds.has(m.id)).at(-1)?.id;
  useEffect(() => {
    if (newest) setSel(newest);
  }, [newest]);
  if (!materials.length) return <EmptyEnv />;
  const selected = events.find((m) => m.id === sel);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-border bg-[#243b2f]">
        <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-[#c6f6d5]">{t("schema")}</p>
        <svg viewBox="0 0 400 240" className="block h-auto w-full" role="img" aria-label={t("schema")}>
          <rect x="30" y="24" width="340" height="196" fill="none" stroke="#9ae6b4" strokeWidth="3" strokeDasharray="10 5" />
          <rect x="150" y="90" width="100" height="60" fill="#2f5d45" stroke="#9ae6b4" />
          <text x="200" y="124" textAnchor="middle" fontSize="10" fill="#c6f6d5">{t("object")}</text>
          <rect x="185" y="214" width="30" height="12" fill="#f0b429" />
          <text x="200" y="236" textAnchor="middle" fontSize="9" fill="#c6f6d5">{t("gate")}</text>
          {[[30, 24], [370, 24], [30, 220], [370, 220]].map(([x, y], i) => (
            <rect key={i} x={x - 7} y={y - 7} width="14" height="14" fill="#48bb78" />
          ))}
          {events.map((m, i) => {
            const [x, y] = POINTS[i % POINTS.length];
            const on = sel === m.id;
            return (
              <g key={m.id} onClick={() => setSel(m.id)} className="cursor-pointer" role="button" aria-label={localized(m.title, locale)}>
                <circle cx={x} cy={y} r="20" fill="transparent" />
                <circle cx={x} cy={y} r={on ? 13 : 11} fill={m.tone === "warn" ? "#e53e3e" : "#3182ce"} stroke="#fff" strokeWidth={on ? 3 : 1.5} />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected && (
        <div className={cn("rounded-lg border bg-card p-3", selected.tone === "warn" ? "border-destructive/50" : "border-border")}>
          <div className="mb-1 flex items-start justify-between gap-2">
            <p className="text-sm font-bold">
              {events.indexOf(selected) + 1}. {localized(selected.title, locale)}
            </p>
            <NewBadge show={newIds.has(selected.id)} />
          </div>
          <Body m={selected} locale={locale} />
          <MetaTable m={selected} locale={locale} className="mt-2" />
        </div>
      )}

      {radio.length > 0 && (
        <div className="rounded-lg border border-[#2f855a]/40 bg-[#0b1f14] p-3 font-mono text-xs text-[#c6f6d5]">
          <p className="mb-2 flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider">
            <Radio className="h-3.5 w-3.5" /> {t("radio")}
          </p>
          <ul className="space-y-2">
            {radio.map((m) => (
              <li key={m.id} className={cn(newIds.has(m.id) && "text-[#fefcbf]")}>
                <span className="opacity-70">[{m.meta?.[0]?.value ?? "--:--"}]</span> <b>{localized(m.title, locale)}:</b>{" "}
                <span className="whitespace-pre-line">{localized(m.body, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {other.map((m) => (
        <MaterialCard key={m.id} m={m} locale={locale} isNew={newIds.has(m.id)} />
      ))}
    </div>
  );
}
