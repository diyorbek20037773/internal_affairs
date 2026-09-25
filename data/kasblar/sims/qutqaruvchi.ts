import type { ProfessionSim } from "@/data/kasblar/types";

/**
 * F-01 «Bog'ishamol, 17-uy» — FVV fire-and-rescue. Flat fire on the 5th floor
 * of a 9-storey block with a reported gas smell in the stairwell.
 * Numbers are consistent across stages: floor height 3 m, fire on floor 5
 * → height to fire floor (5 − 1) × 3 = 12 m; working hydrant 88 m away;
 * standard hose length 20 m; training formula N = 1.2 × (L + Z) / 20.
 * All addresses and persons are fictional.
 */
export const SIM_QUTQARUVCHI: ProfessionSim = {
  id: "sim-fvv-01",
  professionId: "qutqaruvchi",
  code: "F-01",
  title: {
    uz: "Bog'ishamol, 17-uy",
    ru: "Богишамол, дом 17",
    en: "17 Bog'ishamol Street",
  },
  setting: {
    uz: "Shartli Yangiobod tumani, Bog'ishamol ko'chasi 17-uy — 9 qavatli, 4 podyezdli turar joy binosi. Chorshanba, 06:42.",
    ru: "Условный Янгиободский район, ул. Богишамол, дом 17 — 9-этажный жилой дом, 4 подъезда. Среда, 06:42.",
    en: "Fictional Yangiobod district, 17 Bog'ishamol Street: a 9-storey, 4-entrance residential block. Wednesday, 06:42.",
  },
  env: "emergency",
  intro: {
    uz: "Siz — FVV yong'in-qutqaruv qismi karaul boshlig'isiz. Birinchi bo'lib yetib kelayotgan avtotsisterna ekipaji sizning qo'mondonligingizda. Chaqiruv kartasini o'qing, xavfni baholang, kuch va vositalarni hisoblang, evakuatsiyani tashkil qiling, jabrlanganlarni saralang, hamkor xizmatlar bilan boshqaruvni yo'lga qo'ying va hisobot yozing.",
    ru: "Вы — начальник караула пожарно-спасательной части МЧС. Под вашим командованием экипаж автоцистерны, прибывающей первой. Изучите карточку вызова, оцените опасность, рассчитайте силы и средства, организуйте эвакуацию, проведите сортировку пострадавших, наладьте управление с другими службами и напишите отчёт.",
    en: "You are the watch commander of an Emergencies Ministry fire-rescue unit, leading the first-arriving tender. Read the dispatch card, assess hazards, calculate resources, organise evacuation, triage casualties, set up command with partner services and write the report.",
  },
  minutes: 25,
  stages: [
    /* 1 — dispatch card --------------------------------------------- */
    {
      id: "s1",
      title: {
        uz: "Chaqiruv kartasi",
        ru: "Карточка вызова",
        en: "Dispatch card",
      },
      brief: {
        uz: "06:42, «101» dispetcheri chaqiruvni uzatdi. Yo'lda 6 daqiqa. Karta va bino ma'lumotlarini o'qing.",
        ru: "06:42, диспетчер «101» передал вызов. В пути 6 минут. Изучите карточку и данные о здании.",
        en: "06:42, the 101 dispatcher passes the call. Six minutes out. Read the card and building data.",
      },
      materials: [
        {
          id: "fv-m1",
          kind: "document",
          title: {
            uz: "Chaqiruv kartasi №0412",
            ru: "Карточка вызова №0412",
            en: "Dispatch card No. 0412",
          },
          body: {
            uz: "Qo'ng'iroq qiluvchi: 3-podyezd, 6-qavat aholisi. «Pastdagi 5-qavatdagi 34-xonadon derazasidan qora tutun chiqyapti, zinapoyada ham tutun. 4-qavatda gaz hidi kelyapti.» 34-xonadonda keksa ayol yolg'iz yashaydi. Qo'ng'iroq qiluvchi bolalari bilan uyda.",
            ru: "Звонит житель 6-го этажа, подъезд 3: «Из окна квартиры 34 на 5-м этаже под нами идёт чёрный дым, в подъезде тоже дым. На 4-м этаже пахнет газом». В квартире 34 живёт одна пожилая женщина. Звонящий дома с детьми.",
          },
          meta: [
            { label: { uz: "Qabul", ru: "Приём" }, value: "06:42" },
            { label: { uz: "Manzil", ru: "Адрес" }, value: "Bog'ishamol 17, 3-podyezd" },
            { label: { uz: "Yetib borish", ru: "Прибытие" }, value: "≈06:48" },
          ],
          tone: "warn",
        },
        {
          id: "fv-m2",
          kind: "table",
          title: {
            uz: "Bino ma'lumotnomasi",
            ru: "Справка по зданию",
            en: "Building data",
          },
          body: {
            uz: "Operativ reja kartochkasidan. Qavat balandligi — 3 m. Gaz — tabiiy gaz, har podyezdda alohida stoyak, uzish joyi — podyezd tashqarisidagi kran.",
            ru: "Из карточки оперативного плана. Высота этажа — 3 м. Газ — природный, в каждом подъезде свой стояк, отключение — кран снаружи подъезда.",
          },
          table: {
            head: ["Ko'rsatkich / Показатель", "Qiymat / Значение"],
            rows: [
              ["Qavatlar / Этажей", 9],
              ["3-podyezdda xonadonlar / Квартир в подъезде 3", 36],
              ["3-podyezd aholisi (taxm.) / Жителей подъезда 3 (прим.)", 104],
              ["Harakatlanishi cheklangan / Маломобильные", "8-qavat, 30-xonadon — aravachadagi erkak"],
              ["PG-1 gidrant masofasi / Гидрант ПГ-1", "88 m (soz / исправен)"],
              ["PG-2 gidrant masofasi / Гидрант ПГ-2", "150 m (nosoz / неисправен)"],
              ["Lift / Лифт", "1 ta, yuk-yo'lovchi"],
            ],
          },
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Yo'lda va yetib kelgan zahoti birinchi navbatdagi qaroringiz qanday?",
          ru: "Каково ваше первоочередное решение в пути и сразу по прибытии?",
          en: "What is your first decision en route and on arrival?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Dispetcherdan gaz xizmatini chaqirishni so'rayman; yetib kelgach ikki kishilik zveno bilan nafas himoya vositalarida 5-qavatga razvedka, qolganlari PG-1dan yeng yotqizadi.",
              ru: "Прошу диспетчера вызвать газовую службу; по прибытии звено из двух в СИЗОД — разведка на 5-й этаж, остальные прокладывают рукава от ПГ-1.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Gaz hidi haqida ma'lumot bor — gaz xizmati oldindan chaqiriladi. Razvedka va suv ta'minoti parallel boshlanadi, nosoz PG-2 hisobga olinmaydi.",
              ru: "Верно. Есть сведения о запахе газа — газовая служба вызывается заранее. Разведка и водоснабжение начинаются параллельно, неисправный ПГ-2 не учитывается.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Yetib kelishim bilan barcha ekipajni 34-xonadon eshigini buzib kirishga yuboraman, chunki ichkarida keksa ayol bor — har bir soniya muhim, suv ta'minotini keyin o'ylaymiz.",
              ru: "Сразу по прибытии направляю весь экипаж вскрывать дверь квартиры 34, там пожилая женщина — каждая секунда важна, о водоснабжении подумаем потом.",
            },
            score: 1,
            feedback: {
              uz: "Qutqarish ustuvor, lekin suvsiz va razvedkasiz eshikni ochish — alanga va tutunning zinapoyaga keskin chiqishi; butun ekipajni bir nuqtaga yuborish boshqa vazifalarni ochiq qoldiradi.",
              ru: "Спасение приоритетно, но вскрытие двери без воды и разведки — резкий выброс огня и дыма в подъезд; весь экипаж в одной точке оставляет остальные задачи открытыми.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Yetib kelgach, liftdan foydalanib, 6-qavatdagi bolali oilani birinchi bo'lib tushirib olaman.",
              ru: "По прибытии на лифте поднимаюсь и первой спускаю семью с детьми с 6-го этажа.",
            },
            score: 0,
            feedback: {
              uz: "Yong'in paytida liftdan foydalanish taqiqlanadi: shaxta tutunga to'ladi, elektr uzilib lift qavatlar orasida qolishi mumkin. Gaz hidi bo'lsa, elektr uskunasi uchqun manbai ham bo'ladi.",
              ru: "Пользоваться лифтом при пожаре запрещено: шахта задымляется, при отключении электричества лифт застрянет между этажами. При запахе газа электрооборудование — ещё и источник искры.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Gaz hidi sababli portlash xavfi bor: ikkinchi avtotsisterna va gaz xizmati yetib kelguncha ekipajni bino tashqarisida ushlab, aholini podyezddan uzoqroq turishga chaqiraman.",
              ru: "Из-за запаха газа есть угроза взрыва: до прибытия второй автоцистерны и газовой службы держу экипаж снаружи и призываю жителей держаться подальше от подъезда.",
            },
            score: 0,
            feedback: {
              uz: "Birinchi kelgan bo'linma harakatni kechiktirmaydi: razvedka, qutqarish va suv ta'minoti darhol boshlanadi.",
              ru: "Первое прибывшее подразделение не откладывает действия: разведка, спасение и водоснабжение начинаются немедленно.",
            },
          },
        ],
      },
      competencies: ["qutqaruvchi.boshqaruv", "qutqaruvchi.xavf_baholash"],
      consequence: {
        uz: "Razvedkasiz harakat, liftdan foydalanish yoki kutish — bu yong'inda qurbonlar sonini oshiradigan klassik xatolar. Gaz sizishini oldindan hisobga olmaslik portlash xavfini tug'diradi.",
        ru: "Действия без разведки, использование лифта или ожидание — классические ошибки, увеличивающие число жертв. Если не учесть утечку газа заранее, возникает угроза взрыва.",
      },
    },

    /* 2 — hazard assessment ---------------------------------------- */
    {
      id: "s2",
      title: {
        uz: "Xavfni baholash",
        ru: "Оценка опасности",
        en: "Hazard assessment",
      },
      brief: {
        uz: "06:48, yetib keldingiz. Razvedka zvenosining birinchi dokladi va tashqi kuzatuv natijalari quyida.",
        ru: "06:48, вы прибыли. Первый доклад звена разведки и результаты внешнего осмотра — ниже.",
        en: "06:48, on scene. The recon team's first report and your external size-up are below.",
      },
      materials: [
        {
          id: "fv-m3",
          kind: "message",
          title: {
            uz: "Razvedka dokladi (radio)",
            ru: "Доклад разведки (рация)",
            en: "Recon report (radio)",
          },
          body: {
            uz: "«5-qavat, 34-xonadon: eshik yopiq, eshik qizigan, tagidan tutun chiqyapti. Zinapoya 5–9-qavatlarda tutun bosgan, ko'rinish 2 metrgacha. 4-qavatda gaz hidi aniq sezilyapti, 31-xonadon eshigi ochiq, ichkarida hech kim javob bermayapti. 6-qavatda bolalar yig'isi eshitilyapti.»",
            ru: "«5-й этаж, кв. 34: дверь закрыта, горячая, из-под неё идёт дым. Лестница на 5–9-м этажах задымлена, видимость до 2 метров. На 4-м этаже явный запах газа, дверь кв. 31 открыта, внутри никто не отвечает. На 6-м этаже слышен детский плач.»",
          },
          tone: "warn",
        },
        {
          id: "fv-m4",
          kind: "note",
          title: {
            uz: "Tashqi kuzatuv",
            ru: "Внешний осмотр",
            en: "External size-up",
          },
          body: {
            uz: "34-xonadon balkonidan alanga ko'rinmoqda, balkonda propan ballon turgan. 7-qavat balkonida ikki kishi yordam so'ramoqda. Podyezd oldiga ikkita yengil avtomobil qo'yilgan, avtonarvon yo'lagini qisman to'smoqda. Shamol — sharqdan, kuchsiz.",
            ru: "С балкона кв. 34 видно пламя, на балконе стоит пропановый баллон. На балконе 7-го этажа двое зовут на помощь. У подъезда стоят две легковые машины, частично перекрывая проезд автолестницы. Ветер восточный, слабый.",
          },
        },
      ],
      task: {
        kind: "multi",
        prompt: {
          uz: "Qaysilari ushbu yong'indagi asosiy xavf omillari va ular hozir chora ko'rishni talab qiladi? Barcha to'g'ri javoblarni belgilang.",
          ru: "Какие из этого — основные факторы опасности на этом пожаре, требующие мер прямо сейчас? Отметьте все верные.",
          en: "Which are the main hazards on this fire requiring action now? Select all that apply.",
        },
        options: [
          {
            id: "a",
            text: { uz: "Alanga yonidagi balkondagi propan ballon", ru: "Пропановый баллон на балконе рядом с пламенем" },
            correct: true,
            feedback: { uz: "Qizish natijasida portlash xavfi — ballonni sovitish yoki olib chiqish birinchi navbatdagi vazifa.", ru: "Риск взрыва при нагреве — охлаждение или вынос баллона в первую очередь." },
          },
          {
            id: "b",
            text: { uz: "4-qavatdagi gaz hidi va ochiq 31-xonadon", ru: "Запах газа на 4-м этаже и открытая кв. 31" },
            correct: true,
            feedback: { uz: "Podyezd stoyagini uzish, elektr kalitlarini bosmaslik, shamollatish va xonadonni tekshirish kerak.", ru: "Перекрыть стояк подъезда, не трогать электровыключатели, проветрить и проверить квартиру." },
          },
          {
            id: "c",
            text: { uz: "5–9-qavatlarda tutun bosgan zinapoya", ru: "Задымлённая лестница на 5–9-м этажах" },
            correct: true,
            feedback: { uz: "Yuqori qavatlar aholisining asosiy evakuatsiya yo'li xavfli — tutundan himoya va muqobil yo'l zarur.", ru: "Основной путь эвакуации верхних этажей опасен — нужна защита от дыма и альтернативный путь." },
          },
          {
            id: "d",
            text: { uz: "Avtonarvon yo'lagini to'sgan avtomobillar", ru: "Машины, перекрывающие проезд автолестницы" },
            correct: true,
            feedback: { uz: "7-qavat balkonidagilarni qutqarish uchun avtonarvon kerak bo'ladi — IIV orqali yo'lakni bo'shatish.", ru: "Для спасения людей с балкона 7-го этажа понадобится автолестница — освободить проезд через полицию." },
          },
          {
            id: "e",
            text: { uz: "Kuchsiz sharqiy shamol", ru: "Слабый восточный ветер" },
            correct: false,
            feedback: { uz: "Hisobga olinadi, lekin kuchsiz shamol hozir alohida chora talab qilmaydi.", ru: "Учитывается, но слабый ветер сейчас отдельных мер не требует." },
          },
          {
            id: "f",
            text: { uz: "Binoning boshqa podyezdlari (1, 2, 4)", ru: "Другие подъезды дома (1, 2, 4)" },
            correct: false,
            feedback: { uz: "Hozircha tutun va gaz faqat 3-podyezdda; boshqa podyezdlar kuzatuvda, lekin ustuvor emas.", ru: "Пока дым и газ только в подъезде 3; другие подъезды под наблюдением, но не приоритет." },
          },
        ],
      },
      competencies: ["qutqaruvchi.xavf_baholash"],
      consequence: {
        uz: "Ballon yoki gaz sizishi e'tibordan chetda qolsa, portlash qutqaruvchilar va aholi orasida ko'p qurbonlarga olib keladi. To'silgan yo'lak esa balkondagi odamlarni qutqarishni kechiktiradi.",
        ru: "Если упустить баллон или утечку газа, взрыв приведёт к многочисленным жертвам среди спасателей и жителей. А перекрытый проезд задержит спасение людей с балкона.",
      },
    },

    /* 3 — forces and means (numeric) -------------------------------- */
    {
      id: "s3",
      title: {
        uz: "Kuch va vositalar",
        ru: "Силы и средства",
        en: "Forces and means",
      },
      brief: {
        uz: "Suv PG-1 gidrantidan olinadi. Avtotsisternadan 5-qavatgacha magistral va ishchi liniya uchun nechta standart yeng kerakligini o'quv formulasi bo'yicha hisoblang.",
        ru: "Вода берётся от гидранта ПГ-1. Рассчитайте по учебной формуле, сколько стандартных рукавов нужно для магистральной и рабочей линии до 5-го этажа.",
        en: "Water comes from hydrant PG-1. Using the training formula, calculate how many standard hoses are needed to reach the 5th floor.",
      },
      materials: [
        {
          id: "fv-m5",
          kind: "document",
          title: {
            uz: "O'quv formulasi: yenglar soni",
            ru: "Учебная формула: число рукавов",
            en: "Training formula: hose count",
          },
          body: {
            uz: "N = 1,2 × (L + Z) / 20, bu yerda L — gidrantdan binogacha masofa (m), Z — yong'in qavatigacha balandlik (m) = (qavat − 1) × qavat balandligi, 20 — bitta yeng uzunligi (m), 1,2 — yo'l notekisligi koeffitsiyenti. Natija butun songa yaxlitlanadi (yuqoriga).",
            ru: "N = 1,2 × (L + Z) / 20, где L — расстояние от гидранта до здания (м), Z — высота до этажа пожара (м) = (этаж − 1) × высота этажа, 20 — длина одного рукава (м), 1,2 — коэффициент неровности местности. Результат округляется до целого (вверх).",
          },
          meta: [
            { label: { uz: "L (PG-1)", ru: "L (ПГ-1)" }, value: "88 m" },
            { label: { uz: "Yong'in qavati", ru: "Этаж пожара" }, value: "5" },
            { label: { uz: "Qavat balandligi", ru: "Высота этажа" }, value: "3 m" },
          ],
        },
      ],
      task: {
        kind: "numeric",
        prompt: {
          uz: "Nechta standart (20 m) yeng kerak?",
          ru: "Сколько стандартных (20 м) рукавов потребуется?",
          en: "How many standard (20 m) hoses are needed?",
        },
        unit: "yeng",
        answer: 6,
        tolerance: 0,
        solution: {
          uz: "Z = (5 − 1) × 3 = 12 m. L + Z = 88 + 12 = 100 m. N = 1,2 × 100 / 20 = 120 / 20 = 6 yeng. Eslatma: nosoz PG-2 (150 m) hisobga olinmaydi.",
          ru: "Z = (5 − 1) × 3 = 12 м. L + Z = 88 + 12 = 100 м. N = 1,2 × 100 / 20 = 120 / 20 = 6 рукавов. Примечание: неисправный ПГ-2 (150 м) не учитывается.",
          en: "Z = (5 − 1) × 3 = 12 m. L + Z = 88 + 12 = 100 m. N = 1.2 × 100 / 20 = 120 / 20 = 6 hoses. Note: the faulty PG-2 (150 m) is not used.",
        },
      },
      competencies: ["qutqaruvchi.boshqaruv"],
      consequence: {
        uz: "Yenglar yetishmasa, stvol yong'in qavatiga yetmaydi va qayta ulash uchun daqiqalar yo'qotiladi — bu vaqt ichida yong'in qo'shni xonadonlarga va zinapoyaga tarqaladi.",
        ru: "Если рукавов не хватит, ствол не дойдёт до этажа пожара, минуты уйдут на наращивание — за это время огонь распространится на соседние квартиры и лестницу.",
      },
    },

    /* 4 — evacuation order ----------------------------------------- */
    {
      id: "s4",
      title: {
        uz: "Evakuatsiya tartibi",
        ru: "Порядок эвакуации",
        en: "Evacuation sequence",
      },
      brief: {
        uz: "Stvol 5-qavatda ishlamoqda, gaz xizmati yo'lda. 3-podyezdda taxminan 104 kishi. Evakuatsiya harakatlarini to'g'ri ketma-ketlikda tashkil qiling.",
        ru: "Ствол работает на 5-м этаже, газовая служба в пути. В подъезде 3 около 104 человек. Организуйте эвакуацию в правильной последовательности.",
        en: "A line is working on the 5th floor, the gas service is on its way. About 104 people are in entrance 3. Sequence the evacuation.",
      },
      materials: [],
      task: {
        kind: "order",
        prompt: {
          uz: "Evakuatsiya qadamlarini to'g'ri tartibda joylashtiring.",
          ru: "Расположите шаги эвакуации в правильном порядке.",
          en: "Put the evacuation steps in the correct order.",
        },
        items: [
          { id: "upper", text: { uz: "7–9-qavatlar: nafas himoya vositasida kuzatib tushirish, 7-qavat balkonidan va 8-qavatdagi aravachadagi erkakni avtonarvon orqali qutqarish", ru: "7–9-й этажи: вывод в СИЗОД с сопровождением, спасение с балкона 7-го этажа и мужчины на коляске с 8-го через автолестницу", en: "Floors 7–9: escorted evacuation with breathing sets; ladder rescue from the 7th-floor balcony and of the wheelchair user on floor 8" } },
          { id: "lift", text: { uz: "Liftni to'xtatish, zinapoya eshiklarini yopib, tutun tarqalishini cheklash", ru: "Остановить лифт, закрыть двери на лестницу, ограничить распространение дыма", en: "Stop the lift, close stairwell doors to limit smoke" } },
          { id: "count", text: { uz: "Yig'ilish joyida xonadonlar ro'yxati bo'yicha sanash, bedarak qolganlarni aniqlash", ru: "На месте сбора пересчитать по списку квартир, выявить пропавших", en: "Head count at the assembly point by flat list, identify missing persons" } },
          { id: "fire", text: { uz: "Yong'in qavati (5) va undan yuqoridagi 6-qavat odamlarini birinchi navbatda chiqarish", ru: "В первую очередь вывести людей с этажа пожара (5) и вышестоящего 6-го", en: "First evacuate the fire floor (5) and the floor above (6)" } },
          { id: "lower", text: { uz: "1–4-qavatlar: gaz hidi sababli olovsiz, elektr kalitlarini bosmasdan chiqarish", ru: "1–4-й этажи: вывести без огня и не трогая электровыключатели из-за запаха газа", en: "Floors 1–4: evacuate without flames or switching electrics because of the gas" } },
        ],
        correct: ["lift", "fire", "upper", "lower", "count"],
      },
      competencies: ["qutqaruvchi.evakuatsiya"],
      consequence: {
        uz: "Noto'g'ri tartibda evakuatsiya qilinsa, eng ko'p xavf ostidagi yuqori qavat aholisi tutunda qoladi, sanash o'tkazilmasa esa binoda qolgan odam haqida hech kim bilmaydi.",
        ru: "При неверном порядке эвакуации жители верхних этажей, находящиеся в наибольшей опасности, остаются в дыму, а без пересчёта никто не узнает о человеке, оставшемся в здании.",
      },
    },

    /* 5 — triage (match) ------------------------------------------- */
    {
      id: "s5",
      title: {
        uz: "Birinchi yordam: triaj",
        ru: "Первая помощь: сортировка",
        en: "First aid: triage",
      },
      brief: {
        uz: "Tez yordam hali 4 daqiqa uzoqda. Yig'ilish joyiga to'rt jabrlanuvchi keltirildi. START usuli bo'yicha saralang.",
        ru: "Скорая ещё в 4 минутах. На место сбора доставлены четверо пострадавших. Проведите сортировку по методу START.",
        en: "The ambulance is still 4 minutes away. Four casualties are at the assembly point. Triage them using START.",
      },
      materials: [
        {
          id: "fv-m6",
          kind: "note",
          title: {
            uz: "START eslatmasi",
            ru: "Памятка START",
            en: "START reminder",
          },
          body: {
            uz: "Yura oladi → yashil. Nafas yo'q, nafas yo'li ochilgandan keyin ham tiklanmadi → qora. Nafas 30 dan ko'p daqiqasiga yoki bilak pulsi yo'q yoki oddiy buyruqni bajarmaydi → qizil. Qolganlari → sariq.",
            ru: "Может идти → зелёный. Нет дыхания и после открытия дыхательных путей не восстановилось → чёрный. Дыхание более 30 в минуту, или нет пульса на запястье, или не выполняет простые команды → красный. Остальные → жёлтый.",
          },
        },
      ],
      task: {
        kind: "match",
        prompt: {
          uz: "Har bir jabrlanuvchini triaj toifasiga moslang.",
          ru: "Сопоставьте каждого пострадавшего с категорией сортировки.",
          en: "Match each casualty to a triage category.",
        },
        left: [
          { id: "v1", text: { uz: "Qo'ng'iroq qilgan otaning 10 yoshli qizi: yo'taladi, o'zi yurib keldi, kaftida kichik kuyish", ru: "10-летняя дочь звонившего: кашляет, пришла сама, небольшой ожог ладони", en: "Caller's 10-year-old daughter: coughing, walked out, small burn on palm" } },
          { id: "v2", text: { uz: "34-xonadon egasi, 71 yosh: nafasi daqiqasiga 34, savollarga javob bermaydi, yuzida qurum", ru: "Хозяйка кв. 34, 71 год: дыхание 34 в минуту, на вопросы не отвечает, копоть на лице", en: "Flat 34 owner, 71: breathing 34/min, unresponsive to questions, soot on face" } },
          { id: "v3", text: { uz: "7-qavat balkonidan tushirilgan erkak: boldiri singan, yura olmaydi, nafasi 20, bilak pulsi bor, buyruqlarni bajaradi", ru: "Мужчина, снятый с балкона 7-го этажа: перелом голени, идти не может, дыхание 20, пульс на запястье есть, команды выполняет", en: "Man lowered from the 7th-floor balcony: broken shin, can't walk, breathing 20, radial pulse present, follows commands" } },
          { id: "v4", text: { uz: "31-xonadondan olib chiqilgan erkak: nafas yo'q, nafas yo'li ochilgandan keyin ham nafas tiklanmadi", ru: "Мужчина, вынесенный из кв. 31: дыхания нет, после открытия дыхательных путей не восстановилось", en: "Man carried out of flat 31: not breathing, no breathing after airway opened" } },
        ],
        right: [
          { id: "green", text: { uz: "Yashil — kechiktirilishi mumkin, yengil", ru: "Зелёный — лёгкие, могут ждать", en: "Green — minor" } },
          { id: "red", text: { uz: "Qizil — zudlik bilan yordam", ru: "Красный — немедленная помощь", en: "Red — immediate" } },
          { id: "yellow", text: { uz: "Sariq — kechiktirilgan, lekin shoshilinch", ru: "Жёлтый — отсроченная, но срочная", en: "Yellow — delayed" } },
          { id: "black", text: { uz: "Qora — hayot belgilarisiz", ru: "Чёрный — без признаков жизни", en: "Black — no signs of life" } },
        ],
        pairs: [
          ["v1", "green"],
          ["v2", "red"],
          ["v3", "yellow"],
          ["v4", "black"],
        ],
      },
      competencies: ["qutqaruvchi.birinchi_yordam"],
      consequence: {
        uz: "Triaj xatosi cheklangan resursni noto'g'ri joyga yo'naltiradi: eng og'ir, ammo qutqarib qolish mumkin bo'lgan jabrlanuvchi o'z vaqtida yordam olmaydi.",
        ru: "Ошибка сортировки направляет ограниченные ресурсы не туда: самый тяжёлый, но спасаемый пострадавший не получит помощь вовремя.",
      },
    },

    /* 6 — command and handover ------------------------------------- */
    {
      id: "s6",
      title: {
        uz: "Boshqaruv va hamkorlik",
        ru: "Управление и взаимодействие",
        en: "Command and cooperation",
      },
      brief: {
        uz: "07:05. Yong'in lokalizatsiya qilindi. Joyda: IIV patruli, ikki tez yordam brigadasi, gaz xizmati, tuman hokimligi vakili. Qarindoshlar binoga kirishga urinmoqda, bir blogger jonli efir qilmoqda.",
        ru: "07:05. Пожар локализован. На месте: патруль ОВД, две бригады скорой, газовая служба, представитель хокимията. Родственники пытаются пройти в здание, блогер ведёт прямой эфир.",
        en: "07:05. The fire is contained. On scene: police patrol, two ambulance crews, the gas service, a district official. Relatives try to enter the building; a blogger is live-streaming.",
      },
      materials: [
        {
          id: "fv-m7",
          kind: "message",
          title: {
            uz: "Radio: 07:05",
            ru: "Рация: 07:05",
            en: "Radio: 07:05",
          },
          body: {
            uz: "Gaz xizmati: «3-podyezd stoyagi uzildi, 4-qavatda o'lchov davom etmoqda.» Tez yordam: «Qizil toifadagi jabrlanuvchini olib ketyapmiz. Qolganlarini kimga topshiramiz?» IIV patruli: «Aholini qayerga to'playmiz?»",
            ru: "Газовая служба: «Стояк подъезда 3 перекрыт, на 4-м этаже продолжаются замеры». Скорая: «Забираем пострадавшую красной категории. Кому передаёте остальных?» Патруль ОВД: «Куда собираем жителей?»",
          },
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Boshqaruvni qanday tashkil qilasiz?",
          ru: "Как вы организуете управление?",
          en: "How do you organise command?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Hokimlik vakili yuqori mansabdor bo'lgani uchun boshqaruvni unga topshiraman va o'zim faqat o'chirishga qarayman.",
              ru: "Передаю управление представителю хокимията как старшему по должности, сам занимаюсь только тушением.",
            },
            score: 0,
            feedback: {
              uz: "Yong'inni o'chirish va qutqarish ishlariga FVV rahbari boshchilik qiladi. Hokimlik vakili — aholini joylashtirish va ta'minotda hamkor, ammo taktik rahbar emas.",
              ru: "Тушением и спасательными работами руководит руководитель МЧС. Представитель хокимията — партнёр по размещению и обеспечению жителей, но не тактический руководитель.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Yagona shtab nuqtasini belgilayman: IIV — o'rab olish, yo'l va aholi yig'ilish joyi; tez yordam — jabrlanganlar punkti; gaz xizmati — 4-qavat; hokimlik — vaqtinchalik joylashtirish.",
              ru: "Назначаю единую точку штаба: ОВД — оцепление, проезд и место сбора жителей; скорая — пункт пострадавших; газовая служба — 4-й этаж; хокимият — временное размещение.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Bitta rahbar, bitta shtab, har bir xizmatga aniq vazifa. Qarindoshlar va blogger masalasi IIV o'rab olishi orqali hal bo'ladi.",
              ru: "Верно. Один руководитель, один штаб, чёткая задача каждой службе. Вопрос родственников и блогера решается через оцепление ОВД.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Yong'in lokalizatsiya qilingani uchun hamkor xizmatlarga o'zaro kelishib ishlashni aytaman, o'zim esa blogger bilan gaplashib, noto'g'ri ma'lumot tarqalmasligi uchun jonli efirda vaziyatni tushuntiraman.",
              ru: "Раз пожар локализован, говорю службам договариваться между собой, а сам беседую с блогером и в прямом эфире объясняю ситуацию, чтобы не распространялась ложь.",
            },
            score: 0,
            feedback: {
              uz: "Lokalizatsiya — tugatish emas. Rahbarning shtabni tashlab, efirga chiqishi boshqaruvni yo'qotadi; ommaviy axborot bilan rasmiy vakil ishlaydi.",
              ru: "Локализация — не ликвидация. Уход руководителя из штаба в эфир означает потерю управления; со СМИ работает официальный представитель.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Jabrlanganlarni tez yordamga topshirib, qolgan xizmatlarga radio orqali navbat bilan ko'rsatma beraman.",
              ru: "Передаю пострадавших скорой, остальным службам по очереди даю указания по рации.",
            },
            score: 2,
            feedback: {
              uz: "Yomon emas, lekin yagona shtab nuqtasisiz va yig'ilish joyi aniq belgilanmasa, xizmatlar bir-birini topolmaydi, qarindoshlar binoga kirib ketadi.",
              ru: "Неплохо, но без единой точки штаба и чёткого места сбора службы не найдут друг друга, а родственники проникнут в здание.",
            },
          },
        ],
      },
      competencies: ["qutqaruvchi.boshqaruv"],
      consequence: {
        uz: "Boshqaruv bo'linib ketsa, xizmatlar bir-birining ishini takrorlaydi yoki o'tkazib yuboradi, begona shaxslar xavfli zonaga kiradi — bu ikkilamchi jabrlanishlarga olib keladi.",
        ru: "При размытом управлении службы дублируют или упускают задачи друг друга, посторонние попадают в опасную зону — это ведёт к вторичным пострадавшим.",
      },
    },

    /* 7 — report --------------------------------------------------- */
    {
      id: "s7",
      title: {
        uz: "Hisobot",
        ru: "Отчёт",
        en: "Report",
      },
      brief: {
        uz: "07:40, yong'in to'liq bartaraf etildi. Karaul boshlig'i sifatida qisqa operativ hisobot yozing.",
        ru: "07:40, пожар полностью ликвидирован. Напишите краткий оперативный отчёт как начальник караула.",
        en: "07:40, the fire is fully out. Write a short operational report as watch commander.",
      },
      materials: [
        {
          id: "fv-m8",
          kind: "note",
          title: {
            uz: "Xronologiya",
            ru: "Хронология",
            en: "Timeline",
          },
          body: {
            uz: "06:42 chaqiruv; 06:48 yetib kelish, razvedka; 06:52 PG-1dan suv (6 yeng), stvol 5-qavatda; 06:55 propan ballon sovitilib olib chiqildi; 06:58 7-qavat balkonidan 2 kishi avtonarvon orqali qutqarildi; 07:01 gaz stoyagi uzildi; 07:03 lokalizatsiya; 07:40 bartaraf etildi. Evakuatsiya: 3-podyezddan 104 kishi, hammasi sanaldi. Jabrlanganlar: qizil — 1, sariq — 1, yashil — 1; 31-xonadondan olib chiqilgan erkak — hayot belgilarisiz.",
            ru: "06:42 вызов; 06:48 прибытие, разведка; 06:52 вода от ПГ-1 (6 рукавов), ствол на 5-м этаже; 06:55 пропановый баллон охлаждён и вынесен; 06:58 с балкона 7-го этажа по автолестнице спасены 2 человека; 07:01 газовый стояк перекрыт; 07:03 локализация; 07:40 ликвидация. Эвакуация: из подъезда 3 — 104 человека, все пересчитаны. Пострадавшие: красный — 1, жёлтый — 1, зелёный — 1; мужчина, вынесенный из кв. 31, — без признаков жизни.",
          },
        },
      ],
      task: {
        kind: "text",
        prompt: {
          uz: "Operativ hisobot yozing: vaziyat, qilingan ishlar, kuch va vositalar, natijalar, hamkorlik, tavsiyalar.",
          ru: "Напишите оперативный отчёт: обстановка, выполненные работы, силы и средства, результаты, взаимодействие, рекомендации.",
          en: "Write the operational report: situation, actions, resources, outcomes, cooperation, recommendations.",
        },
        rubric: [
          { uz: "Asosiy vaqtlar (chaqiruv, yetib kelish, lokalizatsiya, bartaraf etish) va manzil aniq ko'rsatilgan", ru: "Точно указаны ключевые времена (вызов, прибытие, локализация, ликвидация) и адрес" },
          { uz: "Xavf omillari (gaz sizishi, propan ballon) va ularga ko'rilgan choralar qayd etilgan", ru: "Отражены факторы опасности (утечка газа, пропановый баллон) и принятые меры" },
          { uz: "Evakuatsiya va qutqarilganlar soni, triaj natijalari sonlarda keltirilgan va xronologiyaga mos", ru: "Число эвакуированных и спасённых, итоги сортировки даны в цифрах и совпадают с хронологией" },
          { uz: "Hamkor xizmatlar va ularga topshirilgan vazifalar, shuningdek, yong'in sababini aniqlash bo'yicha tavsiya bor", ru: "Указаны службы-партнёры и их задачи, есть рекомендация по установлению причины пожара" },
        ],
        minWords: 55,
        model: {
          uz: "Operativ hisobot. 06:42 da Bog'ishamol ko'chasi 17-uy, 3-podyezd, 5-qavat 34-xonadonda yong'in va 4-qavatda gaz hidi haqida chaqiruv qabul qilindi. 06:48 da yetib kelindi, razvedka o'tkazildi, gaz xizmati oldindan chaqirildi. 06:52 da PG-1 gidrantidan 6 ta yeng bilan suv ta'minoti o'rnatilib, stvol 5-qavatga kiritildi. 06:55 da balkondagi propan ballon sovitilib, olib chiqildi. 06:58 da 7-qavat balkonidan 2 kishi avtonarvon orqali qutqarildi. 07:01 da gaz xizmati 3-podyezd stoyagini uzdi. 07:03 da yong'in lokalizatsiya qilindi, 07:40 da bartaraf etildi. 3-podyezddan 104 kishi evakuatsiya qilinib, ro'yxat bo'yicha sanaldi. Triaj: qizil — 1 (34-xonadon egasi), sariq — 1, yashil — 1; 31-xonadondan olib chiqilgan erkakda hayot belgilari yo'q edi, tez yordamga topshirildi. IIV patruli o'rab olish va aholi yig'ilish joyini, hokimlik vaqtinchalik joylashtirishni ta'minladi. Tavsiya: yong'in va gaz sizishi sababini aniqlash uchun yong'in-texnik ekspertiza, 31-xonadon holati bo'yicha IIVga xabar berildi.",
          ru: "Оперативный отчёт. В 06:42 принят вызов о пожаре в кв. 34 на 5-м этаже подъезда 3 дома 17 по ул. Богишамол и запахе газа на 4-м этаже. В 06:48 прибытие, проведена разведка, газовая служба вызвана заранее. В 06:52 установлено водоснабжение от ПГ-1 (6 рукавов), ствол введён на 5-й этаж. В 06:55 пропановый баллон с балкона охлаждён и вынесен. В 06:58 с балкона 7-го этажа по автолестнице спасены 2 человека. В 07:01 газовая служба перекрыла стояк подъезда 3. В 07:03 пожар локализован, в 07:40 ликвидирован. Из подъезда 3 эвакуировано 104 человека, пересчитаны по списку. Сортировка: красный — 1 (хозяйка кв. 34), жёлтый — 1, зелёный — 1; у мужчины, вынесенного из кв. 31, признаков жизни не было, передан скорой. Патруль ОВД обеспечил оцепление и место сбора жителей, хокимият — временное размещение. Рекомендация: пожарно-техническая экспертиза для установления причин пожара и утечки газа; о ситуации в кв. 31 сообщено в ОВД.",
        },
      },
      competencies: ["qutqaruvchi.hujjat"],
      consequence: {
        uz: "Hisobotdagi raqamlar xronologiyaga mos kelmasa yoki xavf omillari tushib qolsa, yong'in sababini aniqlash va tergov ishi qiyinlashadi, bo'linmaning harakatlari esa asossiz tanqid ostida qoladi.",
        ru: "Если цифры в отчёте расходятся с хронологией или опущены факторы опасности, установление причины пожара и расследование затрудняются, а действия подразделения подвергаются необоснованной критике.",
      },
    },
  ],
};
