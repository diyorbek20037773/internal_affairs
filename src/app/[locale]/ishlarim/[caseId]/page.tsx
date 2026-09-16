import { redirect } from "@/i18n/navigation";

export default async function CaseRedirect(
  props: {
    params: Promise<{ locale: string; caseId: string }>;
  }
) {
  const params = await props.params;
  redirect({
    href: `/inspektor?case=${params.caseId}`,
    locale: params.locale,
  });
}
