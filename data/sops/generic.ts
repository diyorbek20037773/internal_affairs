import type { IncidentType } from "@/types/incident";
import type { LocalizedText, Sop } from "./types";

/**
 * Universal SOP skeleton used for incident types without a dedicated file.
 * The AI adapts the narrative; the engine keeps deterministic step order.
 */
export function buildGenericSop(
  type: IncidentType,
  title: LocalizedText
): Sop {
  return {
    type,
    version: "1.0",
    title,
    steps: [
      {
        id: `${type}.secure`,
        order: 1,
        title: {
          uz: "Xavfsizlikni ta'minlash",
          ru: "Обеспечить безопасность",
          en: "Ensure safety",
        },
        instruction: {
          uz: "Hodisa joyini xavfsiz holatga keltiring. Hayotga xavf bo'lsa 102 va tez tibbiy yordamni chaqiring.",
          ru: "Обеспечьте безопасность места. При угрозе жизни вызовите 102 и скорую.",
          en: "Secure the scene. If life is at risk, call 102 and emergency medical services.",
        },
        checklist: [
          {
            id: `${type}.secure.area`,
            label: {
              uz: "Hudud xavfsizligini ta'minlash",
              ru: "Обеспечить безопасность территории",
              en: "Secure the area",
            },
            required: true,
          },
        ],
        documents: [],
        laws: [],
      },
      {
        id: `${type}.identify`,
        order: 2,
        title: {
          uz: "Ishtirokchilarni aniqlash",
          ru: "Установить участников",
          en: "Identify participants",
        },
        instruction: {
          uz: "Jabrlanuvchi, guvohlar va tegishli shaxslarni aniqlang.",
          ru: "Установите потерпевшего, свидетелей и причастных лиц.",
          en: "Identify the victim, witnesses and involved persons.",
        },
        checklist: [
          {
            id: `${type}.identify.parties`,
            label: {
              uz: "Shaxslarni aniqlash",
              ru: "Установление личностей",
              en: "Identify persons",
            },
            required: true,
          },
        ],
        documents: [
          {
            id: `${type}.doc.statement`,
            name: { uz: "Ariza", ru: "Заявление", en: "Statement" },
            kind: "ariza",
          },
        ],
        laws: [],
      },
      {
        id: `${type}.evidence`,
        order: 3,
        title: {
          uz: "Dalillarni to'plash",
          ru: "Собрать доказательства",
          en: "Collect evidence",
        },
        instruction: {
          uz: "Foto, video, tushuntirish va boshqa dalillarni rasmiylashtiring.",
          ru: "Оформите фото, видео, объяснения и иные доказательства.",
          en: "Document photos, video, explanations and other evidence.",
        },
        checklist: [
          {
            id: `${type}.evidence.media`,
            label: {
              uz: "Foto / video dalillar",
              ru: "Фото / видео доказательства",
              en: "Photo / video evidence",
            },
            required: true,
          },
        ],
        documents: [
          {
            id: `${type}.doc.protocol`,
            name: {
              uz: "Bayonnoma",
              ru: "Протокол",
              en: "Protocol",
            },
            kind: "bayonnoma",
          },
        ],
        laws: [
          {
            code: "Jinoyat-protsessual kodeksi",
            note: "Protsessual tartib rasmiy manbadan tasdiqlansin (lex.uz)",
            verified: false,
          },
        ],
      },
      {
        id: `${type}.register`,
        order: 4,
        title: {
          uz: "Ro'yxatga olish",
          ru: "Регистрация",
          en: "Register",
        },
        instruction: {
          uz: "Murojaatni ro'yxatga oling va raqam bering.",
          ru: "Зарегистрируйте обращение и присвойте номер.",
          en: "Register the report and assign a number.",
        },
        checklist: [
          {
            id: `${type}.register.journal`,
            label: {
              uz: "Jurnalga qayd etish",
              ru: "Запись в журнале",
              en: "Journal entry",
            },
            required: true,
          },
        ],
        documents: [],
        laws: [],
      },
      {
        id: `${type}.report`,
        order: 5,
        title: {
          uz: "Xabar berish",
          ru: "Доложить",
          en: "Report",
        },
        instruction: {
          uz: "Navbatchi qism va tegishli bo'limga xabar bering.",
          ru: "Сообщите в дежурную часть и профильный отдел.",
          en: "Notify the duty unit and the relevant department.",
        },
        checklist: [
          {
            id: `${type}.report.duty`,
            label: {
              uz: "Navbatchi qismga xabar",
              ru: "Сообщение в дежурную часть",
              en: "Notify duty unit",
            },
            required: true,
          },
        ],
        documents: [],
        laws: [],
        notifyAgencies: ["Navbatchi qism"],
      },
    ],
  };
}
