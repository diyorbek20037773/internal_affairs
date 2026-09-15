import type { Sop } from "./types";
import { LAWS } from "./laws";

// ------------------------------------------------------------------
// OILAVIY ZO'RAVONLIK — himoya orderi jarayoni (O'RQ-561 + VM №3/2020)
// ------------------------------------------------------------------
export const domesticViolenceSop: Sop = {
  type: "domestic_violence",
  version: "2.0",
  title: { uz: "Oilaviy zo'ravonlik", ru: "Семейное насилие", en: "Domestic violence" },
  steps: [
    {
      id: "dv.safety",
      order: 1,
      title: {
        uz: "Xavfsizlik va jabrlanuvchini himoya qilish",
        ru: "Безопасность и защита пострадавшей",
        en: "Safety and protect the victim",
      },
      instruction: {
        uz: "Tomonlarni ajrating, jabrlanuvchining xavfsizligini ta'minlang. Jarohat bo'lsa — tez tibbiy yordam (103), tahdid bo'lsa — 102.",
        ru: "Разъедините стороны, обеспечьте безопасность пострадавшей. При травме — 103, при угрозе — 102.",
        en: "Separate the parties, ensure the victim's safety. If injured — 103, if threatened — 102.",
      },
      checklist: [
        { id: "dv.safety.separate", label: { uz: "Tomonlarni ajratish", ru: "Разъединить стороны", en: "Separate the parties" }, required: true },
        { id: "dv.safety.medical", label: { uz: "Zarur bo'lsa tibbiy yordam", ru: "При необходимости медпомощь", en: "Medical help if needed" }, required: false },
      ],
      documents: [],
      laws: [LAWS.lawDv],
    },
    {
      id: "dv.register",
      order: 2,
      title: {
        uz: "Murojaatni ro'yxatga olish",
        ru: "Регистрация обращения",
        en: "Register the appeal",
      },
      instruction: {
        uz: "Har qanday murojaatni — og'zaki yoki yozma — ro'yxatga oling. Murojaat 24 soat ichida ko'rib chiqilishi shart.",
        ru: "Зарегистрируйте любое обращение — устное или письменное. Рассмотрение обязательно в течение 24 часов.",
        en: "Register any appeal — oral or written. It must be examined within 24 hours.",
      },
      checklist: [
        { id: "dv.register.log", label: { uz: "Murojaatni qayd etish", ru: "Зафиксировать обращение", en: "Log the appeal" }, required: true },
      ],
      documents: [
        { id: "dv.doc.appeal", name: { uz: "Ariza / murojaat", ru: "Заявление / обращение", en: "Appeal" }, kind: "ariza" },
      ],
      laws: [LAWS.lawDv],
    },
    {
      id: "dv.assess",
      order: 3,
      title: {
        uz: "Vaziyatni baholash",
        ru: "Оценка ситуации",
        en: "Assess the situation",
      },
      instruction: {
        uz: "Zo'ravonlik holati yoki uning xavfini aniqlang. Xavf mavjud bo'lsa — himoya orderi zudlik bilan rasmiylashtiriladi.",
        ru: "Установите факт насилия или его риск. При наличии риска — охранный ордер оформляется срочно.",
        en: "Establish violence or its risk. If risk exists — the protection order is issued urgently.",
      },
      checklist: [
        { id: "dv.assess.risk", label: { uz: "Zo'ravonlik xavfini baholash", ru: "Оценить риск насилия", en: "Assess violence risk" }, required: true },
      ],
      documents: [],
      laws: [LAWS.lawDv],
    },
    {
      id: "dv.order",
      order: 4,
      title: {
        uz: "Himoya orderini rasmiylashtirish",
        ru: "Оформление охранного ордера",
        en: "Issue the protection order",
      },
      instruction: {
        uz: "Profilaktika inspektori himoya orderini beradi — 30 kungacha muddatga, berilgan paytdan kuchga kiradi (O'RQ-561, 23-modda). Muddatni uzaytirish faqat sud tomonidan, jabrlanuvchining arizasiga ko'ra, bir yilgacha (23¹-modda).",
        ru: "Профилактический инспектор выдаёт охранный ордер — на срок до 30 дней, вступает в силу с момента выдачи (ЗРУ-561, ст. 23). Продление — только судом по заявлению пострадавшей, на срок до одного года (ст. 23¹).",
        en: "The prevention inspector issues the protection order — for up to 30 days, effective from issuance (Law 561, art. 23). Extension is by court only, on the victim's application, for up to one year (art. 23¹).",
      },
      checklist: [
        { id: "dv.order.issue", label: { uz: "Himoya orderini rasmiylashtirish", ru: "Оформить охранный ордер", en: "Issue the protection order" }, required: true },
        { id: "dv.order.system", label: { uz: "Yagona axborot tizimiga kiritish", ru: "Внести в единую информ. систему", en: "Enter into the unified system" }, required: true },
      ],
      documents: [
        { id: "dv.doc.order", name: { uz: "Himoya orderi", ru: "Охранный ордер", en: "Protection order" }, kind: "other" },
      ],
      laws: [LAWS.lawDv, LAWS.regProtectionOrder],
    },
    {
      id: "dv.enforce",
      order: 5,
      title: {
        uz: "Cheklovlar va nazorat",
        ru: "Ограничения и контроль",
        en: "Restrictions and monitoring",
      },
      instruction: {
        uz: "Order tazyiqchini jabrlanuvchiga yaqinlashish, aloqa qilish va kuzatishdan man etadi. Order talablarini buzish — ma'muriy javobgarlik.",
        ru: "Ордер запрещает приближаться, контактировать и преследовать. Нарушение требований — административная ответственность.",
        en: "The order bars approaching, contacting and surveilling the victim. Breach — administrative liability.",
      },
      checklist: [
        { id: "dv.enforce.brief", label: { uz: "Tomonlarga order talablarini tushuntirish", ru: "Разъяснить требования ордера", en: "Explain the order's terms" }, required: true },
      ],
      documents: [],
      laws: [LAWS.mjtkOrderBreach],
    },
    {
      id: "dv.prevention",
      order: 6,
      title: {
        uz: "Profilaktik hisob va yo'naltirish",
        ru: "Профилактический учёт и направление",
        en: "Preventive registration and referral",
      },
      instruction: {
        uz: "Tazyiqchini profilaktik hisobga oling va tuzatish dasturiga yo'naltiring. Mahalla va tegishli xizmatlar bilan hamkorlik qiling.",
        ru: "Поставьте на профилактический учёт и направьте на программу коррекции. Взаимодействуйте с махаллёй.",
        en: "Place the aggressor on preventive registration and refer to a correction program. Cooperate with the mahalla.",
      },
      checklist: [
        { id: "dv.prevention.register", label: { uz: "Profilaktik hisobga olish", ru: "Профилактический учёт", en: "Preventive registration" }, required: true },
      ],
      documents: [],
      laws: [LAWS.lawPrevention],
      notifyAgencies: ["Mahalla", "Xotin-qizlar masalalari bo'yicha inspektor"],
    },
  ],
};

