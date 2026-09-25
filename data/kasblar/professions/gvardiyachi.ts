import type { ProfessionStandard } from "../types";
import { levels, t } from "./_shared";

export const gvardiyachi: ProfessionStandard = {
  id: "gvardiyachi",
  agencies: ["gvardiya"],
  icon: "ShieldCheck",
  title: t("Milliy gvardiya xizmatchisi", "Военнослужащий Национальной гвардии", "National Guard serviceman"),
  short: t(
    "Muhim obyektlarni qo'riqlaydi, ommaviy tadbirlarda jamoat tartibini ta'minlaydi va qonun doirasida mutanosib kuch qo'llaydi.",
    "Охраняет важные объекты, обеспечивает общественный порядок на массовых мероприятиях и применяет силу соразмерно и в рамках закона.",
    "Guards key facilities, keeps public order at mass events and uses force lawfully and proportionately."
  ),
  functions: [
    {
      id: "gv-f1",
      title: t("Obyektlarni qo'riqlash", "Охрана объектов", "Facility protection"),
      tasks: [
        t("O'tkazish rejimini ta'minlash va hujjatlarni tekshirish", "Обеспечение пропускного режима и проверка документов", "Enforcing access control and checking documents"),
        t("Perimetrni kuzatish va xavfli belgilarni aniqlash", "Наблюдение за периметром и выявление признаков угрозы", "Monitoring the perimeter and spotting threat indicators"),
        t("Qo'riqlash postida signal va hodisalarga javob berish", "Реагирование на сигналы и происшествия на посту", "Responding to alarms and incidents at the post"),
      ],
    },
    {
      id: "gv-f2",
      title: t("Ommaviy tadbirlarda jamoat tartibi", "Общественный порядок на массовых мероприятиях", "Public order at mass events"),
      tasks: [
        t("Olomon oqimini boshqarish va xavfli to'planishning oldini olish", "Управление потоками людей и предотвращение опасной скученности", "Managing crowd flow and preventing dangerous crushes"),
        t("Nizoni muloqot orqali pasaytirish", "Снижение конфликта через общение", "De-escalating conflict through dialogue"),
        t("Tartibbuzarni qonuniy tartibda ushlab, IIVga topshirish", "Законное задержание нарушителя и передача в ОВД", "Lawfully detaining offenders and handing them to the police"),
      ],
    },
    {
      id: "gv-f3",
      title: t("Kuch va maxsus vositalarni qo'llash", "Применение силы и специальных средств", "Use of force and special means"),
      tasks: [
        t("Kuch qo'llash asoslari va chegaralarini baholash", "Оценка оснований и пределов применения силы", "Assessing grounds and limits for using force"),
        t("Oldindan ogohlantirish va mutanosiblik talabiga rioya qilish", "Предварительное предупреждение и соблюдение соразмерности", "Giving warning and keeping force proportionate"),
        t("Kuch qo'llanganidan keyin birinchi yordam va hisobot", "Первая помощь и рапорт после применения силы", "First aid and reporting after use of force"),
      ],
    },
    {
      id: "gv-f4",
      title: t("O'zaro hamkorlik", "Взаимодействие", "Inter-agency cooperation"),
      tasks: [
        t("IIV, FVV va tez yordam bilan harakatlarni muvofiqlashtirish", "Координация с ОВД, МЧС и скорой помощью", "Coordinating with police, emergency services and ambulance"),
        t("Radio aloqa va ma'lumot uzatish qoidalariga rioya qilish", "Соблюдение правил радиосвязи и передачи информации", "Following radio and reporting protocols"),
        t("Navbatchilik yakunida hisobot topshirish", "Сдача рапорта по итогам дежурства", "Submitting an end-of-duty report"),
      ],
    },
  ],
  knowledge: [
    t("Milliy gvardiya vazifalari va xizmatchining huquq-majburiyatlari", "Задачи Национальной гвардии, права и обязанности военнослужащего", "National Guard mission and serviceman's rights and duties"),
    t("Jismoniy kuch, maxsus vositalar va o'qotar quroldan foydalanish shartlari", "Условия применения физической силы, спецсредств и огнестрельного оружия", "Conditions for using physical force, special means and firearms"),
    t("Qo'riqlash va o'tkazish rejimi tartibi", "Порядок охраны и пропускного режима", "Guard and access-control procedures"),
    t("Olomon psixologiyasi va ommaviy tadbirlar xavfsizligi", "Психология толпы и безопасность массовых мероприятий", "Crowd psychology and mass-event safety"),
    t("Ushlab turishda inson huquqlari kafolatlari", "Гарантии прав человека при задержании", "Human-rights safeguards during detention"),
    t("Birinchi tibbiy yordam asoslari", "Основы первой помощи", "First aid"),
  ],
  skills: [
    t("Vaziyatni kuzatib, xavfni erta aniqlash", "Наблюдение и раннее выявление угрозы", "Observation and early threat detection"),
    t("Qat'iy, lekin hurmatli buyruq va muloqot", "Твёрдое, но уважительное общение и команды", "Firm yet respectful commands and communication"),
    t("Qurolni xavfsiz boshqarish va aniq otish", "Безопасное обращение с оружием и меткая стрельба", "Safe weapon handling and accurate shooting"),
    t("Jismoniy ushlash usullari", "Приёмы физического задержания", "Physical restraint techniques"),
    t("Guruh tarkibida harakat qilish", "Действия в составе группы", "Operating as part of a team"),
    t("Qisqa va aniq rapport yozish", "Написание краткого и точного рапорта", "Writing short, accurate reports"),
  ],
  competencies: [
    {
      id: "gvardiyachi.qoriqlash",
      label: t("Qo'riqlash", "Охрана", "Protective duty"),
      description: t("O'tkazish rejimi, perimetr nazorati va postda hushyorlik.", "Пропускной режим, контроль периметра и бдительность на посту.", "Access control, perimeter monitoring and vigilance at the post."),
      clusters: ["maxsus"],
      subjects: ["mx-04"],
    },
    {
      id: "gvardiyachi.tartib",
      label: t("Jamoat tartibi", "Общественный порядок", "Public order"),
      description: t("Ommaviy tadbirlarda olomonni boshqarish va tartibbuzarlikka qonuniy javob.", "Управление толпой и законное реагирование на нарушения при массовых мероприятиях.", "Crowd management and lawful response to disorder at events."),
      clusters: ["maxsus", "huquqiy"],
      subjects: ["mx-04", "huq-03"],
    },
    {
      id: "gvardiyachi.kuch",
      label: t("Kuchni qonuniy qo'llash", "Законное применение силы", "Lawful use of force"),
      description: t("Kuch, maxsus vosita va quroldan faqat asos bo'lganda, ogohlantirib va mutanosib foydalanish.", "Применение силы, спецсредств и оружия только при наличии оснований, с предупреждением и соразмерно.", "Force, special means and firearms only with grounds, warning and proportionality."),
      clusters: ["maxsus", "huquqiy"],
      subjects: ["mx-05", "huq-01", "mx-06"],
    },
    {
      id: "gvardiyachi.muloqot",
      label: t("Muloqot va deeskalatsiya", "Коммуникация и деэскалация", "Communication and de-escalation"),
      description: t("Fuqarolar bilan xotirjam, qat'iy va hurmatli muloqot; nizoni so'z bilan pasaytirish.", "Спокойное, твёрдое и уважительное общение; снижение конфликта словом.", "Calm, firm, respectful communication; defusing conflict verbally."),
      clusters: ["maxsus"],
      subjects: ["mx-02", "mx-03"],
    },
    {
      id: "gvardiyachi.hamkorlik",
      label: t("O'zaro hamkorlik", "Взаимодействие", "Coordination"),
      description: t("Boshqa xizmatlar bilan aniq axborot almashish va birgalikda harakat qilish.", "Чёткий обмен информацией и совместные действия с другими службами.", "Clear information exchange and joint action with other services."),
      clusters: ["maxsus", "protsessual"],
      subjects: ["mx-07", "huq-05", "pr-04"],
    },
  ],
  levels: levels([
    t("Katta navbatchi nazoratida postda xizmat qiladi.", "Несёт службу на посту под контролем старшего наряда.", "Serves at a post under the shift leader."),
    t("Postda va tadbirda mustaqil harakat qiladi.", "Самостоятельно действует на посту и мероприятии.", "Acts independently at posts and events."),
    t("Guruhni boshqaradi, murakkab tadbirlarda harakatlarni muvofiqlashtiradi.", "Руководит группой, координирует действия на сложных мероприятиях.", "Leads a team and coordinates action at complex events."),
    t("Qo'riqlash va tartib rejalarini ishlab chiqadi, yosh xizmatchilarni o'qitadi.", "Разрабатывает планы охраны и порядка, обучает молодых военнослужащих.", "Plans security operations and trains new servicemen."),
  ]),
  education: [
    t("O'rta maxsus yoki oliy ta'lim", "Среднее специальное или высшее образование", "Vocational or higher education"),
    t("Milliy gvardiya o'quv markazida boshlang'ich tayyorgarlik", "Первоначальная подготовка в учебном центре Нацгвардии", "Initial training at the National Guard training centre"),
    t("Otish va jismoniy tayyorgarlik bo'yicha muntazam mashg'ulotlar", "Регулярные занятия по огневой и физической подготовке", "Regular firearms and physical training"),
  ],
  practice: [
    { title: t("Qo'riqlash postida stajirovka", "Стажировка на посту охраны", "Guard post internship"), description: t("Tajribali xizmatchi bilan navbatchilik.", "Дежурство с опытным военнослужащим.", "Duty alongside an experienced serviceman.") },
    { title: t("Otish tiri va taktik poligon", "Тир и тактический полигон", "Firing range and tactical ground"), description: t("Qaror qabul qilish bilan otish mashqlari.", "Стрельба с принятием решений.", "Shoot/no-shoot decision drills.") },
    { title: t("Ommaviy tadbir mashqi", "Учение на массовом мероприятии", "Mass-event exercise"), description: t("IIV va FVV bilan birgalikdagi o'quv tadbiri.", "Совместное учение с ОВД и МЧС.", "Joint drill with police and emergency services.") },
    { title: t("Kasb simulyatori", "Профессиональный симулятор", "Profession simulator"), description: t("Qo'riqlash posti va ommaviy tadbir muhitida qarorlar.", "Решения в среде поста охраны и массового мероприятия.", "Decisions at a simulated guard post and mass event.") },
  ],
  legalBasis: [
    { title: t("«Milliy gvardiya to'g'risida»gi Qonun", "Закон «О Национальной гвардии»", "Law on the National Guard") },
    { title: t("Ma'muriy javobgarlik to'g'risidagi kodeks", "Кодекс об административной ответственности", "Code of Administrative Liability") },
    { lawKey: "mjtkPettyHooliganism" },
    { lawKey: "jkHooliganism" },
    { lawKey: "lawPolice" },
  ],
  assessment: [
    t("Kasb simulyatori natijalari", "Результаты профессионального симулятора", "Profession simulator results"),
    t("Otish va jismoniy tayyorgarlik normativlari", "Нормативы огневой и физической подготовки", "Firearms and physical standards"),
    t("Tir-trenajyorda «otish/otmaslik» qarorlari", "Решения «стрелять/не стрелять» в тире-тренажёре", "Shoot/no-shoot decisions in the range trainer"),
    t("Qo'mondon bahosi", "Оценка командира", "Commander's assessment"),
  ],
  career: [
    { title: t("Xizmatchi (qatorda)", "Военнослужащий (рядовой состав)", "Guardsman"), requirement: t("Boshlang'ich tayyorgarlik", "Первоначальная подготовка", "Initial training") },
    { title: t("Katta navbatchi", "Старший наряда", "Shift leader"), requirement: t("«Asosiy» daraja", "Уровень «Базовый»", "«Core» level") },
    { title: t("Guruh komandiri", "Командир группы", "Team commander"), requirement: t("«Ilg'or» daraja, serjantlar kursi", "Уровень «Продвинутый», сержантский курс", "«Advanced» level, NCO course") },
    { title: t("Vzvod komandiri", "Командир взвода", "Platoon commander"), requirement: t("«Ekspert» daraja, ofitserlik tayyorgarligi", "Уровень «Экспертный», офицерская подготовка", "«Expert» level, officer training") },
  ],
  clusters: ["maxsus", "huquqiy", "protsessual"],
  trainers: ["/simulyator/muloqot", "/simulyator/tir"],
};
