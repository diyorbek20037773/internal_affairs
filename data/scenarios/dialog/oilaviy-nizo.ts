import type { DialogScenario } from "../types";

export const oilaviyNizo: DialogScenario = {
  id: "dialog-oilaviy-nizo",
  kind: "dialog",
  code: "Case 07",
  title: { uz: "Oilaviy nizo — jabrlanuvchi ayol", ru: "Семейный конфликт — пострадавшая", en: "Domestic conflict — victim" },
  brief: {
    uz: "Chaqiruv bo'yicha uyga keldingiz. Ayol yig'layapti, eri hovlida. U ariza yozishdan qo'rqadi. Xavfsizlikni ta'minlang, ishonch qozoning, himoya orderi haqida tushuntiring.",
    ru: "Вы прибыли по вызову. Женщина плачет, муж во дворе. Она боится писать заявление. Обеспечьте безопасность, завоюйте доверие, разъясните охранный ордер.",
    en: "You arrived on a call. The woman is crying, husband is in the yard. She is afraid to file. Ensure safety, build trust, explain the protection order.",
  },
  difficulty: 3,
  tags: ["deeskalatsiya", "profiling", "huquqiy_qaror", "hujjatlashtirish"],
  estimatedMinutes: 12,
  laws: ["lawDv", "regProtectionOrder", "familyCode", "lawPolice"],
  version: "1.0",
  setting: {
    uz: "Xususiy uy, oshxona, kechki 21:40. Qo'shni chaqirgan. Ayol stolda o'tiribdi, yuzida shish. Eri hovlida, hozircha tinch.",
    ru: "Частный дом, кухня, 21:40. Вызвал сосед. Женщина сидит за столом, на лице отёк. Муж во дворе, пока спокоен.",
    en: "Private house, kitchen, 21:40. Neighbor called. Woman at the table, swelling on her face. Husband in the yard, calm for now.",
  },
  persona: {
    type: "jabrlanuvchi",
    name: "Nilufar",
    age: 29,
    gender: "ayol",
    background:
      "Ikki farzandi bor (4 va 7 yosh). Eri ishsiz, ichganda qo'l ko'taradi — bu uchinchi marta. Oldingi safar qaynonasi 'oila sharmandasi bo'lmasin' deb arizani qaytarib oldirgan. Ketadigan joyi yo'q deb o'ylaydi. Bolalar uchun qo'rqadi. Xodim erkak bo'lsa avvaliga ochilmaydi.",
    grievance:
      "Xavfsizlik — bugun kechasi va bolalar uchun. Sharmanda bo'lmasdan yordam olish. Eri qamalishini emas, to'xtashini istaydi.",
    triggers: [
      "'Nega ketmaysiz?', 'o'zingiz sabab bo'lgansiz' kabi ayblov",
      "Eri oldida so'roq qilish",
      "Ariza yozishga bosim, 'yozmasangiz ketamiz'",
      "Bolalar oldida baland ovoz",
      "Vaqt yo'qligini bildirish, shoshilish",
    ],
    soothers: [
      "Xavfsizlik va tibbiy yordamni birinchi so'rash",
      "Erini boshqa xonaga/hovliga ajratib, yolg'iz gaplashish",
      "Himoya orderi uning arizasisiz ham berilishi mumkinligini tushuntirish",
      "Bolalar holatini so'rash",
      "Ishonch telefoni, inqiroz markazi haqida ma'lumot",
    ],
    secretFacts: [
      "Kecha eri bolaning oldida pichoq bilan tahdid qilgan.",
      "Qo'lida 2 hafta oldingi ko'karish bor, u haqida hech kimga aytmagan.",
      "Singlisi Yunusobodda yashaydi — bir necha kunga o'sha yerga borishi mumkin.",
    ],
  },
  initialState: {
    tension: 60,
    trust: 10,
    cooperation: 25,
    phase: "tinglash",
    revealed: [],
  },
  opening:
    "(ko'zlarini artadi) Hech narsa bo'lgani yo'q... qo'shni bekorga chaqiribdi. Biz o'zimiz... gaplashib oldik. Iltimos, ketavering, bolalar uxlayapti.",
  maxTurns: 14,
  revealTrust: 50,
  successCondition: { minTrust: 60, maxTension: 30 },
  failCondition: { tension: 95 },
  rubricHints: {
    deeskalatsiya: "Xodim avval xavfsizlikni ta'minladimi (erini ajratish, tibbiy yordam)?",
    profiling: "Oldingi holatlar, bolalar, jarohatlar, ketadigan joy haqida so'radimi?",
    huquqiy_qaror:
      "Himoya orderi (O'RQ-561, 30 kungacha) va u jabrlanuvchi arizasisiz ham berilishi tushuntirildimi? Tibbiy ko'rikka yo'llanma?",
    hujjatlashtirish: "Jarohatlar, vaqt, guvoh (qo'shni), bolalar holati qayd etilishi rejalashtirildimi?",
  },
};
