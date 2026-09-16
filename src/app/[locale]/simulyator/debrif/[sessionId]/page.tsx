import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { KeysBanner } from "@/components/chat/KeysBanner";
import { DebriefView } from "@/components/training/debrief/DebriefView";

// Session ids live in the browser — this route is always rendered on demand.
export const dynamic = "force-dynamic";

export default async function DebrifPage(
  props: {
    params: Promise<{ locale: string; sessionId: string }>;
  }
) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations("sim.debrief");
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <KeysBanner />
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <DebriefView sessionId={params.sessionId} />
    </div>
  );
}