// ------------------------------------------------------------------
// BEDARAK YO'QOLGAN — darhol qidiruv (kutish muddati yo'q)
// ------------------------------------------------------------------
export const missingPersonSop: Sop = {
  type: "missing_person",
  version: "2.0",
  title: { uz: "Yo'qolgan shaxs", ru: "Пропавший человек", en: "Missing person" },
  steps: [
    {
      id: "mp.register",
      order: 1,
      title: { uz: "Darhol qabul qilish va ro'yxatga olish", ru: "Немедленный приём и регистрация", en: "Immediate receipt and registration" },
      instruction: {
        uz: "Murojaatni DARHOL qabul qiling — kutish muddati YO'Q. Bola bo'lsa — shoshilinch holat sifatida qarang.",
        ru: "Примите обращение НЕМЕДЛЕННО — периода ожидания НЕТ. Если ребёнок — как экстренный случай.",
        en: "Accept the report IMMEDIATELY — there is NO waiting period. If a child — treat as urgent.",
      },
      checklist: [
        { id: "mp.register.accept", label: { uz: "Murojaatni darhol qabul qilish", ru: "Немедленно принять обращение", en: "Accept immediately" }, required: true },
        { id: "mp.register.duty", label: { uz: "Navbatchi qismga xabar", ru: "Доклад в дежурную часть", en: "Notify the duty unit" }, required: true },
      ],
      documents: [
        { id: "mp.doc.appeal", name: { uz: "Ariza", ru: "Заявление", en: "Statement" }, kind: "ariza" },
      ],
      laws: [LAWS.lawPolice],
    },
    {
      id: "mp.collect",
      order: 2,
      title: { uz: "Ma'lumot to'plash", ru: "Сбор сведений", en: "Collect information" },
      instruction: {
        uz: "Yo'qolgan shaxsning belgilari, so'nggi ko'rilgan joyi, kiyimi, fotosurati va aloqa ma'lumotlarini to'plang.",
        ru: "Соберите приметы, последнее местонахождение, одежду, фото и контакты.",
        en: "Collect description, last-seen location, clothing, photo and contacts.",
      },
      checklist: [
        { id: "mp.collect.desc", label: { uz: "Belgilari va fotosurati", ru: "Приметы и фото", en: "Description and photo" }, required: true },
        { id: "mp.collect.lastseen", label: { uz: "So'nggi ko'rilgan joy va vaqt", ru: "Последнее место и время", en: "Last seen place and time" }, required: true },
      ],
      documents: [
        { id: "mp.doc.photo", name: { uz: "Fotosurat", ru: "Фотография", en: "Photo" }, kind: "foto" },
      ],
      laws: [],
    },
    {
      id: "mp.search",
      order: 3,
      title: { uz: "Qidiruvni boshlash", ru: "Начало поиска", en: "Initiate the search" },
      instruction: {
        uz: "Qidiruvni zudlik bilan boshlang, kuchlarni jalb qiling, zarur bo'lsa OAV va videokuzatuvdan foydalaning.",
        ru: "Начните поиск незамедлительно, задействуйте силы, при необходимости — СМИ и видеонаблюдение.",
        en: "Begin the search immediately, deploy resources, use media and CCTV if needed.",
      },
      checklist: [
        { id: "mp.search.start", label: { uz: "Qidiruvni boshlash", ru: "Начать поиск", en: "Start the search" }, required: true },
      ],
      documents: [],
      laws: [LAWS.lawPolice],
    },
    {
      id: "mp.handoff",
      order: 4,
      title: { uz: "Organlar bilan hamkorlik va topshirish", ru: "Взаимодействие и передача", en: "Coordinate and hand off" },
      instruction: {
        uz: "Tegishli bo'linmalar bilan hamkorlik qiling. Bedarak yo'qolganlikni sud tartibida e'lon qilish — alohida fuqarolik jarayoni.",
        ru: "Взаимодействуйте с подразделениями. Признание безвестно отсутствующим — отдельный судебный процесс.",
        en: "Coordinate with units. Declaring a person legally missing is a separate court process.",
      },
      checklist: [
        { id: "mp.handoff.coord", label: { uz: "Bo'linmalar bilan hamkorlik", ru: "Взаимодействие с подразделениями", en: "Coordinate with units" }, required: true },
      ],
      documents: [],
      laws: [],
      notifyAgencies: ["Navbatchi qism", "Qidiruv bo'linmasi"],
    },
  ],
};

