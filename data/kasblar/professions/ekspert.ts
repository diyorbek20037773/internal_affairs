import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const ekspert: ProfessionStandard = {
  id: "ekspert",
  agencies: ["iiv"],
  icon: "Fingerprint",
  title: t("Ekspert-kriminalist", "Эксперт-криминалист", "Forensic expert"),
  short: t(
    "Voqea joyida izlar va ashyoviy dalillarni aniqlaydi, oladi va qadoqlaydi, ekspertiza o'tkazib, asosli xulosa beradi.",
    "Выявляет, изымает и упаковывает следы и вещественные доказательства на месте происшествия, проводит экспертизы и даёт обоснованные заключения.",
    "Detects, seizes and packages traces and physical evidence at the scene, performs examinations and issues reasoned reports."
  ),
  functions: [
    {
      id: "ek-f1",
      title: t("Voqea joyini ko'zdan kechirishda ishtirok etish", "Участие в осмотре места происшествия", "Taking part in crime-scene examination"),
      tasks: [
        t("Voqea joyini qo'riqlash chegaralarini belgilash va izlarni saqlash", "Определение границ охраны места и сохранение следов", "Setting the scene perimeter and preserving traces"),
        t("Izlarni kriminalistik texnika yordamida aniqlash", "Выявление следов с помощью криминалистической техники", "Detecting traces with forensic equipment"),
        t("Fotojadval va sxema tuzish", "Составление фототаблицы и схемы", "Producing the photo table and scene sketch"),
      ],
    },
    {
      id: "ek-f2",
      title: t("Dalillarni olish, qadoqlash va saqlash", "Изъятие, упаковка и хранение доказательств", "Seizing, packaging and storing evidence"),
      tasks: [
        t("Har bir obyekt turiga mos qadoqlash usulini tanlash", "Выбор способа упаковки для каждого вида объекта", "Choosing the right packaging for each item type"),
        t("Yorliq, muhr va ishtirokchilar imzolarini rasmiylashtirish", "Оформление бирок, печатей и подписей участников", "Completing labels, seals and participants' signatures"),
        t("Saqlanish zanjirini uzluksiz hujjatlashtirish", "Непрерывное документирование цепочки хранения", "Documenting an unbroken chain of custody"),
      ],
    },
    {
      id: "ek-f3",
      title: t("Ekspertiza o'tkazish", "Производство экспертизы", "Conducting examinations"),
      tasks: [
        t("Tayinlash to'g'risidagi qaror va obyektlarni qabul qilish, qadoq butligini tekshirish", "Приём постановления и объектов, проверка целостности упаковки", "Receiving the order and items, checking packaging integrity"),
        t("Tadqiqot usullarini tanlash va qo'llash", "Выбор и применение методов исследования", "Selecting and applying research methods"),
        t("Natijalarni solishtirish va baholash", "Сравнение и оценка результатов", "Comparing and evaluating results"),
      ],
    },
    {
      id: "ek-f4",
      title: t("Xulosa tayyorlash va uni himoya qilish", "Подготовка и защита заключения", "Writing and defending the report"),
      tasks: [
        t("Savollarga aniq va asosli javob beruvchi ekspert xulosasini yozish", "Написание заключения с чёткими обоснованными ответами на вопросы", "Writing a report with clear, reasoned answers"),
        t("Vakolat doirasidan chiqmaslik va ehtimoliy xulosalarni to'g'ri ifodalash", "Соблюдение пределов компетенции и корректная формулировка вероятных выводов", "Staying within competence and wording probable findings properly"),
        t("Tergovchi va sud savollariga tushuntirish berish", "Дача разъяснений следователю и суду", "Explaining findings to the investigator and court"),
      ],
    },
  ],
  knowledge: [
    t("Kriminalistika texnikasi: izlar turlari va ularni aniqlash usullari", "Криминалистическая техника: виды следов и методы их выявления", "Forensic technology: trace types and detection methods"),
    t("Ashyoviy dalillarni qadoqlash va saqlash qoidalari", "Правила упаковки и хранения вещественных доказательств", "Rules for packaging and storing physical evidence"),
    t("Sud-ekspertlik faoliyati asoslari va ekspert huquq-majburiyatlari", "Основы судебно-экспертной деятельности, права и обязанности эксперта", "Foundations of forensic practice and the expert's rights and duties"),
    t("Voqea joyini ko'zdan kechirishning protsessual tartibi", "Процессуальный порядок осмотра места происшествия", "Procedural rules for scene examination"),
    t("Daktiloskopiya, trasologiya va ballistika asoslari", "Основы дактилоскопии, трасологии и баллистики", "Basics of fingerprinting, trace analysis and ballistics"),
    t("Biologik obyektlar bilan ishlashda kontaminatsiyaning oldini olish", "Предотвращение контаминации при работе с биологическими объектами", "Preventing contamination with biological material"),
  ],
  skills: [
    t("Voqea joyida izlarni tizimli qidirish", "Систематический поиск следов на месте", "Systematic trace search at the scene"),
    t("Kriminalistik fotosuratga olish", "Криминалистическая фотосъёмка", "Forensic photography"),
    t("Obyektni shikastlamasdan olish va qadoqlash", "Изъятие и упаковка объекта без повреждений", "Seizing and packaging items without damage"),
    t("Laboratoriya uskunalari bilan ishlash", "Работа с лабораторным оборудованием", "Operating laboratory equipment"),
    t("Tadqiqot natijalarini statistik va mantiqiy baholash", "Статистическая и логическая оценка результатов", "Statistical and logical evaluation of findings"),
    t("Aniq, tushunarli ekspert xulosasini yozish", "Написание точного и понятного заключения", "Writing precise, readable reports"),
  ],
  competencies: [
    {
      id: "ekspert.aniqlash",
      label: t("Izlarni aniqlash", "Выявление следов", "Trace detection"),
      description: t("Voqea joyida izlar va obyektlarni to'liq aniqlash va qayd etish.", "Полное выявление и фиксация следов и объектов на месте происшествия.", "Fully detecting and recording traces and items at the scene."),
      clusters: ["kriminalistika"],
      subjects: ["krim-03", "krim-01"],
    },
    {
      id: "ekspert.qadoqlash",
      label: t("Olish va qadoqlash", "Изъятие и упаковка", "Seizure and packaging"),
      description: t("Har bir obyektni to'g'ri usulda olish, qadoqlash va muhrlash.", "Изъятие, упаковка и опечатывание каждого объекта верным способом.", "Seizing, packaging and sealing each item correctly."),
      clusters: ["kriminalistika"],
      subjects: ["krim-04", "krim-01"],
    },
    {
      id: "ekspert.tahlil",
      label: t("Ekspert tadqiqoti", "Экспертное исследование", "Forensic analysis"),
      description: t("Tadqiqot usulini to'g'ri tanlash va natijalarni ilmiy asosda baholash.", "Верный выбор метода исследования и научная оценка результатов.", "Choosing sound methods and evaluating results scientifically."),
      clusters: ["kriminalistika", "analitika"],
      subjects: ["krim-05", "krim-01", "an-01"],
    },
    {
      id: "ekspert.xulosa",
      label: t("Ekspert xulosasi", "Экспертное заключение", "Expert report"),
      description: t("Savollarga vakolat doirasida aniq, asosli va tekshiriladigan javob berish.", "Точные, обоснованные и проверяемые ответы в пределах компетенции.", "Precise, reasoned, verifiable answers within competence."),
      clusters: ["kriminalistika", "protsessual"],
      subjects: ["krim-05", "pr-04"],
    },
    {
      id: "ekspert.zanjir",
      label: t("Saqlanish zanjiri", "Цепочка хранения", "Chain of custody"),
      description: t("Dalilning olishdan sudgacha bo'lgan yo'lini uzluksiz hujjatlashtirish.", "Непрерывное документирование пути доказательства от изъятия до суда.", "Documenting the evidence trail from seizure to court without gaps."),
      clusters: ["kriminalistika", "protsessual"],
      subjects: ["krim-06", "huq-04"],
    },
  ],
  levels: levels([
    t("Voqea joyida ekspert yordamchisi sifatida ishlaydi.", "Работает на месте происшествия как помощник эксперта.", "Works the scene as an assistant to an expert."),
    t("Standart ekspertizalarni mustaqil o'tkazadi.", "Самостоятельно проводит типовые экспертизы.", "Independently performs standard examinations."),
    t("Kompleks va takroriy ekspertizalarda ishtirok etadi, xulosani sudda himoya qiladi.", "Участвует в комплексных и повторных экспертизах, защищает заключение в суде.", "Takes part in complex and repeat examinations and defends reports in court."),
    t("Metodikalarni ishlab chiqadi va ekspertlarni attestatsiyadan o'tkazishda qatnashadi.", "Разрабатывает методики и участвует в аттестации экспертов.", "Develops methods and helps certify experts."),
  ]),
  education: [
    t("Oliy ta'lim (yuridik, kimyo, biologiya yoki muhandislik yo'nalishi)", "Высшее образование (юридическое, химическое, биологическое или инженерное)", "Higher education (law, chemistry, biology or engineering)"),
    t("Ekspert mutaxassisligi bo'yicha maxsus tayyorgarlik va ekspert huquqini olish", "Специальная подготовка и получение права самостоятельного производства экспертиз", "Specialist training and licence to perform examinations"),
    t("Muntazam malaka oshirish va laboratoriya akkreditatsiyasi talablari", "Регулярное повышение квалификации и требования аккредитации", "Regular refresher training and lab accreditation requirements"),
  ],
  practice: [
    { title: t("Voqea joyi poligoni", "Полигон места происшествия", "Crime-scene training ground"), description: t("O'quv voqea joyida izlarni topish, olish va qadoqlash.", "Поиск, изъятие и упаковка следов на учебном месте происшествия.", "Finding, seizing and packaging traces at a mock scene.") },
    { title: t("Laboratoriya amaliyoti", "Лабораторная практика", "Laboratory placement"), description: t("Ekspert-murabbiy rahbarligida tadqiqotlar.", "Исследования под руководством эксперта-наставника.", "Examinations under an expert mentor.") },
    { title: t("Kasb simulyatori", "Профессиональный симулятор", "Profession simulator"), description: t("Virtual voqea joyi: izlar, qadoqlash, saqlanish zanjiri va xulosa.", "Виртуальное место происшествия: следы, упаковка, цепочка хранения, заключение.", "Virtual scene: traces, packaging, chain of custody and report.") },
  ],
  legalBasis: [
    { title: t("«Sud-ekspertlik faoliyati to'g'risida»gi Qonun", "Закон «О судебно-экспертной деятельности»", "Law on Forensic Expert Activity") },
    { title: t("Jinoyat-protsessual kodeksi", "Уголовно-процессуальный кодекс", "Criminal Procedure Code") },
    { lawKey: "jpkInspection" },
    { lawKey: "jpkVideo" },
  ],
  assessment: [
    t("Kasb simulyatori natijalari", "Результаты профессионального симулятора", "Profession simulator results"),
    t("Poligonda qadoqlash va zanjir xatolari soni", "Количество ошибок упаковки и цепочки на полигоне", "Packaging and chain-of-custody errors on the ground"),
    t("Xulosalarning takroriy ekspertizada tasdiqlanishi", "Подтверждение заключений повторными экспертизами", "Confirmation of reports by repeat examinations"),
    t("Attestatsiya komissiyasi bahosi", "Оценка аттестационной комиссии", "Certification board assessment"),
  ],
  career: [
    { title: t("Ekspert yordamchisi", "Помощник эксперта", "Expert assistant"), requirement: t("Maxsus tayyorgarlik", "Специальная подготовка", "Specialist training") },
    { title: t("Ekspert", "Эксперт", "Expert"), requirement: t("Ekspert huquqini olish", "Получение права производства экспертиз", "Licence to perform examinations") },
    { title: t("Katta ekspert", "Старший эксперт", "Senior expert"), requirement: t("«Ilg'or» daraja, kompleks ekspertizalar", "Уровень «Продвинутый», комплексные экспертизы", "«Advanced» level, complex examinations") },
    { title: t("Bosh ekspert", "Главный эксперт", "Chief expert"), requirement: t("«Ekspert» daraja, metodik ishlar", "Уровень «Экспертный», методическая работа", "«Expert» level, methodological work") },
    { title: t("Ekspert-kriminalistika bo'linmasi boshlig'i", "Начальник экспертно-криминалистического подразделения", "Head of forensic unit"), requirement: t("Boshqaruv kursi", "Курс управления", "Management course") },
  ],
  clusters: ["kriminalistika", "protsessual", "huquqiy", "analitika"],
  trainers: [],
};
