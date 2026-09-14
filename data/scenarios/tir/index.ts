import type { TirActorDef, TirScenario } from "../types";

/**
 * TIR O'quv Zonasi — VirTra V-300 uslubidagi immersiv poligon ssenariylari.
 * Xodim (0,0) da, -Z yo'nalishga qaraydi. Masofalar metrda.
 * Har ssenariyda: kim otilishi MUMKIN (faqat bevosita xavf), kim otilishi
 * MUMKIN EMAS (olomon, garovdagi, formadagi xodim, to'xtab turgan mashina).
 */

const RULES = {
  durationSec: 150,
  minDistance: 2.2,
  lungeAgitation: 88,
  lungeDistance: 4,
  complyCompliance: 70,
  backupEtaSec: 60,
  silenceDrift: 2.2,
  officerHitsToFail: 2,
  vehicleThreatDistance: 12,
};

const bystander = (id: string, name: string, x: number, z: number, state: TirActorDef["state"] = "idle", shirt?: string): TirActorDef => ({
  id, role: "bystander", kind: "human", name, weapon: "none", x, z, state, shirt,
});

/* ------------------------------------------------------------------------ */
/* SHABLON 1 — MASHINA: balonga o'q — oxirgi chora                            */
/* ------------------------------------------------------------------------ */
export const tirMashinaBalon: TirScenario = {
  id: "tir-mashina-balon",
  kind: "tir",
  mode: "scenario",
  code: "TIR-01",
  environment: "street",
  title: { uz: "Mashina — balonga o'q (oxirgi chora)", ru: "Автомобиль — выстрел по колесу (крайняя мера)", en: "Vehicle — tire shot (last resort)" },
  brief: {
    uz: "Post: mast haydovchi to'xtash talabini bajarmayapti. Yo'lda o'tkinchilar. Buyruq → to'siq → mashina xodimga/olomonga to'g'ri kelsa — balonga o'q. To'xtab turgan mashinaga o't — qonunsiz.",
    ru: "Пост: нетрезвый водитель не подчиняется. Пешеходы рядом. Команда → укрытие → если машина идёт на сотрудника/людей — выстрел по колесу. Стрелять в стоящую машину — незаконно.",
    en: "Checkpoint: drunk driver ignores stop orders. Pedestrians nearby. Command → cover → if the car charges at you/crowd, shoot the tire. Shooting a parked car is unlawful.",
  },
  briefing: { uz: "Navbatchi: «Post oldida Nexia to'xtatildi, haydovchi mast, hujjat bermayapti. Bekatda odamlar bor. Sherik chap tomonda.»" },
  difficulty: 3,
  tags: ["vaziyat_tahlili", "huquqiy_qaror", "deeskalatsiya", "natijadorlik"],
  estimatedMinutes: 3,
  laws: ["lawPolice", "mjtkProtocol"],
  version: "2.0",
  partner: true,
  rules: { ...RULES, durationSec: 120, complyCompliance: 65 },
  actors: [
    { id: "car", role: "vehicle", kind: "vehicle", name: "Nexia (haydovchi Farhod)", weapon: "none", x: 0.8, z: -14, state: "parked", agitation: 70, compliance: 20, speed: 7,
      lines: { parked: ["Nima bo'ldi, aka? Hujjat yo'q, uyda qolib ketgan!", "Men hech kimga tegmadim!"], revving: ["Qo'yvoringlar! Ketaman hozir!"], charging: ["!!!"], stopped: ["...to'xtadim, to'xtadim."] } },
    bystander("b1", "Ayol (bekat)", -4.5, -9, "idle", "#b06a9a"),
    bystander("b2", "Erkak (bekat)", -5.2, -10.5, "idle", "#5a6b8a"),
    bystander("b3", "O'smir", -3.8, -11.5, "idle", "#7a9a5a"),
  ],
  script: [
    { atSec: 8, op: "escalate_if_hostile", actorId: "car", state: "revving", text: "Haydovchi motorni gazladi, g'ildiraklar aylanmoqda" },
    { atSec: 16, op: "escalate_if_hostile", actorId: "car", state: "charging", text: "MASHINA XODIMGA QARAB HARAKATLANDI!" },
  ],
  rubricHints: {
    huquqiy_qaror: "Balonga o'q FAQAT mashina harakatlanib xodim/fuqarolarga xavf tug'dirganda. To'xtab turgan yoki faqat gazlagan mashinaga o't — qonunsiz. Haydovchiga o'q — balon mumkin bo'lganda nomutanosib.",
    vaziyat_tahlili: "Olomon (bekat) yo'nalishi hisobga olindimi? To'siq va masofa ishlatildimi? Qurol muddatidan oldin chiqarilmadimi?",
    deeskalatsiya: "Buyruq aniq va takror berildimi (motorni o'chir, chiq)? Tahdid o'rniga xotirjam buyruq?",
  },
};

