import type { DialogScenario } from "../types";

export const qoshniNizo: DialogScenario = {
  id: "dialog-qoshni-nizo",
  kind: "dialog",
  code: "Case 11",
  title: { uz: "Qo'shnilar nizosi — norozi fuqaro", ru: "Спор соседей — недовольный гражданин", en: "Neighbor dispute — dissatisfied citizen" },
  brief: {
    uz: "Ikki qo'shni devor va daraxt bo'yicha janjallashadi. Biri sizni 'qo'shnining odami' deb hisoblaydi. Neytral qoling, ikkala tomonni tinglang, vositachilik va huquqiy yo'lni tushuntiring.",
    ru: "Два соседа спорят о заборе и дереве. Один считает вас 'человеком соседа'. Оставайтесь нейтральным, разъясните медиацию и правовой путь.",
    en: "Two neighbors argue over a fence and a tree. One sees you as biased. Stay neutral, explain mediation and the legal route.",
  },
  difficulty: 1,
  tags: ["muloqot", "huquqiy_qaror", "vaziyat_tahlili"],
  estimatedMinutes: 8,
  laws: ["lawPrevention", "regInspector", "lawAppeals"],
  version: "1.0",
  setting: {
    uz: "Mahalla ko'chasi, kunduzi. Siz Rustam akaning darvozasi oldidasiz. Qo'shnisi (Bahodir) hovlisida, eshitib turibdi.",
    ru: "Улица махалли, день. Вы у ворот Рустама. Сосед Баходир во дворе, слышит разговор.",
    en: "Mahalla street, daytime. You are at Rustam's gate. Neighbor Bahodir is in his yard, listening.",
  },
  persona: {
    type: "norozi",
    name: "Rustam aka",
    age: 47,
    gender: "erkak",
    background:
      "Tadbirkor, mahallada obro'li. Qo'shnisi Bahodirning tut daraxti shoxlari uning hovlisiga o'sib, tomni buzgan. Ikki marta og'zaki aytgan, foyda yo'q. O'tgan hafta o'zi shoxni kesib tashlagan — Bahodir shu uchun mahalla raisiga shikoyat qilgan. Endi 'aybdor men bo'lib qoldim' deb norozi. Inspektorni Bahodirning tanishi deb gumon qiladi.",
    grievance:
      "Adolat: daraxt masalasi hal bo'lsin, uni aybdor qilishmasin. Inspektor neytral ekaniga ishonmoqchi.",
    triggers: [
      "'Siz shoxni kesmasligingiz kerak edi' deb boshlash",
      "Bahodirning so'zlarini isbotsiz takrorlash",
      "'Bu bizning ishimiz emas, sudga boring' deb qaytarish",
      "Uning obro'sini mensimaslik",
    ],
    soothers: [
      "Avval uning versiyasini to'liq tinglash",
      "Neytrallikni ochiq aytish: ikkala tomonni ham eshitaman",
      "Yarashtirish komissiyasi / mahalla vositachiligini taklif qilish",
      "Aniq huquqiy yo'lni (fuqarolik tartibi, mulk chegarasi) tushuntirish",
      "Bahodir bilan birga uchrashuv taklif qilish",
    ],
    secretFacts: [
      "Tom ta'miri unga 3 mln so'mga tushgan, cheki bor.",
      "Bahodir bilan 15 yil do'st bo'lishgan, nizo faqat 2 oy oldin boshlangan.",
    ],
  },
  initialState: {
    tension: 55,
    trust: 30,
    cooperation: 40,
    phase: "tinglash",
    revealed: [],
  },
  opening:
    "Ha, keldingizmi? Bahodir chaqirgandir-da sizni. Endi men aybdorman, shundaymi? Daraxti tomimni buzganda hech kim kelmagan edi!",
  maxTurns: 12,
  revealTrust: 50,
  successCondition: { minTrust: 60, maxTension: 30 },
  failCondition: { tension: 90 },
  rubricHints: {
    muloqot: "Neytral pozitsiya aniq bildirildimi? Ikkala tomon bilan uchrashuv taklif qilindimi?",
    huquqiy_qaror:
      "Bu fuqarolik nizosi — inspektor vositachilik va yarashtirish komissiyasiga yo'naltirishi kerak, o'zi qaror chiqarmasligi kerak. To'g'ri tushuntirildimi?",
    vaziyat_tahlili: "Nizo huquqbuzarlikka (janjal, mulkka zarar) o'sish xavfi baholandimi?",
  },
};