// ------------------------------------------------------------------
// TOPILGAN JASAD / O'Z JONIGA QASD — joyni saqlash, tergovchini kutish
// ------------------------------------------------------------------
export const foundBodySop: Sop = {
  type: "found_body",
  version: "2.0",
  title: { uz: "Topilgan jasad", ru: "Найденное тело", en: "Found body" },
  steps: [
    {
      id: "fb.secure",
      order: 1,
      title: { uz: "Joyni saqlash", ru: "Сохранение места", en: "Preserve the scene" },
      instruction: {
        uz: "Voqea joyini va jasadni O'Z HOLICHA saqlang — hech narsani siljitmang. Har bir holat jinoyat sifatida qaraladi (tergovchi aksini aniqlamaguncha).",
        ru: "Сохраните место и тело КАК ЕСТЬ — ничего не перемещайте. Каждый случай рассматривается как преступление, пока следователь не установит иное.",
        en: "Keep the scene and body AS IS — move nothing. Every case is treated as a crime until the investigator rules otherwise.",
      },
      checklist: [
        { id: "fb.secure.scene", label: { uz: "Joyni o'rab olish va saqlash", ru: "Оцепить и сохранить место", en: "Cordon and preserve the scene" }, required: true },
      ],
      documents: [],
      laws: [LAWS.lawPolice],
    },
    {
      id: "fb.notify",
      order: 2,
      title: { uz: "Darhol xabar berish", ru: "Немедленное уведомление", en: "Notify immediately" },
      instruction: {
        uz: "Navbatchi qism, tergovchi va prokuraturaga DARHOL xabar bering.",
        ru: "Немедленно сообщите в дежурную часть, следователю и прокуратуру.",
        en: "Immediately notify the duty unit, the investigator and the prosecutor's office.",
      },
      checklist: [
        { id: "fb.notify.investigator", label: { uz: "Tergovchi va prokuraturaga xabar", ru: "Уведомить следователя и прокуратуру", en: "Notify investigator and prosecutor" }, required: true },
      ],
      documents: [],
      laws: [],
      notifyAgencies: ["Navbatchi qism", "Tergov bo'limi", "Prokuratura"],
    },
    {
      id: "fb.wait",
      order: 3,
      title: { uz: "Ko'zdan kechirishni kutish", ru: "Ожидание осмотра", en: "Await the inspection" },
      instruction: {
        uz: "Jasadni suriljitmang. Voqea joyini ko'zdan kechirishni tergovchi sud-tibbiyot eksperti bilan o'tkazadi.",
        ru: "Не перемещайте тело. Осмотр проводит следователь с судмедэкспертом.",
        en: "Do not move the body. The investigator conducts the inspection with a forensic expert.",
      },
      checklist: [
        { id: "fb.wait.preserve", label: { uz: "Jasadni siljitmaslik", ru: "Не перемещать тело", en: "Do not move the body" }, required: true },
      ],
      documents: [
        { id: "fb.doc.inspection", name: { uz: "Ko'zdan kechirish bayonnomasi", ru: "Протокол осмотра", en: "Inspection protocol" }, kind: "bayonnoma" },
      ],
      laws: [LAWS.jpkInspection],
    },
    {
      id: "fb.witness",
      order: 4,
      title: { uz: "Guvohlarni aniqlash va materiallarni topshirish", ru: "Свидетели и передача материалов", en: "Witnesses and hand off" },
      instruction: {
        uz: "Guvohlarni aniqlang, dastlabki ma'lumotlarni to'plang va tergovchiga topshiring.",
        ru: "Установите свидетелей, соберите первичные данные и передайте следователю.",
        en: "Identify witnesses, collect initial data and hand off to the investigator.",
      },
      checklist: [
        { id: "fb.witness.identify", label: { uz: "Guvohlarni aniqlash", ru: "Установить свидетелей", en: "Identify witnesses" }, required: false },
      ],
      documents: [],
      laws: [],
    },
  ],
};

