import type { ProfessionSim } from "@/data/kasblar/types";

/**
 * K-01 «Kuryer» — Telegram orqali firibgarlik: ariza, yozishmalar, fishing
 * sahifa, tranzaksiyalar, raqamli izlarni bog'lash, qonuniy harakatlar.
 * Barcha ma'lumotlar to'qima: domenlar .example, kartalar niqoblangan,
 * IP manzillar hujjatlashtirish diapazonidan (192.0.2.x, 10.x).
 */
export const SIM_KIBER: ProfessionSim = {
  id: "sim-kiber-01",
  professionId: "kiber",
  code: "K-01",
  env: "cyber_sandbox",
  minutes: 25,
  title: {
    uz: "«Kuryer»: Telegramdagi firibgarlik",
    ru: "«Курьер»: мошенничество в Telegram",
    en: "'The courier': a Telegram scam",
  },
  setting: {
    uz: "Tuman IIB kiberjinoyatchilikka qarshi kurashish guruhi. 15 sentyabr, 10:05. Navbatchi qismdan ariza berilgan jabrlanuvchi yo'naltirildi.",
    ru: "Группа по борьбе с киберпреступностью районного УВД. 15 сентября, 10:05. Из дежурной части направлена заявительница.",
    en: "District police cybercrime unit. 15 September, 10:05. The duty desk has sent over a victim who wants to file a report.",
  },
  intro: {
    uz: "Dilnoza Rahimova (34 yosh) «SavdoMarket» e'lonlar saytida eski kolyaskani sotmoqchi bo'lgan. Kechqurun Telegramda «kuryer» yozib, pulni kartaga o'tkazish uchun havola yuborgan. Havolada karta ma'lumotlari va SMS-kodni kiritgan — bir necha daqiqada kartadan pul yechilgan. Sizning vazifangiz — dalillarni saqlab qolish, fishing belgilarini aniqlash, zararni hisoblash, raqamli izlarni bitta zanjirga bog'lash va buni qonuniy tartibda rasmiylashtirish.",
    ru: "Дилноза Рахимова (34 года) продавала старую коляску на сайте объявлений «SavdoMarket». Вечером в Telegram написал «курьер» и прислал ссылку для «получения оплаты». Она ввела данные карты и SMS-код — за несколько минут с карты списали деньги. Ваша задача — сохранить доказательства, выявить признаки фишинга, посчитать ущерб, связать цифровые следы в одну цепочку и оформить всё в законном порядке.",
    en: "Dilnoza Rahimova (34) listed an old pram on the 'SavdoMarket' classifieds site. In the evening a 'courier' messaged her on Telegram with a link to 'receive payment'. She entered her card details and SMS code; within minutes money left her card. Your job: preserve evidence, spot the phishing signs, total the loss, link the digital traces and do it all lawfully.",
  },
  stages: [
    /* 1 ------------------------------------------------------------------ */
    {
      id: "k1-ariza",
      title: {
        uz: "Jabrlanuvchi arizasi",
        ru: "Заявление потерпевшей",
        en: "The victim's report",
      },
      brief: {
        uz: "Jabrlanuvchi hayajonda: «Men uyalganimdan yozishmani o'chirib tashlamoqchi edim, lekin eri to'xtatdi». Kartasi hali bloklanmagan.",
        ru: "Потерпевшая взволнована: «Мне было стыдно, хотела удалить переписку, муж остановил». Карта ещё не заблокирована.",
        en: "The victim is upset: 'I was so ashamed I wanted to delete the chat, my husband stopped me.' Her card is still not blocked.",
      },
      materials: [
        {
          id: "k-m-ariza",
          kind: "application",
          title: {
            uz: "Ariza (qisqacha)",
            ru: "Заявление (кратко)",
            en: "Report (summary)",
          },
          body: {
            uz: "14 sentyabr kuni 20:48 dan 21:15 gacha Telegramda «SavdoMarket kuryer» deb tanishtirgan noma'lum shaxs meni aldab, bank kartamdan pul o'tkazib olgan. Telefonimda yozishma va SMS xabarlar saqlangan. Aybdorni topishingizni so'rayman.",
            ru: "14 сентября с 20:48 до 21:15 неизвестный, представившийся в Telegram «курьером SavdoMarket», обманом перевёл деньги с моей банковской карты. Переписка и SMS сохранены в телефоне. Прошу найти виновного.",
          },
          meta: [
            { label: { uz: "Arizachi", ru: "Заявитель" }, value: "D. Rahimova" },
            { label: { uz: "Karta", ru: "Карта" }, value: "8600 **** **** 4417" },
            { label: { uz: "Qurilma", ru: "Устройство" }, value: "Android smartfon" },
          ],
        },
      ],
      task: {
        kind: "choice",
        prompt: {
          uz: "Arizani qabul qilgach, birinchi navbatda nima qilasiz?",
          ru: "Что вы делаете в первую очередь после приёма заявления?",
          en: "Having taken the report, what do you do first?",
        },
        options: [
          {
            id: "a",
            text: {
              uz: "Arizani ro'yxatga olaman; jabrlanuvchiga kartani bank ilovasi yoki qo'ng'iroq markazi orqali darhol bloklatishni aytaman; telefondagi hech narsani o'chirmaslik va Telegram akkauntidan chiqmaslikni tushuntiraman.",
              ru: "Регистрирую заявление; прошу потерпевшую немедленно заблокировать карту через приложение или колл-центр банка; объясняю, что в телефоне ничего нельзя удалять и выходить из Telegram-аккаунта.",
              en: "Register the report; have the victim block the card at once via the bank app or call centre; explain she must delete nothing and stay logged in to Telegram.",
            },
            score: 3,
            feedback: {
              uz: "To'g'ri. Bloklash — keyingi yechimlarni to'xtatadi, yozishmani saqlash — asosiy dalilni saqlaydi. Ro'yxatga olish — barcha keyingi harakatlarning asosi.",
              ru: "Верно. Блокировка останавливает дальнейшие списания, сохранность переписки — сохраняет главное доказательство. Регистрация — основа всех дальнейших действий.",
            },
          },
          {
            id: "b",
            text: {
              uz: "Jabrlanuvchi telefonidan «kuryer»ga o'zimni jabrlanuvchi qilib yozaman — u yana pul so'rashi mumkin, shunda uni tuzoqqa tushiraman.",
              ru: "Пишу «курьеру» с телефона потерпевшей от её имени — он может снова попросить деньги, и я его поймаю.",
              en: "Message the 'courier' from the victim's phone pretending to be her — he may ask for more and walk into a trap.",
            },
            score: 0,
            feedback: {
              uz: "Rasmiylashtirilmagan «tuzoq» — qonunsiz harakat va dalilni buzish. Firibgar sezib qolsa, akkauntini o'chiradi, yozishma ikki tomonda ham yo'qolishi mumkin.",
              ru: "Неоформленная «ловушка» — незаконное действие и порча доказательства. Заподозрив, мошенник удалит аккаунт, переписка может исчезнуть у обеих сторон.",
            },
          },
          {
            id: "c",
            text: {
              uz: "Yozishmani skrinshot qilib, jabrlanuvchidan menga shaxsiy Telegramim orqali yuborishini so'rayman, keyin arizani ro'yxatga olaman.",
              ru: "Прошу потерпевшую сделать скриншоты и переслать мне в личный Telegram, потом регистрирую заявление.",
              en: "Ask her to screenshot the chat and send it to my personal Telegram, then register the report.",
            },
            score: 1,
            feedback: {
              uz: "Shaxsiy messenjer orqali olingan skrinshot — protsessual jihatdan rasmiylashtirilmagan nusxa, shaxsga doir ma'lumotlarni ham xavf ostiga qo'yadi. Karta hali ham bloklanmagan.",
              ru: "Скриншот через личный мессенджер — процессуально не оформленная копия и риск для персональных данных. Карта всё ещё не заблокирована.",
            },
          },
          {
            id: "d",
            text: {
              uz: "Jabrlanuvchini bankka yuboraman: pulni qaytarish bank masalasi, bank rad etsa, keyin ariza bilan qaytib kelsin.",
              ru: "Отправляю потерпевшую в банк: возврат денег — вопрос банка, если откажут — пусть вернётся с заявлением.",
              en: "Send her to the bank — refunds are the bank's business; if refused, she can come back with a report.",
            },
            score: 0,
            feedback: {
              uz: "Arizani qabul qilishdan bosh tortish — qonun buzilishi. Firibgarlik — jinoyat, uni ro'yxatga olish va ko'rib chiqish majburiy.",
              ru: "Отказ в приёме заявления — нарушение закона. Мошенничество — преступление, его регистрация и рассмотрение обязательны.",
            },
          },
        ],
      },
      competencies: ["kiber.hujjat"],
      consequence: {
        uz: "Bloklanmagan kartadan firibgar ikkinchi marta pul yechadi, o'chirilgan yozishma esa ishdagi yagona to'g'ridan-to'g'ri dalilni yo'q qiladi.",
        ru: "С незаблокированной карты мошенник спишет деньги повторно, а удалённая переписка уничтожит единственное прямое доказательство.",
      },
    },

    /* 2 ------------------------------------------------------------------ */
    {
      id: "k2-yozishma",
      title: {
        uz: "Messenjer yozishmalari",
        ru: "Переписка в мессенджере",
        en: "Messenger chat",
      },
      brief: {
        uz: "Yozishma mutaxassis ishtirokida ko'zdan kechirildi. Qaysi ma'lumotlar keyinchalik shaxsni aniqlash uchun ishga yaraydi?",
        ru: "Переписка осмотрена с участием специалиста. Какие данные пригодятся для установления личности?",
        en: "The chat has been examined with a specialist present. Which details will help identify the person?",
      },
      materials: [
        {
          id: "k-m-msg1",
          kind: "message",
          title: { uz: "SavdoMarket Kuryer", ru: "SavdoMarket Kuryer" },
          body: {
            uz: "Assalomu alaykum! Kolyaskangizni xaridor sotib oldi, pulni SavdoMarket xavfsiz to'lov orqali kartangizga o'tkazamiz. Kuryer ertaga olib ketadi.",
            ru: "Здравствуйте! Покупатель оплатил вашу коляску, деньги переведём на карту через безопасную оплату SavdoMarket. Курьер заберёт завтра.",
          },
          meta: [
            { label: { uz: "Yuboruvchi", ru: "Отправитель" }, value: "@SavdoMarket_Kuryer" },
            { label: { uz: "Foydalanuvchi ID", ru: "ID пользователя" }, value: "5550193847" },
            { label: { uz: "Vaqt", ru: "Время" }, value: "14.09, 20:48" },
          ],
        },
        {
          id: "k-m-msg2",
          kind: "message",
          title: { uz: "SavdoMarket Kuryer", ru: "SavdoMarket Kuryer" },
          body: {
            uz: "Pulni olish uchun shu havolaga kiring va karta ma'lumotlaringizni tasdiqlang: https://savdornarket-pay.example/receive/8841 — havola 15 daqiqa amal qiladi, keyin buyurtma bekor bo'ladi!",
            ru: "Чтобы получить деньги, перейдите по ссылке и подтвердите данные карты: https://savdornarket-pay.example/receive/8841 — ссылка действует 15 минут, потом заказ отменится!",
          },
          meta: [
            { label: { uz: "Yuboruvchi", ru: "Отправитель" }, value: "@SavdoMarket_Kuryer" },
            { label: { uz: "Vaqt", ru: "Время" }, value: "14.09, 20:53" },
          ],
          tone: "warn",
        },
        {
          id: "k-m-msg3",
          kind: "message",
          title: { uz: "SavdoMarket Kuryer", ru: "SavdoMarket Kuryer" },
          body: {
            uz: "To'lov o'tmadi, tizim xatosi. Sizga kelgan SMS-kodni shu yerga yozing, operator qo'lda tasdiqlaydi. Tezroq, iltimos.",
            ru: "Платёж не прошёл, ошибка системы. Напишите сюда код из SMS, оператор подтвердит вручную. Побыстрее, пожалуйста.",
          },
          meta: [
            { label: { uz: "Yuboruvchi", ru: "Отправитель" }, value: "@SavdoMarket_Kuryer" },
            { label: { uz: "Vaqt", ru: "Время" }, value: "14.09, 21:10" },
          ],
          tone: "warn",
        },
        {
          id: "k-m-profil",
          kind: "note",
          title: { uz: "Profil ma'lumoti (15.09, 10:40)", ru: "Данные профиля (15.09, 10:40)" },
          body: {
            uz: "Username endi @Kolyaska_Xaridor ga o'zgartirilgan, foydalanuvchi ID o'sha — 5550193847. Profil surati — internetda keng tarqalgan kuryer rasmi. Bio: «Yetkazib berish xizmati».",
            ru: "Username теперь изменён на @Kolyaska_Xaridor, ID пользователя тот же — 5550193847. Фото профиля — распространённое в интернете фото курьера. Био: «Служба доставки».",
          },
        },
      ],
      task: {
        kind: "multi",
        prompt: {
          uz: "Qaysi ma'lumotlarni shaxsni aniqlash uchun yetakchi izlar sifatida qayd etasiz? Barcha to'g'rilarini belgilang.",
          ru: "Какие данные вы фиксируете как ведущие следы для установления личности? Отметьте все верные.",
          en: "Which details do you record as leads for identification? Select all that apply.",
        },
        options: [
          {
            id: "uid",
            text: { uz: "Foydalanuvchi ID raqami (5550193847)", ru: "Числовой ID пользователя (5550193847)", en: "Numeric user ID (5550193847)" },
            correct: true,
            feedback: {
              uz: "Username o'zgaradi, ID — o'zgarmaydi. Aynan ID akkauntni ishonchli identifikatsiya qiladi.",
              ru: "Username меняется, ID — нет. Именно ID надёжно идентифицирует аккаунт.",
            },
          },
          {
            id: "usernames",
            text: { uz: "Ikkala username (eski va yangi)", ru: "Оба username (старый и новый)", en: "Both usernames (old and new)" },
            correct: true,
            feedback: {
              uz: "Username tarixi boshqa jabrlanuvchilar arizalari va ochiq manbalar bilan solishtirish imkonini beradi.",
              ru: "История username позволяет сопоставить с заявлениями других потерпевших и открытыми источниками.",
            },
          },
          {
            id: "link",
            text: { uz: "Fishing havolasi va uning domeni", ru: "Фишинговая ссылка и её домен", en: "The phishing link and its domain" },
            correct: true,
            feedback: {
              uz: "Domen orqali registrator va hosting, ular orqali esa boshqaruv paneliga kirgan IP manzillar aniqlanadi.",
              ru: "Через домен устанавливаются регистратор и хостинг, а через них — IP-адреса входа в панель управления.",
            },
          },
          {
            id: "times",
            text: { uz: "Har bir xabarning aniq vaqti", ru: "Точное время каждого сообщения", en: "Exact time of each message" },
            correct: true,
            feedback: {
              uz: "Vaqt belgilari provayder loglari va bank tranzaksiyalari bilan solishtirish uchun asos.",
              ru: "Временные метки — основа сопоставления с логами провайдера и банковскими транзакциями.",
            },
          },
          {
            id: "photo",
            text: { uz: "Profil surati — kuryerning yuzi", ru: "Фото профиля — лицо курьера", en: "Profile photo — the courier's face" },
            correct: false,
            feedback: {
              uz: "Rasm internetda keng tarqalgan — u firibgarning yuzi emas. Undan identifikatsiya uchun foydalanish begunoh odamni gumonga qo'yadi.",
              ru: "Фото широко распространено в интернете — это не лицо мошенника. Использовать его для идентификации — значит подставить невиновного.",
            },
          },
          {
            id: "bio",
            text: { uz: "Bio matni «Yetkazib berish xizmati»", ru: "Текст био «Служба доставки»", en: "Bio text 'Delivery service'" },
            correct: false,
            feedback: {
              uz: "Umumiy ibora, identifikatsiya qiymati yo'q.",
              ru: "Общая фраза, идентификационной ценности нет.",
            },
          },
        ],
      },
      competencies: ["kiber.osint", "kiber.raqamli_iz"],
      consequence: {
        uz: "Faqat username qayd etilsa, firibgar uni o'zgartirgach iz uziladi va ish «noma'lum shaxs» bo'yicha to'xtab qoladi.",
        ru: "Если зафиксирован только username, после его смены след обрывается, и дело встаёт на «неустановленном лице».",
      },
    },

    /* 3 ------------------------------------------------------------------ */
    {
      id: "k3-fishing",
      title: {
        uz: "Fishing belgilari",
        ru: "Признаки фишинга",
        en: "Phishing indicators",
      },
      brief: {
        uz: "Havola orqali ochilgan sahifa arxivlandi. Jabrlanuvchiga shu kuni SMS ham kelgan. Qaysi belgilar sahifa va xabarning soxtaligini ko'rsatadi?",
        ru: "Страница по ссылке заархивирована. В тот же день потерпевшей пришло SMS. Какие признаки указывают на подделку?",
        en: "The page behind the link has been archived. The victim also got an SMS that day. Which signs show they are fake?",
      },
      materials: [
        {
          id: "k-m-sahifa",
          kind: "email",
          title: {
            uz: "Sahifa arxivi: savdornarket-pay.example",
            ru: "Архив страницы: savdornarket-pay.example",
            en: "Page archive: savdornarket-pay.example",
          },
          body: {
            uz: "Sarlavha: «SavdoMarket — Xavfsiz to'lov. Pulni qabul qilish». Maydonlar: karta raqami, amal qilish muddati, CVV, SMS-kod. Pastda: «© SavdoMarket 2019». Rasmiy sayt: savdomarket.example.uz. Domen 12.09 da ro'yxatdan o'tkazilgan.",
            ru: "Заголовок: «SavdoMarket — Безопасная оплата. Получение денег». Поля: номер карты, срок действия, CVV, SMS-код. Внизу: «© SavdoMarket 2019». Официальный сайт: savdomarket.example.uz. Домен зарегистрирован 12.09.",
          },
          meta: [
            { label: { uz: "Domen", ru: "Домен" }, value: "savdornarket-pay.example" },
            { label: { uz: "Rasmiy domen", ru: "Официальный домен" }, value: "savdomarket.example.uz" },
            { label: { uz: "Ro'yxatdan o'tgan", ru: "Зарегистрирован" }, value: "12.09" },
          ],
          tone: "warn",
        },
        {
          id: "k-m-sms",
          kind: "message",
          title: { uz: "SMS", ru: "SMS" },
          body: {
            uz: "SAVDOMARKET: Hurmatli mijoz, 1 250 000 so'm to'lovingiz kutilmoqda. Qabul qilish: savdomarket.example.uz.receive-pay.example/k8 Kod hech kimga aytmang: 4471",
            ru: "SAVDOMARKET: Уважаемый клиент, ваш платёж 1 250 000 сум ожидает. Получить: savdomarket.example.uz.receive-pay.example/k8 Код никому не сообщайте: 4471",
          },
          meta: [
            { label: { uz: "Yuboruvchi", ru: "Отправитель" }, value: "+998 95 *** 03 19" },
            { label: { uz: "Vaqt", ru: "Время" }, value: "14.09, 20:55" },
          ],
        },
      ],
      task: {
        kind: "multi",
        prompt: {
          uz: "Soxtalik belgilarini belgilang (barcha to'g'rilarini).",
          ru: "Отметьте признаки подделки (все верные).",
          en: "Mark every sign of forgery.",
        },
        options: [
          {
            id: "rn",
            text: { uz: "«savdornarket» — «m» harfi o'rniga «rn»", ru: "«savdornarket» — «rn» вместо «m»", en: "'savdornarket' — 'rn' in place of 'm'" },
            correct: true,
            feedback: {
              uz: "Klassik o'xshash domen (typosquatting): kichik ekranda «rn» va «m» deyarli farqlanmaydi.",
              ru: "Классический похожий домен (тайпсквоттинг): на маленьком экране «rn» и «m» почти неотличимы.",
            },
          },
          {
            id: "subdomain",
            text: {
              uz: "SMSdagi havolada haqiqiy domen boshida, lekin oxirgi domen — receive-pay.example",
              ru: "В ссылке из SMS настоящий домен стоит в начале, но конечный домен — receive-pay.example",
              en: "The SMS link starts with the real name but the actual domain is receive-pay.example",
            },
            correct: true,
            feedback: {
              uz: "Havola egasi oxirgi (o'ng tomondagi) domen bilan belgilanadi; chapdagi «savdomarket.example.uz» — shunchaki subdomen niqobi.",
              ru: "Владельца ссылки определяет правый (конечный) домен; «savdomarket.example.uz» слева — просто маскировка поддоменом.",
            },
          },
          {
            id: "cvv",
            text: { uz: "Pul «qabul qilish» uchun CVV va SMS-kod so'ralmoqda", ru: "Для «получения» денег запрашиваются CVV и SMS-код", en: "CVV and SMS code demanded to 'receive' money" },
            correct: true,
            feedback: {
              uz: "Pul qabul qilish uchun faqat karta raqami yetarli. CVV va SMS-kod — pul yechish uchun kerak.",
              ru: "Для получения денег достаточно номера карты. CVV и SMS-код нужны для списания.",
            },
          },
          {
            id: "urgency",
            text: { uz: "«15 daqiqa», «tezroq» — shoshiltirish", ru: "«15 минут», «побыстрее» — давление срочностью", en: "'15 minutes', 'hurry' — time pressure" },
            correct: true,
            feedback: {
              uz: "Shoshiltirish — ijtimoiy muhandislikning asosiy usuli: odam o'ylab ko'rishga ulgurmaydi.",
              ru: "Срочность — основной приём социальной инженерии: человек не успевает подумать.",
            },
          },
          {
            id: "fresh",
            text: { uz: "Domen hodisadan 2 kun oldin ro'yxatdan o'tgan", ru: "Домен зарегистрирован за 2 дня до события", en: "Domain registered 2 days before the incident" },
            correct: true,
            feedback: {
              uz: "Yangi domen va «© 2019» yozuvi bir-biriga zid — sahifa yaqinda nusxalangan.",
              ru: "Свежий домен и надпись «© 2019» противоречат друг другу — страница недавно скопирована.",
            },
          },
          {
            id: "logo",
            text: { uz: "Sahifada SavdoMarket logotipi bor", ru: "На странице есть логотип SavdoMarket", en: "The page shows the SavdoMarket logo" },
            correct: false,
            feedback: {
              uz: "Logotip — soxtalik belgisi emas: uni har kim nusxalay oladi. U haqiqiylikni ham, soxtalikni ham isbotlamaydi.",
              ru: "Логотип — не признак подделки: его может скопировать кто угодно. Он не доказывает ни подлинность, ни подделку.",
            },
          },
          {
            id: "uzs",
            text: { uz: "Summa so'mda ko'rsatilgan", ru: "Сумма указана в сумах", en: "Amount shown in soums" },
            correct: false,
            feedback: {
              uz: "Mahalliy valyuta — neytral belgi.",
              ru: "Местная валюта — нейтральный признак.",
            },
          },
        ],
      },
      competencies: ["kiber.fishing"],
      consequence: {
        uz: "Fishing mexanizmi aniq tavsiflanmasa, ayblov «jabrlanuvchi o'zi ma'lumot bergan» degan e'tirozga duch keladi va aldov usuli isbotlanmay qoladi.",
        ru: "Если механизм фишинга не описан точно, обвинение натыкается на довод «потерпевшая сама отдала данные», и способ обмана остаётся недоказанным.",
      },
    },

    /* 4 ------------------------------------------------------------------ */
    {
      id: "k4-tranzaksiya",
      title: {
        uz: "Bank tranzaksiyalari",
        ru: "Банковские транзакции",
        en: "Bank transactions",
      },
      brief: {
        uz: "Bankdan kartaning 13–14 sentyabr kunlari ko'chirmasi olindi. Jabrlanuvchi supermarketdagi xaridni o'zi qilganini tasdiqladi.",
        ru: "Из банка получена выписка по карте за 13–14 сентября. Покупку в супермаркете потерпевшая подтвердила как свою.",
        en: "The bank statement for 13–14 September has arrived. The victim confirms the supermarket purchase was hers.",
      },
      materials: [
        {
          id: "k-m-kochirma",
          kind: "table",
          title: {
            uz: "Karta ko'chirmasi: 8600 **** **** 4417",
            ru: "Выписка по карте: 8600 **** **** 4417",
            en: "Card statement: 8600 **** **** 4417",
          },
          body: {
            uz: "Barcha summalar so'mda. «Holat» ustuniga e'tibor bering.",
            ru: "Все суммы в сумах. Обратите внимание на столбец «Статус».",
          },
          table: {
            head: ["Sana/vaqt", "Operatsiya", "Qabul qiluvchi", "Summa", "Holat"],
            rows: [
              ["13.09 18:22", "Xarid", "Supermarket «Navbahor»", 86000, "bajarildi"],
              ["14.09 21:07", "P2P o'tkazma", "9860 **** **** 2291", 3450000, "bajarildi"],
              ["14.09 21:09", "P2P o'tkazma", "9860 **** **** 2291", 2800000, "bajarildi"],
              ["14.09 21:12", "Hamyonga to'ldirish", "Hamyon.example +998 90 *** 41 07", 1250000, "bajarildi"],
              ["14.09 21:15", "P2P o'tkazma", "9860 **** **** 2291", 2000000, "rad etildi (limit)"],
            ],
          },
          tone: "neutral",
        },
      ],
      task: {
        kind: "numeric",
        prompt: {
          uz: "Firibgarlik natijasida jabrlanuvchiga yetkazilgan haqiqiy zarar necha so'm?",
          ru: "Каков фактический ущерб потерпевшей от мошенничества, в сумах?",
          en: "What is the actual loss to the victim from the fraud, in soums?",
        },
        unit: "so'm",
        answer: 7500000,
        tolerance: 0,
        solution: {
          uz: "Faqat 14.09 dagi bajarilgan o'tkazmalar hisoblanadi: 3 450 000 + 2 800 000 + 1 250 000 = 7 500 000 so'm. 13.09 dagi xarid jabrlanuvchining o'ziniki, 21:15 dagi 2 000 000 so'm rad etilgan — zarar emas, lekin jinoyatga suiqasd sifatida ishda qayd etiladi.",
          ru: "Учитываются только проведённые операции 14.09: 3 450 000 + 2 800 000 + 1 250 000 = 7 500 000 сумов. Покупка 13.09 — самой потерпевшей, 2 000 000 в 21:15 отклонены — это не ущерб, но фиксируется в деле как покушение.",
        },
      },
      competencies: ["kiber.moliyaviy"],
      consequence: {
        uz: "Zarar noto'g'ri hisoblansa, jinoyat kvalifikatsiyasi (zarar miqdoriga bog'liq og'irlashtiruvchi belgi) xato bo'ladi va sud ayblovni qayta ko'rib chiqishga qaytaradi.",
        ru: "Ошибка в сумме ущерба ведёт к неверной квалификации (квалифицирующий признак зависит от размера) — суд вернёт обвинение на пересмотр.",
      },
    },

    /* 5 ------------------------------------------------------------------ */
    {
      id: "k5-boglash",
      title: {
        uz: "Raqamli izlarni bog'lash",
        ru: "Связывание цифровых следов",
        en: "Linking digital traces",
      },
      brief: {
        uz: "Tergovchining so'rovlari bo'yicha bank, mobil operator, hosting va internet-provayderdan javoblar keldi. Har bir identifikatorni uni aniq shaxs yoki boshqa izga bog'laydigan manba bilan moslang.",
        ru: "По запросам следователя пришли ответы банка, оператора, хостинга и провайдера. Сопоставьте каждый идентификатор с источником, который связывает его с конкретным лицом или другим следом.",
        en: "Replies from the bank, mobile operator, host and ISP have arrived on the investigator's requests. Match each identifier to the source that ties it to a person or another trace.",
      },
      materials: [
        {
          id: "k-m-bank",
          kind: "document",
          title: { uz: "Bank javobi", ru: "Ответ банка", en: "Bank reply" },
          body: {
            uz: "9860 **** **** 2291 karta egasi — T. Botir, 1996 y.t. Kartaga ulangan telefon raqami: +998 93 *** 12 58. 14.09 kuni 21:20 da tushgan mablag' bankomatdan naqd yechilgan.",
            ru: "Держатель карты 9860 **** **** 2291 — Т. Ботир, 1996 г.р. Привязанный номер: +998 93 *** 12 58. 14.09 в 21:20 поступившие средства сняты наличными в банкомате.",
          },
          meta: [
            { label: { uz: "Karta", ru: "Карта" }, value: "9860 **** **** 2291" },
            { label: { uz: "Telefon", ru: "Телефон" }, value: "+998 93 *** 12 58" },
          ],
        },
        {
          id: "k-m-hosting",
          kind: "document",
          title: { uz: "Hosting logi (ko'chirma)", ru: "Лог хостинга (выписка)", en: "Hosting log (extract)" },
          body: {
            uz: "savdornarket-pay.example boshqaruv paneliga kirishlar: 14.09 20:41 — IP 192.0.2.44; 14.09 21:13 — IP 192.0.2.44. Kiritilgan karta ma'lumotlari panelda 20:56 da saqlangan.",
            ru: "Входы в панель управления savdornarket-pay.example: 14.09 20:41 — IP 192.0.2.44; 14.09 21:13 — IP 192.0.2.44. Введённые данные карты сохранены в панели в 20:56.",
          },
        },
        {
          id: "k-m-provayder",
          kind: "document",
          title: { uz: "Internet-provayder javobi", ru: "Ответ интернет-провайдера", en: "ISP reply" },
          body: {
            uz: "IP 192.0.2.44 14.09 kuni 18:00–23:30 oralig'ida uy interneti shartnomasi bo'yicha abonentga berilgan: T. Botir, aloqa telefoni +998 93 *** 12 58. Ichki manzil: 10.14.7.22.",
            ru: "IP 192.0.2.44 14.09 с 18:00 до 23:30 выдан абоненту по договору домашнего интернета: Т. Ботир, контактный телефон +998 93 *** 12 58. Внутренний адрес: 10.14.7.22.",
          },
        },
        {
          id: "k-m-operator",
          kind: "document",
          title: { uz: "Mobil operator javobi", ru: "Ответ мобильного оператора", en: "Mobile operator reply" },
          body: {
            uz: "+998 90 *** 41 07 raqami S. Aliyev (2004 y.t., talaba) nomida. Hamyon.example hamyoni shu raqamga ochilgan. S. Aliyev so'roqda «hamyonni bir tanishimga pulga ijaraga berdim» dedi.",
            ru: "Номер +998 90 *** 41 07 оформлен на С. Алиева (2004 г.р., студент). Кошелёк Hamyon.example открыт на этот номер. На опросе С. Алиев сказал: «сдал кошелёк знакомому за деньги».",
          },
        },
      ],
      task: {
        kind: "match",
        prompt: {
          uz: "Har bir identifikatorni uni tasdiqlovchi bog'lanish bilan moslang.",
          ru: "Сопоставьте каждый идентификатор с подтверждающей его связью.",
          en: "Match each identifier with the link that confirms it.",
        },
        left: [
          { id: "l-user", text: { uz: "@SavdoMarket_Kuryer (ID 5550193847)", ru: "@SavdoMarket_Kuryer (ID 5550193847)" } },
          { id: "l-domain", text: { uz: "savdornarket-pay.example", ru: "savdornarket-pay.example" } },
          { id: "l-ip", text: { uz: "IP 192.0.2.44", ru: "IP 192.0.2.44" } },
          { id: "l-card", text: { uz: "Karta 9860 **** **** 2291", ru: "Карта 9860 **** **** 2291" } },
          { id: "l-wallet", text: { uz: "Hamyon +998 90 *** 41 07", ru: "Кошелёк +998 90 *** 41 07" } },
        ],
        right: [
          {
            id: "r-chat",
            text: {
              uz: "Yozishma: fishing havolasini aynan shu akkaunt yuborgan",
              ru: "Переписка: фишинговую ссылку прислал именно этот аккаунт",
            },
          },
          {
            id: "r-panel",
            text: {
              uz: "Hosting logi: boshqaruv paneliga kirish shu IP dan bo'lgan",
              ru: "Лог хостинга: вход в панель управления с этого IP",
            },
          },
          {
            id: "r-isp",
            text: {
              uz: "Provayder: shu vaqtda T. Botir shartnomasiga berilgan (tel. …12 58)",
              ru: "Провайдер: в это время выдан по договору Т. Ботира (тел. …12 58)",
            },
          },
          {
            id: "r-holder",
            text: {
              uz: "Bank: egasi T. Botir, ulangan raqam …12 58",
              ru: "Банк: держатель Т. Ботир, привязан номер …12 58",
            },
          },
          {
            id: "r-dropper",
            text: {
              uz: "Operator: boshqa shaxs nomida — ijaraga berilgan «dropper» hamyon",
              ru: "Оператор: на другое лицо — сданный в аренду кошелёк «дроппера»",
            },
          },
        ],
        pairs: [
          ["l-user", "r-chat"],
          ["l-domain", "r-panel"],
          ["l-ip", "r-isp"],
          ["l-card", "r-holder"],
          ["l-wallet", "r-dropper"],
        ],
      },
      competencies: ["kiber.raqamli_iz", "kiber.osint"],
      consequence: {
        uz: "Izlar zanjiri bog'lanmasa, «dropper» — o'z hamyonini ijaraga bergan talaba — asosiy gumon qilinuvchiga aylanadi, tashkilotchi esa javobgarlikdan qochadi.",
        ru: "Если цепочка не связана, главным подозреваемым становится «дроппер» — студент, сдавший кошелёк, а организатор уходит от ответственности.",
      },
    },

    /* 6 ------------------------------------------------------------------ */
    {
      id: "k6-harakatlar",
      title: {
        uz: "Qonuniy harakatlar ketma-ketligi",
        ru: "Последовательность законных действий",
        en: "Lawful sequence of actions",
      },
      brief: {
        uz: "Hamkasbingiz so'raydi: «Nega bu tartibda qildik?» Butun ish bo'yicha harakatlarni to'g'ri ketma-ketlikda tiklang.",
        ru: "Коллега спрашивает: «Почему мы делали именно в таком порядке?» Восстановите правильную последовательность действий по делу.",
        en: "A colleague asks why you worked in this order. Rebuild the correct sequence of actions for the case.",
      },
      materials: [
        {
          id: "k-m-eslatma",
          kind: "note",
          title: { uz: "Metodik eslatma", ru: "Методическая памятка", en: "Method note" },
          body: {
            uz: "Operator va provayderlar ulanish loglarini cheklangan muddat saqlaydi. Aloqa sirini cheklovchi va turar joyga kirish bilan bog'liq harakatlar faqat Jinoyat-protsessual kodeksida belgilangan tartibda, zarur hollarda sud ruxsati bilan bajariladi. Shaxsga doir ma'lumotlar «Shaxsga doir ma'lumotlar to'g'risida»gi Qonunga muvofiq himoya qilinadi.",
            ru: "Операторы и провайдеры хранят логи подключений ограниченный срок. Действия, ограничивающие тайну связи и связанные с проникновением в жилище, выполняются только в порядке Уголовно-процессуального кодекса, при необходимости — с санкции суда. Персональные данные защищаются согласно Закону «О персональных данных».",
          },
        },
      ],
      task: {
        kind: "order",
        prompt: {
          uz: "Harakatlarni to'g'ri tartibda joylashtiring.",
          ru: "Расположите действия в правильном порядке.",
          en: "Put the actions in the correct order.",
        },
        items: [
          {
            id: "h-preserve",
            text: {
              uz: "Jabrlanuvchi telefonidagi yozishma va SMSlarni mutaxassis ishtirokida bayonnoma bilan ko'zdan kechirib, nusxalash va nazorat summasini (hash) qayd etish",
              ru: "Осмотр переписки и SMS в телефоне потерпевшей с участием специалиста, копирование с протоколом и фиксацией контрольной суммы (хеш)",
              en: "Examine and copy the chat and SMS from the victim's phone with a specialist, under a record, noting the hash",
            },
          },
          {
            id: "h-requests",
            text: {
              uz: "Bank, operator, hosting va provayderga protsessual tartibda rasmiy so'rovlar yuborish (loglar o'chib ketmasidan)",
              ru: "Официальные запросы в банк, оператору, хостингу и провайдеру в процессуальном порядке (пока логи не удалены)",
              en: "Send formal procedural requests to the bank, operator, host and ISP before logs expire",
            },
          },
          {
            id: "h-analyse",
            text: {
              uz: "Javoblarni solishtirib, raqamli izlarni bitta shaxsga bog'lash",
              ru: "Сопоставление ответов и связывание цифровых следов с одним лицом",
              en: "Cross-match the replies and tie the traces to one person",
            },
          },
          {
            id: "h-search",
            text: {
              uz: "Sud ruxsati bilan gumon qilinuvchi yashash joyida tintuv o'tkazish, qurilmalarni olish va muhrlash",
              ru: "Обыск по месту жительства подозреваемого с санкции суда, изъятие и опечатывание устройств",
              en: "Search the suspect's home with court authorisation, seize and seal devices",
            },
          },
          {
            id: "h-expert",
            text: {
              uz: "Olingan qurilmalar bo'yicha kompyuter-texnik ekspertiza tayinlash",
              ru: "Назначение компьютерно-технической экспертизы по изъятым устройствам",
              en: "Order a computer forensics examination of the seized devices",
            },
          },
        ],
        correct: ["h-preserve", "h-requests", "h-analyse", "h-search", "h-expert"],
      },
      competencies: ["kiber.hujjat"],
      consequence: {
        uz: "So'rovlar kechiksa, provayder loglari o'chiriladi; sud ruxsatisiz tintuvda olingan qurilma esa dalil sifatida maqbul bo'lmaydi va butun ish qulashi mumkin.",
        ru: "Опоздание с запросами — логи провайдера удалены; устройство, изъятое при обыске без санкции, недопустимо как доказательство, и дело может развалиться.",
      },
    },

    /* 7 ------------------------------------------------------------------ */
    {
      id: "k7-xulosa",
      title: {
        uz: "Tahliliy ma'lumotnoma",
        ru: "Аналитическая справка",
        en: "Analytical summary",
      },
      brief: {
        uz: "Tergovchi uchun qisqa tahliliy ma'lumotnoma tayyorlang: firibgarlik mexanizmi, zarar, raqamli izlar zanjiri va keyingi harakatlar.",
        ru: "Подготовьте для следователя краткую аналитическую справку: механизм мошенничества, ущерб, цепочка цифровых следов и дальнейшие действия.",
        en: "Write a short analytical summary for the investigator: fraud mechanism, loss, digital trace chain and next steps.",
      },
      materials: [],
      task: {
        kind: "text",
        prompt: {
          uz: "Tahliliy ma'lumotnoma yozing.",
          ru: "Напишите аналитическую справку.",
          en: "Write the analytical summary.",
        },
        rubric: [
          {
            uz: "Firibgarlik mexanizmi aniq tavsiflangan: soxta kuryer, o'xshash domen, CVV va SMS-kodni olish, shoshiltirish.",
            ru: "Чётко описан механизм: фальшивый курьер, похожий домен, получение CVV и SMS-кода, давление срочностью.",
          },
          {
            uz: "Zarar to'g'ri ko'rsatilgan: 7 500 000 so'm; 2 000 000 so'mlik rad etilgan urinish alohida qayd etilgan.",
            ru: "Верно указан ущерб: 7 500 000 сумов; отклонённая попытка на 2 000 000 отмечена отдельно.",
          },
          {
            uz: "Izlar zanjiri keltirilgan: akkaunt → domen → IP 192.0.2.44 → T. Botir shartnomasi → 2291 karta; hamyon — dropper orqali.",
            ru: "Приведена цепочка: аккаунт → домен → IP 192.0.2.44 → договор Т. Ботира → карта 2291; кошелёк — через дроппера.",
          },
          {
            uz: "Keyingi harakatlar qonuniy tartibda: sud ruxsati bilan tintuv, ekspertiza, S. Aliyevning rolini aniqlash; xulosa taxmin va faktni ajratadi.",
            ru: "Дальнейшие действия в законном порядке: обыск с санкции суда, экспертиза, выяснение роли С. Алиева; справка разделяет факты и версии.",
          },
        ],
        minWords: 60,
        model: {
          uz: "14.09 kuni 20:48–21:15 oralig'ida @SavdoMarket_Kuryer (ID 5550193847) akkaunti SavdoMarket kuryeri nomidan yozib, jabrlanuvchiga o'xshash domendagi (savdornarket-pay.example, 12.09 da ro'yxatdan o'tgan) fishing sahifa havolasini yuborgan va shoshiltirib, karta ma'lumotlari, CVV va SMS-kodni olgan. Natijada 7 500 000 so'm yechilgan: 6 250 000 so'm 9860…2291 kartasiga, 1 250 000 so'm Hamyon.example hamyoniga; 2 000 000 so'mlik yana bir urinish limit tufayli rad etilgan. Hosting logiga ko'ra panelga 192.0.2.44 dan kirilgan; provayder bu IP shu vaqtda T. Botir shartnomasiga berilganini, bank esa 2291 karta egasi ham T. Botir ekanini, ikkala manbada bir xil telefon …12 58 ko'rsatilganini tasdiqladi. Hamyon S. Aliyev nomida, u hamyonni ijaraga berganini aytgan — dropper sifatida roli aniqlanishi kerak. Taklif: sud ruxsati bilan T. Botir yashash joyida tintuv, qurilmalarni olish va kompyuter-texnik ekspertiza tayinlash; Telegram akkaunti bilan bog'liqlik qurilma tahlilida tasdiqlanadi.",
          ru: "14.09 с 20:48 до 21:15 аккаунт @SavdoMarket_Kuryer (ID 5550193847) от имени курьера SavdoMarket прислал потерпевшей ссылку на фишинговую страницу на похожем домене (savdornarket-pay.example, зарегистрирован 12.09) и, торопя, получил данные карты, CVV и SMS-код. Списано 7 500 000 сумов: 6 250 000 на карту 9860…2291, 1 250 000 на кошелёк Hamyon.example; ещё одна попытка на 2 000 000 отклонена по лимиту. По логу хостинга вход в панель — с IP 192.0.2.44; провайдер подтвердил, что этот IP в то время выдан по договору Т. Ботира, банк — что держатель карты 2291 тоже Т. Ботир, в обоих источниках один телефон …12 58. Кошелёк оформлен на С. Алиева, который сдал его в аренду — роль дроппера подлежит установлению. Предложение: обыск по месту жительства Т. Ботира с санкции суда, изъятие устройств и компьютерно-техническая экспертиза; связь с Telegram-аккаунтом подтвердить анализом устройств.",
        },
      },
      competencies: ["kiber.hujjat", "kiber.raqamli_iz"],
      consequence: {
        uz: "Tartibsiz ma'lumotnoma asosida tergovchi noto'g'ri shaxsga nisbatan choralar ko'radi yoki muhim so'rovni o'tkazib yuboradi.",
        ru: "По бессистемной справке следователь примет меры не к тому лицу или упустит важный запрос.",
      },
    },
  ],
};
