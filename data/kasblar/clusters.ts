import type { ClusterId, LearningCluster, Subject } from "./types";
import { t } from "./professions/_shared";

/**
 * The 7 o'quv klasterlari. Each cluster groups subjects (fanlar) and practice
 * (amaliyot) that close the competency gaps of one or more professions.
 * Subject ids are stable — professions and the passport reference them.
 */
export const CLUSTERS: LearningCluster[] = [
  {
    id: "huquqiy",
    icon: "Scale",
    title: t("Umumiy huquqiy tayyorgarlik", "Общая правовая подготовка", "General legal training"),
    description: t(
      "Barcha huquqni muhofaza qilish kasblari uchun umumiy huquqiy poydevor: moddiy va protsessual huquq, inson huquqlari, kasbiy etika.",
      "Общий правовой фундамент для всех правоохранительных профессий: материальное и процессуальное право, права человека, профессиональная этика.",
      "The common legal foundation for every law-enforcement profession: substantive and procedural law, human rights, professional ethics."
    ),
    subjects: [
      { id: "huq-01", kind: "nazariy", hours: 36, title: t("Konstitutsiyaviy huquq va inson huquqlari", "Конституционное право и права человека", "Constitutional law and human rights") },
      { id: "huq-02", kind: "nazariy", hours: 54, title: t("Jinoyat huquqi", "Уголовное право", "Criminal law") },
      { id: "huq-03", kind: "nazariy", hours: 40, title: t("Ma'muriy huquq va ma'muriy javobgarlik", "Административное право и административная ответственность", "Administrative law and administrative liability") },
      { id: "huq-04", kind: "nazariy", hours: 48, title: t("Jinoyat-protsessual huquq asoslari", "Основы уголовно-процессуального права", "Fundamentals of criminal procedure") },
      { id: "huq-05", kind: "nazariy", hours: 24, title: t("Huquqni muhofaza qilish organlari tizimi", "Система правоохранительных органов", "The law-enforcement system") },
      { id: "huq-06", kind: "amaliy", hours: 24, title: t("Kasbiy etika va korrupsiyaga qarshi kurash", "Профессиональная этика и противодействие коррупции", "Professional ethics and anti-corruption") },
      { id: "huq-07", kind: "amaliy", hours: 20, title: t("Jismoniy va yuridik shaxslarning murojaatlari bilan ishlash", "Работа с обращениями физических и юридических лиц", "Handling citizens' and organisations' appeals") },
    ],
    practice: [
      t("Huquqiy vaziyatlarni kvalifikatsiya qilish bo'yicha keys-yechim", "Кейс-решения по квалификации правовых ситуаций", "Case work on legal qualification of situations"),
      t("Qonunchilik bazasi (lex.uz) bilan ishlash praktikumi", "Практикум по работе с базой законодательства (lex.uz)", "Workshop on the legislation database (lex.uz)"),
      t("Etik dilemmalar bo'yicha rolli o'yin", "Ролевая игра по этическим дилеммам", "Role play on ethical dilemmas"),
    ],
  },
  {
    id: "maxsus",
    icon: "ShieldCheck",
    title: t("Maxsus kasbiy tayyorgarlik", "Специальная профессиональная подготовка", "Special professional training"),
    description: t(
      "Xizmat faoliyatining amaliy ko'nikmalari: profilaktika, kasbiy muloqot, jamoat tartibi, jismoniy va otish tayyorgarligi, birinchi yordam, favqulodda vaziyatlarda harakat.",
      "Практические навыки службы: профилактика, профессиональное общение, общественный порядок, физическая и огневая подготовка, первая помощь, действия в ЧС.",
      "Hands-on service skills: prevention, professional communication, public order, physical and firearms training, first aid, emergency response."
    ),
    subjects: [
      { id: "mx-01", kind: "amaliy", hours: 40, title: t("Profilaktika faoliyati va profilaktik hisob", "Профилактическая деятельность и профилактический учёт", "Prevention work and preventive registration") },
      { id: "mx-02", kind: "simulyatsion", hours: 32, title: t("Kasbiy muloqot va deeskalatsiya", "Профессиональное общение и деэскалация", "Professional communication and de-escalation") },
      { id: "mx-03", kind: "nazariy", hours: 36, title: t("Yuridik psixologiya", "Юридическая психология", "Legal psychology") },
      { id: "mx-04", kind: "amaliy", hours: 40, title: t("Jamoat tartibini saqlash va obyektlarni qo'riqlash taktikasi", "Тактика охраны общественного порядка и объектов", "Tactics of public order and facility protection") },
      { id: "mx-05", kind: "amaliy", hours: 60, title: t("Otish, jismoniy va maxsus tayyorgarlik", "Огневая, физическая и специальная подготовка", "Firearms, physical and special training") },
      { id: "mx-06", kind: "amaliy", hours: 24, title: t("Tibbiy birinchi yordam", "Первая медицинская помощь", "First aid") },
      { id: "mx-07", kind: "amaliy", hours: 48, title: t("Favqulodda vaziyatlarda harakat va qutqaruv ishlari", "Действия в ЧС и аварийно-спасательные работы", "Emergency response and rescue operations") },
      { id: "mx-08", kind: "simulyatsion", hours: 28, title: t("Inqirozli vaziyatlarda psixologik yordam", "Психологическая помощь в кризисных ситуациях", "Psychological crisis support") },
    ],
    practice: [
      t("Mahalla va tayanch punktida stajirovka", "Стажировка на участке и в опорном пункте", "Internship at a neighbourhood police post"),
      t("Otish tiri va taktik poligon mashg'ulotlari", "Занятия в тире и на тактическом полигоне", "Firing range and tactical ground sessions"),
      t("Qo'riqlash posti va ommaviy tadbirda navbatchilik", "Дежурство на посту охраны и массовом мероприятии", "Duty at a guard post and a mass event"),
      t("Qutqaruv poligonida kompleks mashq", "Комплексное учение на спасательном полигоне", "Integrated drill at a rescue training ground"),
    ],
  },
  {
    id: "kriminalistika",
    icon: "Fingerprint",
    title: t("Kriminalistika", "Криминалистика", "Criminalistics"),
    description: t(
      "Voqea joyini ko'zdan kechirish, izlar va ashyoviy dalillarni aniqlash, qayd etish, olish va saqlash, ekspertiza tayinlash.",
      "Осмотр места происшествия, выявление, фиксация, изъятие и хранение следов и вещественных доказательств, назначение экспертиз.",
      "Crime-scene examination; detecting, recording, seizing and preserving traces and physical evidence; ordering forensic examinations."
    ),
    subjects: [
      { id: "krim-01", kind: "amaliy", hours: 48, title: t("Kriminalistika texnikasi", "Криминалистическая техника", "Forensic technology") },
      { id: "krim-02", kind: "nazariy", hours: 36, title: t("Kriminalistik taktika va metodika", "Криминалистическая тактика и методика", "Forensic tactics and methodology") },
      { id: "krim-03", kind: "simulyatsion", hours: 32, title: t("Voqea joyini ko'zdan kechirish", "Осмотр места происшествия", "Crime-scene examination") },
      { id: "krim-04", kind: "amaliy", hours: 36, title: t("Izlar va ashyoviy dalillar bilan ishlash", "Работа со следами и вещественными доказательствами", "Working with traces and physical evidence") },
      { id: "krim-05", kind: "nazariy", hours: 30, title: t("Sud ekspertizasi asoslari", "Основы судебной экспертизы", "Fundamentals of forensic expertise") },
      { id: "krim-06", kind: "amaliy", hours: 16, title: t("Dalillar saqlanish zanjiri", "Цепочка хранения доказательств", "Chain of custody") },
    ],
    practice: [
      t("Voqea joyi poligonida ko'zdan kechirish mashqi", "Учебный осмотр на полигоне места происшествия", "Crime-scene drill on a training ground"),
      t("Kriminalistik laboratoriyada amaliyot", "Практика в криминалистической лаборатории", "Placement in a forensic laboratory"),
      t("Ekspert xulosasini himoya qilish (o'quv sud jarayoni)", "Защита экспертного заключения (учебный процесс)", "Defending an expert report (moot court)"),
    ],
  },
  {
    id: "kiber",
    icon: "Laptop",
    title: t("Kiberxavfsizlik va kiberkriminalistika", "Кибербезопасность и киберкриминалистика", "Cybersecurity and digital forensics"),
    description: t(
      "Axborot texnologiyalari sohasidagi jinoyatlarga qarshi kurash: OSINT, raqamli izlar, fishing va ijtimoiy muhandislik, moliyaviy oqimlarni kuzatish.",
      "Противодействие преступлениям в сфере ИТ: OSINT, цифровые следы, фишинг и социальная инженерия, отслеживание финансовых потоков.",
      "Countering IT crime: OSINT, digital traces, phishing and social engineering, tracing financial flows."
    ),
    subjects: [
      { id: "kib-01", kind: "nazariy", hours: 30, title: t("Axborot xavfsizligi asoslari", "Основы информационной безопасности", "Information security fundamentals") },
      { id: "kib-02", kind: "amaliy", hours: 36, title: t("OSINT — ochiq manbalar razvedkasi", "OSINT — разведка по открытым источникам", "OSINT — open-source intelligence") },
      { id: "kib-03", kind: "amaliy", hours: 48, title: t("Raqamli kriminalistika", "Цифровая криминалистика", "Digital forensics") },
      { id: "kib-04", kind: "simulyatsion", hours: 30, title: t("Kiberfiribgarlik va ijtimoiy muhandislik", "Кибермошенничество и социальная инженерия", "Cyber fraud and social engineering") },
      { id: "kib-05", kind: "amaliy", hours: 30, title: t("Moliyaviy tranzaksiyalar va virtual aktivlarni kuzatish", "Отслеживание финансовых транзакций и виртуальных активов", "Tracing financial transactions and virtual assets") },
      { id: "kib-06", kind: "nazariy", hours: 16, title: t("Shaxsga doir ma'lumotlarni himoya qilish", "Защита персональных данных", "Personal data protection") },
    ],
    practice: [
      t("Kiber-poligonda (sandbox) incidentni tekshirish", "Расследование инцидента на киберполигоне (sandbox)", "Incident investigation in a cyber range (sandbox)"),
      t("Raqamli qurilmadan ma'lumot olish laboratoriyasi", "Лаборатория извлечения данных с цифровых устройств", "Device data-extraction lab"),
      t("Bank va to'lov tizimlari bilan hamkorlik bo'yicha keys", "Кейс по взаимодействию с банками и платёжными системами", "Case on cooperation with banks and payment systems"),
    ],
  },
  {
    id: "analitika",
    icon: "BarChart3",
    title: t("Analitika va tezkor tahlil", "Аналитика и оперативный анализ", "Analytics and operational analysis"),
    description: t(
      "Huquqiy statistika, jinoyatchilik holatini tahlil qilish va prognozlash, geoaxborot tahlili, xavflarni boshqarish va rahbariyat uchun xulosa tayyorlash.",
      "Правовая статистика, анализ и прогнозирование преступности, геоинформационный анализ, управление рисками и подготовка выводов для руководства.",
      "Legal statistics, crime analysis and forecasting, geospatial analysis, risk management and briefings for leadership."
    ),
    subjects: [
      { id: "an-01", kind: "nazariy", hours: 30, title: t("Huquqiy statistika", "Правовая статистика", "Legal statistics") },
      { id: "an-02", kind: "amaliy", hours: 36, title: t("Jinoyatchilikni tahlil qilish va prognozlash", "Анализ и прогнозирование преступности", "Crime analysis and forecasting") },
      { id: "an-03", kind: "amaliy", hours: 30, title: t("Geoaxborot tahlili (GIS)", "Геоинформационный анализ (ГИС)", "Geospatial analysis (GIS)") },
      { id: "an-04", kind: "amaliy", hours: 24, title: t("Axborot-tahliliy ma'lumotnoma tayyorlash", "Подготовка информационно-аналитических справок", "Writing analytical briefs") },
      { id: "an-05", kind: "nazariy", hours: 30, title: t("Tezkor-qidiruv faoliyati asoslari", "Основы оперативно-розыскной деятельности", "Fundamentals of operational-search activity") },
      { id: "an-06", kind: "amaliy", hours: 24, title: t("Xavflarni boshqarish (risk-menejment)", "Управление рисками (риск-менеджмент)", "Risk management") },
    ],
    practice: [
      t("Hudud bo'yicha jinoyatchilik xaritasini tuzish", "Построение карты преступности по территории", "Building a crime map for a district"),
      t("Rahbariyat uchun tahliliy brifing tayyorlash", "Подготовка аналитического брифинга для руководства", "Preparing an analytical briefing for leadership"),
      t("Statistik hisobot ma'lumotlarini tekshirish praktikumi", "Практикум по проверке статистической отчётности", "Workshop on validating statistical reports"),
    ],
  },
  {
    id: "bojxona",
    icon: "PackageSearch",
    title: t("Bojxona ishi va nazorat", "Таможенное дело и контроль", "Customs and border control"),
    description: t(
      "Bojxona rejimlari, tovarlarni tasniflash, bojxona qiymati va to'lovlari, xavflarni boshqarish tizimi, kontrabanda va bojxona huquqbuzarliklarini aniqlash.",
      "Таможенные режимы, классификация товаров, таможенная стоимость и платежи, система управления рисками, выявление контрабанды и таможенных правонарушений.",
      "Customs procedures, goods classification, customs value and payments, risk management system, detecting smuggling and customs offences."
    ),
    subjects: [
      { id: "boj-01", kind: "nazariy", hours: 40, title: t("Bojxona ishi va bojxona rejimlari", "Таможенное дело и таможенные режимы", "Customs law and customs procedures") },
      { id: "boj-02", kind: "amaliy", hours: 36, title: t("Tovarlarni TIF TN bo'yicha tasniflash", "Классификация товаров по ТН ВЭД", "Tariff classification of goods (HS)") },
      { id: "boj-03", kind: "amaliy", hours: 36, title: t("Bojxona qiymati va bojxona to'lovlari", "Таможенная стоимость и таможенные платежи", "Customs value and customs payments") },
      { id: "boj-04", kind: "simulyatsion", hours: 32, title: t("Bojxona nazorati va ko'rik", "Таможенный контроль и досмотр", "Customs control and inspection") },
      { id: "boj-05", kind: "amaliy", hours: 24, title: t("Xavflarni boshqarish tizimi va xavf profillari", "Система управления рисками и профили риска", "Risk management system and risk profiles") },
      { id: "boj-06", kind: "amaliy", hours: 30, title: t("Kontrabanda va bojxona huquqbuzarliklarini aniqlash", "Выявление контрабанды и таможенных правонарушений", "Detecting smuggling and customs offences") },
    ],
    practice: [
      t("Bojxona postida stajirovka", "Стажировка на таможенном посту", "Internship at a customs post"),
      t("Deklaratsiyani tekshirish praktikumi", "Практикум по проверке декларации", "Declaration review workshop"),
      t("Rentgen-televizion tizim tasvirlarini tahlil qilish", "Анализ изображений рентген-телевизионной системы", "Analysing X-ray scanner images"),
    ],
  },
  {
    id: "protsessual",
    icon: "FileText",
    title: t("Amaliy va protsessual tayyorgarlik", "Практическая и процессуальная подготовка", "Practical and procedural training"),
    description: t(
      "Ariza va xabarlarni qabul qilishdan tortib, surishtiruv, tergov harakatlari, protsessual hujjatlar, muddatlar va prokuror nazoratigacha — ish yuritishning to'liq sikli.",
      "Полный цикл производства: от приёма заявлений и сообщений до дознания, следственных действий, процессуальных документов, сроков и прокурорского надзора.",
      "The full case cycle: from receiving reports to inquiry, investigative actions, procedural documents, deadlines and prosecutorial oversight."
    ),
    subjects: [
      { id: "pr-01", kind: "simulyatsion", hours: 20, title: t("Ariza va xabarlarni qabul qilish va ro'yxatga olish", "Приём и регистрация заявлений и сообщений", "Receiving and registering reports") },
      { id: "pr-02", kind: "amaliy", hours: 48, title: t("Surishtiruv va dastlabki tergov", "Дознание и предварительное следствие", "Inquiry and preliminary investigation") },
      { id: "pr-03", kind: "simulyatsion", hours: 40, title: t("Tergov harakatlari taktikasi", "Тактика следственных действий", "Tactics of investigative actions") },
      { id: "pr-04", kind: "amaliy", hours: 36, title: t("Protsessual va xizmat hujjatlarini rasmiylashtirish", "Оформление процессуальных и служебных документов", "Drafting procedural and service documents") },
      { id: "pr-05", kind: "nazariy", hours: 36, title: t("Prokuror nazorati", "Прокурорский надзор", "Prosecutorial oversight") },
      { id: "pr-06", kind: "amaliy", hours: 20, title: t("Protsessual muddatlar va ish yuritish", "Процессуальные сроки и делопроизводство", "Procedural deadlines and case management") },
      { id: "pr-07", kind: "amaliy", hours: 24, title: t("Ma'muriy huquqbuzarlik ishlari bo'yicha ish yuritish", "Производство по делам об административных правонарушениях", "Administrative offence proceedings") },
    ],
    practice: [
      t("Navbatchilik qismida ariza qabul qilish stajirovkasi", "Стажировка по приёму заявлений в дежурной части", "Duty-desk internship on receiving reports"),
      t("O'quv jinoyat ishini boshidan oxirigacha yuritish", "Ведение учебного уголовного дела от начала до конца", "Running a training criminal case end to end"),
      t("Protsessual hujjatlar portfeli (bayonnoma, qaror, xulosa)", "Портфель процессуальных документов (протокол, постановление, заключение)", "Portfolio of procedural documents (record, decision, report)"),
    ],
  },
];

export const CLUSTER_MAP: Record<ClusterId, LearningCluster> = Object.fromEntries(
  CLUSTERS.map((c) => [c.id, c])
) as Record<ClusterId, LearningCluster>;

export function getCluster(id: string): LearningCluster | undefined {
  return CLUSTERS.find((c) => c.id === id);
}

/** Every subject across clusters, keyed by id, with its cluster. */
export const SUBJECT_MAP: Record<string, Subject & { cluster: ClusterId }> = Object.fromEntries(
  CLUSTERS.flatMap((c) => c.subjects.map((s) => [s.id, { ...s, cluster: c.id }]))
);

export function getSubject(id: string): (Subject & { cluster: ClusterId }) | undefined {
  return SUBJECT_MAP[id];
}
