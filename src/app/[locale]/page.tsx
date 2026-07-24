import { getTranslations, setRequestLocale } from "next-intl/server";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { NAV_ENTRIES } from "@/components/layout/nav";

const CARD_KEYS = [
  "inspektor",
  "hodisa",
  "voice",
  "ishlarim",
  "qonunchilik",
  "guide",
] as const;

export default async function DashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("dashboard");
  const tc = await getTranslations("dashboard.cards");

  const hrefOf = (key: string) =>
    NAV_ENTRIES.find((e) => e.key === key)?.href ?? "/";
  const iconOf = (key: string) =>
    NAV_ENTRIES.find((e) => e.key === key)?.icon ?? "CircleHelp";

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-8 overflow-hidden rounded-2xl brand-gradient p-6 text-white shadow-sm md:p-8">
        <p className="text-sm font-medium text-white/70">{t("welcome")}</p>
        <h2 className="mt-1 text-2xl font-bold md:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/80">{t("subtitle")}</p>
      </div>

      <section className="mb-8">
        <DashboardStats />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARD_KEYS.map((key) => (
          <FeatureCard
            key={key}
            href={hrefOf(key)}
            icon={iconOf(key)}
            title={tc(`${key}.title`)}
            description={tc(`${key}.desc`)}
          />
        ))}
      </section>
    </div>
  );
}
