import type { ProfessionSim } from "@/data/kasblar/types";

/**
 * P-01 «Nazorat ishi» — prokuror yordamchisi o'g'irlik ishi materiallarini
 * tekshiradi. Materiallarga ataylab protsessual nuqsonlar kiritilgan:
 *  - ushlab turish bayonnomasi: tarjimonsiz, huquqlar tushuntirilgani imzosiz,
 *    ushlab turish muddati sud qarorisiz o'tib ketgan;
 *  - tintuv bayonnomasi: xolislar imzosi yo'q, olingan narsa muhrlanmagan;
 *  - guvoh so'roq bayonnomasi: sana/vaqt xronologiyaga zid;
 *  - ekspertiza tayinlash qarori: xulosa qarordan oldin sanalangan,
 *    tomonlar tanishtirilmagan.
 * Voqea joyini ko'zdan kechirish bayonnomasi va ariza — nuqsonsiz (nazorat).
 * Modda raqamlari keltirilmaydi: faqat qonun nomlari (laws.ts dan jkTheft).
 * Barcha shaxslar — to'qima.
 */
export const SIM_PROKUROR: ProfessionSim = {
  id: "sim-prokuror-01",
  professionId: "prokuror",
  code: "P-01",
  env: "prosecutor_review",
  minutes: 25,
  title: {
    uz: "Nazorat ishi: o'g'irlik ishi materiallari",
    ru: "Надзорное производство: материалы дела о краже",
    en: "Oversight review: a theft case file",
  },
  setting: {
    uz: "Tuman prokuraturasi, tergov ustidan nazorat bo'limi. 7 sentyabr, 10:00. Tuman IIB tergov bo'limidan o'g'irlik bo'yicha jinoyat ishi materiallari nazorat uchun kelib tushdi.",
    ru: "Районная прокуратура, отдел надзора за следствием. 7 сентября, 10:00. Из следственного отдела районного УВД поступили на проверку материалы уголовного дела о краже.",
    en: "District prosecutor's office, investigation oversight. 7 September, 10:00. A theft case file has arrived from the district police investigation unit for review.",
  },
  intro: {
    uz: "Ish Jinoyat kodeksining 169-moddasi (o'g'irlik) belgilari bo'yicha qo'zg'atilgan: 3 sentyabr kechqurun «Navbahor» savdo markazidagi do'kondan smartfonlar o'g'irlangan. Gumon qilinuvchi — Qirg'iziston fuqarosi Erlan Asanov, 3 sentyabr 22:40 da ushlangan va hozir ham vaqtincha saqlash joyida. Tergovchi ishni tez orada sudga yuborishni rejalashtirmoqda. Sizning vazifangiz — materiallarni qonuniylik nuqtai nazaridan tekshirish, buzilishlarni aniqlash, ularning oqibatini baholash va prokuror javob choralarini tayyorlash.",
    ru: "Дело возбуждено по признакам статьи 169 Уголовного кодекса (кража): вечером 3 сентября из магазина в ТЦ «Навбахор» похищены смартфоны. Подозреваемый — гражданин Кыргызстана Эрлан Асанов, задержан 3 сентября в 22:40 и до сих пор находится в ИВС. Следователь планирует скоро направить дело в суд. Ваша задача — проверить законность материалов, выявить нарушения, оценить их последствия и подготовить меры прокурорского реагирования.",
    en: "The case was opened under Article 169 of the Criminal Code (theft): on the evening of 3 September smartphones were stolen from a shop in the Navbahor mall. The suspect, Kyrgyz national Erlan Asanov, was detained at 22:40 on 3 September and is still in the temporary holding facility. Review the file for lawfulness, find the violations, assess their consequences and prepare the prosecutor's response.",
  },
  stages: [
    /* 1 ------------------------------------------------------------------ */
    {
      id: "p1-ustuvorlik",
      title: {
        uz: "Tekshiruvni qayerdan boshlash",
        ru: "С чего начать проверку",
        en: "Where to start",
      },
      brief: {
        uz: "Ish hajmi — 140 varaq. Soat 10:00. Tergovchi telefon qilib, «ertaga ayblov e'lon qilaman, tezroq ko'rib bering» dedi.",
        ru: "Объём дела — 140 листов. 10:00. Следователь звонит: «Завтра предъявляю обвинение, посмотрите побыстрее».",
        en: "The file runs to 140 pages. It is 10:00. The investigator calls: 'I'm charging him tomorrow, please be quick.'",
      },
      materials: [
        {
          id: "p-m-ariza",
          kind: "application",
          title: {
            uz: "Do'kon rahbarining arizasi",
            ru: "Заявление директора магазина",
            en: "Shop manager's complaint",
          },
          body: {
            uz: "03.09 kuni 20:30–21:00 oralig'ida vitrinadan 3 dona smartfon (jami 21 600 000 so'm) o'g'irlangan. Kamera yozuvi saqlangan. Ariza 03.09, 21:25 da ro'yxatga olingan.",
            ru: "03.09 в период 20:30–21:00 с витрины похищены 3 смартфона (всего 21 600 000 сумов). Запись камеры сохранена. Заявление зарегистрировано 03.09 в 21:25.",
          },
          meta: [
            { label: { uz: "Ro'yxatga olingan", ru: "Зарегистрировано" }, value: "03.09, 21:25" },
            { label: { uz: "Zarar", ru: "Ущерб" }, value: "21 600 000 so'm" },
          ],
        },
        {
          id: "p-m-korik",
          kind: "document",
          title: {
            uz: "Voqea joyini ko'zdan kechirish bayonnomasi",
            ru: "Протокол осмотра места происшествия",
            en: "Scene inspection record",
          },
          body: {
            uz: "03.09, 21:50–22:30. Ishtirokchilar: tergovchi D. Yusupov, mutaxassis, 2 nafar xolis (imzolari bor), do'kon rahbari. Vitrina qulfi buzilmagan, oynasi siljitilgan. Kamera yozuvi flesh-xotiraga ko'chirildi, muhrlandi. Bayonnoma barcha ishtirokchilar tomonidan imzolangan.",
            ru: "03.09, 21:50–22:30. Участники: следователь Д. Юсупов, специалист, 2 понятых (подписи есть), директор магазина. Замок витрины не взломан, стекло сдвинуто. Запись камеры скопирована на флеш-накопитель, опечатана. Протокол подписан всеми участниками.",
          },
        },
        {
          id: "p-m-ushlash",
          kind: "document",
          title: {
            uz: "Gumon qilinuvchini ushlab turish bayonnomasi",
            ru: "Протокол задержания подозреваемого",
            en: "Detention record",
          },
          body: {
            uz: "Ushlangan: E. Asanov, Qirg'iziston fuqarosi. Ushlangan vaqt: 03.09, 22:40. Bayonnoma o'zbek tilida tuzilgan. «Gumon qilinuvchiga huquqlari tushuntirildi» grafasi — imzo yo'q. Eslatma: «o'zbek tilini yaxshi tushunmasligini aytdi». Tarjimon: — . Himoyachi: — . Vaqtincha saqlash joyiga joylashtirilgan. Qamoqqa olish to'g'risida sud qarori ishda yo'q (07.09, 10:00 holatiga).",
            ru: "Задержан: Э. Асанов, гражданин Кыргызстана. Время задержания: 03.09, 22:40. Протокол составлен на узбекском языке. Графа «подозреваемому разъяснены права» — подписи нет. Пометка: «сказал, что плохо понимает узбекский». Переводчик: — . Защитник: — . Помещён в ИВС. Судебного решения о заключении под стражу в деле нет (на 07.09, 10:00).",
          },
          tone: "neutral",
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Tekshiruvni nimadan boshlaysiz?",
          ru: "С чего вы начинаете проверку?",
          en: "What do you check first?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Birinchi navbatda ozodligi cheklangan shaxs bilan bog'liq hujjatlarni: ushlab turish asosi, vaqti, muddati va huquqlari ta'minlanganini tekshiraman.",
              ru: "В первую очередь — документы о лице, лишённом свободы: основание, время и срок задержания, соблюдение его прав.",
              en: "First, the documents on the person deprived of liberty: grounds, time and length of detention, and whether his rights were ensured.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Ozodlikdan g'ayriqonuniy mahrum qilish har soatda davom etayotgan buzilish — uni tekshirish boshqa hamma narsadan ustun.",
              ru: "Верно. Незаконное лишение свободы — нарушение, которое длится каждый час; его проверка важнее всего остального.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Tergovchi ertaga ayblov e'lon qilmoqchi — shuning uchun avval ayblov uchun yetarli dalillar to'planganini, zarar hisobini tekshiraman.",
              ru: "Следователь завтра предъявляет обвинение — поэтому сначала проверю достаточность доказательств для обвинения и расчёт ущерба.",
              en: "The investigator charges tomorrow, so first I check whether the evidence suffices and the loss is right.",
            },
            score: 1,
            feedback: {
              uz: "Dalillar yetarliligi muhim, lekin tergovchining jadvaliga moslashish nazoratning mantiqini buzadi. Shaxs hozir ham saqlanmoqda.",
              ru: "Достаточность доказательств важна, но подстраиваться под график следователя — значит нарушать логику надзора. Человек всё ещё под стражей.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Ishni boshidan oxirigacha varaqma-varaq, tikilgan tartibda o'qib chiqaman — hech narsani o'tkazib yubormaslik uchun.",
              ru: "Читаю дело лист за листом в порядке подшивки — чтобы ничего не пропустить.",
              en: "Read the file page by page in filing order so nothing is missed.",
            },
            score: 1,
            feedback: {
              uz: "To'liq o'qish kerak, lekin 140 varaq bir necha soat oladi — shu vaqt ichida shaxs asossiz saqlanishda qolishi mumkin. Avval ustuvor savol.",
              ru: "Прочитать всё нужно, но 140 листов — это часы, и всё это время человек может незаконно оставаться под стражей. Сначала — приоритетный вопрос.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Tergovchiga telefonda xulosamni aytib, ish bo'yicha rasmiy tekshiruvni ayblov e'lon qilingandan keyin o'tkazaman.",
              ru: "Сообщаю следователю вывод по телефону, а официальную проверку провожу после предъявления обвинения.",
              en: "Give the investigator my view by phone and do the formal review after he has been charged.",
            },
            score: 0,
            feedback: {
              uz: "Nazorat og'zaki va kechiktirilgan bo'lmasligi kerak. Buzilishlar ayblov e'lon qilinishidan oldin aniqlanishi va rasmiy hujjat bilan bartaraf etilishi lozim.",
              ru: "Надзор не может быть устным и отложенным. Нарушения выявляются до предъявления обвинения и устраняются официальным актом.",
            },
          },
        ],
      },
      competencies: ["prokuror.nazorat"],
      consequence: {
        uz: "Ozodlikdan g'ayriqonuniy mahrum qilish aniqlanmasa, bu shaxs huquqlarining jiddiy buzilishi bo'lib qoladi, davlat esa zararni qoplashga majbur bo'ladi.",
        ru: "Невыявленное незаконное лишение свободы — грубое нарушение прав человека, а государство будет обязано возместить вред.",
      },
    },

    /* 2 ------------------------------------------------------------------ */
    {
      id: "p2-buzilishlar",
      title: {
        uz: "Buzilishlarni aniqlash",
        ru: "Выявление нарушений",
        en: "Finding the violations",
      },
      brief: {
        uz: "Barcha materiallar oldingizda. Har birini sana, vaqt, ishtirokchilar va imzolar bo'yicha solishtiring.",
        ru: "Все материалы перед вами. Сверьте каждый по датам, времени, участникам и подписям.",
        en: "All the documents are in front of you. Cross-check dates, times, participants and signatures.",
      },
      materials: [
        {
          id: "p-m-tintuv",
          kind: "document",
          title: {
            uz: "Tintuv bayonnomasi",
            ru: "Протокол обыска",
            en: "Search record",
          },
          body: {
            uz: "04.09, 06:30–07:15, E. Asanov ijarada yashaydigan xonadon. Sud ruxsati — ishda bor. Xolislar: A. Karimov, B. Rasulov — imzo o'rinlari bo'sh. Topildi: 2 dona smartfon (IMEI ko'rsatilgan). Qadoqlash: «polietilen paketga solindi» — muhr va yorliq haqida qayd yo'q.",
            ru: "04.09, 06:30–07:15, квартира, которую арендует Э. Асанов. Санкция суда — в деле есть. Понятые: А. Каримов, Б. Расулов — места для подписей пустые. Обнаружено: 2 смартфона (IMEI указаны). Упаковка: «помещены в полиэтиленовый пакет» — отметки о печати и бирке нет.",
          },
        },
        {
          id: "p-m-guvoh",
          kind: "document",
          title: {
            uz: "Guvoh so'roq bayonnomasi",
            ru: "Протокол допроса свидетеля",
            en: "Witness interview record",
          },
          body: {
            uz: "Guvoh: savdo markazi qo'riqchisi M. Tursunov. Sana va vaqt: 03.09, 20:15–20:50. Ko'rsatma: «...keyinchalik ushlangan Asanovni tanidim, uning uyidan topilgan telefonlar do'kondagilarning xuddi o'zi...». Guvoh imzosi bor.",
            ru: "Свидетель: охранник ТЦ М. Турсунов. Дата и время: 03.09, 20:15–20:50. Показания: «...узнал впоследствии задержанного Асанова, телефоны, найденные у него дома, — те же, что были в магазине...». Подпись свидетеля есть.",
          },
        },
        {
          id: "p-m-ekspertiza",
          kind: "document",
          title: {
            uz: "Tovarshunoslik ekspertizasini tayinlash to'g'risida qaror",
            ru: "Постановление о назначении товароведческой экспертизы",
            en: "Order appointing a valuation examination",
          },
          body: {
            uz: "Qaror sanasi: 05.09. Ekspert xulosasi sanasi: 04.09. «Gumon qilinuvchi va himoyachi qaror bilan tanishtirildi» grafasi — bo'sh, imzolar yo'q.",
            ru: "Дата постановления: 05.09. Дата заключения эксперта: 04.09. Графа «подозреваемый и защитник ознакомлены с постановлением» — пустая, подписей нет.",
          },
        },
      ],
      task: {
        kind: "multi",
        prompt: {
          uz: "Qaysi hujjatlarda protsessual buzilishlar bor? Barcha to'g'rilarini belgilang.",
          ru: "В каких документах есть процессуальные нарушения? Отметьте все верные.",
          en: "Which documents contain procedural violations? Select all that apply.",
        },
        options: [
          {
            id: "ariza",
            text: { uz: "Do'kon rahbarining arizasi", ru: "Заявление директора магазина", en: "Shop manager's complaint" },
            correct: false,
            feedback: {
              uz: "Ariza o'z vaqtida ro'yxatga olingan, nuqson yo'q.",
              ru: "Заявление своевременно зарегистрировано, нарушений нет.",
            },
          },
          {
            id: "korik",
            text: { uz: "Voqea joyini ko'zdan kechirish bayonnomasi", ru: "Протокол осмотра места происшествия", en: "Scene inspection record" },
            correct: false,
            feedback: {
              uz: "Ishtirokchilar, imzolar, qadoqlash — hammasi joyida. Barcha hujjatlarni «shubhali» deb belgilash tekshiruvchining ishonchliligini pasaytiradi.",
              ru: "Участники, подписи, упаковка — всё в порядке. Отмечать всё подряд как «сомнительное» подрывает доверие к проверяющему.",
            },
          },
          {
            id: "ushlash",
            text: { uz: "Ushlab turish bayonnomasi", ru: "Протокол задержания", en: "Detention record" },
            correct: true,
            feedback: {
              uz: "Uch xil buzilish: tarjimon ta'minlanmagan, huquqlar tushuntirilgani imzosiz, himoyachi yo'q; bundan tashqari 03.09 22:40 dan 07.09 10:00 gacha — 83 soatdan ortiq, sud qarorisiz: qonunda belgilangan 72 soatlik muddat o'tib ketgan.",
              ru: "Три нарушения: не обеспечен переводчик, разъяснение прав без подписи, нет защитника; кроме того, с 03.09 22:40 до 07.09 10:00 — более 83 часов без судебного решения: установленный законом 72-часовой срок истёк.",
            },
          },
          {
            id: "tintuv",
            text: { uz: "Tintuv bayonnomasi", ru: "Протокол обыска", en: "Search record" },
            correct: true,
            feedback: {
              uz: "Xolislar imzosi yo'q — ularning haqiqatan ishtirok etgani tasdiqlanmagan; olingan telefonlar muhrlanmagan — almashtirilmaganini isbotlab bo'lmaydi.",
              ru: "Нет подписей понятых — их фактическое участие не подтверждено; изъятые телефоны не опечатаны — нельзя доказать отсутствие подмены.",
            },
          },
          {
            id: "guvoh",
            text: { uz: "Guvoh so'roq bayonnomasi", ru: "Протокол допроса свидетеля", en: "Witness interview record" },
            correct: true,
            feedback: {
              uz: "03.09 20:15 da o'tkazilgan so'roqda guvoh 22:40 dagi ushlash va 04.09 dagi tintuv natijasi haqida gapiradi. Bayonnoma keyinroq to'ldirilgan yoki sanasi soxtalashtirilgan.",
              ru: "На допросе 03.09 в 20:15 свидетель говорит о задержании в 22:40 и результатах обыска 04.09. Протокол заполнен позже или дата фальсифицирована.",
            },
          },
          {
            id: "ekspertiza",
            text: { uz: "Ekspertiza tayinlash qarori", ru: "Постановление о назначении экспертизы", en: "Expert examination order" },
            correct: true,
            feedback: {
              uz: "Xulosa qarordan bir kun oldin sanalangan — ekspertiza asossiz boshlangan; gumon qilinuvchi va himoyachi qaror bilan tanishtirilmagan — ularning savol berish va rad etish huquqi buzilgan.",
              ru: "Заключение датировано днём раньше постановления — экспертиза начата без основания; подозреваемый и защитник не ознакомлены — нарушено их право ставить вопросы и заявлять отвод.",
            },
          },
        ],
      },
      competencies: ["prokuror.nazorat", "prokuror.protsessual"],
      consequence: {
        uz: "Aniqlanmagan nuqson sudda himoya tomoni tomonidan ko'tariladi: dalillar maqbul emas deb topiladi, ish qayta tergovga qaytariladi yoki oqlov hukmi chiqadi.",
        ru: "Невыявленный дефект поднимет защита в суде: доказательства признают недопустимыми, дело вернут на доследование или вынесут оправдательный приговор.",
      },
    },

    /* 3 ------------------------------------------------------------------ */
    {
      id: "p3-oqibat",
      title: {
        uz: "Buzilish va uning oqibati",
        ru: "Нарушение и его последствие",
        en: "Violation and consequence",
      },
      brief: {
        uz: "Har bir buzilish ish taqdiriga turlicha ta'sir qiladi. Ularni to'g'ri oqibat bilan moslang.",
        ru: "Каждое нарушение по-разному влияет на судьбу дела. Сопоставьте их с правильным последствием.",
        en: "Each violation affects the case differently. Match each with its correct consequence.",
      },
      materials: [
        {
          id: "p-m-eslatma",
          kind: "note",
          title: {
            uz: "Nazorat bo'yicha eslatma",
            ru: "Памятка по надзору",
            en: "Oversight note",
          },
          body: {
            uz: "Qonunni buzgan holda olingan dalillar yuridik kuchga ega emas (O'zbekiston Respublikasi Konstitutsiyasi, Jinoyat-protsessual kodeksi). Himoyaga bo'lgan huquq va ona tilidan foydalanish huquqi — protsessning ajralmas kafolatlari. Prokuror nazorati «Prokuratura to'g'risida»gi Qonun asosida amalga oshiriladi.",
            ru: "Доказательства, полученные с нарушением закона, не имеют юридической силы (Конституция Республики Узбекистан, Уголовно-процессуальный кодекс). Право на защиту и на пользование родным языком — неотъемлемые гарантии процесса. Прокурорский надзор осуществляется на основании Закона «О прокуратуре».",
          },
        },
      ],
      task: {
        kind: "match",
        prompt: {
          uz: "Buzilishni uning oqibati bilan moslang.",
          ru: "Сопоставьте нарушение с его последствием.",
          en: "Match each violation with its consequence.",
        },
        left: [
          {
            id: "v-muddat",
            text: {
              uz: "Ushlab turish muddati sud qarorisiz o'tib ketgan",
              ru: "Срок задержания истёк без судебного решения",
              en: "Detention period expired without a court decision",
            },
          },
          {
            id: "v-tarjimon",
            text: {
              uz: "Huquqlar tarjimonsiz, himoyachisiz tushuntirilgan",
              ru: "Права разъяснены без переводчика и защитника",
              en: "Rights explained without interpreter or lawyer",
            },
          },
          {
            id: "v-xolis",
            text: {
              uz: "Tintuvda xolislar imzosi yo'q, telefonlar muhrlanmagan",
              ru: "При обыске нет подписей понятых, телефоны не опечатаны",
              en: "No attesting witnesses' signatures; phones not sealed",
            },
          },
          {
            id: "v-sana",
            text: {
              uz: "Guvoh bayonnomasi sanasi voqealar xronologiyasiga zid",
              ru: "Дата протокола свидетеля противоречит хронологии",
              en: "Witness record date contradicts the chronology",
            },
          },
          {
            id: "v-ekspert",
            text: {
              uz: "Ekspert xulosasi qarordan oldin, tomonlar tanishtirilmagan",
              ru: "Заключение раньше постановления, стороны не ознакомлены",
              en: "Expert report predates the order; parties not informed",
            },
          },
        ],
        right: [
          {
            id: "c-ozod",
            text: {
              uz: "Shaxs zudlik bilan ozod qilinishi shart",
              ru: "Лицо подлежит немедленному освобождению",
              en: "The person must be released immediately",
            },
          },
          {
            id: "c-kursatma",
            text: {
              uz: "Shu holatda olingan tushuntirishlar dalil bo'lmaydi; huquqlar tarjimon orqali qayta tushuntirilib, himoyachi ta'minlanadi",
              ru: "Полученные при этом пояснения не являются доказательством; права разъясняются заново через переводчика, обеспечивается защитник",
              en: "Statements so obtained are not evidence; rights re-explained via interpreter, lawyer provided",
            },
          },
          {
            id: "c-maqbul",
            text: {
              uz: "Olingan telefonlarning dalil sifatida maqbulligi shubha ostida — sudda chiqarib tashlanishi mumkin",
              ru: "Допустимость изъятых телефонов как доказательств под сомнением — могут быть исключены в суде",
              en: "Admissibility of the seized phones is in doubt — may be excluded at trial",
            },
          },
          {
            id: "c-tekshiruv",
            text: {
              uz: "Hujjat soxtalashtirilgani yuzasidan tekshiruv, guvoh qayta so'roq qilinadi",
              ru: "Проверка по факту возможной фальсификации, свидетель допрашивается повторно",
              en: "Inquiry into possible falsification; witness re-interviewed",
            },
          },
          {
            id: "c-takroriy",
            text: {
              uz: "Tomonlarni tanishtirib, takroriy ekspertiza tayinlash",
              ru: "Ознакомить стороны и назначить повторную экспертизу",
              en: "Inform the parties and order a repeat examination",
            },
          },
        ],
        pairs: [
          ["v-muddat", "c-ozod"],
          ["v-tarjimon", "c-kursatma"],
          ["v-xolis", "c-maqbul"],
          ["v-sana", "c-tekshiruv"],
          ["v-ekspert", "c-takroriy"],
        ],
      },
      competencies: ["prokuror.protsessual", "prokuror.huquq_himoya"],
      consequence: {
        uz: "Oqibatni noto'g'ri baholash noto'g'ri choraga olib keladi: jiddiy buzilish «texnik xato» sifatida qoldiriladi yoki tuzatiladigan nuqson uchun butun ish yo'qqa chiqariladi.",
        ru: "Неверная оценка последствий ведёт к неверной мере: грубое нарушение остаётся «технической ошибкой», либо из-за устранимого дефекта обнуляется всё дело.",
      },
    },

    /* 4 ------------------------------------------------------------------ */
    {
      id: "p4-javob",
      title: {
        uz: "Prokuror javob chorasi",
        ru: "Мера прокурорского реагирования",
        en: "Prosecutorial response",
      },
      brief: {
        uz: "Soat 11:20. Asanov 84 soatdan ortiq sud qarorisiz saqlanmoqda. Tergovchi: «Sudga iltimosnoma bugun kiritaman, ertalabgacha kuting».",
        ru: "11:20. Асанов более 84 часов под стражей без судебного решения. Следователь: «Ходатайство в суд внесу сегодня, подождите до утра».",
        en: "11:20. Asanov has been held over 84 hours without a court order. The investigator: 'I'll file with the court today, wait till morning.'",
      },
      materials: [],
      task: {
        kind: "choice",
        prompt: {
          uz: "Ushlab turish muddati o'tib ketgani bo'yicha qanday chora ko'rasiz?",
          ru: "Какую меру вы принимаете в связи с истёкшим сроком задержания?",
          en: "What do you do about the expired detention?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Shaxsni darhol ozod qilishni talab qiluvchi yozma hujjat chiqaraman va ijrosini shu kunning o'zida nazorat qilaman; aybdor mansabdor shaxslarga nisbatan choralar ko'rish uchun taqdimnoma kiritaman.",
              ru: "Выношу письменный акт с требованием немедленно освободить лицо и контролирую исполнение в тот же день; вношу представление о мерах в отношении виновных должностных лиц.",
              en: "Issue a written demand for immediate release and see it carried out the same day; file a submission seeking action against the officials responsible.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Avval buzilgan huquq tiklanadi (ozodlik), keyin sabablar va aybdorlar bo'yicha choralar. Ehtiyot chorasi zarur bo'lsa, tergovchi uni qonuniy tartibda qayta so'rashi mumkin.",
              ru: "Верно. Сначала восстанавливается нарушенное право (свобода), затем — меры по причинам и виновным. Если мера пресечения нужна, следователь вправе заново ходатайствовать в законном порядке.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Tergovchiga og'zaki eslatma beraman: iltimosnomani bugun albatta kiritsin, shaxs ertalabgacha saqlanishda qolsin, chunki u chet el fuqarosi va qochib ketishi mumkin.",
              ru: "Даю следователю устное указание обязательно внести ходатайство сегодня, лицо остаётся под стражей до утра — он иностранец и может скрыться.",
              en: "Tell the investigator verbally to file today; the man stays in custody till morning since as a foreigner he may flee.",
            },
            score: 0,
            feedback: {
              uz: "Qochish xavfi muddatni cho'zishga asos bo'lmaydi. Prokuror g'ayriqonuniy saqlashga rozilik bersa, o'zi ham buzilish ishtirokchisiga aylanadi.",
              ru: "Риск побега не основание продлевать срок. Соглашаясь на незаконное содержание, прокурор сам становится участником нарушения.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Aybdor mansabdor shaxslarni javobgarlikka tortish to'g'risida taqdimnoma kiritaman; ozod qilish masalasini esa sud hal qilishini kutaman.",
              ru: "Вношу представление о привлечении виновных должностных лиц к ответственности; вопрос освобождения пусть решит суд.",
              en: "File a submission to discipline the officials; leave the question of release to the court.",
            },
            score: 1,
            feedback: {
              uz: "Taqdimnoma kerak, lekin u buzilishni to'xtatmaydi. Qonunda belgilangan muddat o'tgach, shaxs sud qarorini kutmasdan ozod qilinadi.",
              ru: "Представление нужно, но оно не прекращает нарушение. По истечении установленного срока лицо освобождается, не дожидаясь суда.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Jinoyat ishini to'liq tugatish haqida qaror chiqaraman — ushlab turishdagi buzilish butun ishni yo'qqa chiqaradi.",
              ru: "Выношу решение о полном прекращении уголовного дела — нарушение при задержании обнуляет всё дело.",
              en: "Terminate the whole case — the detention violation voids everything.",
            },
            score: 0,
            feedback: {
              uz: "Nomutanosib chora. Ushlab turishdagi buzilish o'g'irlik faktini va boshqa qonuniy dalillarni (kamera yozuvi, ko'zdan kechirish) yo'qqa chiqarmaydi.",
              ru: "Несоразмерная мера. Нарушение при задержании не отменяет факт кражи и другие законные доказательства (видеозапись, осмотр).",
            },
          },
        ],
      },
      competencies: ["prokuror.huquq_himoya"],
      consequence: {
        uz: "Kechiktirilgan choralar ozodlikdan g'ayriqonuniy mahrum qilishni davom ettiradi: bu fuqaroning konstitutsiyaviy huquqi buzilishi va prokurorning shaxsiy javobgarligi.",
        ru: "Промедление продлевает незаконное лишение свободы: это нарушение конституционного права и личная ответственность прокурора.",
      },
    },

    /* 5 ------------------------------------------------------------------ */
    {
      id: "p5-qadamlar",
      title: {
        uz: "Keyingi qadamlar",
        ru: "Дальнейшие шаги",
        en: "Next steps",
      },
      brief: {
        uz: "Ozod qilish masalasidan tashqari, ish bo'yicha qolgan buzilishlarni bartaraf etish rejasini tuzing.",
        ru: "Помимо освобождения составьте план устранения остальных нарушений по делу.",
        en: "Beyond the release, plan how the remaining violations will be remedied.",
      },
      materials: [],
      task: {
        kind: "order",
        prompt: {
          uz: "Harakatlarni to'g'ri ketma-ketlikda joylashtiring.",
          ru: "Расположите действия в правильной последовательности.",
          en: "Put the actions in order.",
        },
        items: [
          {
            id: "s-ozod",
            text: {
              uz: "G'ayriqonuniy ushlab turishni darhol tugatish (ozod qilish)",
              ru: "Немедленно прекратить незаконное задержание (освобождение)",
              en: "End the unlawful detention immediately (release)",
            },
          },
          {
            id: "s-huquq",
            text: {
              uz: "Tarjimon va himoyachi ishtirokida gumon qilinuvchiga huquqlarini qayta tushuntirishni ta'minlash",
              ru: "Обеспечить повторное разъяснение прав подозреваемому с участием переводчика и защитника",
              en: "Ensure rights are re-explained with an interpreter and lawyer present",
            },
          },
          {
            id: "s-kursatma",
            text: {
              uz: "Tergovchiga yozma ko'rsatma: guvohni qayta so'roq qilish, takroriy ekspertiza, dalillar qadoqlanishini rasmiylashtirish",
              ru: "Письменные указания следователю: повторный допрос свидетеля, повторная экспертиза, оформление упаковки доказательств",
              en: "Written instructions to the investigator: re-interview, repeat examination, formalise evidence packaging",
            },
          },
          {
            id: "s-taqdim",
            text: {
              uz: "Aybdor mansabdor shaxslar bo'yicha taqdimnoma va bayonnoma soxtalashtirilishi yuzasidan tekshiruv",
              ru: "Представление по виновным должностным лицам и проверка по факту возможной фальсификации протокола",
              en: "Submission on responsible officials and inquiry into possible falsification",
            },
          },
          {
            id: "s-nazorat",
            text: {
              uz: "Ko'rsatmalar ijrosini muddat belgilab nazoratga olish va natijani nazorat ishiga tikish",
              ru: "Поставить исполнение указаний на контроль со сроками и приобщить результат к надзорному производству",
              en: "Put execution under timed control and file the outcome in the oversight file",
            },
          },
        ],
        correct: ["s-ozod", "s-huquq", "s-kursatma", "s-taqdim", "s-nazorat"],
      },
      competencies: ["prokuror.nazorat", "prokuror.hujjat"],
      consequence: {
        uz: "Tartibsiz choralar natijasida ish sudga nuqsonlari bilan boradi: himoya tomoni buzilishlarni birma-bir ko'rsatadi va ayblov qulaydi.",
        ru: "При бессистемных мерах дело уходит в суд с дефектами: защита по очереди вскрывает нарушения, и обвинение рушится.",
      },
    },

    /* 6 ------------------------------------------------------------------ */
    {
      id: "p6-xulosa",
      title: {
        uz: "Tekshiruv xulosasi",
        ru: "Заключение по проверке",
        en: "Review conclusion",
      },
      brief: {
        uz: "Tuman prokuroriga ish materiallarini tekshirish natijalari bo'yicha qisqa xulosa (ma'lumotnoma) tayyorlang.",
        ru: "Подготовьте прокурору района краткое заключение (справку) по результатам проверки материалов дела.",
        en: "Write a short conclusion for the district prosecutor on the results of the review.",
      },
      materials: [],
      task: {
        kind: "text",
        prompt: {
          uz: "Tekshiruv xulosasini yozing: aniqlangan buzilishlar, ularning dalillarga ta'siri, ko'rilgan va taklif etilayotgan choralar.",
          ru: "Напишите заключение: выявленные нарушения, их влияние на доказательства, принятые и предлагаемые меры.",
          en: "Write the conclusion: violations found, their effect on the evidence, measures taken and proposed.",
        },
        rubric: [
          {
            uz: "Barcha to'rtta nuqsonli hujjat va ulardagi aniq buzilishlar ko'rsatilgan; nuqsonsiz hujjatlar (ariza, ko'zdan kechirish) asossiz shubha ostiga qo'yilmagan.",
            ru: "Названы все четыре дефектных документа и конкретные нарушения; бездефектные (заявление, осмотр) не поставлены под сомнение без оснований.",
          },
          {
            uz: "Ushlab turish muddati o'tgani vaqt bilan hisoblangan va ozod qilish birinchi chora sifatida ko'rsatilgan.",
            ru: "Истечение срока задержания подсчитано по времени, освобождение названо первой мерой.",
          },
          {
            uz: "Har bir buzilishning dalillarga ta'siri to'g'ri baholangan (maqbul emas / tuzatiladigan / tekshiruv talab qiladi).",
            ru: "Верно оценено влияние каждого нарушения на доказательства (недопустимо / устранимо / требует проверки).",
          },
          {
            uz: "Choralar prokuror vakolatiga mos, rasmiy hujjat shaklida, muddatlari bilan; qonunlar faqat nomi bilan, modda raqamlari to'qilmagan.",
            ru: "Меры соответствуют полномочиям прокурора, в форме официальных актов, со сроками; законы названы по наименованию, номера статей не выдуманы.",
          },
        ],
        minWords: 60,
        model: {
          uz: "E. Asanovga nisbatan o'g'irlik bo'yicha jinoyat ishi materiallari tekshirildi. Ariza va voqea joyini ko'zdan kechirish bayonnomasi qonuniy rasmiylashtirilgan, kamera yozuvi muhrlangan. Quyidagi buzilishlar aniqlandi. 1) Ushlab turish: gumon qilinuvchi o'zbek tilini yetarli bilmasligini aytgan bo'lsa-da, tarjimon va himoyachi ta'minlanmagan, huquqlar tushuntirilgani imzo bilan tasdiqlanmagan; 03.09 22:40 dan 07.09 10:00 gacha 83 soatdan ortiq sud qarorisiz saqlangan — qonunda belgilangan 72 soatlik muddat o'tgan. 2) Tintuv: xolislar imzosi yo'q, telefonlar muhrlanmagan — ularning dalil sifatida maqbulligi shubha ostida. 3) Guvoh so'roqi 03.09 20:15 bilan sanalangan, lekin keyingi voqealarni bayon qiladi — soxtalashtirish ehtimoli. 4) Ekspert xulosasi qarordan oldin sanalangan, tomonlar tanishtirilmagan. Ko'rilgan chora: shaxsni darhol ozod qilish talab qilindi. Taklif: tarjimon va himoyachi ishtirokida huquqlarni qayta tushuntirish; tergovchiga guvohni qayta so'roq qilish va takroriy ekspertiza tayinlash haqida yozma ko'rsatma (muddati — 10 kun); aybdor xodimlar bo'yicha taqdimnoma; guvoh bayonnomasi yuzasidan tekshiruv. Ijro nazoratga olindi.",
          ru: "Проверены материалы уголовного дела о краже в отношении Э. Асанова. Заявление и протокол осмотра оформлены законно, видеозапись опечатана. Выявлены нарушения. 1) Задержание: несмотря на заявление подозреваемого о плохом знании узбекского, не обеспечены переводчик и защитник, разъяснение прав не подтверждено подписью; с 03.09 22:40 до 07.09 10:00 — более 83 часов без судебного решения, установленный законом 72-часовой срок истёк. 2) Обыск: нет подписей понятых, телефоны не опечатаны — допустимость их как доказательств под сомнением. 3) Допрос свидетеля датирован 03.09 20:15, но описывает более поздние события — возможна фальсификация. 4) Заключение эксперта датировано раньше постановления, стороны не ознакомлены. Принятая мера: потребовано немедленное освобождение. Предложения: повторно разъяснить права с участием переводчика и защитника; письменные указания следователю о повторном допросе свидетеля и назначении повторной экспертизы (срок — 10 дней); представление по виновным сотрудникам; проверка по протоколу допроса. Исполнение поставлено на контроль.",
        },
      },
      competencies: ["prokuror.xulosa", "prokuror.hujjat"],
      consequence: {
        uz: "Noaniq yoki to'liq bo'lmagan xulosa prokurorga asosli qaror qabul qilish imkonini bermaydi — buzilishlar bartaraf etilmay qoladi va ish sudda qulaydi.",
        ru: "Неточное или неполное заключение не даёт прокурору принять обоснованное решение — нарушения остаются неустранёнными, и дело разваливается в суде.",
      },
    },
  ],
};
