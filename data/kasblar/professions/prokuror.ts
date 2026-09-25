import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const prokuror: ProfessionStandard = {
  id: "prokuror",
  agencies: ["prokuratura"],
  icon: "Gavel",
  title: t("Prokuror yordamchisi", "Помощник прокурора", "Assistant prosecutor"),
  short: t(
    "Tergovga qadar tekshiruv, surishtiruv va tergov qonuniyligini nazorat qiladi, fuqarolar huquqlarini himoya qiladi va asosli prokuror hujjatlarini tayyorlaydi.",
    "Надзирает за законностью доследственной проверки, дознания и следствия, защищает права граждан и готовит обоснованные акты прокурорского реагирования.",
    "Oversees the legality of pre-investigation checks, inquiries and investigations, protects citizens' rights and drafts reasoned prosecutorial acts."
  ),
  functions: [
    {
      id: "pk-f1",
      title: t("Tergov va surishtiruv ustidan nazorat", "Надзор за следствием и дознанием", "Oversight of investigation and inquiry"),
      tasks: [
        t("Ariza va xabarlarning ro'yxatga olinishi va ko'rib chiqilishini tekshirish", "Проверка регистрации и рассмотрения заявлений и сообщений", "Checking registration and review of reports"),
        t("Ish qo'zg'atish, rad etish va tugatish qarorlarining qonuniyligini baholash", "Оценка законности решений о возбуждении, отказе и прекращении", "Assessing the legality of decisions to open, refuse or close cases"),
        t("Protsessual muddatlarga rioya etilishini nazorat qilish", "Контроль соблюдения процессуальных сроков", "Monitoring procedural deadlines"),
        t("Qonunga zid qarorlarni bekor qilish yoki ko'rsatma berish bo'yicha taklif tayyorlash", "Подготовка предложений об отмене незаконных решений или указаниях", "Proposing annulment of unlawful decisions or instructions"),
      ],
    },
    {
      id: "pk-f2",
      title: t("Inson huquqlari va erkinliklarini himoya qilish", "Защита прав и свобод человека", "Protecting human rights"),
      tasks: [
        t("Ushlab turish va ehtiyot choralari qonuniyligini tekshirish", "Проверка законности задержания и мер пресечения", "Checking the legality of detention and preventive measures"),
        t("Fuqarolar shikoyatlarini ko'rib chiqish", "Рассмотрение жалоб граждан", "Reviewing citizens' complaints"),
        t("Ishtirokchilarning himoya huquqi ta'minlanganligini tekshirish", "Проверка обеспечения права на защиту", "Verifying the right to defence is secured"),
      ],
    },
    {
      id: "pk-f3",
      title: t("Ish materiallarini o'rganish va xulosa", "Изучение материалов дела и заключение", "Case review and conclusion"),
      tasks: [
        t("Ayblov xulosasi bilan kelgan ishni to'liq o'rganish", "Полное изучение дела с обвинительным заключением", "Reviewing the full case file with the indictment"),
        t("Dalillar yetarliligi va maqbulligini baholash", "Оценка достаточности и допустимости доказательств", "Assessing sufficiency and admissibility of evidence"),
        t("Ishni sudga yuborish yoki qo'shimcha tergovga qaytarish bo'yicha asosli xulosa", "Обоснованное заключение о направлении в суд или возврате на дополнительное расследование", "Reasoned opinion on sending to court or returning for further investigation"),
      ],
    },
    {
      id: "pk-f4",
      title: t("Prokuror ta'sir choralari hujjatlari", "Акты прокурорского реагирования", "Prosecutorial response acts"),
      tasks: [
        t("Taqdimnoma, protest va ko'rsatma loyihalarini tayyorlash", "Подготовка проектов представлений, протестов и указаний", "Drafting submissions, protests and instructions"),
        t("Hujjatda qonun buzilishini aniq ko'rsatish va huquqiy asoslash", "Чёткое указание нарушения и его правовое обоснование", "Stating the violation clearly with legal grounds"),
        t("Ko'rilgan choralar ijrosini nazorat qilish", "Контроль исполнения принятых мер", "Monitoring implementation of measures"),
      ],
    },
  ],
  knowledge: [
    t("Prokuratura faoliyati va prokuror nazorati asoslari", "Основы деятельности прокуратуры и прокурорского надзора", "The prosecution service and prosecutorial oversight"),
    t("Jinoyat va jinoyat-protsessual qonunchiligi", "Уголовное и уголовно-процессуальное законодательство", "Criminal and criminal-procedure law"),
    t("Dalillar nazariyasi: maqbullik, ishonchlilik, yetarlilik", "Теория доказательств: допустимость, достоверность, достаточность", "Evidence theory: admissibility, reliability, sufficiency"),
    t("Ehtiyot choralari va ushlab turish qonuniyligi mezonlari", "Критерии законности задержания и мер пресечения", "Legality criteria for detention and preventive measures"),
    t("Xalqaro inson huquqlari standartlari", "Международные стандарты прав человека", "International human-rights standards"),
    t("Prokuror hujjatlarining shakl va mazmun talablari", "Требования к форме и содержанию актов прокурора", "Form and content of prosecutorial acts"),
    t("Murojaatlarni ko'rib chiqish tartibi", "Порядок рассмотрения обращений", "Procedure for handling appeals"),
  ],
  skills: [
    t("Ish materiallaridagi protsessual buzilishlarni aniqlash", "Выявление процессуальных нарушений в материалах дела", "Spotting procedural violations in case files"),
    t("Muddatlarni tez hisoblash va buzilishni qayd etish", "Быстрый расчёт сроков и фиксация нарушений", "Quick deadline checks and recording breaches"),
    t("Dalillarni tanqidiy baholash", "Критическая оценка доказательств", "Critical assessment of evidence"),
    t("Qisqa va huquqiy asosli prokuror hujjatini yozish", "Написание краткого и правово обоснованного акта", "Writing concise, legally grounded acts"),
    t("Tergovchi bilan professional muloqot", "Профессиональное взаимодействие со следователем", "Professional dealings with investigators"),
    t("Mustaqil va xolis pozitsiyani saqlash", "Сохранение независимой и объективной позиции", "Maintaining independence and objectivity"),
  ],
  competencies: [
    {
      id: "prokuror.nazorat",
      label: t("Nazorat", "Надзор", "Oversight"),
      description: t("Tergov organlari faoliyatida qonun buzilishini o'z vaqtida aniqlash.", "Своевременное выявление нарушений закона в деятельности органов расследования.", "Timely detection of violations by investigative bodies."),
      clusters: ["protsessual", "huquqiy"],
      subjects: ["pr-05", "huq-05", "pr-06"],
    },
    {
      id: "prokuror.protsessual",
      label: t("Protsessual tahlil", "Процессуальный анализ", "Procedural analysis"),
      description: t("Protsessual qarorlar, muddatlar va dalillarning qonuniyligini baholash.", "Оценка законности процессуальных решений, сроков и доказательств.", "Assessing the legality of procedural decisions, deadlines and evidence."),
      clusters: ["protsessual", "huquqiy"],
      subjects: ["huq-04", "pr-02", "pr-06"],
    },
    {
      id: "prokuror.huquq_himoya",
      label: t("Huquqlarni himoya qilish", "Защита прав", "Rights protection"),
      description: t("Ushlab turish, ehtiyot choralari va himoya huquqi kafolatlariga rioya etilishini ta'minlash.", "Обеспечение гарантий при задержании, мерах пресечения и праве на защиту.", "Upholding safeguards on detention, preventive measures and the right to defence."),
      clusters: ["huquqiy"],
      subjects: ["huq-01", "huq-04", "huq-07"],
    },
    {
      id: "prokuror.xulosa",
      label: t("Prokuror xulosasi", "Заключение прокурора", "Prosecutorial conclusion"),
      description: t("Ish bo'yicha dalillarga asoslangan, izchil xulosa chiqarish.", "Последовательный вывод по делу, основанный на доказательствах.", "A coherent, evidence-based conclusion on the case."),
      clusters: ["protsessual", "analitika"],
      subjects: ["pr-05", "krim-02", "an-04"],
    },
    {
      id: "prokuror.hujjat",
      label: t("Prokuror hujjatlari", "Акты прокурора", "Prosecutorial acts"),
      description: t("Taqdimnoma, protest va ko'rsatmalarni aniq, qisqa va asosli yozish.", "Точное, краткое и обоснованное составление представлений, протестов и указаний.", "Precise, concise, reasoned submissions, protests and instructions."),
      clusters: ["protsessual"],
      subjects: ["pr-04", "pr-05"],
    },
  ],
  levels: levels([
    t("Prokuror topshirig'i bilan ish materiallarini o'rganadi va ma'lumotnoma tayyorlaydi.", "По поручению прокурора изучает материалы и готовит справки.", "Reviews files and prepares notes on the prosecutor's instructions."),
    t("Tergov va surishtiruv ustidan nazoratni mustaqil olib boradi.", "Самостоятельно осуществляет надзор за следствием и дознанием.", "Independently oversees investigations and inquiries."),
    t("Murakkab ishlar bo'yicha nazorat va sudda ayblovni qo'llab-quvvatlaydi.", "Надзирает по сложным делам и поддерживает обвинение в суде.", "Oversees complex cases and prosecutes in court."),
    t("Nazorat amaliyotini umumlashtiradi, yosh prokurorlarga murabbiylik qiladi.", "Обобщает надзорную практику, наставляет молодых прокуроров.", "Synthesises oversight practice and mentors junior prosecutors."),
  ]),
  education: [
    t("Oliy yuridik ta'lim", "Высшее юридическое образование", "Higher legal education"),
    t("Prokuratura akademiyasida boshlang'ich tayyorgarlik", "Первоначальная подготовка в Академии прокуратуры", "Initial training at the Prosecution Academy"),
    t("Muntazam malaka oshirish va attestatsiya", "Регулярное повышение квалификации и аттестация", "Regular refresher training and certification"),
  ],
  practice: [
    { title: t("Tuman prokuraturasida stajirovka", "Стажировка в районной прокуратуре", "District prosecutor's office internship"), description: t("Ish materiallarini tekshirish va hujjat loyihalarini tayyorlash.", "Проверка материалов и подготовка проектов актов.", "Reviewing files and drafting acts.") },
    { title: t("O'quv sud jarayoni", "Учебный судебный процесс", "Moot court"), description: t("Davlat ayblovini qo'llab-quvvatlash mashqi.", "Упражнение по поддержанию государственного обвинения.", "Exercise in presenting the state's case.") },
    { title: t("Kasb simulyatori", "Профессиональный симулятор", "Profession simulator"), description: t("Ish materiallarini tekshirish: buzilishlar, muddatlar va prokuror hujjati.", "Проверка материалов: нарушения, сроки и акт прокурора.", "Case review: violations, deadlines and the prosecutorial act.") },
  ],
  legalBasis: [
    { title: t("«Prokuratura to'g'risida»gi Qonun", "Закон «О прокуратуре»", "Law on the Prosecution Service") },
    { title: t("Jinoyat-protsessual kodeksi", "Уголовно-процессуальный кодекс", "Criminal Procedure Code") },
    { title: t("Jinoyat kodeksi", "Уголовный кодекс", "Criminal Code") },
    { lawKey: "jpkRegister" },
    { lawKey: "lawAppeals" },
  ],
  assessment: [
    t("Kasb simulyatori natijalari", "Результаты профессионального симулятора", "Profession simulator results"),
    t("Aniqlangan buzilishlarning to'liqligi", "Полнота выявленных нарушений", "Completeness of detected violations"),
    t("Prokuror hujjatlarining sifati va qanoatlantirilishi", "Качество и удовлетворяемость актов прокурора", "Quality and uptake of prosecutorial acts"),
    t("Attestatsiya komissiyasi bahosi", "Оценка аттестационной комиссии", "Certification board assessment"),
  ],
  career: [
    { title: t("Prokuror yordamchisi-stajyor", "Помощник прокурора-стажёр", "Trainee assistant prosecutor"), requirement: t("Akademiyadagi tayyorgarlik", "Подготовка в академии", "Academy training") },
    { title: t("Prokuror yordamchisi", "Помощник прокурора", "Assistant prosecutor"), requirement: t("«Asosiy» daraja", "Уровень «Базовый»", "«Core» level") },
    { title: t("Katta prokuror yordamchisi", "Старший помощник прокурора", "Senior assistant prosecutor"), requirement: t("«Ilg'or» daraja", "Уровень «Продвинутый»", "«Advanced» level") },
    { title: t("Prokuror o'rinbosari", "Заместитель прокурора", "Deputy prosecutor"), requirement: t("«Ekspert» daraja, boshqaruv kursi", "Уровень «Экспертный», курс управления", "«Expert» level, management course") },
    { title: t("Tuman (shahar) prokurori", "Прокурор района (города)", "District prosecutor"), requirement: t("Rahbarlik tajribasi va attestatsiya", "Опыт руководства и аттестация", "Leadership record and certification") },
  ],
  clusters: ["protsessual", "huquqiy", "kriminalistika", "analitika"],
  trainers: ["/simulyator/hujjat"],
};
