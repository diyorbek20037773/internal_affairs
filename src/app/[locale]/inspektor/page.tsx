import { setRequestLocale } from "next-intl/server";
import { InspektorClient } from "@/components/chat/InspektorClient";
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
    <div className="h-full p-3 md:p-4">
      <InspektorClient initialCaseId={searchParams.case} initialIncidentType={type} />
    </div>
  );
}
