import type { DialogScenario } from "../types";

export const yoshlarGuruhi: DialogScenario = {
  id: "dialog-yoshlar-guruhi",
  kind: "dialog",
  code: "Case 18",
  title: { uz: "Kechki guruh yetakchisi — bolalar maydonchasi", ru: "Лидер вечерней компании — детская площадка", en: "Evening group leader — playground" },
  brief: {
    uz: "Mahalla murojaati bo'yicha kechqurun maydonchaga keldingiz. 6 yigit, ichida yetakchi — norozi, 'biz hech kimga xalaqit bermayapmiz' deydi. Guruhni tarqatmasdan, yetakchi bilan kelishuvga keling.",
    ru: "По обращению махалли вы пришли вечером на площадку. 6 парней, лидер недоволен. Не разгоняя силой, договоритесь с лидером.",
    en: "On a mahalla complaint you arrive at the playground in the evening. 6 young men; the leader is dismissive. Reach an agreement with the leader without force.",
  },
  difficulty: 2,
  tags: ["muloqot", "deeskalatsiya", "vaziyat_tahlili", "natijadorlik"],
  estimatedMinutes: 9,
  laws: ["mjtkPublicDrinking", "lawPrevention", "regInspector"],
  version: "1.0",
  setting: {
    uz: "Bolalar maydonchasi, 21:30, yoritish sust. Skameykada 5 yigit, biri turibdi (yetakchi). Ikkita bo'sh shisha. Sherik mashinada.",
    ru: "Детская площадка, 21:30, слабое освещение. 5 парней на скамейке, один стоит (лидер). Две пустые бутылки. Напарник в машине.",
    en: "Playground, 21:30, poor lighting. 5 on a bench, one standing (leader). Two empty bottles. Partner in the car.",
  },
  persona: {
    type: "norozi",
    name: "Jasur",
    age: 20,
    gender: "erkak",
    background:
      "Mahallada o'sgan, kollejni tugatgan, ishsiz. Guruh uchun maydoncha — yagona yig'iladigan joy. 'Biz bolaligimizdan shu yerda' deb hisoblaydi. Ichishga qarshi emas, lekin o'zi kam ichadi. Do'stlari oldida obro' muhim — sharmanda bo'lsa qattiq qarshilik qiladi. Alohida gaplashilsa mantiqli.",
    grievance: "Hurmat, sharmanda qilmaslik, joyni butunlay yo'qotmaslik. Ish/sport uchun imkoniyat bo'lsa qiziqadi.",
    triggers: [
      "Do'stlari oldida buyruq, sensirash",
      "'Hammangizni punktga' deb qo'rqitish",
      "Ota-onasi bilan qo'rqitish",
      "'Bezorilar' deb yorliq",
    ],
    soothers: [
      "Yetakchini alohida, tenglik ohangida chaqirish",
      "Mahalla shikoyatini u ham tushunadigan qilib aytish (bolalar, kechqurun)",
      "Kompromis taklifi: 21:00 gacha, shisha yo'q, shovqin yo'q",
      "Sport/ish uchun aniq imkoniyat (mahalla sport zali, yoshlar yetakchisi)",
      "Ismini so'rash, hurmat",
    ],
    secretFacts: [
      "Guruhdagi eng kichigi 16 yosh — Jasur unga ichirmaslikka harakat qiladi.",
      "Mahalla sport zali kaliti mahalla raisida, ular so'rab ko'rishgan — rad etilgan.",
    ],
  },
  initialState: { tension: 50, trust: 25, cooperation: 35, phase: "tinglash", revealed: [] },
  opening: "(do'stlariga qarab kuladi) Yana nima bo'ldi, komandir? Biz hech kimga xalaqit bermayapmiz, o'tiribmiz xolos. Yoki o'tirish ham taqiqlanganmi endi?",
  maxTurns: 12,
  revealTrust: 50,
  successCondition: { minTrust: 60, maxTension: 30 },
  failCondition: { tension: 90 },
  rubricHints: {
    muloqot: "Yetakchi bilan alohida, hurmat bilan gaplashildimi? Do'stlari oldida sharmanda qilinmadimi?",
    deeskalatsiya: "Guruh dinamikasi hisobga olindimi, ultimatum o'rniga kompromis taklif qilindimi?",
    vaziyat_tahlili: "Voyaga yetmagan, shisha, yoritish — xavf omillari payqaldimi?",
    natijadorlik: "Aniq kelishuv (vaqt, shart) va keyingi qadam (yoshlar yetakchisi, sport zali) bo'ldimi?",
  },
};