// ------------------------------------------------------------------
// MA'MURIY HUQUQBUZARLIK — MJTK bayonnoma jarayoni
// ------------------------------------------------------------------
export const adminOffenseSop: Sop = {
  type: "admin_offense",
  version: "2.0",
  title: { uz: "Ma'muriy huquqbuzarlik", ru: "Административное правонарушение", en: "Administrative offense" },
  steps: [
    {
      id: "ao.identify",
      order: 1,
      title: { uz: "Huquqbuzarlikni aniqlash", ru: "Выявление правонарушения", en: "Identify the offense" },
      instruction: {
        uz: "Huquqbuzarlik holatini aniqlang va hujjatlashtiring. Ko'pincha: mayda bezorilik (183), bola tarbiyasi majburiyati (47), jamoat joyida spirtli ichimlik (187), himoya orderi buzilishi (206¹).",
        ru: "Установите и задокументируйте правонарушение. Часто: мелкое хулиганство (183), обязанности по воспитанию (47), распитие в общественном месте (187), нарушение ордера (206¹).",
        en: "Identify and document the offense. Common: petty hooliganism (183), upbringing duties (47), public drinking (187), order breach (206¹).",
      },
      checklist: [
        { id: "ao.identify.fix", label: { uz: "Huquqbuzarlikni qayd etish", ru: "Зафиксировать правонарушение", en: "Record the offense" }, required: true },
      ],
      documents: [],
      laws: [LAWS.mjtkPettyHooliganism, LAWS.mjtkChildUpbringing, LAWS.mjtkPublicDrinking, LAWS.mjtkOrderBreach],
    },
    {
      id: "ao.protocol",
      order: 2,
      title: { uz: "Bayonnoma tuzish", ru: "Составление протокола", en: "Draw up the protocol" },
      instruction: {
        uz: "Ma'muriy huquqbuzarlik to'g'risidagi bayonnomani tuzing: sana/joy, buzuvchi, buzilgan norma, tushuntirish, guvohlar, imzolar.",
        ru: "Составьте протокол: дата/место, нарушитель, нарушенная норма, объяснение, свидетели, подписи.",
        en: "Draft the protocol: date/place, offender, violated norm, explanation, witnesses, signatures.",
      },
      checklist: [
        { id: "ao.protocol.draft", label: { uz: "Bayonnomani rasmiylashtirish", ru: "Оформить протокол", en: "Complete the protocol" }, required: true },
      ],
      documents: [
        { id: "ao.doc.protocol", name: { uz: "Ma'muriy bayonnoma", ru: "Административный протокол", en: "Administrative protocol" }, kind: "bayonnoma" },
      ],
      laws: [LAWS.mjtkProtocol],
    },
    {
      id: "ao.explain",
      order: 3,
      title: { uz: "Tushuntirish va guvohlar", ru: "Объяснения и свидетели", en: "Explanations and witnesses" },
      instruction: {
        uz: "Buzuvchidan tushuntirish oling, guvohlar ma'lumotini qayd eting.",
        ru: "Возьмите объяснение у нарушителя, зафиксируйте свидетелей.",
        en: "Take the offender's explanation, record witnesses.",
      },
      checklist: [
        { id: "ao.explain.take", label: { uz: "Tushuntirish olish", ru: "Получить объяснение", en: "Take the explanation" }, required: true },
      ],
      documents: [
        { id: "ao.doc.explanation", name: { uz: "Tushuntirish", ru: "Объяснение", en: "Explanation" }, kind: "bayonnoma" },
      ],
      laws: [],
    },
    {
      id: "ao.transmit",
      order: 4,
      title: { uz: "Ishni ko'rib chiqishga yuborish", ru: "Направление дела на рассмотрение", en: "Transmit the case" },
      instruction: {
        uz: "Bayonnoma va materiallarni vakolatli organ yoki sudga yuboring. Ish odatda 15 kun ichida ko'rib chiqiladi.",
        ru: "Направьте протокол и материалы уполномоченному органу или в суд. Дело рассматривается, как правило, в течение 15 дней.",
        en: "Send the protocol and materials to the competent body or court. Usually considered within 15 days.",
      },
      checklist: [
        { id: "ao.transmit.send", label: { uz: "Materiallarni yuborish", ru: "Направить материалы", en: "Send the materials" }, required: true },
      ],
      documents: [],
      laws: [LAWS.mjtkConsideration],
      notifyAgencies: ["Ma'muriy komissiya / Sud"],
    },
  ],
};
