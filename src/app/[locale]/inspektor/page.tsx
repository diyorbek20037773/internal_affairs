import { setRequestLocale } from "next-intl/server";
import { InspektorClient } from "@/components/chat/InspektorClient";
import { KeysBanner } from "@/components/chat/KeysBanner";
import { INCIDENT_TYPES, type IncidentType } from "@/types/incident";

export default function InspektorPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { case?: string; type?: string };
}) {
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
