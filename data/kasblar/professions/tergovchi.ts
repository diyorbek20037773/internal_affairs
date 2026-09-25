import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const tergovchi: ProfessionStandard = {
  id: "tergovchi",
  agencies: ["iiv"],
  icon: "FileSearch",
  title: t("Tergovchi", "Следователь", "Investigator"),
  short: t(
    "Jinoyat ishlari bo'yicha dastlabki tergovni yuritadi: dalillarni to'playdi, tergov harakatlarini o'tkazadi va ishni sudga tayyorlaydi.",
    "Ведёт предварительное следствие по уголовным делам: собирает доказательства, проводит следственные действия и готовит дело для суда.",
    "Conducts preliminary investigations: gathers evidence, performs investigative actions and prepares the case for court."
  ),
  functions: [
    {
      id: "tg-f1",
      title: t("Jinoyat ishini qo'zg'atish va tergovni rejalashtirish", "Возбуждение уголовного дела и планирование расследования", "Opening a case and planning the investigation"),
      tasks: [
        t("Tergovga qadar tekshiruv materiallarini baholash va ish qo'zg'atish asoslarini aniqlash", "Оценка материалов доследственной проверки и оснований для возбуждения дела", "Assessing pre-investigation material and grounds to open a case"),
        t("Tergov versiyalarini ilgari surish va tergov rejasini tuzish", "Выдвижение следственных версий и составление плана расследования", "Formulating hypotheses and an investigation plan"),
        t("Tezkor bo'linmalar va ekspertlarga topshiriqlar berish", "Поручения оперативным подразделениям и экспертам", "Tasking operational units and experts"),
      ],
    },
    {
      id: "tg-f2",
      title: t("Dalillarni to'plash va mustahkamlash", "Собирание и закрепление доказательств", "Gathering and securing evidence"),
      tasks: [
        t("Voqea joyini ko'zdan kechirish va ashyoviy dalillarni olish", "Осмотр места происшествия и изъятие вещественных доказательств", "Examining the scene and seizing physical evidence"),
        t("Ekspertiza tayinlash va xulosani baholash", "Назначение экспертизы и оценка заключения", "Ordering examinations and evaluating reports"),
        t("Dalillarning maqbulligi, ishonchliligi va yetarliligini tekshirish", "Проверка допустимости, достоверности и достаточности доказательств", "Checking admissibility, reliability and sufficiency of evidence"),
        t("Raqamli dalillarni qonuniy tartibda olish", "Законное изъятие цифровых доказательств", "Lawfully obtaining digital evidence"),
      ],
    },
    {
      id: "tg-f3",
      title: t("Tergov harakatlarini o'tkazish", "Проведение следственных действий", "Conducting investigative actions"),
      tasks: [
        t("Guvoh, jabrlanuvchi va gumon qilinuvchini so'roq qilish", "Допрос свидетелей, потерпевших и подозреваемых", "Interviewing witnesses, victims and suspects"),
        t("Tintuv, olib qo'yish va yuzlashtirishni tashkil etish", "Организация обыска, выемки и очной ставки", "Organising searches, seizures and confrontations"),
        t("Ishtirokchilarning protsessual huquqlarini tushuntirish va ta'minlash", "Разъяснение и обеспечение процессуальных прав участников", "Explaining and securing participants' procedural rights"),
      ],
    },
    {
      id: "tg-f4",
      title: t("Tergovni yakunlash", "Окончание расследования", "Completing the investigation"),
      tasks: [
        t("To'plangan dalillarni tahlil qilib, ayblov qo'yish yoki ishni tugatish to'g'risida qaror qabul qilish", "Анализ доказательств и решение о предъявлении обвинения или прекращении дела", "Analysing evidence and deciding to charge or terminate"),
        t("Ayblov xulosasini tuzish", "Составление обвинительного заключения", "Drafting the indictment"),
        t("Ish materiallarini tartibga keltirish va prokurorga yuborish", "Систематизация материалов дела и направление прокурору", "Organising the case file and sending it to the prosecutor"),
      ],
    },
  ],
  knowledge: [
    t("Jinoyat huquqi: jinoyat tarkibi, kvalifikatsiya qoidalari", "Уголовное право: состав преступления, правила квалификации", "Criminal law: elements of crime, qualification rules"),
    t("Jinoyat-protsessual qonunchiligi: dalillar, tergov harakatlari, muddatlar", "Уголовно-процессуальное законодательство: доказательства, следственные действия, сроки", "Criminal procedure: evidence, investigative actions, deadlines"),
    t("Kriminalistik taktika va jinoyatlarni tergov qilish metodikasi", "Криминалистическая тактика и методика расследования", "Forensic tactics and investigation methodology"),
    t("Ekspertiza turlari va ekspert oldiga savol qo'yish qoidalari", "Виды экспертиз и правила постановки вопросов эксперту", "Types of examinations and framing questions for experts"),
    t("Tergov jarayonida inson huquqlari kafolatlari", "Гарантии прав человека в ходе следствия", "Human-rights safeguards during investigation"),
    t("Raqamli dalillar bilan ishlash asoslari", "Основы работы с цифровыми доказательствами", "Fundamentals of digital evidence"),
    t("Tergov psixologiyasi asoslari", "Основы следственной психологии", "Investigative psychology"),
  ],
  skills: [
    t("Tergov versiyalarini ilgari surish va tekshirish", "Выдвижение и проверка следственных версий", "Building and testing hypotheses"),
    t("So'roqni taktik jihatdan to'g'ri rejalashtirish va o'tkazish", "Тактически грамотное планирование и проведение допроса", "Planning and conducting tactically sound interviews"),
    t("Dalillar o'rtasidagi ziddiyatlarni aniqlash", "Выявление противоречий между доказательствами", "Spotting contradictions between pieces of evidence"),
    t("Protsessual hujjatlarni aniq va asosli tuzish", "Точное и обоснованное составление процессуальных документов", "Drafting precise, reasoned procedural documents"),
    t("Muddatlarni nazorat qilish va ish yuritishni rejalashtirish", "Контроль сроков и планирование производства", "Tracking deadlines and planning case work"),
    t("Tezkor bo'linmalar va ekspertlar bilan o'zaro hamkorlik", "Взаимодействие с оперативными подразделениями и экспертами", "Working with operational units and experts"),
    t("Katta hajmdagi ma'lumotlarni tahlil qilish", "Анализ больших объёмов информации", "Analysing large volumes of information"),
  ],
  competencies: [
    {
      id: "tergovchi.protsessual",
      label: t("Protsessual qonuniylik", "Процессуальная законность", "Procedural legality"),
      description: t("Har bir harakat protsessual shaklga, muddat va ishtirokchilar huquqlariga mos bo'lishi.", "Соответствие каждого действия процессуальной форме, срокам и правам участников.", "Every action complies with procedural form, deadlines and participants' rights."),
      clusters: ["protsessual", "huquqiy"],
      subjects: ["huq-04", "pr-02", "pr-06"],
    },
    {
      id: "tergovchi.dalil",
      label: t("Dalillar bilan ishlash", "Работа с доказательствами", "Evidence handling"),
      description: t("Dalillarni to'plash, qayd etish, baholash va ularning maqbulligini ta'minlash.", "Собирание, фиксация, оценка доказательств и обеспечение их допустимости.", "Collecting, recording, evaluating evidence and ensuring admissibility."),
      clusters: ["kriminalistika", "protsessual"],
      subjects: ["krim-04", "krim-06", "krim-05"],
    },
    {
      id: "tergovchi.taktika",
      label: t("Tergov taktikasi", "Следственная тактика", "Investigative tactics"),
      description: t("So'roq, tintuv, yuzlashtirish va boshqa harakatlarni to'g'ri ketma-ketlikda va taktik asosda o'tkazish.", "Проведение допроса, обыска, очной ставки и др. в верной последовательности и тактически обоснованно.", "Interviews, searches, confrontations in the right order and on sound tactics."),
      clusters: ["kriminalistika", "protsessual"],
      subjects: ["krim-02", "pr-03", "krim-03"],
    },
    {
      id: "tergovchi.tahlil",
      label: t("Versiyalar va tahlil", "Версии и анализ", "Hypotheses and analysis"),
      description: t("Ma'lumotlardan tergov versiyalarini chiqarish, ziddiyatlarni topish, xulosani asoslash.", "Построение версий из информации, выявление противоречий, обоснование выводов.", "Deriving hypotheses, finding contradictions, justifying conclusions."),
      clusters: ["analitika", "kriminalistika"],
      subjects: ["krim-02", "an-02", "an-04"],
    },
    {
      id: "tergovchi.hujjat",
      label: t("Protsessual hujjatlar", "Процессуальные документы", "Procedural documents"),
      description: t("Bayonnoma, qaror va ayblov xulosasini to'liq, izchil va asosli rasmiylashtirish.", "Полное, последовательное и обоснованное оформление протоколов, постановлений и обвинительного заключения.", "Complete, coherent, reasoned records, decisions and indictments."),
      clusters: ["protsessual"],
      subjects: ["pr-04", "pr-06", "huq-04"],
    },
  ],
  levels: levels([
    t("Alohida tergov harakatlarini rahbar topshirig'i bilan bajaradi.", "Выполняет отдельные следственные действия по поручению руководителя.", "Performs individual investigative actions on assignment."),
    t("Oddiy va o'rta og'irlikdagi ishlarni mustaqil yuritadi.", "Самостоятельно ведёт дела небольшой и средней тяжести.", "Independently runs less serious and mid-level cases."),
    t("Og'ir va ko'p epizodli ishlarni yuritadi, tergov guruhini muvofiqlashtiradi.", "Ведёт тяжкие и многоэпизодные дела, координирует следственную группу.", "Runs serious, multi-episode cases and coordinates an investigative team."),
    t("Murakkab ishlar bo'yicha metodik yordam beradi, tergovchilarga murabbiylik qiladi.", "Оказывает методическую помощь по сложным делам, наставляет следователей.", "Provides methodological support on complex cases and mentors investigators."),
  ]),
  education: [
    t("Oliy yuridik ta'lim", "Высшее юридическое образование", "Higher legal education"),
    t("Tergovchilar uchun maxsus kasbiy tayyorgarlik kursi", "Курс специальной подготовки следователей", "Specialised investigator course"),
    t("Kriminalistika va raqamli dalillar bo'yicha malaka oshirish", "Повышение квалификации по криминалистике и цифровым доказательствам", "Refresher training in forensics and digital evidence"),
  ],
  practice: [
    { title: t("Tergov bo'limida stajirovka", "Стажировка в следственном отделе", "Investigation unit internship"), description: t("Tajribali tergovchi bilan real ish materiallarida ishlash.", "Работа с материалами реальных дел рядом с опытным следователем.", "Working real case files alongside an experienced investigator.") },
    { title: t("O'quv jinoyat ishi", "Учебное уголовное дело", "Training criminal case"), description: t("Ishni qo'zg'atishdan ayblov xulosasigacha to'liq sikl.", "Полный цикл от возбуждения до обвинительного заключения.", "Full cycle from opening the case to the indictment.") },
    { title: t("Kasb simulyatori", "Профессиональный симулятор", "Profession simulator"), description: t("Ish materiallari muhitida versiyalar, dalillar va so'roq taktikasi bo'yicha topshiriqlar.", "Задания по версиям, доказательствам и тактике допроса в среде материалов дела.", "Tasks on hypotheses, evidence and interview tactics in a case-file environment.") },
  ],
  legalBasis: [
    { title: t("Jinoyat-protsessual kodeksi", "Уголовно-процессуальный кодекс", "Criminal Procedure Code") },
    { title: t("Jinoyat kodeksi", "Уголовный кодекс", "Criminal Code") },
    { lawKey: "jpkRegister" },
    { lawKey: "jpkInspection" },
    { lawKey: "jpkVideo" },
    { title: t("«Sud-ekspertlik faoliyati to'g'risida»gi Qonun", "Закон «О судебно-экспертной деятельности»", "Law on Forensic Expert Activity") },
    { lawKey: "lawPolice" },
  ],
  assessment: [
    t("Kasb simulyatori natijalari (5 kompetensiya bo'yicha)", "Результаты профессионального симулятора (по 5 компетенциям)", "Profession simulator results (5 competencies)"),
    t("O'quv jinoyat ishi materiallarining sifati", "Качество материалов учебного уголовного дела", "Quality of the training case file"),
    t("Prokuror tomonidan qaytarilgan ishlar ulushi", "Доля дел, возвращённых прокурором", "Share of cases returned by the prosecutor"),
    t("Rahbar va murabbiy bahosi", "Оценка руководителя и наставника", "Supervisor and mentor assessment"),
  ],
  career: [
    { title: t("Tergovchi-stajyor", "Следователь-стажёр", "Trainee investigator"), requirement: t("Maxsus kurs, stajirovka", "Спецкурс, стажировка", "Specialised course, internship") },
    { title: t("Tergovchi", "Следователь", "Investigator"), requirement: t("«Asosiy» daraja, attestatsiya", "Уровень «Базовый», аттестация", "«Core» level, certification") },
    { title: t("Katta tergovchi", "Старший следователь", "Senior investigator"), requirement: t("«Ilg'or» daraja, og'ir ishlar tajribasi", "Уровень «Продвинутый», опыт тяжких дел", "«Advanced» level, serious-case record") },
    { title: t("Muhim ishlar bo'yicha tergovchi", "Следователь по особо важным делам", "Investigator for high-profile cases"), requirement: t("«Ekspert» daraja", "Уровень «Экспертный»", "«Expert» level") },
    { title: t("Tergov bo'limi boshlig'i", "Начальник следственного отдела", "Head of investigation unit"), requirement: t("Boshqaruv kursi, murabbiylik", "Курс управления, наставничество", "Management course, mentoring") },
  ],
  clusters: ["protsessual", "kriminalistika", "huquqiy", "analitika"],
  trainers: ["/simulyator/qaror", "/simulyator/hujjat"],
};
