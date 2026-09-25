import type { ProfessionSim } from "@/data/kasblar/types";

/**
 * G-01 «Final kechasi» — Milliy gvardiya. Public order at a football final
 * (a fictional 32 000-seat stadium) plus the stadium's guarded service
 * entrance post. Law is named only, never by article.
 * All persons, places and call signs are fictional.
 */
export const SIM_GVARDIYACHI: ProfessionSim = {
  id: "sim-gvardiya-01",
  professionId: "gvardiyachi",
  code: "G-01",
  title: {
    uz: "Final kechasi",
    ru: "Вечер финала",
    en: "Final night",
  },
  setting: {
    uz: "«Navro'z-Arena» stadioni (32 000 o'rin), kubok finali. 4-post — sharqiy tribuna va xizmat kirish darvozasi. Shanba, 17:30–23:00.",
    ru: "Стадион «Навруз-Арена» (32 000 мест), финал кубка. Пост №4 — восточная трибуна и служебные ворота. Суббота, 17:30–23:00.",
    en: "Navro'z Arena (32,000 seats), cup final. Post 4: east stand and the service gate. Saturday, 17:30–23:00.",
  },
  env: "guard_post",
  intro: {
    uz: "Siz — Milliy gvardiya kichik serjanti, 4-post katta nazoratchisisiz. Qo'l ostingizda 3 nafar gvardiyachi. Vazifa: tomoshabinlar kirishini nazorat qilish, sharqiy tribunada tartibni saqlash va xizmat darvozasini qo'riqlash. Har bir qaroringiz qonuniy, zarur va mutanosib bo'lishi kerak.",
    ru: "Вы — младший сержант Нацгвардии, старший поста №4. У вас в подчинении 3 гвардейца. Задача: контроль входа зрителей, порядок на восточной трибуне и охрана служебных ворот. Каждое решение должно быть законным, необходимым и соразмерным.",
    en: "You are a National Guard junior sergeant in charge of Post 4 with three guardsmen. Task: control spectator entry, keep order on the east stand and guard the service gate. Every decision must be lawful, necessary and proportionate.",
  },
  minutes: 20,
  stages: [
    /* 1 — briefing and post scheme ---------------------------------- */
    {
      id: "s1",
      title: {
        uz: "Yo'l-yo'riq va post sxemasi",
        ru: "Инструктаж и схема поста",
        en: "Briefing and post layout",
      },
      brief: {
        uz: "17:30, postni qabul qilyapsiz. Yo'l-yo'riq buyrug'i, post sxemasi va radio jurnalini o'qing.",
        ru: "17:30, вы принимаете пост. Изучите приказ на инструктаж, схему поста и радиожурнал.",
        en: "17:30, you are taking over the post. Read the briefing order, post layout and radio log.",
      },
      materials: [
        {
          id: "gv-m1",
          kind: "document",
          title: {
            uz: "Yo'l-yo'riq buyrug'idan ko'chirma",
            ru: "Выписка из приказа на инструктаж",
            en: "Briefing order extract",
          },
          body: {
            uz: "Darvozalar 18:00 da ochiladi, o'yin 20:00 da. Kutilayotgan tomoshabinlar — 29 500. Sharqiy tribunada mehmon jamoa muxlislari (taxminan 4 000). Taqiqlangan buyumlar: pirotexnika, shisha idish, spirtli ichimlik, tig'li narsalar, siyosiy va haqoratli bannerlar. Aloqa: «Arena-markaz» (tadbir shtabi), IIV patrul guruhi «Qalqon-2», tez yordam punkti — sharqiy tribuna ostida, 4-sektor. Kuch ishlatish — faqat qonunda belgilangan asoslar va tartibda, avval ogohlantirish bilan.",
            ru: "Ворота открываются в 18:00, игра в 20:00. Ожидается 29 500 зрителей. На восточной трибуне — болельщики гостевой команды (около 4 000). Запрещённые предметы: пиротехника, стеклянная тара, спиртное, колюще-режущие предметы, политические и оскорбительные баннеры. Связь: «Арена-центр» (штаб мероприятия), патруль ОВД «Калкон-2», пункт скорой помощи — под восточной трибуной, сектор 4. Применение силы — только по основаниям и в порядке, установленным законом, с предварительным предупреждением.",
          },
          meta: [
            { label: { uz: "Qonuniy asos", ru: "Правовая основа" }, value: "«Milliy gvardiya to'g'risida»gi Qonun" },
            { label: { uz: "Shaxsiy tarkib", ru: "Личный состав" }, value: "1 + 3" },
          ],
        },
        {
          id: "gv-m2",
          kind: "note",
          title: {
            uz: "4-post sxemasi (tavsif)",
            ru: "Схема поста №4 (описание)",
            en: "Post 4 layout (description)",
          },
          body: {
            uz: "A — tomoshabinlar kirishi: 4 ta turniket, ramkali metall detektor. B — sharqiy tribuna, 11–14-sektorlar, ikki evakuatsiya chiqishi (E-3, E-4). C — xizmat darvozasi: faqat akkreditatsiyalangan transport, ro'yxat bo'yicha. Kamera ko'rinmaydigan zona — C darvozadan 30 m janubdagi to'siq ortidagi yo'lak.",
            ru: "A — вход зрителей: 4 турникета, рамочный металлодетектор. B — восточная трибуна, сектора 11–14, два эвакуационных выхода (E-3, E-4). C — служебные ворота: только аккредитованный транспорт по списку. Слепая зона камер — проход за ограждением в 30 м к югу от ворот C.",
          },
        },
        {
          id: "gv-m3",
          kind: "message",
          title: {
            uz: "Radio jurnali",
            ru: "Радиожурнал",
            en: "Radio log",
          },
          body: {
            uz: "17:05 «Arena-markaz»: mehmon muxlislar kolonnasi (≈300 kishi) vokzaldan piyoda yo'lda, kayfiyati baland, mash'alalar ko'rilgan. 17:18 «Qalqon-2»: E-4 chiqishi oldiga yuk mashinasi qo'yilgan, haydovchi topilmadi. 17:24 «Arena-markaz»: C darvozadan kiradigan transport ro'yxati yangilandi, 2 ta mashina chiqarildi.",
            ru: "17:05 «Арена-центр»: колонна гостевых болельщиков (≈300 чел.) идёт пешком от вокзала, настроение приподнятое, замечены файеры. 17:18 «Калкон-2»: перед выходом E-4 поставлен грузовик, водитель не найден. 17:24 «Арена-центр»: обновлён список транспорта для ворот C, 2 машины исключены.",
          },
          tone: "warn",
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Darvozalar ochilishidan oldin qaysi masalani birinchi navbatda hal qilasiz?",
          ru: "Какой вопрос вы решаете в первую очередь до открытия ворот?",
          en: "Which issue do you resolve first, before the gates open?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Gvardiyachilarni turniketlarga taqsimlab, mehmon muxlislar kolonnasini kutib olish uchun tizilish tartibini tuzaman.",
              ru: "Распределяю гвардейцев по турникетам и выстраиваю порядок встречи колонны гостевых болельщиков.",
            },
            score: 1,
            feedback: {
              uz: "Kerakli ish, ammo to'silgan evakuatsiya chiqishi 32 ming kishilik tadbirda eng og'ir xavf — u birinchi hal qilinadi.",
              ru: "Нужная работа, но заблокированный эвакуационный выход на мероприятии на 32 тысячи — самый тяжёлый риск, его решают первым.",
            },
          },
          {
            id: "b",
            text: {
              uz: "E-4 chiqishini to'sgan yuk mashinasi haqida shtabga xabar berib, uni olib ketilguncha chiqishni nazoratga olaman.",
              ru: "Докладываю в штаб о грузовике, перекрывшем выход E-4, и беру выход под контроль до его эвакуации.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Evakuatsiya yo'li — hayot masalasi, tomoshabinlar kirmasidan ochilishi shart. Egasi noma'lum transport, shuningdek, xavfsizlik nuqtai nazaridan ham tekshiriladi.",
              ru: "Верно. Путь эвакуации — вопрос жизни, он должен быть свободен до входа зрителей. Транспорт без владельца к тому же проверяется с точки зрения безопасности.",
            },
          },
          {
            id: "c",
            text: {
              uz: "C darvozadagi yangilangan transport ro'yxatini qo'riqchilar bilan solishtirib chiqaman.",
              ru: "Сверяю с охраной обновлённый список транспорта на воротах C.",
            },
            score: 2,
            feedback: {
              uz: "Muhim va bugun albatta bajariladi, lekin to'silgan chiqishdan keyin. Ro'yxat 2 mashina bo'yicha o'zgargan — buni darvozadagi gvardiyachiga darhol yetkazing.",
              ru: "Важно и сегодня обязательно, но после заблокированного выхода. Список изменился на 2 машины — сразу доведите до гвардейца на воротах.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Kamera ko'rinmaydigan yo'lakka bitta gvardiyachini doimiy qo'yaman, chunki u yerdan chiptasiz kirish mumkin.",
              ru: "Ставлю одного гвардейца постоянно в слепую зону, потому что там возможен безбилетный проход.",
            },
            score: 1,
            feedback: {
              uz: "Ko'r zona e'tiborga loyiq (patrul bilan qamrab olish mumkin), lekin to'rt kishilik postdan bir kishini doimiy ajratish kirishni zaiflashtiradi va eng katta xavf hal qilinmay qoladi.",
              ru: "Слепая зона заслуживает внимания (можно закрыть патрулированием), но постоянно выделять одного из четырёх ослабит вход, а главный риск останется нерешённым.",
            },
          },
        ],
      },
      competencies: ["gvardiyachi.qoriqlash"],
      consequence: {
        uz: "To'silgan evakuatsiya chiqishi vahima yoki yong'in paytida olomon siqilishiga sabab bo'ladi — ommaviy tadbirlardagi eng og'ir fojialar aynan shunday boshlanadi.",
        ru: "Заблокированный эвакуационный выход при панике или пожаре приводит к давке — самые тяжёлые трагедии на массовых мероприятиях начинаются именно так.",
      },
    },

    /* 2 — access control ------------------------------------------- */
    {
      id: "s2",
      title: {
        uz: "Kirish nazorati",
        ru: "Контроль доступа",
        en: "Access control",
      },
      brief: {
        uz: "18:40, mehmon muxlislar kolonnasi turniketlarga yetdi. Metall detektor va vizual kuzatuvda quyidagi holatlar qayd etildi.",
        ru: "18:40, колонна гостевых болельщиков подошла к турникетам. На металлодетекторе и визуально зафиксировано следующее.",
        en: "18:40, the away fans reach the turnstiles. The detector and visual checks record the following.",
      },
      materials: [
        {
          id: "gv-m4",
          kind: "note",
          title: {
            uz: "Turniketdagi kuzatuvlar",
            ru: "Наблюдения на турникетах",
            en: "Turnstile observations",
          },
          body: {
            uz: "1) Yigit qalin kurtkada (havo +24°), ko'krak qismi bo'rtib turibdi, tekshiruvdan oldin ortga qaytib boshqa turniketga o'tdi. 2) Ayol bolasi bilan, sumkasida bolalar ovqati solingan termos. 3) Uch kishi bir-biriga chipta uzatib, bitta chipta bilan ketma-ket o'tishga urinmoqda. 4) Metall detektor kamaridagi temir to'qaga signal berdi. 5) Yigit bayroq tayoqchasini (plastik, 1 m) olib kelgan, uchiga lenta bilan nimadir o'ralgan. 6) Keksa muxlis nogironlik aravachasida, kuzatuvchi bilan.",
            ru: "1) Парень в плотной куртке (на улице +24°), грудь выпирает, перед досмотром развернулся и перешёл к другому турникету. 2) Женщина с ребёнком, в сумке термос с детским питанием. 3) Трое передают друг другу билет, пытаются пройти по одному билету по очереди. 4) Металлодетектор среагировал на металлическую пряжку ремня. 5) Парень с флагштоком (пластик, 1 м), на конце что-то обмотано лентой. 6) Пожилой болельщик на инвалидной коляске, с сопровождающим.",
          },
        },
      ],
      task: {
        kind: "multi",
        prompt: {
          uz: "Qaysi holatlar qo'shimcha tekshiruv yoki kirishni rad etishni talab qiladi? Barcha to'g'ri javoblarni belgilang.",
          ru: "Какие случаи требуют дополнительного досмотра или отказа во входе? Отметьте все верные.",
          en: "Which cases require further screening or refusal of entry? Select all that apply.",
        },
        options: [
          {
            id: "a",
            text: { uz: "1 — mavsumga mos kelmaydigan kiyim va tekshiruvdan qochish", ru: "1 — несезонная одежда и уклонение от досмотра" },
            correct: true,
            feedback: { uz: "Ikki belgi birga — yashirilgan pirotexnika yoki boshqa taqiqlangan buyum ehtimoli yuqori.", ru: "Два признака вместе — высокая вероятность спрятанной пиротехники или другого запрещённого предмета." },
          },
          {
            id: "b",
            text: { uz: "2 — bolalar ovqati solingan termos", ru: "2 — термос с детским питанием" },
            correct: false,
            feedback: { uz: "Odatiy holat; vizual tekshirish yetarli. Ortiqcha qattiqqo'llik nizo keltirib chiqaradi.", ru: "Обычная ситуация; достаточно визуальной проверки. Излишняя жёсткость провоцирует конфликт." },
          },
          {
            id: "c",
            text: { uz: "3 — bitta chipta bilan ketma-ket o'tishga urinish", ru: "3 — попытка пройти по одному билету по очереди" },
            correct: true,
            feedback: { uz: "Chiptasiz kirish — sektor sig'imi oshib ketishi va xavfsizlik hisobining buzilishi.", ru: "Безбилетный проход — переполнение сектора и срыв расчёта безопасности." },
          },
          {
            id: "d",
            text: { uz: "4 — kamar to'qasiga detektor signali", ru: "4 — сигнал детектора на пряжку ремня" },
            correct: false,
            feedback: { uz: "Signal sababi aniqlangan — qo'l detektori bilan tasdiqlab, o'tkaziladi.", ru: "Причина сигнала установлена — подтверждают ручным детектором и пропускают." },
          },
          {
            id: "e",
            text: { uz: "5 — uchiga nimadir o'ralgan bayroq tayoqchasi", ru: "5 — флагшток с чем-то обмотанным на конце" },
            correct: true,
            feedback: { uz: "Lentani ochib tekshirish kerak: mash'ala yoki tutun shashkasi shunday olib kiriladi; tayoqning o'zi ham zarba vositasi bo'lishi mumkin.", ru: "Нужно размотать и проверить: так проносят файеры и дымовые шашки; сам флагшток тоже может быть ударным предметом." },
          },
          {
            id: "f",
            text: { uz: "6 — aravachadagi keksa muxlis", ru: "6 — пожилой болельщик на коляске" },
            correct: false,
            feedback: { uz: "Alohida kirish yo'lagidan hurmat bilan o'tkaziladi va maxsus sektorga kuzatib qo'yiladi.", ru: "Пропускается уважительно через отдельный проход и провожается в специальный сектор." },
          },
        ],
      },
      competencies: ["gvardiyachi.qoriqlash", "gvardiyachi.tartib"],
      consequence: {
        uz: "O'tkazib yuborilgan pirotexnika tribunada kuyish, vahima va o'yinning to'xtatilishiga olib keladi. Oddiy tomoshabinga ortiqcha qattiqqo'llik esa navbatda norozilik va siqilishni kuchaytiradi.",
        ru: "Пропущенная пиротехника на трибуне — ожоги, паника и остановка матча. А избыточная жёсткость к обычному зрителю усиливает недовольство и давку в очереди.",
      },
    },

    /* 3 — conflict / crowd ----------------------------------------- */
    {
      id: "s3",
      title: {
        uz: "Nizo va olomon",
        ru: "Конфликт и толпа",
        en: "Conflict and crowd",
      },
      brief: {
        uz: "21:15, 12-sektorda mehmon jamoa gol o'tkazib yubordi. Ikki guruh muxlislar o'rtasida so'kinish boshlandi, bir necha kishi o'rindiqlarga chiqib, qarshi tomonga plastik butilkalar otmoqda. Atrofda bolali oilalar bor.",
        ru: "21:15, в 12-м секторе гостевая команда пропустила гол. Между двумя группами болельщиков началась перебранка, несколько человек встали на сиденья и бросают пластиковые бутылки в соседей. Рядом семьи с детьми.",
        en: "21:15, sector 12. The away side concedes. Two groups start swearing, several people climb on seats and throw plastic bottles. Families with children are nearby.",
      },
      materials: [
        {
          id: "gv-m5",
          kind: "message",
          title: {
            uz: "Radio: 21:15",
            ru: "Рация: 21:15",
            en: "Radio: 21:15",
          },
          body: {
            uz: "«Arena-markaz»: 12-sektor, kamera 14 — ikki guruh to'qnashuvi oldidan. Qo'shimcha kuch 4 daqiqada yetib keladi. Styuardlar sektorga kirishga ikkilanmoqda.",
            ru: "«Арена-центр»: сектор 12, камера 14 — две группы на грани столкновения. Подкрепление будет через 4 минуты. Стюарды не решаются войти в сектор.",
          },
          tone: "warn",
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Qanday harakat qilasiz?",
          ru: "Как вы действуете?",
          en: "How do you act?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Qo'shimcha kuch kelguncha kutaman: ikki kishi bilan sektorga kirish xavfli.",
              ru: "Жду подкрепления: входить в сектор вдвоём опасно.",
            },
            score: 1,
            feedback: {
              uz: "Shaxsiy xavfsizlikni o'ylash to'g'ri, lekin 4 daqiqa passiv kutish — nizoning to'qnashuvga aylanishiga vaqt berish. Kirmasdan ham ta'sir qilish mumkin: ko'rinish, ovoz, shtab orqali tablo e'loni.",
              ru: "Думать о личной безопасности правильно, но 4 минуты пассивного ожидания — время, за которое конфликт станет столкновением. Можно влиять и не входя: присутствие, голос, объявление на табло через штаб.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Guruhlar orasiga ko'rinadigan holda turib, tashabbuskorlarga ovoz bilan murojaat qilaman; oilalarni E-3 tomonga siljitishni styuardlarga topshiraman.",
              ru: "Встаю на виду между группами, голосом обращаюсь к зачинщикам; стюардам поручаю отвести семьи к выходу E-3.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Ko'rinadigan hozirlik va aniq og'zaki buyruq — deeskalatsiyaning birinchi pog'onasi. Guruhlarni ajratish va zaif tomoshabinlarni uzoqlashtirish zarar ko'lamini kamaytiradi.",
              ru: "Верно. Видимое присутствие и чёткая устная команда — первая ступень деэскалации. Разделение групп и отвод уязвимых зрителей снижают масштаб ущерба.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Butilka otganlarni darhol ushlab, sektordan olib chiqish uchun ikki gvardiyachini olomon ichiga yuboraman, qolganlarni esa qo'rqitish uchun maxsus vositalarni ko'rsataman.",
              ru: "Посылаю двух гвардейцев в толпу, чтобы немедленно задержать и вывести бросавших бутылки, остальных пугаю демонстрацией спецсредств.",
            },
            score: 0,
            feedback: {
              uz: "Ogohlantirishsiz olomon ichiga kirib ushlash va qo'rqitish ikkala guruhni gvardiyaga qarshi birlashtiradi. Ushlash — keyinroq, kamera yozuvi va qo'shimcha kuch bilan.",
              ru: "Задержание в толпе без предупреждения и запугивание объединят обе группы против гвардии. Задержание — позже, по записи камер и с подкреплением.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Shtabdan tablo orqali tartibga chaqiruv e'lonini so'rayman va sektor chetidan kuzataman.",
              ru: "Прошу штаб дать объявление на табло с призывом к порядку и наблюдаю с края сектора.",
            },
            score: 2,
            feedback: {
              uz: "Foydali qo'shimcha, lekin yolg'iz e'lon yetarli emas: odamlar yaqin turgan xodimning so'ziga ko'proq bo'ysunadi.",
              ru: "Полезное дополнение, но одного объявления мало: люди больше подчиняются сотруднику, стоящему рядом.",
            },
          },
        ],
      },
      competencies: ["gvardiyachi.tartib", "gvardiyachi.muloqot"],
      consequence: {
        uz: "Kechikkan yoki haddan tashqari keskin javob kichik janjalni ommaviy tartibsizlikka aylantiradi: jarohatlar, o'rindiqlar buzilishi, bolali oilalar siqilishi.",
        ru: "Запоздалая или чрезмерно жёсткая реакция превращает мелкую ссору в массовые беспорядки: травмы, сломанные сиденья, давка семей с детьми.",
      },
    },

    /* 4 — proportionality of force ---------------------------------- */
    {
      id: "s4",
      title: {
        uz: "Kuch ishlatish mutanosibligi",
        ru: "Соразмерность применения силы",
        en: "Proportionality of force",
      },
      brief: {
        uz: "Ko'pchilik tinchlandi. Ammo bir muxlis (taxminan 30 yosh, mast holatda) ogohlantirishlarga qaramay qarshi tomonga tashlanmoqda, gvardiyachini itarib yubordi. Qo'lida hech narsa yo'q. Qo'shimcha kuch yetib keldi.",
        ru: "Большинство успокоилось. Но один болельщик (около 30 лет, в состоянии опьянения), несмотря на предупреждения, бросается на противоположную сторону, оттолкнул гвардейца. В руках ничего нет. Подкрепление прибыло.",
        en: "Most have calmed down. But one fan (about 30, drunk) keeps lunging at the other side despite warnings and has shoved a guardsman. He is unarmed. Backup has arrived.",
      },
      materials: [
        {
          id: "gv-m6",
          kind: "document",
          title: {
            uz: "Eslatma: kuch ishlatish tamoyillari",
            ru: "Памятка: принципы применения силы",
            en: "Memo: use-of-force principles",
          },
          body: {
            uz: "Qonuniylik — faqat qonunda nazarda tutilgan asos bilan. Zaruriyat — boshqa usullar natija bermaganda. Mutanosiblik — xavf darajasiga mos, eng kam zarar yetkazadigan vosita. Ogohlantirish — imkon bo'lganda oldindan. Kuch ishlatilgandan keyin — tibbiy yordam va rahbariyatga darhol xabar. Asos: «Milliy gvardiya to'g'risida»gi Qonun.",
            ru: "Законность — только по основанию, предусмотренному законом. Необходимость — когда другие способы не дали результата. Соразмерность — средство, соответствующее угрозе и причиняющее наименьший вред. Предупреждение — по возможности заранее. После применения силы — медицинская помощь и немедленный доклад руководству. Основание: Закон «О Национальной гвардии».",
          },
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Ushbu vaziyatda qaysi javob qonuniy va mutanosib?",
          ru: "Какой ответ в этой ситуации законен и соразмерен?",
          en: "Which response is lawful and proportionate here?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Rezina tayoq bilan oyog'iga urib, yerga yiqitaman va shu holatda ushlab turaman — sektordagilarga ham saboq bo'ladi.",
              ru: "Бью резиновой палкой по ногам, валю на землю и удерживаю — остальным в секторе тоже будет урок.",
            },
            score: 0,
            feedback: {
              uz: "Qurolsiz shaxsga zarba vositasi va «saboq» maqsadi — mutanosiblik va qonuniylikka zid. Bu xizmat vakolatini suiiste'mol qilish sifatida baholanadi.",
              ru: "Ударное средство против безоружного и цель «преподать урок» противоречат соразмерности и законности. Это квалифицируется как превышение полномочий.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Oxirgi ogohlantirishdan so'ng ikki xodim bilan qo'lni qayirish usulida nazoratga olib, tibbiy ko'rik va IIV patruliga topshiraman.",
              ru: "После последнего предупреждения вдвоём беру под контроль загибом руки, передаю на медосмотр и патрулю ОВД.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Og'zaki choralar tugagan, xodimga qarshi harakat bor — minimal zarur jismoniy kuch, ikki xodim bilan, ogohlantirishdan keyin. Tibbiy ko'rik va topshirish tartibi saqlangan.",
              ru: "Верно. Устные меры исчерпаны, есть действия против сотрудника — минимально необходимая физическая сила, вдвоём, после предупреждения. Порядок медосмотра и передачи соблюдён.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Xizmat qurolini g'ilofdan chiqarib ko'rsataman va to'xtamasa qo'llashimni baland ovozda aytaman — shunda sektordagi boshqalar ham darhol tinchlanadi.",
              ru: "Достаю табельное оружие из кобуры и громко говорю, что применю его, если не остановится, — тогда и остальные в секторе сразу успокоятся.",
            },
            score: 0,
            feedback: {
              uz: "O'qotar qurol bilan tahdid qilish — qurolsiz mast shaxsga nisbatan mutlaqo nomutanosib va olomonda halokatli vahima keltirib chiqarishi mumkin. O'qotar qurol hech qachon birinchi variant emas.",
              ru: "Угроза огнестрельным оружием безоружному пьяному — абсолютно несоразмерна и может вызвать гибельную панику в толпе. Огнестрельное оружие никогда не бывает первым вариантом.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Uni o'z holiga qo'yaman, faqat atrofini gvardiyachilar bilan o'rab turaman.",
              ru: "Оставляю его в покое, только окружаю гвардейцами.",
            },
            score: 1,
            feedback: {
              uz: "Kuch ishlatmaslik niyati yaxshi, lekin xodimga hujum qilgan va nizoni davom ettirayotgan shaxs sektorda qolsa, to'qnashuv qayta boshlanadi.",
              ru: "Намерение не применять силу хорошее, но если человек, напавший на сотрудника и продолжающий конфликт, останется в секторе, столкновение возобновится.",
            },
          },
        ],
      },
      competencies: ["gvardiyachi.kuch"],
      consequence: {
        uz: "Nomutanosib kuch — xodim uchun jinoiy javobgarlik xavfi, bo'linma uchun esa jamoatchilik ishonchining yo'qolishi. Kuch ishlatmaslik esa hujumni rag'batlantiradi va xodimlarni himoyasiz qoldiradi.",
        ru: "Несоразмерная сила — риск уголовной ответственности для сотрудника и потеря общественного доверия для подразделения. Бездействие же поощряет нападение и оставляет сотрудников без защиты.",
      },
    },

    /* 5 — interagency cooperation ---------------------------------- */
    {
      id: "s5",
      title: {
        uz: "O'zaro hamkorlik",
        ru: "Взаимодействие",
        en: "Interagency cooperation",
      },
      brief: {
        uz: "Ushlangan muxlisning qoshi yorilgan (yiqilganda), qon ketmoqda; itarilgan gvardiyachi tirsagini urgan. Endi to'g'ri tartibda xabar berish va topshirish kerak.",
        ru: "У задержанного болельщика рассечена бровь (при падении), идёт кровь; оттолкнутый гвардеец ушиб локоть. Теперь нужно в правильном порядке доложить и передать.",
        en: "The detained fan has a cut eyebrow from falling and is bleeding; the shoved guardsman has bruised his elbow. Now report and hand over in the right order.",
      },
      materials: [],
      task: {
        kind: "order",
        prompt: {
          uz: "Harakatlarni to'g'ri ketma-ketlikda joylashtiring.",
          ru: "Расположите действия в правильной последовательности.",
          en: "Put the actions in the correct order.",
        },
        items: [
          { id: "police", text: { uz: "Ushlangan shaxsni IIV patruli «Qalqon-2»ga topshirish, guvohlar va kamera raqamini ko'rsatish", ru: "Передать задержанного патрулю ОВД «Калкон-2», указать свидетелей и номер камеры", en: "Hand the detainee to police patrol Qalqon-2 with witnesses and camera number" } },
          { id: "medic", text: { uz: "Tez yordam punktiga (4-sektor) jabrlanganlarni ko'rsatish, birinchi yordam", ru: "Показать пострадавших в пункте скорой помощи (сектор 4), первая помощь", en: "Take the injured to the first-aid point (sector 4)" } },
          { id: "report", text: { uz: "Smena oxirida kuch ishlatish to'g'risida yozma raport", ru: "В конце смены — письменный рапорт о применении силы", en: "Written use-of-force report at the end of shift" } },
          { id: "duty", text: { uz: "«Arena-markaz»ga radio orqali qisqa doklad: kim, qayerda, qanday kuch ishlatildi, jarohatlar", ru: "Краткий доклад «Арена-центру» по рации: кто, где, какая сила применена, травмы", en: "Brief radio report to Arena Control: who, where, force used, injuries" } },
          { id: "post", text: { uz: "Postga qaytib, sektordagi kuchlar joylashuvini tiklash", ru: "Вернуться на пост и восстановить расстановку сил в секторе", en: "Return to post and restore the sector deployment" } },
        ],
        correct: ["medic", "duty", "police", "post", "report"],
      },
      competencies: ["gvardiyachi.hamkorlik"],
      consequence: {
        uz: "Jarohatlangan ushlanganga tibbiy yordam kechiksa yoki shtab xabarsiz qolsa, keyingi tekshiruvda gvardiya xatti-harakati noqonuniy deb baholanishi mumkin; patrulga hujjatsiz topshirish esa ma'muriy ishni barbod qiladi.",
        ru: "Если помощь задержанному с травмой задержится или штаб не будет в курсе, при проверке действия гвардии могут признать незаконными; передача патрулю без данных сорвёт административное производство.",
      },
    },

    /* 6 — report ---------------------------------------------------- */
    {
      id: "s6",
      title: {
        uz: "Hisobot",
        ru: "Рапорт",
        en: "Report",
      },
      brief: {
        uz: "23:00, tadbir tugadi. Kuch ishlatish holati bo'yicha raport yozing.",
        ru: "23:00, мероприятие завершено. Напишите рапорт о применении силы.",
        en: "23:00, the event is over. Write the use-of-force report.",
      },
      materials: [
        {
          id: "gv-m7",
          kind: "note",
          title: {
            uz: "Smena qaydlari",
            ru: "Записи смены",
            en: "Shift notes",
          },
          body: {
            uz: "21:15 — 12-sektorda nizo; 21:17 — og'zaki ogohlantirish, oilalar E-3 tomonga siljitildi; 21:19 — qo'shimcha kuch keldi; 21:21 — muxlis gvardiyachi oddiy askar S. Nurmatovni itarib yubordi; 21:22 — oxirgi ogohlantirishdan keyin jismoniy kuch (qo'lni qayirish), ikki xodim; yiqilganda muxlisning qoshi yorildi; 21:27 — tez yordam punkti; 21:31 — «Arena-markaz»ga doklad; 21:40 — «Qalqon-2»ga topshirildi. Kamera 14.",
            ru: "21:15 — конфликт в секторе 12; 21:17 — устное предупреждение, семьи отведены к E-3; 21:19 — прибыло подкрепление; 21:21 — болельщик оттолкнул гвардейца рядового С. Нурматова; 21:22 — после последнего предупреждения физическая сила (загиб руки), двое сотрудников; при падении у болельщика рассечена бровь; 21:27 — пункт скорой помощи; 21:31 — доклад «Арена-центру»; 21:40 — передан «Калкон-2». Камера 14.",
          },
        },
      ],
      task: {
        kind: "text",
        prompt: {
          uz: "Kuch ishlatish to'g'risida raport yozing: faktlar, asos, ogohlantirish, qo'llangan usul, oqibatlar, keyingi harakatlar.",
          ru: "Напишите рапорт о применении силы: факты, основание, предупреждение, применённый приём, последствия, дальнейшие действия.",
          en: "Write the use-of-force report: facts, grounds, warning, technique, consequences, follow-up.",
        },
        rubric: [
          { uz: "Vaqt, joy (sektor, kamera), ishtirokchilar va xatti-harakat aniq ko'rsatilgan", ru: "Точно указаны время, место (сектор, камера), участники и поведение" },
          { uz: "Kuch ishlatish asosi va zaruriyati (og'zaki choralar samarasiz, xodimga hujum) hamda oldindan ogohlantirish qayd etilgan", ru: "Отражены основание и необходимость силы (устные меры безрезультатны, нападение на сотрудника) и предварительное предупреждение" },
          { uz: "Qo'llangan usul aniq nomlangan, jarohatlar va ko'rsatilgan tibbiy yordam yashirilmagan", ru: "Применённый приём назван точно, травмы и оказанная медпомощь не скрыты" },
          { uz: "Shtabga doklad va IIV patruliga topshirish vaqti bilan ko'rsatilgan; baholovchi iboralar yo'q", ru: "Доклад в штаб и передача патрулю ОВД указаны со временем; нет оценочных выражений" },
        ],
        minWords: 50,
        model: {
          uz: "Raport. 21:15 da «Navro'z-Arena» sharqiy tribunasi 12-sektorida (kamera 14) ikki guruh muxlislar o'rtasida nizo boshlandi. 21:17 da og'zaki talab qo'yildi, bolali oilalar styuardlar yordamida E-3 chiqishi tomonga siljitildi. 21:21 da taxminan 30 yoshli, mast holatdagi erkak takroriy talablarga bo'ysunmay, oddiy askar S. Nurmatovni itarib yubordi. 21:22 da oxirgi ogohlantirishdan so'ng men va oddiy askar Nurmatov tomonidan jismoniy kuch — qo'lni qayirish usuli qo'llanildi. Nazoratga olish chog'ida fuqaro yiqilib, qoshi yorildi. 21:27 da tez yordam punktida birinchi yordam ko'rsatildi; Nurmatov tirsagi lat yegan. 21:31 da «Arena-markaz»ga doklad berildi. 21:40 da fuqaro IIV patruli «Qalqon-2»ga topshirildi, guvohlar va kamera 14 yozuvi haqida ma'lumot berildi. Maxsus vositalar va qurol qo'llanilmadi.",
          ru: "Рапорт. В 21:15 в секторе 12 восточной трибуны «Навруз-Арены» (камера 14) начался конфликт между двумя группами болельщиков. В 21:17 предъявлено устное требование, семьи с детьми при помощи стюардов отведены к выходу E-3. В 21:21 мужчина около 30 лет в состоянии опьянения, не подчиняясь повторным требованиям, оттолкнул рядового С. Нурматова. В 21:22 после последнего предупреждения мной и рядовым Нурматовым применена физическая сила — загиб руки. При задержании гражданин упал, рассечена бровь. В 21:27 в пункте скорой помощи оказана первая помощь; у Нурматова ушиб локтя. В 21:31 доложено «Арена-центру». В 21:40 гражданин передан патрулю ОВД «Калкон-2», сообщены сведения о свидетелях и записи камеры 14. Спецсредства и оружие не применялись.",
        },
      },
      competencies: ["gvardiyachi.kuch", "gvardiyachi.muloqot"],
      consequence: {
        uz: "Noaniq yoki jarohatni yashirgan raport keyinchalik shikoyat yoki tekshiruvda xodimning o'ziga qarshi dalilga aylanadi. Aniq raport esa qonuniy harakat qilgan xodimning eng yaxshi himoyasidir.",
        ru: "Расплывчатый или скрывающий травму рапорт при жалобе или проверке обернётся против самого сотрудника. Точный рапорт — лучшая защита сотрудника, действовавшего законно.",
      },
    },
  ],
};
