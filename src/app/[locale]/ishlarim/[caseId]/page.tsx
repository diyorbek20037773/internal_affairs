import { redirect } from "@/i18n/navigation";

export default function CaseRedirect({
  params,
}: {
  params: { locale: string; caseId: string };
}) {
  redirect({
    href: `/inspektor?case=${params.caseId}`,
    locale: params.locale,
  });
}
