import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock, Layers } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { ALL_SIMS } from "@/data/kasblar/sims";
import { getProfession, PROFESSION_IDS } from "@/data/kasblar";
import { localized } from "@/data/sops/types";
import { KasbRecentResults } from "@/components/kasb-sim/KasbRecentResults";
import { cn } from "@/lib/utils";

export default async function KasbSimHubPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ profession?: string }>;
}) {
  const [{ locale }, sp] = await Promise.all([props.params, props.searchParams]);
  setRequestLocale(locale);
  const t = await getTranslations("kasbsim");

  const present = PROFESSION_IDS.filter((p) => ALL_SIMS.some((s) => s.professionId === p));
  const filter = sp.profession && present.includes(sp.profession as (typeof present)[number]) ? sp.profession : undefined;
  const sims = filter ? ALL_SIMS.filter((s) => s.professionId === filter) : ALL_SIMS;

  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-10 shrink-0 items-center rounded-full border px-3.5 text-sm font-medium transition-colors",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"
    );

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <PageHeader title={t("hub.title")} subtitle={t("hub.subtitle")} />

      <nav className="-mx-1 flex flex-wrap gap-2 px-1" aria-label={t("hub.filter")}>
        <Link href="/kasb-simulyator" className={chip(!filter)}>
          {t("hub.all")}
        </Link>
        {present.map((p) => {
          const prof = getProfession(p);
          return (
            <Link key={p} href={{ pathname: "/kasb-simulyator", query: { profession: p } }} className={chip(filter === p)}>
              {prof ? localized(prof.title, locale) : p}
            </Link>
          );
        })}
      </nav>

      {sims.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("hub.empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sims.map((s) => {
            const prof = getProfession(s.professionId);
            return (
              <Link key={s.id} href={`/kasb-simulyator/${s.id}`} className="group block min-w-0">
                <Card className="flex h-full flex-col gap-3 p-4 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-card-hover">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon name={prof?.icon ?? "Layers"} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">{prof ? localized(prof.title, locale) : s.professionId}</p>
                      <Badge variant="outline" className="mt-0.5 font-mono text-[10px]">
                        {s.code}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="font-bold leading-snug">{localized(s.title, locale)}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{localized(s.setting, locale)}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <Badge variant="secondary" className="gap-1">
                      <Layers className="h-3 w-3" /> {t(`envKind.${s.env}`)}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" /> {t("hub.minutes", { n: s.minutes })}
                    </span>
                    <span className="text-muted-foreground">· {t("hub.stages", { n: s.stages.length })}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <KasbRecentResults />
    </div>
  );
}
