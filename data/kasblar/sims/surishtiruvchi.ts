import type { LocalizedText, ProfessionSim } from "../types";

const L = (uz: string, ru: string, en?: string): LocalizedText => (en ? { uz, ru, en } : { uz, ru });

/**
 * S-01 — Surishtiruvchi: navbatchilik qismi, bitta smenada tushgan 5 ta murojaat.
 * Muhit: navbatchilik stoli (duty_desk). Asosiy g'oya — har qanday ariza qabul
 * qilinadi va ro'yxatga olinadi; qaror (tekshirish, yuborish, rad etish) — keyin.
 * Huquqiy havolalar: JPK 329-modda, JK 168, JK 169 (data/sops/laws.ts) va qonun nomlari.
 */
export const SIM_SURISHTIRUVCHI: ProfessionSim = {
  id: "sim-surishtiruvchi-01",
  professionId: "surishtiruvchi",
  code: "S-01",
  title: L("Navbatchilik smenasi: beshta murojaat", "Дежурная смена: пять обращений", "Duty shift: five applications"),
  setting: L(
    "Tuman IIB navbatchilik qismi, kechki smena",
    "Дежурная часть РУВД, вечерняя смена",
    "District police duty desk, evening shift"
  ),
  env: "duty_desk",
  intro: L(
    "Siz navbatchilik qismida surishtiruvchisiz. Smena boshlanishi bilan stolingizga beshta murojaat keldi: og'zaki, yozma, telefon va ijtimoiy tarmoq orqali. Har biri bo'yicha qaror qabul qiling — ro'yxatga olish, tekshirish, tegishliligi bo'yicha yuborish yoki jinoyat ishi qo'zg'atishni rad etish. Muddatlar va ustuvorlikni unutmang.",
    "Вы — дознаватель дежурной части. В начале смены на ваш стол поступили пять обращений: устных, письменных, по телефону и через соцсеть. По каждому примите решение — регистрация, проверка, направление по подследственности или отказ в возбуждении уголовного дела. Помните о сроках и приоритетах.",
    "You are the inquiry officer at the duty desk. At the start of the shift five applications reached your desk: oral, written, by phone and via social media. Decide on each — register, check, forward by jurisdiction or refuse to open a criminal case. Mind the deadlines and priorities."
  ),
  minutes: 20,
  stages: [
    /* 1 ------------------------------------------------------------ */
    {
      id: "s1-intake",
      title: L("Qarz haqidagi ariza", "Заявление о долге", "The debt complaint"),
      brief: L(
        "Birinchi bo'lib keksa fuqaro keldi: qo'shnisi qarzni qaytarmayapti. Uni qabul qilasizmi va qanday rasmiylashtirasiz?",
        "Первым пришёл пожилой гражданин: сосед не возвращает долг. Примете ли вы заявление и как оформите?",
        "An elderly man comes first: his neighbour won't repay a loan. Do you accept it and how?"
      ),
      materials: [
        {
          id: "m-a1",
          kind: "application",
          title: L("№1 — Yozma ariza: qarz qaytarilmagan", "№1 — Письменное заявление: невозврат долга"),
          body: L(
            "Men, Ergashev Tohir, 2024-yil mart oyida qo'shnim B. Yusupovga 15 000 000 so'm qarz berdim, u tilxat yozib berdi va avgustda qaytarishini aytdi. Hozir qaytarmayapti, «pulim yo'q» deyapti. Uni jazolashingizni so'rayman. Ilova: tilxat nusxasi.",
            "Я, Эргашев Тохир, в марте 2024 года одолжил соседу Б. Юсупову 15 000 000 сумов, он написал расписку и обещал вернуть в августе. Сейчас не возвращает, говорит «денег нет». Прошу наказать его. Приложение: копия расписки."
          ),
          meta: [
            { label: L("Kanal", "Канал"), value: "shaxsan / лично" },
            { label: L("Vaqt", "Время"), value: "18:05" },
          ],
        },
        {
          id: "m-a2",
          kind: "application",
          title: L("№2 — Telefon: 12 yoshli o'g'il uyga qaytmagan", "№2 — Телефон: 12-летний сын не вернулся домой"),
          body: L(
            "Ona (Saidova N.) telefon orqali: «O'g'lim Jasur maktabdan 14:00 da chiqqan, hali kelmadi. Telefoni o'chiq. Do'stlarinikida yo'q».",
            "Мать (Саидова Н.) по телефону: «Сын Жасур вышел из школы в 14:00 и до сих пор не пришёл. Телефон выключен. У друзей его нет»."
          ),
          meta: [
            { label: L("Kanal", "Канал"), value: "102" },
            { label: L("Vaqt", "Время"), value: "18:20" },
          ],
          tone: "warn",
        },
        {
          id: "m-a3",
          kind: "application",
          title: L("№3 — Og'zaki: bozorda telefon o'g'irlangan", "№3 — Устно: на рынке украли телефон"),
          body: L(
            "Fuqaro Qodirov A.: «Bozorda gavjum joyda sumkamdagi smartfonimni sezdirmay olib ketishdi. IMEI raqami qutida bor».",
            "Гражданин Кодиров А.: «На рынке в толпе незаметно вытащили смартфон из сумки. IMEI есть на коробке»."
          ),
          meta: [
            { label: L("Kanal", "Канал"), value: "shaxsan / лично" },
            { label: L("Vaqt", "Время"), value: "18:40" },
          ],
        },
        {
          id: "m-a4",
          kind: "application",
          title: L("№4 — Yozma: onlayn «kredit» uchun to'lov", "№4 — Письменно: оплата за онлайн-«кредит»"),
          body: L(
            "Fuqaro Nazarova G.: «Telegram'da «tezkor kredit» e'lonini ko'rdim. «Sug'urta to'lovi» uchun kartaga 2 400 000 so'm o'tkazdim, keyin meni bloklashdi. O'tkazma bugun 16:10 da bo'lgan». Ilova: chat skrinshotlari, karta raqami.",
            "Гражданка Назарова Г.: «Увидела в Telegram объявление о «быстром кредите». Перевела на карту 2 400 000 сумов за «страховку», после чего меня заблокировали. Перевод сегодня в 16:10». Приложение: скриншоты чата, номер карты."
          ),
          meta: [
            { label: L("Kanal", "Канал"), value: "shaxsan / лично" },
            { label: L("Vaqt", "Время"), value: "18:55" },
          ],
          tone: "warn",
        },
        {
          id: "m-a5",
          kind: "application",
          title: L("№5 — Ijtimoiy tarmoq: anonim xabar", "№5 — Соцсеть: анонимное сообщение"),
          body: L(
            "IIB rasmiy sahifasiga anonim xabar: «Mahalladagi garajlar yonida kechqurun yoshlarga qandaydir tabletkalar sotishyapti».",
            "Анонимное сообщение на официальную страницу УВД: «У гаражей в махалле по вечерам продают молодёжи какие-то таблетки»."
          ),
          meta: [
            { label: L("Kanal", "Канал"), value: "Telegram" },
            { label: L("Vaqt", "Время"), value: "19:10" },
          ],
        },
        {
          id: "m-journal",
          kind: "table",
          title: L("Navbatchilik jurnali (smena boshi)", "Журнал дежурной части (начало смены)"),
          body: L("Oldingi smenadan o'tgan tugallanmagan materiallar.", "Незавершённые материалы с предыдущей смены."),
          table: {
            head: ["№", "Sana / Дата", "Mazmun / Суть", "Holat / Статус"],
            rows: [
              ["412", "14.09", "Firibgarlik (onlayn savdo) / Мошенничество (онлайн-торговля)", "tekshiruvda / на проверке"],
              ["415", "17.09", "Velosiped o'g'irligi / Кража велосипеда", "tekshiruvda / на проверке"],
            ],
          },
        },
      ],
      task: {
        kind: "choice",
        prompt: L("№1 ariza bo'yicha to'g'ri harakat qaysi?", "Какое действие по заявлению №1 правильное?"),
        options: [
          {
            id: "a",
            text: L("Arizani qabul qilmaslik: «bu sudning ishi, sudga boring»", "Не принимать: «это дело суда, идите в суд»"),
            score: 0,
            feedback: L(
              "Arizani qabul qilishdan bosh tortish mumkin emas. Har qanday ariza qabul qilinadi va ro'yxatga olinadi; tegishli emasligi tekshiruvdan keyin aniqlanadi.",
              "Отказ в приёме недопустим. Любое заявление принимается и регистрируется; неподведомственность устанавливается после проверки."
            ),
          },
          {
            id: "b",
            text: L(
              "Arizani qabul qilib, jurnalda ro'yxatga olish, fuqaroga talon berish, tekshiruv o'tkazish; jinoyat alomatlari bo'lmasa — jinoyat ishini qo'zg'atishni rad etish va fuqarolik tartibida sudga murojaat qilish huquqini tushuntirish",
              "Принять, зарегистрировать в журнале, выдать талон, провести проверку; при отсутствии признаков преступления — отказать в возбуждении уголовного дела и разъяснить право на обращение в суд в гражданском порядке"
            ),
            score: 3,
            feedback: L(
              "To'g'ri. Ro'yxatga olish — majburiy (JPK 329-modda). Tilxat bilan qarz — odatda fuqarolik-huquqiy munosabat, lekin aldov niyati bor-yo'qligi tekshiruvda aniqlanadi.",
              "Верно. Регистрация обязательна (ст. 329 УПК). Долг по расписке — обычно гражданско-правовое отношение, но наличие умысла на обман выясняется при проверке."
            ),
          },
          {
            id: "c",
            text: L("Og'zaki maslahat berib, arizani ro'yxatga olmasdan qaytarib berish", "Дать устную консультацию и вернуть заявление без регистрации"),
            score: 0,
            feedback: L(
              "Ro'yxatga olinmagan ariza — «yashirilgan» murojaat. Bu jiddiy intizomiy qoidabuzarlik.",
              "Незарегистрированное заявление — «укрытое» обращение. Это серьёзное дисциплинарное нарушение."
            ),
          },
          {
            id: "d",
            text: L("Firibgarlik sifatida ro'yxatga olib, qo'shnini zudlik bilan gumon qilinuvchi sifatida ushlash", "Зарегистрировать как мошенничество и немедленно задержать соседа как подозреваемого"),
            score: 1,
            feedback: L(
              "Ro'yxatga olish to'g'ri, ammo kvalifikatsiya va ushlash — tekshiruvsiz asossiz. Qarzni qaytarmaslik o'z-o'zidan firibgarlik emas.",
              "Регистрация верна, но квалификация и задержание без проверки необоснованны. Невозврат долга сам по себе не мошенничество."
            ),
          },
        ],
      },
      competencies: ["surishtiruvchi.qabul", "surishtiruvchi.protsessual"],
      consequence: L(
        "Ro'yxatga olinmagan yoki rad etilgan ariza fuqaroning prokuraturaga shikoyatiga, xizmat tekshiruviga va IIBga bo'lgan ishonchning yo'qolishiga olib keladi.",
        "Незарегистрированное или отклонённое заявление ведёт к жалобе в прокуратуру, служебной проверке и потере доверия к ОВД."
      ),
    },

    /* 2 ------------------------------------------------------------ */
    {
      id: "s2-missing",
      title: L("Bola uyga qaytmagan", "Ребёнок не вернулся домой", "A missing child"),
      brief: L(
        "№2 murojaat — voyaga yetmagan bola 4 soatdan beri bedarak. Birinchi harakatingiz?",
        "Обращение №2 — несовершеннолетний пропал 4 часа назад. Ваше первое действие?",
        "Application No. 2 — a minor has been missing for 4 hours. Your first action?"
      ),
      materials: [],
      task: {
        kind: "choice",
        prompt: L("Qaysi qaror to'g'ri?", "Какое решение правильное?"),
        options: [
          {
            id: "a",
            text: L("Onaga «3 kun kuting, keyin ariza yozasiz» deyish", "Сказать матери: «Подождите 3 дня, потом напишете заявление»"),
            score: 0,
            feedback: L(
              "«3 kun kutish» — xavfli afsona. Bola bedarak yo'qolganda birinchi soatlar hal qiluvchi.",
              "«Ждать 3 дня» — опасный миф. При пропаже ребёнка решающими являются первые часы."
            ),
          },
          {
            id: "b",
            text: L(
              "Zudlik bilan ro'yxatga olish, navbatchi boshlig'iga bildirish, bolaning belgilari va surati bilan patrul xizmatlariga orientirovka berish, qidiruv choralarini boshlash, voyaga yetmaganlar inspektorini jalb qilish",
              "Немедленно зарегистрировать, доложить начальнику дежурной смены, передать ориентировку с приметами и фото патрульным службам, начать розыскные мероприятия, привлечь инспектора по делам несовершеннолетних"
            ),
            score: 3,
            feedback: L("To'g'ri: bola hayoti xavf ostida bo'lishi mumkin — kechiktirib bo'lmaydi.", "Верно: жизнь ребёнка может быть под угрозой — промедление недопустимо."),
          },
          {
            id: "c",
            text: L("Ro'yxatga olib, ertalab profilaktika inspektoriga topshirish", "Зарегистрировать и утром передать инспектору профилактики"),
            score: 1,
            feedback: L("Ro'yxatga olish to'g'ri, ammo ertalabgacha kutish — tun bo'yi qidiruv o'tkazilmaydi.", "Регистрация верна, но ждать утра — значит всю ночь не искать."),
          },
          {
            id: "d",
            text: L("Onani bolaga qarashga e'tiborsizligi uchun ma'muriy javobgarlikka tortish", "Привлечь мать к административной ответственности за ненадлежащий присмотр"),
            score: 0,
            feedback: L("Hozir asosiy vazifa — bolani topish. Javobgarlik masalasi keyin ko'riladi.", "Сейчас главная задача — найти ребёнка. Вопрос ответственности — потом."),
          },
        ],
      },
      competencies: ["surishtiruvchi.qabul", "surishtiruvchi.protsessual"],
      consequence: L(
        "Kechiktirilgan qidiruv bola hayotiga tahdid soladi; bunday holatlar xodimning jiddiy javobgarligiga va jamoatchilik noroziligiga olib keladi.",
        "Промедление с розыском угрожает жизни ребёнка; такие случаи ведут к серьёзной ответственности сотрудника и общественному резонансу."
      ),
    },

    /* 3 ------------------------------------------------------------ */
    {
      id: "s3-qualify",
      title: L("Murojaatlarni saralash va kvalifikatsiya", "Сортировка и квалификация обращений", "Sorting and qualifying"),
      brief: L(
        "Qolgan murojaatlarni dastlabki huquqiy baho bilan saralang.",
        "Рассортируйте остальные обращения по предварительной правовой оценке.",
        "Sort the remaining applications by preliminary legal assessment."
      ),
      materials: [],
      task: {
        kind: "match",
        prompt: L("Har bir murojaatni dastlabki huquqiy baho bilan bog'lang.", "Соедините каждое обращение с предварительной правовой оценкой."),
        left: [
          { id: "a1", text: L("№1 — qarz qaytarilmagan (tilxat bor)", "№1 — невозврат долга (есть расписка)") },
          { id: "a3", text: L("№3 — bozorda telefon o'g'irlangan", "№3 — кража телефона на рынке") },
          { id: "a4", text: L("№4 — onlayn «kredit» uchun pul o'tkazilgan", "№4 — перевод денег за онлайн-«кредит»") },
          { id: "a5", text: L("№5 — anonim xabar: tabletkalar sotilmoqda", "№5 — анонимно: продают таблетки") },
        ],
        right: [
          { id: "civil", text: L("Fuqarolik-huquqiy nizo ehtimoli — tekshiruv, so'ng qaror", "Вероятно гражданско-правовой спор — проверка, затем решение") },
          { id: "theft", text: L("O'g'irlik alomatlari (JK 169-modda)", "Признаки кражи (ст. 169 УК)") },
          { id: "fraud", text: L("Firibgarlik alomatlari (JK 168-modda)", "Признаки мошенничества (ст. 168 УК)") },
          { id: "drugs", text: L("Xabar sifatida ro'yxatga olib, ixtisoslashgan bo'linmaga tekshirish uchun yuborish", "Зарегистрировать как сообщение и направить в специализированное подразделение для проверки") },
        ],
        pairs: [
          ["a1", "civil"],
          ["a3", "theft"],
          ["a4", "fraud"],
          ["a5", "drugs"],
        ],
      },
      competencies: ["surishtiruvchi.malaka"],
      consequence: L(
        "Noto'g'ri dastlabki baho arizani «yo'qotib» qo'yadi: firibgarlik fuqarolik nizosi deb yopiladi yoki fuqarolik nizosi bo'yicha asossiz jinoyat ishi qo'zg'atiladi.",
        "Неверная первичная оценка «теряет» заявление: мошенничество закрывают как гражданский спор, либо по гражданскому спору необоснованно возбуждают уголовное дело."
      ),
    },

    /* 4 ------------------------------------------------------------ */
    {
      id: "s4-fraud",
      title: L("Onlayn firibgarlik: shoshilinch choralar", "Онлайн-мошенничество: срочные меры", "Online fraud: urgent steps"),
      brief: L(
        "№4 bo'yicha pul 3 soat oldin o'tkazilgan. Pul hali kartada qolgan bo'lishi mumkin. Qaysi choralar shu smenada ko'rilishi kerak?",
        "По №4 деньги переведены 3 часа назад и могут ещё оставаться на карте. Какие меры нужно принять в эту смену?",
        "In No. 4 the money was sent 3 hours ago and may still be on the card. Which steps must be taken this shift?"
      ),
      materials: [
        {
          id: "m-a4-chat",
          kind: "message",
          title: L("Chat skrinshoti (ilova)", "Скриншот чата (приложение)"),
          body: L(
            "«Kredit_Tez_UZ»: Kreditingiz tasdiqlandi ✅ 30 000 000 so'm. Sug'urta to'lovi 2 400 000 so'm — 8600 **** **** 4471 kartaga. To'lovdan keyin 10 daqiqada pul tushadi.",
            "«Kredit_Tez_UZ»: Ваш кредит одобрен ✅ 30 000 000 сумов. Страховой взнос 2 400 000 сумов — на карту 8600 **** **** 4471. Деньги поступят через 10 минут после оплаты."
          ),
          meta: [
            { label: L("Karta", "Карта"), value: "8600 **** **** 4471" },
            { label: L("O'tkazma", "Перевод"), value: "16:10" },
          ],
        },
      ],
      task: {
        kind: "multi",
        prompt: L("To'g'ri choralarni belgilang.", "Отметьте правильные меры."),
        options: [
          { id: "a", text: L("Arizani ro'yxatga olish va jabrlanuvchidan batafsil tushuntirish olish", "Зарегистрировать заявление и получить подробное объяснение потерпевшей"), correct: true },
          { id: "b", text: L("Karta chiqargan bankka mablag'larni to'xtatib turish bo'yicha shoshilinch so'rov yuborish", "Срочно направить в банк-эмитент запрос о приостановлении операций по средствам"), correct: true },
          { id: "c", text: L("Chat skrinshotlari, akkaunt nomi, karta raqami va o'tkazma chekini materialga biriktirish", "Приобщить скриншоты чата, имя аккаунта, номер карты и чек перевода"), correct: true },
          { id: "d", text: L("Kiberjinoyatlar bo'yicha ixtisoslashgan bo'linmani xabardor qilish", "Уведомить специализированное подразделение по киберпреступлениям"), correct: true },
          {
            id: "e",
            text: L("Jabrlanuvchiga firibgar bilan o'zi bog'lanib, pulni qaytarishni so'rashni maslahat berish", "Посоветовать потерпевшей самой связаться с мошенником и попросить вернуть деньги"),
            correct: false,
            feedback: L("Bu jabrlanuvchini yana aldanish xavfiga qo'yadi va firibgarni ogohlantiradi.", "Это подвергает потерпевшую риску повторного обмана и предупреждает мошенника."),
          },
          {
            id: "f",
            text: L("Firibgar boshqa viloyatda bo'lishi mumkinligi sababli arizani qabul qilmaslik", "Не принимать заявление, так как мошенник может быть в другой области"),
            correct: false,
            feedback: L("Ariza qabul qilinadi; tergovga taalluqliligi keyin hal qilinadi va material belgilangan tartibda yuboriladi.", "Заявление принимается; подследственность решается позже, материал направляется в установленном порядке."),
          },
        ],
      },
      competencies: ["surishtiruvchi.protsessual", "surishtiruvchi.qabul"],
      consequence: L(
        "Bankka so'rov kechiktirilsa, pul bir necha soat ichida «drop» kartalar orqali naqdlashtiriladi va zararni qoplash imkoniyati yo'qoladi.",
        "Если запрос в банк задержать, деньги за несколько часов обналичат через «дроп»-карты, и возможность возместить ущерб исчезнет."
      ),
    },

    /* 5 ------------------------------------------------------------ */
    {
      id: "s5-priority",
      title: L("Ustuvorlik", "Приоритет", "Priority"),
      brief: L(
        "Smenada resurslar cheklangan: bitta tezkor guruh va siz. Murojaatlarni shoshilinchlik bo'yicha tartiblang.",
        "Ресурсы смены ограничены: одна опергруппа и вы. Расставьте обращения по срочности.",
        "Resources are limited: one response team and you. Order the applications by urgency."
      ),
      materials: [],
      task: {
        kind: "order",
        prompt: L("Eng shoshilinchdan boshlab tartiblang.", "Расположите от самого срочного."),
        items: [
          { id: "a2", text: L("№2 — bedarak yo'qolgan bola", "№2 — пропавший ребёнок") },
          { id: "a4", text: L("№4 — onlayn firibgarlik (pul hali kartada bo'lishi mumkin)", "№4 — онлайн-мошенничество (деньги ещё могут быть на карте)") },
          { id: "a3", text: L("№3 — bozordagi telefon o'g'irligi (IMEI ma'lum)", "№3 — кража телефона на рынке (IMEI известен)") },
          { id: "a5", text: L("№5 — anonim xabar (tabletkalar)", "№5 — анонимное сообщение (таблетки)") },
          { id: "a1", text: L("№1 — qarz qaytarilmagan", "№1 — невозврат долга") },
        ],
        correct: ["a2", "a4", "a3", "a5", "a1"],
      },
      competencies: ["surishtiruvchi.muddat", "surishtiruvchi.qabul"],
      consequence: L(
        "Ustuvorlik noto'g'ri qo'yilsa, hayotga tahdid bor holat navbatda kutib qoladi, «issiq» izlar esa sovib ketadi.",
        "При неверной расстановке приоритетов ситуация с угрозой жизни ждёт в очереди, а «горячие» следы остывают."
      ),
    },

    /* 6 ------------------------------------------------------------ */
    {
      id: "s6-deadline",
      title: L("Tekshiruv muddati", "Срок проверки", "Check deadline"),
      brief: L(
        "Jurnaldagi №412 material (onlayn savdo firibgarligi) 14-sentabrda ro'yxatga olingan. Bugun — 19-sentabr. Ushbu mashg'ulotdagi o'quv qoidasi: tekshiruv muddati ro'yxatga olingan kundan keyingi kundan boshlab hisoblanadi va 10 kun (JPK 329-modda bo'yicha; muddatni uzaytirish tartibini amaldagi tahrirdan tekshiring).",
        "Материал №412 из журнала (мошенничество в онлайн-торговле) зарегистрирован 14 сентября. Сегодня 19 сентября. Учебное правило этого занятия: срок проверки исчисляется со следующего дня после регистрации и составляет 10 дней (ст. 329 УПК; порядок продления сверяйте с действующей редакцией).",
        "Journal item No. 412 was registered on 14 September. Today is 19 September. Training rule: the check period runs from the day after registration and lasts 10 days."
      ),
      materials: [],
      task: {
        kind: "numeric",
        prompt: L(
          "Bugunni hisobga olmaganda, №412 bo'yicha qaror qabul qilish uchun necha kun qoldi?",
          "Сколько дней (не считая сегодняшнего) осталось для принятия решения по №412?"
        ),
        unit: "kun / дн.",
        answer: 5,
        tolerance: 0,
        solution: L(
          "Muddat 15-sentabrdan boshlanadi: 15 + 10 − 1 = 24-sentabr — oxirgi kun. Bugun 19-sentabr; qolgan kunlar: 20, 21, 22, 23, 24 → 5 kun.",
          "Срок начинается 15 сентября: 15 + 10 − 1 = 24 сентября — последний день. Сегодня 19-е; осталось: 20, 21, 22, 23, 24 → 5 дней."
        ),
      },
      competencies: ["surishtiruvchi.muddat"],
      consequence: L(
        "Muddat o'tkazib yuborilsa, material «muddati o'tgan» deb qayd etiladi, prokuror taqdimnoma kiritadi, dalillar esa yo'qolishi mumkin.",
        "При пропуске срока материал считается просроченным, прокурор вносит представление, а доказательства могут быть утрачены."
      ),
    },

    /* 7 ------------------------------------------------------------ */
    {
      id: "s7-answer",
      title: L("Fuqaroga javob", "Ответ гражданину", "Reply to the citizen"),
      brief: L(
        "№1 bo'yicha tekshiruv yakunlandi: B. Yusupov qarzni tan oladi, ishdan bo'shagani uchun kechiktirgan, aldash niyati aniqlanmadi. Jinoyat ishini qo'zg'atish rad etildi. Ergashev T.ga yoziladigan javob xatining asosiy qismini yozing.",
        "Проверка по №1 завершена: Б. Юсупов долг признаёт, задержал из-за потери работы, умысла на обман не установлено. В возбуждении уголовного дела отказано. Напишите основную часть ответа Эргашеву Т.",
        "The check on No. 1 is complete: no intent to deceive was found and a criminal case was refused. Write the main part of the reply to the applicant."
      ),
      materials: [],
      task: {
        kind: "text",
        prompt: L("Javob xatining asosiy qismi (kamida 50 so'z).", "Основная часть ответа (не менее 50 слов)."),
        rubric: [
          L("Ariza qachon ro'yxatga olingani va tekshiruv o'tkazilganini bildiradi", "Сообщает, когда заявление зарегистрировано и что проведена проверка"),
          L("Qabul qilingan qarorni (jinoyat ishini qo'zg'atishni rad etish) va asosini sodda tilda tushuntiradi: aldash niyati aniqlanmagan, munosabat fuqarolik-huquqiy", "Простым языком объясняет решение (отказ в возбуждении уголовного дела) и основание: умысел на обман не установлен, отношения гражданско-правовые"),
          L("Fuqarolik tartibida sudga murojaat qilish huquqini va tilxat dalil ekanini tushuntiradi", "Разъясняет право обратиться в суд в гражданском порядке и что расписка — доказательство"),
          L("Qarorni yuqori turuvchi organga yoki prokurorga shikoyat qilish huquqini bildiradi", "Сообщает о праве обжаловать решение вышестоящему органу или прокурору"),
          L("Hurmatli, rasmiy, fuqaroni ayblamaydigan ohang", "Уважительный, официальный тон без упрёков гражданину"),
        ],
        minWords: 50,
        model: L(
          "Hurmatli Tohir Ergashev! Sizning 19-sentabrdagi arizangiz navbatchilik qismida ro'yxatga olinib, u bo'yicha tekshiruv o'tkazildi. Tekshiruv davomida B. Yusupov qarzni tan olgani, uni ish joyini yo'qotgani sababli qaytara olmayotgani aniqlandi; pulni olishda sizni aldash niyati borligi tasdiqlanmadi. Shu sababli jinoyat ishini qo'zg'atish rad etildi. Ushbu munosabat fuqarolik-huquqiy xususiyatga ega: siz qarzni undirish uchun fuqarolik ishlari bo'yicha sudga da'vo bilan murojaat qilishingiz mumkin, tilxat esa bunda asosiy dalil hisoblanadi. Qarordan norozi bo'lsangiz, uni yuqori turuvchi organga yoki prokuraturaga shikoyat qilishingiz mumkin. Hurmat bilan, surishtiruvchi ___",
          "Уважаемый Тохир Эргашев! Ваше заявление от 19 сентября зарегистрировано в дежурной части, по нему проведена проверка. Установлено, что Б. Юсупов долг признаёт и не может вернуть его из-за потери работы; умысел на обман при получении денег не подтвердился. Поэтому в возбуждении уголовного дела отказано. Эти отношения носят гражданско-правовой характер: вы вправе обратиться в суд по гражданским делам с иском о взыскании долга, расписка является основным доказательством. Если вы не согласны с решением, его можно обжаловать вышестоящему органу или в прокуратуру. С уважением, дознаватель ___"
        ),
      },
      competencies: ["surishtiruvchi.hujjat"],
      consequence: L(
        "Tushunarsiz yoki qo'pol javob fuqaroni himoyasiz qoldiradi va takroriy shikoyatlarga, murojaatlar bo'yicha qonun buzilishiga olib keladi.",
        "Непонятный или грубый ответ оставляет гражданина без защиты и ведёт к повторным жалобам и нарушению закона об обращениях."
      ),
    },
  ],
};