/* ------------------------------------------------------------------------ */
/* SHABLON 2 — OLOMON: qurolli shaxs odamlar orasida                          */
/* ------------------------------------------------------------------------ */
export const tirOlomon: TirScenario = {
  id: "tir-olomon-pichoq",
  kind: "tir",
  mode: "scenario",
  code: "TIR-02",
  environment: "plaza",
  title: { uz: "Olomon ichida qurolli shaxs", ru: "Вооружённый в толпе", en: "Armed man in a crowd" },
  brief: {
    uz: "Bozor maydoni. Pichoqli shaxs odamlar orasida, bir ayolni garovga oldi. Olomon, garovdagi, sherik — hech biri otilmasligi kerak. Muloqot, yordam, masofa; o't — faqat garovdagiga bevosita xavfda.",
    ru: "Рыночная площадь. Человек с ножом в толпе, захватил заложницу. Толпа, заложница, напарник — не мишени. Переговоры, помощь, дистанция; выстрел — только при непосредственной угрозе заложнице.",
    en: "Market square. Knife-wielding man in the crowd takes a woman hostage. Crowd, hostage, partner are not targets. Talk, backup, distance; shoot only on imminent threat to the hostage.",
  },
  briefing: { uz: "Navbatchi: «Chorsu yaqinidagi maydon, erkak pichoq bilan odamlarni qo'rqitmoqda, bir ayolni ushlab turibdi. Olomon ko'p. Sherik o'ng tomonda, kuch yo'lda.»" },
  difficulty: 3,
  tags: ["vaziyat_tahlili", "deeskalatsiya", "huquqiy_qaror", "muloqot"],
  estimatedMinutes: 4,
  laws: ["lawPolice", "jpkRegister"],
  version: "2.0",
  partner: true,
  rules: { ...RULES, durationSec: 160, lungeDistance: 3.5, complyCompliance: 68 },
  actors: [
    { id: "s1", role: "suspect", kind: "human", name: "Erkak (pichoq)", weapon: "knife", x: 0.6, z: -7, state: "shouting", agitation: 78, compliance: 12, speed: 0.4, holds: "h1", shirt: "#3a3a3a",
      lines: { shouting: ["Yaqinlashma! Uni kesaman!", "Hamma orqaga! Menga mashina kerak!"], approaching: ["Kelmang! Oxirgi marta aytaman!"], weapon_raised: ["Sanayman! Bir!.. Ikki!.."], lunging: ["AAA!"], dropping: ["...mayli. Mayli, oling."], kneeling: ["Hech kimga tegmoqchi emasdim..."], calm: ["Gaplashamiz... faqat baqirmang."] } },
    { id: "h1", role: "hostage", kind: "human", name: "Garovdagi ayol", weapon: "none", x: 0.1, z: -6.3, state: "held", shirt: "#d9c27a" },
    bystander("b1", "Sotuvchi", -4, -8, "cowering", "#6b8a5a"),
    bystander("b2", "Yigit", 3.5, -9, "hands_up", "#5a6b8a"),
    bystander("b3", "Keksa erkak", -2.5, -11, "idle", "#8a7a5a"),
    bystander("b4", "Ayol va bola", 4.5, -6, "cowering", "#b06a9a"),
    bystander("b5", "O'tkinchi", -6, -5, "walking", "#7a5a8a"),
  ],
  script: [
    { atSec: 20, op: "escalate_if_hostile", actorId: "s1", state: "weapon_raised", text: "Pichoqni garovdagi ayolning bo'yniga yaqinlashtirdi" },
    { atSec: 55, op: "escalate_if_hostile", actorId: "s1", state: "approaching", text: "Garovdagi bilan birga xodimga qarab yurmoqda" },
  ],
  rubricHints: {
    huquqiy_qaror: "O't — faqat pichoq garovdagiga bevosita xavf tug'dirganda (weapon_raised, yaqin). Olomon fonida o'q — xato xavfi: nishon farqlandimi? Garovdagi/olomon otilsa — 0.",
    deeskalatsiya: "Talabni tinglash (mashina), vaqt yutish, yordam kutish, ohang. Tahdid — eskalatsiya.",
    vaziyat_tahlili: "Olomonni chekintirish (sherik), o't chizig'ida kim bor, masofa.",
  },
};

