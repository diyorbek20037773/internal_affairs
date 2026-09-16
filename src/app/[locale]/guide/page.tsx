import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";

const TRAINEE_STEPS = ["one", "two", "three", "four", "five", "six"] as const;
const INSTRUCTOR_STEPS = ["one", "two", "three", "four"] as const;
const MODULE_STEPS = ["one", "two", "three"] as const;

export default async function GuidePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations("guide");

  const Steps = ({ keys, ns }: { keys: readonly string[]; ns: string }) => (
    <div className="space-y-3">
      {keys.map((key, idx) => (
        <Card key={key} className="flex items-start gap-4 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-glow">
            {idx + 1}
          </span>
          <p className="pt-1.5 text-sm leading-relaxed">{t(`${ns}.${key}`)}</p>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="mb-8">
        <h3 className="mb-3 text-lg font-bold tracking-tight">{t("traineeTitle")}</h3>
        <Steps keys={TRAINEE_STEPS} ns="trainee" />
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-lg font-bold tracking-tight">{t("instructorTitle")}</h3>
        <Steps keys={INSTRUCTOR_STEPS} ns="instructor" />
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-lg font-bold tracking-tight">{t("moduleTitle")}</h3>
        <Steps keys={MODULE_STEPS} ns="steps" />
      </section>

      <Card className="overflow-hidden border-0 shadow-none brand-gradient p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{t("sloganTitle")}</p>
        <p className="mt-2.5 text-lg font-semibold leading-snug text-balance">{t("slogan")}</p>
      </Card>
    </div>
  );
}
