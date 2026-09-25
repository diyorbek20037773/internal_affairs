import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const profilaktika: ProfessionStandard = {
  id: "profilaktika",
  agencies: ["iiv"],
  icon: "Home",
  title: t("Profilaktika inspektori", "Инспектор профилактики", "Prevention inspector"),
  short: t(
    "Mahallada huquqbuzarliklarning oldini oladi, fuqarolar murojaatlarini hal qiladi va profilaktik hisobdagi shaxslar bilan ishlaydi.",
    "Предупреждает правонарушения на участке, разрешает обращения граждан и работает с лицами, состоящими на профилактическом учёте.",
    "Prevents offences in the neighbourhood, resolves citizens' appeals and works with persons on the preventive register."
  ),
  functions: [
    {
      id: "pf-f1",
      title: t("Huquqbuzarliklar profilaktikasi", "Профилактика правонарушений", "Crime prevention"),
      tasks: [
        t("Profilaktik hisobdagi shaxslar bilan yakka tartibdagi ishni rejalashtirish va o'tkazish", "Планирование и проведение индивидуальной работы с лицами на профилактическом учёте", "Planning and running individual work with registered persons"),
        t("Oilaviy-maishiy nizolarni aniqlash va himoya orderi masalasini hal qilish", "Выявление семейно-бытовых конфликтов и решение вопроса о защитном ордере", "Identifying domestic conflicts and deciding on a protection order"),
        t("Voyaga yetmaganlar o'rtasida huquqbuzarliklarning oldini olish", "Предупреждение правонарушений среди несовершеннолетних", "Preventing juvenile offending"),
        t("Mahalla faollari va ijtimoiy xizmatlar bilan hamkorlikda profilaktik tadbirlar o'tkazish", "Проведение профилактических мероприятий совместно с активом махалли и социальными службами", "Running preventive activities with the mahalla and social services"),
      ],
    },
    {
      id: "pf-f2",
      title: t("Fuqarolar murojaatlari bilan ishlash", "Работа с обращениями граждан", "Handling citizens' appeals"),
      tasks: [
        t("Murojaatni qabul qilish, ro'yxatga olish va qonuniy muddatda ko'rib chiqish", "Приём, регистрация и рассмотрение обращения в установленный срок", "Receiving, registering and resolving an appeal within the legal time limit"),
        t("Fuqaro bilan hurmatli, tushunarli muloqot qilish va nizoni pasaytirish", "Уважительное и понятное общение с гражданином, снижение конфликта", "Respectful, clear communication and de-escalation"),
        t("Arizachiga javob tayyorlash va natijani tushuntirish", "Подготовка ответа заявителю и разъяснение результата", "Preparing the reply and explaining the outcome"),
      ],
    },
    {
      id: "pf-f3",
      title: t("Ma'muriy huquqbuzarliklarga javob choralari", "Реагирование на административные правонарушения", "Responding to administrative offences"),
      tasks: [
        t("Huquqbuzarlikni to'g'ri kvalifikatsiya qilish (ma'muriy yoki jinoiy)", "Правильная квалификация правонарушения (административное или уголовное)", "Correctly qualifying the offence (administrative or criminal)"),
        t("Ma'muriy huquqbuzarlik to'g'risida bayonnoma tuzish", "Составление протокола об административном правонарушении", "Drawing up an administrative offence record"),
        t("Jinoyat alomatlari bo'lsa, xabarni navbatchilik qismiga yetkazish va voqea joyini saqlash", "При признаках преступления — сообщение в дежурную часть и охрана места происшествия", "Reporting signs of a crime to the duty desk and securing the scene"),
      ],
    },
    {
      id: "pf-f4",
      title: t("Hududni tahlil qilish va hisobot", "Анализ участка и отчётность", "District analysis and reporting"),
      tasks: [
        t("Hudud pasportini yuritish va xavf omillarini aniqlash", "Ведение паспорта участка и выявление факторов риска", "Maintaining the district passport and identifying risk factors"),
        t("Huquqbuzarliklar dinamikasini tahlil qilish va profilaktik rejani yangilash", "Анализ динамики правонарушений и обновление профилактического плана", "Analysing offence trends and updating the prevention plan"),
        t("Raqamli tizimlarda ma'lumotlarni kiritish va hisobot tayyorlash", "Ввод данных в цифровые системы и подготовка отчётов", "Entering data in digital systems and preparing reports"),
      ],
    },
  ],
  knowledge: [
    t("Huquqbuzarliklar profilaktikasi to'g'risidagi qonunchilik va profilaktika choralari tizimi", "Законодательство о профилактике правонарушений и система профилактических мер", "Prevention legislation and the system of preventive measures"),
    t("Ma'muriy javobgarlik asoslari va bayonnoma tuzish tartibi", "Основы административной ответственности и порядок составления протокола", "Administrative liability and the offence-record procedure"),
    t("Mulkka qarshi va jamoat tartibiga qarshi jinoyatlar tarkiblari", "Составы преступлений против собственности и общественного порядка", "Elements of property and public-order crimes"),
    t("Murojaatlarni ko'rib chiqish tartibi va muddatlari", "Порядок и сроки рассмотрения обращений", "Procedure and deadlines for appeals"),
    t("Xotin-qizlarni tazyiq va zo'ravonlikdan himoya qilish mexanizmlari", "Механизмы защиты женщин от притеснения и насилия", "Mechanisms protecting women from harassment and violence"),
    t("Tayanch punkti faoliyatini tashkil etish nizomi", "Положение об организации опорного пункта", "Regulation on the neighbourhood police post"),
    t("Muloqot va deeskalatsiya psixologiyasi asoslari", "Основы психологии общения и деэскалации", "Psychology of communication and de-escalation"),
  ],
  skills: [
    t("Nizoli fuqaro bilan tinch, hurmatli suhbat olib borish", "Спокойный и уважительный диалог с конфликтным гражданином", "Calm, respectful dialogue with a hostile citizen"),
    t("Vaziyatni tez baholab, mutanosib chora tanlash", "Быстрая оценка ситуации и выбор соразмерной меры", "Rapid assessment and choosing a proportionate measure"),
    t("Bayonnoma va xizmat hujjatlarini xatosiz rasmiylashtirish", "Безошибочное оформление протоколов и служебных документов", "Error-free drafting of records and service documents"),
    t("Yashirin xavf belgilarini savollar orqali aniqlash", "Выявление скрытых признаков риска через вопросы", "Uncovering hidden risk signals through questioning"),
    t("Hudud bo'yicha ma'lumotlarni tahlil qilib, ustuvorlikni belgilash", "Анализ данных по участку и определение приоритетов", "Analysing district data and setting priorities"),
    t("Mahalla, maktab va ijtimoiy xizmatlar bilan hamkorlik qilish", "Взаимодействие с махаллей, школой и социальными службами", "Working with the mahalla, schools and social services"),
    t("Planshet va raqamli xizmat tizimlaridan foydalanish", "Работа с планшетом и цифровыми служебными системами", "Using tablets and digital service systems"),
  ],
  competencies: [
    {
      id: "profilaktika.huquqiy",
      label: t("Huquqiy qaror", "Правовое решение", "Legal decision-making"),
      description: t("Vaziyatga qonunga mos, vakolat doirasida va to'g'ri huquqiy asos bilan qaror qabul qilish.", "Принятие решения в соответствии с законом, в пределах полномочий и с верным правовым основанием.", "Lawful decisions within one's powers, citing the correct legal basis."),
      clusters: ["huquqiy", "protsessual"],
      subjects: ["huq-02", "huq-03", "pr-07"],
    },
    {
      id: "profilaktika.muloqot",
      label: t("Muloqot va deeskalatsiya", "Коммуникация и деэскалация", "Communication and de-escalation"),
      description: t("Fuqaro bilan aniq, hurmatli muloqot; taranglikni kuch ishlatmasdan pasaytirish.", "Ясное, уважительное общение; снижение напряжённости без применения силы.", "Clear, respectful communication; lowering tension without force."),
      clusters: ["maxsus"],
      subjects: ["mx-02", "mx-03", "huq-07"],
    },
    {
      id: "profilaktika.profilaktik_ish",
      label: t("Profilaktik ish", "Профилактическая работа", "Preventive work"),
      description: t("Xavf guruhlarini aniqlash, yakka tartibdagi profilaktika va natijaga yo'naltirilgan chora-tadbirlar.", "Выявление групп риска, индивидуальная профилактика и результативные меры.", "Identifying risk groups, individual prevention and result-driven measures."),
      clusters: ["maxsus", "analitika"],
      subjects: ["mx-01", "mx-03", "an-06"],
    },
    {
      id: "profilaktika.hujjat",
      label: t("Hujjatlashtirish", "Документирование", "Documentation"),
      description: t("Bayonnoma, tushuntirish xati va hisobotlarni to'liq, aniq va muddatida rasmiylashtirish.", "Полное, точное и своевременное оформление протоколов, объяснений и отчётов.", "Complete, accurate and timely records, statements and reports."),
      clusters: ["protsessual"],
      subjects: ["pr-04", "pr-07", "pr-06"],
    },
    {
      id: "profilaktika.tahlil",
      label: t("Vaziyat va hudud tahlili", "Анализ ситуации и участка", "Situation and district analysis"),
      description: t("Xavf, ishtirokchilar va kontekstni tez baholash; hudud ma'lumotlaridan xulosa chiqarish.", "Быстрая оценка риска, участников и контекста; выводы из данных по участку.", "Rapid assessment of risk, parties and context; drawing conclusions from district data."),
      clusters: ["analitika"],
      subjects: ["an-02", "an-03", "an-06"],
    },
  ],
  levels: levels([
    t("Standart vaziyatlarda murabbiy nazorati ostida ishlaydi, asosiy hujjatlarni namunaga qarab tuzadi.", "Работает в типовых ситуациях под контролем наставника, составляет документы по образцу.", "Handles routine situations under a mentor and drafts documents from templates."),
    t("Hududda mustaqil ishlaydi, murojaatlarni muddatida hal qiladi, nizoni o'zi pasaytira oladi.", "Самостоятельно работает на участке, решает обращения в срок, сам снижает конфликт.", "Works the district independently, resolves appeals on time and de-escalates on their own."),
    t("Murakkab (oilaviy zo'ravonlik, voyaga yetmaganlar) holatlarni boshqaradi, hudud tahlili asosida reja tuzadi.", "Ведёт сложные случаи (бытовое насилие, несовершеннолетние), строит план на основе анализа участка.", "Manages complex cases (domestic violence, juveniles) and plans from district analytics."),
    t("Hamkasblarga murabbiylik qiladi, profilaktika amaliyotini takomillashtirish bo'yicha taklif beradi.", "Наставляет коллег, вносит предложения по совершенствованию профилактической практики.", "Mentors colleagues and proposes improvements to prevention practice."),
  ]),
  education: [
    t("Oliy yuridik ta'lim (IIV Akademiyasi yoki huquqshunoslik yo'nalishi)", "Высшее юридическое образование (Академия МВД или юриспруденция)", "Higher legal education (MoI Academy or law degree)"),
    t("Profilaktika inspektorlari uchun boshlang'ich kasbiy tayyorgarlik kursi", "Курс первоначальной профессиональной подготовки инспекторов профилактики", "Initial professional course for prevention inspectors"),
    t("Har 3 yilda malaka oshirish", "Повышение квалификации каждые 3 года", "Refresher training every 3 years"),
  ],
  practice: [
    { title: t("Kuzatuv stajirovkasi", "Стажировка-наблюдение", "Shadowing internship"), description: t("Tajribali inspektor bilan tayanch punktida 2 hafta: qabul, xonadonlarni aylanish, hujjatlar.", "2 недели в опорном пункте с опытным инспектором: приём, обход, документы.", "Two weeks at a police post with an experienced inspector: reception, rounds, paperwork.") },
    { title: t("Simulyator bosqichi", "Этап симуляторов", "Simulator stage"), description: t("Muloqot, qaror, mahalla va hujjat trenajyorlarida kamida 80% natija.", "Не менее 80% на тренажёрах общения, решений, махалли и документов.", "At least 80% on the communication, decision, mahalla and documents trainers.") },
    { title: t("Murabbiy nazoratidagi mustaqil ish", "Самостоятельная работа под наставником", "Supervised independent work"), description: t("1 oy davomida hudud biriktiriladi, har hafta murabbiy tahlili.", "Закрепление участка на 1 месяц, еженедельный разбор с наставником.", "A district for one month with weekly mentor debriefs.") },
    { title: t("Attestatsiya", "Аттестация", "Certification"), description: t("Imtihon rejimi va instruktor tasdig'i bilan kompetensiya pasporti yakunlanadi.", "Экзаменационный режим и подтверждение инструктора завершают паспорт компетенций.", "Exam mode plus instructor sign-off finalise the competency passport.") },
  ],
  legalBasis: [
    { lawKey: "lawPrevention" },
    { lawKey: "lawPolice" },
    { lawKey: "regInspector" },
    { lawKey: "lawAppeals" },
    { lawKey: "lawDv" },
    { lawKey: "mjtkProtocol" },
  ],
  assessment: [
    t("Simulyatorlardagi natijalar (Klaster-ID 8 o'qi bo'yicha)", "Результаты тренажёров (по 8 осям Klaster-ID)", "Simulator results (8 Klaster-ID axes)"),
    t("Imtihon rejimidagi yakuniy stsenariy", "Итоговый сценарий в режиме экзамена", "Final scenario in exam mode"),
    t("Rasmiylashtirilgan hujjatlar portfeli sifati", "Качество портфеля оформленных документов", "Quality of the documents portfolio"),
    t("Murabbiy va instruktor bahosi", "Оценка наставника и инструктора", "Mentor and instructor assessment"),
    t("Hududdagi profilaktika natijadorligi ko'rsatkichlari", "Показатели результативности профилактики на участке", "Prevention effectiveness indicators in the district"),
  ],
  career: [
    { title: t("Stajyor inspektor", "Инспектор-стажёр", "Trainee inspector"), requirement: t("Boshlang'ich kurs va kuzatuv stajirovkasi", "Начальный курс и стажировка", "Initial course and shadowing") },
    { title: t("Profilaktika inspektori", "Инспектор профилактики", "Prevention inspector"), requirement: t("Pasportda «Asosiy» daraja, attestatsiya", "Уровень «Базовый» в паспорте, аттестация", "«Core» level in the passport, certification") },
    { title: t("Katta profilaktika inspektori", "Старший инспектор профилактики", "Senior prevention inspector"), requirement: t("«Ilg'or» daraja, 3 yil tajriba", "Уровень «Продвинутый», 3 года стажа", "«Advanced» level, 3 years' service") },
    { title: t("Tayanch punkti rahbari", "Руководитель опорного пункта", "Head of a police post"), requirement: t("«Ekspert» daraja, murabbiylik tajribasi", "Уровень «Экспертный», опыт наставничества", "«Expert» level, mentoring experience") },
    { title: t("Profilaktika bo'limi boshlig'i", "Начальник отдела профилактики", "Head of prevention department"), requirement: t("Boshqaruv kursi va natijadorlik ko'rsatkichlari", "Курс управления и показатели результативности", "Management course and performance record") },
  ],
  clusters: ["huquqiy", "maxsus", "protsessual", "analitika"],
  trainers: ["/simulyator/muloqot", "/simulyator/qaror", "/simulyator/mahalla", "/simulyator/hujjat", "/simulyator/tir", "/simulyator/imtihon"],
};