/* ------------------------------------------------------------------------ */
/* SHABLON 3 — BINO: aktiv otuvchi, formadagi xodim, tinch fuqarolar         */
/* ------------------------------------------------------------------------ */
export const tirBino: TirScenario = {
  id: "tir-bino-otuvchi",
  kind: "tir",
  mode: "scenario",
  code: "TIR-03",
  environment: "lobby",
  title: { uz: "Bino ichida — qurolli shaxs va tinch fuqarolar", ru: "В здании — вооружённый и гражданские", en: "Inside a building — gunman and civilians" },
  brief: {
    uz: "Ofis vestibyuli, o'q ovozi. Yerda jarohatlangan, burchakda qo'rqib o'tirganlar. Qurolli shaxs chiqadi — qurol qaratilsa o't qonuniy. Formadagi hamkasb yugurib o'tadi — OTMANG. Ikkinchi shaxs eshikdan — qo'lida nima borligini farqlang.",
    ru: "Вестибюль офиса, выстрелы. Раненые на полу, гражданские в углу. Стрелок выходит — при наведении оружия выстрел законен. Пробегает коллега в форме — НЕ СТРЕЛЯТЬ. Второй выходит из двери — различите, что в руке.",
    en: "Office lobby, gunshots. Wounded on the floor, civilians cowering. Gunman appears — shooting is lawful when he aims. A uniformed colleague runs across — DON'T SHOOT. Second man from the door — identify what's in his hand.",
  },
  briefing: { uz: "Navbatchi: «Biznes-markaz, 1-qavat, o'q ovozlari, bir necha jarohatlangan. Siz birinchi kirdingiz. Boshqa naryad ham binoda.»" },
  difficulty: 3,
  tags: ["vaziyat_tahlili", "huquqiy_qaror", "natijadorlik"],
  estimatedMinutes: 3,
  laws: ["lawPolice", "jpkRegister"],
  version: "2.0",
  partner: false,
  rules: { ...RULES, durationSec: 90, complyCompliance: 80, officerHitsToFail: 2 },
  actors: [
    bystander("v1", "Jarohatlangan", -2.2, -6, "down", "#8a8a8a"),
    bystander("v2", "Xodima (stol)", 3.2, -8.5, "cowering", "#c9a26a"),
    bystander("v3", "Yigit (burchak)", -3.6, -9, "cowering", "#5a6b8a"),
    bystander("v4", "Ayol (burchak)", -4.2, -8.2, "cowering", "#b06a9a"),
    { id: "g1", role: "suspect", kind: "human", name: "Otuvchi", weapon: "gun", x: 1.5, z: -11, state: "weapon_raised", agitation: 95, compliance: 0, aimSec: 2.5, hidden: true, shirt: "#222",
      lines: { weapon_raised: ["Hamma yerga!"], aiming: ["Sen ham!"], dropping: [], kneeling: [] } },
    { id: "cop", role: "police", kind: "human", name: "Hamkasb (formada)", weapon: "gun", x: -5, z: -7, state: "walking", hidden: true, speed: 3, shirt: "#1c2a4a" },
    { id: "g2", role: "suspect", kind: "human", name: "Ikkinchi shaxs (eshik)", weapon: "gun", x: 2.5, z: -9.5, state: "hands_up", agitation: 60, compliance: 85, hidden: true, shirt: "#5a3a2a",
      lines: { hands_up: ["Otmang! Otmang! Men ishchiman!"], weapon_raised: ["..."], aiming: ["!"] } },
  ],
  script: [
    { atSec: 3, op: "spawn", actorId: "g1", text: "Ustundan qurolli shaxs chiqdi" },
    { atSec: 5, op: "set_state", actorId: "g1", state: "aiming", text: "Otuvchi qurolni xodimga qaratdi" },
    { atSec: 14, op: "spawn", actorId: "cop", text: "Chapdan formadagi xodim yugurib chiqdi" },
    { atSec: 14.5, op: "move", actorId: "cop", x: 4, z: -7.5 },
    { atSec: 22, op: "spawn", actorId: "g2", text: "Eshikdan qo'lini ko'targan shaxs chiqdi — bir qo'li orqasida" },
    { atSec: 30, op: "escalate_if_hostile", actorId: "g2", state: "weapon_raised", text: "Ikkinchi shaxs orqadan qurol chiqardi!" },
    { atSec: 32, op: "escalate_if_hostile", actorId: "g2", state: "aiming" },
  ],
  rubricHints: {
    huquqiy_qaror: "g1 qaratganda o't — qonuniy. Formadagi xodim otilsa — 0. g2 qo'l ko'targanda o't — 0; qurol chiqarib qaratganda — qonuniy.",
    vaziyat_tahlili: "Nishonni farqlash: forma, qo'llar, kim yerda. To'siq ishlatildimi? Yordam chaqirildimi?",
    natijadorlik: "Xodim tegmadimi (elektroshok), fuqarolar tegmadimi.",
  },
};

