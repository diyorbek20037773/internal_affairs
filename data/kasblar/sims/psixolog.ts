import type { ProfessionSim } from "@/data/kasblar/types";

/**
 * PS-01 «Otishmadan keyingi hafta» — departmental psychologist.
 * A patrol officer, six days after using his weapon and seeing his partner
 * wounded, is referred by the commander. Plus one routine professional-
 * selection interview in the same working day.
 * All persons and units are fictional. Screening scores are illustrative
 * training values, not a validated instrument.
 */
export const SIM_PSIXOLOG: ProfessionSim = {
  id: "sim-psixolog-01",
  professionId: "psixolog",
  code: "PS-01",
  title: {
    uz: "Otishmadan keyingi hafta",
    ru: "Неделя после перестрелки",
    en: "The week after the shooting",
  },
  setting: {
    uz: "Viloyat IIB psixologik ta'minot bo'limi, suhbat xonasi. Seshanba, 09:00.",
    ru: "Отдел психологического обеспечения УВД области, кабинет для бесед. Вторник, 09:00.",
    en: "Regional police psychological support unit, counselling room. Tuesday, 09:00.",
  },
  env: "counseling",
  intro: {
    uz: "Siz — bo'lim psixologisiz. Olti kun oldin patrul xodimi kichik serjant D. Rahimov tungi chaqiruvda xizmat qurolini qo'llagan, sherigi yaralangan. Bugun komandir uni sizga yo'llagan. Holatni baholang, suhbat quring, inqirozli yordam bering, xavf belgilarini o'tkazib yubormang va xulosa yozing. Kun o'rtasida navbatdagi nomzod bilan kasbiy saralash suhbati ham bor.",
    ru: "Вы — психолог отдела. Шесть дней назад младший сержант патрульной службы Д. Рахимов на ночном вызове применил табельное оружие, его напарник был ранен. Сегодня командир направил его к вам. Оцените состояние, выстройте беседу, окажите кризисную помощь, не пропустите признаки риска и напишите заключение. В середине дня — плановая беседа профотбора с кандидатом.",
    en: "You are the unit psychologist. Six days ago patrol Junior Sergeant D. Rahimov used his service weapon on a night call and his partner was wounded. Today the commander has referred him to you. Assess, build the conversation, provide crisis support, do not miss risk signs and write the conclusion. Mid-day there is also a routine selection interview.",
  },
  minutes: 25,
  stages: [
    /* 1 — referral and status card ----------------------------------- */
    {
      id: "s1",
      title: {
        uz: "Murojaat va holat kartasi",
        ru: "Направление и карта состояния",
        en: "Referral and status card",
      },
      brief: {
        uz: "Stolingizda komandirning yo'llanmasi, xizmat tavsifnomasidan ko'chirma va navbatchi qismning kuzatuv qaydlari. Xodim koridorda kutmoqda.",
        ru: "На столе направление командира, выписка из служебной характеристики и записи наблюдения дежурной части. Сотрудник ждёт в коридоре.",
        en: "On your desk: the commander's referral, a service record extract and duty-unit observation notes. The officer is waiting in the corridor.",
      },
      materials: [
        {
          id: "ps-m1",
          kind: "document",
          title: {
            uz: "Komandir yo'llanmasi",
            ru: "Направление командира",
            en: "Commander's referral",
          },
          body: {
            uz: "Patrul-post xizmati 2-vzvod komandiri kapitan A. Yo'ldoshev: «Kichik serjant D. Rahimov 14-sentabr kuni 02:40 da qurolli hujum paytida xizmat qurolini qo'llagan. Sherigi serjant B. Qosimov yelkasidan yaralangan, kasalxonada. Rahimov hodisadan keyin ikki smena ishladi, ammo kechikishlar, asabiylik kuzatilmoqda. Psixologik baholash va tavsiya so'rayman.»",
            ru: "Командир 2-го взвода ППС капитан А. Юлдашев: «Младший сержант Д. Рахимов 14 сентября в 02:40 при вооружённом нападении применил табельное оружие. Напарник сержант Б. Касымов ранен в плечо, в больнице. После происшествия Рахимов отработал две смены, но отмечаются опоздания, раздражительность. Прошу провести психологическую оценку и дать рекомендации.»",
          },
          meta: [
            { label: { uz: "Sana", ru: "Дата" }, value: "20.09" },
            { label: { uz: "Hodisadan o'tgan vaqt", ru: "Прошло после события" }, value: "6 kun" },
            { label: { uz: "Qurol", ru: "Оружие" }, value: "Topshirilmagan / не сдано" },
          ],
        },
        {
          id: "ps-m2",
          kind: "document",
          title: {
            uz: "Xizmat tavsifnomasidan ko'chirma",
            ru: "Выписка из служебной характеристики",
            en: "Service record extract",
          },
          body: {
            uz: "D. Rahimov, 26 yosh, xizmat staji 4 yil. Intizomiy jazolari yo'q, ikki marta rag'batlantirilgan. Uylangan, bir farzandi bor. Oldingi yillik psixologik ko'rikda og'ish qayd etilmagan. Hamkasblar orasida xushmuomala, tashabbuskor deb tavsiflanadi.",
            ru: "Д. Рахимов, 26 лет, стаж службы 4 года. Дисциплинарных взысканий нет, дважды поощрялся. Женат, один ребёнок. На прошлом ежегодном психологическом обследовании отклонений не выявлено. Среди коллег характеризуется как общительный, инициативный.",
          },
        },
        {
          id: "ps-m3",
          kind: "note",
          title: {
            uz: "Navbatchi qism kuzatuv qaydlari",
            ru: "Записи наблюдения дежурной части",
            en: "Duty-unit observation notes",
          },
          body: {
            uz: "16.09 — smenaga 25 daqiqa kechikdi, «uxlay olmadim» dedi. 18.09 — radio orqali chaqiruvga javob berishda ikkilandi; sherigi bilan keskin gaplashdi. 19.09 — ovqatlanish xonasida baland ovozdan (stul yiqilishi) keskin cho'chib tushdi, keyin uzoq jim o'tirdi. Hamkasbiga: «Agar o'shanda bir soniya oldin otganimda, Botir yaralanmasdi» degan.",
            ru: "16.09 — опоздал на смену на 25 минут, сказал «не мог уснуть». 18.09 — медлил с ответом на вызов по рации; резко разговаривал с напарником. 19.09 — в столовой резко вздрогнул от громкого звука (упал стул), затем долго сидел молча. Коллеге: «Если бы я выстрелил на секунду раньше, Ботир не был бы ранен».",
          },
          tone: "warn",
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Suhbatni boshlashdan oldin birinchi navbatda nima qilasiz?",
          ru: "Что вы сделаете в первую очередь, до начала беседы?",
          en: "What do you do first, before the conversation starts?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Komandir bilan bog'lanib, baholash tugaguncha xizmat qurolini vaqtincha saqlashga topshirishni kelishaman, so'ng suhbatni boshlayman.",
              ru: "Связываюсь с командиром, согласую временную сдачу оружия на хранение до окончания оценки, затем начинаю беседу.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Uyqusizlik, o'zini ayblash va asabiylik fonida qurolga kirish — asosiy xavf omili. Bu jazo emas, standart ehtiyot chorasi; xodimga ham shunday tushuntiriladi.",
              ru: "Верно. Доступ к оружию на фоне бессонницы, самообвинения и раздражительности — главный фактор риска. Это не наказание, а стандартная мера предосторожности; так и объясняется сотруднику.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Xodimni darhol qabul qilaman: u allaqachon kutmoqda, hujjatlarni suhbatdan keyin o'qib chiqaman.",
              ru: "Сразу принимаю сотрудника: он уже ждёт, документы прочитаю после беседы.",
            },
            score: 1,
            feedback: {
              uz: "Xodimni kuttirmaslik yaxshi, lekin materiallarni o'qimasdan suhbat mazmunsiz bo'ladi va qurol masalasi e'tibordan chetda qoladi.",
              ru: "Не заставлять ждать — хорошо, но без изучения материалов беседа будет пустой, а вопрос оружия останется без внимания.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Komandirdan xodimni xizmatdan to'liq chetlatish to'g'risida buyruq chiqarishni so'rayman, chunki qaydlarning o'zi yetarli; suhbatni buyruqdan keyin o'tkazaman.",
              ru: "Прошу командира издать приказ о полном отстранении сотрудника от службы, так как записей достаточно; беседу провожу уже после приказа.",
            },
            score: 0,
            feedback: {
              uz: "Baholashdan oldin chetlatishni talab qilish — xulosani oldindan chiqarish. Bu stigma hosil qiladi va xodimni ochiq suhbatdan qaytaradi.",
              ru: "Требовать отстранения до оценки — значит предрешать вывод. Это стигматизирует и отталкивает сотрудника от открытого разговора.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Avval kasalxonadagi sherigi Qosimovga qo'ng'iroq qilib, o'sha kechadagi voqealar va Rahimovning xatti-harakati haqidagi uning versiyasini aniqlayman.",
              ru: "Сначала звоню напарнику Касымову в больницу и выясняю его версию событий той ночи и поведения Рахимова.",
            },
            score: 1,
            feedback: {
              uz: "Yaralangan hamkasbdan ma'lumot yig'ish — psixolog vazifasi emas va xizmat tekshiruvi bilan aralashadi. Sizning ishingiz — xodimning holati.",
              ru: "Сбор сведений у раненого коллеги — не задача психолога и смешивается со служебной проверкой. Ваша задача — состояние сотрудника.",
            },
          },
        ],
      },
      competencies: ["psixolog.baholash"],
      consequence: {
        uz: "Kuchli stress fonida xodim qo'lida qurol qolsa, o'ziga yoki boshqalarga zarar yetkazish xavfi keskin oshadi. Bunday holatlar xizmat tekshiruvida birinchi navbatda psixologdan so'raladi.",
        ru: "Если на фоне сильного стресса у сотрудника остаётся оружие, резко растёт риск причинения вреда себе или другим. При служебной проверке первым спрашивают психолога.",
      },
    },

    /* 2 — assessment -------------------------------------------------- */
    {
      id: "s2",
      title: {
        uz: "Psixologik holatni baholash",
        ru: "Оценка психологического состояния",
        en: "Assessing the state",
      },
      brief: {
        uz: "Suhbat boshida xodim qisqa skrining so'rovnomasini to'ldirdi. Natijalar va sizning kuzatuvlaringiz quyida.",
        ru: "В начале беседы сотрудник заполнил короткий скрининговый опросник. Результаты и ваши наблюдения — ниже.",
        en: "At the start the officer completed a short screening form. Results and your observations are below.",
      },
      materials: [
        {
          id: "ps-m4",
          kind: "table",
          title: {
            uz: "Skrining natijalari (o'quv, illustrativ ko'rsatkichlar)",
            ru: "Результаты скрининга (учебные, иллюстративные значения)",
            en: "Screening results (training, illustrative values)",
          },
          body: {
            uz: "Diqqat: bu jadval o'quv maqsadida tuzilgan, standartlashtirilgan metodika emas. Ball — 0 (yo'q) dan 4 (juda kuchli) gacha.",
            ru: "Внимание: таблица составлена в учебных целях, это не стандартизированная методика. Балл — от 0 (нет) до 4 (очень сильно).",
          },
          table: {
            head: ["Shkala / Шкала", "Ball", "O'quv chegarasi / Учебный порог"],
            rows: [
              ["Qayta yashash (xotiralar, tushlar)", 4, "≥3"],
              ["Qochish (joy, mavzudan)", 3, "≥3"],
              ["Hushyorlik, cho'chish", 4, "≥3"],
              ["Uyqu buzilishi", 4, "≥3"],
              ["O'zini ayblash", 3, "≥3"],
              ["Ishtaha", 1, "≥3"],
              ["Ijtimoiy qo'llab-quvvatlash (teskari)", 1, "≥3"],
            ],
          },
        },
        {
          id: "ps-m5",
          kind: "note",
          title: {
            uz: "Suhbatdagi kuzatuv",
            ru: "Наблюдение в беседе",
            en: "Observation during the interview",
          },
          body: {
            uz: "Eshik yonidagi stulni tanladi, eshikka qarab o'tiradi. Qo'llari tirnoqlarini ezg'ilaydi. Hodisa haqida so'ralganda qisqa javob beradi, mavzuni o'zgartirishga urinadi. «Kechalari o'sha ovoz qulog'imda» dedi. Rafiqasi qo'llab-quvvatlayotganini aytdi. Spirtli ichimlik iste'molini rad etadi. Vaqt va joyni to'g'ri biladi, fikrlari izchil.",
            ru: "Выбрал стул у двери, сидит лицом к двери. Теребит ногти. На вопросы о происшествии отвечает коротко, пытается сменить тему. Сказал: «По ночам этот звук у меня в ушах». Говорит, что жена поддерживает. Употребление алкоголя отрицает. Ориентирован во времени и месте, мышление последовательное.",
          },
        },
      ],
      task: {
        kind: "multi",
        prompt: {
          uz: "Qaysi belgilar o'tkir stress reaksiyasini ko'rsatadi (shunchaki normal charchoq emas)? Barcha to'g'ri javoblarni belgilang.",
          ru: "Какие признаки указывают на острую стрессовую реакцию (а не на обычную усталость)? Отметьте все верные.",
          en: "Which signs point to an acute stress reaction rather than ordinary fatigue? Select all that apply.",
        },
        options: [
          {
            id: "a",
            text: { uz: "Hodisa xotiralari va tovushning qayta-qayta «qaytishi»", ru: "Навязчивое «возвращение» воспоминаний и звука" },
            correct: true,
            feedback: { uz: "Qayta yashash — travmatik stressning asosiy belgisi.", ru: "Повторное переживание — ключевой признак травматического стресса." },
          },
          {
            id: "b",
            text: { uz: "Kichik tovushdan keskin cho'chish, eshikka qarab o'tirish", ru: "Резкое вздрагивание от звука, сидит лицом к двери" },
            correct: true,
            feedback: { uz: "Giperhushyorlik — xavfni doimo kutish holati.", ru: "Гипербдительность — постоянное ожидание угрозы." },
          },
          {
            id: "c",
            text: { uz: "Hodisa mavzusidan qochish, qisqa javoblar", ru: "Избегание темы события, короткие ответы" },
            correct: true,
            feedback: { uz: "Qochish reaksiyasi — o'tkir stressning uchinchi guruh belgisi.", ru: "Избегание — третья группа признаков острого стресса." },
          },
          {
            id: "d",
            text: { uz: "«Bir soniya oldin otganimda...» — o'zini ayblash", ru: "«Если бы я выстрелил на секунду раньше…» — самообвинение" },
            correct: true,
            feedback: { uz: "Aybdorlik hissi keyingi xavfni baholashda alohida e'tibor talab qiladi.", ru: "Чувство вины требует отдельного внимания при дальнейшей оценке риска." },
          },
          {
            id: "e",
            text: { uz: "Vaqt va joyni to'g'ri bilishi, izchil fikrlash", ru: "Ориентирован во времени и месте, мышление последовательное" },
            correct: false,
            feedback: { uz: "Bu — saqlangan resurs, patologiya belgisi emas. Aksincha, yaxshi prognoz omili.", ru: "Это сохранный ресурс, а не признак патологии. Напротив, фактор хорошего прогноза." },
          },
          {
            id: "f",
            text: { uz: "Rafiqasining qo'llab-quvvatlashi", ru: "Поддержка жены" },
            correct: false,
            feedback: { uz: "Ijtimoiy qo'llab-quvvatlash — himoya omili, inqirozli aralashuvda tayanch bo'ladi.", ru: "Социальная поддержка — защитный фактор, опора для кризисного вмешательства." },
          },
          {
            id: "g",
            text: { uz: "Ishtahaning deyarli o'zgarmagani", ru: "Аппетит почти не изменился" },
            correct: false,
            feedback: { uz: "Bu shkalada ball past — o'tkir reaksiya belgisi emas.", ru: "По этой шкале балл низкий — не признак острой реакции." },
          },
        ],
      },
      competencies: ["psixolog.baholash"],
      consequence: {
        uz: "Resurslarni patologiya deb, patologiyani esa «charchoq» deb baholash noto'g'ri tavsiyaga olib keladi: yoki xodim nohaq stigmalanadi, yoki yordamsiz qolib holati surunkali buzilishga aylanadi.",
        ru: "Если принять ресурсы за патологию, а патологию — за «усталость», рекомендация будет ошибочной: либо сотрудника несправедливо стигматизируют, либо без помощи состояние перейдёт в хроническое расстройство.",
      },
    },

    /* 3 — interview tactics ------------------------------------------ */
    {
      id: "s3",
      title: {
        uz: "Suhbat taktikasi",
        ru: "Тактика беседы",
        en: "Interview tactics",
      },
      brief: {
        uz: "Xodim bir oz jim turib: «Menga psixolog kerak emas. Hammasi joyida. Komandir meni ishdan chetlatmoqchi, shekilli», dedi.",
        ru: "Сотрудник после паузы: «Мне не нужен психолог. Всё нормально. Похоже, командир хочет меня отстранить».",
        en: "After a pause the officer says: “I don't need a psychologist. I'm fine. Looks like the commander wants me off the job.”",
      },
      materials: [
        {
          id: "ps-m6",
          kind: "message",
          title: {
            uz: "Xodimning so'zlari",
            ru: "Слова сотрудника",
            en: "The officer's words",
          },
          body: {
            uz: "«Menga psixolog kerak emas. Hammasi joyida. Komandir meni ishdan chetlatmoqchi, shekilli. Men o'z ishimni qildim.»",
            ru: "«Мне не нужен психолог. Всё нормально. Похоже, командир хочет меня отстранить. Я сделал свою работу.»",
          },
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Qaysi javob ishonchli aloqa o'rnatish va faol tinglashga eng mos keladi?",
          ru: "Какой ответ лучше всего устанавливает контакт и соответствует активному слушанию?",
          en: "Which reply best builds rapport and reflects active listening?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "«Bu yerga o'z xohishingiz bilan kelmadingiz, tushunaman. Bu suhbat jazo emas — shunday voqeadan keyin har kim bilan gaplashamiz. Shu kunlar qanday o'tdi?»",
              ru: "«Вы пришли не по своей воле, понимаю. Эта беседа — не наказание: после такого мы говорим с каждым. Как прошли эти дни?»",
            },
            score: 3,
            feedback: {
              uz: "Qarshilikni aks ettirish, maqsadni ochiq aytish, harakatini tan olish va ochiq savol — ishonch uchun eng yaxshi kombinatsiya.",
              ru: "Отражение сопротивления, прозрачная цель, признание его действий и открытый вопрос — лучшая комбинация для доверия.",
            },
          },
          {
            id: "b",
            text: {
              uz: "«Hammasi joyida bo'lsa, nega smenaga kechikyapsiz, radioga kech javob beryapsiz va sherigingiz bilan janjallashyapsiz? Kuzatuv qaydlarida hammasi yozilgan, yashirishning foydasi yo'q.»",
              ru: "«Если всё нормально, почему вы опаздываете на смену, поздно отвечаете по рации и ругаетесь с напарником? В записях наблюдения всё указано, скрывать бесполезно.»",
            },
            score: 0,
            feedback: {
              uz: "Dalillar bilan «fosh qilish» — so'roq uslubi. Xodim himoyaga o'tadi va keyingi ma'lumotni yashiradi.",
              ru: "«Разоблачение» фактами — стиль допроса. Сотрудник уйдёт в защиту и будет скрывать информацию.",
            },
          },
          {
            id: "c",
            text: {
              uz: "«Xavotir olmang, komandir sizni chetlatmaydi, men kafolat beraman.»",
              ru: "«Не волнуйтесь, командир вас не отстранит, я гарантирую.»",
            },
            score: 1,
            feedback: {
              uz: "Tinchlantirish niyati yaxshi, ammo bajara olmaydigan va'da berish — keyinroq ishonchni butunlay yo'qotadi.",
              ru: "Намерение успокоить хорошее, но обещание, которое вы не можете выполнить, потом полностью подорвёт доверие.",
            },
          },
          {
            id: "d",
            text: {
              uz: "«Men ham shunday holatni boshdan kechirganman. Bir-ikki haftada o'tib ketadi.»",
              ru: "«Я тоже через такое проходил. Через неделю-другую пройдёт.»",
            },
            score: 1,
            feedback: {
              uz: "O'z tajribasiga o'tish diqqatni xodimdan olib qo'yadi, «o'tib ketadi» esa holatini qadrsizlantiradi.",
              ru: "Переход на свой опыт смещает фокус с сотрудника, а «пройдёт» обесценивает его состояние.",
            },
          },
        ],
      },
      competencies: ["psixolog.suhbat"],
      consequence: {
        uz: "Birinchi daqiqalarda aloqa o'rnatilmasa, xodim rasmiy «hammasi joyida» javobi bilan chiqib ketadi. Xavf belgilari yashirin qoladi, keyingi murojaat esa faqat inqiroz yuz bergach bo'ladi.",
        ru: "Если контакт не установлен в первые минуты, сотрудник уйдёт с формальным «всё нормально». Признаки риска останутся скрытыми, а следующее обращение случится уже после кризиса.",
      },
    },

    /* 4 — crisis intervention --------------------------------------- */
    {
      id: "s4",
      title: {
        uz: "Inqirozli aralashuv",
        ru: "Кризисное вмешательство",
        en: "Crisis intervention",
      },
      brief: {
        uz: "Xodim ochila boshladi, hodisani gapirayotib nafasi tezlashdi, qo'llari titramoqda. Birinchi psixologik yordam qadamlarini to'g'ri tartibda bajaring.",
        ru: "Сотрудник начал раскрываться; рассказывая о событии, он учащённо дышит, руки дрожат. Выполните шаги первой психологической помощи в правильном порядке.",
        en: "The officer is opening up; recounting the night, his breathing quickens and his hands shake. Put the first-aid steps in the right order.",
      },
      materials: [],
      task: {
        kind: "order",
        prompt: {
          uz: "Stabilizatsiya qadamlarini to'g'ri ketma-ketlikda joylashtiring.",
          ru: "Расположите шаги стабилизации в правильной последовательности.",
          en: "Arrange the stabilisation steps in the correct sequence.",
        },
        items: [
          { id: "resources", text: { uz: "Resurslar: uyqu gigiyenasi, rafiqasi va ishonchli hamkasb bilan aloqa, stressni boshqarish usullari", ru: "Ресурсы: гигиена сна, связь с женой и надёжным коллегой, приёмы управления стрессом", en: "Resources: sleep hygiene, contact with wife and a trusted colleague, coping techniques" } },
          { id: "safety", text: { uz: "Xavfsizlik va tinchlik: suhbatni to'xtatish, nafasni sekinlashtirish, «hozir shu yerdasiz» deb yerga qaytarish", ru: "Безопасность и покой: остановить рассказ, замедлить дыхание, вернуть в «здесь и сейчас»", en: "Safety and calm: pause, slow breathing, grounding in the here and now" } },
          { id: "follow", text: { uz: "Kuzatuv: belgilangan muddatda qayta baholash va natijani hujjatlashtirish", ru: "Сопровождение: повторная оценка в установленный срок и документирование", en: "Follow-up: reassess on schedule and document" } },
          { id: "normal", text: { uz: "Normallashtirish: bu reaksiyalar g'ayrioddiy voqeaga normal javob ekanini tushuntirish", ru: "Нормализация: объяснить, что эти реакции — нормальный ответ на ненормальное событие", en: "Normalisation: explain these are normal reactions to an abnormal event" } },
          { id: "plan", text: { uz: "Aniq reja: navbatdagi uchrashuv sanasi, holat yomonlashsa kimga murojaat qilish", ru: "Конкретный план: дата следующей встречи, к кому обращаться при ухудшении", en: "Concrete plan: next appointment date and who to contact if things get worse" } },
        ],
        correct: ["safety", "normal", "resources", "plan", "follow"],
      },
      competencies: ["psixolog.inqiroz"],
      consequence: {
        uz: "Hayajon cho'qqisida hodisa tafsilotlarini so'rashda davom etish yoki «maslahat berish»ga shoshilish holatni retravmatizatsiya qiladi. Xodim yana bunday suhbatga qaytmaydi.",
        ru: "Если на пике возбуждения продолжать расспрашивать о деталях или спешить с «советами», это ретравматизирует. Сотрудник больше не придёт на такую беседу.",
      },
    },

    /* 5 — suicide risk --------------------------------------------- */
    {
      id: "s5",
      title: {
        uz: "Suitsidal xavf belgilari",
        ru: "Признаки суицидального риска",
        en: "Suicide risk signs",
      },
      brief: {
        uz: "Suhbat oxirida xodim past ovozda: «Ba'zan hammasi tugab qolsa, oilamga ham yengil bo'lardi, deb o'ylayman» dedi. Uyda ov miltig'i borligini tasodifan eslab o'tdi.",
        ru: "В конце беседы сотрудник тихо сказал: «Иногда думаю, что если бы всё закончилось, семье тоже было бы легче». Мимоходом упомянул, что дома есть охотничье ружьё.",
        en: "At the end the officer says quietly: “Sometimes I think if it all ended, it would be easier for my family too.” He mentions in passing there is a hunting rifle at home.",
      },
      materials: [
        {
          id: "ps-m7",
          kind: "note",
          title: {
            uz: "Xavf omillari (suhbatdan)",
            ru: "Факторы риска (из беседы)",
            en: "Risk factors (from the interview)",
          },
          body: {
            uz: "Yuk bo'lish haqidagi fikrlar; kuchli aybdorlik; uyqusizlik 6 kun; uyda o'qotar qurolga kirish imkoni. Himoya omillari: rafiqasi va farzandi, ilgari psixologik muammolar yo'q, yordamga qisman ochiq.",
            ru: "Мысли о том, что он обуза; сильное чувство вины; бессонница 6 дней; доступ к огнестрельному оружию дома. Защитные факторы: жена и ребёнок, ранее психологических проблем не было, частично открыт к помощи.",
          },
          tone: "warn",
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Sizning keyingi harakatingiz qanday bo'ladi?",
          ru: "Каким будет ваше следующее действие?",
          en: "What is your next action?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Fikrlar haqida ochiq so'rayman (reja, vosita, niyat), xodimni yolg'iz qoldirmay psixiatrga o'zim kuzatib boraman, qurolga kirishni cheklash choralarini ko'raman.",
              ru: "Прямо спрашиваю о мыслях (план, средство, намерение), не оставляя одного, сам сопровождаю к психиатру и принимаю меры по ограничению доступа к оружию.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Suitsid haqida to'g'ridan-to'g'ri so'rash xavfni oshirmaydi. Yolg'iz qoldirmaslik, mutaxassisga kuzatib borish va vositaga kirishni cheklash — asosiy qoidalar. Maxfiylik chegarasi hayotga xavf bo'lganda shu hajmda ochiladi.",
              ru: "Верно. Прямой вопрос о суициде не повышает риск. Не оставлять одного, сопроводить к специалисту и ограничить доступ к средствам — ключевые правила. Граница конфиденциальности при угрозе жизни раскрывается именно в этом объёме.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Bu mavzuni ochmayman, chunki so'rash fikrni kuchaytirishi mumkin. Keyingi haftaga uchrashuv belgilayman.",
              ru: "Не поднимаю эту тему, потому что расспросы могут усилить мысли. Назначаю встречу на следующую неделю.",
            },
            score: 0,
            feedback: {
              uz: "Xato va xavfli afsona. So'ramaslik va bir haftalik tanaffus — xodimni vosita bilan yolg'iz qoldirish demakdir.",
              ru: "Ошибка и опасный миф. Не спросить и отложить на неделю — значит оставить сотрудника наедине со средством.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Xodimga ishonch telefoni raqamini berib, uyiga dam olishga jo'nataman.",
              ru: "Даю сотруднику номер телефона доверия и отправляю домой отдыхать.",
            },
            score: 1,
            feedback: {
              uz: "Ishonch telefoni foydali qo'shimcha, lekin uyda qurol bor paytida xodimni yolg'iz jo'natish — asosiy chorani o'tkazib yuborish.",
              ru: "Телефон доверия — полезное дополнение, но отправить сотрудника одного домой, где есть оружие, — упустить главную меру.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Suhbatni yakunlab, uning to'liq mazmunini — fikrlar, oilaviy holat va aybdorlik hissini — komandirga va shaxsiy tarkib bo'limiga yozma xabar qilaman, qarorni ular qabul qilsin.",
              ru: "Завершаю беседу и письменно сообщаю её полное содержание — мысли, семейную ситуацию, чувство вины — командиру и в отдел кадров, пусть решают они.",
            },
            score: 1,
            feedback: {
              uz: "Komandirni xabardor qilish kerak, ammo faqat xavfsizlik uchun zarur hajmda. To'liq mazmunni oshkor qilish maxfiylikni buzadi va xodim yordamdan voz kechadi.",
              ru: "Командира информировать нужно, но только в объёме, необходимом для безопасности. Раскрытие всего содержания нарушает конфиденциальность, и сотрудник откажется от помощи.",
            },
          },
        ],
      },
      competencies: ["psixolog.inqiroz", "psixolog.profilaktika"],
      consequence: {
        uz: "Suitsidal belgilarni e'tiborsiz qoldirish yoki xodimni yolg'iz jo'natish qaytarib bo'lmaydigan oqibatga olib kelishi mumkin. Profilaktika faqat o'z vaqtida qilingan harakat bilan ishlaydi.",
        ru: "Игнорирование суицидальных признаков или отправка сотрудника одного может привести к непоправимым последствиям. Профилактика работает только при своевременных действиях.",
      },
    },

    /* 6 — routine selection interview ------------------------------- */
    {
      id: "s6",
      title: {
        uz: "Kasbiy saralash suhbati",
        ru: "Беседа профессионального отбора",
        en: "Selection interview",
      },
      brief: {
        uz: "Tushdan keyin — patrul xizmatiga nomzod J. Toshmatov (22 yosh) bilan rejali suhbat. Anketasi va test natijalari qo'lingizda.",
        ru: "После обеда — плановая беседа с кандидатом в патрульную службу Ж. Ташматовым (22 года). Анкета и результаты тестов у вас.",
        en: "After lunch: a scheduled interview with patrol-service candidate J. Toshmatov (22). His form and test results are in hand.",
      },
      materials: [
        {
          id: "ps-m8",
          kind: "application",
          title: {
            uz: "Nomzod anketasidan",
            ru: "Из анкеты кандидата",
            en: "From the candidate's form",
          },
          body: {
            uz: "Oliy ma'lumotli (sport fakulteti). Harbiy xizmatni o'tagan. Sababi: «Adolat uchun, qurol bilan ishlash yoqadi». Oldingi ish joyidan 8 oyda bo'shagan: «rahbar bilan kelisha olmadim». Test: stressga chidamlilik — o'rtachadan yuqori; impulsivlik — yuqori; yolg'on shkalasi — chegarada.",
            ru: "Высшее образование (факультет спорта). Прошёл военную службу. Мотив: «За справедливость, нравится работать с оружием». С прежнего места уволился через 8 месяцев: «не сошёлся с руководителем». Тесты: стрессоустойчивость — выше среднего; импульсивность — высокая; шкала лжи — на границе.",
          },
        },
      ],
      task: {
        kind: "multi",
        prompt: {
          uz: "Suhbatda qaysi jihatlarni albatta chuqurroq tekshirish kerak? Barcha to'g'ri javoblarni belgilang.",
          ru: "Какие аспекты обязательно нужно углублённо проверить в беседе? Отметьте все верные.",
          en: "Which aspects must be explored further in the interview? Select all that apply.",
        },
        options: [
          {
            id: "a",
            text: { uz: "Qurolga bo'lgan qiziqish motivi: vosita sifatidami yoki kuch ramzi sifatida", ru: "Мотив интереса к оружию: как к инструменту или как к символу силы" },
            correct: true,
            feedback: { uz: "Motivatsiya kuch ishlatish qarorlariga bevosita ta'sir qiladi.", ru: "Мотивация прямо влияет на решения о применении силы." },
          },
          {
            id: "b",
            text: { uz: "Yuqori impulsivlik: nizoli vaziyatdagi aniq xatti-harakat misollari", ru: "Высокая импульсивность: конкретные примеры поведения в конфликте" },
            correct: true,
            feedback: { uz: "Xulq-atvor misollari test ballidan ishonchliroq.", ru: "Поведенческие примеры надёжнее тестового балла." },
          },
          {
            id: "c",
            text: { uz: "Rahbar bilan nizo: sabablari, mas'uliyatni kimga yuklashi", ru: "Конфликт с руководителем: причины, на кого перекладывает ответственность" },
            correct: true,
            feedback: { uz: "Ierarxiyada ishlash qobiliyati xizmat uchun muhim.", ru: "Способность работать в иерархии важна для службы." },
          },
          {
            id: "d",
            text: { uz: "Yolg'on shkalasi chegarada — javoblar ijtimoiy ma'qul tomonga og'ganmi", ru: "Шкала лжи на границе — не смещены ли ответы в социально желательную сторону" },
            correct: true,
            feedback: { uz: "Bu boshqa test natijalarining ishonchliligiga ta'sir qiladi.", ru: "Это влияет на достоверность остальных результатов." },
          },
          {
            id: "e",
            text: { uz: "Nomzodning millati va oilaviy kelib chiqishi", ru: "Национальность и семейное происхождение кандидата" },
            correct: false,
            feedback: { uz: "Kasbiy yaroqlilikka aloqasi yo'q va kamsitish hisoblanadi.", ru: "Не относится к профпригодности и является дискриминацией." },
          },
          {
            id: "f",
            text: { uz: "Sport fakultetini bitirgani — jismoniy tayyorgarlik yetarli, tekshirish shart emas", ru: "Окончил факультет спорта — физподготовка достаточна, проверять не нужно" },
            correct: false,
            feedback: { uz: "Jismoniy tayyorgarlik alohida normativ bilan tekshiriladi, psixolog suhbatining predmeti emas.", ru: "Физподготовка проверяется отдельным нормативом и не является предметом беседы психолога." },
          },
        ],
      },
      competencies: ["psixolog.baholash", "psixolog.profilaktika"],
      consequence: {
        uz: "Saralashda impulsivlik va motivatsiya xavflari aniqlanmasa, qurol bilan ishlaydigan xizmatga noto'g'ri nomzod qabul qilinadi — keyinchalik asossiz kuch ishlatish holatlari profilaktikasi qiyinlashadi.",
        ru: "Если при отборе не выявлены риски импульсивности и мотивации, на службу с оружием попадает неподходящий кандидат — предупреждать необоснованное применение силы потом гораздо труднее.",
      },
    },

    /* 7 — conclusion ------------------------------------------------ */
    {
      id: "s7",
      title: {
        uz: "Tavsiya va xulosa",
        ru: "Рекомендации и заключение",
        en: "Recommendation and conclusion",
      },
      brief: {
        uz: "Komandir Rahimov bo'yicha yozma xulosa kutmoqda. U xodimning xizmatga yaroqliligi va keyingi qadamlarni bilishi kerak, lekin suhbat mazmunini emas.",
        ru: "Командир ждёт письменного заключения по Рахимову. Ему нужно знать о пригодности сотрудника к службе и дальнейших шагах, но не содержание беседы.",
        en: "The commander is waiting for a written conclusion on Rahimov. He needs fitness for duty and next steps, not the content of the conversation.",
      },
      materials: [],
      task: {
        kind: "text",
        prompt: {
          uz: "Komandir uchun qisqa psixologik xulosa va tavsiyalarni yozing. Maxfiylik chegarasini saqlang.",
          ru: "Напишите для командира краткое психологическое заключение и рекомендации. Соблюдайте границы конфиденциальности.",
          en: "Write a short psychological conclusion and recommendations for the commander. Keep within confidentiality limits.",
        },
        rubric: [
          { uz: "Holat umumiy terminlarda tavsiflangan (o'tkir stress reaksiyasi belgilari), suhbatning shaxsiy tafsilotlari oshkor qilinmagan", ru: "Состояние описано в общих терминах (признаки острой стрессовой реакции), личные детали беседы не раскрыты" },
          { uz: "Xavfsizlik choralari aniq: qurol bilan bog'liq vazifalardan vaqtincha ozod qilish, psixiatr konsultatsiyasi", ru: "Меры безопасности конкретны: временное освобождение от задач с оружием, консультация психиатра" },
          { uz: "Qo'llab-quvvatlash va kuzatuv rejasi, qayta baholash muddati ko'rsatilgan", ru: "Указан план поддержки и сопровождения, срок повторной оценки" },
          { uz: "Xulosa jazo emas, reabilitatsiya sifatida shakllantirilgan; komandirga xodimga munosabat bo'yicha tavsiya bor", ru: "Заключение сформулировано как реабилитация, а не наказание; есть рекомендация командиру по отношению к сотруднику" },
        ],
        minWords: 50,
        model: {
          uz: "Kichik serjant D. Rahimov bilan 20.09 kuni psixologik suhbat o'tkazildi. Xizmat hodisasidan keyingi o'tkir stress reaksiyasi belgilari aniqlandi: uyqu buzilishi, yuqori hushyorlik, hodisa xotiralarining takrorlanishi. Xavfsizlik nuqtai nazaridan tavsiya etiladi: qayta baholangunga qadar xodimni qurol bilan bog'liq vazifalardan vaqtincha ozod qilish, xizmat qurolini saqlashga topshirish; bugun psixiatr konsultatsiyasi tashkil qilindi. Keyingi 2 hafta davomida haftasiga ikki marta psixolog bilan uchrashuv, 04.10 da qayta baholash. Bu chora jazo emas, balki reabilitatsiya: xodimning hodisadagi harakatlari tan olinishi, jamoadan ajratilmasligi va yaralangan sherigini ko'rishga imkon berilishi tavsiya qilinadi. Suhbat mazmuni maxfiy; xulosada faqat xizmat xavfsizligi uchun zarur ma'lumot keltirildi.",
          ru: "20.09 с младшим сержантом Д. Рахимовым проведена психологическая беседа. Выявлены признаки острой стрессовой реакции после служебного происшествия: нарушение сна, повышенная настороженность, повторяющиеся воспоминания о событии. В целях безопасности рекомендуется: до повторной оценки временно освободить сотрудника от задач, связанных с оружием, табельное оружие сдать на хранение; сегодня организована консультация психиатра. В течение 2 недель — встречи с психологом дважды в неделю, повторная оценка 04.10. Мера является не наказанием, а реабилитацией: рекомендуется признать действия сотрудника при происшествии, не изолировать его от коллектива и дать возможность навестить раненого напарника. Содержание беседы конфиденциально; в заключении приведены только сведения, необходимые для безопасности службы.",
        },
      },
      competencies: ["psixolog.xulosa"],
      consequence: {
        uz: "Xulosada shaxsiy tafsilotlar oshkor qilinsa, xodimlar psixologga ishonmay qo'yadi va keyingi inqirozlarda yordam so'ramaydi. Aniq tavsiyasiz xulosa esa komandirni xavfli qaror qabul qilishga majbur qiladi.",
        ru: "Если в заключении раскрыты личные детали, сотрудники перестанут доверять психологу и не обратятся за помощью в следующем кризисе. А заключение без конкретных рекомендаций вынуждает командира принимать рискованное решение.",
      },
    },
  ],
};
