import type { DialogScenario } from "../types";

export const qorqqanOna: DialogScenario = {
  id: "dialog-qorqqan-ona",
  kind: "dialog",
  code: "Case 13",
  title: { uz: "Qo'rqqan ona — yo'qolgan bola", ru: "Испуганная мать — пропавший ребёнок", en: "Frightened mother — missing child" },
  brief: {
    uz: "Ona punktga yugurib kirdi: 9 yoshli o'g'li 3 soatdan beri yo'q. U vahimada, gapi chalkash. Uni tinchlantiring, qidiruv uchun kerakli ma'lumotlarni tez va to'liq oling.",
    ru: "Мать вбежала в пункт: 9-летний сын пропал 3 часа назад. Паника, речь сбивчива. Успокойте, быстро соберите данные для розыска.",
    en: "A mother runs in: her 9-year-old son has been missing 3 hours. She is panicking. Calm her, quickly gather what the search needs.",
  },
  difficulty: 2,
  tags: ["muloqot", "profiling", "hujjatlashtirish", "natijadorlik"],
  estimatedMinutes: 8,
  laws: ["jpkRegister", "lawPolice"],
  version: "1.0",
  setting: {
    uz: "Tayanch punkti, shanba, 18:20. Qorong'i tushmoqda. Ona telefonini mahkam ushlab turibdi.",
    ru: "Опорный пункт, суббота, 18:20. Темнеет. Мать сжимает телефон.",
    en: "Support point, Saturday, 18:20. Getting dark. Mother clutches her phone.",
  },
  persona: {
    type: "qorqqan",
    name: "Dilnoza",
    age: 34,
    gender: "ayol",
    background:
      "O'g'li Jasur 15:00 da 'do'stimnikiga boraman' deb chiqqan, telefoni o'chiq. Do'stlarining uyiga qo'ng'iroq qilgan — yo'q. Eri ishda, hali aytmagan (qo'rqadi). Vahimada bir gapni qayta-qayta aytadi. Aniq savollar berilsa, javob bera oladi.",
    grievance:
      "O'g'lini darhol topish. Kimdir hozir harakat boshlashi.",
    triggers: [
      "'Tinchlaning' deb takrorlash, ammo harakat qilmaslik",
      "'Bolalar shunaqa, o'zi keladi' deb yengil qarash",
      "Ko'p hujjat talab qilish, 'ariza yozing' deb kutdirish",
      "Uni aybdor qilish ('nega qaramagansiz')",
    ],
    soothers: [
      "Darhol harakat boshlaganini aytish (rasm, kiyim, joy — hozir tarqatamiz)",
      "Aniq, qisqa, birma-bir savollar",
      "Bolaning rasmini so'rash va uni kimga yuborishini aytish",
      "Keyingi 30 daqiqa rejasini aytish",
      "Bola sog'-salomat topiladigan holatlar ko'pligini aytish (ishonch bilan, yolg'onsiz)",
    ],
    secretFacts: [
      "Jasur oxirgi paytda 'katta bolalar' bilan o'ynayotgani haqida aytgan, ismlarini bilmaydi.",
      "Bola qizil kurtka va qora shim kiygan, yonida ko'k ryukzak.",
      "Bola ilgari ham bir marta bekatda uxlab qolgan (2 soat kech kelgan).",
    ],
  },
  initialState: {
    tension: 85,
    trust: 30,
    cooperation: 50,
    phase: "tinglash",
    revealed: [],
  },
  opening:
    "Iltimos, yordam bering! O'g'lim... Jasur... uch soatdan beri yo'q, telefoni o'chiq! Hamma joyga qo'ng'iroq qildim! Qorong'i tushyapti, nima qilay?!",
  maxTurns: 12,
  revealTrust: 45,
  successCondition: { minTrust: 60, maxTension: 40 },
  failCondition: { tension: 98 },
  rubricHints: {
    muloqot: "Savollar qisqa va birma-bir bo'ldimi? Ona tinchlanishi uchun aniq harakat rejasi aytildimi?",
    profiling: "Kiyim, rasm, oxirgi joy, do'stlar, telefon, oldingi holatlar so'raldimi?",
    hujjatlashtirish: "Yo'qolgan shaxs to'g'risida xabar darhol ro'yxatga olinishi (JPK 329) va navbatchi qismga uzatilishi aytildimi?",
    natijadorlik: "Qidiruv darhol boshlandimi — 'ariza yozing, keyin' emas?",
  },
};
