"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { localized } from "@/data/sops/types";
import { Body, EmptyEnv, MaterialCard, MetaTable, NewBadge, type EnvProps } from "./shared";
import { cn } from "@/lib/utils";

const MARKER_KINDS = new Set(["evidence", "photo"]);
/** Fixed marker slots on the scene plan (x, y in a 400×260 viewBox). */
const SLOTS: [number, number][] = [
  [92, 70], [300, 64], [210, 150], [120, 200], [330, 190], [60, 140], [250, 90], [180, 60], [350, 120], [150, 120],
];

/** Ekspert-kriminalist: a scene plan with numbered evidence markers + evidence cards. */
export function CrimeScene({ materials, newIds, locale }: EnvProps) {
  const t = useTranslations("kasbsim.env");
  const markers = materials.filter((m) => MARKER_KINDS.has(m.kind));
  const docs = materials.filter((m) => !MARKER_KINDS.has(m.kind));
  const [sel, setSel] = useState(markers[0]?.id ?? "");
  const newest = markers.filter((m) => newIds.has(m.id)).at(-1)?.id;
  useEffect(() => {
    if (newest) setSel(newest);
  }, [newest]);
  if (!materials.length) return <EmptyEnv />;
  const selected = markers.find((m) => m.id === sel);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-border bg-[#1f2933]">
        <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-[#cbd2d9]">{t("crimeScene.plan")}</p>
        <svg viewBox="0 0 400 260" className="block h-auto w-full" role="img" aria-label={t("crimeScene.plan")}>
          <defs>
            <pattern id="ks-floor" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="#3e4c59" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect x="16" y="16" width="368" height="228" fill="url(#ks-floor)" stroke="#9aa5b1" strokeWidth="4" />
          {/* door + window */}
          <rect x="176" y="238" width="48" height="8" fill="#1f2933" />
          <path d="M176 244 A48 48 0 0 1 224 196" fill="none" stroke="#9aa5b1" strokeDasharray="3 3" />
          <rect x="16" y="90" width="6" height="60" fill="#7cc4fa" />
          {/* furniture */}
          <rect x="40" y="30" width="90" height="36" rx="3" fill="#52606d" />
          <rect x="270" y="30" width="96" height="50" rx="3" fill="#52606d" />
          <rect x="170" y="110" width="80" height="50" rx="6" fill="#616e7c" />
          <rect x="300" y="170" width="64" height="56" rx="3" fill="#52606d" />
          <text x="24" y="254" fontSize="9" fill="#9aa5b1">N ↑ · 1:50</text>
          {markers.map((m, i) => {
            const [x, y] = SLOTS[i % SLOTS.length];
            const on = sel === m.id;
            return (
              <g key={m.id} onClick={() => setSel(m.id)} className="cursor-pointer" role="button" aria-label={localized(m.title, locale)}>
                <circle cx={x} cy={y} r="18" fill="transparent" />
                <path d={`M${x} ${y - 13} L${x + 12} ${y + 9} L${x - 12} ${y + 9} Z`} fill={on ? "#f7c948" : "#f0b429"} stroke={on ? "#fff" : "#8d6708"} strokeWidth={on ? 2 : 1} />
                <text x={x} y={y + 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1f2933">
                  {i + 1}
                </text>
                {newIds.has(m.id) && <circle cx={x + 12} cy={y - 10} r="4" fill="#ef4e4e" />}
              </g>
            );
          })}
        </svg>
      </div>

      {markers.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {markers.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setSel(m.id)}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs transition-colors",
                sel === m.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#f0b429] text-[11px] font-bold text-[#1f2933]">{i + 1}</span>
              <span className="line-clamp-2">{localized(m.title, locale)}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="rounded-lg border-2 border-[#f0b429]/60 bg-card p-3">
          <div className="mb-1 flex items-start justify-between gap-2">
            <p className="text-sm font-bold">
              {t("crimeScene.evidence")} №{markers.indexOf(selected) + 1}: {localized(selected.title, locale)}
            </p>
            <NewBadge show={newIds.has(selected.id)} />
          </div>
          <Body m={selected} locale={locale} />
          <MetaTable m={selected} locale={locale} className="mt-2" />
        </div>
      )}

      {docs.map((m) => (
        <MaterialCard key={m.id} m={m} locale={locale} isNew={newIds.has(m.id)} />
      ))}
    </div>
  );
}
