import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const qutqaruvchi: ProfessionStandard = {
  id: "qutqaruvchi",
  agencies: ["fvv"],
  icon: "Flame",
  title: t("Qutqaruvchi / yong'in xavfsizligi inspektori", "Спасатель / инспектор пожарной безопасности", "Rescuer / fire-safety inspector"),
  short: t(
    "Favqulodda vaziyatlarda xavfni baholaydi, aholini evakuatsiya qiladi, jabrlanganlarga birinchi yordam ko'rsatadi va yong'in xavfsizligi talablarini nazorat qiladi.",
    "Оценивает опасность в ЧС, эвакуирует население, оказывает первую помощь пострадавшим и контролирует требования пожарной безопасности.",
    "Assesses hazards in emergencies, evacuates people, gives first aid and enforces fire-safety requirements."
  ),
  functions: [
    {
      id: "qt-f1",
      title: t("Vaziyatni razvedka qilish va xavfni baholash", "Разведка и оценка обстановки", "Reconnaissance and hazard assessment"),
      tasks: [
        t("Yong'in, qulash yoki kimyoviy xavf manbasini aniqlash", "Определение источника пожара, обрушения или химической опасности", "Identifying the source of fire, collapse or chemical hazard"),
        t("Odamlar borligi va ularning joylashuvini aniqlash", "Установление наличия и местонахождения людей", "Locating people at risk"),
        t("Shaxsiy himoya vositalarini tanlash", "Выбор средств индивидуальной защиты", "Selecting personal protective equipment"),
      ],
    },
    {
      id: "qt-f2",
      title: t("Qutqaruv va evakuatsiya", "Спасение и эвакуация", "Rescue and evacuation"),
      tasks: [
        t("Evakuatsiya yo'llarini belgilash va ustuvorlikni aniqlash (bolalar, nogironligi bor shaxslar)", "Определение путей эвакуации и приоритетов (дети, лица с инвалидностью)", "Setting evacuation routes and priorities (children, persons with disabilities)"),
        t("Qamalib qolganlarni xavfsiz qutqarish", "Безопасное спасение заблокированных людей", "Safely rescuing trapped people"),
        t("Olomonni boshqarish va vahimaning oldini olish", "Управление людьми и предотвращение паники", "Managing people and preventing panic"),
      ],
    },
    {
      id: "qt-f3",
      title: t("Birinchi yordam", "Первая помощь", "First aid"),
      tasks: [
        t("Jabrlanganlarni triaj qilish", "Сортировка (триаж) пострадавших", "Triage of casualties"),
        t("Qon ketishini to'xtatish, yurak-o'pka reanimatsiyasi, kuyishda yordam", "Остановка кровотечения, СЛР, помощь при ожогах", "Bleeding control, CPR and burn care"),
        t("Jabrlanganni tez yordam brigadasiga topshirish", "Передача пострадавшего бригаде скорой помощи", "Handing over casualties to paramedics"),
      ],
    },
    {
      id: "qt-f4",
      title: t("Boshqaruv va yong'in xavfsizligi nazorati", "Управление и надзор за пожарной безопасностью", "Command and fire-safety supervision"),
      tasks: [
        t("Tezkor shtab bilan aloqa va kuchlarni muvofiqlashtirish", "Связь с оперативным штабом и координация сил", "Liaising with the incident command and coordinating resources"),
        t("Obyektlarda yong'in xavfsizligi talablariga rioya etilishini tekshirish", "Проверка соблюдения требований пожарной безопасности на объектах", "Inspecting facilities for fire-safety compliance"),
        t("Hodisa va tekshiruv natijalari bo'yicha dalolatnoma va hisobot tuzish", "Составление акта и отчёта по итогам происшествия и проверки", "Drafting incident and inspection reports"),
      ],
    },
  ],
  knowledge: [
    t("Favqulodda vaziyatlar tasnifi va javob choralari tizimi", "Классификация ЧС и система реагирования", "Classification of emergencies and the response system"),
    t("Yong'in xavfsizligi talablari va yong'in rivojlanish qonuniyatlari", "Требования пожарной безопасности и закономерности развития пожара", "Fire-safety requirements and fire dynamics"),
    t("Qidiruv-qutqaruv ishlari texnologiyasi va texnikasi", "Технология и техника аварийно-спасательных работ", "Search-and-rescue techniques and equipment"),
    t("Xavfli moddalar va shaxsiy himoya vositalari", "Опасные вещества и средства индивидуальной защиты", "Hazardous materials and PPE"),
    t("Birinchi yordam protokollari va triaj", "Протоколы первой помощи и сортировка", "First-aid protocols and triage"),
    t("Tezkor boshqaruv tuzilmasi va aloqa qoidalari", "Структура оперативного управления и правила связи", "Incident command structure and communications"),
  ],
  skills: [
    t("Xavfni tez va tizimli baholash", "Быстрая и системная оценка опасности", "Rapid, systematic hazard assessment"),
    t("Qutqaruv asbob-uskunalari bilan ishlash", "Работа со спасательным оборудованием", "Operating rescue equipment"),
    t("Yurak-o'pka reanimatsiyasi va qon ketishini to'xtatish", "СЛР и остановка кровотечения", "CPR and bleeding control"),
    t("Qo'rqib ketgan odamlarni tinchlantirish va yo'naltirish", "Успокоение и направление испуганных людей", "Calming and directing frightened people"),
    t("Guruhda aniq buyruq va hisobot bilan ishlash", "Работа в группе с чёткими командами и докладами", "Clear commands and reporting within a team"),
    t("Yong'in xavfsizligi tekshiruvi dalolatnomasini tuzish", "Составление акта проверки пожарной безопасности", "Writing fire-safety inspection reports"),
  ],
  competencies: [
    {
      id: "qutqaruvchi.xavf_baholash",
      label: t("Xavfni baholash", "Оценка опасности", "Hazard assessment"),
      description: t("Xavf manbasi, rivojlanish ehtimoli va odamlarga tahdidni tez aniqlash.", "Быстрое определение источника, развития и угрозы людям.", "Quickly establishing the source, likely spread and threat to people."),
      clusters: ["maxsus", "analitika"],
      subjects: ["mx-07", "an-06"],
    },
    {
      id: "qutqaruvchi.evakuatsiya",
      label: t("Evakuatsiya va qutqaruv", "Эвакуация и спасение", "Evacuation and rescue"),
      description: t("Odamlarni to'g'ri ustuvorlik bilan, xavfsiz yo'llar orqali olib chiqish.", "Вывод людей с правильными приоритетами по безопасным путям.", "Moving people out by priority along safe routes."),
      clusters: ["maxsus"],
      subjects: ["mx-07", "mx-04"],
    },
    {
      id: "qutqaruvchi.birinchi_yordam",
      label: t("Birinchi yordam", "Первая помощь", "First aid"),
      description: t("Triaj va hayotni saqlab qolish choralarini protokolga mos bajarish.", "Сортировка и меры спасения жизни в соответствии с протоколом.", "Triage and life-saving measures according to protocol."),
      clusters: ["maxsus"],
      subjects: ["mx-06", "mx-08"],
    },
    {
      id: "qutqaruvchi.boshqaruv",
      label: t("Boshqaruv va aloqa", "Управление и связь", "Command and communication"),
      description: t("Kuchlarni muvofiqlashtirish, aniq buyruq va hisobot, aholi bilan muloqot.", "Координация сил, чёткие команды и доклады, общение с населением.", "Coordinating resources, clear commands and reports, communicating with the public."),
      clusters: ["maxsus", "huquqiy"],
      subjects: ["mx-07", "mx-02", "huq-05"],
    },
    {
      id: "qutqaruvchi.hujjat",
      label: t("Hujjatlashtirish", "Документирование", "Documentation"),
      description: t("Hodisa va yong'in xavfsizligi tekshiruvi natijalarini to'liq rasmiylashtirish.", "Полное оформление результатов происшествия и проверки пожарной безопасности.", "Complete records of incidents and fire-safety inspections."),
      clusters: ["protsessual"],
      subjects: ["pr-04", "pr-07"],
    },
  ],
  levels: levels([
    t("Bo'linma tarkibida komandir buyrug'i bilan harakat qiladi.", "Действует в составе подразделения по команде командира.", "Acts within the unit on the commander's orders."),
    t("Standart hodisalarda mustaqil vazifalarni bajaradi.", "Самостоятельно выполняет задачи на типовых происшествиях.", "Carries out tasks independently at routine incidents."),
    t("Qutqaruv guruhini boshqaradi, murakkab hodisalarda ishlaydi.", "Руководит спасательной группой, работает на сложных происшествиях.", "Leads a rescue team at complex incidents."),
    t("Hodisani boshqaradi (tezkor shtab), o'quv mashqlarini tashkil etadi.", "Руководит ликвидацией (оперативный штаб), организует учения.", "Commands incidents and organises training exercises."),
  ]),
  education: [
    t("O'rta maxsus yoki oliy ta'lim (yong'in xavfsizligi, FV muhofazasi)", "Среднее специальное или высшее образование (пожарная безопасность, защита в ЧС)", "Vocational or higher education (fire safety, civil protection)"),
    t("Qutqaruvchi attestatsiyasi va boshlang'ich tayyorgarlik", "Аттестация спасателя и первоначальная подготовка", "Rescuer certification and initial training"),
    t("Birinchi yordam bo'yicha muntazam qayta tayyorgarlik", "Регулярная переподготовка по первой помощи", "Regular first-aid recertification"),
  ],
  practice: [
    { title: t("Qutqaruv poligoni", "Спасательный полигон", "Rescue training ground"), description: t("Qamalib qolganlarni qutqarish va evakuatsiya mashqlari.", "Упражнения по спасению заблокированных и эвакуации.", "Drills in freeing trapped people and evacuation.") },
    { title: t("Yong'in-qutqaruv qismida stajirovka", "Стажировка в пожарно-спасательной части", "Fire-rescue station internship"), description: t("Real chaqiruvlarda murabbiy bilan ishtirok.", "Участие в реальных выездах с наставником.", "Responding to real calls with a mentor.") },
    { title: t("Kasb simulyatori", "Профессиональный симулятор", "Profession simulator"), description: t("Favqulodda vaziyat muhitida xavfni baholash, evakuatsiya va triaj.", "Оценка опасности, эвакуация и триаж в среде ЧС.", "Hazard assessment, evacuation and triage in a simulated emergency.") },
  ],
  legalBasis: [
    { title: t("«Aholini va hududlarni tabiiy hamda texnogen xususiyatli favqulodda vaziyatlardan muhofaza qilish to'g'risida»gi Qonun", "Закон «О защите населения и территорий от чрезвычайных ситуаций природного и техногенного характера»", "Law on Protection of the Population and Territories from Natural and Man-made Emergencies") },
    { title: t("«Yong'in xavfsizligi to'g'risida»gi Qonun", "Закон «О пожарной безопасности»", "Law on Fire Safety") },
    { title: t("Ma'muriy javobgarlik to'g'risidagi kodeks", "Кодекс об административной ответственности", "Code of Administrative Liability") },
  ],
  assessment: [
    t("Kasb simulyatori natijalari", "Результаты профессионального симулятора", "Profession simulator results"),
    t("Poligondagi normativlar (vaqt, xavfsizlik)", "Нормативы на полигоне (время, безопасность)", "Training-ground standards (time, safety)"),
    t("Birinchi yordam amaliy imtihoni", "Практический экзамен по первой помощи", "Practical first-aid exam"),
    t("Qutqaruvchi attestatsiya komissiyasi bahosi", "Оценка аттестационной комиссии спасателей", "Rescuer certification board assessment"),
  ],
  career: [
    { title: t("Qutqaruvchi-stajyor", "Спасатель-стажёр", "Trainee rescuer"), requirement: t("Boshlang'ich tayyorgarlik", "Первоначальная подготовка", "Initial training") },
    { title: t("Qutqaruvchi", "Спасатель", "Rescuer"), requirement: t("Attestatsiya, «Asosiy» daraja", "Аттестация, уровень «Базовый»", "Certification, «Core» level") },
    { title: t("Yong'in xavfsizligi inspektori", "Инспектор пожарной безопасности", "Fire-safety inspector"), requirement: t("«Ilg'or» daraja, nazorat kursi", "Уровень «Продвинутый», курс надзора", "«Advanced» level, inspection course") },
    { title: t("Qutqaruv guruhi komandiri", "Командир спасательной группы", "Rescue team leader"), requirement: t("«Ekspert» daraja", "Уровень «Экспертный»", "«Expert» level") },
    { title: t("Yong'in-qutqaruv qismi boshlig'i", "Начальник пожарно-спасательной части", "Station commander"), requirement: t("Boshqaruv kursi", "Курс управления", "Management course") },
  ],
  clusters: ["maxsus", "analitika", "huquqiy", "protsessual"],
  trainers: [],
};
