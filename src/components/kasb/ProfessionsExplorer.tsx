"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/icon";
import { AGENCIES, professionsByAgency } from "@/data/kasblar";
import type { AgencyId, ProfessionId } from "@/data/kasblar/types";
import { localized } from "@/data/sops/types";
import { kasbRepo } from "@/lib/storage/kasb";
import { cn } from "@/lib/utils";
import { ProfessionsGrid } from "./ProfessionsGrid";

/** Agency filter tabs + professions grid (highlights the saved track). */
export function ProfessionsExplorer({ initialAgency }: { initialAgency?: AgencyId | null }) {
  const t = useTranslations("kasb.grid");
  const locale = useLocale();
  const [agency, setAgency] = useState<AgencyId | null>(initialAgency ?? null);
  const [track, setTrack] = useState<ProfessionId | null>(null);

  useEffect(() => {
    const load = () => kasbRepo.getTrack().then((tr) => setTrack(tr?.profession ?? null));
    load();
    window.addEventListener(kasbRepo.CHANGE_EVENT, load);
    return () => window.removeEventListener(kasbRepo.CHANGE_EVENT, load);
  }, []);

  const tabs: { id: AgencyId | null; label: string; icon: string; count: number }[] = [
    { id: null, label: t("all"), icon: "Layers", count: professionsByAgency(null).length },
    ...AGENCIES.map((a) => ({ id: a.id, label: localized(a.short, locale), icon: a.icon, count: professionsByAgency(a.id).length })),
  ];
  const current = agency ? AGENCIES.find((a) => a.id === agency) : null;

  return (
    <div>
      <div role="tablist" aria-label={t("filterLabel")} className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.id === agency;
          return (
            <button
              key={tab.id ?? "all"}
              role="tab"
              aria-selected={active}
              onClick={() => setAgency(tab.id)}
              className={cn(
                "inline-flex min-h-[40px] items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/80 bg-card text-foreground/80 hover:border-primary/40 hover:text-primary"
              )}
            >
              <Icon name={tab.icon} className="h-4 w-4" />
              {tab.label}
              <span className={cn("rounded-full px-1.5 text-[11px]", active ? "bg-white/20" : "bg-muted text-muted-foreground")}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
      {current && (
        <p className="mb-4 rounded-lg border border-border/60 bg-muted/40 p-3 text-sm leading-relaxed text-muted-foreground">
          <b className="text-foreground">{localized(current.title, locale)}.</b> {localized(current.description, locale)}
        </p>
      )}
      <ProfessionsGrid agency={agency} highlight={track} />
    </div>
  );
}
