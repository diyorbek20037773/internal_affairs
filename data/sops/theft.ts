import type { Sop } from "./types";

export const theftSop: Sop = {
  type: "theft",
  version: "1.0",
  title: { uz: "O'g'irlik", ru: "Кража", en: "Theft" },
  steps: [
    {
      id: "theft.secure_scene",
      order: 1,
      title: {
        uz: "Hodisa joyini xavfsiz holatga keltirish",
        ru: "Обеспечить безопасность места происшествия",
        en: "Secure the scene",
      },
      instruction: {
        uz: "Voqea joyini o'rab oling, izlarni saqlang, guvohlarni ushlab turing.",
        ru: "Оцепите место, сохраните следы, задержите свидетелей.",
        en: "Cordon the area, preserve traces, keep witnesses present.",
      },
      checklist: [
        {
          id: "theft.secure_scene.cordon",
          label: {
            uz: "Hodisa joyini o'rab olish",
            ru: "Оцепить место",
            en: "Cordon the scene",
          },
          required: true,
        },
        {
          id: "theft.secure_scene.traces",
          label: {
            uz: "Izlarni saqlash (barmoq izi, oyoq izi)",
            ru: "Сохранить следы",
            en: "Preserve traces",
          },
          required: true,
        },
      ],
      documents: [],
      laws: [
        {
          code: "Jinoyat kodeksi",
          note: "O'g'irlik moddasi rasmiy manbadan tasdiqlansin (lex.uz)",
          verified: false,
        },
      ],
    },
    {
      id: "theft.identify_victim",
      order: 2,
      title: {
        uz: "Jabrlanuvchini aniqlash",
        ru: "Установить потерпевшего",
        en: "Identify the victim",
      },
      instruction: {
        uz: "Jabrlanuvchining shaxsini, aloqa ma'lumotlarini aniqlang.",
        ru: "Установите личность и контакты потерпевшего.",
        en: "Establish the victim's identity and contacts.",
      },
      checklist: [
        {
          id: "theft.identify_victim.id",
          label: {
            uz: "Shaxsni tasdiqlovchi hujjat",
            ru: "Документ, удостоверяющий личность",
            en: "Identity document",
          },
          required: true,
        },
      ],
      documents: [
        {
          id: "theft.doc.statement",
          name: { uz: "Ariza", ru: "Заявление", en: "Statement" },
          kind: "ariza",
        },
      ],
      laws: [],
    },
    {
      id: "theft.collect_statement",
      order: 3,
      title: {
        uz: "Tushuntirish xati / ariza olish",
        ru: "Получить объяснение / заявление",
        en: "Collect statement",
      },
      instruction: {
        uz: "Jabrlanuvchidan va guvohlardan yozma tushuntirish oling.",
        ru: "Возьмите письменные объяснения у потерпевшего и свидетелей.",
        en: "Take written explanations from victim and witnesses.",
      },
      checklist: [
        {
          id: "theft.collect_statement.victim",
          label: {
            uz: "Jabrlanuvchi tushuntirishi",
            ru: "Объяснение потерпевшего",
            en: "Victim explanation",
          },
          required: true,
        },
        {
          id: "theft.collect_statement.witness",
          label: {
            uz: "Guvohlar tushuntirishi",
            ru: "Объяснения свидетелей",
            en: "Witness explanations",
          },
          required: false,
        },
      ],
      documents: [
        {
          id: "theft.doc.explanation",
          name: {
            uz: "Tushuntirish xati",
            ru: "Объяснение",
            en: "Explanation note",
          },
          kind: "bayonnoma",
        },
      ],
      laws: [],
    },
    {
      id: "theft.inspect_scene",
      order: 4,
      title: {
        uz: "Hodisa joyini ko'zdan kechirish bayonnomasi",
        ru: "Протокол осмотра места происшествия",
        en: "Scene inspection protocol",
      },
      instruction: {
        uz: "Ko'zdan kechirish bayonnomasini tuzing, foto va videoga oling.",
        ru: "Составьте протокол осмотра, сделайте фото и видео.",
        en: "Draft the inspection protocol; take photos and video.",
      },
      checklist: [
        {
          id: "theft.inspect_scene.photo",
          label: { uz: "Fotosurat", ru: "Фотосъёмка", en: "Photos" },
          required: true,
        },
        {
          id: "theft.inspect_scene.video",
          label: { uz: "Videoyozuv", ru: "Видеозапись", en: "Video" },
          required: false,
        },
      ],
      documents: [
        {
          id: "theft.doc.inspection",
          name: {
            uz: "Ko'zdan kechirish bayonnomasi",
            ru: "Протокол осмотра",
            en: "Inspection protocol",
          },
          kind: "bayonnoma",
        },
      ],
      laws: [
        {
          code: "Jinoyat-protsessual kodeksi",
          note: "Ko'zdan kechirish tartibi rasmiy manbadan tasdiqlansin",
          verified: false,
        },
      ],
    },
    {
      id: "theft.register",
      order: 5,
      title: {
        uz: "Murojaatni ro'yxatga olish",
        ru: "Зарегистрировать обращение",
        en: "Register the report",
      },
      instruction: {
        uz: "Murojaatni tegishli jurnalda ro'yxatga oling va raqam bering.",
        ru: "Зарегистрируйте обращение в журнале.",
        en: "Register the report and assign a number.",
      },
      checklist: [
        {
          id: "theft.register.journal",
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
      id: "theft.report_chain",
      order: 6,
      title: {
        uz: "Rahbariyatga va tergovga xabar berish",
        ru: "Доложить руководству и следствию",
        en: "Notify command and investigation",
      },
      instruction: {
        uz: "Navbatchi qismga va tergov bo'limiga xabar bering.",
        ru: "Сообщите в дежурную часть и следственный отдел.",
        en: "Report to duty unit and investigation department.",
      },
      checklist: [
        {
          id: "theft.report_chain.duty",
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
      notifyAgencies: ["Navbatchi qism", "Tergov bo'limi"],
    },
  ],
};
