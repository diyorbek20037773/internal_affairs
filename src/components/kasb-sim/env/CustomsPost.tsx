"use client";

import { useTranslations } from "next-intl";
import { Truck } from "lucide-react";
import { localized } from "@/data/sops/types";
import { Body, DataTable, EmptyEnv, MaterialCard, NewBadge, type EnvProps } from "./shared";
import { cn } from "@/lib/utils";

/** Bojxona: the checkpoint — a declaration form with numbered boxes, then the cargo documents. */
export function CustomsPost({ materials, newIds, locale }: EnvProps) {
  const t = useTranslations("kasbsim.env.customs");
  if (!materials.length) return <EmptyEnv />;
  const decls = materials.filter((m) => m.kind === "declaration");
  const cargo = materials.filter((m) => m.kind !== "declaration");

  return (
    <div className="space-y-3">
      <div
        className="h-2 rounded-full"
        style={{ background: "repeating-linear-gradient(135deg,#f0b429 0 14px,#1f2933 14px 28px)" }}
        aria-hidden
      />
      {decls.map((m) => (
        <div key={m.id} className={cn("overflow-hidden rounded-lg border-2 border-[#2c5282]/60 bg-[#f7fbff] dark:bg-card", newIds.has(m.id) && "ring-2 ring-accent/40")}>
          <div className="flex items-center justify-between gap-2 bg-[#2c5282] px-3 py-1.5 text-white">
            <span className="text-xs font-bold uppercase tracking-wider">{localized(m.title, locale)}</span>
            <NewBadge show={newIds.has(m.id)} />
          </div>
          <div className="grid grid-cols-1 gap-px bg-[#2c5282]/30 sm:grid-cols-2">
            {(m.meta ?? []).map((x, i) => (
              <div key={i} className="bg-[#f7fbff] px-3 py-2 dark:bg-card">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t("box", { n: i + 1 })} · {localized(x.label, locale)}
                </p>
                <p className="font-mono text-sm font-semibold">{x.value}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2c5282]/30 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{t("goods")}</p>
            <Body m={m} locale={locale} />
          </div>
          <DataTable m={m} className="m-2" />
        </div>
      ))}

      {cargo.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Truck className="h-4 w-4" /> {t("cargo")}
          </p>
          {cargo.map((m) => (
            <MaterialCard key={m.id} m={m} locale={locale} isNew={newIds.has(m.id)} className={m.table ? "font-mono" : undefined} />
          ))}
        </div>
      )}
    </div>
  );
}