/* ------------------------------------------------------------------------ */
/* Eski shablonlar (v2 formatda)                                             */
/* ------------------------------------------------------------------------ */
export const tirPichoqHovli: TirScenario = {
  id: "tir-pichoq-hovli",
  kind: "tir",
  mode: "scenario",
  code: "TIR-04",
  environment: "yard",
  title: { uz: "Hovlida pichoqli shaxs", ru: "Человек с ножом во дворе", en: "Man with a knife in a yard" },
  brief: { uz: "Erkak hovlida pichoq bilan baqirmoqda, hech kimga hujum qilmagan. Muloqot — birinchi, qurol — oxirgi chora. «To'g'ri otmaslik» a'lo baho.", ru: "Мужчина во дворе кричит с ножом. Коммуникация — первое, оружие — последнее средство.", en: "Man shouting with a knife in a yard. Talk first, weapon last." },
  briefing: { uz: "Navbatchi: «Bog'imaydon MFY, 7-uy. Erkak hovlida pichoq bilan baqiryapti, hech kimga hujum qilmagan. Sherik bilan yetib keldingiz.»" },
  difficulty: 2,
  tags: ["deeskalatsiya", "huquqiy_qaror", "vaziyat_tahlili"],
  estimatedMinutes: 4,
  laws: ["lawPolice", "jpkRegister", "lawPrevention"],
  version: "2.0",
  partner: true,
  rules: { ...RULES },
  actors: [
    { id: "s1", role: "suspect", kind: "human", name: "Anvar", weapon: "knife", x: 0, z: -8, state: "shouting", agitation: 72, compliance: 15, speed: 0.45, shirt: "#8b2f2f",
      lines: { shouting: ["Yaqinlashmanglar! Hammangiz yolg'onchisiz!", "Menga hech kim ishonmaydi!"], approaching: ["Nega kelding? Kim chaqirdi seni?!"], weapon_raised: ["Yaqinlashsang — o'zimga uraman!", "Otinglar! Baribir yashagim kelmayapti!"], lunging: ["AAAA!"], dropping: ["...mayli. Oling.", "Bolalarim meni sog' ko'rishi kerak..."], kneeling: ["Men hech kimga tegmoqchi emasdim."], calm: ["Gaplashsam bo'ladimi?"] } },
  ],
  script: [{ atSec: 14, op: "escalate_if_hostile", actorId: "s1", state: "weapon_raised" }],
  rubricHints: {
    deeskalatsiya: "Masofa, birinchi 10 soniyada muloqot, xotirjam ohang.",
    huquqiy_qaror: "Qurol faqat tashlanishda; elektroshok xavfda va muloqotdan keyin.",
  },
};

