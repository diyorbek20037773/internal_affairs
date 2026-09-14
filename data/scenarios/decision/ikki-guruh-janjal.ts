import type { DecisionScenario } from "../types";

export const ikkiGuruhJanjal: DecisionScenario = {
  id: "decision-ikki-guruh",
  kind: "decision",
  code: "Q-04",
  title: { uz: "Ko'chada ikki guruh janjali", ru: "Драка двух групп на улице", en: "Two groups fighting in the street" },
  brief: {
    uz: "To'y oldida ikki guruh (5+6 kishi) janjallashmoqda, mushtlashuv boshlangan. Siz sherik bilan birinchi yetib keldingiz. Ustuvorlik: ajratish, jarohatlanganlar, yordam, huquqiy rasmiylashtirish.",
    ru: "У свадьбы дерутся две группы (5+6 человек). Вы с напарником первые. Приоритет: разделить, раненые, помощь, оформление.",
    en: "Two groups (5+6) fighting outside a wedding. You and your partner arrive first. Priority: separate, injured, backup, paperwork.",
  },
  difficulty: 3,
  tags: ["vaziyat_tahlili", "deeskalatsiya", "huquqiy_qaror", "hujjatlashtirish"],
  estimatedMinutes: 6,
  laws: ["lawPolice", "mjtkPettyHooliganism", "jkHooliganism", "jpkRegister"],
  version: "1.0",
  startNodeId: "j1",
  optimalPath: ["j1-o2", "j2-o1", "j3-o2", "j4-o1"],
  nodes: {
    j1: {
      id: "j1",
      chainPrompt: "xavf",
      timerSec: 20,
      onTimeout: "j1",
      situation: {
        uz: "To'yxona oldi, 23:10. 11 kishi, 3 juft mushtlashmoqda, qolganlar baqirmoqda. Bir yigit yerda, boshini ushlab. Olomon 30 kishi tomosha qilmoqda. Sherigingiz bilan ikkovsiz.",
      },
      options: [
        { id: "j1-o1", text: { uz: "Sherik bilan o'rtaga kirib, mushtlashayotganlarni kuch bilan ajratamiz." }, legality: 3, proportionality: 1, consequence: { uz: "Ikki xodim 11 kishi orasida — nazorat yo'qoldi, sherik zarba oldi." }, next: "j2_bad" },
        { id: "j1-o2", text: { uz: "Navbatchiga: qo'shimcha 2 naryad + tez yordam. Sirena/ovoz kuchaytirgich bilan baland: «Politsiya! Hamma to'xtasin!». Sherik yerdagi yigitga." }, legality: 3, proportionality: 3, laws: ["lawPolice"], consequence: { uz: "Ko'pchilik to'xtadi, 2 juft davom etmoqda. Yerdagi yigit hushida. Yordam 6 daqiqada." }, next: "j2" },
        { id: "j1-o3", text: { uz: "Havoga ogohlantiruvchi o'q uzaman." }, legality: 1, proportionality: 0, laws: ["lawPolice"], consequence: { uz: "Olomon vahimaga tushdi, odamlar yiqildi. Qurol ishlatish sharti yo'q edi — nomutanosib." }, next: null, outcome: "fail" },
      ],
    },
    j2_bad: {
      id: "j2_bad",
      chainPrompt: "yordam",
      situation: { uz: "Sherik burnidan qon, siz ikki kishini ushlab turibsiz, qolganlar davom etmoqda." },
      options: [
        { id: "j2b-o1", text: { uz: "Chekinaman, sherikni olib to'siq ortiga o'taman, yordam chaqiraman, ovoz bilan boshqaraman." }, legality: 3, proportionality: 3, consequence: { uz: "Kech bo'lsa ham to'g'ri: yordam yo'lda, olomon biroz tinchidi." }, next: "j2" },
        { id: "j2b-o2", text: { uz: "Maxsus vosita (gaz) bilan hammani tarqataman." }, legality: 2, proportionality: 1, consequence: { uz: "Gaz tomoshabinlar va bolalarga ham tegdi. Shikoyatlar." }, next: null, outcome: "partial" },
      ],
    },
    j2: {
      id: "j2",
      chainPrompt: "muloqot",
      timerSec: 25,
      onTimeout: "j2",
      situation: { uz: "Ikki guruhning 'kattalari' (kuyov tomoni — Bekzod, kelin tomoni — Sherzod) hali baqirishmoqda. Qolganlar ularga qarab turibdi." },
      options: [
        { id: "j2-o1", text: { uz: "Ikkala yetakchini alohida-alohida ajratib (sherik bittasi, men bittasi), 10 metr narida gaplashaman: «Kim jarohatlangan? Nima bo'ldi?»" }, legality: 3, proportionality: 3, consequence: { uz: "Guruhlar yetakchisiz jim bo'ldi. Bekzod: «U opamni haqorat qildi»." }, next: "j3" },
        { id: "j2-o2", text: { uz: "Ikkalasiga birga: «Hozir ikkalangni ham olib ketaman!»" }, legality: 2, proportionality: 1, consequence: { uz: "Ikkalasi sizga qarshi birlashdi: «Kimni olib ketasan?». Olomon qo'shildi." }, next: "j2" },
      ],
    },
    j3: {
      id: "j3",
      chainPrompt: "kutish",
      timerSec: 25,
      onTimeout: "j3",
      situation: { uz: "Yordam 3 daqiqada. Sherzod tomonidan bir yigit qo'lida g'isht bilan yaqinlashmoqda, ammo hali otmadi. Bekzod qichqirdi." },
      options: [
        { id: "j3-o1", text: { uz: "G'ishtli yigitga qarab quroldan foydalanaman." }, legality: 1, proportionality: 0, consequence: { uz: "Bevosita hayotga xavf yo'q edi (masofa, tashlanmagan). Nomutanosib." }, next: null, outcome: "fail" },
        { id: "j3-o2", text: { uz: "Bekzodni to'siq ortiga o'tkazib, g'ishtli yigitga baland, aniq buyruq: «G'ishtni tashla! Politsiya!», sherik qo'llab-quvvatlaydi. Masofa saqlayman." }, legality: 3, proportionality: 3, laws: ["lawPolice"], consequence: { uz: "Yigit to'xtadi, g'ishtni tashladi. Sirena eshitildi — yordam keldi." }, next: "j4" },
        { id: "j3-o3", text: { uz: "Maxsus vosita (elektroshok) bilan yigitni to'xtataman." }, legality: 2, proportionality: 2, laws: ["lawPolice"], consequence: { uz: "Yigit yiqildi. Qonuniy asos bor edi (qurol sifatidagi buyum), ammo og'zaki buyruq sinab ko'rilmadi." }, next: "j4" },
      ],
    },
    j4: {
      id: "j4",
      chainPrompt: "chora",
      situation: { uz: "Yordam keldi, tomonlar ajratildi. Jarohatlanganlar: 2 kishi (yengil), 1 kishi bosh jarohati. Endi rasmiylashtirish." },
      options: [
        { id: "j4-o1", text: { uz: "Tez yordamga jarohatlanganlarni topshiraman; ikkala yetakchi + g'ishtli yigitni aniqlab, guvohlar va videolarni yig'aman; hodisani ro'yxatga olaman; bezorilik bo'yicha materiallarni surishtiruvga uzataman." }, legality: 3, proportionality: 3, laws: ["jpkRegister", "jkHooliganism"], consequence: { uz: "To'liq: tibbiy yordam, shaxslar, guvohlar, ro'yxat, kvalifikatsiya surishtiruvda." }, next: null, outcome: "success" },
        { id: "j4-o2", text: { uz: "Hammani ogohlantirib tarqatib yuboraman — to'y-da, keyin kelishib olishadi." }, legality: 1, proportionality: 1, consequence: { uz: "Bosh jarohati bor, jinoyat belgilari bor — qayd etilmadi. Qonunbuzarlik." }, next: null, outcome: "fail" },
        { id: "j4-o3", text: { uz: "Faqat g'ishtli yigitni olib ketaman, qolganini mahalla raisiga qoldiraman." }, legality: 2, proportionality: 2, consequence: { uz: "Qisman: jarohatlanganlar va boshqa ishtirokchilar qayd etilmadi." }, next: null, outcome: "partial" },
      ],
    },
  },
};
