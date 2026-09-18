import type { DecisionNode, DecisionScenario, DecisionTask } from "@/data/scenarios/types";
import type { LawRef } from "@/data/sops/types";

type FreeTask = Extract<DecisionTask, { kind: "voice" | "text" }>;

/** Qaror simulyatori: ovozli / yozma vazifani rubrika bo'yicha baholash. */
export function buildTaskGraderInstruction(laws: LawRef[]): string {
  const lawList = laws.length
    ? laws.map((l) => `- ${l.code}${l.article ? `, ${l.article}` : ""}${l.title ? ` — ${l.title}` : ""}`).join("\n")
    : "- (yo'q)";
  return `Sen O'quv klasteri platformasining Qaror simulyatori uchun baholovchisisan. Ichki ishlar organi xodimi ssenariy ichida bitta vazifani bajardi: yoki fuqaroga OVOZ CHIQARIB gapirdi (matn — nutqning avtomatik transkripsiyasi, imlo xatolariga e'tibor berma), yoki xizmat hujjati parchasini YOZDI.

# QOIDALAR
1. Rubrikadagi HAR BIR band uchun "met" ni aniqla: mazmunan bajarilgan bo'lsa true (so'zma-so'z shart emas). Shubhali bo'lsa — false.
2. "violation" = true, agar xodim haqorat qilsa, tahdid qilsa, noqonuniy va'da bersa (masalan, "ariza yozmasangiz qamayman"), fuqaroni aybdor deb e'lon qilsa yoki quyidagi ro'yxatda YO'Q qonun/moddani keltirsa.
3. Qonun moddalarini o'zing to'qib chiqarma. Faqat ruxsat etilgan ro'yxatga tayan.
4. "feedback" — 1–2 gap, "keyingi safar ..." uslubida, aniq nimani qo'shish kerakligini ayt.
5. "strength" — 1 gap, xodim nimani yaxshi qildi (bo'lmasa — bo'sh qator).

# RUXSAT ETILGAN HUQUQIY ASOSLAR
${lawList}

# CHIQISH — FAQAT JSON
{ "rubric": [{"id": string, "met": boolean}], "violation": boolean, "feedback": string, "strength": string }`;
}

export const TASK_GRADE_SCHEMA = {
  type: "OBJECT",
  properties: {
    rubric: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { id: { type: "STRING" }, met: { type: "BOOLEAN" } },
        required: ["id", "met"],
      },
    },
    violation: { type: "BOOLEAN" },
    feedback: { type: "STRING" },
    strength: { type: "STRING" },
  },
  required: ["rubric", "violation", "feedback", "strength"],
} as const;

export function taskGraderUserTurn(s: DecisionScenario, node: DecisionNode, task: FreeTask, response: string, locale: string): string {
  const lang = locale === "ru" ? "\n\nfeedback va strength ni RUS tilida yoz." : locale === "en" ? "\n\nWrite feedback and strength in ENGLISH." : "";
  return `# SSENARIY: ${s.code} — ${s.title.uz}
${s.brief.uz}

# VAZIYAT
${node.situation.uz}

# VAZIFA (${task.kind === "voice" ? "ovozli javob" : "yozma javob"}${task.addressee ? ` — ${task.addressee.uz}` : ""})
${task.prompt.uz}

# RUBRIKA
${task.rubric.map((r) => `- id=${r.id}: ${r.text.uz}`).join("\n")}

# XODIM JAVOBI
${response.trim() || "(bo'sh)"}${lang}`;
}
