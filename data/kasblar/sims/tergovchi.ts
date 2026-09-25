import type { LocalizedText, ProfessionSim } from "../types";

/** uz, ru, en (optional). */
const L = (uz: string, ru: string, en?: string): LocalizedText => (en ? { uz, ru, en } : { uz, ru });

/**
 * T-01 — Tergovchi: turar joydan o'g'irlik bo'yicha jinoyat ishi.
 * Muhit: jinoyat ishi papkasi (case_file). Asosiy "tuzoq" — tintuv bayonnomasidagi
 * protsessual nuqsonlar: tergovchi ularni ko'rmasa, ashyoviy dalil sudda maqbul
 * deb topilmasligi mumkin. Huquqiy havolalar: faqat data/sops/laws.ts dagi
 * tasdiqlangan moddalar (JK 169, JK 168) yoki kodeks nomi.
 */
export const SIM_TERGOVCHI: ProfessionSim = {
  id: "sim-tergovchi-01",
  professionId: "tergovchi",
  code: "T-01",
  title: L(
    "Kvartira o'g'irligi: nuqsonli tintuv bayonnomasi",
    "Кража из квартиры: дефектный протокол обыска",
    "Apartment burglary: a flawed search record"
  ),
  setting: L(
    "Tuman IIB tergov bo'limi, jinoyat ishi №T-2417",
    "Следственный отдел РУВД, уголовное дело №Т-2417",
    "District police investigation unit, criminal case No. T-2417"
  ),
  env: "case_file",
  intro: L(
    "Siz jinoyat ishini hamkasbingizdan qabul qilib oldingiz. Jabrlanuvchining kvartirasidan noutbuk, oltin taqinchoqlar va naqd pul o'g'irlangan. Tezkor guruh gumon qilinuvchining uyida tintuv o'tkazib, o'g'irlangan deb taxmin qilingan buyumlarni topgan. Ish papkasini sinchiklab o'rganing: har bir protsessual qaroringiz ishning sudgacha yetib borishiga ta'sir qiladi.",
    "Вы приняли уголовное дело от коллеги. Из квартиры потерпевшей похищены ноутбук, золотые украшения и наличные. Оперативная группа провела обыск у подозреваемого и изъяла вещи, предположительно похищенные. Внимательно изучите материалы дела: каждое ваше процессуальное решение влияет на то, дойдёт ли дело до суда.",
    "You have taken over a criminal case from a colleague. A laptop, gold jewellery and cash were stolen from the victim's flat. The operational team searched the suspect's home and seized items believed to be stolen. Study the case file carefully: every procedural decision affects whether the case reaches court."
  ),
  minutes: 25,
  stages: [
    /* 1 ------------------------------------------------------------ */
    {
      id: "t1-facts",
      title: L("Ish materiallari bilan tanishish", "Ознакомление с материалами дела", "Reviewing the case file"),
      brief: L(
        "Papkadagi dastlabki hujjatlarni o'qing. Tergovchi birinchi navbatda nima ANIQLANGANINI va nima hali FAQAT TAXMIN ekanini ajrata olishi kerak.",
        "Прочитайте первичные документы. Следователь прежде всего должен отделить то, что УСТАНОВЛЕНО, от того, что пока лишь ПРЕДПОЛОЖЕНИЕ.",
        "Read the first documents. An investigator must first separate what is ESTABLISHED from what is still only an ASSUMPTION."
      ),
      materials: [
        {
          id: "t-ariza",
          kind: "application",
          title: L("Jabrlanuvchining arizasi", "Заявление потерпевшей"),
          body: L(
            "Men, Karimova Dilnoza, 12-sentabr kuni soat 09:00 da ishga ketib, 18:30 da qaytganimda kvartiram eshigi yopiq, lekin balkon oynasi ochiq ekanini ko'rdim. Uydan «Lenovo» noutbuki, oltin bilaguzuk va ikkita uzuk, shkafdagi 4 500 000 so'm naqd pul yo'qolgan. Kimdir balkon orqali kirgan deb o'ylayman. Qo'shnimning o'g'li Sardor oldin bir necha marta uyimizga kelib ketgan, u bo'lishi mumkin.",
            "Я, Каримова Дилноза, 12 сентября ушла на работу в 09:00, вернулась в 18:30: входная дверь была заперта, но окно балкона открыто. Пропали ноутбук «Lenovo», золотой браслет и два кольца, 4 500 000 сумов наличными из шкафа. Думаю, кто-то проник через балкон. Сын соседа Сардор раньше несколько раз бывал у нас, возможно, это он."
          ),
          meta: [
            { label: L("Ro'yxatga olingan", "Зарегистрировано"), value: "12.09, 19:05" },
            { label: L("Qavat", "Этаж"), value: "2" },
          ],
        },
        {
          id: "t-kozdan",
          kind: "document",
          title: L("Voqea joyini ko'zdan kechirish bayonnomasi", "Протокол осмотра места происшествия"),
          body: L(
            "Ko'zdan kechirish 12-sentabr 19:40–21:10 da, xolislar ishtirokida o'tkazildi. Balkon romining tashqi tomonida qo'l izlari aniqlanib, daktiloskopik plyonkaga olindi (3 ta plyonka). Balkon ostidagi tuproqda poyabzal izi (42–43 o'lcham) suratga olindi. Kirish eshigi qulfida buzish izlari yo'q. Shkaf tortmasi ochiq, narsalar sochilgan.",
            "Осмотр проведён 12 сентября 19:40–21:10 с участием понятых. На внешней стороне балконной рамы обнаружены следы рук, откопированы на дактилоплёнку (3 плёнки). На грунте под балконом сфотографирован след обуви (42–43 размер). Следов взлома на замке входной двери нет. Ящик шкафа открыт, вещи разбросаны."
          ),
        },
        {
          id: "t-guvoh",
          kind: "document",
          title: L("Guvoh so'roq bayonnomasi (qo'shni)", "Протокол допроса свидетеля (соседка)"),
          body: L(
            "Guvoh Rahimova M.: «Soat 14:00 atrofida hovlida bo'y-basti baland, qora kurtkali yigitni ko'rdim, qo'lida katta sumka bor edi. Yuzini aniq ko'rmadim. Sardorga o'xshardi, lekin aniq ayta olmayman».",
            "Свидетель Рахимова М.: «Около 14:00 видела во дворе высокого парня в чёрной куртке с большой сумкой. Лица чётко не разглядела. Похож на Сардора, но точно сказать не могу»."
          ),
        },
      ],
      task: {
        kind: "multi",
        prompt: L(
          "Qaysi holatlar materiallar bilan ANIQLANGAN (taxmin emas)? Barcha to'g'ri javoblarni belgilang.",
          "Какие обстоятельства УСТАНОВЛЕНЫ материалами (а не предполагаются)? Отметьте все верные."
        ),
        options: [
          {
            id: "a",
            text: L("Balkon romining tashqi tomonida qo'l izlari bor va ular qayd etilgan", "На внешней стороне балконной рамы есть следы рук, они зафиксированы"),
            correct: true,
          },
          {
            id: "b",
            text: L("Kirish eshigi qulfida buzish izlari yo'q", "На замке входной двери нет следов взлома"),
            correct: true,
          },
          {
            id: "c",
            text: L("Jinoyatni qo'shnining o'g'li Sardor sodir etgan", "Преступление совершил сын соседа Сардор"),
            correct: false,
            feedback: L(
              "Bu — jabrlanuvchining taxmini, guvoh ham aniq tanimagan. Hali dalil emas, tekshiriladigan versiya.",
              "Это предположение потерпевшей, свидетель тоже не опознала уверенно. Это версия для проверки, а не доказательство."
            ),
          },
          {
            id: "d",
            text: L("Soat 14:00 atrofida hovlida sumkali yigit ko'rilgan", "Около 14:00 во дворе видели парня с сумкой"),
            correct: true,
          },
          {
            id: "e",
            text: L("Jinoyatchi balkon orqali kirgan", "Преступник проник через балкон"),
            correct: false,
            feedback: L(
              "Kuchli versiya (izlar, ochiq oyna), lekin hali ekspertiza va boshqa dalillar bilan tasdiqlanmagan.",
              "Сильная версия (следы, открытое окно), но экспертизой и другими доказательствами ещё не подтверждена."
            ),
          },
          {
            id: "f",
            text: L("O'g'irlangan pul miqdori aniq 4 500 000 so'm", "Сумма похищенного точно 4 500 000 сумов"),
            correct: false,
            feedback: L(
              "Hozircha bu faqat jabrlanuvchining bayoni; zarar miqdori so'roq va hujjatlar bilan aniqlanadi.",
              "Пока это лишь со слов потерпевшей; размер ущерба устанавливается допросом и документами."
            ),
          },
        ],
      },
      competencies: ["tergovchi.tahlil", "tergovchi.dalil"],
      consequence: L(
        "Taxminni fakt deb qabul qilgan tergovchi bitta versiyaga «yopishib» qoladi: haqiqiy jinoyatchi qidirilmaydi, ish esa sudda ayblov isbotlanmagani sababli qulaydi.",
        "Следователь, принявший предположение за факт, «зацикливается» на одной версии: настоящего преступника не ищут, а в суде обвинение разваливается как недоказанное."
      ),
    },

    /* 2 ------------------------------------------------------------ */
    {
      id: "t2-search",
      title: L("Tintuv bayonnomasini tekshirish", "Проверка протокола обыска", "Checking the search record"),
      brief: L(
        "Papkaga gumon qilinuvchi yashaydigan uydagi tintuv bayonnomasi qo'shildi. Uni protsessual talablar nuqtai nazaridan tekshiring.",
        "В дело подшит протокол обыска в жилище подозреваемого. Проверьте его на соответствие процессуальным требованиям.",
        "The record of the search at the suspect's home was added. Check it against procedural requirements."
      ),
      materials: [
        {
          id: "t-tintuv",
          kind: "document",
          title: L("Tintuv bayonnomasi (gumon qilinuvchi uyi)", "Протокол обыска (жилище подозреваемого)"),
          body: L(
            "Tintuv 13-sentabr kuni Sardor Aliyevning yashash joyida o'tkazildi. Tintuvni tezkor vakil N. o'tkazdi. Shkafdan noutbuk, oltin buyumlar va naqd pul topilib, olib qo'yildi. Gumon qilinuvchi bayonnomaga imzo qo'ymadi.\n\nQatnashchilar: tezkor vakil N., gumon qilinuvchi S. Aliyev.\nOlib qo'yilgan narsalar: «noutbuk — 1 dona, sariq metall buyumlar — bir nechta, pul — 4 mln atrofida».",
            "Обыск проведён 13 сентября по месту жительства Сардора Алиева. Проводил оперуполномоченный Н. Из шкафа изъяты ноутбук, золотые изделия и наличные. Подозреваемый протокол не подписал.\n\nУчастники: оперуполномоченный Н., подозреваемый С. Алиев.\nИзъято: «ноутбук — 1 шт., изделия из жёлтого металла — несколько, деньги — около 4 млн»."
          ),
          meta: [
            { label: L("Boshlangan vaqti", "Время начала"), value: "—" },
            { label: L("Tugagan vaqti", "Время окончания"), value: "—" },
            { label: L("Ruxsatnoma (sanksiya)", "Санкция / разрешение"), value: "— (ilova qilinmagan / не приложено)" },
          ],
          tone: "warn",
        },
      ],
      task: {
        kind: "multi",
        prompt: L(
          "Bayonnomadagi protsessual nuqsonlarni belgilang (bir nechta javob).",
          "Отметьте процессуальные дефекты протокола (несколько ответов)."
        ),
        options: [
          { id: "a", text: L("Xolislar ishtirok etmagan / ko'rsatilmagan", "Понятые не участвовали / не указаны"), correct: true },
          { id: "b", text: L("Tintuvning boshlanish va tugash vaqti yozilmagan", "Не указано время начала и окончания обыска"), correct: true },
          {
            id: "c",
            text: L("Olib qo'yilgan narsalarning individual belgilari (model, seriya raqami, vazni, soni, pul kupyuralari) yozilmagan", "Не описаны индивидуальные признаки изъятого (модель, серийный номер, вес, количество, купюры)"),
            correct: true,
          },
          {
            id: "d",
            text: L("Gumon qilinuvchining imzodan bosh tortgani va uning sababi belgilangan tartibda qayd etilmagan", "Отказ подозреваемого от подписи и его причина не оформлены надлежащим образом"),
            correct: true,
          },
          {
            id: "e",
            text: L("Turar joyda tintuv uchun qonunda belgilangan ruxsat (sanksiya) ilova qilinmagan", "Не приложено предусмотренное законом разрешение (санкция) на обыск в жилище"),
            correct: true,
          },
          {
            id: "f",
            text: L("Tintuvni tergovchi emas, tezkor vakil o'tkazgani — o'z-o'zidan nuqson", "Сам по себе дефект — обыск провёл не следователь, а оперуполномоченный"),
            correct: false,
            feedback: L(
              "Tezkor xodim tergovchining topshirig'i bilan tergov harakatini bajarishi mumkin. Nuqson — topshiriq hujjati yo'qligi bo'lishi mumkin, lekin xodimning o'zi emas.",
              "Оперативник может выполнять следственное действие по поручению следователя. Дефектом может быть отсутствие поручения, но не сама фигура сотрудника."
            ),
          },
          {
            id: "g",
            text: L("Bayonnoma qo'lda yozilgan", "Протокол написан от руки"),
            correct: false,
            feedback: L("Qo'lda yozilgan bayonnoma o'zi nuqson emas.", "Рукописный протокол сам по себе не дефект."),
          },
        ],
      },
      competencies: ["tergovchi.protsessual", "tergovchi.hujjat"],
      consequence: L(
        "Nuqsonlar ko'rilmasa, himoyachi sudda olib qo'yilgan narsalarni maqbul bo'lmagan dalil deb topishni so'raydi — va noutbuk ham, oltin ham ayblovning asosi bo'la olmaydi.",
        "Если дефекты не замечены, защитник в суде заявит о недопустимости изъятых предметов — и ни ноутбук, ни золото не смогут служить основой обвинения."
      ),
    },

    /* 3 ------------------------------------------------------------ */
    {
      id: "t3-admissibility",
      title: L("Dalil taqdiri bo'yicha qaror", "Решение о судьбе доказательства", "Deciding on the evidence"),
      brief: L(
        "Bo'lim boshlig'i so'raydi: «Tintuvdagi topilmalar bilan nima qilamiz?». Protsessual jihatdan to'g'ri yo'lni tanlang.",
        "Начальник отдела спрашивает: «Что делаем с изъятым при обыске?». Выберите процессуально правильный путь.",
        "The unit chief asks: \"What do we do with what was seized?\" Choose the procedurally correct path."
      ),
      materials: [],
      task: {
        kind: "choice",
        prompt: L("Qaysi qaror to'g'ri?", "Какое решение правильное?"),
        options: [
          {
            id: "a",
            text: L(
              "Bayonnomani xolislar va vaqtlarni qo'shib qayta yozdirib, sanani o'zgartirmaslik",
              "Переписать протокол, дописав понятых и время, сохранив прежнюю дату"
            ),
            score: 0,
            feedback: L(
              "Bu — hujjatni soxtalashtirish. Tergovchining o'zi javobgarlikka tortiladi, ish esa butunlay obro'sizlanadi.",
              "Это фальсификация документа. Ответственность понесёт сам следователь, а дело будет полностью скомпрометировано."
            ),
          },
          {
            id: "b",
            text: L(
              "Hech narsa qilmaslik: buyumlar topilgan — bu yetarli dalil",
              "Ничего не делать: вещи найдены — этого достаточно"
            ),
            score: 0,
            feedback: L(
              "Nuqsonli tergov harakati natijasi sudda maqbul deb topilmasligi mumkin. Ayblov bitta zaif dalilga qolib ketadi.",
              "Результат дефектного следственного действия может быть признан недопустимым. Обвинение останется на одном слабом доказательстве."
            ),
          },
          {
            id: "c",
            text: L(
              "Nuqsonlarni xizmat ma'lumotnomasida qayd etib, rahbar va nazorat qiluvchi prokurorga bildirish; ayblovni mustaqil, qonuniy olingan dalillar bilan mustahkamlash (jabrlanuvchini buyumlar belgilari bo'yicha so'roq qilish, tanib olish, ekspertiza, videokuzatuv)",
              "Зафиксировать дефекты в служебной справке, доложить руководителю и надзирающему прокурору; укреплять обвинение независимыми, законно полученными доказательствами (допрос потерпевшей о признаках вещей, опознание, экспертиза, видеозапись)"
            ),
            score: 3,
            feedback: L(
              "To'g'ri: nuqson yashirilmaydi, ayblov esa bitta shubhali dalilga bog'lanib qolmaydi.",
              "Верно: дефект не скрывается, а обвинение не зависит от одного сомнительного доказательства."
            ),
          },
          {
            id: "d",
            text: L(
              "Gumon qilinuvchidan zudlik bilan iqrorlik ko'rsatmasi olish — iqror bo'lsa, tintuv muhim emas",
              "Срочно получить от подозреваемого признательные показания — при признании обыск неважен"
            ),
            score: 1,
            feedback: L(
              "Iqror boshqa dalillar bilan tasdiqlanishi shart; himoyachisiz yoki bosim ostida olingan iqror yangi nuqson yaratadi.",
              "Признание должно подтверждаться иными доказательствами; признание без защитника или под давлением создаёт новый дефект."
            ),
          },
        ],
      },
      competencies: ["tergovchi.dalil", "tergovchi.protsessual"],
      consequence: L(
        "Noto'g'ri qaror ishni sudda qulashiga yoki xodimning o'ziga nisbatan xizmat tekshiruvi va jinoiy javobgarlikka olib keladi.",
        "Неверное решение ведёт к развалу дела в суде либо к служебной проверке и уголовной ответственности самого сотрудника."
      ),
    },

    /* 4 ------------------------------------------------------------ */
    {
      id: "t4-plan",
      title: L("Tergov harakatlari rejasi", "План следственных действий", "Investigation plan"),
      brief: L(
        "Endi mustaqil dalillar bazasini yarating. Harakatlarni to'g'ri ketma-ketlikda joylashtiring: avval yo'qolib ketishi mumkin bo'lgan izlar, keyin tanib olish tayyorgarligi.",
        "Теперь создайте базу независимых доказательств. Расставьте действия в правильной последовательности: сначала то, что может исчезнуть, затем подготовка опознания.",
        "Now build an independent evidence base. Put the actions in order: first what may disappear, then preparing identification."
      ),
      materials: [
        {
          id: "t-video",
          kind: "note",
          title: L("Tezkor ma'lumotnoma: videokuzatuv", "Оперативная справка: видеонаблюдение"),
          body: L(
            "Qo'shni do'kon kamerasi hovli kirish yo'lagini qamrab oladi. Egasi: «Yozuv 7 kun saqlanadi, keyin avtomatik o'chadi». Bugun — 15-sentabr.",
            "Камера соседнего магазина охватывает въезд во двор. Владелец: «Запись хранится 7 дней, затем автоматически стирается». Сегодня 15 сентября."
          ),
          tone: "warn",
        },
      ],
      task: {
        kind: "order",
        prompt: L("Harakatlarni bajarilish tartibida joylashtiring.", "Расположите действия в порядке выполнения."),
        items: [
          { id: "cctv", text: L("Videokuzatuv yozuvini belgilangan tartibda olib qo'yish", "Изъять видеозапись в установленном порядке") },
          { id: "victim", text: L("Jabrlanuvchini buyumlarning individual belgilari bo'yicha qo'shimcha so'roq qilish", "Дополнительно допросить потерпевшую об индивидуальных признаках вещей") },
          { id: "ident", text: L("Buyumlarni tanib olish uchun ko'rsatish (o'xshash buyumlar qatorida)", "Предъявить вещи для опознания (в ряду сходных предметов)") },
          { id: "expert", text: L("Qo'l izlari va gumon qilinuvchi namunalari bo'yicha daktiloskopik ekspertiza tayinlash", "Назначить дактилоскопическую экспертизу следов рук и образцов подозреваемого") },
          { id: "suspect", text: L("Gumon qilinuvchini himoyachi ishtirokida so'roq qilish", "Допросить подозреваемого с участием защитника") },
        ],
        correct: ["cctv", "victim", "ident", "expert", "suspect"],
      },
      competencies: ["tergovchi.taktika"],
      consequence: L(
        "Videoyozuv o'chib ketdi, tanib olish esa jabrlanuvchi oldindan belgilarni aytmasdan o'tkazildi — ikkala dalil ham yo'qotildi yoki obro'sizlandi.",
        "Видеозапись стёрлась, а опознание провели до допроса о приметах — оба доказательства утрачены или скомпрометированы."
      ),
    },

    /* 5 ------------------------------------------------------------ */
    {
      id: "t5-link",
      title: L("Dalillarni faktlarga bog'lash", "Связь доказательств с фактами", "Linking evidence to facts"),
      brief: L(
        "Yangi dalillar kelib tushdi. Har bir dalil qaysi holatni isbotlashini aniqlang.",
        "Поступили новые доказательства. Определите, какое обстоятельство доказывает каждое из них.",
        "New evidence has arrived. Decide which circumstance each piece proves."
      ),
      materials: [
        {
          id: "t-ekspert",
          kind: "document",
          title: L("Ekspert xulosasi (daktiloskopiya)", "Заключение эксперта (дактилоскопия)"),
          body: L(
            "Balkon romidan olingan 3 ta plyonkadagi qo'l izlaridan 2 tasi S. Aliyevning o'ng qo'l ko'rsatkich va o'rta barmoqlari izlari bilan bir xil.",
            "Из 3 плёнок со следами рук с балконной рамы 2 следа идентичны отпечаткам указательного и среднего пальцев правой руки С. Алиева."
          ),
        },
        {
          id: "t-kadr",
          kind: "photo",
          title: L("Videoyozuvdan kadr", "Кадр видеозаписи"),
          body: L(
            "12-sentabr, 13:52 — qora kurtkali, sport sumkali shaxs hovliga kiradi; 14:31 — chiqadi, sumka to'la.",
            "12 сентября, 13:52 — лицо в чёрной куртке со спортивной сумкой входит во двор; 14:31 — выходит, сумка заполнена."
          ),
        },
        {
          id: "t-lombard",
          kind: "document",
          title: L("Lombard kvitansiyasi", "Квитанция ломбарда"),
          body: L(
            "13-sentabr, 10:15 — S. Aliyev pasporti bilan oltin uzuk topshirilgan (583 proba, 3,2 g).",
            "13 сентября, 10:15 — по паспорту С. Алиева сдано золотое кольцо (583 проба, 3,2 г)."
          ),
        },
        {
          id: "t-jabr2",
          kind: "document",
          title: L("Jabrlanuvchining qo'shimcha so'rovi", "Дополнительный допрос потерпевшей"),
          body: L(
            "Noutbuk seriya raqami — PF3K8L2 (qutisi saqlangan). Uzuklardan birida ichki tomonida «D.K.» yozuvi bor. Pul 100 000 so'mlik kupyuralarda edi.",
            "Серийный номер ноутбука — PF3K8L2 (коробка сохранилась). На одном из колец внутри гравировка «D.K.». Деньги были купюрами по 100 000 сумов."
          ),
        },
      ],
      task: {
        kind: "match",
        prompt: L("Har bir dalilni u isbotlaydigan holat bilan bog'lang.", "Соедините каждое доказательство с обстоятельством, которое оно доказывает."),
        left: [
          { id: "fp", text: L("Daktiloskopik ekspert xulosasi", "Заключение дактилоскопической экспертизы") },
          { id: "cctv", text: L("Videoyozuv kadri", "Кадр видеозаписи") },
          { id: "pawn", text: L("Lombard kvitansiyasi", "Квитанция ломбарда") },
          { id: "serial", text: L("Noutbuk qutisidagi seriya raqami", "Серийный номер на коробке ноутбука") },
        ],
        right: [
          { id: "presence", text: L("Gumon qilinuvchi aynan kirish joyida (balkonda) bo'lgan", "Подозреваемый находился именно на месте проникновения (балкон)") },
          { id: "time", text: L("Jinoyat sodir etilgan vaqt oralig'i", "Временной интервал совершения преступления") },
          { id: "disposal", text: L("O'g'irlangan narsani tasarruf etish (sotish)", "Распоряжение похищенным (сбыт)") },
          { id: "identity", text: L("Topilgan noutbuk aynan jabrlanuvchiniki ekanligi", "Изъятый ноутбук принадлежит именно потерпевшей") },
        ],
        pairs: [
          ["fp", "presence"],
          ["cctv", "time"],
          ["pawn", "disposal"],
          ["serial", "identity"],
        ],
      },
      competencies: ["tergovchi.dalil", "tergovchi.tahlil"],
      consequence: L(
        "Dalillar qaysi faktni isbotlashi aniq ko'rsatilmasa, ayblov xulosasida «bo'shliq» qoladi va sud ishni qo'shimcha tergovga qaytaradi.",
        "Если не показано, какой факт доказывает каждое доказательство, в обвинительном заключении остаётся «пробел», и суд возвращает дело на дополнительное расследование."
      ),
    },

    /* 6 ------------------------------------------------------------ */
    {
      id: "t6-qualify",
      title: L("Qilmishni kvalifikatsiya qilish", "Квалификация деяния", "Qualifying the act"),
      brief: L(
        "Dalillar to'plandi. Qilmishni to'g'ri kvalifikatsiya qiling.",
        "Доказательства собраны. Дайте деянию правильную квалификацию.",
        "Evidence is collected. Qualify the act correctly."
      ),
      materials: [],
      task: {
        kind: "choice",
        prompt: L("Qilmish qanday kvalifikatsiya qilinadi?", "Как квалифицируется деяние?"),
        options: [
          {
            id: "a",
            text: L("O'g'irlik — JK 169-modda (turar joyga g'ayriqonuniy kirib, yashirin talon-taroj)", "Кража — ст. 169 УК (тайное хищение с незаконным проникновением в жилище)"),
            score: 3,
            feedback: L(
              "To'g'ri: mulk yashirin talon-taroj qilingan, jabrlanuvchi yo'q paytda, balkon orqali turar joyga kirilgan. Kvalifikatsiya qiluvchi belgilarni moddaning amaldagi tahriridan aniq ko'rsating.",
              "Верно: тайное хищение в отсутствие потерпевшей, с проникновением в жилище через балкон. Квалифицирующие признаки указывайте по действующей редакции статьи."
            ),
          },
          {
            id: "b",
            text: L("Firibgarlik — JK 168-modda", "Мошенничество — ст. 168 УК"),
            score: 0,
            feedback: L(
              "Firibgarlikda mulk aldov yoki ishonchni suiiste'mol qilish yo'li bilan egasining «ixtiyori» bilan beriladi. Bu yerda aldov yo'q.",
              "При мошенничестве имущество передаётся владельцем «добровольно» под влиянием обмана или злоупотребления доверием. Здесь обмана нет."
            ),
          },
          {
            id: "c",
            text: L("Ochiq talon-taroj (talonchilik)", "Открытое хищение (грабёж)"),
            score: 0,
            feedback: L(
              "Talonchilik — boshqalar ko'z o'ngida ochiq olish. Uyda hech kim bo'lmagan: talon-taroj yashirin.",
              "Грабёж — открытое изъятие на глазах у других. Дома никого не было: хищение тайное."
            ),
          },
          {
            id: "d",
            text: L("Hozircha kvalifikatsiya qilmaslik — gumon qilinuvchi iqror bo'lguncha kutish", "Пока не квалифицировать — ждать признания подозреваемого"),
            score: 1,
            feedback: L(
              "Kvalifikatsiya iqrorga emas, to'plangan dalillarga asoslanadi.",
              "Квалификация основывается на собранных доказательствах, а не на признании."
            ),
          },
        ],
      },
      competencies: ["tergovchi.tahlil", "tergovchi.protsessual"],
      consequence: L(
        "Noto'g'ri kvalifikatsiya ayblovni o'zgartirishga, ish muddatlarining cho'zilishiga va jabrlanuvchi huquqlarining buzilishiga olib keladi.",
        "Неверная квалификация ведёт к изменению обвинения, затягиванию сроков и нарушению прав потерпевшей."
      ),
    },

    /* 7 ------------------------------------------------------------ */
    {
      id: "t7-report",
      title: L("Rahbarga xizmat ma'lumotnomasi", "Служебная справка руководителю", "Memo to the chief"),
      brief: L(
        "Tergov bo'limi boshlig'iga qisqa xizmat ma'lumotnomasi yozing: tintuvdagi nuqsonlar, ularning oqibati va ayblovni qanday dalillar bilan mustahkamlayotganingiz.",
        "Напишите начальнику следственного отдела краткую служебную справку: дефекты обыска, их последствия и какими доказательствами вы укрепляете обвинение.",
        "Write a short memo to the head of the investigation unit: the search defects, their consequences and which evidence strengthens the case."
      ),
      materials: [],
      task: {
        kind: "text",
        prompt: L(
          "Xizmat ma'lumotnomasining asosiy qismini yozing (kamida 60 so'z).",
          "Напишите основную часть служебной справки (не менее 60 слов)."
        ),
        rubric: [
          L("Tintuv bayonnomasidagi aniq nuqsonlarni sanab o'tadi (xolislar, vaqt, buyumlar tavsifi, imzo rad etilishi, ruxsatnoma)", "Перечисляет конкретные дефекты протокола обыска (понятые, время, описание вещей, отказ от подписи, санкция)"),
          L("Oqibatini ko'rsatadi: olib qo'yilgan narsalar maqbul dalil deb topilmasligi xavfi", "Указывает последствие: риск признания изъятого недопустимым доказательством"),
          L("Mustaqil dalillarni sanaydi: ekspert xulosasi, videoyozuv, lombard kvitansiyasi, seriya raqami / tanib olish", "Перечисляет независимые доказательства: заключение эксперта, видеозапись, квитанция ломбарда, серийный номер / опознание"),
          L("Hujjatni «qayta yozish» yoki soxtalashtirish taklif qilmaydi; nazorat qiluvchi prokurorga xabar berishni eslatadi", "Не предлагает «переписать» документ или фальсифицировать; упоминает доклад надзирающему прокурору"),
          L("Rasmiy uslub, qisqa va tushunarli", "Официальный стиль, кратко и ясно"),
        ],
        minWords: 60,
        model: L(
          "Tergov bo'limi boshlig'iga. №T-2417 jinoyat ishi bo'yicha 13-sentabrda S. Aliyevning turar joyida o'tkazilgan tintuv bayonnomasida quyidagi nuqsonlar aniqlandi: xolislar ko'rsatilmagan, tintuvning boshlanish va tugash vaqti yozilmagan, olib qo'yilgan narsalarning individual belgilari (model, seriya raqami, vazn, kupyuralar) tavsiflanmagan, gumon qilinuvchining imzodan bosh tortishi belgilangan tartibda rasmiylashtirilmagan, turar joyda tintuv uchun ruxsatnoma ilova qilinmagan. Ushbu nuqsonlar olib qo'yilgan narsalarning sudda maqbul dalil deb topilmasligiga olib kelishi mumkin. Shu sababli ayblov mustaqil dalillar bilan mustahkamlandi: daktiloskopik ekspertiza xulosasi (balkon romidagi izlar S. Aliyevga tegishli), 12-sentabr 13:52–14:31 dagi videoyozuv, lombard kvitansiyasi (13-sentabr), jabrlanuvchining noutbuk seriya raqami va uzukdagi yozuv haqidagi ko'rsatmasi, tanib olish natijalari. Nuqsonlar haqida nazorat qiluvchi prokurorga axborot berildi. Tergovchi: ___",
          "Начальнику следственного отдела. По уголовному делу №Т-2417 в протоколе обыска от 13 сентября в жилище С. Алиева выявлены дефекты: не указаны понятые, не отражено время начала и окончания, не описаны индивидуальные признаки изъятого (модель, серийный номер, вес, купюры), отказ подозреваемого от подписи не оформлен надлежащим образом, не приложено разрешение на обыск в жилище. Эти дефекты могут повлечь признание изъятого недопустимым доказательством. Поэтому обвинение укреплено независимыми доказательствами: заключение дактилоскопической экспертизы (следы на балконной раме принадлежат С. Алиеву), видеозапись 12 сентября 13:52–14:31, квитанция ломбарда (13 сентября), показания потерпевшей о серийном номере ноутбука и гравировке на кольце, результаты опознания. О дефектах проинформирован надзирающий прокурор. Следователь: ___"
        ),
      },
      competencies: ["tergovchi.hujjat", "tergovchi.protsessual"],
      consequence: L(
        "Nuqsonlar yashirilgan ma'lumotnoma keyinchalik prokuror tekshiruvida aniqlanadi — bu tergovchiga nisbatan intizomiy choralarga va ishning qayta tergovga qaytarilishiga olib keladi.",
        "Справка, скрывающая дефекты, вскрывается при прокурорской проверке — это ведёт к дисциплинарным мерам в отношении следователя и возврату дела на доследование."
      ),
    },
  ],
};
