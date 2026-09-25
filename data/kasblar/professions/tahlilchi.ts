import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const tahlilchi: ProfessionStandard = {
  id: "tahlilchi",
  agencies: ["iiv"],
  icon: "BarChart3",
  title: t("Tahlilchi (axborot-tahlil xodimi)", "Аналитик (сотрудник информационно-аналитической службы)", "Crime analyst"),
  short: t(
    "Jinoyatchilik holati bo'yicha ma'lumotlarni yig'adi va tahlil qiladi, xavfli hududlar va tendensiyalarni aniqlab, rahbariyatga asosli xulosa beradi.",
    "Собирает и анализирует данные о преступности, выявляет очаги и тенденции, даёт руководству обоснованные выводы.",
    "Collects and analyses crime data, identifies hotspots and trends, and briefs leadership with evidence-based conclusions."
  ),
  functions: [
    {
      id: "th-f1",
      title: t("Ma'lumotlarni yig'ish va tekshirish", "Сбор и проверка данных", "Collecting and validating data"),
      tasks: [
        t("Statistik hisobotlar va xizmat bazalaridan ma'lumotlarni yig'ish", "Сбор данных из статистических отчётов и служебных баз", "Gathering data from statistical reports and service databases"),
        t("Ma'lumotlarning to'liqligi va ishonchliligini tekshirish", "Проверка полноты и достоверности данных", "Checking data completeness and reliability"),
        t("Takroriy va xato yozuvlarni aniqlash", "Выявление дублирующих и ошибочных записей", "Detecting duplicate and erroneous records"),
      ],
    },
    {
      id: "th-f2",
      title: t("Statistik va makon tahlili", "Статистический и пространственный анализ", "Statistical and spatial analysis"),
      tasks: [
        t("Ko'rsatkichlar dinamikasini hisoblash va solishtirish", "Расчёт и сравнение динамики показателей", "Computing and comparing indicator trends"),
        t("Xaritada jinoyatchilik o'choqlarini aniqlash", "Выявление очагов преступности на карте", "Mapping crime hotspots"),
        t("Vaqt va joy bo'yicha qonuniyatlarni topish", "Выявление закономерностей по времени и месту", "Finding time and place patterns"),
      ],
    },
    {
      id: "th-f3",
      title: t("Prognozlash va tavsiyalar", "Прогнозирование и рекомендации", "Forecasting and recommendations"),
      tasks: [
        t("Qisqa muddatli prognoz tuzish va uning ishonchliligini baholash", "Составление краткосрочного прогноза и оценка его надёжности", "Producing short-term forecasts and rating their confidence"),
        t("Kuch va vositalarni joylashtirish bo'yicha taklif tayyorlash", "Подготовка предложений по расстановке сил и средств", "Proposing deployment of personnel and resources"),
        t("Profilaktik choralar samaradorligini baholash", "Оценка эффективности профилактических мер", "Evaluating prevention effectiveness"),
      ],
    },
    {
      id: "th-f4",
      title: t("Tahliliy hujjatlar tayyorlash", "Подготовка аналитических документов", "Producing analytical products"),
      tasks: [
        t("Rahbariyat uchun qisqa va aniq tahliliy ma'lumotnoma yozish", "Написание краткой и точной аналитической справки для руководства", "Writing concise briefs for leadership"),
        t("Grafik va xaritalar bilan vizual taqdimot tayyorlash", "Подготовка визуальной презентации с графиками и картами", "Preparing visual presentations with charts and maps"),
        t("Maxfiylik va shaxsga doir ma'lumotlar himoyasiga rioya qilish", "Соблюдение конфиденциальности и защиты персональных данных", "Respecting confidentiality and personal-data protection"),
      ],
    },
  ],
  knowledge: [
    t("Huquqiy statistika usullari va ko'rsatkichlar tizimi", "Методы правовой статистики и система показателей", "Legal statistics methods and indicator systems"),
    t("Kriminologiya asoslari va jinoyatchilik omillari", "Основы криминологии и факторы преступности", "Criminology and crime factors"),
    t("Geoaxborot tizimlari va makon tahlili", "Геоинформационные системы и пространственный анализ", "GIS and spatial analysis"),
    t("Prognozlash usullari va ularning cheklovlari", "Методы прогнозирования и их ограничения", "Forecasting methods and their limitations"),
    t("Tezkor-qidiruv faoliyati va axborot ta'minoti asoslari", "Основы ОРД и информационного обеспечения", "Operational-search activity and information support"),
    t("Shaxsga doir ma'lumotlarni qayta ishlash qoidalari", "Правила обработки персональных данных", "Rules for processing personal data"),
  ],
  skills: [
    t("Jadvallar bilan ishlash va ko'rsatkichlarni hisoblash (o'sish, ulush, o'rtacha)", "Работа с таблицами и расчёт показателей (прирост, доля, среднее)", "Working with tables and computing rates, shares and averages"),
    t("Xaritada «issiq nuqtalar»ni aniqlash", "Выявление «горячих точек» на карте", "Identifying hotspots on a map"),
    t("Korrelyatsiya va sababiyatni farqlash", "Разграничение корреляции и причинности", "Distinguishing correlation from causation"),
    t("Qisqa, asosli xulosa va tavsiya yozish", "Написание кратких обоснованных выводов и рекомендаций", "Writing short, evidence-based conclusions"),
    t("Ma'lumotlarni vizuallashtirish", "Визуализация данных", "Data visualisation"),
    t("Noaniqlikni ochiq ko'rsatish", "Открытое указание неопределённости", "Stating uncertainty openly"),
  ],
  competencies: [
    {
      id: "tahlilchi.malumot",
      label: t("Ma'lumotlar sifati", "Качество данных", "Data quality"),
      description: t("Manbalarni tanlash, ma'lumotlarning to'liqligi va ishonchliligini tekshirish.", "Выбор источников, проверка полноты и достоверности данных.", "Selecting sources and validating completeness and reliability."),
      clusters: ["analitika", "kiber"],
      subjects: ["an-01", "an-04", "kib-06"],
    },
    {
      id: "tahlilchi.statistika",
      label: t("Statistik tahlil", "Статистический анализ", "Statistical analysis"),
      description: t("Ko'rsatkichlarni to'g'ri hisoblash, dinamikani solishtirish va xato talqinlardan qochish.", "Корректный расчёт показателей, сравнение динамики, избегание ложных интерпретаций.", "Correct computation, trend comparison and avoiding false interpretations."),
      clusters: ["analitika"],
      subjects: ["an-01", "an-02"],
    },
    {
      id: "tahlilchi.geo",
      label: t("Geotahlil", "Геоанализ", "Geospatial analysis"),
      description: t("Makon va vaqt bo'yicha o'choqlarni aniqlash va xaritada ko'rsatish.", "Выявление очагов по месту и времени и их отображение на карте.", "Identifying spatio-temporal hotspots and mapping them."),
      clusters: ["analitika"],
      subjects: ["an-03", "an-02"],
    },
    {
      id: "tahlilchi.prognoz",
      label: t("Prognozlash", "Прогнозирование", "Forecasting"),
      description: t("Tendensiyalar asosida asosli prognoz berish va xavflarni baholash.", "Обоснованный прогноз на основе тенденций и оценка рисков.", "Evidence-based forecasting and risk assessment."),
      clusters: ["analitika"],
      subjects: ["an-02", "an-06"],
    },
    {
      id: "tahlilchi.xulosa",
      label: t("Tahliliy xulosa", "Аналитический вывод", "Analytical conclusion"),
      description: t("Rahbariyat uchun qisqa, aniq va amaliy tavsiyali ma'lumotnoma tayyorlash.", "Краткая, точная справка с практическими рекомендациями для руководства.", "Short, precise briefs with actionable recommendations."),
      clusters: ["analitika", "protsessual"],
      subjects: ["an-04", "pr-04"],
    },
  ],
  levels: levels([
    t("Tayyor shablonlar bo'yicha ma'lumot yig'adi va jadval tuzadi.", "Собирает данные и составляет таблицы по шаблонам.", "Collects data and builds tables from templates."),
    t("Hudud bo'yicha mustaqil tahlil va xarita tayyorlaydi.", "Самостоятельно готовит анализ и карту по территории.", "Independently produces district analysis and maps."),
    t("Prognoz va kuchlarni joylashtirish bo'yicha tavsiya beradi.", "Даёт прогноз и рекомендации по расстановке сил.", "Provides forecasts and deployment recommendations."),
    t("Tahlil metodikasini ishlab chiqadi va respublika darajasida xulosa tayyorlaydi.", "Разрабатывает методику анализа и готовит выводы республиканского уровня.", "Designs analytical methodology and national-level assessments."),
  ]),
  education: [
    t("Oliy ta'lim (huquqshunoslik, statistika, matematika yoki axborot tizimlari)", "Высшее образование (право, статистика, математика или информационные системы)", "Higher education (law, statistics, mathematics or information systems)"),
    t("Axborot-tahlil xizmati uchun maxsus kurs", "Специальный курс информационно-аналитической службы", "Specialised analytics course"),
    t("GIS va ma'lumotlar tahlili vositalari bo'yicha malaka oshirish", "Повышение квалификации по ГИС и инструментам анализа данных", "Training in GIS and data-analysis tools"),
  ],
  practice: [
    { title: t("Tahlil bo'linmasida stajirovka", "Стажировка в аналитическом подразделении", "Analytics unit internship"), description: t("Oylik ma'lumotnoma tayyorlashda ishtirok etish.", "Участие в подготовке ежемесячной справки.", "Contributing to the monthly brief.") },
    { title: t("Hudud xaritasi loyihasi", "Проект карты территории", "District map project"), description: t("Bir tuman bo'yicha o'choqlar xaritasi va tavsiyalar.", "Карта очагов и рекомендации по одному району.", "Hotspot map and recommendations for one district.") },
    { title: t("Kasb simulyatori", "Профессиональный симулятор", "Profession simulator"), description: t("Statistika, issiqlik xaritasi va prognoz topshiriqlari.", "Задания по статистике, тепловой карте и прогнозу.", "Tasks on statistics, heatmap and forecasting.") },
  ],
  legalBasis: [
    { lawKey: "lawPolice" },
    { lawKey: "lawPrevention" },
    { title: t("«Shaxsga doir ma'lumotlar to'g'risida»gi Qonun", "Закон «О персональных данных»", "Law on Personal Data") },
    { title: t("«Tezkor-qidiruv faoliyati to'g'risida»gi Qonun", "Закон «Об оперативно-розыскной деятельности»", "Law on Operational-Search Activity") },
  ],
  assessment: [
    t("Kasb simulyatori natijalari", "Результаты профессионального симулятора", "Profession simulator results"),
    t("Tahliliy ma'lumotnoma sifati (aniqlik, asoslilik, qisqalik)", "Качество аналитической справки (точность, обоснованность, краткость)", "Quality of the analytical brief (accuracy, grounding, brevity)"),
    t("Prognozlarning amalda tasdiqlanishi", "Подтверждаемость прогнозов на практике", "How often forecasts hold up"),
    t("Rahbariyat bahosi", "Оценка руководства", "Leadership feedback"),
  ],
  career: [
    { title: t("Tahlilchi-stajyor", "Аналитик-стажёр", "Trainee analyst"), requirement: t("Maxsus kurs", "Спецкурс", "Specialised course") },
    { title: t("Tahlilchi", "Аналитик", "Analyst"), requirement: t("«Asosiy» daraja", "Уровень «Базовый»", "«Core» level") },
    { title: t("Katta tahlilchi", "Старший аналитик", "Senior analyst"), requirement: t("«Ilg'or» daraja", "Уровень «Продвинутый»", "«Advanced» level") },
    { title: t("Bosh tahlilchi", "Главный аналитик", "Lead analyst"), requirement: t("«Ekspert» daraja", "Уровень «Экспертный»", "«Expert» level") },
    { title: t("Axborot-tahlil bo'limi boshlig'i", "Начальник информационно-аналитического отдела", "Head of analytics"), requirement: t("Boshqaruv kursi", "Курс управления", "Management course") },
  ],
  clusters: ["analitika", "kiber", "huquqiy", "protsessual"],
  trainers: [],
};
