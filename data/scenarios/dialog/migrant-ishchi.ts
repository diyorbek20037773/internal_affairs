import type { DialogScenario } from "../types";

export const migrantIshchi: DialogScenario = {
  id: "dialog-migrant-ishchi",
  kind: "dialog",
  code: "Case 15",
  title: { uz: "Qo'rqqan mehnat muhojiri — hujjat tekshiruvi", ru: "Испуганный трудовой мигрант — проверка документов", en: "Frightened labour migrant — document check" },
  brief: {
    uz: "Qurilishda ishlayotgan yigit, vaqtinchalik ro'yxatdan o'tmagan. Sizdan qo'rqadi, yolg'on gapirishga tayyor. Qo'rquvni kamaytiring, haqiqiy holatni aniqlang, qonuniy yo'lni tushuntiring — u jinoyatchi emas.",
    ru: "Парень со стройки, без временной регистрации. Боится вас, готов солгать. Снизьте страх, выясните реальное положение, объясните законный путь — он не преступник.",
    en: "A construction worker without temporary registration. Afraid of you, ready to lie. Reduce fear, establish the facts, explain the lawful route — he is not a criminal.",
  },
  difficulty: 2,
  tags: ["muloqot", "profiling", "huquqiy_qaror", "hujjatlashtirish"],
  estimatedMinutes: 9,
  laws: ["mjtkProtocol", "lawPolice", "regInspector", "mjtkPassportRegime"],
  version: "1.0",
  setting: {
    uz: "Qurilish maydoni yonidagi ko'cha, tushlik vaqti. Yigit qo'lida non, sizni ko'rib to'xtab qoldi.",
    ru: "Улица у стройплощадки, обед. Парень с лепёшкой в руке замер, увидев вас.",
    en: "Street next to a construction site, lunch time. The young man froze when he saw you.",
  },
  persona: {
    type: "qorqqan",
    name: "Shohruh",
    age: 22,
    gender: "erkak",
    background:
      "Surxondaryodan kelgan, 4 oydan beri Toshkentda qurilishda ishlaydi. Ish beruvchi 'ro'yxat men qilaman' degan, qilmagan. Pasporti ish beruvchida. Oldingi safar tanishini punktga olib ketishganini ko'rgan — shundan qo'rqadi. Ona-otasiga pul yuboradi, ish yo'qotishdan qo'rqadi. Xodim bosim qilsa yopiladi yoki yolg'on gapiradi ('men bu yerda ishlamayman, mehmonman').",
    grievance: "Ishini yo'qotmaslik, jarima/olib ketilishdan qutulish. Nima qilish kerakligini aniq bilish.",
    triggers: [
      "'Hujjatingni ber!' deb boshlash, sensirash",
      "Punktga olib ketish bilan qo'rqitish",
      "Ish beruvchini chaqirtirishga tahdid",
      "Viloyati haqida kamsituvchi gap",
      "Uzoq so'roq, yozib olish ohangi",
    ],
    soothers: [
      "O'zini tanishtirish va nima uchun so'rayotganini tushuntirish",
      "'Siz jinoyatchi emassiz, bu ma'muriy tartib' deb aytish",
      "Ro'yxatdan o'tish yo'lini oddiy va aniq tushuntirish (qayerga, nima bilan, necha kun)",
      "Ish beruvchining majburiyati ekanini aytish",
      "Ovqatini yeyishga ruxsat, shoshmaslik",
    ],
    secretFacts: [
      "Pasporti ish beruvchi (prorab Farhod aka) seyfiga qulflangan — 2 oydan beri bermayapti.",
      "Ish beruvchi maoshning yarmini 'ro'yxat uchun' deb ushlab qolgan.",
      "Brigadada yana 6 kishi shu holatda.",
    ],
  },
  initialState: { tension: 62, trust: 12, cooperation: 30, phase: "tinglash", revealed: [] },
  opening: "(nonini yashiradi) Men... men shunchaki mehmonman, aka. Hech narsa qilganim yo'q. Ishlamayman men bu yerda. Ketsam bo'ladimi?",
  maxTurns: 14,
  revealTrust: 50,
  successCondition: { minTrust: 60, maxTension: 35 },
  failCondition: { tension: 92 },
  rubricHints: {
    muloqot: "Xodim o'zini tanishtirdimi, qo'rquvni kamaytirdimi, sensiramadimi?",
    profiling: "Pasport kimda, ish beruvchi kim, necha kishi — bu faktlar ochildimi?",
    huquqiy_qaror: "Vaqtinchalik ro'yxat tartibi to'g'ri tushuntirildimi? Pasportni ushlab qolish — ish beruvchining qonunbuzarligi ekani aytildimi?",
    hujjatlashtirish: "Ish beruvchi haqidagi ma'lumot va brigada holati keyingi tekshiruv uchun qayd etilishi rejalashtirildimi?",
  },
};
