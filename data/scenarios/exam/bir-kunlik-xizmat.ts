import type { ExamScenario } from "../types";

/** pptx slide 9 — yakuniy imtihon: bitta ssenariyda to'liq ish kuni. */
export const birKunlikXizmat: ExamScenario = {
  id: "exam-bir-kunlik-xizmat",
  kind: "exam",
  code: "IMTIHON",
  title: { uz: "Bir kunlik xizmat", ru: "Один день службы", en: "One day of service" },
  brief: {
    uz: "Test emas — to'liq ish kunini mustaqil boshqarasiz. Barcha trenajyorlar bitta ssenariyga ulanadi: hudud → nizoli fuqaro → xavfli vaziyat → debrifing.",
    ru: "Не тест — вы самостоятельно управляете полным рабочим днём. Все тренажёры связаны в один сценарий.",
    en: "Not a test — you run a full working day on your own. All trainers chained into one scenario.",
  },
  difficulty: 3,
  tags: ["vaziyat_tahlili", "muloqot", "deeskalatsiya", "huquqiy_qaror", "hujjatlashtirish", "natijadorlik"],
  estimatedMinutes: 40,
  laws: [],
  version: "1.0",
  stages: [
    { time: "09:00", kind: "mahalla", scenarioId: "mahalla-sh12", title: { uz: "Hududni qabul qilish", ru: "Приём участка", en: "Taking over the district" } },
    { time: "10:30", kind: "dialog", scenarioId: "dialog-case04-agressiv", title: { uz: "Nizoli fuqaro", ru: "Конфликтный гражданин", en: "Confrontational citizen" } },
    { time: "13:00", kind: "tir", scenarioId: "tir-pichoq-hovli", title: { uz: "Xavfli vaziyat — TIR", ru: "Опасная ситуация — тир", en: "Dangerous situation — range" } },
    { time: "15:00", kind: "document", scenarioId: "document-pichoq-hodisa", title: { uz: "Hujjatlashtirish — AI hujjat tekshiruvi: qonun va fakt", ru: "Документирование — AI-проверка документа: закон и факт", en: "Documentation — AI document check: law and fact" } },
  ],
};
