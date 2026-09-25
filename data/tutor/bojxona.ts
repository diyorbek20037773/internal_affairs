import type { LocalizedText } from "@/data/sops/types";
import type { TutorTopic } from "@/data/kasblar/types";

/**
 * AI-tutor lesson cards — Bojxona (Davlat bojxona qo'mitasi).
 * No article numbers: laws are referenced by NAME only.
 */

const L = (uz: string): LocalizedText => ({ uz });
const ls = (...items: string[]): LocalizedText[] => items.map(L);

const CUSTOMS_CODE = { title: { uz: "O'zbekiston Respublikasi Bojxona kodeksi", ru: "Таможенный кодекс Республики Узбекистан" } };

export const BOJXONA_TOPICS: TutorTopic[] = [
  {
    id: "bj-deklaratsiya",
    agency: "bojxona",
    professions: ["bojxona"],
    title: {
      uz: "Bojxona deklaratsiyasi va bojxona nazorati",
      ru: "Таможенная декларация и таможенный контроль",
      en: "Customs declaration and customs control",
    },
    summary: {
      uz: "Tovarlarni deklaratsiyalash, deklaratsiyani qabul qilish va tekshirish, bojxona nazorati shakllari va tovarlarni chiqarish tartibi.",
      ru: "Декларирование товаров, принятие и проверка декларации, формы таможенного контроля и выпуск товаров.",
      en: "Declaring goods, accepting and checking the declaration, forms of customs control and release of goods.",
    },
    keyPoints: ls(
      "Bojxona chegarasi orqali olib o'tiladigan tovarlar belgilangan tartibda deklaratsiya qilinadi; asosiy shakl — elektron yuk bojxona deklaratsiyasi.",
      "Deklarant tovar haqidagi ma'lumotlarning (nomi, kodi, miqdori, qiymati, kelib chiqishi) to'g'riligi uchun javobgar.",
      "Deklaratsiyaga tijorat hujjatlari ilova qilinadi: shartnoma, invoys, transport hujjatlari, sertifikatlar va ruxsatnomalar.",
      "Bojxona nazorati shakllari: hujjatlarni tekshirish, tovarlarni bojxona ko'zdan kechiruvi va ko'rigi, og'zaki so'rov, tovar va transportni hisobga olish, chiqarilgandan keyingi audit.",
      "Nazorat hajmi xavflarni boshqarish tizimi natijasiga qarab belgilanadi — hamma yukni to'liq ko'rikdan o'tkazish shart emas.",
      "Bojxona ko'rigi deklarant yoki uning vakili ishtirokida o'tkaziladi va dalolatnoma bilan rasmiylashtiriladi.",
      "Bojxona to'lovlari to'langan (yoki ta'minlangan) va shartlar bajarilgandan keyin tovar chiqariladi.",
      "Inspektor deklarantga qonunda nazarda tutilmagan talablar qo'ya olmaydi va hujjatlarni asossiz ushlab turmaydi."
    ),
    steps: ls(
      "Deklaratsiyani elektron tizimda qabul qilish va ro'yxatga olish.",
      "Hujjatlarning to'liqligi va ma'lumotlar mosligini tekshirish.",
      "Xavflarni boshqarish tizimi ko'rsatmasiga ko'ra nazorat shaklini tanlash.",
      "Zarur bo'lsa, bojxona ko'zdan kechiruvi yoki ko'rigini o'tkazish va dalolatnoma tuzish.",
      "Bojxona to'lovlari hisob-kitobini tekshirish.",
      "Tovarni chiqarish yoki asoslantirilgan rad javobini berish."
    ),
    pitfalls: ls(
      "Xavf profili ko'rsatmasini e'tiborsiz qoldirish.",
      "Ko'rikni deklarant ishtirokisiz, dalolatnomasiz o'tkazish.",
      "Qonunda nazarda tutilmagan qo'shimcha hujjat talab qilish.",
      "Invoys va transport hujjatlaridagi og'irlik/miqdor nomuvofiqligini sezmaslik."
    ),
    legalBasis: [CUSTOMS_CODE],
    questions: ls(
      "Deklaratsiyaga qanday asosiy hujjatlar ilova qilinadi?",
      "Bojxona nazoratining qanday shakllarini bilasiz?",
      "Ko'zdan kechiruv va ko'rik o'rtasidagi farq nima?",
      "Invoysda 10 tonna, CMRda 12 tonna yozilgan. Qanday harakat qilasiz?",
      "Nima uchun barcha yuklar to'liq ko'rikdan o'tkazilmaydi?",
      "Tovar qachon chiqarilishi mumkin?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Bojxona ko'rigi kim ishtirokida o'tkaziladi?", ru: "В чьём присутствии проводится таможенный досмотр?" },
        options: [
          { id: "a", text: { uz: "Deklarant yoki uning vakili", ru: "Декларанта или его представителя" }, correct: true },
          { id: "b", text: { uz: "Faqat inspektor yolg'iz", ru: "Только инспектора" }, correct: false },
          { id: "c", text: { uz: "Haydovchining qarindoshlari", ru: "Родственников водителя" }, correct: false },
        ],
        explanation: { uz: "Ko'rik deklarant (vakili) ishtirokida o'tkaziladi va dalolatnoma bilan rasmiylashtiriladi; qonunda belgilangan istisnolar alohida tartibda.", ru: "Досмотр проводится в присутствии декларанта (представителя) и оформляется актом; исключения — в особом порядке." },
      },
      {
        id: "q2",
        question: { uz: "Nazorat hajmini nima belgilaydi?", ru: "Что определяет объём контроля?" },
        options: [
          { id: "a", text: { uz: "Xavflarni boshqarish tizimi", ru: "Система управления рисками" }, correct: true },
          { id: "b", text: { uz: "Inspektorning kayfiyati", ru: "Настроение инспектора" }, correct: false },
        ],
        explanation: { uz: "Nazorat shakli va hajmi xavflarni boshqarish tizimi natijasiga asoslanadi.", ru: "Форма и объём контроля основаны на результатах системы управления рисками." },
      },
    ],
  },
  {
    id: "bj-tasniflash",
    agency: "bojxona",
    professions: ["bojxona", "tahlilchi"],
    title: {
      uz: "Tovarlarni TIF TN bo'yicha tasniflash",
      ru: "Классификация товаров по ТН ВЭД",
      en: "Tariff classification of goods (HS-based)",
    },
    summary: {
      uz: "Tashqi iqtisodiy faoliyat tovar nomenklaturasi tuzilishi, Asosiy talqin qoidalari, tasniflash xatolarining oqibatlari va dastlabki qaror.",
      ru: "Структура ТН ВЭД, Основные правила интерпретации, последствия ошибок классификации и предварительное решение.",
      en: "Structure of the nomenclature, General Interpretative Rules, consequences of misclassification and advance rulings.",
    },
    keyPoints: ls(
      "TIF TN Garmonizatsiyalangan tizim (HS) asosida qurilgan: bo'limlar, guruhlar, tovar pozitsiyalari va subpozitsiyalar; to'liq kod 10 raqamdan iborat.",
      "Birinchi 6 raqam xalqaro HS bilan mos keladi, qolgan raqamlar milliy darajada tafsillashtiradi.",
      "Tasniflash Asosiy talqin qoidalari (1–6) ketma-ketligida amalga oshiriladi; birinchi qoida — pozitsiya matni va bo'lim/guruh izohlari hal qiluvchi.",
      "Bo'lim va guruh nomlari faqat qulaylik uchun; ular huquqiy ahamiyatga ega emas.",
      "To'plam va ko'p komponentli tovarlar asosiy xususiyatni belgilaydigan komponent bo'yicha tasniflanadi.",
      "Kod bojxona to'lovlari stavkasini, cheklovlar va ruxsatnomalarni belgilaydi — xato kod to'lovlar kam undirilishiga yoki taqiqlarning chetlab o'tilishiga olib keladi.",
      "Manfaatdor shaxs tovarni tasniflash bo'yicha dastlabki qaror olishi mumkin.",
      "Inspektor deklarant ko'rsatgan kodni asossiz deb topsa, asoslantirilgan tasniflash qarorini qabul qiladi."
    ),
    steps: ls(
      "Tovarni o'rganish: tarkibi, vazifasi, texnik tavsifi, qadoqlanishi.",
      "Ehtimoliy bo'lim va guruhni aniqlash.",
      "Pozitsiya matni va izohlarni o'qib, Asosiy talqin qoidalarini ketma-ket qo'llash.",
      "Subpozitsiya va milliy darajadagi kodni aniqlash.",
      "Deklaratsiyadagi kod bilan solishtirish.",
      "Nomuvofiqlikda tasniflash qarorini asoslab rasmiylashtirish."
    ),
    pitfalls: ls(
      "Faqat tovar nomiga qarab kod tanlash.",
      "Bo'lim nomini huquqiy asos deb hisoblash.",
      "Qoidalarni ketma-ketliksiz qo'llash (masalan, darhol oxirgi qoidaga o'tish).",
      "Tasniflash qarorini asoslamasdan kodni o'zgartirish."
    ),
    legalBasis: [CUSTOMS_CODE, { title: { uz: "Tashqi iqtisodiy faoliyat tovar nomenklaturasi (TIF TN)" } }],
    questions: ls(
      "TIF TN kodining tuzilishini tushuntiring.",
      "Asosiy talqin qoidalarining birinchisi nimani talab qiladi?",
      "Sovg'a to'plami (atir, krem, sumka) qanday tasniflanadi?",
      "Noto'g'ri kod qanday oqibatlarga olib keladi?",
      "Dastlabki qaror nima va u kimga foydali?",
      "Deklarant kodiga rozi bo'lmasangiz, qanday harakat qilasiz?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Tasniflashda hal qiluvchi nima?", ru: "Что является решающим при классификации?" },
        options: [
          { id: "a", text: { uz: "Pozitsiya matni va bo'lim/guruh izohlari", ru: "Текст товарной позиции и примечания" }, correct: true },
          { id: "b", text: { uz: "Bo'lim nomi", ru: "Название раздела" }, correct: false },
          { id: "c", text: { uz: "Tovarning savdo nomi", ru: "Торговое название товара" }, correct: false },
        ],
        explanation: { uz: "Birinchi qoidaga ko'ra, tasniflash pozitsiya matni va izohlar bilan belgilanadi; nomlar faqat qulaylik uchun.", ru: "По первому правилу классификация определяется текстом позиций и примечаниями; названия — для удобства." },
      },
      {
        id: "q2",
        question: { uz: "TIF TN kodining birinchi 6 raqami...", ru: "Первые 6 знаков кода ТН ВЭД..." },
        options: [
          { id: "a", text: { uz: "Xalqaro Garmonizatsiyalangan tizimga mos", ru: "Соответствуют Гармонизированной системе" }, correct: true },
          { id: "b", text: { uz: "Faqat milliy darajada belgilanadi", ru: "Устанавливаются только на национальном уровне" }, correct: false },
        ],
        explanation: { uz: "Birinchi 6 raqam HS bilan bir xil; keyingi raqamlar milliy tafsillashtirish.", ru: "Первые 6 знаков совпадают с ГС; последующие — национальная детализация." },
      },
    ],
  },
  {
    id: "bj-qiymat-tolovlar",
    agency: "bojxona",
    professions: ["bojxona", "tahlilchi"],
    title: {
      uz: "Bojxona qiymatini aniqlash va bojxona to'lovlari",
      ru: "Определение таможенной стоимости и таможенные платежи",
      en: "Customs valuation and customs payments",
    },
    summary: {
      uz: "Bojxona qiymatini aniqlash usullari va ularni qo'llash ketma-ketligi, qiymatni tuzatish, to'lovlar turlari va hisoblash.",
      ru: "Методы определения таможенной стоимости и порядок их применения, корректировка стоимости, виды платежей и их расчёт.",
      en: "Valuation methods and their sequence, value adjustment, types of payments and calculation.",
    },
    keyPoints: ls(
      "Bojxona qiymati olti usulda aniqlanadi; asosiy usul — olib kiriladigan tovar bo'yicha bitim qiymati usuli.",
      "Usullar qat'iy ketma-ketlikda qo'llaniladi: oldingi usulni qo'llash imkoni bo'lmasagina keyingisiga o'tiladi.",
      "Bitim qiymatiga to'langan narxdan tashqari tashish, sug'urta, yuklash xarajatlari, litsenziya to'lovlari kabi qo'shimchalar qo'shiladi (belgilangan shartlarda).",
      "Qiymat hujjatlar bilan tasdiqlanishi kerak: shartnoma, invoys, to'lov hujjatlari, transport hisob-varaqlari.",
      "Qiymat shubhali bo'lsa, inspektor qo'shimcha hujjat so'raydi; asos bo'lsa qiymatni tuzatish qarorini qabul qiladi.",
      "Bojxona to'lovlari: bojxona boji, QQS, aksiz solig'i (aksizli tovarlarda), bojxona yig'imlari.",
      "Soxta arzonlashtirilgan qiymat (underinvoicing) — to'lovlardan bo'yin tovlashning keng tarqalgan usuli.",
      "Deklarant tuzatish qaroriga shikoyat qilish huquqiga ega; qaror asoslantirilgan bo'lishi shart."
    ),
    steps: ls(
      "Deklaratsiyadagi qiymat va tasdiqlovchi hujjatlarni o'rganish.",
      "Qo'shimcha xarajatlar hisobga olinganini tekshirish.",
      "Narx xavf ma'lumotlari (o'xshash tovarlar narxi) bilan solishtirish.",
      "Shubha bo'lsa — qo'shimcha hujjat so'rash.",
      "Asos bo'lsa, keyingi usulni ketma-ketlikda qo'llab qiymatni tuzatish.",
      "Bojxona to'lovlarini hisoblash va to'lanishini nazorat qilish."
    ),
    pitfalls: ls(
      "Birinchi usulni asossiz rad etib, darhol «zaxira» usuliga o'tish.",
      "Transport va sug'urta xarajatlarini qo'shmaslik.",
      "Qiymatni tuzatish qarorini asoslamaslik.",
      "Aksizli tovarda aksiz solig'ini unutish."
    ),
    legalBasis: [CUSTOMS_CODE, { title: { uz: "O'zbekiston Respublikasi Soliq kodeksi (QQS va aksiz qismida)" } }],
    questions: ls(
      "Bojxona qiymatini aniqlashning asosiy usuli qaysi?",
      "Usullar nima uchun ketma-ket qo'llaniladi?",
      "Bitim qiymatiga qanday xarajatlar qo'shiladi?",
      "Smartfonlar invoysi bozor narxidan 5 barobar arzon. Harakatlaringiz?",
      "Qanday bojxona to'lovlari turlarini bilasiz?",
      "Deklarant tuzatish qaroriga rozi bo'lmasa, nima qila oladi?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Bojxona qiymatining asosiy usuli?", ru: "Основной метод определения таможенной стоимости?" },
        options: [
          { id: "a", text: { uz: "Bitim qiymati usuli", ru: "По стоимости сделки" }, correct: true },
          { id: "b", text: { uz: "Zaxira usuli", ru: "Резервный метод" }, correct: false },
          { id: "c", text: { uz: "Inspektor tanlagan istalgan usul", ru: "Любой метод по выбору инспектора" }, correct: false },
        ],
        explanation: { uz: "Asosiy usul — bitim qiymati; boshqa usullar faqat ketma-ketlikda, oldingisi qo'llanilmasa.", ru: "Основной метод — по стоимости сделки; другие — последовательно, если предыдущий неприменим." },
      },
      {
        id: "q2",
        question: { uz: "Bitim qiymatiga odatda nima qo'shiladi?", ru: "Что обычно добавляется к стоимости сделки?" },
        options: [
          { id: "a", text: { uz: "Chegaragacha tashish va sug'urta xarajatlari", ru: "Расходы на перевозку и страхование до границы" }, correct: true },
          { id: "b", text: { uz: "Inspektor xizmati haqi", ru: "Плата за услуги инспектора" }, correct: false },
        ],
        explanation: { uz: "Belgilangan shartlarda tashish, sug'urta va yuklash xarajatlari bojxona qiymatiga qo'shiladi.", ru: "При установленных условиях расходы на перевозку, страхование и погрузку включаются в стоимость." },
      },
    ],
  },
  {
    id: "bj-xavf-boshqaruv",
    agency: "bojxona",
    professions: ["bojxona", "tahlilchi"],
    title: {
      uz: "Xavflarni boshqarish tizimi",
      ru: "Система управления рисками",
      en: "Risk management system",
    },
    summary: {
      uz: "Xavf profillari, yo'laklar tizimi (yashil, sariq, qizil), selektivlik, natijalarni qayd etish va profillarni yangilash.",
      ru: "Профили рисков, система коридоров (зелёный, жёлтый, красный), селективность, фиксация результатов и обновление профилей.",
      en: "Risk profiles, the channel system (green/yellow/red), selectivity, recording results and updating profiles.",
    },
    keyPoints: ls(
      "Xavflarni boshqarish — cheklangan resurslarni eng xavfli yuklarga yo'naltirib, qonuniy savdoni tezlashtirish usuli.",
      "Xavf profili — xavf belgilari (tovar kodi, mamlakat, jo'natuvchi, narx, marshrut) va ular aniqlanganda ko'riladigan chora.",
      "Yo'laklar: yashil — hujjat nazorati bilan chiqarish; sariq — hujjatlarni chuqur tekshirish; qizil — tovarni ko'rikdan o'tkazish.",
      "Tizim ko'rsatmasini inspektor bekor qilmaydi; undan chetga chiqish faqat belgilangan tartibda va asoslantirilgan holda.",
      "Har bir ko'rik natijasi (qoidabuzarlik topildi/topilmadi) tizimga kiritiladi — bu profillar samaradorligini baholash uchun zarur.",
      "Samarasiz profil yangilanadi yoki bekor qilinadi; yangi sxemalar aniqlanganda yangi profil yaratiladi.",
      "Vijdonli ishtirokchilar (masalan, vakolatli iqtisodiy operator) soddalashtirilgan tartibdan foydalanadi.",
      "Inspektorning subyektiv tanlovi xavf tahlilining o'rnini bosa olmaydi."
    ),
    steps: ls(
      "Deklaratsiya bo'yicha tizim ko'rsatmasini (yo'lak va choralar) olish.",
      "Ko'rsatilgan chorani bajarish: hujjat tekshiruvi yoki ko'rik.",
      "Natijani tizimga aniq va to'liq kiritish.",
      "Yangi xavf belgisi aniqlansa, tahlil bo'linmasiga xabar berish.",
      "Profil samaradorligi tahlilida ishtirok etish.",
      "Profillarni yangilash takliflarini tayyorlash."
    ),
    pitfalls: ls(
      "Qizil yo'lakdagi yukni ko'rikdan o'tkazmay chiqarish.",
      "Ko'rik natijasini tizimga kiritmaslik.",
      "Tanish broker yukini «ishonchli» deb o'zboshimchalik bilan yashil yo'lakka o'tkazish.",
      "Yangi kontrabanda sxemasini aniqlab, uni tahlil bo'linmasiga yetkazmaslik."
    ),
    legalBasis: [CUSTOMS_CODE],
    questions: ls(
      "Xavflarni boshqarish tizimi nima uchun kerak?",
      "Xavf profili qanday elementlardan iborat?",
      "Yashil, sariq va qizil yo'laklar farqini tushuntiring.",
      "Qizil yo'lakdagi yukda hech narsa topilmadi. Buni tizimga kiritish nega muhim?",
      "Bir xil jo'natuvchidan kelgan yuklarda uch marta yashirin tovar topildi. Nima taklif qilasiz?",
      "Inspektor tizim ko'rsatmasidan chetga chiqa oladimi?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Qizil yo'lak nimani anglatadi?", ru: "Что означает красный коридор?" },
        options: [
          { id: "a", text: { uz: "Tovarni ko'rikdan o'tkazish", ru: "Досмотр товара" }, correct: true },
          { id: "b", text: { uz: "Nazoratsiz chiqarish", ru: "Выпуск без контроля" }, correct: false },
          { id: "c", text: { uz: "Faqat to'lovni tekshirish", ru: "Только проверку платежей" }, correct: false },
        ],
        explanation: { uz: "Qizil yo'lak — tovarni fizik ko'rikdan o'tkazish talab etiladi.", ru: "Красный коридор — требуется физический досмотр товара." },
      },
      {
        id: "q2",
        question: { uz: "Ko'rikda qoidabuzarlik topilmasa, natija...", ru: "Если нарушение не выявлено, результат..." },
        options: [
          { id: "a", text: { uz: "Baribir tizimga kiritiladi", ru: "Всё равно вносится в систему" }, correct: true },
          { id: "b", text: { uz: "Kiritilmaydi, chunki muhim emas", ru: "Не вносится — неважно" }, correct: false },
        ],
        explanation: { uz: "Salbiy natija ham profil samaradorligini baholash uchun zarur ma'lumot.", ru: "Отрицательный результат тоже нужен для оценки эффективности профиля." },
      },
    ],
  },
  {
    id: "bj-kontrabanda",
    agency: "bojxona",
    professions: ["bojxona", "surishtiruvchi"],
    title: {
      uz: "Kontrabandani aniqlash va bayonnoma rasmiylashtirish",
      ru: "Выявление контрабанды и оформление протокола",
      en: "Detecting smuggling and drafting the record",
    },
    summary: {
      uz: "Yashirish belgilari, ko'rik va shaxsiy ko'rik, tovarni olib qo'yish, bojxona qoidabuzarligini jinoyatdan farqlash va hujjatlashtirish.",
      ru: "Признаки сокрытия, досмотр и личный досмотр, изъятие товара, разграничение нарушения таможенных правил и преступления, документирование.",
      en: "Signs of concealment, inspection and personal search, seizure, distinguishing a customs offence from a crime, documentation.",
    },
    keyPoints: ls(
      "Yashirish belgilari: transport konstruksiyasidagi o'zgarishlar, og'irlik nomuvofiqligi, yangi payvand yoki bo'yoq, noodatiy xulq, hujjatlardagi qarama-qarshiliklar.",
      "Ko'rik texnik vositalar (rentgen, endoskop, xizmat iti) bilan va xolis ishtirokida olib boriladi; natija dalolatnoma bilan rasmiylashtiriladi.",
      "Shaxsiy ko'rik — nazoratning favqulodda shakli: faqat yetarli asos bo'lganda, rahbar qarori bilan, bir jinsli xodim tomonidan, alohida xonada o'tkaziladi.",
      "Aniqlangan tovar, hujjatlar va yashirish vositalari olinadi, qadoqlanadi, muhrlanadi va ro'yxatga olinadi.",
      "Bojxona qoidalarini buzish ma'muriy javobgarlikka, kontrabanda (qiymat yoki tovar turi bo'yicha belgilangan mezonlarda) jinoiy javobgarlikka sabab bo'ladi.",
      "Taqiqlangan yoki alohida xavfli tovarlar (giyohvand vositalar, qurol va boshqalar) aniqlansa, tegishli tergov organiga zudlik bilan xabar beriladi.",
      "Bayonnomada holat, joy, vaqt, usul, olingan narsalar va ishtirokchilar aniq ko'rsatiladi; shaxsga huquqlari tushuntiriladi.",
      "Dalillar saqlash zanjiri uzilmasligi kerak."
    ),
    steps: ls(
      "Xavf belgilarini aniqlash va rahbarga bildirish.",
      "Ko'rikni texnik vositalar va xolislar ishtirokida o'tkazish.",
      "Zarur bo'lsa, belgilangan tartibda shaxsiy ko'rik o'tkazish.",
      "Tovarni olish, qadoqlash, muhrlash, ro'yxatga olish.",
      "Holatni ma'muriy yoki jinoiy deb dastlabki baholash, zarur bo'lsa tergov organini xabardor qilish.",
      "Bayonnoma va dalolatnomalarni rasmiylashtirish, huquqlarni tushuntirish."
    ),
    pitfalls: ls(
      "Shaxsiy ko'rikni asossiz yoki boshqa jinsdagi xodim tomonidan o'tkazish.",
      "Olingan tovarni muhrlamaslik va ro'yxatga olmaslik.",
      "Jinoiy tarkib belgilarini sezmasdan ishni ma'muriy tartibda yopish.",
      "Xolislarsiz ko'rik — dalillar sudda shubha ostida qoladi."
    ),
    legalBasis: [
      CUSTOMS_CODE,
      { title: { uz: "Ma'muriy javobgarlik to'g'risidagi kodeks (bojxona qoidalarini buzish)" } },
      { title: { uz: "Jinoyat kodeksi (kontrabanda)" } },
    ],
    questions: ls(
      "Transport vositasida yashirin joy borligini qanday belgilardan bilasiz?",
      "Shaxsiy ko'rik qanday shartlarda o'tkaziladi?",
      "Yoqilg'i bakida sigaret qutilari topildi. Harakatlaringiz ketma-ketligi?",
      "Bojxona qoidabuzarligini kontrabandadan qanday farqlaysiz?",
      "Giyohvand modda aniqlansa, kimni xabardor qilasiz?",
      "Bayonnomaga nimalarni yozasiz?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Shaxsiy ko'rikni kim o'tkazadi?", ru: "Кто проводит личный досмотр?" },
        options: [
          { id: "a", text: { uz: "Ko'rik qilinayotgan shaxs bilan bir jinsdagi xodim", ru: "Сотрудник того же пола" }, correct: true },
          { id: "b", text: { uz: "Smenadagi istalgan xodim", ru: "Любой сотрудник смены" }, correct: false },
        ],
        explanation: { uz: "Shaxsiy ko'rik bir jinsdagi xodim tomonidan, alohida xonada va rahbar qarori bilan o'tkaziladi.", ru: "Личный досмотр проводит сотрудник того же пола, в отдельном помещении, по решению руководителя." },
      },
      {
        id: "q2",
        question: { uz: "Olingan tovar bilan nima qilinadi?", ru: "Что делают с изъятым товаром?" },
        options: [
          { id: "a", text: { uz: "Qadoqlanadi, muhrlanadi, ro'yxatga olinadi", ru: "Упаковывают, опечатывают, вносят в опись" }, correct: true },
          { id: "b", text: { uz: "Post omboriga shunchaki qo'yiladi", ru: "Просто кладут на склад поста" }, correct: false },
        ],
        explanation: { uz: "Dalillar saqlash zanjiri uchun olingan narsalar qadoqlanadi, muhrlanadi va ro'yxatga olinadi.", ru: "Для цепочки хранения доказательств изъятое упаковывают, опечатывают и вносят в опись." },
      },
    ],
  },
  {
    id: "bj-jismoniy-shaxslar",
    agency: "bojxona",
    professions: ["bojxona"],
    title: {
      uz: "Jismoniy shaxslar tomonidan tovarlarni olib o'tish",
      ru: "Перемещение товаров физическими лицами",
      en: "Goods carried by individuals",
    },
    summary: {
      uz: "Aeroport va chegara postlarida yo'lovchilarni rasmiylashtirish: shaxsiy foydalanish uchun tovarlar, imtiyozli me'yorlar, valyutani deklaratsiyalash, ikki yo'lak tizimi.",
      ru: "Оформление пассажиров в аэропорту и на погранпостах: товары для личного пользования, льготные нормы, декларирование валюты, система двух коридоров.",
      en: "Processing travellers at airports and border posts: personal-use goods, duty-free allowances, currency declaration, the two-channel system.",
    },
    keyPoints: ls(
      "Jismoniy shaxslar shaxsiy, oilaviy foydalanish uchun tovarlarni soddalashtirilgan tartibda olib o'tadi.",
      "Tovar shaxsiy foydalanish uchunmi yoki tijoratmi — miqdori, bir xilligi, qadoqlanishi va safarlar chastotasiga qarab baholanadi.",
      "Bojsiz olib kirish me'yorlari (qiymat va og'irlik bo'yicha) amaldagi hukumat qarorlari bilan belgilanadi; me'yordan ortig'iga to'lovlar undiriladi.",
      "Belgilangan miqdordan ortiq naqd valyuta majburiy yozma deklaratsiya qilinadi.",
      "Ikki yo'lak tizimi: yashil — deklaratsiya qilinadigan tovar yo'q; qizil — deklaratsiya qilinadigan tovar bor.",
      "Yashil yo'lakni tanlagan yo'lovchi ham tanlab nazoratdan o'tkazilishi mumkin.",
      "Taqiqlangan va cheklangan tovarlar (dori-darmonlarning ayrim turlari, qurol, madaniy boyliklar) uchun alohida ruxsatnoma talab etiladi.",
      "Yo'lovchi bilan muloqot xushmuomala va tushunarli bo'ladi; qoidalarni tushuntirish — xizmatning bir qismi."
    ),
    steps: ls(
      "Yo'lovchini kuzatish va yo'lak tanlovini qayd etish.",
      "Og'zaki so'rov: nima olib kelyapsiz, kimga, qancha valyuta bor.",
      "Zarur bo'lsa, yozma deklaratsiya to'ldirishni taklif qilish.",
      "Bagajni texnik vositalar yoki ko'rik orqali tekshirish.",
      "Me'yordan ortiq tovarga to'lovlarni hisoblash yoki ruxsatnomani talab qilish.",
      "Qoidabuzarlik bo'lsa, bayonnoma rasmiylashtirish."
    ),
    pitfalls: ls(
      "Me'yorlarni yoddan, eskirgan qiymatlar bilan aytish.",
      "Yo'lovchiga qoidalarni tushuntirmasdan darhol jazolash.",
      "Tijorat partiyasini «shaxsiy buyum» sifatida o'tkazib yuborish.",
      "Valyuta deklaratsiyasi majburiyatini ogohlantirmaslik."
    ),
    legalBasis: [CUSTOMS_CODE, { title: { uz: "Jismoniy shaxslar tomonidan tovarlarni olib o'tish tartibi to'g'risidagi Vazirlar Mahkamasi qarori" } }],
    questions: ls(
      "Tovar shaxsiy foydalanish uchunmi yoki tijoratmi — qanday aniqlaysiz?",
      "Ikki yo'lak tizimini yo'lovchiga qanday tushuntirasiz?",
      "Yo'lovchida 20 ta bir xil telefon bor. Harakatingiz?",
      "Valyutani deklaratsiya qilish majburiyati haqida nima bilasiz?",
      "Yashil yo'lakdagi yo'lovchini tekshirish mumkinmi?",
      "Nega me'yorlarni doim amaldagi qarordan tekshirish kerak?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Yashil yo'lak nimani bildiradi?", ru: "Что означает зелёный коридор?" },
        options: [
          { id: "a", text: { uz: "Deklaratsiya qilinadigan tovar yo'q", ru: "Нет товаров для декларирования" }, correct: true },
          { id: "b", text: { uz: "Yo'lovchi hech qachon tekshirilmaydi", ru: "Пассажир никогда не проверяется" }, correct: false },
        ],
        explanation: { uz: "Yashil yo'lak — deklaratsiya qilinadigan tovar yo'qligini bildiradi, ammo tanlab nazorat baribir mumkin.", ru: "Зелёный коридор — нет товаров к декларированию, но выборочный контроль возможен." },
      },
      {
        id: "q2",
        question: { uz: "Tijorat partiyasi belgisi qaysi?", ru: "Признак коммерческой партии?" },
        options: [
          { id: "a", text: { uz: "Ko'p miqdordagi bir xil tovar", ru: "Большое количество однородного товара" }, correct: true },
          { id: "b", text: { uz: "Bitta sovg'a", ru: "Один подарок" }, correct: false },
        ],
        explanation: { uz: "Miqdor, bir xillik va qadoqlanish tovarning tijorat maqsadidaligini ko'rsatadi.", ru: "Количество, однородность и упаковка указывают на коммерческое назначение." },
      },
    ],
  },
];
