import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const kiber: ProfessionStandard = {
  id: "kiber",
  agencies: ["iiv"],
  icon: "Laptop",
  title: t("Kiberjinoyatlarga qarshi kurash xodimi", "Сотрудник по борьбе с киберпреступностью", "Cybercrime officer"),
  short: t(
    "Axborot texnologiyalari sohasidagi jinoyatlarni aniqlaydi: raqamli izlarni kuzatadi, fishing sxemalarini ochadi va moliyaviy oqimlarni tahlil qiladi.",
    "Выявляет преступления в сфере ИТ: отслеживает цифровые следы, вскрывает фишинговые схемы и анализирует финансовые потоки.",
    "Detects IT crime: traces digital footprints, exposes phishing schemes and analyses financial flows."
  ),
  functions: [
    {
      id: "kb-f1",
      title: t("Kiberincidentlar bo'yicha murojaatlarni qabul qilish", "Приём обращений о киберинцидентах", "Receiving cyber-incident reports"),
      tasks: [
        t("Jabrlanuvchidan incident tafsilotlarini to'liq yig'ish", "Полный сбор деталей инцидента у потерпевшего", "Collecting full incident details from the victim"),
        t("Ekran rasmlari, xabarlar va tranzaksiya ma'lumotlarini saqlab qolish", "Сохранение скриншотов, сообщений и данных транзакций", "Preserving screenshots, messages and transaction data"),
        t("Bank va to'lov tizimiga mablag'ni to'xtatish bo'yicha tezkor so'rov yuborish", "Срочный запрос в банк и платёжную систему о блокировке средств", "Sending urgent freeze requests to banks and payment systems"),
      ],
    },
    {
      id: "kb-f2",
      title: t("Ochiq manbalar va raqamli izlar tahlili", "Анализ открытых источников и цифровых следов", "OSINT and digital-trace analysis"),
      tasks: [
        t("Akkauntlar, domenlar va telefon raqamlari o'rtasidagi bog'lanishlarni aniqlash", "Выявление связей между аккаунтами, доменами и номерами", "Linking accounts, domains and phone numbers"),
        t("Fishing sahifalari va xabarlarining belgilarini aniqlash", "Выявление признаков фишинговых страниц и сообщений", "Identifying phishing pages and messages"),
        t("Metama'lumotlar va loglardan vaqt chizig'ini tiklash", "Восстановление хронологии по метаданным и логам", "Reconstructing timelines from metadata and logs"),
      ],
    },
    {
      id: "kb-f3",
      title: t("Moliyaviy oqimlarni kuzatish", "Отслеживание финансовых потоков", "Tracing financial flows"),
      tasks: [
        t("Tranzaksiyalar zanjirini tuzish va «dropper» kartalarni aniqlash", "Построение цепочки транзакций и выявление карт-дропперов", "Mapping transaction chains and spotting mule cards"),
        t("Virtual aktivlar bilan bog'liq operatsiyalarni tahlil qilish", "Анализ операций с виртуальными активами", "Analysing virtual-asset operations"),
        t("Moliyaviy tashkilotlarga qonuniy so'rovlar tayyorlash", "Подготовка законных запросов в финансовые организации", "Preparing lawful requests to financial institutions"),
      ],
    },
    {
      id: "kb-f4",
      title: t("Raqamli dalillarni rasmiylashtirish", "Оформление цифровых доказательств", "Documenting digital evidence"),
      tasks: [
        t("Raqamli dalillarni o'zgartirmasdan olish va xesh bilan qayd etish", "Изъятие цифровых доказательств без изменений с фиксацией хеша", "Acquiring digital evidence unchanged and recording hashes"),
        t("Tahlil natijalari bo'yicha ma'lumotnoma va hisobot tayyorlash", "Подготовка справки и отчёта по результатам анализа", "Writing the analytical brief and report"),
        t("Shaxsga doir ma'lumotlar himoyasi talablariga rioya qilish", "Соблюдение требований защиты персональных данных", "Complying with personal-data protection rules"),
      ],
    },
  ],
  knowledge: [
    t("Axborot texnologiyalari sohasidagi jinoyatlar va firibgarlik tarkiblari", "Составы преступлений в сфере ИТ и мошенничества", "Elements of IT crime and fraud"),
    t("Tarmoq texnologiyalari, IP-manzillar, DNS va domenlar asoslari", "Основы сетевых технологий, IP-адресов, DNS и доменов", "Networking, IP addresses, DNS and domains"),
    t("Ijtimoiy muhandislik va fishing usullari", "Методы социальной инженерии и фишинга", "Social-engineering and phishing techniques"),
    t("Bank kartalari, to'lov tizimlari va virtual aktivlar ishlash tamoyillari", "Принципы работы банковских карт, платёжных систем и виртуальных активов", "How cards, payment systems and virtual assets work"),
    t("Raqamli kriminalistika standartlari (xesh, obraz, saqlanish zanjiri)", "Стандарты цифровой криминалистики (хеш, образ, цепочка хранения)", "Digital forensic standards (hash, image, chain of custody)"),
    t("Kiberxavfsizlik va shaxsga doir ma'lumotlar to'g'risidagi qonunchilik", "Законодательство о кибербезопасности и персональных данных", "Cybersecurity and personal-data legislation"),
    t("Tezkor-qidiruv faoliyatining huquqiy chegaralari", "Правовые пределы оперативно-розыскной деятельности", "Legal limits of operational-search activity"),
  ],
  skills: [
    t("OSINT vositalari bilan tizimli qidiruv", "Системный поиск с помощью OSINT-инструментов", "Systematic OSINT searching"),
    t("URL, sarlavha va xabar matnidan fishing belgilarini topish", "Выявление фишинга по URL, заголовкам и тексту", "Spotting phishing in URLs, headers and text"),
    t("Tranzaksiyalar jadvalidan sxema tuzish", "Построение схемы по таблице транзакций", "Building a scheme from a transaction table"),
    t("Raqamli dalilni o'zgartirmasdan saqlash", "Сохранение цифрового доказательства без изменений", "Preserving digital evidence unaltered"),
    t("Texnik topilmalarni tushunarli tilda bayon qilish", "Изложение технических выводов понятным языком", "Explaining technical findings in plain language"),
    t("Jabrlanuvchi bilan ishonchli muloqot", "Доверительное общение с потерпевшим", "Building trust with the victim"),
  ],
  competencies: [
    {
      id: "kiber.osint",
      label: t("OSINT", "OSINT", "OSINT"),
      description: t("Ochiq manbalardan qonuniy yo'l bilan ma'lumot yig'ish va bog'lanishlarni aniqlash.", "Законный сбор информации из открытых источников и выявление связей.", "Lawful collection from open sources and link analysis."),
      clusters: ["kiber", "analitika"],
      subjects: ["kib-02", "an-05"],
    },
    {
      id: "kiber.raqamli_iz",
      label: t("Raqamli izlar", "Цифровые следы", "Digital traces"),
      description: t("Loglar, metama'lumotlar va qurilmalardan izlarni olish va vaqt chizig'ini tiklash.", "Извлечение следов из логов, метаданных и устройств, восстановление хронологии.", "Extracting traces from logs, metadata and devices; rebuilding timelines."),
      clusters: ["kiber", "kriminalistika"],
      subjects: ["kib-03", "kib-01", "krim-06"],
    },
    {
      id: "kiber.fishing",
      label: t("Fishing va ijtimoiy muhandislik", "Фишинг и социальная инженерия", "Phishing and social engineering"),
      description: t("Firibgarlik sxemasini tanib olish, uning texnik va psixologik belgilarini ajratish.", "Распознавание мошеннической схемы, её технических и психологических признаков.", "Recognising the fraud scheme and its technical and psychological markers."),
      clusters: ["kiber"],
      subjects: ["kib-04", "kib-01"],
    },
    {
      id: "kiber.moliyaviy",
      label: t("Moliyaviy tahlil", "Финансовый анализ", "Financial tracing"),
      description: t("Tranzaksiyalar zanjirini kuzatish, mablag'larni to'xtatish choralarini o'z vaqtida ko'rish.", "Отслеживание цепочки транзакций и своевременные меры по блокировке средств.", "Following transaction chains and acting in time to freeze funds."),
      clusters: ["kiber", "analitika"],
      subjects: ["kib-05", "an-02"],
    },
    {
      id: "kiber.hujjat",
      label: t("Raqamli dalillarni rasmiylashtirish", "Оформление цифровых доказательств", "Digital evidence documentation"),
      description: t("Raqamli dalillarni protsessual talablarga mos va maxfiylikni saqlagan holda hujjatlashtirish.", "Документирование цифровых доказательств по процессуальным требованиям с соблюдением конфиденциальности.", "Documenting digital evidence to procedural standards while protecting privacy."),
      clusters: ["protsessual", "kiber"],
      subjects: ["pr-04", "kib-06", "krim-06"],
    },
  ],
  levels: levels([
    t("Murojaatlarni qabul qiladi va dastlabki ma'lumotlarni saqlaydi.", "Принимает обращения и сохраняет первичные данные.", "Takes reports and preserves initial data."),
    t("Standart fishing va firibgarlik holatlarini mustaqil tahlil qiladi.", "Самостоятельно анализирует типовые фишинговые и мошеннические случаи.", "Independently analyses standard phishing and fraud cases."),
    t("Ko'p bosqichli sxemalar va virtual aktivlar bilan bog'liq ishlarni ochadi.", "Раскрывает многоступенчатые схемы и дела с виртуальными активами.", "Solves multi-layer schemes and virtual-asset cases."),
    t("Xalqaro hamkorlikdagi ishlarni muvofiqlashtiradi, metodik materiallar tayyorlaydi.", "Координирует дела международного взаимодействия, готовит методические материалы.", "Coordinates international cases and produces guidance."),
  ]),
  education: [
    t("Oliy ta'lim (axborot texnologiyalari, kiberxavfsizlik yoki huquqshunoslik)", "Высшее образование (ИТ, кибербезопасность или право)", "Higher education (IT, cybersecurity or law)"),
    t("Kiberkriminalistika bo'yicha maxsus kurs", "Специальный курс по киберкриминалистике", "Specialised digital-forensics course"),
    t("Xalqaro sertifikatlash va muntazam texnik malaka oshirish", "Международная сертификация и регулярное техническое обучение", "International certification and ongoing technical training"),
  ],
  practice: [
    { title: t("Kiber-poligon", "Киберполигон", "Cyber range"), description: t("Sandbox muhitida fishing kampaniyasini tekshirish.", "Расследование фишинговой кампании в среде sandbox.", "Investigating a phishing campaign in a sandbox.") },
    { title: t("Bo'linmada stajirovka", "Стажировка в подразделении", "Unit internship"), description: t("Real murojaatlar bo'yicha tajribali xodim bilan ishlash.", "Работа по реальным обращениям с опытным сотрудником.", "Working real reports with an experienced officer.") },
    { title: t("Kasb simulyatori", "Профессиональный симулятор", "Profession simulator"), description: t("Messenjer, fishing sahifa va tranzaksiyalar bilan virtual tekshiruv.", "Виртуальная проверка с мессенджером, фишинговой страницей и транзакциями.", "Virtual investigation with messenger, phishing page and transactions.") },
  ],
  legalBasis: [
    { lawKey: "jkCyber" },
    { lawKey: "jkFraud" },
    { title: t("«Kiberxavfsizlik to'g'risida»gi Qonun", "Закон «О кибербезопасности»", "Law on Cybersecurity") },
    { title: t("«Shaxsga doir ma'lumotlar to'g'risida»gi Qonun", "Закон «О персональных данных»", "Law on Personal Data") },
    { title: t("«Tezkor-qidiruv faoliyati to'g'risida»gi Qonun", "Закон «Об оперативно-розыскной деятельности»", "Law on Operational-Search Activity") },
    { title: t("Jinoyat-protsessual kodeksi", "Уголовно-процессуальный кодекс", "Criminal Procedure Code") },
  ],
  assessment: [
    t("Kasb simulyatori natijalari", "Результаты профессионального симулятора", "Profession simulator results"),
    t("Kiber-poligondagi amaliy topshiriq", "Практическое задание на киберполигоне", "Practical task in the cyber range"),
    t("Raqamli dalillar bo'yicha hujjatlar sifati", "Качество документов по цифровым доказательствам", "Quality of digital-evidence documentation"),
    t("Mablag'larni o'z vaqtida to'xtatish ko'rsatkichi", "Показатель своевременной блокировки средств", "Timely fund-freeze rate"),
  ],
  career: [
    { title: t("Kiber bo'linma inspektori", "Инспектор киберподразделения", "Cyber unit inspector"), requirement: t("Maxsus kurs", "Спецкурс", "Specialised course") },
    { title: t("Tezkor vakil (kiber)", "Оперуполномоченный (кибер)", "Cyber detective"), requirement: t("«Asosiy» daraja", "Уровень «Базовый»", "«Core» level") },
    { title: t("Katta tezkor vakil", "Старший оперуполномоченный", "Senior cyber detective"), requirement: t("«Ilg'or» daraja, sertifikat", "Уровень «Продвинутый», сертификат", "«Advanced» level, certification") },
    { title: t("Kiberkriminalistika mutaxassisi", "Специалист по киберкриминалистике", "Digital forensics specialist"), requirement: t("«Ekspert» daraja", "Уровень «Экспертный»", "«Expert» level") },
    { title: t("Kiber bo'linma boshlig'i", "Начальник киберподразделения", "Head of cyber unit"), requirement: t("Boshqaruv kursi", "Курс управления", "Management course") },
  ],
  clusters: ["kiber", "analitika", "kriminalistika", "protsessual"],
  trainers: [],
};
