import type { DocumentScenario } from "../types";
import { mastHaydovchiMalumotnoma } from "./mast-haydovchi-malumotnoma";
import { reydHisobot } from "./reyd-hisobot";

/**
 * Hujjatlashtirish — pptx slide 9, 15:00: "AI hujjat tekshiruvi: qonun va fakt".
 * Trainee writes the document from given facts; AI checks completeness,
 * factual accuracy (no invented facts / guilt conclusions) and legal basis.
 */
export const pichoqHodisaBayonnoma: DocumentScenario = {
  id: "document-pichoq-hodisa",
  kind: "document",
  code: "H-01",
  documentKind: "malumotnoma",
  title: { uz: "Ma'lumotnoma: pichoqli shaxs hodisasi", ru: "Справка: происшествие с ножом", en: "Report: knife incident" },
  brief: {
    uz: "Kunduzi 13:00 dagi hovlidagi pichoqli shaxs hodisasi bo'yicha rahbariyatga ma'lumotnoma yozing. Faqat berilgan faktlar. Aybdorlik xulosasi yo'q. Huquqiy asos — aniq va tasdiqlangan.",
    ru: "Напишите справку руководству о происшествии с ножом (13:00). Только данные факты. Без выводов о виновности. Правовая основа — точная.",
    en: "Write a report to management about the 13:00 knife incident. Only given facts. No guilt conclusions. Precise legal basis.",
  },
  difficulty: 2,
  tags: ["hujjatlashtirish", "huquqiy_qaror", "vaziyat_tahlili"],
  estimatedMinutes: 12,
  laws: ["jpkRegister", "lawPolice", "lawPrevention"],
  version: "1.0",
  minWords: 80,
  facts: [
    {
      uz: "Sana/vaqt: bugun, 13:05 da qo'shni (Rahimova N., 21-uy) 102 ga qo'ng'iroq qildi.",
      ru: "Дата/время: сегодня, в 13:05 соседка (Рахимова Н., дом 21) позвонила на 102.",
      en: "Date/time: today at 13:05 a neighbour (Rahimova N., house 21) called 102.",
    },
    {
      uz: "Joy: Bog'imaydon MFY, 7-uy hovlisi.",
      ru: "Место: МСГ Богимайдон, двор дома 7.",
      en: "Place: Bog'imaydon MFY, yard of house 7.",
    },
    {
      uz: "Shaxs: Anvar Karimov, 1989-yil, shu manzilda yashaydi, ishsiz.",
      ru: "Лицо: Анвар Каримов, 1989 г.р., проживает по данному адресу, не работает.",
      en: "Person: Anvar Karimov, born 1989, resides at this address, unemployed.",
    },
    {
      uz: "Holat: hovlida qo'lida oshxona pichog'i (uzunligi ~20 sm) bilan baqirgan, hech kimga hujum qilmagan, o'ziga zarar yetkazish haqida gapirgan.",
      ru: "Обстановка: кричал во дворе с кухонным ножом в руке (длина ~20 см), ни на кого не нападал, говорил о причинении вреда себе.",
      en: "Situation: was shouting in the yard holding a kitchen knife (~20 cm), attacked no one, spoke of harming himself.",
    },
    {
      uz: "Sabab (uning so'zi bilan): sud qarori bilan bolalar onasiga berilgan, 2 hafta oldin.",
      ru: "Причина (с его слов): по решению суда дети переданы матери, 2 недели назад.",
      en: "Reason (in his words): by court decision the children were placed with their mother, 2 weeks ago.",
    },
    {
      uz: "Xodimlar: profilaktika inspektori (siz) va sherigingiz kichik leytenant Toshpo'latov B. 13:12 da yetib keldi.",
      ru: "Сотрудники: инспектор профилактики (вы) и напарник младший лейтенант Тошпулатов Б. прибыли в 13:12.",
      en: "Officers: the prevention inspector (you) and your partner Junior Lieutenant Toshpo'latov B. arrived at 13:12.",
    },
    {
      uz: "Harakat: masofa saqlab muloqot, 13:25 da pichoqni o'zi yerga qo'ydi, kuch va qurol ishlatilmadi.",
      ru: "Действия: общение с соблюдением дистанции, в 13:25 сам положил нож на землю, физическая сила и оружие не применялись.",
      en: "Actions: communication at a safe distance; at 13:25 he put the knife down himself; no force or weapons were used.",
    },
    {
      uz: "Tez tibbiy yordam 13:30 da keldi, Anvar Karimov ko'rikka rozi bo'ldi, 1-shahar klinik shifoxonasiga olib ketildi.",
      ru: "Скорая медицинская помощь прибыла в 13:30, Анвар Каримов согласился на осмотр, доставлен в 1-ю городскую клиническую больницу.",
      en: "Ambulance arrived at 13:30; Anvar Karimov agreed to an examination and was taken to City Clinical Hospital No. 1.",
    },
    {
      uz: "Pichoq olib qo'yildi (ashyo), uyda onasi Karimova M. (1961-yil) bo'lgan, jarohat yo'q.",
      ru: "Нож изъят (вещественное доказательство); в доме находилась его мать Каримова М. (1961 г.р.), телесных повреждений нет.",
      en: "The knife was seized (evidence); his mother Karimova M. (born 1961) was in the house, no injuries.",
    },
    {
      uz: "Guvohlar: Rahimova N. (qo'shni), Karimova M. (onasi).",
      ru: "Свидетели: Рахимова Н. (соседка), Каримова М. (мать).",
      en: "Witnesses: Rahimova N. (neighbour), Karimova M. (mother).",
    },
  ],
  forbidden: [
    "Anvar Karimovni jinoyatchi/aybdor deb xulosa qilish",
    "Mast yoki giyohvand holatda edi deb yozish (fakt yo'q)",
    "Xotiniga hujum qilgan/tahdid qilgan deb yozish (fakt yo'q)",
    "Jinoyat kodeksi moddasini o'ylab topish (bu hodisa JK bo'yicha kvalifikatsiya qilinmagan)",
    "Vaqtlarni o'zgartirish",
  ],
  rubric: [
    { id: "who", label: { uz: "Kimga / kimdan (adresat, xodim, unvon)", ru: "Кому / от кого (адресат, сотрудник, звание)", en: "To / from (addressee, officer, rank)" } },
    { id: "when", label: { uz: "Sana va aniq vaqtlar (qo'ng'iroq, yetib kelish, yakun)", ru: "Дата и точное время (вызов, прибытие, завершение)", en: "Date and exact times (call, arrival, conclusion)" } },
    { id: "where", label: { uz: "Joy (MFY, uy)", ru: "Место (МСГ, дом)", en: "Place (MFY, house)" } },
    { id: "person", label: { uz: "Shaxs ma'lumotlari (F.I.Sh., tug'ilgan yil, manzil)", ru: "Данные лица (Ф.И.О., год рождения, адрес)", en: "Person details (full name, year of birth, address)" } },
    { id: "what", label: { uz: "Hodisa tavsifi faktlar bo'yicha (pichoq, baqirish, hujum yo'q, o'ziga zarar gapi)", ru: "Описание происшествия по фактам (нож, крики, нападения не было, слова о вреде себе)", en: "Description of the incident by facts (knife, shouting, no attack, talk of self-harm)" } },
    { id: "actions", label: { uz: "Xodimlar harakati (muloqot, kuch ishlatilmadi, pichoq qo'yildi)", ru: "Действия сотрудников (общение, сила не применялась, нож положен)", en: "Officers' actions (communication, no force used, knife put down)" } },
    { id: "medical", label: { uz: "Tibbiy yordam va olib ketilgan joy", ru: "Медицинская помощь и место доставления", en: "Medical assistance and where he was taken" } },
    { id: "evidence", label: { uz: "Ashyo (pichoq) va uning olinishi", ru: "Вещественное доказательство (нож) и его изъятие", en: "Evidence (knife) and its seizure" } },
    { id: "witnesses", label: { uz: "Guvohlar", ru: "Свидетели", en: "Witnesses" } },
    { id: "legal", label: { uz: "Huquqiy asos: xabar ro'yxatga olinishi (JPK 329), IIO to'g'risidagi qonun; profilaktik hisob masalasi", ru: "Правовая основа: регистрация сообщения (УПК 329), Закон об ОВД; вопрос профилактического учёта", en: "Legal basis: registration of the report (CPC 329), Law on Internal Affairs Bodies; preventive-register question" }, hint: "Moddani o'ylab topmaslik" },
    { id: "next", label: { uz: "Keyingi chora / taklif (profilaktik hisob, psixolog, oila bilan ishlash)", ru: "Дальнейшие меры / предложения (профилактический учёт, психолог, работа с семьёй)", en: "Next steps / proposals (preventive register, psychologist, work with the family)" } },
    { id: "neutral", label: { uz: "Neytral, aybsiz ohang; taxmin yo'q", ru: "Нейтральный тон без обвинений; без предположений", en: "Neutral, non-accusatory tone; no assumptions" } },
  ],
};

