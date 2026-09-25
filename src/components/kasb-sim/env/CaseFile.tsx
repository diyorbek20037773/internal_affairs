"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FolderOpen } from "lucide-react";
import { localized } from "@/data/sops/types";
import { Body, DataTable, EmptyEnv, MetaTable, NewBadge, TabStrip, type EnvProps } from "./shared";
import { cn } from "@/lib/utils";

/** Tergovchi: a criminal-case folder — tabbed documents rendered as paper pages. */
export function CaseFile({ materials, newIds, locale }: EnvProps) {
  const t = useTranslations("kasbsim.env");
  const [active, setActive] = useState(materials[0]?.id ?? "");
  const newest = materials.filter((m) => newIds.has(m.id)).at(-1)?.id;
  useEffect(() => {
    if (newest) setActive(newest);
  }, [newest]);
  if (!materials.length) return <EmptyEnv />;
  const idx = Math.max(0, materials.findIndex((m) => m.id === active));
  const m = materials[idx];

  return (
    <div className="flex h-full flex-col rounded-lg bg-[#c9a66b]/25 p-2 dark:bg-[#6b5733]/30">
      <div className="mb-1 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-[#7a5a26] dark:text-[#e3c58f]">
        <FolderOpen className="h-4 w-4" /> {t("caseFile.folder")}
      </div>
      <TabStrip
        items={materials.map((x, i) => ({ id: x.id, label: `${i + 1}. ${localized(x.title, locale)}`, isNew: newIds.has(x.id) }))}
        active={m.id}
        onPick={setActive}
      />
      <article
        className={cn(
          "relative min-h-[320px] flex-1 rounded-b-md rounded-tr-md border border-border bg-[#fffdf7] p-5 font-serif text-[#222] shadow-md dark:bg-[#1f1d19] dark:text-[#e8e4da]",
          m.tone === "warn" && "border-l-4 border-l-accent"
        )}
      >
        <div className="mb-3 flex items-start justify-between gap-2 border-b border-dashed border-[#bbb] pb-2">
          <h4 className="text-base font-bold leading-snug">{localized(m.title, locale)}</h4>
          <NewBadge show={newIds.has(m.id)} />
        </div>
        <Body m={m} locale={locale} className="font-serif text-[15px]" />
        <MetaTable m={m} locale={locale} className="mt-3 font-sans" />
        <DataTable m={m} className="mt-3 font-sans" />
        <p className="mt-6 text-right font-sans text-[11px] text-muted-foreground">{t("caseFile.page", { n: idx + 1, total: materials.length })}</p>
      </article>
    </div>
  );
}
