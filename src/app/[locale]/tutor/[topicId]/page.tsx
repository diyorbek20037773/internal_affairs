import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { KeysBanner } from "@/components/chat/KeysBanner";
import { TutorClient } from "@/components/tutor/TutorClient";
import { getTopic, TUTOR_TOPICS } from "@/data/tutor";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => TUTOR_TOPICS.map((tp) => ({ locale, topicId: tp.id })));
}

export default async function TutorTopicPage(props: { params: Promise<{ locale: string; topicId: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const topic = getTopic(params.topicId);
  if (!topic) notFound();

  return (
    <div className="mx-auto max-w-7xl p-3 md:p-4">
      <KeysBanner />
      <TutorClient topic={topic} />
    </div>
  );
}
