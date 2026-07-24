import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { IncidentTypeGrid } from "@/components/incident/IncidentTypeGrid";

export default async function HodisaPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("incident");

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
        {t("chooseType")}
      </h3>
      <IncidentTypeGrid />
    </div>
  );
}
