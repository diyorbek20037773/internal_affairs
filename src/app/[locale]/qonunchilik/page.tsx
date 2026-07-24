import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalClient } from "@/components/legal/LegalClient";

export default async function QonunchilikPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <LegalClient />
    </div>
  );
}
