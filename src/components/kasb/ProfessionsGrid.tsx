import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icon";
import { AGENCY_MAP, CLUSTER_MAP, professionsByAgency } from "@/data/kasblar";
import type { AgencyId, ProfessionId } from "@/data/kasblar/types";
import { localized } from "@/data/sops/types";
import { cn } from "@/lib/utils";

/**
 * Cards for profession standards. Works in server and client trees.
 * `agency` filters to one body; `limit` caps the count (home-page teaser);
 * `highlight` marks the trainee's chosen profession.
 */
export function ProfessionsGrid({
  agency,
  limit,
  highlight,
  className,
}: {
  agency?: AgencyId | null;
  limit?: number;
  highlight?: ProfessionId | null;
  className?: string;
}) {
  const t = useTranslations("kasb.grid");
  const locale = useLocale();
  const items = professionsByAgency(agency ?? null).slice(0, limit ?? undefined);

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((p) => (
        <Link key={p.id} href={`/kasblar/${p.id}`} className="group block min-w-0">
          <Card
            className={cn(
              "relative flex h-full flex-col overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover",
              highlight === p.id && "border-primary/60 ring-2 ring-primary/20"
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent via-primary to-accent transition-transform duration-300 group-hover:scale-x-100"
            />
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)] transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon name={p.icon} className="h-5 w-5" />
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                {p.agencies.length > 2 ? (
                  <span className="rounded-full border border-border/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {t("allAgencies")}
                  </span>
                ) : (
                  p.agencies.map((a) => (
                    <span key={a} className="rounded-full border border-border/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {localized(AGENCY_MAP[a].short, locale)}
                    </span>
                  ))
                )}
              </div>
            </div>
            <h3 className="flex items-center gap-1.5 font-semibold leading-snug tracking-tight">
              {localized(p.title, locale)}
              <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </h3>
            {highlight === p.id && (
              <span className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {t("yourTrack")}
              </span>
            )}
            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{localized(p.short, locale)}</p>
            <div className="mt-auto pt-4">
              <div className="flex flex-wrap gap-1">
                {p.clusters.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <Icon name={CLUSTER_MAP[c].icon} className="h-3 w-3" />
                    {localized(CLUSTER_MAP[c].title, locale)}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                <span>
                  <b className="text-foreground">{p.functions.length}</b> {t("functions")}
                </span>
                <span>
                  <b className="text-foreground">{p.competencies.length}</b> {t("competencies")}
                </span>
                <span>
                  <b className="text-foreground">{p.career.length}</b> {t("careerSteps")}
                </span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
