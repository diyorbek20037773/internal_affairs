import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const surishtiruvchi: ProfessionStandard = {
  id: "surishtiruvchi",
  agencies: ["iiv"],
  icon: "ClipboardList",
  title: t("Surishtiruvchi", "Дознаватель", "Inquiry officer"),
  short: t(
    "Ariza va xabarlarni qabul qiladi, tergovga qadar tekshiruv va surishtiruvni qonuniy muddatlarda o'tkazadi.",
    "Принимает заявления и сообщения, проводит доследственную проверку и дознание в установленные сроки.",
    "Receives reports and conducts pre-investigation checks and inquiries within statutory deadlines."
  ),
  functions: [
    {
      id: "su-f1",
      title: t("Ariza va xabarlarni qabul qilish", "Приём заявлений и сообщений", "Receiving reports"),
      tasks: [
        t("Arizani to'liq qabul qilish va darhol ro'yxatga olish", "Полный приём заявления и немедленная регистрация", "Taking the full report and registering it immediately"),
        t("Arizachiga huquqlarini va ko'rib chiqish tartibini tushuntirish", "Разъяснение заявителю прав и порядка рассмотрения", "Explaining rights and the review procedure to the applicant"),
        t("Kechiktirib bo'lmaydigan choralarni belgilash (voqea joyi, tibbiy yordam)", "Определение неотложных мер (место происшествия, медпомощь)", "Setting urgent measures (scene, medical aid)"),
      ],
    },
    {
      id: "su-f2",
      title: t("Tergovga qadar tekshiruv", "Доследственная проверка", "Pre-investigation check"),
      tasks: [
        t("Tushuntirish xatlarini olish va hujjatlarni so'rab olish", "Получение объяснений и истребование документов", "Taking statements and requesting documents"),
        t("Qilmishni dastlabki kvalifikatsiya qilish (jinoyat yoki ma'muriy huquqbuzarlik)", "Предварительная квалификация деяния (преступление или административное правонарушение)", "Preliminary qualification (crime or administrative offence)"),
        t("Tegishliligi bo'yicha yuborish yoki ish qo'zg'atish to'g'risida qaror loyihasini tayyorlash", "Подготовка решения о передаче по подследственности или возбуждении дела", "Preparing a transfer or case-opening decision"),
        t("Qonuniy muddat ichida yakuniy qaror qabul qilish", "Принятие итогового решения в установленный срок", "Reaching the final decision within the statutory term"),
      ],
    },
    {
      id: "su-f3",
      title: t("Surishtiruv yuritish", "Производство дознания", "Conducting an inquiry"),
      tasks: [
        t("Surishtiruv rejasini tuzish va kechiktirib bo'lmaydigan tergov harakatlarini o'tkazish", "Составление плана дознания и проведение неотложных следственных действий", "Planning the inquiry and carrying out urgent investigative actions"),
        t("Dalillarni qayd etish va saqlash", "Фиксация и сохранение доказательств", "Recording and preserving evidence"),
        t("Ishni tergovchiga yoki prokurorga o'z vaqtida topshirish", "Своевременная передача дела следователю или прокурору", "Handing the case to the investigator or prosecutor on time"),
      ],
    },
  ],
  knowledge: [
    t("Ariza va xabarlarni ro'yxatga olish va ko'rib chiqish tartibi", "Порядок регистрации и рассмотрения заявлений и сообщений", "Rules on registering and reviewing reports"),
    t("Jinoyat va ma'muriy huquqbuzarlik tarkiblarining farqlari", "Разграничение составов преступлений и административных правонарушений", "Distinguishing crimes from administrative offences"),
    t("Tergovga qadar tekshiruv va surishtiruv muddatlari", "Сроки доследственной проверки и дознания", "Pre-investigation and inquiry deadlines"),
    t("Tergovga tegishlilik (podsledstvennost) qoidalari", "Правила подследственности", "Rules of investigative jurisdiction"),
    t("Tushuntirish xati, bayonnoma va qarorlarning shakl talablari", "Требования к форме объяснений, протоколов и постановлений", "Form requirements for statements, records and decisions"),
    t("Jabrlanuvchi va arizachi huquqlari", "Права потерпевшего и заявителя", "Rights of victims and applicants"),
    t("Murojaatlar to'g'risidagi qonunchilik", "Законодательство об обращениях", "Legislation on appeals"),
  ],
  skills: [
    t("Arizachidan faktlarni to'liq va xolis so'rab olish", "Полное и объективное выяснение фактов у заявителя", "Eliciting complete, objective facts from the applicant"),
    t("Qilmishni tez va to'g'ri kvalifikatsiya qilish", "Быстрая и верная квалификация деяния", "Quick and accurate qualification"),
    t("Muddatlarni kalendar asosida hisoblash va nazorat qilish", "Расчёт и контроль сроков по календарю", "Calculating and tracking deadlines"),
    t("Protsessual qarorlarni asosli yozish", "Обоснованное написание процессуальных решений", "Writing reasoned procedural decisions"),
    t("Bir vaqtda ko'p materiallarni ustuvorlik bo'yicha yuritish", "Ведение множества материалов по приоритету", "Managing many files by priority"),
    t("Navbatchilik qismi va xizmatlar bilan tezkor aloqa", "Оперативная связь с дежурной частью и службами", "Rapid coordination with the duty desk and services"),
  ],
  competencies: [
    {
      id: "surishtiruvchi.qabul",
      label: t("Ariza qabul qilish", "Приём заявлений", "Report intake"),
      description: t("Arizani rad etmasdan to'liq qabul qilish, ro'yxatga olish va arizachiga tushuntirish berish.", "Полный приём заявления без отказа, регистрация и разъяснения заявителю.", "Taking every report without refusal, registering it and informing the applicant."),
      clusters: ["protsessual", "maxsus"],
      subjects: ["pr-01", "huq-07", "mx-02"],
    },
    {
      id: "surishtiruvchi.malaka",
      label: t("Kvalifikatsiya", "Квалификация", "Legal qualification"),
      description: t("Qilmish belgilarini aniqlab, uni jinoyat yoki ma'muriy huquqbuzarlik sifatida to'g'ri baholash.", "Выявление признаков деяния и верная оценка как преступления или административного правонарушения.", "Identifying the features of an act and correctly classifying it as a crime or an administrative offence."),
      clusters: ["huquqiy"],
      subjects: ["huq-02", "huq-03"],
    },
    {
      id: "surishtiruvchi.protsessual",
      label: t("Protsessual harakatlar", "Процессуальные действия", "Procedural actions"),
      description: t("Tekshiruv va surishtiruv harakatlarini qonuniy shaklda va to'g'ri ketma-ketlikda bajarish.", "Выполнение проверочных действий и дознания в законной форме и верной последовательности.", "Performing check and inquiry actions lawfully and in the right order."),
      clusters: ["protsessual", "huquqiy"],
      subjects: ["pr-02", "huq-04", "pr-03"],
    },
    {
      id: "surishtiruvchi.muddat",
      label: t("Muddatlarga rioya", "Соблюдение сроков", "Deadline control"),
      description: t("Tekshiruv, surishtiruv va javob berish muddatlarini to'g'ri hisoblash va buzmaslik.", "Верный расчёт и соблюдение сроков проверки, дознания и ответа.", "Correctly calculating and meeting check, inquiry and response deadlines."),
      clusters: ["protsessual"],
      subjects: ["pr-06", "pr-01"],
    },
    {
      id: "surishtiruvchi.hujjat",
      label: t("Hujjatlashtirish", "Документирование", "Documentation"),
      description: t("Tushuntirish xati, bayonnoma va qarorlarni to'liq, izchil va asosli rasmiylashtirish.", "Полное, последовательное и обоснованное оформление объяснений, протоколов и постановлений.", "Complete, coherent, reasoned statements, records and decisions."),
      clusters: ["protsessual"],
      subjects: ["pr-04", "pr-07"],
    },
  ],
  levels: levels([
    t("Arizalarni namunaga qarab qabul qiladi, murakkab holatlarda rahbarga murojaat qiladi.", "Принимает заявления по образцу, в сложных случаях обращается к руководителю.", "Takes reports from templates and escalates complex cases."),
    t("Tekshiruv materiallarini mustaqil yuritadi, muddatlarni buzmaydi.", "Самостоятельно ведёт материалы проверки, не нарушает сроки.", "Independently runs check files without missing deadlines."),
    t("Murakkab kvalifikatsiya holatlarini hal qiladi, surishtiruvni to'liq yuritadi.", "Разрешает сложные вопросы квалификации, полностью ведёт дознание.", "Resolves hard qualification cases and runs full inquiries."),
    t("Bo'lim amaliyotini tahlil qiladi, xatolarning oldini olish bo'yicha yo'riqnoma beradi.", "Анализирует практику подразделения, даёт рекомендации по предупреждению ошибок.", "Reviews unit practice and issues guidance to prevent errors."),
  ]),
  education: [
    t("Oliy yuridik ta'lim", "Высшее юридическое образование", "Higher legal education"),
    t("Surishtiruvchilar uchun maxsus kurs", "Специальный курс для дознавателей", "Specialised inquiry-officer course"),
    t("Ish yuritish va raqamli tizimlar bo'yicha malaka oshirish", "Повышение квалификации по делопроизводству и цифровым системам", "Refresher training in case management and digital systems"),
  ],
  practice: [
    { title: t("Navbatchilik qismida stajirovka", "Стажировка в дежурной части", "Duty-desk internship"), description: t("Ariza qabul qilish va ro'yxatga olishning real oqimi.", "Реальный поток приёма и регистрации заявлений.", "The real flow of receiving and registering reports.") },
    { title: t("Tekshiruv materiallari praktikumi", "Практикум по материалам проверки", "Check-file workshop"), description: t("O'quv arizalar bo'yicha kvalifikatsiya va qaror loyihalari.", "Квалификация и проекты решений по учебным заявлениям.", "Qualification and draft decisions on training reports.") },
    { title: t("Kasb simulyatori", "Профессиональный симулятор", "Profession simulator"), description: t("Navbatchilik stoli muhitida arizalar oqimi, muddatlar va hujjatlar.", "Поток заявлений, сроки и документы в среде дежурного стола.", "Report flow, deadlines and documents at a simulated duty desk.") },
  ],
  legalBasis: [
    { lawKey: "jpkRegister" },
    { title: t("Jinoyat-protsessual kodeksi", "Уголовно-процессуальный кодекс", "Criminal Procedure Code") },
    { title: t("Jinoyat kodeksi", "Уголовный кодекс", "Criminal Code") },
    { lawKey: "mjtkProtocol" },
    { lawKey: "mjtkConsideration" },
    { lawKey: "lawAppeals" },
  ],
  assessment: [
    t("Kasb simulyatori natijalari", "Результаты профессионального симулятора", "Profession simulator results"),
    t("Muddatlari buzilgan materiallar ulushi", "Доля материалов с нарушенными сроками", "Share of files with missed deadlines"),
    t("Prokuror tomonidan bekor qilingan qarorlar soni", "Количество решений, отменённых прокурором", "Number of decisions overturned by the prosecutor"),
    t("Hujjatlar sifati bo'yicha rahbar bahosi", "Оценка руководителем качества документов", "Supervisor's assessment of document quality"),
  ],
  career: [
    { title: t("Surishtiruvchi-stajyor", "Дознаватель-стажёр", "Trainee inquiry officer"), requirement: t("Maxsus kurs", "Спецкурс", "Specialised course") },
    { title: t("Surishtiruvchi", "Дознаватель", "Inquiry officer"), requirement: t("«Asosiy» daraja, attestatsiya", "Уровень «Базовый», аттестация", "«Core» level, certification") },
    { title: t("Katta surishtiruvchi", "Старший дознаватель", "Senior inquiry officer"), requirement: t("«Ilg'or» daraja, 2 yil tajriba", "Уровень «Продвинутый», 2 года стажа", "«Advanced» level, 2 years' service") },
    { title: t("Tergovchi", "Следователь", "Investigator"), requirement: t("Tergov kursi, «Ilg'or» daraja", "Курс следствия, уровень «Продвинутый»", "Investigator course, «Advanced» level") },
    { title: t("Surishtiruv bo'limi boshlig'i", "Начальник отдела дознания", "Head of inquiry unit"), requirement: t("«Ekspert» daraja, boshqaruv kursi", "Уровень «Экспертный», курс управления", "«Expert» level, management course") },
  ],
  clusters: ["protsessual", "huquqiy", "maxsus"],
  trainers: ["/simulyator/hujjat", "/simulyator/muloqot"],
};
