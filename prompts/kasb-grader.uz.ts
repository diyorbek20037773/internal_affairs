import type { ProfessionSim, SimStage, SimTask } from "@/data/kasblar/types";

type TextTask = Extract<SimTask, { kind: "text" }>;

/** Kasb simulyatori: yozma vazifani muallif rubrikasi bo'yicha baholash (0–3). */
export function buildKasbGraderInstruction(): string {
  return `Sen «Huquqni muhofaza qilish ta'lim klasteri» platformasining Kasb simulyatori baholovchisisan. Huquqni muhofaza qiluvchi organ xodimi (tinglovchi) o'z kasbiga oid simulyatsiya ichida yozma vazifani bajardi: hujjat parchasi, xulosa, ma'lumotnoma yoki javob xati yozdi. Matn nutqdan avtomatik transkripsiya qilingan bo'lishi mumkin — imlo xatolariga e'tibor berma.

# BAHOLASH SHKALASI (score)
- 3 — rubrikaning deyarli barcha bandlari mazmunan bajarilgan, xato yoki noqonuniy taklif yo'q.
- 2 — asosiy bandlar bajarilgan, 1–2 muhim band yetishmaydi.
- 1 — faqat qisman: ko'p bandlar yo'q yoki mazmun yuzaki.
- 0 — vazifaga javob emas, bo'sh, yoki noqonuniy harakatni taklif qiladi (hujjatni soxtalashtirish, bosim, tahdid, kamsitish), yoki o'ylab topilgan qonun moddalariga tayanadi.

# QOIDALAR
1. Bandni so'zma-so'z emas, MAZMUNAN bajarilgan bo'lsa hisobga ol. Shubhali bo'lsa — bajarilmagan.
2. Namunaviy javob — faqat yo'l-yo'riq; tinglovchi uni aynan takrorlashi shart emas.
3. Qonun moddalarini o'zing to'qib chiqarma va tinglovchidan ham talab qilma. Kodeks nomi yetarli.
4. "feedback" — 1–3 gap, "keyingi safar ..." uslubida: nimani qo'shish yoki tuzatish kerak.
5. "missing" — bajarilmagan rubrika bandlarining QISQA nomlari (har biri 3–8 so'z). Hammasi bajarilgan bo'lsa — bo'sh massiv.

# CHIQISH — FAQAT JSON
{ "score": 0|1|2|3, "feedback": string, "missing": string[] }`;
}

export const KASB_GRADE_SCHEMA = {
  type: "OBJECT",
  properties: {
    score: { type: "INTEGER", minimum: 0, maximum: 3 },
    feedback: { type: "STRING" },
    missing: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["score", "feedback", "missing"],
} as const;

export function kasbGraderUserTurn(sim: ProfessionSim, stage: SimStage, task: TextTask, answer: string, locale: string): string {
  const lang =
    locale === "ru"
      ? "\n\nfeedback va missing ni RUS tilida yoz."
      : locale === "en"
        ? "\n\nWrite feedback and missing in ENGLISH."
        : "\n\nfeedback va missing ni o'zbek tilida (lotin yozuvida) yoz.";
  return `# SIMULYATOR: ${sim.code} — ${sim.title.uz}
Kasb: ${sim.professionId}. Muhit: ${sim.setting.uz}
${sim.intro.uz}

# BOSQICH: ${stage.title.uz}
${stage.brief.uz}

# VAZIFA
${task.prompt.uz}
(Tavsiya etilgan minimal hajm: ${task.minWords} so'z.)

# RUBRIKA
${task.rubric.map((r, i) => `${i + 1}. ${r.uz}`).join("\n")}

# NAMUNAVIY JAVOB (faqat yo'l-yo'riq)
${task.model.uz}

# TINGLOVCHI JAVOBI
${answer.trim() || "(bo'sh)"}${lang}`;
}
