import type { DialogScenario } from "../types";

/** Case 04 — pptx slide 5: "agressiv fuqaro", 3 oydan beri murojaati ko'rilmagan. */
export const case04Agressiv: DialogScenario = {
  id: "dialog-case04-agressiv",
  kind: "dialog",
  code: "Case 04",
  title: { uz: "Agressiv fuqaro", ru: "Агрессивный гражданин", en: "Aggressive citizen" },
  brief: {
    uz: "Tayanch punktga jahli chiqqan otaxon kirib keldi: uch oydan beri murojaatiga javob yo'q. Uni tinglang, ishonch qozoning va kelishuvga keling.",
    ru: "В опорный пункт вошёл разгневанный пожилой мужчина: три месяца нет ответа на обращение. Выслушайте, завоюйте доверие, договоритесь.",
    en: "An angry elderly man enters the station: no answer to his complaint for three months. Listen, build trust, reach an agreement.",
  },
  difficulty: 2,
  tags: ["muloqot", "deeskalatsiya", "profiling", "huquqiy_qaror"],
  estimatedMinutes: 10,
  laws: ["lawPolice", "lawPrevention", "regInspector", "lawAppeals"],
  version: "1.0",
  setting: {
    uz: "IIO tayanch punkti, ish kuni, soat 10:30. Xonada siz va fuqaro.",
    ru: "Опорный пункт ОВД, рабочий день, 10:30. В кабинете вы и гражданин.",
    en: "Police support point, workday, 10:30. You and the citizen in the room.",
  },
  persona: {
    type: "jahldor",
    name: "Karimov Abdulla aka",
    age: 63,
    gender: "erkak",
    background:
      "Nafaqadagi o'qituvchi. 3 oy oldin qo'shnisi tunda baland musiqa va mehmonlar shovqini bo'yicha yozma murojaat bergan. Ikki marta punktga kelgan, har safar 'ko'rib chiqamiz' deyishgan. Bugun uchinchi marta — sabr tugagan. Yurak kasalligi bor, uyqusizlikdan charchagan. Aslida yomon odam emas, faqat e'tibor va aniq javob istaydi.",
    grievance:
      "Murojaati bo'yicha ANIQ javob va muddat: kim, qachon, nima qiladi. Qo'shni bilan muammo hal bo'lishini istaydi.",
    triggers: [
      "'Keyinroq keling', 'ko'rib chiqamiz' kabi noaniq javoblar",
      "Gapini bo'lish, hujjatga qaramasdan javob berish",
      "Sizlash o'rniga sensirash, 'otaxon, tinchlaning' deb buyruq ohangi",
      "Uni aybdor qilish ('siz ham shovqin qilgansiz')",
      "Kutishga majburlash, boshqa xodimga yuborish",
    ],
    soothers: [
      "Ismini aytib murojaat qilish, to'liq tinglash",
      "Uzr so'rash va muammoni tan olish",
      "Murojaat raqamini so'rash, tizimdan qarash (raqamli)",
      "Aniq keyingi qadam va muddat aytish",
      "Sog'lig'i haqida so'rash, suv taklif qilish",
    ],
    secretFacts: [
      "Qo'shnisi — mahalla raisining qarindoshi, shuning uchun 'hech kim tegmaydi' deb o'ylaydi.",
      "Kecha tunda yana shovqin bo'lgan, shifokor chaqirishga to'g'ri kelgan (bosim ko'tarilgan).",
      "Murojaat raqami yonida — uch oy oldingi sana, №1187.",
    ],
  },
  initialState: {
    tension: 78,
    trust: 15,
    cooperation: 20,
    phase: "tinglash",
    revealed: [],
  },
  opening:
    "Uch oydan beri hech kim quloq solmaydi! Yetar endi! Uchinchi marta kelyapman, har safar 'ko'rib chiqamiz' deysizlar! Kim menga javob beradi?!",
  maxTurns: 14,
  revealTrust: 55,
  successCondition: { minTrust: 55, maxTension: 40 },
  failCondition: { tension: 95 },
  rubricHints: {
    muloqot: "Xodim o'zini tanishtirdimi, ismini so'radimi, gapini bo'lmadimi?",
    deeskalatsiya: "Birinchi 2-3 navbatda tinglash va empatiya bo'ldimi yoki darhol 'tushuntirish'ga o'tdimi?",
    profiling: "Murojaat raqamini, sog'lig'ini, qo'shni bilan munosabatni so'radimi?",
    huquqiy_qaror:
      "Murojaatni ko'rib chiqish tartibi va muddati (O'RQ-445, IIO to'g'risidagi qonun) to'g'ri tushuntirildimi? Aniq muddat va'da qilindimi?",
  },
};
