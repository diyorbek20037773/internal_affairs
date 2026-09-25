import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const bojxona: ProfessionStandard = {
  id: "bojxona",
  agencies: ["bojxona"],
  icon: "PackageSearch",
  title: t("Bojxona inspektori", "Таможенный инспектор", "Customs inspector"),
  short: t(
    "Deklaratsiya va tovarlarni tekshiradi, tasniflash va bojxona qiymatini nazorat qiladi, xavf profillari asosida ko'rik o'tkazadi.",
    "Проверяет декларации и товары, контролирует классификацию и таможенную стоимость, проводит досмотр на основе профилей риска.",
    "Checks declarations and goods, verifies classification and customs value, inspects on the basis of risk profiles."
  ),
  functions: [
    {
      id: "bj-f1",
      title: t("Hujjatli nazorat", "Документальный контроль", "Documentary control"),
      tasks: [
        t("Bojxona deklaratsiyasi va ilova hujjatlarining to'liqligi va muvofiqligini tekshirish", "Проверка полноты и соответствия декларации и прилагаемых документов", "Checking completeness and consistency of the declaration and supporting documents"),
        t("Invoys, yuk xati va sertifikatlar o'rtasidagi nomuvofiqliklarni aniqlash", "Выявление несоответствий между инвойсом, накладной и сертификатами", "Spotting discrepancies between invoice, waybill and certificates"),
        t("Ruxsat beruvchi hujjatlar talablarini nazorat qilish", "Контроль требований разрешительных документов", "Verifying permit requirements"),
      ],
    },
    {
      id: "bj-f2",
      title: t("Tasniflash va bojxona qiymati", "Классификация и таможенная стоимость", "Classification and customs value"),
      tasks: [
        t("Tovar kodini TIF TN bo'yicha tekshirish va tuzatish", "Проверка и корректировка кода товара по ТН ВЭД", "Checking and correcting the HS code"),
        t("Bojxona qiymatini aniqlash usulini tekshirish", "Проверка метода определения таможенной стоимости", "Verifying the valuation method"),
        t("Bojxona to'lovlarini hisoblash va to'g'riligini nazorat qilish", "Расчёт и контроль правильности таможенных платежей", "Calculating and checking customs payments"),
      ],
    },
    {
      id: "bj-f3",
      title: t("Xavflarni boshqarish va ko'rik", "Управление рисками и досмотр", "Risk management and inspection"),
      tasks: [
        t("Xavf profillarini qo'llash va nazorat shaklini tanlash", "Применение профилей риска и выбор формы контроля", "Applying risk profiles and choosing the control form"),
        t("Rentgen-televizion tizim tasvirini tahlil qilish", "Анализ изображения рентген-телевизионной системы", "Analysing X-ray scanner images"),
        t("Bojxona ko'rigini o'tkazish va natijasini qayd etish", "Проведение таможенного досмотра и фиксация результата", "Performing inspection and recording results"),
      ],
    },
    {
      id: "bj-f4",
      title: t("Qaror qabul qilish va huquqbuzarliklarga javob", "Принятие решений и реагирование на правонарушения", "Decisions and response to offences"),
      tasks: [
        t("Tovarlarni chiqarish, rad etish yoki qo'shimcha tekshiruvga yuborish to'g'risida qaror", "Решение о выпуске, отказе или дополнительной проверке", "Deciding on release, refusal or further checks"),
        t("Bojxona qoidalarini buzish yoki kontrabanda alomatlarini hujjatlashtirish", "Документирование признаков нарушения таможенных правил или контрабанды", "Documenting customs offences or smuggling"),
        t("Fuqaro va tadbirkor bilan korrupsiyadan xoli, xushmuomala muloqot", "Вежливое, свободное от коррупции общение с гражданами и бизнесом", "Courteous, corruption-free dealings with travellers and traders"),
      ],
    },
  ],
  knowledge: [
    t("Bojxona qonunchiligi va bojxona rejimlari", "Таможенное законодательство и таможенные режимы", "Customs legislation and procedures"),
    t("Tashqi iqtisodiy faoliyat tovar nomenklaturasi va asosiy talqin qoidalari", "Товарная номенклатура ВЭД и основные правила интерпретации", "The HS nomenclature and General Interpretative Rules"),
    t("Bojxona qiymatini aniqlash usullari", "Методы определения таможенной стоимости", "Customs valuation methods"),
    t("Bojxona to'lovlari turlari va hisoblash tartibi", "Виды таможенных платежей и порядок их расчёта", "Types of customs payments and how to calculate them"),
    t("Xavflarni boshqarish tizimi tamoyillari", "Принципы системы управления рисками", "Principles of the risk management system"),
    t("Kontrabanda va bojxona huquqbuzarliklarining belgilari", "Признаки контрабанды и таможенных правонарушений", "Indicators of smuggling and customs offences"),
    t("Xalqaro savdo hujjatlari (invoys, CMR, sertifikatlar)", "Документы международной торговли (инвойс, CMR, сертификаты)", "International trade documents (invoice, CMR, certificates)"),
  ],
  skills: [
    t("Hujjatlarni tez solishtirib, nomuvofiqlikni topish", "Быстрое сопоставление документов и поиск несоответствий", "Cross-checking documents quickly for discrepancies"),
    t("Tovarni to'g'ri tasniflash", "Правильная классификация товара", "Correct tariff classification"),
    t("To'lovlarni aniq hisoblash", "Точный расчёт платежей", "Accurate duty calculation"),
    t("Xavf ko'rsatkichlariga qarab nazorat shaklini tanlash", "Выбор формы контроля по индикаторам риска", "Choosing the control form by risk indicators"),
    t("Rentgen tasvirida yashirin joylarni aniqlash", "Выявление тайников на рентгеновском снимке", "Finding concealments on X-ray images"),
    t("Qarorni asoslab, rasmiylashtirish", "Обоснование и оформление решения", "Justifying and recording decisions"),
  ],
  competencies: [
    {
      id: "bojxona.hujjat_nazorat",
      label: t("Hujjatli nazorat", "Документальный контроль", "Documentary control"),
      description: t("Deklaratsiya va ilova hujjatlaridagi nomuvofiqliklarni aniqlash.", "Выявление несоответствий в декларации и прилагаемых документах.", "Detecting discrepancies in declarations and supporting documents."),
      clusters: ["bojxona", "protsessual"],
      subjects: ["boj-01", "boj-04", "pr-04"],
    },
    {
      id: "bojxona.tasnif",
      label: t("Tovarlarni tasniflash", "Классификация товаров", "Tariff classification"),
      description: t("Tovar kodini nomenklatura va talqin qoidalariga mos aniqlash.", "Определение кода товара по номенклатуре и правилам интерпретации.", "Assigning the HS code under the nomenclature and interpretative rules."),
      clusters: ["bojxona"],
      subjects: ["boj-02"],
    },
    {
      id: "bojxona.tolov",
      label: t("Qiymat va to'lovlar", "Стоимость и платежи", "Value and payments"),
      description: t("Bojxona qiymati va to'lovlarini to'g'ri aniqlash va hisoblash.", "Правильное определение таможенной стоимости и расчёт платежей.", "Correctly determining customs value and calculating payments."),
      clusters: ["bojxona", "analitika"],
      subjects: ["boj-03", "an-01"],
    },
    {
      id: "bojxona.xavf",
      label: t("Xavflarni boshqarish", "Управление рисками", "Risk management"),
      description: t("Xavf profillari va indikatorlar asosida nazorat shakli va ko'rik chuqurligini tanlash.", "Выбор формы контроля и глубины досмотра на основе профилей и индикаторов риска.", "Choosing control form and inspection depth from risk profiles and indicators."),
      clusters: ["bojxona", "analitika"],
      subjects: ["boj-05", "boj-06", "an-06"],
    },
    {
      id: "bojxona.qaror",
      label: t("Bojxona qarori", "Таможенное решение", "Customs decision"),
      description: t("Tovarni chiqarish, rad etish yoki huquqbuzarlikni qayd etish bo'yicha qonuniy va asosli qaror.", "Законное и обоснованное решение о выпуске, отказе или фиксации правонарушения.", "Lawful, reasoned decision to release, refuse or record an offence."),
      clusters: ["bojxona", "huquqiy"],
      subjects: ["boj-01", "boj-06", "huq-06"],
    },
  ],
  levels: levels([
    t("Nazorat postida murabbiy bilan standart rasmiylashtirishni bajaradi.", "Выполняет типовое оформление на посту с наставником.", "Processes routine clearances at the post with a mentor."),
    t("Deklaratsiyalarni mustaqil tekshiradi va to'lovlarni hisoblaydi.", "Самостоятельно проверяет декларации и рассчитывает платежи.", "Independently checks declarations and calculates payments."),
    t("Murakkab tasniflash va qiymat nizolarini hal qiladi, yashirin kontrabandani aniqlaydi.", "Решает сложные вопросы классификации и стоимости, выявляет скрытую контрабанду.", "Resolves hard classification and valuation disputes and detects concealed smuggling."),
    t("Xavf profillarini ishlab chiqadi va post amaliyotini tahlil qiladi.", "Разрабатывает профили риска и анализирует практику поста.", "Designs risk profiles and reviews post practice."),
  ]),
  education: [
    t("Oliy ta'lim (bojxona ishi, iqtisodiyot yoki huquqshunoslik)", "Высшее образование (таможенное дело, экономика или право)", "Higher education (customs, economics or law)"),
    t("Bojxona instituti yoki o'quv markazida boshlang'ich tayyorgarlik", "Первоначальная подготовка в таможенном институте или учебном центре", "Initial training at the customs institute or training centre"),
    t("Tasniflash va qiymat bo'yicha muntazam malaka oshirish", "Регулярное повышение квалификации по классификации и стоимости", "Regular refresher training on classification and valuation"),
  ],
  practice: [
    { title: t("Nazorat postida stajirovka", "Стажировка на таможенном посту", "Customs post internship"), description: t("Yo'lovchi va yuk oqimida murabbiy bilan ishlash.", "Работа с пассажиро- и грузопотоком под наставником.", "Handling passenger and cargo flows with a mentor.") },
    { title: t("Deklaratsiya praktikumi", "Практикум по декларациям", "Declaration workshop"), description: t("O'quv deklaratsiyalardagi xatolarni topish va to'lovlarni hisoblash.", "Поиск ошибок в учебных декларациях и расчёт платежей.", "Finding errors in training declarations and computing duties.") },
    { title: t("Kasb simulyatori", "Профессиональный симулятор", "Profession simulator"), description: t("Virtual nazorat posti: deklaratsiya, rentgen tasviri, xavf profili va qaror.", "Виртуальный пост: декларация, рентген, профиль риска и решение.", "Virtual post: declaration, X-ray image, risk profile and decision.") },
  ],
  legalBasis: [
    { title: t("Bojxona kodeksi", "Таможенный кодекс", "Customs Code") },
    { title: t("«Bojxona tarifi to'g'risida»gi Qonun", "Закон «О таможенном тарифе»", "Law on the Customs Tariff") },
    { title: t("Soliq kodeksi", "Налоговый кодекс", "Tax Code") },
    { title: t("Ma'muriy javobgarlik to'g'risidagi kodeks", "Кодекс об административной ответственности", "Code of Administrative Liability") },
    { title: t("Jinoyat kodeksi", "Уголовный кодекс", "Criminal Code") },
  ],
  assessment: [
    t("Kasb simulyatori natijalari", "Результаты профессионального симулятора", "Profession simulator results"),
    t("Tasniflash va to'lov hisoblash testlari", "Тесты по классификации и расчёту платежей", "Classification and duty-calculation tests"),
    t("Post rahbarining bahosi va xatolar statistikasi", "Оценка начальника поста и статистика ошибок", "Post chief assessment and error statistics"),
    t("Odob-axloq va korrupsiyaga qarshi tekshiruv natijalari", "Результаты проверки этики и антикоррупционного поведения", "Ethics and integrity review results"),
  ],
  career: [
    { title: t("Bojxona inspektori-stajyor", "Инспектор-стажёр", "Trainee customs inspector"), requirement: t("Boshlang'ich tayyorgarlik", "Первоначальная подготовка", "Initial training") },
    { title: t("Bojxona inspektori", "Таможенный инспектор", "Customs inspector"), requirement: t("«Asosiy» daraja", "Уровень «Базовый»", "«Core» level") },
    { title: t("Katta bojxona inspektori", "Старший таможенный инспектор", "Senior customs inspector"), requirement: t("«Ilg'or» daraja", "Уровень «Продвинутый»", "«Advanced» level") },
    { title: t("Xavflarni boshqarish bo'yicha mutaxassis", "Специалист по управлению рисками", "Risk management specialist"), requirement: t("«Ekspert» daraja", "Уровень «Экспертный»", "«Expert» level") },
    { title: t("Bojxona posti boshlig'i", "Начальник таможенного поста", "Head of customs post"), requirement: t("Boshqaruv kursi", "Курс управления", "Management course") },
  ],
  clusters: ["bojxona", "huquqiy", "analitika", "protsessual"],
  trainers: [],
};
