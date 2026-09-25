"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, StickyNote } from "lucide-react";
import { localized } from "@/data/sops/types";
import { Body, DataTable, EmptyEnv, NewBadge, type EnvProps } from "./shared";
import { cn } from "@/lib/utils";

/** Prokuror: a bound case volume — page index on the side, the page, and margin notes. */
export function ProsecutorReview({ materials, newIds, locale }: EnvProps) {
  const t = useTranslations("kasbsim.env.prosecutor");
  const [active, setActive] = useState(materials[0]?.id ?? "");
  const newest = materials.filter((m) => newIds.has(m.id)).at(-1)?.id;
  useEffect(() => {
    if (newest) setActive(newest);
  }, [newest]);
  if (!materials.length) return <EmptyEnv />;
  const idx = Math.max(0, materials.findIndex((m) => m.id === active));
  const m = materials[idx];
  // Running sheet numbers like a real volume: each document takes 1–3 sheets.
  const sheets: number[] = [];
  materials.reduce((acc, x) => {
    sheets.push(acc);
    return acc + 1 + Math.min(2, Math.floor(localized(x.body, locale).length / 600));
  }, 1);

  return (
    <div className="grid gap-2 sm:grid-cols-[150px_1fr]">
      <nav className="rounded-lg border border-[#7b341e]/40 bg-[#7b341e]/10 p-2">
        <p className="mb-1 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-[#7b341e] dark:text-[#f6ad55]">
          <BookOpen className="h-3.5 w-3.5" /> {t("volume")}
        </p>
        <ol className="flex gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
          {materials.map((x, i) => (
            <li key={x.id} className="shrink-0">
              <button
                onClick={() => setActive(x.id)}
                className={cn(
                  "flex min-h-10 w-full items-center gap-1.5 rounded px-2 text-left text-xs",
                  x.id === m.id ? "bg-card font-semibold shadow-sm" : "hover:bg-card/60"
                )}
              >
                <span className="font-mono text-[10px] text-muted-foreground">{t("sheet", { n: sheets[i] })}</span>
                <span className="line-clamp-2 max-w-[9rem] sm:max-w-none">{localized(x.title, locale)}</span>
                {newIds.has(x.id) && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-2 md:grid-cols-[1fr_130px]">
        <article className="min-h-[300px] rounded-md border border-border bg-[#fffdf7] p-4 font-serif shadow dark:bg-[#1f1d19]">
          <div className="mb-2 flex items-start justify-between gap-2 border-b pb-2">
            <h4 className="font-bold leading-snug">{localized(m.title, locale)}</h4>
            <NewBadge show={newIds.has(m.id)} />
          </div>
          <Body m={m} locale={locale} className="font-serif text-[15px]" />
          <DataTable m={m} className="mt-3 font-sans" />
          <p className="mt-4 text-right font-sans text-[11px] text-muted-foreground">{t("sheet", { n: sheets[idx] })}</p>
        </article>
        <aside className="space-y-2">
          <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <StickyNote className="h-3.5 w-3.5" /> {t("margin")}
          </p>
          {(m.meta ?? []).map((x, i) => (
            <div key={i} className="rotate-[-1deg] rounded-sm bg-[#fff3b0] p-2 text-[11px] leading-snug text-[#5c4a00] shadow-sm">
              <b>{localized(x.label, locale)}:</b> {x.value}
            </div>
          ))}
          {m.tone === "warn" && <div className="rounded-sm border border-dashed border-destructive/60 p-2 text-[11px] text-destructive">{t("flag")}</div>}
          {!m.meta?.length && m.tone !== "warn" && <p className="text-[11px] text-muted-foreground">—</p>}
        </aside>
      </div>
    </div>
  );
}
