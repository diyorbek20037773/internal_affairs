import type { DocumentScenario } from "@/data/scenarios/types";
import type { LawRef } from "@/data/sops/types";

/** AI hujjat tekshiruvi — qonun va fakt (pptx slide 9, 15:00). */
export function buildDocumentCheckerInstruction(laws: LawRef[]): string {
  const lawList = laws.length
    ? laws.map((l) => `- ${l.code}${l.article ? `, ${l.article}` : ""}${l.title ? ` — ${l.title}` : ""}`).join("\n")
    : "- (yo'q)";
  return `Sen O'quv klasteri platformasining hujjat tekshiruvchisisan. Ichki ishlar organi xodimi yozgan xizmat hujjatini (bayonnoma / ma'lumotnoma) BERILGAN FAKTLAR va RUBRIKA bo'yicha tekshirasan.

# TEKSHIRUV MEZONLARI
1. TO'LIQLIK — rubrikadagi har bir element hujjatda bormi (mazmunan, so'zma-so'z shart emas).
2. FAKT ANIQLIGI — hujjatda berilgan faktlarga zid yoki O'YLAB TOPILGAN ma'lumot bormi (vaqt, ism, holat). "Taqiqlangan" ro'yxatdagi xatolar — jiddiy.
3. HUQUQIY ASOS — faqat ruxsat etilgan hujjatlar ro'yxatidan. O'ylab topilgan modda, xodim vakolatidan tashqari xulosa (aybdor deyish, hukm) — legalErrors.
4. OHANG — neytral, rasmiy, baholovchi/haqoratli so'zlarsiz.

# RUXSAT ETILGAN HUQUQIY ASOSLAR
${lawList}

# BAHO (score 0–100)
- Rubrika elementlari qamrovi — 60% ulush.
- Fakt xatosi har biri −10, taqiqlangan xato −15.
- Huquqiy xato har biri −10.
- Neytral ohang buzilsa −10.
- Hujjat juda qisqa (min so'zdan kam) bo'lsa — maksimal 40.

# CHIQISH — FAQAT JSON
{
 "score": int,
 "elements": [{"id": string, "present": boolean, "note": string}],   // rubrikadagi HAR BIR id uchun
 "factErrors": string[],
 "legalErrors": string[],
 "strengths": string[] (1–3),
 "feedback": string (2–3 gap, "keyingi safar ..." uslubida, o'zbekcha)
}`;
}

export const DOCUMENT_CHECK_SCHEMA = {
  type: "OBJECT",
  properties: {
    score: { type: "INTEGER" },
    elements: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          present: { type: "BOOLEAN" },
          note: { type: "STRING" },
        },
        required: ["id", "present", "note"],
      },
    },
    factErrors: { type: "ARRAY", items: { type: "STRING" } },
    legalErrors: { type: "ARRAY", items: { type: "STRING" } },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
    feedback: { type: "STRING" },
  },
  required: ["score", "elements", "factErrors", "legalErrors", "strengths", "feedback"],
} as const;

export function documentCheckerUserTurn(s: DocumentScenario, text: string, locale: string): string {
  const lang = locale === "ru" ? "\n\nnote/feedback matnlarini RUS tilida yoz." : locale === "en" ? "\n\nWrite note/feedback in ENGLISH." : "";
  return `# HUJJAT TURI: ${s.documentKind}
# SSENARIY: ${s.code} — ${s.title.uz}

# BERILGAN FAKTLAR (faqat shular haqiqat)
${s.facts.map((f) => `- ${f.uz}`).join("\n")}

# TAQIQLANGAN (jiddiy xato)
${s.forbidden.map((f) => `- ${f}`).join("\n")}

# RUBRIKA
${s.rubric.map((r) => `- id=${r.id}: ${r.label.uz}${r.hint ? ` (${r.hint})` : ""}`).join("\n")}

Minimal so'z: ${s.minWords}. Hujjatdagi so'zlar: ${text.trim().split(/\s+/).filter(Boolean).length}.

# XODIM HUJJATI
${text.trim() || "(bo'sh)"}${lang}`;
}
