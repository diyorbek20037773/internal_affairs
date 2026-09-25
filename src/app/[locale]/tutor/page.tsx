import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { TutorHub } from "@/components/tutor/TutorHub";

export default async function TutorPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ agency?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  setRequestLocale(params.locale);
  const t = await getTranslations("tutor");
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <TutorHub initialAgency={searchParams.agency} />
    </div>
  );
}
