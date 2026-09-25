"use client";

import { useTranslations } from "next-intl";
import { UserRound, NotebookPen } from "lucide-react";
import { localized } from "@/data/sops/types";
import { Body, DataTable, EmptyEnv, MaterialCard, MetaTable, NewBadge, type EnvProps } from "./shared";
import { cn } from "@/lib/utils";

/** Psixolog: a client card (first document with facts) + a session-notes timeline. */
export function Counseling({ materials, newIds, locale }: EnvProps) {
  const t = useTranslations("kasbsim.env.counseling");
  if (!materials.length) return <EmptyEnv />;
  const card = materials.find((m) => m.meta?.length && m.kind !== "message") ?? null;
  const notes = materials.filter((m) => m !== card && (m.kind === "note" || m.kind === "message"));
  const rest = materials.filter((m) => m !== card && !notes.includes(m));

  return (
    <div className="space-y-3">
      {card && (
        <div className={cn("flex gap-3 rounded-lg border border-[#6b46c1]/40 bg-[#6b46c1]/5 p-3", newIds.has(card.id) && "ring-2 ring-accent/40")}>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#6b46c1]/15 text-[#6b46c1]">
            <UserRound className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b46c1]">{t("client")}</p>
              <NewBadge show={newIds.has(card.id)} />
            </div>
            <p className="text-sm font-bold">{localized(card.title, locale)}</p>
            <MetaTable m={card} locale={locale} />
            <Body m={card} locale={locale} className="text-xs text-muted-foreground" />
          </div>
        </div>
      )}

      {notes.length > 0 && (
        <div className="rounded-lg border border-border bg-[repeating-linear-gradient(#fff,#fff_27px,#e2e8f0_28px)] p-3 dark:bg-none dark:bg-card">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <NotebookPen className="h-3.5 w-3.5" /> {t("notes")}
          </p>
          <ol className="relative space-y-3 border-l-2 border-[#6b46c1]/30 pl-4">
            {notes.map((m) => (
              <li key={m.id} className="relative">
                <span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 border-card bg-[#6b46c1]" />
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{localized(m.title, locale)}</p>
                  <NewBadge show={newIds.has(m.id)} />
                </div>
                <Body m={m} locale={locale} className={m.kind === "message" ? "italic" : undefined} />
                <MetaTable m={m} locale={locale} className="mt-1" />
                <DataTable m={m} className="mt-1" />
              </li>
            ))}
          </ol>
        </div>
      )}

      {rest.map((m) => (
        <MaterialCard key={m.id} m={m} locale={locale} isNew={newIds.has(m.id)} />
      ))}
    </div>
  );
}
