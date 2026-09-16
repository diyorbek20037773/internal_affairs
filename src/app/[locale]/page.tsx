import { getTranslations, setRequestLocale } from "next-intl/server";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { ModulesGrid } from "@/components/dashboard/ModulesGrid";
import { TrainersGrid } from "@/components/training/TrainersGrid";
import { ProfileGate } from "@/components/training/profile/ProfileGate";
import { MentorCard } from "@/components/training/profile/MentorCard";
import { NAV_ENTRIES } from "@/components/layout/nav";

const CARD_KEYS = ["inspektor", "hodisa", "ishlarim", "qonunchilik", "guide"] as const;

export default async function DashboardPage(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations("dashboard");
  const tc = await getTranslations("dashboard.cards");
  const tm = await getTranslations("modules");

  const hrefOf = (key: string) => NAV_ENTRIES.find((e) => e.key === key)?.href ?? "/";
  const iconOf = (key: string) => NAV_ENTRIES.find((e) => e.key === key)?.icon ?? "CircleHelp";

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6 overflow-hidden rounded-2xl brand-gradient p-6 text-white md:p-9">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
          {t("welcome")}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{t("title")}</h2>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-white/75">{t("subtitle")}</p>
      </div>

      <section className="mb-6">
        <ProfileGate />
      </section>

      <section className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold tracking-tight">{t("trainersTitle")}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{t("trainersSubtitle")}</p>
        </div>
        <TrainersGrid />
      </section>

      <section className="mb-8">
        <MentorCard />
      </section>

      <section className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold tracking-tight">{t("statsTitle")}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{t("statsSubtitle")}</p>
        </div>
        <DashboardStats />
      </section>

      <section className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold tracking-tight">{t("inspectorTitle")}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{t("inspectorSubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARD_KEYS.map((key) => (
            <FeatureCard
              key={key}
              href={hrefOf(key)}
              icon={iconOf(key)}
              title={tc(`${key}.title`)}
              description={tc(`${key}.desc`)}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h3 className="text-lg font-bold tracking-tight">{tm("title")}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{tm("subtitle")}</p>
        </div>
        <ModulesGrid />
      </section>
    </div>
  );
}
