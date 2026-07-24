import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";

const STEP_KEYS = ["one", "two", "three", "four", "five"] as const;

export default async function GuidePage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("guide");

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="space-y-3">
        {STEP_KEYS.map((key, idx) => (
          <Card key={key} className="flex items-start gap-4 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {idx + 1}
            </span>
            <p className="pt-1 text-sm">{t(`steps.${key}`)}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 overflow-hidden brand-gradient p-6 text-white">
        <p className="text-xs font-medium uppercase tracking-wide text-white/70">
          {t("sloganTitle")}
        </p>
        <p className="mt-2 text-lg font-semibold leading-snug text-balance">
          {t("slogan")}
        </p>
      </Card>
    </div>
  );
}
