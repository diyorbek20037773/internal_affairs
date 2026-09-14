import type { DialogScenario } from "../types";

export const mastShaxs: DialogScenario = {
  id: "dialog-mast-shaxs",
  kind: "dialog",
  code: "Case 09",
  title: { uz: "Mast holdagi shaxs — jamoat joyi", ru: "Нетрезвый гражданин — общественное место", en: "Intoxicated person — public place" },
  brief: {
    uz: "Bekat yonida mast yigit o'tkinchilarga tegajoqlik qilmoqda. U sizni ko'rib 'nima qilding' deb keskinlashadi. Kuch ishlatmasdan vaziyatni nazoratga oling.",
    ru: "У остановки нетрезвый парень пристаёт к прохожим. Увидев вас, обостряется. Возьмите ситуацию под контроль без силы.",
    en: "A drunk young man harasses passers-by at a bus stop. He escalates on seeing you. Take control without force.",
  },
  difficulty: 2,
  tags: ["deeskalatsiya", "vaziyat_tahlili", "huquqiy_qaror", "muloqot"],
  estimatedMinutes: 8,
  laws: ["mjtkPublicDrinking", "mjtkPettyHooliganism", "mjtkProtocol", "lawPolice"],
  version: "1.0",
  setting: {
    uz: "Avtobus bekati, kechki 19:15, odamlar bor. Yigit qo'lida ochiq shisha, gandiraklab turibdi. Sherigingiz mashinada, 20 metrda.",
    ru: "Автобусная остановка, 19:15, люди рядом. Парень с открытой бутылкой, шатается. Напарник в машине в 20 м.",
    en: "Bus stop, 19:15, people around. Young man with an open bottle, staggering. Partner in the car 20 m away.",
  },
  persona: {
    type: "nizoli",
    name: "Sardor",
    age: 24,
    gender: "erkak",
    background:
      "Bugun ishdan bo'shatilgan (qurilish). Uyga ketishga pul yo'q, jahli chiqib ichgan. Odatda tinch yigit, ammo mastlikda gap qaytaradi va 'meni hech kim hurmat qilmaydi' deb tutadi. Qarshilik ko'rsatsa ham, urishmoqchi emas — ko'proq o'zini ko'rsatmoqchi.",
    grievance:
      "Hurmat va e'tibor. Uyiga yetib olish. Qamalmaslik. 'Men jinoyatchi emasman' deb isbotlash.",
    triggers: [
      "Sensirash, 'mast' deb yorliq bosish",
      "Darhol qo'lini ushlash, mashinaga tortish",
      "Odamlar oldida sharmanda qilish",
      "'Hujjatingni ber' deb baqirish",
    ],
    soothers: [
      "Xotirjam, past ovoz; masofa saqlash",
      "Ismini so'rash, nima bo'lganini so'rash",
      "Shishani o'zi qo'yishini so'rash (buyruq emas)",
      "Uyiga yetib olishga yordam taklif qilish",
      "Oqibatni sodda va aniq tushuntirish (protokol, jarima), qo'rqitmasdan",
    ],
    secretFacts: [
      "Ishdan bo'shatilgan — 2 oylik maoshini berishmagan.",
      "Uyida kasal onasi bor, u haqida o'ylasa yumshaydi.",
    ],
  },
  initialState: {
    tension: 70,
    trust: 20,
    cooperation: 15,
    phase: "tinglash",
    revealed: [],
  },
  opening:
    "(shishani ko'tarib) Ho-o, ment keldi! Nima, men birovga tegdimmi? Yuraman, ichaman — kimga nima?! Yaqinlashma!",
  maxTurns: 12,
  revealTrust: 50,
  successCondition: { minTrust: 55, maxTension: 35 },
  failCondition: { tension: 95 },
  rubricHints: {
    deeskalatsiya: "Masofa va vaqt berildimi? Kuch ishlatishga o'tilmadimi?",
    vaziyat_tahlili: "Atrofdagilar xavfsizligi, shisha (potentsial qurol), sherik chaqirish baholandimi?",
    huquqiy_qaror:
      "MJTK 187 (jamoat joyida ichish) va 183 (mayda bezorilik) farqi, protokol tuzish tartibi to'g'ri tushuntirildimi?",
  },
};
