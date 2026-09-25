import type { ProfessionSim } from "@/data/kasblar/types";

/**
 * E-01 «27-xonadon» — ekspert-kriminalist voqea joyida: izlarni topish,
 * to'g'ri qayd etish va qadoqlash, qo'l izini solishtirish, dalil zanjirini
 * uzmaslik va asoslangan xulosa yozish.
 * Barcha shaxslar, manzillar va raqamlar — to'qima.
 */
export const SIM_EKSPERT: ProfessionSim = {
  id: "sim-ekspert-01",
  professionId: "ekspert",
  code: "E-01",
  env: "crime_scene",
  minutes: 25,
  title: {
    uz: "27-xonadon: kvartira o'g'irligi",
    ru: "Квартира 27: кража из квартиры",
    en: "Flat 27: a residential burglary",
  },
  setting: {
    uz: "Navbahor tumani, Bog'ishamol ko'chasi 14-uy, 4-qavat, 27-xonadon. 16 sentyabr, 09:40. Tergov-tezkor guruh tarkibida ekspert-kriminalist sifatida chiqdingiz.",
    ru: "Навбахорский район, ул. Богишамол, дом 14, 4-й этаж, квартира 27. 16 сентября, 09:40. Вы выехали экспертом-криминалистом в составе следственно-оперативной группы.",
    en: "Navbahor district, 14 Bog'ishamol Street, 4th floor, flat 27. 16 September, 09:40. You are the forensic examiner on the investigative task force.",
  },
  intro: {
    uz: "Uy egasi Malika Sodiqova ertalab ishdan qaytib, eshik qulfi buzilganini va yotoqxonadagi zargarlik buyumlari yo'qolganini aniqlagan. Kechasi xonadonda hech kim bo'lmagan. Sizning vazifangiz — voqea joyidagi izlarni topish, ularni yo'qotmasdan qayd etish va olish, laboratoriyada qo'l izini solishtirish hamda sudda qabul qilinadigan xulosa tayyorlash. Har bir xato — sudda dalilning yo'qolishi demak.",
    ru: "Хозяйка Малика Садыкова утром вернулась со смены и обнаружила взломанный замок и пропажу ювелирных украшений из спальни. Ночью в квартире никого не было. Ваша задача — найти следы, зафиксировать и изъять их без потерь, сравнить след пальца в лаборатории и подготовить заключение, которое примет суд. Каждая ошибка — это потерянное доказательство в суде.",
    en: "The owner, Malika Sodiqova, came home from a night shift to find the lock forced and her jewellery gone from the bedroom. Nobody was in the flat overnight. Your job: find the traces, fix and recover them without loss, compare the latent print in the lab and write a conclusion a court will accept.",
  },
  stages: [
    /* 1 ------------------------------------------------------------------ */
    {
      id: "e1-kelish",
      title: {
        uz: "Voqea joyiga kelish",
        ru: "Прибытие на место происшествия",
        en: "Arriving at the scene",
      },
      brief: {
        uz: "Zinapoya maydonchasida uchastka inspektori, uy egasi va ikki qo'shni turibdi. Eshik qiya ochiq. Uy egasi «men ichkariga kirib, hamma narsani joyiga qo'ydim» demoqda.",
        ru: "На площадке участковый, хозяйка и двое соседей. Дверь приоткрыта. Хозяйка говорит: «Я заходила и всё поставила на место».",
        en: "On the landing: the neighbourhood inspector, the owner and two neighbours. The door is ajar. The owner says she went in and 'put everything back in place'.",
      },
      materials: [
        {
          id: "e-m-xabar",
          kind: "document",
          title: {
            uz: "Navbatchi qism xabari",
            ru: "Сообщение дежурной части",
            en: "Duty unit report",
          },
          body: {
            uz: "09:12 da fuqaro M. Sodiqova «102» orqali xabar berdi: 27-xonadon eshigi qulfi buzilgan, yotoqxonadagi shkatulkadan zargarlik buyumlari yo'qolgan. Taxminiy zarar — 18 mln so'm. TTG tarkibi: tergovchi F. Karimov, tezkor xodim, ekspert-kriminalist, kinolog.",
            ru: "В 09:12 гражданка М. Садыкова сообщила по «102»: замок квартиры 27 взломан, из шкатулки в спальне пропали украшения. Предварительный ущерб — 18 млн сумов. СОГ: следователь Ф. Каримов, оперативник, эксперт-криминалист, кинолог.",
          },
          meta: [
            { label: { uz: "Qabul vaqti", ru: "Время приёма" }, value: "16.09, 09:12" },
            { label: { uz: "Manzil", ru: "Адрес" }, value: "Bog'ishamol 14, 27" },
            { label: { uz: "Tergovchi", ru: "Следователь" }, value: "F. Karimov" },
          ],
        },
        {
          id: "e-m-egasi",
          kind: "note",
          title: {
            uz: "Uy egasining og'zaki tushuntirishi",
            ru: "Устное пояснение хозяйки",
            en: "Owner's verbal account",
          },
          body: {
            uz: "«Kecha 20:00 da ishga ketdim, eshikni ikki marta qulfladim. Ertalab 08:50 da qaytsam, qulf teshigi atrofi tirnalgan, eshik ochiq. Yotoqxonaga kirib, shkatulkani ochib ko'rdim — tilla uzuk, sirg'alar yo'q. Oshxonada kuldonda sigaret qoldig'i bor, bizning uyda hech kim chekmaydi. Yerga tushib yotgan tortmani joyiga qaytardim.»",
            ru: "«Вчера в 20:00 ушла на работу, закрыла дверь на два оборота. Утром в 08:50 вернулась — вокруг скважины царапины, дверь открыта. Зашла в спальню, открыла шкатулку — нет золотого кольца и серёг. На кухне в пепельнице окурок, у нас никто не курит. Упавший ящик я вставила обратно.»",
          },
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Ichkariga kirishdan oldin ekspert sifatida birinchi navbatda nima qilasiz?",
          ru: "Что вы как эксперт делаете в первую очередь, до входа в квартиру?",
          en: "As the examiner, what do you do first, before entering?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Tergovchi bilan ish tartibini kelishib, himoya vositalarini (qo'lqop, bahila, niqob) kiyaman, kirish yo'lagini belgilab, avval eshik va maydonchani umumiy va tugun suratga olaman.",
              ru: "Согласую порядок работы со следователем, надеваю средства защиты (перчатки, бахилы, маску), обозначаю путь прохода и сначала фотографирую дверь и площадку — обзорно и узлово.",
              en: "Agree the plan with the investigator, put on gloves, overshoes and mask, mark an access path, and first photograph the door and landing (overview and mid-range).",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Voqea joyi allaqachon uy egasi tomonidan o'zgartirilgan — shuning uchun endi har bir qadam nazoratli bo'lishi kerak. Kirish yo'lagi va himoya vositalari sizning izlaringiz boshqalarini ko'mib yubormasligini ta'minlaydi.",
              ru: "Верно. Обстановка уже изменена хозяйкой, поэтому каждый следующий шаг должен быть контролируемым. Путь прохода и средства защиты не дают вашим следам перекрыть чужие.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Qulfni darhol eshikdan chiqarib, laboratoriyaga yuboraman — asbob izlari vaqt o'tishi bilan yo'qoladi, kechiktirib bo'lmaydi.",
              ru: "Сразу снимаю замок с двери и отправляю в лабораторию — следы орудия со временем исчезают, медлить нельзя.",
              en: "Remove the lock immediately and send it to the lab — tool marks fade, there is no time to lose.",
            },
            score: 0,
            feedback: {
              uz: "Qulfni qayd etmasdan chiqarish — uning dastlabki holati, joylashuvi va eshik bilan bog'liqligi hujjatlashtirilmay qoladi. Asbob izlari soatlab yo'qolmaydi; avval suratga olish va bayonnomaga kiritish shart.",
              ru: "Снять замок без фиксации — значит не задокументировать его исходное положение и связь с дверью. Следы орудий не исчезают за часы; сначала фотосъёмка и протокол.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Uy egasi bilan birga ichkariga kirib, u qaysi narsalarni joyidan qo'zg'atganini ko'rsatib berishini so'rayman, keyin ishni boshlayman.",
              ru: "Захожу вместе с хозяйкой, прошу её показать, что она трогала, и после этого начинаю работу.",
              en: "Walk in with the owner so she can show what she moved, then start work.",
            },
            score: 1,
            feedback: {
              uz: "Uy egasi qo'zg'atgan narsalarni aniqlash kerak — lekin buni tashqarida so'rash va keyin nazoratli olib kirish mumkin. Uni hozir ichkariga yana olib kirish yangi izlarni qo'shadi.",
              ru: "Выяснить, что трогала хозяйка, нужно — но это можно спросить снаружи и позже провести её контролируемо. Сейчас её повторный вход добавит новые следы.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Kinolog itni ishga solishini kutaman, keyin eshik tutqichini changlab, qo'l izlarini qidiraman.",
              ru: "Жду, пока кинолог отработает собакой, затем опыляю дверную ручку порошком в поисках следов рук.",
              en: "Wait for the dog handler to work, then dust the door handle for prints.",
            },
            score: 1,
            feedback: {
              uz: "Kinolog bilan navbatni kelishish to'g'ri, lekin changlashdan oldin tutqich va qulf suratga olinmagan. Kukun asbob izlari va mikroobyektlarni ham buzishi mumkin.",
              ru: "Согласовать очерёдность с кинологом правильно, но до опыления ручку и замок не сфотографировали. Порошок может повредить и следы орудия, и микрообъекты.",
            },
          },
        ],
      },
      competencies: ["ekspert.aniqlash"],
      consequence: {
        uz: "Nazoratsiz kirilgan voqea joyida himoya tomoni «izlar ekspertning o'zi tomonidan qoldirilgan yoki ko'chirilgan» degan e'tirozni osongina ko'taradi va sud dalilni shubhali deb baholaydi.",
        ru: "Если на место заходили бесконтрольно, защита легко заявит, что следы оставлены или перенесены самим экспертом, и суд оценит доказательство как сомнительное.",
      },
    },

    /* 2 ------------------------------------------------------------------ */
    {
      id: "e2-aniqlash",
      title: {
        uz: "Izlarni aniqlash",
        ru: "Выявление следов",
        en: "Identifying traces",
      },
      brief: {
        uz: "Umumiy suratga olish tugadi. Xonadonni ko'zdan kechiryapsiz. Yo'lak, yotoqxona va oshxonada ko'plab obyektlar bor — qaysilari jinoyatchi bilan bog'liq bo'lishi mumkin?",
        ru: "Обзорная съёмка закончена. Вы осматриваете квартиру. В коридоре, спальне и на кухне много объектов — какие могут быть связаны с преступником?",
        en: "The overview photos are done. You work through the hallway, bedroom and kitchen. Which objects could be linked to the offender?",
      },
      materials: [
        {
          id: "e-m-korik",
          kind: "evidence",
          title: {
            uz: "Ko'zdan kechirish qaydlari (qoralama)",
            ru: "Заметки осмотра (черновик)",
            en: "Inspection notes (draft)",
          },
          body: {
            uz: "Eshik: qulf silindri atrofida 3–4 mm kenglikdagi yassi asbob izi. Yo'lak: kafel polda changda poyabzal izi (protektor naqshi aniq), uy egasining shippagi yonida. Yotoqxona: shisha shkatulka qopqog'ida yog'-ter izlari ko'rinadi, tortma polga tushgan (uy egasi qaytargan). Deraza tokchasida gul tuvagi, chang qatlami buzilmagan. Oshxona: kuldonda filtrli sigaret qoldig'i, stol ustida ochiq qolgan suv shishasi. Devorda oilaviy suratlar, televizor pulti divanda.",
            ru: "Дверь: вокруг цилиндра замка след плоского орудия шириной 3–4 мм. Коридор: на кафельном полу в пыли след обуви (рисунок протектора чёткий), рядом тапки хозяйки. Спальня: на стеклянной крышке шкатулки видны потожировые следы, ящик падал (хозяйка вставила обратно). На подоконнике цветочный горшок, слой пыли не нарушен. Кухня: в пепельнице окурок с фильтром, на столе открытая бутылка воды. На стене семейные фото, пульт от ТВ на диване.",
          },
          tone: "neutral",
        },
      ],
      task: {
        kind: "multi",
        prompt: {
          uz: "Qaysi obyektlarni izlar sifatida qayd etib, olish kerak? Barcha to'g'ri variantlarni belgilang.",
          ru: "Какие объекты нужно зафиксировать и изъять как следы? Отметьте все верные варианты.",
          en: "Which objects must be recorded and recovered as traces? Select all that apply.",
        },
        options: [
          {
            id: "lock",
            text: { uz: "Qulf silindridagi asbob izi", ru: "След орудия на цилиндре замка", en: "Tool mark on the lock cylinder" },
            correct: true,
            feedback: {
              uz: "Buzish usuli va asbob turini ko'rsatadi; keyinchalik topilgan asbob bilan solishtiriladi.",
              ru: "Показывает способ взлома и тип орудия; позже сравнивается с найденным инструментом.",
            },
          },
          {
            id: "shoe",
            text: { uz: "Kafel poldagi poyabzal izi", ru: "След обуви на кафеле", en: "Footwear mark on the tiles" },
            correct: true,
            feedback: {
              uz: "Protektor naqshi aniq — guruhiy, ba'zan yakka identifikatsiya uchun yaroqli. Uy egasining poyabzali bilan istisno qilish uchun solishtiriladi.",
              ru: "Рисунок протектора чёткий — пригоден для групповой, а иногда и индивидуальной идентификации. Для исключения сравнивается с обувью хозяйки.",
            },
          },
          {
            id: "box",
            text: { uz: "Shkatulka qopqog'idagi yog'-ter izlari", ru: "Потожировые следы на крышке шкатулки", en: "Latent marks on the jewellery-box lid" },
            correct: true,
            feedback: {
              uz: "Jinoyatchi aynan shu obyektni ushlagan — qo'l izlari uchun eng istiqbolli joy.",
              ru: "Преступник точно касался этого объекта — самое перспективное место для следов рук.",
            },
          },
          {
            id: "butt",
            text: { uz: "Kuldondagi sigaret qoldig'i", ru: "Окурок в пепельнице", en: "Cigarette butt in the ashtray" },
            correct: true,
            feedback: {
              uz: "Xonadonda hech kim chekmaydi — so'lak orqali DNK profili olinishi mumkin.",
              ru: "В квартире никто не курит — по слюне возможно получение ДНК-профиля.",
            },
          },
          {
            id: "bottle",
            text: { uz: "Oshxona stolidagi ochiq suv shishasi", ru: "Открытая бутылка воды на кухонном столе", en: "Open water bottle on the kitchen table" },
            correct: true,
            feedback: {
              uz: "Uy egasi uni qoldirganini tasdiqlamaguncha — bo'yin qismidagi biologik iz va shisha sirtidagi qo'l izlari uchun olinadi. Keyin istisno qilish oson, yo'qotilgan dalilni qaytarib bo'lmaydi.",
              ru: "Пока хозяйка не подтвердила, что бутылка её, — изымается ради биоследов на горлышке и следов рук. Исключить потом легко, утраченное доказательство не вернуть.",
            },
          },
          {
            id: "pot",
            text: { uz: "Deraza tokchasidagi gul tuvagi", ru: "Цветочный горшок на подоконнике", en: "Plant pot on the windowsill" },
            correct: false,
            feedback: {
              uz: "Chang qatlami buzilmagan — deraza orqali kirilmagan. Buni bayonnomada qayd etish yetarli, olish shart emas.",
              ru: "Слой пыли не нарушен — через окно не проникали. Достаточно отметить это в протоколе, изымать не нужно.",
            },
          },
          {
            id: "photos",
            text: { uz: "Devordagi oilaviy suratlar", ru: "Семейные фото на стене", en: "Family photos on the wall" },
            correct: false,
            feedback: {
              uz: "Jinoyat bilan bog'liqlik belgisi yo'q.",
              ru: "Признаков связи с преступлением нет.",
            },
          },
          {
            id: "remote",
            text: { uz: "Divandagi televizor pulti", ru: "Пульт от ТВ на диване", en: "TV remote on the sofa" },
            correct: false,
            feedback: {
              uz: "Jinoyatchining yo'nalishida emas va qo'zg'atilgani haqida belgi yo'q — izlar uy egasiga tegishli bo'lish ehtimoli yuqori.",
              ru: "Не на пути преступника и признаков перемещения нет — следы, скорее всего, хозяйки.",
            },
          },
        ],
      },
      competencies: ["ekspert.aniqlash"],
      consequence: {
        uz: "Olinmay qolgan iz qaytarib bo'lmaydi: xonadon tozalangach, DNK yoki qo'l izi abadiy yo'qoladi va ish faqat bilvosita dalillar bilan qoladi.",
        ru: "Неизъятый след не вернуть: после уборки квартиры ДНК или отпечаток утрачиваются навсегда, и дело остаётся только на косвенных доказательствах.",
      },
    },

    /* 3 ------------------------------------------------------------------ */
    {
      id: "e3-fiksatsiya",
      title: {
        uz: "Izni qayd etish tartibi",
        ru: "Порядок фиксации следа",
        en: "Recording sequence",
      },
      brief: {
        uz: "Shkatulka qopqog'idagi yog'-ter izi bilan ishlaysiz. Qayd etish bosqichlari noto'g'ri tartibda bajarilsa, iz yoki uning isbot kuchi yo'qoladi.",
        ru: "Работаете с потожировым следом на крышке шкатулки. Если нарушить порядок фиксации, теряется сам след или его доказательственная сила.",
        en: "You are working on the latent mark on the box lid. Out-of-order recording loses the mark or its evidential value.",
      },
      materials: [
        {
          id: "e-m-shkatulka",
          kind: "photo",
          title: {
            uz: "Shkatulka — tugun surati",
            ru: "Шкатулка — узловой снимок",
            en: "Jewellery box — mid-range photo",
          },
          body: {
            uz: "Shisha qopqoq, o'lchami 18×12 sm. Qiyshiq yorug'likda qopqoq chetida 2 ta qo'l izi fragmenti ko'rinadi (№1 — o'ng chekka, №2 — markazga yaqin, qisman surtilgan).",
            ru: "Стеклянная крышка 18×12 см. В косом свете у края видны 2 фрагмента следов рук (№1 — правый край, №2 — ближе к центру, частично смазан).",
          },
          meta: [
            { label: { uz: "Sirt", ru: "Поверхность" }, value: "shisha, silliq" },
            { label: { uz: "Fragmentlar", ru: "Фрагменты" }, value: "2" },
          ],
        },
      ],
      task: {
        kind: "order",
        prompt: {
          uz: "Qo'l izi bilan ishlash bosqichlarini to'g'ri ketma-ketlikda joylashtiring.",
          ru: "Расположите этапы работы со следом руки в правильной последовательности.",
          en: "Put the steps for handling the latent print in the correct order.",
        },
        items: [
          {
            id: "o-photo",
            text: {
              uz: "Izni o'lchov chizg'ichi (masshtab) bilan detal suratga olish",
              ru: "Детальная съёмка следа с масштабной линейкой",
              en: "Close-up photo of the mark with a scale",
            },
          },
          {
            id: "o-develop",
            text: {
              uz: "Sirtga mos kukun bilan izni ko'rinadigan qilish (ochish)",
              ru: "Выявление следа подходящим к поверхности порошком",
              en: "Develop the mark with a powder suited to the surface",
            },
          },
          {
            id: "o-photo2",
            text: {
              uz: "Ochilgan izni masshtab bilan qayta suratga olish",
              ru: "Повторная съёмка выявленного следа с масштабом",
              en: "Re-photograph the developed mark with a scale",
            },
          },
          {
            id: "o-lift",
            text: {
              uz: "Izni daktiloskopik plyonkaga ko'chirish",
              ru: "Перенос следа на дактилоплёнку",
              en: "Lift the mark onto fingerprint film",
            },
          },
          {
            id: "o-pack",
            text: {
              uz: "Plyonkani konvertga solish, muhrlash, yorliqqa imzo qo'yish va bayonnomaga kiritish",
              ru: "Упаковка плёнки в конверт, опечатывание, подписи на бирке и внесение в протокол",
              en: "Envelope, seal, sign the label and enter it in the record",
            },
          },
        ],
        correct: ["o-photo", "o-develop", "o-photo2", "o-lift", "o-pack"],
      },
      competencies: ["ekspert.qadoqlash"],
      consequence: {
        uz: "Kukun surtilgandan keyin olingan birinchi surat izning asl holatini ko'rsatmaydi; ko'chirishda iz buzilsa, uning mavjudligini isbotlovchi yagona narsa surat bo'lib qoladi — u ham yo'q bo'lsa, dalil yo'qoladi.",
        ru: "Если первый снимок сделан уже после порошка, он не отражает исходное состояние следа; если при переносе след повреждён, единственным подтверждением остаётся фото — нет фото, нет доказательства.",
      },
    },

    /* 4 ------------------------------------------------------------------ */
    {
      id: "e4-qadoqlash",
      title: {
        uz: "Biologik izni qadoqlash",
        ru: "Упаковка биологического следа",
        en: "Packaging a biological trace",
      },
      brief: {
        uz: "Endi sigaret qoldig'ini olasiz. U biroz nam — kuldonda suv tomchilari bor. Qadoqlash usuli DNK tahlili natijasini hal qiladi.",
        ru: "Теперь изымаете окурок. Он слегка влажный — в пепельнице капли воды. Способ упаковки решает судьбу ДНК-анализа.",
        en: "Now you recover the cigarette butt. It is slightly damp — there are water droplets in the ashtray. Packaging decides the DNA result.",
      },
      materials: [
        {
          id: "e-m-sigaret",
          kind: "evidence",
          title: {
            uz: "Sigaret qoldig'i",
            ru: "Окурок",
            en: "Cigarette butt",
          },
          body: {
            uz: "Filtrli, uzunligi 28 mm, filtrda tish izlari va so'lak namligi. Kuldon shisha, uy egasiga tegishli.",
            ru: "С фильтром, длина 28 мм, на фильтре следы прикуса и влага от слюны. Пепельница стеклянная, принадлежит хозяйке.",
          },
          meta: [
            { label: { uz: "Holati", ru: "Состояние" }, value: "nam / влажный" },
            { label: { uz: "Tahlil", ru: "Анализ" }, value: "DNK" },
          ],
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Sigaret qoldig'ini qanday olib, qadoqlaysiz?",
          ru: "Как вы изымаете и упаковываете окурок?",
          en: "How do you recover and package the cigarette butt?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Yangi qo'lqopda steril pinset bilan olaman, xona haroratida qog'oz konvertda quritishga qo'yaman, keyin qog'oz konvertga solib muhrlayman va yorliqda «biologik, nam holda olingan» deb yozaman.",
              ru: "В новых перчатках стерильным пинцетом, подсушиваю при комнатной температуре, затем в бумажный конверт, опечатываю, на бирке пишу «биологический, изъят влажным».",
              en: "Fresh gloves, sterile tweezers, air-dry at room temperature, then a sealed paper envelope labelled 'biological, recovered damp'.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Qog'oz nafas oladi — namlik chiqib ketadi. Yorliqdagi belgi laboratoriyani ogohlantiradi. Har bir biologik obyekt alohida qadoqlanadi.",
              ru: "Верно. Бумага «дышит» — влага уходит. Пометка на бирке предупреждает лабораторию. Каждый биообъект упаковывается отдельно.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Zip-paketga solib, havosini chiqarib yopaman — shunda ifloslanish xavfi yo'q, keyin muhrlab, bayonnomaga kiritaman.",
              ru: "Кладу в зип-пакет, выпускаю воздух и закрываю — так нет риска загрязнения, затем опечатываю и вношу в протокол.",
              en: "Put it in a zip bag, squeeze the air out and close it — no contamination risk — then seal and record it.",
            },
            score: 0,
            feedback: {
              uz: "Nam biologik obyekt plastikda chiriydi: mog'or va bakteriyalar DNKni parchalaydi. Bir necha kunda namuna tahlil uchun yaroqsiz bo'ladi.",
              ru: "Влажный биообъект в пластике гниёт: плесень и бактерии разрушают ДНК. Через несколько дней образец непригоден.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Kuldon bilan birga bitta qutiga solaman — qoldiqni ushlamaslik uchun, kuldondagi kulni ham birga yuboraman.",
              ru: "Упаковываю вместе с пепельницей в одну коробку — чтобы не касаться окурка, и пепел тоже отправляю.",
              en: "Box it together with the ashtray so I never touch the butt, and send the ash too.",
            },
            score: 1,
            feedback: {
              uz: "Obyektni ushlamaslik fikri to'g'ri, lekin qoldiq transportda kuldon ichida siljiydi, namlik saqlanadi, kul va suv bilan aralashadi. Obyektlar alohida qadoqlanishi kerak.",
              ru: "Идея не касаться окурка верная, но в пепельнице он перекатывается, влага сохраняется, смешивается с пеплом и водой. Объекты упаковываются раздельно.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Issiq havo bilan tez quritib, shisha probirkaga solaman va darhol muzlatgichga qo'yaman.",
              ru: "Быстро сушу горячим воздухом, кладу в стеклянную пробирку и сразу в морозильник.",
              en: "Dry it quickly with hot air, put it in a glass tube and freeze it straight away.",
            },
            score: 1,
            feedback: {
              uz: "Issiq havo DNKga zarar yetkazishi va obyektni boshqa zarrachalar bilan ifloslantirishi mumkin. Germetik idishdagi qoldiq namlik muzlatishda ham xavfli. Xona haroratida tabiiy quritish — xavfsiz usul.",
              ru: "Горячий воздух может повредить ДНК и занести посторонние частицы. Остаточная влага в герметичной таре опасна и при заморозке. Безопасно — естественная сушка при комнатной температуре.",
            },
          },
        ],
      },
      competencies: ["ekspert.qadoqlash"],
      consequence: {
        uz: "Noto'g'ri qadoqlangan biologik iz laboratoriyaga chirigan holda yetib boradi — gumon qilinuvchini to'g'ridan-to'g'ri bog'lovchi yagona dalil yo'qoladi.",
        ru: "Неправильно упакованный биослед приходит в лабораторию сгнившим — теряется единственное доказательство, напрямую связывающее подозреваемого с местом.",
      },
    },

    /* 5 ------------------------------------------------------------------ */
    {
      id: "e5-tahlil",
      title: {
        uz: "Daktiloskopik solishtirish",
        ru: "Дактилоскопическое сравнение",
        en: "Fingerprint comparison",
      },
      brief: {
        uz: "Laboratoriya. №1 iz (shkatulka, o'ng chekka) ekspertiza uchun yaroqli deb topildi. Tezkor xodimlar tekshiruvidan so'ng uchta shaxsning daktilokartasi yuborildi. Solishtirish natijalari jadvalda.",
        ru: "Лаборатория. След №1 (шкатулка, правый край) признан пригодным. После оперативной проверки прислали дактилокарты трёх лиц. Результаты сравнения — в таблице.",
        en: "The lab. Mark No. 1 (box lid, right edge) is suitable for comparison. Three people's ten-print cards arrived after field checks. Results are in the table.",
      },
      materials: [
        {
          id: "e-m-kandidatlar",
          kind: "note",
          title: {
            uz: "Solishtiriladigan shaxslar",
            ru: "Проверяемые лица",
            en: "Persons compared",
          },
          body: {
            uz: "A — Malika Sodiqova (uy egasi, istisno qilish uchun). B — Jasur Toirov, 29 yosh, avval o'g'irlik uchun sudlangan, shu mavzeda yashaydi. C — Rustam Ergashev, 41 yosh, 2 hafta oldin xonadonda santexnika ta'mirlagan.",
            ru: "A — Малика Садыкова (хозяйка, для исключения). B — Жасур Тоиров, 29 лет, ранее судим за кражу, живёт в этом массиве. C — Рустам Эргашев, 41 год, 2 недели назад чинил сантехнику в квартире.",
          },
        },
        {
          id: "e-m-minutsiya",
          kind: "table",
          title: {
            uz: "№1 iz bo'yicha solishtirish jadvali",
            ru: "Таблица сравнения по следу №1",
            en: "Comparison table, mark No. 1",
          },
          body: {
            uz: "Naqsh turi, mos kelgan xususiy belgilar (minutsiyalar) va tushuntirib bo'lmaydigan farqlar soni. Fragmentda jami 16 ta aniq minutsiya ajratilgan.",
            ru: "Тип узора, число совпавших частных признаков (минуций) и необъяснимых различий. Во фрагменте выделено 16 чётких минуций.",
          },
          table: {
            head: ["Karta", "Naqsh turi", "Mos minutsiya", "Tushuntirilmagan farq", "Barmoq"],
            rows: [
              ["№1 iz", "ulnar ilmoq", "16 (jami)", "—", "?"],
              ["A (Sodiqova)", "jingalak (burama)", 0, "naqsh turi mos emas", "—"],
              ["B (Toirov)", "ulnar ilmoq", 14, 0, "o'ng ko'rsatkich"],
              ["C (Ergashev)", "ulnar ilmoq", 9, 3, "o'ng o'rta"],
            ],
          },
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Jadval asosida qanday kategorik xulosaga kelasiz?",
          ru: "Какой категорический вывод вы делаете по таблице?",
          en: "What categorical conclusion does the table support?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "№1 iz B shaxsning (Toirov) o'ng qo'l ko'rsatkich barmog'i bilan qoldirilgan; A va C istisno qilinadi.",
              ru: "След №1 оставлен указательным пальцем правой руки лица B (Тоиров); A и C исключаются.",
              en: "Mark No. 1 was left by B's (Toirov) right index finger; A and C are excluded.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Naqsh turi mos, 14 ta minutsiya mos kelgan va birorta ham tushuntirilmagan farq yo'q. C da 3 ta tushuntirilmagan farq bor — bitta bunday farqning o'zi ham identifikatsiyani istisno qiladi.",
              ru: "Верно. Тип узора совпадает, 14 минуций совпали и нет ни одного необъяснимого различия. У C — 3 необъяснимых различия; даже одно такое различие исключает тождество.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Iz C shaxsga (Ergashev) tegishli bo'lishi mumkin: u xonadonda bo'lgan, naqsh turi mos va 9 ta belgi mos kelgan.",
              ru: "След может принадлежать C (Эргашев): он был в квартире, тип узора совпадает, 9 признаков совпали.",
              en: "The mark may be C's (Ergashev): he was in the flat, the pattern type matches and 9 features agree.",
            },
            score: 0,
            feedback: {
              uz: "Ekspert xulosasi faqat belgilarga tayanadi, «xonadonda bo'lgan» degan holat — tergov masalasi. 3 ta tushuntirilmagan farq C ni istisno qiladi.",
              ru: "Заключение эксперта опирается только на признаки; «был в квартире» — вопрос следствия. 3 необъяснимых различия исключают C.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Iz B yoki C ga tegishli — ikkalasi ham ulnar ilmoq, shuning uchun ehtimoliy xulosa beraman.",
              ru: "След принадлежит B или C — у обоих ульнарная петля, поэтому даю вероятный вывод.",
              en: "The mark belongs to B or C — both are ulnar loops — so I give a probable conclusion.",
            },
            score: 1,
            feedback: {
              uz: "Naqsh turi — faqat guruhiy belgi. Hal qiluvchi xususiy belgilar va farqlar: ular B ni tasdiqlaydi, C ni istisno qiladi. Kategorik xulosa uchun asos yetarli.",
              ru: "Тип узора — лишь групповой признак. Решают частные признаки и различия: они подтверждают B и исключают C. Оснований для категорического вывода достаточно.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Xulosa berib bo'lmaydi: fragment to'liq emas, 16 ta minutsiyaning faqat 14 tasi mos kelgan.",
              ru: "Вывод невозможен: фрагмент неполный, совпали лишь 14 из 16 минуций.",
              en: "No conclusion possible: the fragment is partial and only 14 of 16 minutiae matched.",
            },
            score: 1,
            feedback: {
              uz: "Qolgan 2 ta belgi farq emas — ular kartada yaxshi aks etmagan (tushuntirilmagan farq soni 0). Fragmentning to'liq emasligi o'zi xulosaga to'sqinlik qilmaydi.",
              ru: "Оставшиеся 2 признака — не различия, они плохо отобразились на карте (необъяснимых различий 0). Неполнота фрагмента сама по себе не мешает выводу.",
            },
          },
        ],
      },
      competencies: ["ekspert.tahlil"],
      consequence: {
        uz: "Xulosadagi xato begunoh shaxsni ayblanuvchiga aylantiradi yoki haqiqiy jinoyatchini ozod qiladi; ekspert bila turib yolg'on xulosa bergani uchun esa jinoiy javobgarlikka tortiladi.",
        ru: "Ошибка в выводе делает невиновного обвиняемым или отпускает настоящего преступника; за заведомо ложное заключение эксперт несёт уголовную ответственность.",
      },
    },

    /* 6 ------------------------------------------------------------------ */
    {
      id: "e6-zanjir",
      title: {
        uz: "Dalillar saqlash zanjiri",
        ru: "Цепочка хранения доказательств",
        en: "Chain of custody",
      },
      brief: {
        uz: "Sigaret qoldig'i DNK tahlili uchun biologiya bo'limiga topshirilmoqda. Qabul qiluvchi mutaxassis topshirish dalolatnomasini ko'rib, to'xtab qoldi.",
        ru: "Окурок передаётся в биологический отдел на ДНК-анализ. Принимающий специалист, просмотрев акт передачи, остановился.",
        en: "The butt is being handed to the biology section for DNA. The receiving specialist looks at the transfer record and stops.",
      },
      materials: [
        {
          id: "e-m-dalolatnoma",
          kind: "document",
          title: {
            uz: "Ashyoviy dalilni topshirish-qabul qilish dalolatnomasi",
            ru: "Акт приёма-передачи вещественного доказательства",
            en: "Evidence transfer record",
          },
          body: {
            uz: "Obyekt: sigaret qoldig'i, qog'oz konvertda. Muhr: «ETM-114». Olingan: 16.09, 11:05, ekspert-kriminalist. Saqlangan: ashyoviy dalillar xonasi, 16.09 15:30 dan. Topshirildi: 18.09, 10:20.",
            ru: "Объект: окурок в бумажном конверте. Печать: «ETM-114». Изъят: 16.09, 11:05, эксперт-криминалист. Хранился: комната вещдоков с 16.09 15:30. Передан: 18.09, 10:20.",
          },
          meta: [
            { label: { uz: "Dalolatnomadagi muhr", ru: "Печать по акту" }, value: "ETM-114" },
            { label: { uz: "Konvertdagi muhr", ru: "Печать на конверте" }, value: "ETM-141" },
            { label: { uz: "Konvert holati", ru: "Состояние конверта" }, value: "yopiq, butun" },
          ],
          tone: "warn",
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Dalolatnomadagi muhr raqami konvertdagidan farq qiladi, konvert butun. Qanday yo'l tutasiz?",
          ru: "Номер печати в акте отличается от номера на конверте, конверт цел. Как вы поступаете?",
          en: "The seal number in the record differs from the one on the envelope, which is intact. What do you do?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Konvertni ochmay topshirishni to'xtataman, tergovchiga yozma bildiraman; dala qaydlari va suratlar bo'yicha qaysi raqam to'g'riligini aniqlab, farqni rasmiy tushuntirish xati bilan qayd etgan holda topshirishni qayta rasmiylashtiramiz.",
              ru: "Не вскрывая конверт, приостанавливаю передачу, письменно сообщаю следователю; по полевым записям и фото устанавливаем верный номер и переоформляем передачу с официальным объяснением расхождения.",
              en: "Halt the hand-over without opening the envelope, notify the investigator in writing, establish the correct number from field notes and photos, and redo the transfer with a formal explanation of the discrepancy.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Zanjirdagi har qanday nomuvofiqlik ochiq hujjatlashtirilishi kerak — yashirilgan xato keyinchalik dalilni butunlay yo'qqa chiqaradi, tushuntirilgan xato esa sudda himoyalanadi.",
              ru: "Верно. Любое расхождение в цепочке документируется открыто: скрытая ошибка потом обнулит доказательство, объяснённая — защищается в суде.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Oddiy yozuv xatosi — 114 va 141. Dalolatnomadagi raqamni qo'lda tuzatib, imzo qo'yaman va topshirishni davom ettiraman, vaqtni yo'qotmaslik kerak.",
              ru: "Обычная описка — 114 и 141. Исправляю номер в акте от руки, расписываюсь и продолжаю передачу, чтобы не терять время.",
              en: "Just a typo — 114 vs 141. I correct the record by hand, initial it and carry on to save time.",
            },
            score: 0,
            feedback: {
              uz: "Izohsiz qo'lda tuzatish — hujjatni o'zgartirish. Himoya tomoni buni obyekt almashtirilganligi belgisi sifatida ko'rsatadi.",
              ru: "Исправление без оформления — это изменение документа. Защита представит это как признак подмены объекта.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Konvertni ochib, ichida haqiqatan sigaret qoldig'i borligini tekshiraman; bor bo'lsa, qayta muhrlab topshiraman.",
              ru: "Вскрываю конверт, проверяю, что внутри действительно окурок; если да — переопечатываю и передаю.",
              en: "Open the envelope to check the butt is really inside; if so, reseal and hand it over.",
            },
            score: 0,
            feedback: {
              uz: "Tartibsiz ochish — zanjirni o'zingiz uzasiz va biologik obyektni ifloslantirish xavfini tug'dirasiz. Qadoq faqat tadqiqotda, rasmiylashtirilgan holda ochiladi.",
              ru: "Вскрытие вне процедуры — вы сами разрываете цепочку и рискуете загрязнить биообъект. Упаковку вскрывают только при исследовании, с оформлением.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Obyektni qabul qilmay, ish yurituvchiga qaytaraman; dalil endi yaroqsiz, DNK tahlili o'tkazilmaydi.",
              ru: "Не принимаю объект и возвращаю следователю; доказательство теперь негодно, ДНК-анализ не проводится.",
              en: "Refuse the item and return it; the evidence is now unusable and no DNA test will be done.",
            },
            score: 1,
            feedback: {
              uz: "To'xtatish to'g'ri, lekin xulosa shoshilinch: butun konvertli nomuvofiqlik ko'pincha rasmiy tuzatiladi. Dalildan voz kechish — eng oxirgi chora.",
              ru: "Остановиться правильно, но вывод поспешный: расхождение при целом конверте обычно устраняется официально. Отказ от доказательства — крайняя мера.",
            },
          },
        ],
      },
      competencies: ["ekspert.zanjir"],
      consequence: {
        uz: "Zanjiri uzilgan dalil bo'yicha DNK tahlili qanchalik aniq bo'lmasin, sud uni maqbul emas deb topishi mumkin — butun ekspertiza befoyda bo'ladi.",
        ru: "Каким бы точным ни был ДНК-анализ, по доказательству с разорванной цепочкой суд может признать его недопустимым — вся экспертиза пропадает.",
      },
    },

    /* 7 ------------------------------------------------------------------ */
    {
      id: "e7-xulosa",
      title: {
        uz: "Ekspert xulosasi",
        ru: "Заключение эксперта",
        en: "Expert conclusion",
      },
      brief: {
        uz: "Tergovchi daktiloskopik ekspertiza tayinlagan: «Shkatulka qopqog'idan olingan №1 qo'l izi taqdim etilgan shaxslardan biriga tegishlimi?» Xulosaning «Tadqiqot» va «Xulosalar» qismlarini qisqacha yozing.",
        ru: "Следователь назначил дактилоскопическую экспертизу: «Принадлежит ли след руки №1 с крышки шкатулки одному из представленных лиц?» Кратко напишите части «Исследование» и «Выводы».",
        en: "The investigator ordered a fingerprint examination: 'Does latent print No. 1 from the box lid belong to any of the persons submitted?' Write brief 'Examination' and 'Conclusions' sections.",
      },
      materials: [
        {
          id: "e-m-qaror",
          kind: "document",
          title: {
            uz: "Daktiloskopik ekspertiza tayinlash to'g'risida qaror (ko'chirma)",
            ru: "Постановление о назначении дактилоскопической экспертизы (выписка)",
            en: "Order appointing a fingerprint examination (extract)",
          },
          body: {
            uz: "Ekspertizaga taqdim etiladi: №1 va №2 iz ko'chirilgan daktiloskopik plyonkalar (muhrlangan konvertda), A, B, C shaxslarning daktilokartalari. Ekspertga huquq va majburiyatlari tushuntirilgan, bila turib yolg'on xulosa berganlik uchun javobgarlik haqida ogohlantirilgan.",
            ru: "На экспертизу представлены: дактилоплёнки со следами №1 и №2 (в опечатанном конверте), дактилокарты лиц A, B, C. Эксперту разъяснены права и обязанности, он предупреждён об ответственности за заведомо ложное заключение.",
          },
        },
      ],
      task: {
        kind: "text",
        prompt: {
          uz: "Ekspert xulosasining tadqiqot qismi va xulosalarini yozing (qadoq holati, izning yaroqliligi, solishtirish natijasi, kategorik xulosa, №2 iz haqida).",
          ru: "Напишите исследовательскую часть и выводы заключения (состояние упаковки, пригодность следа, результат сравнения, категорический вывод, о следе №2).",
          en: "Write the examination and conclusions (packaging condition, suitability, comparison result, categorical conclusion, mark No. 2).",
        },
        rubric: [
          {
            uz: "Qadoqning butunligi va muhr raqami tekshirilgani qayd etilgan (dalil zanjiri).",
            ru: "Отмечена проверка целостности упаковки и номера печати (цепочка хранения).",
          },
          {
            uz: "№1 izning yaroqliligi va naqsh turi ko'rsatilgan; №2 iz surtilganligi sababli yaroqsiz deb baholangan.",
            ru: "Указаны пригодность следа №1 и тип узора; след №2 оценён как непригодный из-за смазанности.",
          },
          {
            uz: "Solishtirish natijasi raqamlar bilan asoslangan: B bilan 14 mos minutsiya, tushuntirilmagan farq yo'q; C da 3 ta farq, A da naqsh turi boshqa.",
            ru: "Результат сравнения обоснован цифрами: с B — 14 совпадений, необъяснимых различий нет; у C — 3 различия, у A другой тип узора.",
          },
          {
            uz: "Kategorik xulosa aniq va savolga to'g'ridan-to'g'ri javob beradi (qaysi shaxs, qaysi barmoq), ekspert vakolatidan chiqmaydi (aybdorlik haqida gapirmaydi).",
            ru: "Категорический вывод чёткий, прямо отвечает на вопрос (какое лицо, какой палец), эксперт не выходит за пределы компетенции (не говорит о виновности).",
          },
        ],
        minWords: 50,
        model: {
          uz: "Tadqiqot: ekspertizaga muhrlangan qog'oz konvert keldi, muhr butun, raqami qarordagi ma'lumotga mos. Konvertda ikkita daktiloskopik plyonka. №2 iz kuchli surtilgan, xususiy belgilar ajralmaydi — identifikatsiya uchun yaroqsiz. №1 iz yaroqli: naqsh turi — ulnar ilmoq, 16 ta aniq minutsiya ajratildi. A shaxs kartasida barcha barmoqlar naqshi jingalak — naqsh turi bo'yicha istisno qilindi. C shaxsning o'ng qo'l o'rta barmog'i bilan 9 ta belgi mos, 3 ta tushuntirib bo'lmaydigan farq aniqlandi — istisno qilindi. B shaxsning o'ng qo'l ko'rsatkich barmog'i bilan 14 ta minutsiya joylashuvi va o'zaro nisbatiga ko'ra mos keldi, tushuntirib bo'lmaydigan farq yo'q. Xulosa: shkatulka qopqog'idan olingan №1 qo'l izi Toirov Jasurning o'ng qo'l ko'rsatkich barmog'i bilan qoldirilgan. №2 iz identifikatsiya uchun yaroqsiz.",
          ru: "Исследование: поступил опечатанный бумажный конверт, печать целая, номер соответствует постановлению. В конверте две дактилоплёнки. След №2 сильно смазан, частные признаки не выделяются — непригоден для идентификации. След №1 пригоден: тип узора — ульнарная петля, выделено 16 чётких минуций. У лица A на всех пальцах завитковые узоры — исключено по типу узора. Со средним пальцем правой руки лица C совпали 9 признаков, выявлено 3 необъяснимых различия — исключено. С указательным пальцем правой руки лица B совпали 14 минуций по расположению и взаимному положению, необъяснимых различий нет. Вывод: след руки №1 с крышки шкатулки оставлен указательным пальцем правой руки Тоирова Жасура. След №2 для идентификации непригоден.",
        },
      },
      competencies: ["ekspert.xulosa", "ekspert.tahlil"],
      consequence: {
        uz: "Asoslanmagan yoki vakolatdan chiqqan xulosa sudda qayta ekspertizaga sabab bo'ladi, ish muddati cho'ziladi, ekspertning professional obro'si esa himoya tomoni uchun nishonga aylanadi.",
        ru: "Необоснованное или выходящее за компетенцию заключение ведёт к повторной экспертизе в суде, затягивает дело, а репутация эксперта становится мишенью для защиты.",
      },
    },
  ],
};
