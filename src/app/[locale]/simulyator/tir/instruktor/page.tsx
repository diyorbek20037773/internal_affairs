import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { InstructorStation } from "@/components/training/tir/InstructorStation";

export const dynamic = "force-dynamic";

export default async function TirInstructorPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { session?: string; scenario?: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.tir");
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <PageHeader title={t("instructor")} subtitle={t("ins.hint")} />
      {searchParams.session && searchParams.scenario ? (
        <InstructorStation sessionId={searchParams.session} scenarioId={searchParams.scenario} />
      ) : (
        <Card className="p-6">
          <p className="font-semibold">{t("ins.emptyTitle")}</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>{t("ins.emptyStep1")}</li>
            <li>{t("ins.emptyStep2")}</li>
            <li>{t("ins.emptyStep3")}</li>
          </ol>
        </Card>
      )}
    </div>
  );
}
