import type { ProfessionSim } from "@/data/kasblar/types";

/**
 * PI-01 «Tayanch punktidagi tong» — prevention inspector's morning: five
 * incoming appeals, prioritisation, one measure per case, a protection-order
 * decision, a juvenile case, an unregistered-tenant protocol and a
 * prevention-talk plan. Article numbers ONLY from data/sops/laws.ts:
 * MJTK 206¹ (mjtkOrderBreach), 223 (mjtkPassportRegime), 281 (mjtkProtocol);
 * O'RQ-561 (lawDv), VM qarori №3 (regProtectionOrder), O'RQ-371 (lawPrevention),
 * O'RQ-445 (lawAppeals). All persons and addresses are fictional.
 */
export const SIM_PROFILAKTIKA: ProfessionSim = {
  id: "sim-profilaktika-01",
  professionId: "profilaktika",
  code: "PI-01",
  title: {
    uz: "Tayanch punktidagi tong",
    ru: "Утро в опорном пункте",
    en: "Morning at the community post",
  },
  setting: {
    uz: "Shartli Oqtepa MFY, IIB tayanch punkti №7. Dushanba, 08:30. Stolda dam olish kunlari kelib tushgan beshta murojaat.",
    ru: "Условная махалля Октепа, опорный пункт ОВД №7. Понедельник, 08:30. На столе пять обращений, поступивших за выходные.",
    en: "Fictional Oqtepa neighbourhood, community police post No. 7. Monday, 08:30. Five appeals from the weekend are on the desk.",
  },
  env: "duty_desk",
  intro: {
    uz: "Siz — Oqtepa mahallasiga biriktirilgan profilaktika inspektorisiz. Murojaatlarni ustuvorlik bo'yicha tartiblang, har biriga to'g'ri chorani tanlang, himoya orderi masalasini qonun asosida hal qiling, voyaga yetmagan bilan ishlang, ro'yxatsiz yashovchilar bo'yicha hujjat rasmiylashtiring va profilaktik suhbat rejasini tuzing.",
    ru: "Вы — инспектор профилактики, закреплённый за махаллей Октепа. Расставьте обращения по приоритету, выберите для каждого верную меру, решите вопрос охранного ордера на основании закона, поработайте с несовершеннолетним, оформите документы по незарегистрированным жильцам и составьте план профилактической беседы.",
    en: "You are the prevention inspector for the Oqtepa neighbourhood. Prioritise the appeals, pick the right measure for each, decide the protection-order request lawfully, work with a juvenile, document unregistered residents and plan a prevention talk.",
  },
  minutes: 22,
  stages: [
    /* 1 — incoming appeals, prioritise ------------------------------ */
    {
      id: "s1",
      title: {
        uz: "Kelib tushgan murojaatlar",
        ru: "Поступившие обращения",
        en: "Incoming appeals",
      },
      brief: {
        uz: "Beshta murojaatni o'qing va ish tartibini belgilang. Mezon: avval hayot va sog'liqqa xavf, keyin bolalar, keyin takrorlanuvchi nizo, keyin ma'muriy huquqbuzarlik, oxirida fuqarolik-huquqiy masala.",
        ru: "Прочитайте пять обращений и определите порядок работы. Критерий: сначала угроза жизни и здоровью, затем дети, затем повторяющийся конфликт, затем административное правонарушение, в конце — гражданско-правовой вопрос.",
        en: "Read the five appeals and set the order of work: threat to life and health first, then children, then recurring conflict, then administrative offence, civil matters last.",
      },
      materials: [
        {
          id: "pi-m2",
          kind: "application",
          title: {
            uz: "Maktab direktorining xati",
            ru: "Письмо директора школы",
            en: "School principal's letter",
          },
          body: {
            uz: "«21-maktab 9-sinf o'quvchisi Toshpo'latov Sardor (15 yosh) ikki haftadan beri darslarga kelmayapti. Ota-onasi xorijda ishlaydi, 74 yoshli buvisi qaramog'ida. Sinfdoshlari uni kechqurunlari katta yoshli yigitlar bilan ko'rishgan, bir marta spirtli ichimlik bilan ko'rilgan.»",
            ru: "«Ученик 9 класса школы №21 Ташпулатов Сардор (15 лет) две недели не посещает занятия. Родители работают за рубежом, живёт у 74-летней бабушки. Одноклассники видели его вечерами со взрослыми парнями, однажды — со спиртным.»",
          },
        },
        {
          id: "pi-m3",
          kind: "application",
          title: {
            uz: "M. Hamroyevaning og'zaki murojaati",
            ru: "Устное обращение М. Хамроевой",
            en: "M. Hamroyeva's verbal appeal",
          },
          body: {
            uz: "Qaynona M. Hamroyeva (61 yosh): kelini bilan har kuni baland ovozda janjal, «meni hurmat qilmaydi». Jismoniy zo'ravonlik yo'q, tahdid yo'q. O'g'li Rossiyada. Oxirgi oyda uchinchi marta murojaat qilmoqda, «gaplashib qo'ying» deb so'raydi.",
            ru: "Свекровь М. Хамроева (61 год): ежедневные громкие ссоры с невесткой, «не уважает меня». Физического насилия и угроз нет. Сын в России. Обращается третий раз за месяц, просит «поговорить».",
          },
        },
        {
          id: "pi-m1",
          kind: "application",
          title: {
            uz: "D. Ergashevaning arizasi",
            ru: "Заявление Д. Эргашевой",
            en: "D. Ergasheva's application",
          },
          body: {
            uz: "«Men, Ergasheva Dilnoza (29 yosh), Oqtepa ko'chasi 14-uyda yashayman. Shanba kuni kechqurun erim Ergashev Jasur meni urdi, qo'limda ko'karishlar bor. „Arizangni bersang, o'ldiraman“ deb qo'rqitdi. Ikki farzandim (4 va 7 yosh) bilan onamnikiga ketdim. Erimning menga yaqinlashmasligini so'rayman, himoya orderi berishingizni iltimos qilaman.»",
            ru: "«Я, Эргашева Дильноза (29 лет), проживаю по ул. Октепа, д. 14. В субботу вечером муж Эргашев Жасур избил меня, на руке синяки. Угрожал: „Подашь заявление — убью“. С двумя детьми (4 и 7 лет) ушла к матери. Прошу, чтобы муж не приближался ко мне, прошу выдать охранный ордер.»",
          },
          meta: [
            { label: { uz: "Kelib tushgan", ru: "Поступило" }, value: "Yakshanba 10:15" },
            { label: { uz: "Oldingi murojaatlar", ru: "Прежние обращения" }, value: "Mahallaga 2 marta (og'zaki)" },
          ],
          tone: "warn",
        },
        {
          id: "pi-m4",
          kind: "application",
          title: {
            uz: "Qo'shnilarning jamoaviy arizasi",
            ru: "Коллективное заявление соседей",
            en: "Neighbours' joint complaint",
          },
          body: {
            uz: "Bahor ko'chasi 3-uy, 12-xonadon: uy egasi xonadonni ijaraga bergan, u yerda 6 nafar yigit yashaydi, kechalari shovqin. Qo'shnilar ularni doimiy ro'yxatda ham, vaqtincha ro'yxatda ham yo'q deb yozishgan. Mahalla raisi tasdiqlagan.",
            ru: "ул. Бахор, д. 3, кв. 12: хозяин сдал квартиру, там живут 6 парней, по ночам шумно. Соседи пишут, что они не имеют ни постоянной, ни временной регистрации. Председатель махалли подтвердил.",
          },
        },
        {
          id: "pi-m5",
          kind: "application",
          title: {
            uz: "A. Nazarovning arizasi",
            ru: "Заявление А. Назарова",
            en: "A. Nazarov's application",
          },
          body: {
            uz: "«Yuqori qavatdagi qo'shnim quvurini tuzatmagani uchun oshxonamga suv o'tib, shift buzildi. Zararni to'lashdan bosh tortmoqda. Uni majburlashingizni so'rayman.»",
            ru: "«Из-за неисправной трубы соседа сверху протекла вода в мою кухню, повреждён потолок. Он отказывается возмещать ущерб. Прошу вас его заставить.»",
          },
        },
      ],
      task: {
        kind: "order",
        prompt: {
          uz: "Murojaatlarni ish tartibi bo'yicha joylashtiring (birinchisi — eng shoshilinch).",
          ru: "Расположите обращения в порядке работы (первое — самое срочное).",
          en: "Order the appeals by priority (first = most urgent).",
        },
        items: [
          { id: "family", text: { uz: "Hamroyevlar — takrorlanuvchi oilaviy nizo", ru: "Хамроевы — повторяющийся семейный конфликт", en: "Hamroyev family — recurring family conflict" } },
          { id: "po", text: { uz: "D. Ergasheva — zo'ravonlik va o'ldirish tahdidi", ru: "Д. Эргашева — насилие и угроза убийством", en: "D. Ergasheva — violence and death threat" } },
          { id: "neighbor", text: { uz: "A. Nazarov — suv o'tishi bo'yicha qo'shni nizosi", ru: "А. Назаров — соседский спор о протечке", en: "A. Nazarov — neighbour dispute over a leak" } },
          { id: "minor", text: { uz: "Sardor Toshpo'latov — nazoratsiz voyaga yetmagan", ru: "Сардор Ташпулатов — безнадзорный несовершеннолетний", en: "Sardor Toshpo'latov — unsupervised minor" } },
          { id: "tenant", text: { uz: "Bahor 3-uy — ro'yxatsiz yashovchilar", ru: "Бахор, д. 3 — незарегистрированные жильцы", en: "3 Bahor St — unregistered residents" } },
        ],
        correct: ["po", "minor", "family", "tenant", "neighbor"],
      },
      competencies: ["profilaktika.tahlil"],
      consequence: {
        uz: "Zo'ravonlik va tahdid bo'yicha murojaat navbatda qolsa, keyingi hujum aynan shu kechikish vaqtida sodir bo'ladi. Oilaviy zo'ravonlikdagi og'ir oqibatlarning ko'pchiligidan oldin javobsiz qolgan murojaat bo'lgan.",
        ru: "Если обращение о насилии и угрозах ждёт в очереди, следующее нападение происходит именно в это время. Большинству тяжких последствий семейного насилия предшествовало оставшееся без ответа обращение.",
      },
    },

    /* 2 — measure per case (match) ---------------------------------- */
    {
      id: "s2",
      title: {
        uz: "Har bir holatga chora",
        ru: "Мера по каждому случаю",
        en: "A measure for each case",
      },
      brief: {
        uz: "Har bir murojaat uchun asosiy qonuniy chorani tanlang.",
        ru: "Выберите основную законную меру по каждому обращению.",
        en: "Choose the main lawful measure for each appeal.",
      },
      materials: [
        {
          id: "pi-m6",
          kind: "document",
          title: {
            uz: "Huquqiy asoslar (tayanch punkt papkasidan)",
            ru: "Правовые основания (из папки опорного пункта)",
            en: "Legal bases (from the post's folder)",
          },
          body: {
            uz: "«Xotin-qizlarni tazyiq va zo'ravonlikdan himoya qilish to'g'risida»gi Qonun (O'RQ-561) — himoya orderi asoslari. Vazirlar Mahkamasining 04.01.2020 yildagi 3-son qarori — himoya orderini berish, ijro etish va monitoring Nizomi. «Huquqbuzarliklar profilaktikasi to'g'risida»gi Qonun (O'RQ-371). MJTK 223-modda — pasport tizimi qoidalarini buzish; 281-modda — ma'muriy huquqbuzarlik to'g'risidagi bayonnoma. «Jismoniy va yuridik shaxslarning murojaatlari to'g'risida»gi Qonun (O'RQ-445).",
            ru: "Закон «О защите женщин от притеснения и насилия» (ЗРУ-561) — основания охранного ордера. Постановление Кабинета Министров №3 от 04.01.2020 — Положение о выдаче, исполнении и мониторинге охранного ордера. Закон «О профилактике правонарушений» (ЗРУ-371). КоАО ст. 223 — нарушение правил паспортной системы; ст. 281 — протокол об административном правонарушении. Закон «Об обращениях физических и юридических лиц» (ЗРУ-445).",
          },
        },
      ],
      task: {
        kind: "match",
        prompt: {
          uz: "Har bir holatni asosiy chora bilan moslang.",
          ru: "Сопоставьте каждый случай с основной мерой.",
          en: "Match each case with its main measure.",
        },
        left: [
          { id: "c1", text: { uz: "D. Ergasheva — urish va o'ldirish tahdidi", ru: "Д. Эргашева — побои и угроза убийством", en: "D. Ergasheva — beating and death threat" } },
          { id: "c2", text: { uz: "Sardor — darsga kelmaydi, nazoratsiz", ru: "Сардор — не ходит в школу, без надзора", en: "Sardor — truant, unsupervised" } },
          { id: "c3", text: { uz: "Hamroyevlar — og'zaki janjal, zo'ravonliksiz", ru: "Хамроевы — словесные ссоры без насилия", en: "Hamroyevs — verbal quarrels, no violence" } },
          { id: "c4", text: { uz: "Bahor 3-uy — 6 kishi ro'yxatsiz yashaydi", ru: "Бахор, д. 3 — 6 человек живут без регистрации", en: "3 Bahor St — 6 people living unregistered" } },
          { id: "c5", text: { uz: "A. Nazarov — suv o'tishidan moddiy zarar", ru: "А. Назаров — материальный ущерб от протечки", en: "A. Nazarov — property damage from a leak" } },
        ],
        right: [
          { id: "order", text: { uz: "Himoya orderi", ru: "Охранный ордер", en: "Protection order" } },
          { id: "notify", text: { uz: "Maktab, vasiylik va homiylik organi hamda voyaga yetmaganlar bilan ishlash komissiyasiga xabar berish, qonuniy vakil ishtirokida ish", ru: "Сообщить в школу, орган опеки и попечительства и комиссию по делам несовершеннолетних, работа с участием законного представителя", en: "Notify the school, guardianship authority and juvenile commission; work with the legal guardian present" } },
          { id: "talk", text: { uz: "Profilaktik suhbat (mahalla faollari ishtirokida)", ru: "Профилактическая беседа (с участием актива махалли)", en: "Prevention talk (with neighbourhood activists)" } },
          { id: "protocol", text: { uz: "MJTK 223-modda bo'yicha bayonnoma", ru: "Протокол по ст. 223 КоАО", en: "Protocol under Art. 223 of the Administrative Code" } },
          { id: "explain", text: { uz: "Huquqiy tushuntirish: zarar fuqarolik tartibida (sud yoki mahalla yarashuv komissiyasi) undiriladi", ru: "Правовое разъяснение: ущерб взыскивается в гражданском порядке (суд или примирительная комиссия махалли)", en: "Legal explanation: damages are a civil matter (court or neighbourhood mediation)" } },
        ],
        pairs: [
          ["c1", "order"],
          ["c2", "notify"],
          ["c3", "talk"],
          ["c4", "protocol"],
          ["c5", "explain"],
        ],
      },
      competencies: ["profilaktika.huquqiy", "profilaktika.profilaktik_ish"],
      consequence: {
        uz: "Noto'g'ri chora — yoki xavf ostidagi ayolga faqat «suhbat», yoki fuqarolik nizosiga asossiz ma'muriy bosim. Birinchisi zo'ravonlikni davom ettiradi, ikkinchisi prokuratura tekshiruvi va shikoyatga sabab bo'ladi.",
        ru: "Неверная мера — это либо только «беседа» для женщины в опасности, либо необоснованное административное давление в гражданском споре. Первое продлевает насилие, второе ведёт к прокурорской проверке и жалобе.",
      },
    },

    /* 3 — protection order decision -------------------------------- */
    {
      id: "s3",
      title: {
        uz: "Himoya orderi",
        ru: "Охранный ордер",
        en: "Protection order",
      },
      brief: {
        uz: "09:10, D. Ergasheva onasi bilan tayanch punktga keldi. Qo'lidagi ko'karishlar ko'rinib turibdi. Eri telefon qilib, «qaytib kel, bo'lmasa bolalarni olib ketaman» deb yozgan xabarini ko'rsatdi.",
        ru: "09:10, Д. Эргашева пришла с матерью в опорный пункт. Синяки на руке видны. Показала сообщение мужа: «Вернись, иначе заберу детей».",
        en: "09:10, D. Ergasheva arrives with her mother. The bruises are visible. She shows her husband's text: “Come back or I'll take the kids.”",
      },
      materials: [
        {
          id: "pi-m7",
          kind: "message",
          title: {
            uz: "Erining xabari",
            ru: "Сообщение мужа",
            en: "Husband's message",
          },
          body: {
            uz: "J. Ergashev, yakshanba 23:48: «Bugun qaytib kel. Bo'lmasa bolalarni olib ketaman, seni ham topaman. Militsiyaga borsang, bilib qo'y.»",
            ru: "Ж. Эргашев, воскресенье 23:48: «Сегодня же вернись. Иначе заберу детей, и тебя найду. Пойдёшь в милицию — пеняй на себя.»",
          },
          tone: "warn",
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Qonun asosida qanday harakat qilasiz?",
          ru: "Как вы действуете на основании закона?",
          en: "What do you do under the law?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Er-xotinni bugun tayanch punktga birga chaqirib, oilani saqlash uchun yarashtirishga harakat qilaman; ariza hozircha ro'yxatga olinmaydi.",
              ru: "Вызываю супругов сегодня вместе в опорный пункт и стараюсь примирить ради сохранения семьи; заявление пока не регистрирую.",
            },
            score: 0,
            feedback: {
              uz: "Jabrlanuvchini tazyiq o'tkazuvchi bilan yuzma-yuz qo'yish va arizani ro'yxatga olmaslik — qonun va murojaatlar tartibining buzilishi, jabrlanuvchi uchun esa qo'shimcha xavf.",
              ru: "Сводить пострадавшую с агрессором и не регистрировать заявление — нарушение закона и порядка рассмотрения обращений, а для пострадавшей — дополнительная опасность.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Arizani ro'yxatga olib, O'RQ-561 va Nizom asosida himoya orderini beraman, eriga talablarni tushuntiraman, tibbiy ko'rikka yo'llayman va monitoringni boshlayman.",
              ru: "Регистрирую заявление, на основании ЗРУ-561 и Положения выдаю охранный ордер, разъясняю мужу требования, направляю на медосмотр и начинаю мониторинг.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Zo'ravonlik va tahdid faktlari order uchun asos. Eriga order talablarini bajarmaslik MJTK 206¹-modda bo'yicha javobgarlikka sabab bo'lishini tushuntirish kerak. Tahdid xabari va ko'karishlar qayd etiladi, bolalarga tahdid haqida vasiylik organi ham xabardor qilinadi.",
              ru: "Верно. Факты насилия и угроз — основание для ордера. Мужу разъясняется, что невыполнение требований ордера влечёт ответственность по ст. 206¹ КоАО. Сообщение с угрозой и синяки фиксируются, об угрозе детям информируется и орган опеки.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Erini ertaga profilaktik suhbatga chaqirib, qat'iy ogohlantiraman va tushuntirish xati oldiraman; agar tazyiq yana takrorlansa, shundagina himoya orderi beraman.",
              ru: "Вызываю мужа завтра на профилактическую беседу, строго предупреждаю и беру объяснительную; если притеснение повторится — только тогда выдам ордер.",
            },
            score: 1,
            feedback: {
              uz: "Suhbat kerak, lekin u orderning o'rnini bosmaydi. Tahdid mavjud bo'lganda «takrorlanishini kutish» — jabrlanuvchini himoyasiz qoldirish.",
              ru: "Беседа нужна, но она не заменяет ордер. При наличии угрозы «ждать повторения» — значит оставить пострадавшую без защиты.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Arizachiga himoya orderini faqat sud berishini tushuntirib, sudga murojaat qilishni maslahat beraman, chunki oilaviy ishlar sud vakolatida.",
              ru: "Разъясняю заявительнице, что охранный ордер выдаёт только суд, и советую обратиться в суд, поскольку семейные дела в компетенции суда.",
            },
            score: 0,
            feedback: {
              uz: "Noto'g'ri. Himoya orderi ichki ishlar organi tomonidan beriladi — bu profilaktika inspektorining bevosita vazifasi. Jabrlanuvchini boshqa joyga jo'natish vaqt yo'qotish va xavfni oshirishdir.",
              ru: "Неверно. Охранный ордер выдаётся органом внутренних дел — это прямая обязанность инспектора профилактики. Отправить пострадавшую в другое место — потеря времени и рост риска.",
            },
          },
        ],
      },
      competencies: ["profilaktika.huquqiy"],
      consequence: {
        uz: "Order berilmasa yoki kechiktirilsa, tahdid ijroga aylanishi mumkin. Arizani ro'yxatga olmaslik esa inspektorning o'zini intizomiy va boshqa javobgarlikka tortishga asos bo'ladi.",
        ru: "Если ордер не выдан или выдан с задержкой, угроза может быть приведена в исполнение. А нерегистрация заявления — основание для дисциплинарной и иной ответственности самого инспектора.",
      },
    },

    /* 4 — juvenile case -------------------------------------------- */
    {
      id: "s4",
      title: {
        uz: "Voyaga yetmagan bilan ish",
        ru: "Работа с несовершеннолетним",
        en: "Working with a juvenile",
      },
      brief: {
        uz: "Tushdan keyin Sardorning uyiga bordingiz. Buvisi yig'lab: «Menga quloq solmaydi, ota-onasi pul yuboradi, xolos», dedi. Sardor uyda, qo'pol, lekin gaplashishga rozi.",
        ru: "После обеда вы пришли домой к Сардору. Бабушка плачет: «Меня не слушает, родители только деньги присылают». Сардор дома, грубит, но согласен поговорить.",
        en: "In the afternoon you visit Sardor's home. His grandmother, in tears: “He won't listen to me, his parents only send money.” Sardor is home, rude but willing to talk.",
      },
      materials: [],
      task: {
        kind: "multi",
        prompt: {
          uz: "Qaysi harakatlar to'g'ri va samarali? Barcha to'g'ri javoblarni belgilang.",
          ru: "Какие действия правильны и эффективны? Отметьте все верные.",
          en: "Which actions are correct and effective? Select all that apply.",
        },
        options: [
          {
            id: "a",
            text: { uz: "Suhbatni buvisi (qonuniy vakil vazifasini bajaruvchi) ishtirokida o'tkazish", ru: "Проводить беседу в присутствии бабушки (фактического законного представителя)" },
            correct: true,
            feedback: { uz: "Voyaga yetmagan bilan ish qonuniy vakil yoki uning o'rnini bosuvchi shaxs ishtirokida olib boriladi.", ru: "Работа с несовершеннолетним ведётся с участием законного представителя или лица, его заменяющего." },
          },
          {
            id: "b",
            text: { uz: "Ota-onasi bilan video qo'ng'iroq orqali bog'lanib, ularning majburiyatini tushuntirish", ru: "Связаться с родителями по видеосвязи и разъяснить их обязанности" },
            correct: true,
            feedback: { uz: "Ota-onalar xorijda bo'lsa ham tarbiya majburiyati ulardan soqit bo'lmaydi.", ru: "Даже находясь за рубежом, родители не освобождаются от обязанности воспитания." },
          },
          {
            id: "c",
            text: { uz: "U bilan birga bo'lgan katta yoshli yigitlarni aniqlash (spirtli ichimlikka jalb qilish ehtimoli)", ru: "Установить взрослых парней, с которыми он проводит время (возможное вовлечение в употребление спиртного)" },
            correct: true,
            feedback: { uz: "Voyaga yetmaganni jalb qiluvchi kattalar — alohida profilaktik e'tibor obyekti.", ru: "Взрослые, вовлекающие несовершеннолетнего, — отдельный объект профилактического внимания." },
          },
          {
            id: "d",
            text: { uz: "Maktab va mahalla bilan birga bo'sh vaqtini band qilish rejasini tuzish (sport, to'garak, kasb-hunar)", ru: "Вместе со школой и махаллей составить план занятости (спорт, кружок, профобучение)" },
            correct: true,
            feedback: { uz: "Bandlik — takroriy huquqbuzarlikning eng samarali profilaktikasi.", ru: "Занятость — самая эффективная профилактика повторных правонарушений." },
          },
          {
            id: "e",
            text: { uz: "Sardorni ogohlantirish uchun maktabda butun sinf oldida uning ismini aytib chiqish", ru: "Для предупреждения назвать имя Сардора перед всем классом в школе" },
            correct: false,
            feedback: { uz: "Ommaviy sharmanda qilish stigma hosil qiladi va o'smirni aynan o'sha yigitlar davrasiga itaradi.", ru: "Публичное порицание стигматизирует и толкает подростка как раз в ту компанию." },
          },
          {
            id: "f",
            text: { uz: "Buvisi qo'pollik qilgani uchun Sardorni tayanch punktga olib borib, yolg'iz o'zini so'roq qilish", ru: "Раз грубит бабушке — доставить Сардора в опорный пункт и опросить одного" },
            correct: false,
            feedback: { uz: "Asossiz olib borish va qonuniy vakilsiz so'roq — voyaga yetmaganning huquqlarini buzish.", ru: "Необоснованная доставка и опрос без законного представителя — нарушение прав несовершеннолетнего." },
          },
        ],
      },
      competencies: ["profilaktika.profilaktik_ish", "profilaktika.muloqot"],
      consequence: {
        uz: "Qo'pol yoki rasmiyatchilik bilan qilingan ish o'smirni ko'chaga va jinoiy muhitga yanada yaqinlashtiradi. Bugungi darsdan qochish ertangi jinoyat ishiga aylanishi mumkin.",
        ru: "Грубая или формальная работа ещё сильнее толкает подростка на улицу и в криминальную среду. Сегодняшний прогул может стать завтрашним уголовным делом.",
      },
    },

    /* 5 — unregistered tenants ------------------------------------- */
    {
      id: "s5",
      title: {
        uz: "Ro'yxatsiz yashovchilar",
        ru: "Незарегистрированные жильцы",
        en: "Unregistered residents",
      },
      brief: {
        uz: "Bahor 3-uy, 12-xonadon. Olti nafar yigit — boshqa viloyatdan kelgan qurilish ishchilari. Pasportlari bor, vaqtincha ro'yxatga qo'yilmagan. Uy egasi: «Ro'yxatga qo'yish ularning ishi» deydi.",
        ru: "ул. Бахор, д. 3, кв. 12. Шесть парней — строители из другой области. Паспорта есть, временная регистрация не оформлена. Хозяин: «Регистрироваться — их дело».",
        en: "3 Bahor St, flat 12. Six young men — construction workers from another region. They have passports but no temporary registration. The owner says: “Registering is their business.”",
      },
      materials: [
        {
          id: "pi-m8",
          kind: "note",
          title: {
            uz: "Joyida tekshiruv qaydi",
            ru: "Запись проверки на месте",
            en: "On-site check note",
          },
          body: {
            uz: "Pasport ma'lumotlari tekshirildi — qidiruvda bo'lganlar yo'q. Ijaraga berish shartnomasi yo'q. Ishchilar 5 haftadan beri yashamoqda. Qo'shnilar shovqindan tashqari boshqa huquqbuzarlikni ko'rsatmadi.",
            ru: "Паспортные данные проверены — в розыске нет. Договора аренды нет. Рабочие живут 5 недель. Кроме шума, соседи других нарушений не указали.",
          },
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "To'g'ri huquqiy harakatni tanlang.",
          ru: "Выберите правильное правовое действие.",
          en: "Choose the correct legal action.",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Ishchilarni zudlik bilan xonadondan chiqarib yuborib, uy egasini hovlida qo'shnilar oldida ogohlantiraman.",
              ru: "Немедленно выселяю рабочих из квартиры, а хозяина предупреждаю во дворе при соседях.",
            },
            score: 0,
            feedback: {
              uz: "Inspektorda xonadondan chiqarish vakolati yo'q; ommaviy ogohlantirish esa qadr-qimmatni kamsitadi.",
              ru: "У инспектора нет полномочий выселять; публичное предупреждение унижает достоинство.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Aybdor shaxslarga MJTK 223-modda bo'yicha bayonnoma (281-modda tartibida) tuzaman va ro'yxatga qo'yish tartibini tushuntiraman.",
              ru: "Составляю на виновных протокол по ст. 223 КоАО (в порядке ст. 281) и разъясняю порядок регистрации.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Huquqbuzarlik fakti aniqlangan, bayonnoma — qonuniy va mutanosib chora. Tushuntirish qayta buzilishning oldini oladi. Kim javobgarligini (ijarachi yoki uy egasi) faktlar bo'yicha aniqlang.",
              ru: "Верно. Факт нарушения установлен, протокол — законная и соразмерная мера. Разъяснение предупреждает повторное нарушение. Кто отвечает (жилец или хозяин), определите по фактам.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Birinchi marta bo'lgani uchun faqat og'zaki ogohlantirib, bir hafta ichida ro'yxatdan o'tib, nusxasini tayanch punktga olib kelishlarini so'rayman.",
              ru: "Раз впервые — только устно предупреждаю и прошу в течение недели зарегистрироваться и принести копию в опорный пункт.",
            },
            score: 1,
            feedback: {
              uz: "Yumshoq yondashuv, lekin 5 haftalik buzilish qayd etilmay qolsa, tayanch punkt hisobi va keyingi nazorat asossiz bo'ladi.",
              ru: "Мягкий подход, но если 5-недельное нарушение не зафиксировать, учёт опорного пункта и дальнейший контроль останутся без основания.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Ishchilarni tayanch punktga olib borib, barmoq izlarini olaman, ish beruvchisini aniqlayman va bu haqda migratsiya xizmatiga yozma xabar beraman.",
              ru: "Доставляю рабочих в опорный пункт, снимаю отпечатки пальцев, устанавливаю работодателя и письменно сообщаю в миграционную службу.",
            },
            score: 0,
            feedback: {
              uz: "Shaxsi pasport bilan aniqlangan va qidiruvda bo'lmagan fuqarolarni olib borish va daktiloskopiya qilishga asos yo'q.",
              ru: "Нет оснований доставлять и дактилоскопировать граждан, чья личность установлена по паспорту и которые не в розыске.",
            },
          },
        ],
      },
      competencies: ["profilaktika.hujjat", "profilaktika.huquqiy"],
      consequence: {
        uz: "Hujjatsiz og'zaki ogohlantirish nazoratni imkonsiz qiladi, vakolatdan tashqari harakat (chiqarib yuborish, asossiz olib borish) esa inspektorga nisbatan shikoyat va tekshiruvga olib keladi.",
        ru: "Устное предупреждение без документов делает контроль невозможным, а действия вне полномочий (выселение, необоснованная доставка) ведут к жалобе и проверке в отношении инспектора.",
      },
    },

    /* 6 — prevention talk plan ------------------------------------- */
    {
      id: "s6",
      title: {
        uz: "Profilaktik suhbat rejasi",
        ru: "План профилактической беседы",
        en: "Prevention talk plan",
      },
      brief: {
        uz: "Ertaga 10:00 da J. Ergashev himoya orderi bilan tanishtirish uchun tayanch punktga chaqirilgan. Suhbat rejasini tuzing.",
        ru: "Завтра в 10:00 Ж. Эргашев вызван в опорный пункт для ознакомления с охранным ордером. Составьте план беседы.",
        en: "Tomorrow at 10:00 J. Ergashev is summoned to be served the protection order. Plan the conversation.",
      },
      materials: [],
      task: {
        kind: "text",
        prompt: {
          uz: "J. Ergashev bilan profilaktik suhbat rejasini yozing: maqsad, tuzilish, asosiy gaplar, huquqiy tushuntirish, keyingi nazorat.",
          ru: "Напишите план профилактической беседы с Ж. Эргашевым: цель, структура, ключевые тезисы, правовое разъяснение, дальнейший контроль.",
          en: "Write the prevention-talk plan for J. Ergashev: goal, structure, key points, legal explanation, follow-up.",
        },
        rubric: [
          { uz: "Himoya orderi talablari aniq tushuntiriladi va bajarmaslik MJTK 206¹-modda bo'yicha javobgarlikka sabab bo'lishi aytiladi", ru: "Чётко разъясняются требования ордера и что их невыполнение влечёт ответственность по ст. 206¹ КоАО" },
          { uz: "Suhbat hurmatli, lekin qat'iy: jabrlanuvchini ayblash va «yarashtirish» taklifi yo'q, zo'ravonlik oqlanmaydi", ru: "Беседа уважительная, но твёрдая: без обвинения пострадавшей и предложения «примириться», насилие не оправдывается" },
          { uz: "Bolalar masalasi va o'zboshimchalik bilan ularni olib ketish mumkin emasligi tushuntiriladi", ru: "Разъясняется вопрос детей и недопустимость самовольно их забрать" },
          { uz: "Keyingi nazorat: monitoring tartibi, takroriy uchrashuv, xulq-atvorni tuzatish bo'yicha yordamga yo'naltirish, suhbat hujjatlashtiriladi", ru: "Дальнейший контроль: порядок мониторинга, повторная встреча, направление на программу коррекции поведения, беседа документируется" },
        ],
        minWords: 45,
        model: {
          uz: "Maqsad: J. Ergashevni himoya orderi bilan imzo qo'ydirib tanishtirish, takroriy zo'ravonlikning oldini olish. 1) Kirish: o'zimni tanishtiraman, suhbat maqsadini aytaman, ovozni ko'tarmayman. 2) Faktlar: ariza, ko'karishlar va yakshanba 23:48 dagi tahdid xabari qayd etilganini xotirjam bayon qilaman; rafiqasini ayblashga yo'l qo'ymayman. 3) Order talablari: jabrlanuvchiga yaqinlashmaslik, qo'ng'iroq va xabar yubormaslik, tahdid qilmaslik; ularni bajarmaslik MJTK 206¹-modda bo'yicha javobgarlikka sabab bo'lishini tushuntiraman. 4) Bolalar: ularni o'zboshimchalik bilan olib ketish mumkin emas, bolalar bilan bog'liq masalalar qonuniy tartibda — vasiylik organi yoki sud orqali hal qilinadi. 5) Yordam: g'azabni boshqarish va xulq-atvorni tuzatish bo'yicha mutaxassisga yo'naltirish taklif qilinadi. 6) Nazorat: monitoring tartibi, bir haftadan so'ng takroriy uchrashuv, suhbat ma'lumotnomasi tuziladi, jabrlanuvchi bilan aloqa davom etadi.",
          ru: "Цель: ознакомить Ж. Эргашева с охранным ордером под подпись, предупредить повторное насилие. 1) Вступление: представляюсь, называю цель беседы, не повышаю голос. 2) Факты: спокойно излагаю, что зафиксированы заявление, синяки и сообщение с угрозой в воскресенье в 23:48; не допускаю обвинения жены. 3) Требования ордера: не приближаться к пострадавшей, не звонить и не писать, не угрожать; разъясняю, что их невыполнение влечёт ответственность по ст. 206¹ КоАО. 4) Дети: самовольно забирать их нельзя, вопросы о детях решаются в законном порядке — через орган опеки или суд. 5) Помощь: предлагается направление к специалисту по управлению гневом и коррекции поведения. 6) Контроль: порядок мониторинга, повторная встреча через неделю, составляется справка о беседе, связь с пострадавшей сохраняется.",
        },
      },
      competencies: ["profilaktika.muloqot", "profilaktika.hujjat"],
      consequence: {
        uz: "Rejasiz suhbat «tushunishga» yoki «qo'rqitishga» aylanib ketadi. Tazyiq o'tkazuvchi talablarni aniq bilmasa, orderni buzadi va uni javobgarlikka tortish qiyinlashadi.",
        ru: "Беседа без плана скатывается либо в «понимание», либо в «запугивание». Если агрессор не знает требований точно, он нарушит ордер, а привлечь его к ответственности будет труднее.",
      },
    },
  ],
};