export const oilaviyBayonnoma: DocumentScenario = {
  id: "document-oilaviy-bayonnoma",
  kind: "document",
  code: "H-02",
  documentKind: "bayonnoma",
  title: { uz: "Bayonnoma: oilaviy zo'ravonlik chaqiruvi", ru: "Протокол: вызов по семейному насилию", en: "Protocol: domestic violence call" },
  brief: {
    uz: "Kechki chaqiruv bo'yicha bayonnoma. Jabrlanuvchi arizadan bosh tortgan — himoya orderi asoslarini to'g'ri qayd eting. Jarohatlar, bolalar, guvoh.",
    ru: "Протокол по вечернему вызову. Пострадавшая отказалась от заявления — правильно зафиксируйте основания охранного ордера.",
    en: "Protocol for an evening call. Victim declined to file — record protection-order grounds correctly.",
  },
  difficulty: 3,
  tags: ["hujjatlashtirish", "huquqiy_qaror", "profiling"],
  estimatedMinutes: 15,
  laws: ["lawDv", "regProtectionOrder", "jpkRegister", "familyCode"],
  version: "1.0",
  minWords: 100,
  facts: [
    {
      uz: "Chaqiruv: 22:04, qo'shni (Yusupov K., 3-qavat) 102 ga — «janjal, idish sinish ovozi».",
      ru: "Вызов: 22:04, сосед (Юсупов К., 3-й этаж) на 102 — «скандал, звук бьющейся посуды».",
      en: "Call: 22:04, a neighbour (Yusupov K., 3rd floor) to 102 — \"a fight, sound of breaking dishes\".",
    },
    {
      uz: "Joy: Mirzo Ulug'bek tumani, Buyuk Ipak yo'li ko'chasi, 14-uy, 12-xonadon.",
      ru: "Место: Мирзо-Улугбекский район, улица Буюк Ипак йули, дом 14, квартира 12.",
      en: "Place: Mirzo Ulug'bek district, Buyuk Ipak yo'li street, house 14, apartment 12.",
    },
    {
      uz: "Ishtirokchilar: Bobur Nazarov (1991), Madina Nazarova (1994), farzand — 6 yosh.",
      ru: "Участники: Бобур Назаров (1991), Мадина Назарова (1994), ребёнок — 6 лет.",
      en: "Parties: Bobur Nazarov (1991), Madina Nazarova (1994), child — 6 years old.",
    },
    {
      uz: "Madina Nazarova: yuzning chap tomonida qizarish va shish, o'ng bilagida sarg'aygan eski ko'karish (o'z so'zi bilan — 2 hafta oldingi).",
      ru: "Мадина Назарова: покраснение и отёк на левой стороне лица, на правом запястье пожелтевший старый кровоподтёк (с её слов — двухнедельной давности).",
      en: "Madina Nazarova: redness and swelling on the left side of the face, a yellowed old bruise on the right wrist (in her words — from 2 weeks ago).",
    },
    {
      uz: "Madina: «uchinchi marta», ariza yozishdan bosh tortdi (qaynonadan qo'rqadi).",
      ru: "Мадина: «третий раз», от подачи заявления отказалась (боится свекрови).",
      en: "Madina: \"the third time\"; declined to file a statement (afraid of her mother-in-law).",
    },
    {
      uz: "Bobur: hushyor, «hech narsa bo'lmadi» deydi, qarshilik ko'rsatmadi.",
      ru: "Бобур: трезв, говорит «ничего не было», сопротивления не оказывал.",
      en: "Bobur: sober, says \"nothing happened\", offered no resistance.",
    },
    {
      uz: "Bola: qo'rqqan, jarohat yo'q, ota-ona bilan qoldi (Madina iltimosi bilan).",
      ru: "Ребёнок: напуган, телесных повреждений нет, остался с родителями (по просьбе Мадины).",
      en: "Child: frightened, no injuries, stayed with the parents (at Madina's request).",
    },
    {
      uz: "Xodimlar: siz va serjant Aliyev D., 22:15 da yetib keldingiz, tomonlarni ajratdingiz.",
      ru: "Сотрудники: вы и сержант Алиев Д., прибыли в 22:15, разделили стороны.",
      en: "Officers: you and Sergeant Aliyev D., arrived at 22:15, separated the parties.",
    },
    {
      uz: "Madinaga tibbiy ko'rik yo'llanmasi va ishonch telefoni berildi; ko'rikka rozi.",
      ru: "Мадине выданы направление на медицинское освидетельствование и номер телефона доверия; на осмотр согласна.",
      en: "Madina was given a referral for a medical examination and the helpline number; she agreed to the examination.",
    },
    {
      uz: "Himoya orderi masalasi ko'rib chiqish uchun rahbariyatga taqdim etilmoqda.",
      ru: "Вопрос о выдаче охранного ордера передаётся руководству на рассмотрение.",
      en: "The protection-order question is being submitted to management for consideration.",
    },
  ],
  forbidden: [
    "Boburni aybdor deb xulosa qilish (bu sud vakolati)",
    "Madina 'o'zi sabab bo'lgan' kabi baholovchi so'zlar",
    "Ariza yo'qligi sababli 'chora ko'rilmadi' deb yozish (himoya orderi arizasiz ham beriladi)",
    "Bobur mast edi deb yozish (fakt: hushyor)",
    "Bola jarohatlangan deb yozish",
  ],
  rubric: [
    { id: "when", label: { uz: "Sana, chaqiruv va yetib kelish vaqti", ru: "Дата, время вызова и прибытия", en: "Date, time of the call and of arrival" } },
    { id: "where", label: { uz: "Aniq manzil", ru: "Точный адрес", en: "Exact address" } },
    { id: "persons", label: { uz: "Tomonlar va bola ma'lumotlari", ru: "Данные сторон и ребёнка", en: "Details of the parties and the child" } },
    { id: "injuries", label: { uz: "Jarohatlarning aniq tavsifi (joyi, ko'rinishi, eski/yangi)", ru: "Точное описание телесных повреждений (локализация, вид, старые/свежие)", en: "Precise description of injuries (location, appearance, old/new)" } },
    { id: "statements", label: { uz: "Tomonlar so'zlari — iqtibos sifatida, baholamasdan", ru: "Слова сторон — в виде цитат, без оценки", en: "Parties' statements — quoted, without evaluation" } },
    { id: "repeat", label: { uz: "Takroriylik («uchinchi marta») qayd etilgan", ru: "Зафиксирована повторность («третий раз»)", en: "Repeat pattern (\"the third time\") recorded" } },
    { id: "refusal", label: { uz: "Arizadan bosh tortish sababi bilan qayd etilgan", ru: "Отказ от заявления зафиксирован с указанием причины", en: "Refusal to file recorded with the reason" } },
    { id: "child", label: { uz: "Bola holati va qayerda qolgani", ru: "Состояние ребёнка и где он остался", en: "Child's condition and where the child stayed" } },
    { id: "actions", label: { uz: "Xodim harakatlari (ajratish, yo'llanma, ishonch telefoni)", ru: "Действия сотрудников (разделение сторон, направление, телефон доверия)", en: "Officers' actions (separation, referral, helpline)" } },
    { id: "order", label: { uz: "Himoya orderi asosi: O'RQ-561, arizasiz berilishi mumkinligi", ru: "Основание охранного ордера: ЗРУ-561, возможность выдачи без заявления", en: "Protection-order basis: Law ZRU-561, may be issued without a statement" }, hint: "Aniq: jabrlanuvchi arizasi shart emas" },
    { id: "witness", label: { uz: "Guvoh (qo'shni Yusupov K.)", ru: "Свидетель (сосед Юсупов К.)", en: "Witness (neighbour Yusupov K.)" } },
    { id: "register", label: { uz: "Xabar ro'yxatga olinganligi (JPK 329)", ru: "Регистрация сообщения (УПК 329)", en: "Registration of the report (CPC 329)" } },
    { id: "neutral", label: { uz: "Neytral ohang, aybdorlik xulosasi yo'q", ru: "Нейтральный тон, без выводов о виновности", en: "Neutral tone, no guilt conclusions" } },
  ],
};

export const DOCUMENT_SCENARIOS: DocumentScenario[] = [pichoqHodisaBayonnoma, oilaviyBayonnoma, mastHaydovchiMalumotnoma, reydHisobot];
