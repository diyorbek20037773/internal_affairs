import type { MahallaScenario } from "@/data/scenarios/types";

/** Grades the trainee's per-problem action plans against the authored rubric. */
export function buildMahallaGraderInstruction(): string {
  return `Sen Huquqni muhofaza qilish ta'lim klasteri platformasining Smart Mahalla trenajyori uchun instruktor-yordamchisisan. Profilaktika inspektori virtual uchastkadagi muammolar uchun HARAKAT REJASI yozdi. Sen har bir rejani rubrika bo'yicha baholaysan.

# QOIDALAR
- Har bir muammo uchun rubrikada "bo'lishi shart" harakatlar berilgan. Reja matnida shu harakat MAZMUNAN bo'lsa (so'zma-so'z bo'lishi shart emas) — hisobga ol.
- score (0–100): rubrikadagi harakatlarning qanchasi qamrab olingani + aniqlik (kim, qachon, nima) + qonuniylik.
- missing: rubrikadan rejada YO'Q harakatlar (rubrika so'zlari bilan).
- feedback: 1–2 gap, konstruktiv, o'zbek tilida, "keyingi safar ..." uslubida.
- Bo'sh reja: score 0, missing = butun rubrika.
- Qonunga zid harakat (masalan, ruxsatsiz uyga bostirib kirish, kuch ishlatish tahdidi) taklif qilinsa — score kamida 30 ball pasayadi va feedback'da ko'rsatiladi.

# CHIQISH — FAQAT JSON
{"planScores": {"<problemId>": {"score": int, "missing": string[], "feedback": string}, ...}}
Faqat berilgan problemId lar uchun javob ber.`;
}

export const MAHALLA_GRADE_SCHEMA = {
  type: "OBJECT",
  properties: {
    planScores: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          problemId: { type: "STRING" },
          score: { type: "INTEGER" },
          missing: { type: "ARRAY", items: { type: "STRING" } },
          feedback: { type: "STRING" },
        },
        required: ["problemId", "score", "missing", "feedback"],
      },
    },
  },
  required: ["planScores"],
} as const;

export function mahallaGraderUserTurn(
  s: MahallaScenario,
  picked: string[],
  plans: Record<string, string>,
  locale: string
): string {
  const blocks = picked.map((id) => {
    const pr = s.problems.find((p) => p.id === id);
    const rubric = s.answerKey.planRubric[id] ?? [];
    return `## problemId: ${id}
Muammo: ${pr?.title.uz ?? id}
Rubrika (bo'lishi shart):
${rubric.map((r) => `- ${r}`).join("\n") || "- (rubrika yo'q — umumiy mantiq bo'yicha bahola)"}
Xodim rejasi:
${plans[id]?.trim() || "(bo'sh)"}`;
  });
  const lang = locale === "ru" ? "\n\nfeedback matnini RUS tilida yoz." : locale === "en" ? "\n\nWrite feedback in ENGLISH." : "";
  return `# UCHASTKA ${s.district.code} — ${s.title.uz}\n\n${blocks.join("\n\n")}${lang}`;
}
