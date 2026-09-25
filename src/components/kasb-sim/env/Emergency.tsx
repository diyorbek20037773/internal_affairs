"use client";

import { useTranslations } from "next-intl";
import { Siren, Truck, RadioTower } from "lucide-react";
import { localized } from "@/data/sops/types";
import { Body, DataTable, EmptyEnv, MetaTable, NewBadge, type EnvProps } from "./shared";
import { cn } from "@/lib/utils";

/** FVV / qutqaruvchi: an incident board — situation cards, resources table, dispatch log. */
export function Emergency({ materials, newIds, locale }: EnvProps) {
  const t = useTranslations("kasbsim.env.emergency");
  if (!materials.length) return <EmptyEnv />;
  const resources = materials.filter((m) => m.kind === "table");
  const log = materials.filter((m) => m.kind === "message");
  const board = materials.filter((m) => !resources.includes(m) && !log.includes(m));

  return (
    <div className="space-y-3 rounded-lg bg-[#3b0d0d]/5 p-2 dark:bg-[#3b0d0d]/30">
      <div className="flex items-center gap-2 rounded-md bg-[#c53030] px-3 py-2 text-sm font-bold uppercase tracking-wider text-white">
        <Siren className="h-4 w-4 animate-pulse" /> {t("board")}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {board.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-md border-l-4 bg-card p-3 shadow-sm",
              m.tone === "warn" ? "border-l-[#c53030]" : "border-l-[#dd6b20]",
              newIds.has(m.id) && "ring-2 ring-accent/40"
            )}
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <p className="text-sm font-semibold leading-snug">{localized(m.title, locale)}</p>
              <NewBadge show={newIds.has(m.id)} />
            </div>
            <Body m={m} locale={locale} />
            <MetaTable m={m} locale={locale} className="mt-2" />
          </div>
        ))}
      </div>

      {resources.map((m) => (
        <div key={m.id} className="rounded-md border border-border bg-card p-3">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Truck className="h-4 w-4 text-[#dd6b20]" /> {t("resources")}: {localized(m.title, locale)}
            </p>
            <NewBadge show={newIds.has(m.id)} />
          </div>
          <Body m={m} locale={locale} className="text-xs text-muted-foreground" />
          <DataTable m={m} className="mt-2" />
        </div>
      ))}

      {log.length > 0 && (
        <div className="rounded-md bg-[#1a202c] p-3 font-mono text-xs text-[#fbd38d]">
          <p className="mb-2 flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-[#feebc8]">
            <RadioTower className="h-3.5 w-3.5" /> {t("log")}
          </p>
          <ul className="space-y-1.5">
            {log.map((m) => (
              <li key={m.id} className={cn(newIds.has(m.id) && "text-white")}>
                <span className="opacity-70">[{m.meta?.[0]?.value ?? "--:--"}]</span> <b>{localized(m.title, locale)}:</b>{" "}
                <span className="whitespace-pre-line">{localized(m.body, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
