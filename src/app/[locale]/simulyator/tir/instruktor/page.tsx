import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { InstructorStation } from "@/components/training/tir/InstructorStation";
import { LiveRanges } from "@/components/training/tir/LiveRanges";

export const dynamic = "force-dynamic";

export default async function TirInstructorPage(
  props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ session?: string; scenario?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.tir");
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <PageHeader title={t("instructor")} subtitle={t("ins.hint")} />
      {searchParams.session && searchParams.scenario ? (
        <InstructorStation sessionId={searchParams.session} scenarioId={searchParams.scenario} />
      ) : (
        <>
        <LiveRanges />
        <Card className="p-6">
          <p className="font-semibold">{t("ins.emptyTitle")}</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>{t("ins.emptyStep1")}</li>
            <li>{t("ins.emptyStep2")}</li>
            <li>{t("ins.emptyStep3")}</li>
          </ol>
        </Card>
        </>
      )}
    </div>
  );
}
