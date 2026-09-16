import { setRequestLocale } from "next-intl/server";
import { InspektorClient } from "@/components/chat/InspektorClient";
import { KeysBanner } from "@/components/chat/KeysBanner";
import { INCIDENT_TYPES, type IncidentType } from "@/types/incident";

export default async function InspektorPage(
  props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ case?: string; type?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setRequestLocale(params.locale);

  const type =
    searchParams.type && INCIDENT_TYPES.includes(searchParams.type as never)
      ? (searchParams.type as IncidentType)
      : undefined;

  return (
    <div className="flex h-full flex-col p-3 md:p-4">
      <KeysBanner />
      <div className="min-h-0 flex-1">
        <InspektorClient
          initialCaseId={searchParams.case}
          initialIncidentType={type}
        />
      </div>
    </div>
  );
}