export const tirShishaBekat: TirScenario = {
  id: "tir-shisha-bekat",
  kind: "tir",
  mode: "scenario",
  code: "TIR-05",
  environment: "street",
  title: { uz: "Bekatda shishali mast shaxs", ru: "Нетрезвый с бутылкой на остановке", en: "Drunk man with a bottle" },
  brief: { uz: "Mast yigit qo'lida shisha, odamlar bor. Qurol — mutlaqo nomutanosib. Elektroshok — faqat xavfda.", ru: "Пьяный с бутылкой, люди рядом. Оружие несоразмерно.", en: "Drunk man with a bottle, bystanders. Firearm grossly disproportionate." },
  briefing: { uz: "Navbatchi: «Bekatda mast shaxs o'tkinchilarga tegajoqlik qilmoqda, qo'lida shisha. Sherik mashinada.»" },
  difficulty: 1,
  tags: ["deeskalatsiya", "huquqiy_qaror"],
  estimatedMinutes: 3,
  laws: ["mjtkPublicDrinking", "mjtkPettyHooliganism", "lawPolice"],
  version: "2.0",
  partner: false,
  rules: { ...RULES, durationSec: 120, lungeAgitation: 90, lungeDistance: 3.5, complyCompliance: 65, backupEtaSec: 40 },
  actors: [
    { id: "s1", role: "suspect", kind: "human", name: "Sardor", weapon: "bottle", x: 0.5, z: -7, state: "shouting", agitation: 65, compliance: 20, speed: 0.4, shirt: "#3b4a8a",
      lines: { shouting: ["Ho-o, ment keldi! Kimga nima?!"], approaching: ["Nima qilasan, olib ketasanmi?"], weapon_raised: ["Yaqin kelma, shishani uraman!"], lunging: ["Ha-a!"], dropping: ["Uf... mayli. Mana."], kneeling: ["Onam kasal uyda..."], calm: ["Mayli, gaplashamiz."] } },
    bystander("b1", "Ayol (bekat)", -3.5, -8, "idle", "#b06a9a"),
    bystander("b2", "Erkak (bekat)", -4.5, -9.5, "idle", "#5a6b8a"),
  ],
  script: [],
  rubricHints: { huquqiy_qaror: "Shisha bilan mast shaxsga qurol — 0 ball.", deeskalatsiya: "Sensirash yo'q, masofa, uyga yetib olishga yordam." },
};

/* ------------------------------------------------------------------------ */
/* MARKSMANSHIP — plate rack                                                 */
/* ------------------------------------------------------------------------ */
export const tirPlateRack: TirScenario = {
  id: "tir-plate-rack",
  kind: "tir",
  mode: "marksmanship",
  code: "TIR-M1",
  environment: "range",
  title: { uz: "Marksmanship — plastina to'plami", ru: "Стрельба — стойка с пластинами", en: "Marksmanship — plate rack" },
  brief: { uz: "6 plastina, 10 m. Vaqt birinchi o'qdan boshlanadi. Score, Hit Factor (tegish/soniya), split vaqtlar. Qurolni chiqarib (D) plastinalarga bosing.", ru: "6 пластин, 10 м. Таймер от первого выстрела. Score, Hit Factor, сплиты.", en: "6 plates at 10 m. Timer from first shot. Score, hit factor, splits." },
  briefing: { uz: "Instruktor: «Plate rack, 6 plastina, 10 metr. Qurolni chiqaring. Tayyor bo'lsangiz — birinchi o'q taymerni boshlaydi.»" },
  difficulty: 1,
  tags: ["natijadorlik", "raqamli"],
  estimatedMinutes: 2,
  laws: [],
  version: "2.0",
  partner: false,
  rules: { ...RULES, durationSec: 60 },
  actors: [1, 2, 3, 4, 5, 6].map((i) => ({
    id: `p${i}`, role: "target" as const, kind: "plate" as const, name: `#${i}`, weapon: "none" as const, x: -2.5 + (i - 1) * 1.0, z: -10, state: "standing" as const,
  })),
  script: [],
  rubricHints: { natijadorlik: "Tegish soni, Hit Factor, o'tib ketgan o'qlar." },
};

export const TIR_SCENARIOS: TirScenario[] = [tirMashinaBalon, tirOlomon, tirBino, tirPichoqHovli, tirShishaBekat, tirPlateRack];
