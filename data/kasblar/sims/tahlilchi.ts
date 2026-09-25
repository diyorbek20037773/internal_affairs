import type { ProfessionSim } from "@/data/kasblar/types";

/**
 * A-01 «Navbahor, III chorak» — tuman bo'yicha jinoyatchilik statistikasi,
 * issiq nuqtalar, sabablar, prognoz, resurs taqsimoti va analitik xulosa.
 *
 * Raqamlar o'zaro mos (tekshirilgan):
 *  - oylik jami: iyun 40, iyul 45, avgust 60 → o'sish (60-40)/40 = 50 %
 *  - avgust mahalla jami (grid qatorlari yig'indisi): 8, 17, 3, 14, 6, 12 = 60
 *  - hotspotlar: Guliston 18–24 (10), Mehnat 18–24 (9), Sharq 12–18 (7);
 *    keyingi eng katta qiymat — 4, aniq uzilish bor.
 * Barcha mahalla nomlari va shaxslar — to'qima.
 */

const MAHALLAS = ["Bog'bon", "Guliston", "Istiqlol", "Mehnat", "Navro'z", "Sharq"];
const BANDS = ["00–06", "06–12", "12–18", "18–24"];

export const SIM_TAHLILCHI: ProfessionSim = {
  id: "sim-tahlilchi-01",
  professionId: "tahlilchi",
  code: "A-01",
  env: "analytics_map",
  minutes: 20,
  title: {
    uz: "Navbahor tumani: III chorak tahlili",
    ru: "Навбахорский район: анализ III квартала",
    en: "Navbahor district: Q3 crime analysis",
  },
  setting: {
    uz: "Tuman IIB axborot-tahlil guruhi. 2 sentyabr, 08:30. Boshliq kengash oldidan so'radi: «Avgustda nima bo'ldi va sentyabrda kuchlarni qayerga qo'yamiz?»",
    ru: "Информационно-аналитическая группа районного УВД. 2 сентября, 08:30. Начальник перед совещанием спросил: «Что произошло в августе и куда ставим силы в сентябре?»",
    en: "District police analysis unit. 2 September, 08:30. Before the briefing the chief asks: 'What happened in August, and where do we put our people in September?'",
  },
  intro: {
    uz: "Tumandagi oltita mahalla bo'yicha ko'cha jinoyatlari (o'g'irlik, talonchilik, bezorilik) statistikasi, avgust oyi bo'yicha sutka vaqti kesimidagi taqsimot va uchastka inspektorlarining ma'lumotnomalari sizda. Vazifa — ma'lumotni to'g'ri o'qish, issiq nuqtalarni topish, sabablarni tasodifiy moslikdan ajratish, prognoz berish va cheklangan kuchlarni asosli taqsimlash.",
    ru: "У вас статистика уличных преступлений (кражи, грабежи, хулиганство) по шести махаллям района, распределение за август по времени суток и справки участковых. Задача — правильно прочитать данные, найти «горячие точки», отделить причины от случайных совпадений, дать прогноз и обоснованно распределить ограниченные силы.",
    en: "You have street-crime figures (theft, robbery, hooliganism) for six neighbourhoods, the August breakdown by time of day and the inspectors' notes. Read the data correctly, find the hotspots, separate causes from coincidence, forecast, and allocate limited resources.",
  },
  stages: [
    /* 1 ------------------------------------------------------------------ */
    {
      id: "a1-statistika",
      title: {
        uz: "Statistik ma'lumotlar",
        ru: "Статистические данные",
        en: "Statistical data",
      },
      brief: {
        uz: "Kengashda birinchi savol: tuman bo'yicha ko'cha jinoyatlari avgustda iyunga nisbatan qanchaga o'sgan?",
        ru: "Первый вопрос на совещании: насколько выросла уличная преступность по району в августе по сравнению с июнем?",
        en: "First question at the briefing: how much did street crime grow in August compared with June?",
      },
      materials: [
        {
          id: "a-m-oylar",
          kind: "table",
          title: {
            uz: "Ko'cha jinoyatlari: mahalla × oy (ro'yxatga olingan)",
            ru: "Уличные преступления: махалля × месяц (зарегистрировано)",
            en: "Street crime: neighbourhood × month (recorded)",
          },
          body: {
            uz: "Manba: yagona elektron hisob tizimi, 01.09 holatiga. Oxirgi qator — tuman bo'yicha jami.",
            ru: "Источник: единая электронная система учёта, на 01.09. Последняя строка — итого по району.",
          },
          table: {
            head: ["Mahalla", "Iyun", "Iyul", "Avgust", "Jami"],
            rows: [
              ["Bog'bon", 6, 7, 8, 21],
              ["Guliston", 9, 12, 17, 38],
              ["Istiqlol", 4, 4, 3, 11],
              ["Mehnat", 7, 9, 14, 30],
              ["Navro'z", 5, 5, 6, 16],
              ["Sharq", 9, 8, 12, 29],
              ["Jami", 40, 45, 60, 145],
            ],
          },
        },
      ],
      task: {
        kind: "numeric",
        prompt: {
          uz: "Tuman bo'yicha avgustdagi jinoyatlar soni iyunga nisbatan necha foizga o'sgan?",
          ru: "На сколько процентов число преступлений по району в августе выросло по сравнению с июнем?",
          en: "By what percentage did district crime in August grow compared with June?",
        },
        unit: "%",
        answer: 50,
        tolerance: 0.5,
        solution: {
          uz: "Iyun — 40, avgust — 60. O'sish = (60 − 40) / 40 × 100 = 50 %. Maxraj — bazaviy davr (iyun), avgust emas: (60 − 40) / 60 = 33 % degan javob xato.",
          ru: "Июнь — 40, август — 60. Рост = (60 − 40) / 40 × 100 = 50 %. Знаменатель — базовый период (июнь), а не август: ответ (60 − 40) / 60 = 33 % ошибочен.",
        },
      },
      competencies: ["tahlilchi.malumot", "tahlilchi.statistika"],
      consequence: {
        uz: "Noto'g'ri hisoblangan dinamika rahbariyatni chalg'itadi: o'sish kamsitilsa, choralar kechikadi; bo'rttirilsa, kuchlar asossiz qayta taqsimlanadi.",
        ru: "Неверно посчитанная динамика вводит руководство в заблуждение: занижение — меры запаздывают, завышение — силы перебрасываются без оснований.",
      },
    },

    /* 2 ------------------------------------------------------------------ */
    {
      id: "a2-heatmap",
      title: {
        uz: "Issiq nuqtalar xaritasi",
        ru: "Карта «горячих точек»",
        en: "Hotspot map",
      },
      brief: {
        uz: "Avgustdagi 60 ta hodisa mahalla va sutka vaqti bo'yicha taqsimlandi. O'sish qayerda va qachon to'plangan?",
        ru: "60 августовских происшествий распределены по махаллям и времени суток. Где и когда сосредоточен рост?",
        en: "August's 60 incidents are broken down by neighbourhood and time of day. Where and when is the growth concentrated?",
      },
      materials: [
        {
          id: "a-m-vaqt",
          kind: "table",
          title: {
            uz: "Avgust: mahalla × sutka vaqti",
            ru: "Август: махалля × время суток",
            en: "August: neighbourhood × time of day",
          },
          body: {
            uz: "Har bir qator yig'indisi avgust ustuniga teng (jami 60).",
            ru: "Сумма каждой строки равна столбцу «Август» (итого 60).",
          },
          table: {
            head: ["Mahalla", ...BANDS, "Jami"],
            rows: [
              ["Bog'bon", 1, 2, 3, 2, 8],
              ["Guliston", 1, 2, 4, 10, 17],
              ["Istiqlol", 0, 1, 1, 1, 3],
              ["Mehnat", 2, 1, 2, 9, 14],
              ["Navro'z", 0, 2, 2, 2, 6],
              ["Sharq", 1, 2, 7, 2, 12],
            ],
          },
        },
      ],
      task: {
        kind: "grid",
        prompt: {
          uz: "Xaritada 3 ta eng issiq katakni (mahalla + vaqt oralig'i) belgilang.",
          ru: "Отметьте на карте 3 самые «горячие» ячейки (махалля + интервал времени).",
          en: "Mark the 3 hottest cells (neighbourhood + time band) on the map.",
        },
        rowLabels: MAHALLAS,
        colLabels: BANDS,
        values: [
          [1, 2, 3, 2],
          [1, 2, 4, 10],
          [0, 1, 1, 1],
          [2, 1, 2, 9],
          [0, 2, 2, 2],
          [1, 2, 7, 2],
        ],
        correct: ["1-3", "3-3", "5-2"],
        picks: 3,
      },
      competencies: ["tahlilchi.geo"],
      consequence: {
        uz: "Issiq nuqtalar mahalla bo'yicha umumiy jami bilan aniqlansa, patrul butun kun davomida «yoyilib» ketadi va hodisalar to'plangan aniq soatlarda ko'chada hech kim bo'lmaydi.",
        ru: "Если «горячие точки» определять по общему итогу махалли, патруль «размазывается» на весь день, и в те часы, когда происшествия сосредоточены, на улице никого нет.",
      },
    },

    /* 3 ------------------------------------------------------------------ */
    {
      id: "a3-sabab",
      title: {
        uz: "Issiq nuqtalar sabablari",
        ru: "Причины «горячих точек»",
        en: "Hotspot drivers",
      },
      brief: {
        uz: "Uchastka inspektorlari va hokimlikdan ma'lumotnomalar keldi. Qaysi omillar o'sishni mantiqan tushuntiradi, qaysilari esa faqat vaqt bo'yicha tasodifan mos keladi?",
        ru: "Пришли справки участковых и хокимията. Какие факторы логически объясняют рост, а какие лишь случайно совпадают по времени?",
        en: "Notes from inspectors and the district administration are in. Which factors plausibly explain the growth, and which merely coincide in time?",
      },
      materials: [
        {
          id: "a-m-guliston",
          kind: "note",
          title: {
            uz: "Guliston — uchastka inspektori ma'lumotnomasi",
            ru: "Гулистан — справка участкового",
            en: "Guliston — inspector's note",
          },
          body: {
            uz: "Iyul boshida avtobus bekati yonida kechki bozor ochildi, 23:00 gacha ishlaydi. Bog' ko'chasida iyuldan buyon 14 ta chiroqdan 9 tasi yonmaydi. Avgustdagi 10 ta kechki hodisaning 7 tasi — telefon tortib olish va cho'ntak o'g'irligi, bozor va bekat oralig'ida.",
            ru: "В начале июля у автобусной остановки открылся вечерний базар, работает до 23:00. На ул. Бог с июля не горят 9 из 14 фонарей. Из 10 вечерних происшествий августа 7 — рывки телефонов и карманные кражи между базаром и остановкой.",
          },
        },
        {
          id: "a-m-mehnat",
          kind: "note",
          title: {
            uz: "Mehnat — uchastka inspektori ma'lumotnomasi",
            ru: "Мехнат — справка участкового",
            en: "Mehnat — inspector's note",
          },
          body: {
            uz: "Iyun oyida kollej yotoqxonasi yonida sutkalik kompyuter klubi ochildi. Avgustdagi 9 ta kechki hodisaning 6 tasi — klub atrofida yoshlar o'rtasidagi janjal va velosiped, telefon o'g'irligi.",
            ru: "В июне рядом с общежитием колледжа открылся круглосуточный компьютерный клуб. Из 9 вечерних происшествий августа 6 — драки среди молодёжи и кражи велосипедов и телефонов у клуба.",
          },
        },
        {
          id: "a-m-sharq",
          kind: "note",
          title: {
            uz: "Sharq — uchastka inspektori ma'lumotnomasi",
            ru: "Шарк — справка участкового",
            en: "Sharq — inspector's note",
          },
          body: {
            uz: "Dehqon bozori avgustda meva-sabzavot mavsumi sababli gavjum, eng tig'iz payt — 13:00–17:00. Kunduzgi 7 ta hodisaning 6 tasi — bozordagi cho'ntak o'g'irligi.",
            ru: "Дехканский рынок в августе переполнен из-за сезона фруктов и овощей, пик — 13:00–17:00. Из 7 дневных происшествий 6 — карманные кражи на рынке.",
          },
        },
        {
          id: "a-m-boshqa",
          kind: "note",
          title: {
            uz: "Boshqa ma'lumotlar",
            ru: "Прочие сведения",
            en: "Other information",
          },
          body: {
            uz: "Avgustda tuman bo'yicha muzqaymoq savdosi 40 % oshgan. Iyul oyida Guliston mahallasi raisi almashgan. Istiqlol mahallasida IIB tayanch punkti joylashgan.",
            ru: "В августе продажи мороженого по району выросли на 40 %. В июле сменился председатель махалли Гулистан. В махалле Истиклол находится опорный пункт ОВД.",
          },
        },
      ],
      task: {
        kind: "multi",
        prompt: {
          uz: "O'sishni mantiqiy mexanizm bilan tushuntiradigan omillarni belgilang (barcha to'g'rilarini).",
          ru: "Отметьте факторы, объясняющие рост через понятный механизм (все верные).",
          en: "Select the factors that explain the growth through a plausible mechanism (all that apply).",
        },
        options: [
          {
            id: "bazaar",
            text: { uz: "Gulistondagi kechki bozor va bekat oqimi", ru: "Вечерний базар и поток у остановки в Гулистане", en: "Evening bazaar and bus-stop crowds in Guliston" },
            correct: true,
            feedback: {
              uz: "Olomon + qorong'ilik + qimmatbaho telefonlar = imkoniyat. Vaqt (18–24) va joy mos keladi.",
              ru: "Толпа + темнота + дорогие телефоны = возможность. Время (18–24) и место совпадают.",
            },
          },
          {
            id: "lights",
            text: { uz: "Bog' ko'chasidagi o'chgan chiroqlar", ru: "Неработающие фонари на ул. Бог", en: "Broken street lights on Bog' Street" },
            correct: true,
            feedback: {
              uz: "Yoritilmagan yo'lak tabiiy nazoratni kamaytiradi — kechki talonchilik uchun klassik omil.",
              ru: "Неосвещённый участок снижает естественный надзор — классический фактор вечерних грабежей.",
            },
          },
          {
            id: "club",
            text: { uz: "Mehnatdagi sutkalik kompyuter klubi", ru: "Круглосуточный компьютерный клуб в Мехнате", en: "The 24/7 computer club in Mehnat" },
            correct: true,
            feedback: {
              uz: "Kechasi yoshlar to'planadigan joy — janjal va o'g'irliklar aynan shu atrofda, shu soatlarda.",
              ru: "Ночное место сбора молодёжи — драки и кражи именно вокруг него и в эти часы.",
            },
          },
          {
            id: "market",
            text: { uz: "Sharqdagi dehqon bozorining mavsumiy tig'izligi", ru: "Сезонная давка на дехканском рынке в Шарке", en: "Seasonal crowding at the Sharq farmers' market" },
            correct: true,
            feedback: {
              uz: "Tig'izlik vaqti (13–17) kunduzgi issiq nuqta (12–18) bilan aniq mos.",
              ru: "Пик давки (13–17) точно совпадает с дневной «горячей точкой» (12–18).",
            },
          },
          {
            id: "icecream",
            text: { uz: "Muzqaymoq savdosining 40 % o'sishi", ru: "Рост продаж мороженого на 40 %", en: "40 % rise in ice-cream sales" },
            correct: false,
            feedback: {
              uz: "Klassik soxta korrelyatsiya: ikkalasi ham yoz mavsumi bilan bog'liq, biri ikkinchisini keltirib chiqarmaydi.",
              ru: "Классическая ложная корреляция: оба связаны с летним сезоном, но одно не вызывает другое.",
            },
          },
          {
            id: "chair",
            text: { uz: "Guliston mahalla raisining almashishi", ru: "Смена председателя махалли Гулистан", en: "The change of Guliston's neighbourhood chair" },
            correct: false,
            feedback: {
              uz: "Vaqt bo'yicha mos, lekin mexanizm ko'rsatilmagan — hodisalar bozor va bekat atrofida to'plangan. Mexanizmsiz vaqtdagi moslik sabab emas.",
              ru: "Совпадает по времени, но механизма нет — происшествия сосредоточены у базара и остановки. Совпадение без механизма — не причина.",
            },
          },
          {
            id: "post",
            text: {
              uz: "Istiqlolda tayanch punkti bor — demak, boshqa mahallalardagi o'sish faqat punkt yo'qligidan",
              ru: "В Истиклоле есть опорный пункт — значит, рост в других махаллях только из-за отсутствия пункта",
              en: "Istiqlol has a police post — so growth elsewhere is only due to having no post",
            },
            correct: false,
            feedback: {
              uz: "Bitta kuzatuvdan umumiy xulosa. Bog'bon va Navro'zda ham punkt yo'q, lekin u yerda o'sish deyarli yo'q.",
              ru: "Обобщение по одному наблюдению. В Богбоне и Наврузе тоже нет пункта, но роста там почти нет.",
            },
          },
        ],
      },
      competencies: ["tahlilchi.malumot", "tahlilchi.geo"],
      consequence: {
        uz: "Soxta sababga qarshi ko'rilgan chora (masalan, «raisni almashtirish») natija bermaydi, haqiqiy omil — qorong'i ko'cha va olomon — o'z joyida qoladi.",
        ru: "Меры против ложной причины (например, «сменить председателя») не дадут результата, а реальный фактор — тёмная улица и толпа — останется.",
      },
    },

    /* 4 ------------------------------------------------------------------ */
    {
      id: "a4-prognoz",
      title: {
        uz: "Sentyabr prognozi",
        ru: "Прогноз на сентябрь",
        en: "September forecast",
      },
      brief: {
        uz: "Qo'shimcha: kechki bozor sentyabrda ham ishlaydi, chiroqlar ta'miri hali rejalashtirilmagan; 2 sentyabrdan kollejda o'qish boshlandi; dehqon bozoridagi mavsumiy tig'izlik sentyabr o'rtasidan pasayishi kutiladi.",
        ru: "Дополнительно: вечерний базар работает и в сентябре, ремонт фонарей не запланирован; со 2 сентября в колледже начались занятия; сезонный пик на дехканском рынке к середине сентября должен спасть.",
        en: "Also: the evening bazaar stays open in September and the lights are not scheduled for repair; college classes began on 2 September; the market's seasonal peak should ease by mid-month.",
      },
      materials: [
        {
          id: "a-m-kontekst",
          kind: "note",
          title: {
            uz: "Sentyabr konteksti",
            ru: "Контекст сентября",
            en: "September context",
          },
          body: {
            uz: "Kechki bozor — ishlaydi. Chiroqlar — ta'mirlanmagan. Kollej — o'qish boshlangan, yotoqxona to'la. Dehqon bozori — mavsum oxiri. Qator uzunligi — atigi 3 oy.",
            ru: "Вечерний базар — работает. Фонари — не отремонтированы. Колледж — занятия начались, общежитие заполнено. Дехканский рынок — конец сезона. Длина ряда — всего 3 месяца.",
          },
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Chora ko'rilmasa, sentyabr uchun qaysi prognoz eng asosli?",
          ru: "Какой прогноз на сентябрь наиболее обоснован, если не принимать мер?",
          en: "If nothing is done, which September forecast is best supported?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Guliston va Mehnatda kechki hodisalar o'sishda davom etadi, Sharqda kunduzgi hodisalar kamayadi; tuman bo'yicha avgust darajasida yoki biroz yuqori (taxminan 60–70). Qator qisqa — ishonchlilik o'rtacha.",
              ru: "В Гулистане и Мехнате вечерние происшествия продолжат расти, в Шарке дневные снизятся; по району — на уровне августа или чуть выше (около 60–70). Ряд короткий — надёжность средняя.",
              en: "Evening incidents in Guliston and Mehnat keep rising, daytime incidents in Sharq fall; district total at or slightly above August (about 60–70). Short series — moderate confidence.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Prognoz omillar bo'yicha qurilgan: saqlanib qolgan omillar o'sishni davom ettiradi, yo'qolayotgani pasaytiradi. Noaniqlik ochiq aytilgan.",
              ru: "Верно. Прогноз построен по факторам: сохраняющиеся тянут рост, уходящие — снижают. Неопределённость названа открыто.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Chiziqli trend: iyun–iyul +5, iyul–avgust +15, demak sentyabrda yana +25 — tuman bo'yicha taxminan 85 ta hodisa, barcha mahallalarda bir tekis o'sish.",
              ru: "Линейный тренд: июнь–июль +5, июль–август +15, значит в сентябре ещё +25 — около 85 по району, равномерный рост во всех махаллях.",
              en: "Linear trend: +5, then +15, so another +25 in September — about 85 district-wide, evenly spread.",
            },
            score: 1,
            feedback: {
              uz: "Uchta nuqtadan tezlanuvchi trend chiqarish — asossiz ekstrapolyatsiya. Bundan tashqari, o'sish bir tekis emas: Istiqlol va Navro'zda deyarli o'zgarish yo'q.",
              ru: "Выводить ускоряющийся тренд из трёх точек — необоснованная экстраполяция. К тому же рост неравномерен: в Истиклоле и Наврузе почти без изменений.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Yoz tugashi bilan ko'cha jinoyatlari o'z-o'zidan kamayadi, sentyabrda iyun darajasiga (taxminan 40) qaytadi — alohida chora shart emas.",
              ru: "С окончанием лета уличная преступность сама снизится и в сентябре вернётся к уровню июня (около 40) — особых мер не нужно.",
              en: "With summer over, street crime will fall on its own back to June levels (about 40) — no special measures needed.",
            },
            score: 0,
            feedback: {
              uz: "Asosiy omillar (bozor, chiroqlar, klub, kollej) saqlanib qolmoqda yoki kuchaymoqda. «O'zi o'tib ketadi» degan prognoz — harakatsizlikni oqlash.",
              ru: "Главные факторы (базар, фонари, клуб, колледж) сохраняются или усиливаются. Прогноз «само пройдёт» — оправдание бездействия.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Uch oylik ma'lumot bilan prognoz berish mumkin emas; kamida bir yil kuzatib, keyin xulosa qilish kerak.",
              ru: "По трёхмесячным данным прогноз невозможен; нужно наблюдать не менее года и потом делать выводы.",
              en: "Three months of data can't support any forecast; observe for at least a year first.",
            },
            score: 1,
            feedback: {
              uz: "Ehtiyotkorlik o'rinli, lekin rahbariyatga hozir qaror kerak. Qisqa qatorda ham omillarga asoslangan, noaniqligi ko'rsatilgan prognoz beriladi.",
              ru: "Осторожность уместна, но руководству решение нужно сейчас. И на коротком ряде даётся прогноз на основе факторов с указанием неопределённости.",
            },
          },
        ],
      },
      competencies: ["tahlilchi.prognoz"],
      consequence: {
        uz: "Mexanik ekstrapolyatsiya yoki «o'zi o'tib ketadi» prognozi kuchlarni noto'g'ri joyga yuboradi yoki xavfni e'tiborsiz qoldiradi — o'sish davom etadi.",
        ru: "Механическая экстраполяция или прогноз «само пройдёт» отправляют силы не туда или оставляют угрозу без внимания — рост продолжается.",
      },
    },

    /* 5 ------------------------------------------------------------------ */
    {
      id: "a5-resurs",
      title: {
        uz: "Resurslarni taqsimlash",
        ru: "Распределение ресурсов",
        en: "Resource allocation",
      },
      brief: {
        uz: "Sentyabr uchun qo'shimcha kuchlar: 2 ta avtopatrul ekipaji (18:00–24:00), 1 ta piyoda patrul (kunduzi) va hokimlikka taqdimnoma kiritish imkoniyati.",
        ru: "Дополнительные силы на сентябрь: 2 экипажа автопатруля (18:00–24:00), 1 пеший патруль (днём) и возможность внести представление в хокимият.",
        en: "Extra September resources: 2 patrol cars (18:00–24:00), 1 foot patrol (daytime) and the option of a formal submission to the district administration.",
      },
      materials: [
        {
          id: "a-m-resurs",
          kind: "table",
          title: {
            uz: "Mavjud qo'shimcha kuchlar",
            ru: "Доступные дополнительные силы",
            en: "Available extra resources",
          },
          body: {
            uz: "Kuchlar chegaralangan — har birini asoslash kerak.",
            ru: "Силы ограничены — каждую единицу нужно обосновать.",
          },
          table: {
            head: ["Resurs", "Soni", "Vaqt"],
            rows: [
              ["Avtopatrul ekipaji", 2, "18:00–24:00"],
              ["Piyoda patrul", 1, "12:00–18:00"],
              ["Hokimlikka taqdimnoma", 1, "—"],
            ],
          },
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Kuchlarni qanday taqsimlaysiz?",
          ru: "Как вы распределите силы?",
          en: "How do you allocate the resources?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Ekipajlar: biri Guliston (bozor–bekat), biri Mehnat (klub atrofi), 18–24. Piyoda patrul — Sharq bozori, sentyabr o'rtasigacha. Taqdimnoma — Bog' ko'chasi yoritilishi; klub va bozor ma'muriyati bilan profilaktik uchrashuv.",
              ru: "Экипажи: один — Гулистан (базар–остановка), другой — Мехнат (у клуба), 18–24. Пеший — Шаркский рынок до середины сентября. Представление — освещение ул. Бог; профилактическая встреча с администрацией клуба и базара.",
              en: "Cars: one to Guliston (bazaar–stop), one to Mehnat (around the club), 18–24. Foot patrol: Sharq market until mid-month. Submission: lighting on Bog' Street; prevention meeting with club and bazaar managers.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Har bir resurs aniq issiq nuqta va vaqtga yo'naltirilgan, bittasi esa sababni (yoritish) bartaraf qiladi. Piyoda patrul mavsum tugashi bilan qayta ko'rib chiqiladi.",
              ru: "Верно. Каждая единица направлена на конкретную точку и время, а одна устраняет причину (освещение). Пеший патруль пересматривается с концом сезона.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Adolat uchun ikkala ekipaj ham oltita mahallani navbat bilan, har kuni bir xil marshrutda aylanib chiqadi; piyoda patrul ham barcha mahallalar bo'ylab harakatlanadi.",
              ru: "Для справедливости оба экипажа по очереди объезжают все шесть махаллей по одинаковому маршруту ежедневно; пеший патруль тоже обходит все махалли.",
              en: "To be fair, both cars rotate through all six neighbourhoods on the same route daily; the foot patrol also covers every neighbourhood.",
            },
            score: 1,
            feedback: {
              uz: "Bir tekis taqsimot — resursni isrof qilish: Istiqlol va Navro'zda deyarli hodisa yo'q, issiq nuqtalarda esa har bir soatda patrul bo'lmaydi.",
              ru: "Равномерное распределение — растрата ресурса: в Истиклоле и Наврузе почти нет происшествий, а в «горячих точках» патруль будет не каждый час.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Ikkala ekipaj va piyoda patrul — Gulistonga, chunki u eng yuqori o'sishga ega; qolgan mahallalar hozircha odatiy rejimda qoladi.",
              ru: "Оба экипажа и пеший патруль — в Гулистан, там самый большой рост; остальные махалли пока в обычном режиме.",
              en: "Both cars and the foot patrol go to Guliston, which grew most; the rest stay on routine.",
            },
            score: 1,
            feedback: {
              uz: "Guliston muhim, lekin Mehnat (9) va Sharq (7) ham aniq issiq nuqtalar. Kunduzgi piyoda patrulni kechki issiq nuqtaga yuborish — vaqt bo'yicha nomuvofiqlik.",
              ru: "Гулистан важен, но Мехнат (9) и Шарк (7) — тоже явные точки. Дневной пеший патруль в вечернюю точку — несовпадение по времени.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Qo'shimcha kuchlarni Istiqlolga beraman: u yerda tayanch punkti yaxshi ishlayapti, natijani mustahkamlab, tajribani boshqalarga tarqatamiz.",
              ru: "Дополнительные силы — в Истиклол: там хорошо работает опорный пункт, закрепим результат и распространим опыт.",
              en: "Send the extra resources to Istiqlol: its police post works well, so we consolidate and share the practice.",
            },
            score: 0,
            feedback: {
              uz: "Kuchlar muammo bo'lmagan joyga yuborilmoqda. Tajriba almashish — boshqa vosita, u patrul resursini talab qilmaydi.",
              ru: "Силы направляются туда, где проблемы нет. Обмен опытом — другой инструмент и патрульного ресурса не требует.",
            },
          },
        ],
      },
      competencies: ["tahlilchi.geo", "tahlilchi.prognoz"],
      consequence: {
        uz: "Noto'g'ri taqsimlangan patrul statistikani o'zgartirmaydi, fuqarolar esa «politsiya kerakli joyda yo'q» degan xulosaga kelib, ishonch pasayadi.",
        ru: "Неверно распределённый патруль не изменит статистику, а граждане решат, что «полиции нет там, где нужно», и доверие упадёт.",
      },
    },

    /* 6 ------------------------------------------------------------------ */
    {
      id: "a6-xulosa",
      title: {
        uz: "Analitik xulosa",
        ru: "Аналитическая записка",
        en: "Analytical brief",
      },
      brief: {
        uz: "Boshliq uchun bir sahifalik analitik xulosa tayyorlang: dinamika, issiq nuqtalar, sabablar, prognoz va takliflar.",
        ru: "Подготовьте начальнику аналитическую записку на одну страницу: динамика, «горячие точки», причины, прогноз и предложения.",
        en: "Write a one-page brief for the chief: trend, hotspots, drivers, forecast and recommendations.",
      },
      materials: [],
      task: {
        kind: "text",
        prompt: {
          uz: "Analitik xulosani yozing.",
          ru: "Напишите аналитическую записку.",
          en: "Write the analytical brief.",
        },
        rubric: [
          {
            uz: "Dinamika to'g'ri: iyun 40 → avgust 60, +50 %; o'sish notekis, Guliston, Mehnat va Sharqda to'plangan.",
            ru: "Верная динамика: июнь 40 → август 60, +50 %; рост неравномерный, сосредоточен в Гулистане, Мехнате и Шарке.",
          },
          {
            uz: "Uchta issiq nuqta aniq ko'rsatilgan (Guliston 18–24 — 10, Mehnat 18–24 — 9, Sharq 12–18 — 7) va har biriga mexanizmli sabab bog'langan.",
            ru: "Три «горячие точки» названы точно (Гулистан 18–24 — 10, Мехнат 18–24 — 9, Шарк 12–18 — 7), к каждой привязана причина с механизмом.",
          },
          {
            uz: "Soxta korrelyatsiyalar (muzqaymoq, rais almashuvi) sabab sifatida keltirilmagan; prognoz noaniqligi ko'rsatilgan.",
            ru: "Ложные корреляции (мороженое, смена председателя) не приведены как причины; указана неопределённость прогноза.",
          },
          {
            uz: "Takliflar aniq va o'lchanadigan: kim, qayerda, qachon; natijani qaysi ko'rsatkich bilan tekshirish belgilangan.",
            ru: "Предложения конкретны и измеримы: кто, где, когда; указано, каким показателем проверять результат.",
          },
        ],
        minWords: 60,
        model: {
          uz: "Tuman bo'yicha ko'cha jinoyatlari iyundagi 40 tadan avgustda 60 taga, ya'ni 50 % ga o'sgan. O'sish notekis: asosan Guliston (9→17), Mehnat (7→14) va Sharq (9→12) hisobiga; Istiqlol va Navro'zda o'zgarish yo'q. Avgustda uchta issiq nuqta aniqlandi: Guliston 18–24 (10 hodisa, kechki bozor–bekat oralig'i, Bog' ko'chasida 9 ta chiroq yonmaydi, asosan telefon tortib olish), Mehnat 18–24 (9, sutkalik kompyuter klubi atrofida janjal va o'g'irlik), Sharq 12–18 (7, dehqon bozoridagi mavsumiy tig'izlikda cho'ntak o'g'irligi). Muzqaymoq savdosi va rais almashuvi vaqt bo'yicha mos kelsa ham, sabab emas. Prognoz: chora ko'rilmasa, Guliston va Mehnatda kechki hodisalar o'sadi, Sharqda sentyabr o'rtasidan kamayadi; tuman bo'yicha 60–70 atrofida. Qator 3 oylik — ishonchlilik o'rtacha. Takliflar: 18–24 da bir ekipaj Guliston, bir ekipaj Mehnatga; piyoda patrul Sharq bozoriga sentyabr o'rtasigacha; hokimlikka Bog' ko'chasini yoritish bo'yicha taqdimnoma; klub va bozor ma'muriyati bilan profilaktik uchrashuv. Natija oktyabr boshida shu uchta katakdagi hodisalar soni bo'yicha baholanadi.",
          ru: "Уличная преступность по району выросла с 40 в июне до 60 в августе, то есть на 50 %. Рост неравномерный: в основном за счёт Гулистана (9→17), Мехната (7→14) и Шарка (9→12); в Истиклоле и Наврузе изменений нет. В августе выявлены три «горячие точки»: Гулистан 18–24 (10 происшествий, между вечерним базаром и остановкой, на ул. Бог не горят 9 фонарей, в основном рывки телефонов), Мехнат 18–24 (9, драки и кражи у круглосуточного компьютерного клуба), Шарк 12–18 (7, карманные кражи в сезонной давке на дехканском рынке). Продажи мороженого и смена председателя совпадают по времени, но причинами не являются. Прогноз: без мер вечерние происшествия в Гулистане и Мехнате вырастут, в Шарке с середины сентября снизятся; по району около 60–70. Ряд 3-месячный — надёжность средняя. Предложения: в 18–24 один экипаж в Гулистан, один в Мехнат; пеший патруль на Шаркский рынок до середины сентября; представление в хокимият об освещении ул. Бог; профилактическая встреча с администрацией клуба и базара. Результат оценить в начале октября по числу происшествий в этих трёх ячейках.",
        },
      },
      competencies: ["tahlilchi.xulosa", "tahlilchi.statistika"],
      consequence: {
        uz: "Raqamsiz yoki asoslanmagan xulosa rahbariyat qarori uchun yaramaydi — kuchlar «odatdagidek» taqsimlanadi va tahlil ishi befoyda bo'ladi.",
        ru: "Записка без цифр и обоснований непригодна для решения руководства — силы распределят «как обычно», и аналитическая работа пропадёт впустую.",
      },
    },
  ],
};
