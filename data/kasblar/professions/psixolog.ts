import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const psixolog: ProfessionStandard = {
  id: "psixolog",
  agencies: ["iiv", "gvardiya", "bojxona", "prokuratura", "fvv"],
  icon: "Brain",
  title: t("Idoraviy psixolog", "Ведомственный психолог", "Departmental psychologist"),
  short: t(
    "Xodimlarning kasbiy psixologik tayyorgarligini baholaydi, stress va inqirozli holatlarda yordam beradi, kasbiy deformatsiyaning oldini oladi.",
    "Оценивает профессионально-психологическую пригодность сотрудников, помогает при стрессе и в кризисных ситуациях, предупреждает профессиональную деформацию.",
    "Assesses officers' psychological fitness, supports them through stress and crises, and prevents professional burnout."
  ),
  functions: [
    {
      id: "ps-f1",
      title: t("Psixologik tanlov va baholash", "Психологический отбор и оценка", "Psychological selection and assessment"),
      tasks: [
        t("Nomzodlarning kasbiy psixologik yaroqliligini baholash", "Оценка профессионально-психологической пригодности кандидатов", "Assessing candidates' psychological fitness for service"),
        t("Qurol bilan xizmat qiluvchi xodimlarni muntazam tekshiruvdan o'tkazish", "Регулярное обследование сотрудников, допущенных к оружию", "Periodic screening of armed personnel"),
        t("Natijalarni maxfiylikka rioya qilgan holda rasmiylashtirish", "Оформление результатов с соблюдением конфиденциальности", "Recording results confidentially"),
      ],
    },
    {
      id: "ps-f2",
      title: t("Psixologik maslahat va suhbat", "Психологическое консультирование и беседа", "Counselling"),
      tasks: [
        t("Xodim bilan ishonchli, baholovchi bo'lmagan suhbat o'tkazish", "Проведение доверительной, неоценочной беседы с сотрудником", "Holding a trusting, non-judgemental conversation"),
        t("Stress, charchoq va kasbiy deformatsiya belgilarini aniqlash", "Выявление признаков стресса, выгорания и профессиональной деформации", "Recognising stress, burnout and professional deformation"),
        t("Yakka tartibdagi qo'llab-quvvatlash rejasini tuzish", "Составление индивидуального плана поддержки", "Drawing up an individual support plan"),
      ],
    },
    {
      id: "ps-f3",
      title: t("Inqirozli vaziyatlarda yordam", "Помощь в кризисных ситуациях", "Crisis intervention"),
      tasks: [
        t("Og'ir hodisadan (qurol qo'llash, halokat) keyin shoshilinch psixologik yordam", "Экстренная психологическая помощь после тяжёлых событий (применение оружия, гибель)", "Emergency support after critical incidents (use of firearms, fatalities)"),
        t("O'z joniga qasd qilish xavfini baholash va xavfsizlik choralarini ko'rish", "Оценка суицидального риска и меры безопасности", "Assessing suicide risk and taking safety measures"),
        t("Kerak bo'lganda tibbiy mutaxassisga yo'naltirish", "Направление к медицинскому специалисту при необходимости", "Referring to medical specialists when required"),
      ],
    },
    {
      id: "ps-f4",
      title: t("Profilaktika va jamoa bilan ishlash", "Профилактика и работа с коллективом", "Prevention and team work"),
      tasks: [
        t("Stressga chidamlilik bo'yicha treninglar o'tkazish", "Проведение тренингов стрессоустойчивости", "Running resilience training"),
        t("Jamoadagi ijtimoiy-psixologik muhitni o'rganish", "Изучение социально-психологического климата в коллективе", "Studying team climate"),
        t("Rahbariyatga tavsiyali xulosa tayyorlash", "Подготовка заключения с рекомендациями для руководства", "Preparing recommendations for leadership"),
      ],
    },
  ],
  knowledge: [
    t("Umumiy, ijtimoiy va yuridik psixologiya", "Общая, социальная и юридическая психология", "General, social and legal psychology"),
    t("Psixodiagnostika usullari va ularning cheklovlari", "Методы психодиагностики и их ограничения", "Psychodiagnostic methods and their limits"),
    t("Stress va travmatik stress psixologiyasi", "Психология стресса и травматического стресса", "Stress and traumatic stress"),
    t("Inqirozli aralashuv va suitsid xavfini baholash protokollari", "Протоколы кризисного вмешательства и оценки суицидального риска", "Crisis-intervention and suicide-risk protocols"),
    t("Psixolog kasbiy etikasi va maxfiylik chegaralari", "Профессиональная этика психолога и границы конфиденциальности", "Professional ethics and confidentiality limits"),
    t("Huquqni muhofaza qilish xizmatining o'ziga xos psixologik yuklamalari", "Психологические нагрузки правоохранительной службы", "Psychological demands of law-enforcement service"),
  ],
  skills: [
    t("Faol tinglash va empatik javob berish", "Активное слушание и эмпатический отклик", "Active listening and empathic response"),
    t("Standartlashtirilgan psixologik testlarni o'tkazish va talqin qilish", "Проведение и интерпретация стандартизированных тестов", "Administering and interpreting standardised tests"),
    t("Inqiroz holatidagi odamni barqarorlashtirish", "Стабилизация человека в кризисном состоянии", "Stabilising a person in crisis"),
    t("Xavf darajasini baholab, qaror qabul qilish", "Оценка уровня риска и принятие решения", "Rating risk and deciding next steps"),
    t("Aniq va xolis psixologik xulosa yozish", "Написание точного и объективного заключения", "Writing precise, objective reports"),
    t("Guruh treninglarini olib borish", "Ведение групповых тренингов", "Facilitating group training"),
  ],
  competencies: [
    {
      id: "psixolog.baholash",
      label: t("Psixologik baholash", "Психологическая оценка", "Psychological assessment"),
      description: t("Tegishli usullarni tanlash va natijalarni ilmiy asosda talqin qilish.", "Выбор адекватных методов и научная интерпретация результатов.", "Choosing sound methods and interpreting results scientifically."),
      clusters: ["maxsus", "analitika"],
      subjects: ["mx-03", "an-01"],
    },
    {
      id: "psixolog.suhbat",
      label: t("Maslahat suhbati", "Консультативная беседа", "Counselling conversation"),
      description: t("Ishonchli muloqot o'rnatish, muammoni aniqlash va xodimni o'z resurslariga yo'naltirish.", "Установление доверия, выявление проблемы и опора на ресурсы сотрудника.", "Building trust, identifying the problem and mobilising the officer's resources."),
      clusters: ["maxsus"],
      subjects: ["mx-02", "mx-03"],
    },
    {
      id: "psixolog.inqiroz",
      label: t("Inqirozli aralashuv", "Кризисное вмешательство", "Crisis intervention"),
      description: t("O'tkir stress va suitsid xavfida tez, xavfsiz va protokolga mos harakat qilish.", "Быстрые, безопасные и соответствующие протоколу действия при остром стрессе и суицидальном риске.", "Fast, safe, protocol-based action in acute stress and suicide risk."),
      clusters: ["maxsus"],
      subjects: ["mx-08", "mx-06"],
    },
    {
      id: "psixolog.profilaktika",
      label: t("Psixoprofilaktika", "Психопрофилактика", "Psychological prevention"),
      description: t("Kasbiy deformatsiya va charchoqning oldini olish, jamoa muhitini yaxshilash.", "Предупреждение профдеформации и выгорания, улучшение климата в коллективе.", "Preventing deformation and burnout and improving team climate."),
      clusters: ["maxsus", "analitika"],
      subjects: ["mx-03", "mx-08", "an-06"],
    },
    {
      id: "psixolog.xulosa",
      label: t("Psixologik xulosa", "Психологическое заключение", "Psychological report"),
      description: t("Etik va maxfiylik talablariga mos, aniq tavsiyali xulosa tayyorlash.", "Заключение с чёткими рекомендациями, соответствующее этике и конфиденциальности.", "A clear, ethical, confidential report with recommendations."),
      clusters: ["maxsus", "protsessual"],
      subjects: ["pr-04", "huq-06", "mx-03"],
    },
  ],
  levels: levels([
    t("Katta psixolog nazoratida testlar o'tkazadi.", "Проводит тестирование под контролем старшего психолога.", "Runs testing under a senior psychologist."),
    t("Baholash va maslahatni mustaqil olib boradi.", "Самостоятельно проводит оценку и консультирование.", "Independently assesses and counsels."),
    t("Inqirozli holatlarda yetakchilik qiladi, treninglar olib boradi.", "Ведёт кризисные случаи и тренинги.", "Leads crisis response and training."),
    t("Idoraviy psixologik xizmat metodikasini ishlab chiqadi, supervizor.", "Разрабатывает методику ведомственной психологической службы, супервизор.", "Designs service methodology and supervises psychologists."),
  ]),
  education: [
    t("Oliy psixologik ta'lim", "Высшее психологическое образование", "Higher education in psychology"),
    t("Ekstremal va inqirozli psixologiya bo'yicha maxsus kurs", "Специальный курс по экстремальной и кризисной психологии", "Specialised course in crisis and extreme-conditions psychology"),
    t("Supervizya va muntazam malaka oshirish", "Супервизия и регулярное повышение квалификации", "Supervision and regular refresher training"),
  ],
  practice: [
    { title: t("Psixologik xizmatda stajirovka", "Стажировка в психологической службе", "Psychological service internship"), description: t("Tanlov va davriy tekshiruvlarda ishtirok.", "Участие в отборе и периодических обследованиях.", "Taking part in selection and periodic screening.") },
    { title: t("Rolli suhbat mashqlari", "Ролевые упражнения по беседе", "Role-play counselling"), description: t("Supervizor kuzatuvida inqirozli suhbat mashqi.", "Упражнение кризисной беседы под наблюдением супервизора.", "Crisis-conversation practice under supervision.") },
    { title: t("Kasb simulyatori", "Профессиональный симулятор", "Profession simulator"), description: t("Xodim bilan suhbat, holat kartasi va xavfni baholash.", "Беседа с сотрудником, карта состояния и оценка риска.", "Officer conversation, status card and risk assessment.") },
  ],
  legalBasis: [
    { lawKey: "lawPolice" },
    { title: t("«Milliy gvardiya to'g'risida»gi Qonun", "Закон «О Национальной гвардии»", "Law on the National Guard") },
    { title: t("«Prokuratura to'g'risida»gi Qonun", "Закон «О прокуратуре»", "Law on the Prosecution Service") },
    { title: t("«Shaxsga doir ma'lumotlar to'g'risida»gi Qonun", "Закон «О персональных данных»", "Law on Personal Data") },
  ],
  assessment: [
    t("Kasb simulyatori natijalari", "Результаты профессионального симулятора", "Profession simulator results"),
    t("Supervizor bahosi (suhbat yozuvlari asosida)", "Оценка супервизора (по записям бесед)", "Supervisor rating of recorded sessions"),
    t("Xulosalarning sifati va etik talablarga mosligi", "Качество заключений и соответствие этике", "Quality and ethical compliance of reports"),
    t("Treninglar ishtirokchilarining fikr-mulohazasi", "Отзывы участников тренингов", "Training participants' feedback"),
  ],
  career: [
    { title: t("Psixolog-stajyor", "Психолог-стажёр", "Trainee psychologist"), requirement: t("Oliy psixologik ta'lim", "Высшее психологическое образование", "Degree in psychology") },
    { title: t("Psixolog", "Психолог", "Psychologist"), requirement: t("«Asosiy» daraja", "Уровень «Базовый»", "«Core» level") },
    { title: t("Katta psixolog", "Старший психолог", "Senior psychologist"), requirement: t("«Ilg'or» daraja, inqirozli kurs", "Уровень «Продвинутый», кризисный курс", "«Advanced» level, crisis course") },
    { title: t("Psixolog-supervizor", "Психолог-супервизор", "Supervising psychologist"), requirement: t("«Ekspert» daraja", "Уровень «Экспертный»", "«Expert» level") },
    { title: t("Psixologik xizmat boshlig'i", "Начальник психологической службы", "Head of psychological service"), requirement: t("Boshqaruv kursi", "Курс управления", "Management course") },
  ],
  clusters: ["maxsus", "analitika", "huquqiy", "protsessual"],
  trainers: ["/simulyator/muloqot"],
};
