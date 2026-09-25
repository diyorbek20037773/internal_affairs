import type { LocalizedText } from "@/data/sops/types";
import type { TutorTopic } from "@/data/kasblar/types";

/**
 * AI-tutor lesson cards — Favqulodda vaziyatlar vazirligi (FVV).
 * No article numbers: laws are referenced by NAME only.
 */

const L = (uz: string): LocalizedText => ({ uz });
const ls = (...items: string[]): LocalizedText[] => items.map(L);

const LAW_ES = {
  title: {
    uz: "«Aholini va hududlarni tabiiy va texnogen xususiyatli favqulodda vaziyatlardan muhofaza qilish to'g'risida»gi Qonun",
    ru: "Закон «О защите населения и территорий от чрезвычайных ситуаций природного и техногенного характера»",
  },
};
const LAW_FIRE = { title: { uz: "«Yong'in xavfsizligi to'g'risida»gi Qonun", ru: "Закон «О пожарной безопасности»" } };

export const FVV_TOPICS: TutorTopic[] = [
  {
    id: "fvv-xabar-dastlabki",
    agency: "fvv",
    professions: ["qutqaruvchi"],
    title: {
      uz: "Favqulodda vaziyat haqida xabar va dastlabki harakatlar",
      ru: "Сообщение о ЧС и первоначальные действия",
      en: "Emergency call and initial actions",
    },
    summary: {
      uz: "Chaqiruvni qabul qilish, ma'lumot yig'ish, kuchlarni jo'natish, joyga yetib kelgach razvedka va vaziyatni baholash.",
      ru: "Приём вызова, сбор информации, высылка сил, разведка и оценка обстановки по прибытии.",
      en: "Taking the call, gathering information, dispatching resources, reconnaissance and size-up on arrival.",
    },
    keyPoints: ls(
      "Chaqiruv qabul qilinganda asosiy ma'lumotlar olinadi: nima sodir bo'ldi, aniq manzil, odamlar xavf ostidami, qurbonlar bormi, xabar beruvchining raqami.",
      "Dispetcher chaqiruvchini tinchlantiradi va yordam kelguncha xavfsiz harakatlar bo'yicha qisqa ko'rsatma beradi.",
      "Kuchlar va vositalar chaqiruv toifasi va jadvaliga ko'ra zudlik bilan jo'natiladi; tegishli xizmatlar (tez yordam, IIV, gaz xizmati) xabardor qilinadi.",
      "Joyga yetib kelgan birinchi rahbar razvedka o'tkazadi: odamlar hayotiga xavf, tarqalish yo'nalishi, xavfli moddalar, kirish yo'llari.",
      "Asosiy qaror yo'nalishi aniqlanadi — birinchi navbatda odamlarni qutqarish.",
      "Qutqaruvchilar xavfsizligi: himoya vositalari, xavfli zonaga kirish-chiqishni hisobga olish.",
      "Vaziyat haqida yuqori boshqaruvga birinchi hisobot tezkor beriladi, keyin muntazam yangilanadi.",
      "Qo'shimcha kuch kerakligi erta aniqlanadi — kechikkan so'rov vaziyatni og'irlashtiradi."
    ),
    steps: ls(
      "Chaqiruvni qabul qilish va asosiy ma'lumotlarni aniqlash.",
      "Kuchlarni jo'natish va hamkor xizmatlarni xabardor qilish.",
      "Yo'lda qo'shimcha ma'lumot olish.",
      "Joyga yetib kelib razvedka va vaziyatni baholash.",
      "Asosiy yo'nalishni belgilash, kuchlarni joylashtirish.",
      "Birinchi hisobotni berish va zarur bo'lsa qo'shimcha kuch so'rash."
    ),
    pitfalls: ls(
      "Aniq manzilni so'ramasdan chaqiruvni tugatish.",
      "Razvedkasiz binoga kirish.",
      "Odamlarni qutqarish o'rniga mulkni saqlashga e'tibor qaratish.",
      "Qo'shimcha kuchni kech so'rash."
    ),
    legalBasis: [LAW_ES, LAW_FIRE],
    questions: ls(
      "Chaqiruvni qabul qilganda qaysi ma'lumotlarni albatta aniqlaysiz?",
      "Chaqiruvchi vahimada. Uni qanday tinchlantirasiz va nima deysiz?",
      "Joyga birinchi yetib keldingiz. Razvedkada nimalarni aniqlaysiz?",
      "Asosiy qaror yo'nalishi nima va uni qanday tanlaysiz?",
      "Qaysi hamkor xizmatlarni xabardor qilasiz?",
      "Birinchi hisobotda nimalar bo'lishi kerak?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Favqulodda vaziyatdagi birinchi ustuvor vazifa?", ru: "Первоочередная задача при ЧС?" },
        options: [
          { id: "a", text: { uz: "Odamlarni qutqarish", ru: "Спасение людей" }, correct: true },
          { id: "b", text: { uz: "Mulkni saqlash", ru: "Сохранение имущества" }, correct: false },
          { id: "c", text: { uz: "Sababni aniqlash", ru: "Установление причины" }, correct: false },
        ],
        explanation: { uz: "Odamlar hayotiga xavf bo'lsa, barcha kuchlar avvalo qutqarishga yo'naltiriladi.", ru: "При угрозе жизни все силы направляются прежде всего на спасение людей." },
      },
      {
        id: "q2",
        question: { uz: "Chaqiruvda eng muhim ma'lumotlardan biri?", ru: "Одна из важнейших сведений при вызове?" },
        options: [
          { id: "a", text: { uz: "Aniq manzil", ru: "Точный адрес" }, correct: true },
          { id: "b", text: { uz: "Chaqiruvchining kasbi", ru: "Профессия звонящего" }, correct: false },
        ],
        explanation: { uz: "Aniq manzilsiz kuchlar vaqtida yetib bora olmaydi.", ru: "Без точного адреса силы не прибудут вовремя." },
      },
    ],
  },
  {
    id: "fvv-evakuatsiya",
    agency: "fvv",
    professions: ["qutqaruvchi", "gvardiyachi"],
    title: {
      uz: "Evakuatsiyani tashkil etish",
      ru: "Организация эвакуации",
      en: "Organising evacuation",
    },
    summary: {
      uz: "Evakuatsiya to'g'risida qaror, aholini xabardor qilish, yo'nalishlar va yig'ilish punktlari, zaif toifalarga yordam, hisobga olish.",
      ru: "Решение об эвакуации, оповещение населения, маршруты и пункты сбора, помощь уязвимым группам, учёт эвакуированных.",
      en: "Evacuation decision, public warning, routes and assembly points, help for vulnerable groups, accountability.",
    },
    keyPoints: ls(
      "Evakuatsiya — odamlarni xavfli zonadan xavfsiz hududga tashkiliy ravishda olib chiqish; qaror vakolatli rahbar yoki komissiya tomonidan qabul qilinadi.",
      "Aholini xabardor qilish tizimi (sirenalar, radio, televideniye, SMS, ovoz kuchaytirgichlar) orqali aniq va qisqa ko'rsatma beriladi.",
      "Evakuatsiya yo'nalishlari xavf manbaidan uzoqlashadigan va tiqilinch bo'lmaydigan qilib tanlanadi.",
      "Yig'ilish va qabul punktlarida evakuatsiya qilinganlar ro'yxatga olinadi — kim chiqqani va kim qolgani aniq bo'lishi kerak.",
      "Zaif toifalar (bolalar, keksalar, nogironligi bor shaxslar, bemorlar) uchun alohida yordam va transport ajratiladi.",
      "Binolardan evakuatsiyada lift ishlatilmaydi (yong'inda), eshiklar yopib chiqiladi, zinapoyalar bo'sh saqlanadi.",
      "Vahimaning oldini olish — rahbarlarning xotirjam, aniq buyruqlari va ma'lumot berish orqali.",
      "Evakuatsiya qilingan hudud qo'riqlanadi va qaytish faqat xavf bartaraf etilgach ruxsat etiladi."
    ),
    steps: ls(
      "Xavfni baholash va evakuatsiya haqida qaror qabul qilish.",
      "Aholini xabardor qilish va ko'rsatma berish.",
      "Yo'nalishlar, transport va yig'ilish punktlarini belgilash.",
      "Zaif toifalarga yordamni tashkil etish.",
      "Evakuatsiya qilinganlarni ro'yxatga olish va qolganlarni aniqlash.",
      "Hududni qo'riqlashni tashkil etish va qaytish tartibini belgilash."
    ),
    pitfalls: ls(
      "Hisobga olishsiz evakuatsiya — kim binoda qolgani noma'lum.",
      "Yong'inda liftdan foydalanish.",
      "Zaif toifalarni unutib qo'yish.",
      "Noaniq yoki qarama-qarshi ko'rsatmalar berib vahima uyg'otish."
    ),
    legalBasis: [LAW_ES],
    questions: ls(
      "Evakuatsiya haqida kim qaror qabul qiladi?",
      "Aholini xabardor qilishda qanday so'zlarni ishlatasiz? Namuna ayting.",
      "Evakuatsiya yo'nalishini tanlashda nimalarni hisobga olasiz?",
      "Yig'ilish punktida ro'yxatga olish nega muhim?",
      "Ko'p qavatli uyda yotoqda yotgan bemor bor. Qanday yordam tashkil qilasiz?",
      "Fuqarolar uylariga qaytishni talab qilmoqda. Nima deysiz?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Yong'inda binodan evakuatsiyada...", ru: "При эвакуации из здания при пожаре..." },
        options: [
          { id: "a", text: { uz: "Lift ishlatilmaydi", ru: "Лифт не используется" }, correct: true },
          { id: "b", text: { uz: "Lift eng tez yo'l", ru: "Лифт — самый быстрый путь" }, correct: false },
        ],
        explanation: { uz: "Yong'inda lift to'xtab qolishi va shaxta tutunga to'lishi mumkin — zinapoyadan foydalaniladi.", ru: "При пожаре лифт может остановиться, а шахта задымиться — используется лестница." },
      },
      {
        id: "q2",
        question: { uz: "Yig'ilish punktida asosiy vazifa?", ru: "Главная задача на пункте сбора?" },
        options: [
          { id: "a", text: { uz: "Evakuatsiya qilinganlarni ro'yxatga olish", ru: "Учёт эвакуированных" }, correct: true },
          { id: "b", text: { uz: "Jurnalistlarga intervyu berish", ru: "Интервью журналистам" }, correct: false },
        ],
        explanation: { uz: "Ro'yxat orqali kim xavfsiz, kim hali xavf zonasida qolgani aniqlanadi.", ru: "Учёт показывает, кто в безопасности, а кто ещё остался в опасной зоне." },
      },
    ],
  },
  {
    id: "fvv-yongin-tekshiruv",
    agency: "fvv",
    professions: ["qutqaruvchi"],
    title: {
      uz: "Yong'in xavfsizligi tekshiruvi",
      ru: "Проверка пожарной безопасности",
      en: "Fire safety inspection",
    },
    summary: {
      uz: "Obyektda yong'in xavfsizligi talablarini tekshirish: evakuatsiya yo'llari, o'chirish vositalari, signalizatsiya, elektr xo'jaligi, hujjatlashtirish va ko'rsatma berish.",
      ru: "Проверка требований пожарной безопасности на объекте: пути эвакуации, средства тушения, сигнализация, электрохозяйство, документирование и предписание.",
      en: "Checking fire safety on a site: escape routes, extinguishing means, alarms, electrical systems, documentation and orders.",
    },
    keyPoints: ls(
      "Tekshiruv qonunda belgilangan asos va tartibda o'tkaziladi; tadbirkorlik subyektlarini tekshirish maxsus tartib bilan tartibga solinadi.",
      "Evakuatsiya yo'llari va chiqishlari bo'sh, belgilangan, yoritilgan va ichkaridan kalitsiz ochiladigan bo'lishi kerak.",
      "Birlamchi o'chirish vositalari (o't o'chirgichlar) soz, muddati o'tmagan va yetib olinadigan joyda turishi tekshiriladi.",
      "Avtomatik yong'in signalizatsiyasi va ogohlantirish tizimi ishlashi amalda sinab ko'riladi.",
      "Elektr xo'jaligi: ochiq simlar, ortiqcha yuklangan uzaytirgichlar, uy qurilishi saqlagichlar — asosiy yong'in sabablaridan.",
      "Xodimlarning yong'in xavfsizligi bo'yicha instruktajdan o'tgani va evakuatsiya rejasi mavjudligi tekshiriladi.",
      "Aniqlangan buzilishlar bo'yicha muddatli ko'rsatma (yozma talab) beriladi; odamlar hayotiga bevosita xavf bo'lsa, ishni to'xtatish choralari qonunda belgilangan tartibda ko'riladi.",
      "Tekshiruv natijasi dalolatnoma bilan rasmiylashtiriladi va obyekt rahbari tanishtiriladi."
    ),
    steps: ls(
      "Tekshiruv asosini va vakolat hujjatini tayyorlash, rahbarga taqdim etish.",
      "Hujjatlarni ko'rish: yo'riqnomalar, instruktaj jurnali, evakuatsiya rejasi.",
      "Evakuatsiya yo'llari va chiqishlarni tekshirish.",
      "O'chirish vositalari va signalizatsiyani tekshirish.",
      "Elektr xo'jaligi va yonuvchi materiallar saqlanishini tekshirish.",
      "Dalolatnoma va ko'rsatmani rasmiylashtirish, rahbarni tanishtirish."
    ),
    pitfalls: ls(
      "Faqat hujjatlarni ko'rib, obyektni amalda aylanmaslik.",
      "Signalizatsiyani sinab ko'rmaslik.",
      "Ko'rsatmada aniq muddat va talabni ko'rsatmaslik.",
      "Qulflangan zaxira chiqishni «kechasi ochamiz» degan va'daga ishonish."
    ),
    legalBasis: [LAW_FIRE],
    questions: ls(
      "Tekshiruvni qanday boshlaysiz va rahbarga nimani taqdim etasiz?",
      "Evakuatsiya chiqishiga qanday talablar qo'yiladi?",
      "O't o'chirgichni tekshirishda nimalarga qaraysiz?",
      "Zaxira chiqish qulflangan va ustiga yashiklar qo'yilgan. Harakatingiz?",
      "Elektr xo'jaligida qanday belgilarni xavfli deb hisoblaysiz?",
      "Ko'rsatma qanday bo'lishi kerak?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Evakuatsiya chiqishi...", ru: "Эвакуационный выход..." },
        options: [
          { id: "a", text: { uz: "Bo'sh va ichkaridan kalitsiz ochiladigan bo'lishi kerak", ru: "Должен быть свободен и открываться изнутри без ключа" }, correct: true },
          { id: "b", text: { uz: "O'g'rilikdan saqlash uchun qulflanadi", ru: "Запирается от краж" }, correct: false },
        ],
        explanation: { uz: "Evakuatsiya chiqishlari doim bo'sh bo'lishi va ichkaridan kalitsiz ochilishi shart.", ru: "Эвакуационные выходы всегда свободны и открываются изнутри без ключа." },
      },
      {
        id: "q2",
        question: { uz: "Signalizatsiya qanday tekshiriladi?", ru: "Как проверяется сигнализация?" },
        options: [
          { id: "a", text: { uz: "Amalda sinab ko'riladi", ru: "Практическим испытанием" }, correct: true },
          { id: "b", text: { uz: "Faqat pasportiga qaraladi", ru: "Только по паспорту" }, correct: false },
        ],
        explanation: { uz: "Tizim ishlashi amalda sinab ko'riladi — hujjat tizim ishlashini kafolatlamaydi.", ru: "Работоспособность проверяется на практике — документ не гарантирует работу системы." },
      },
    ],
  },
  {
    id: "fvv-qidiruv-qutqaruv",
    agency: "fvv",
    professions: ["qutqaruvchi"],
    title: {
      uz: "Qidiruv-qutqaruv ishlarida boshqaruv",
      ru: "Управление поисково-спасательными работами",
      en: "Managing search and rescue operations",
    },
    summary: {
      uz: "Operatsiya shtabi, sektorlarga bo'lish, vazifalarni taqsimlash, xavfsizlik nazorati, aloqa va smena almashinuvi.",
      ru: "Оперативный штаб, разбивка на секторы, распределение задач, контроль безопасности, связь и смена составов.",
      en: "Operations HQ, sectors, tasking, safety control, communications and crew rotation.",
    },
    keyPoints: ls(
      "Yagona boshqaruv: operatsiya rahbari tayinlanadi va shtab tuziladi; har bir guruh faqat bitta rahbardan buyruq oladi.",
      "Hudud sektorlarga bo'linadi, har bir sektorga mas'ul va aniq vazifa belgilanadi.",
      "Qidiruv usullari: vizual va tovush orqali qidirish, xizmat itlari, texnik vositalar (termovizor, akustik asboblar).",
      "Vayronalar ostidan qutqarishda konstruksiyalarni mustahkamlash va ikkilamchi qulashning oldini olish birinchi o'rinda.",
      "Xavfsizlik bo'yicha mas'ul shaxs tayinlanadi; u xavf tug'ilganda ishni to'xtatish huquqiga ega.",
      "Aloqa yagona tartibda: chaqiruv belgilari, muntazam hisobotlar, favqulodda signallar.",
      "Qutqaruvchilar charchoqdan himoya qilinadi: smenalar almashinuvi, dam olish va suv ta'minoti.",
      "Har bir topilgan jabrlanuvchining joyi va holati qayd etiladi, tibbiy xizmatga topshiriladi."
    ),
    steps: ls(
      "Shtab tuzish, operatsiya rahbari va xavfsizlik mas'ulini tayinlash.",
      "Razvedka va hududni sektorlarga bo'lish.",
      "Guruhlarga vazifa berish va aloqa tartibini belgilash.",
      "Qidiruv va qutqaruvni xavfsizlik nazorati ostida olib borish.",
      "Jabrlanuvchilarni tibbiy xizmatga topshirish va qayd etish.",
      "Smenalarni almashtirish, operatsiya yakunida debrifing."
    ),
    pitfalls: ls(
      "Bir guruhga ikki rahbardan qarama-qarshi buyruqlar.",
      "Konstruksiyani mustahkamlamasdan vayrona ostiga kirish.",
      "Qutqaruvchilarni almashtirmasdan charchoqqa olib kelish.",
      "Qidirilgan sektorlarni belgilamaslik — takroriy yoki tashlab ketilgan hududlar."
    ),
    legalBasis: [LAW_ES],
    questions: ls(
      "Yagona boshqaruv tamoyilini qidiruv-qutqaruv ishida qanday qo'llaysiz?",
      "Hududni sektorlarga qanday bo'lasiz?",
      "Vayrona ostidan ovoz eshitildi. Qutqaruvni boshlashdan oldin nima qilasiz?",
      "Xavfsizlik mas'uli qanday vakolatga ega?",
      "Qidiruv usullarini sanab bering. Qaysi biri qachon samarali?",
      "Nega smena almashinuvi zarur?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Vayrona ostidan qutqarishda birinchi xavfsizlik chorasi?", ru: "Первая мера безопасности при спасении из-под завала?" },
        options: [
          { id: "a", text: { uz: "Konstruksiyalarni mustahkamlash", ru: "Укрепление конструкций" }, correct: true },
          { id: "b", text: { uz: "Tezroq qo'l bilan qazish", ru: "Быстрее копать руками" }, correct: false },
        ],
        explanation: { uz: "Ikkilamchi qulash qutqaruvchilar va jabrlanuvchi uchun xavfli — avval mustahkamlash.", ru: "Вторичное обрушение опасно для всех — сначала укрепление." },
      },
      {
        id: "q2",
        question: { uz: "Guruh nechta rahbardan buyruq oladi?", ru: "Сколько руководителей отдают приказы группе?" },
        options: [
          { id: "a", text: { uz: "Bittadan", ru: "Один" }, correct: true },
          { id: "b", text: { uz: "Kim birinchi aytsa", ru: "Кто первый скажет" }, correct: false },
        ],
        explanation: { uz: "Yagona boshqaruv: har bir guruh bitta rahbarga bo'ysunadi.", ru: "Единоначалие: каждая группа подчиняется одному руководителю." },
      },
    ],
  },
  {
    id: "fvv-birinchi-yordam",
    agency: "fvv",
    professions: ["qutqaruvchi", "gvardiyachi", "profilaktika"],
    title: {
      uz: "Birinchi yordam va jabrlanuvchilarni saralash (triaj)",
      ru: "Первая помощь и сортировка пострадавших (триаж)",
      en: "First aid and casualty triage",
    },
    summary: {
      uz: "Voqea joyida xavfsizlik, jabrlanuvchini baholash, qon ketishni to'xtatish, yurak-o'pka reanimatsiyasi va ko'p qurbonli hodisada triaj.",
      ru: "Безопасность на месте, оценка пострадавшего, остановка кровотечения, СЛР и сортировка при массовых поражениях.",
      en: "Scene safety, casualty assessment, bleeding control, CPR and triage at mass-casualty incidents.",
    },
    keyPoints: ls(
      "Birinchi qoida — o'z xavfsizligingiz: xavfli muhitda jabrlanuvchiga yaqinlashishdan oldin xavfni bartaraf eting.",
      "Baholash tartibi: hushi joyidami, nafas olayaptimi, kuchli qon ketish bormi.",
      "Kuchli tashqi qon ketish to'g'ridan-to'g'ri bosim bilan, zarur bo'lsa jgut bilan to'xtatiladi; jgut qo'yilgan vaqt yozib qo'yiladi.",
      "Nafas bo'lmasa, yurak-o'pka reanimatsiyasi boshlanadi: ko'krak qafasiga 30 ta bosish va 2 ta nafas (kattalarda), bosish tezligi daqiqasiga taxminan 100–120 marta.",
      "Hushsiz, lekin nafas oluvchi jabrlanuvchi barqaror yon holatga yotqiziladi (umurtqa jarohati shubhasi bo'lmasa).",
      "Ko'p qurbonli hodisada triaj: qizil — zudlik bilan yordam, sariq — kechiktirilishi mumkin, yashil — yurib yuruvchi yengil jarohatlanganlar, qora — hayot belgilari yo'q.",
      "Triaj qisqa va takroriy jarayon: holat o'zgarsa, toifa ham o'zgartiriladi.",
      "Tez yordam (103) yoki yagona xizmatga (112) zudlik bilan xabar beriladi, jabrlanuvchi holati va ko'rsatilgan yordam haqida ma'lumot topshiriladi."
    ),
    steps: ls(
      "Voqea joyi xavfsizligini baholash.",
      "Tez yordam chaqirish (yoki sherigiga topshirish).",
      "Jabrlanuvchini baholash: hush, nafas, qon ketish.",
      "Hayotga tahdid soluvchi holatlarni bartaraf etish: qon ketish, nafas yo'li, reanimatsiya.",
      "Ko'p qurbon bo'lsa — triaj va toifalash.",
      "Tibbiy xodimlarga holat va ko'rsatilgan yordamni topshirish."
    ),
    pitfalls: ls(
      "Xavfli joyga himoyasiz kirib, o'zi ham jabrlanuvchiga aylanish.",
      "Jgut qo'yilgan vaqtini yozmaslik.",
      "Umurtqa jarohati shubhasida jabrlanuvchini keraksiz harakatlantirish.",
      "Triajda bir jabrlanuvchiga uzoq vaqt sarflab, boshqalarni baholamaslik."
    ),
    legalBasis: [LAW_ES, { title: { uz: "«Fuqarolar sog'lig'ini saqlash to'g'risida»gi Qonun" } }],
    questions: ls(
      "Yo'l-transport hodisasi joyiga yetib keldingiz. Jabrlanuvchiga yaqinlashishdan oldin nimani tekshirasiz?",
      "Jabrlanuvchini baholash tartibini ayting.",
      "Sonidan kuchli qon ketmoqda. Harakatlaringiz?",
      "Yurak-o'pka reanimatsiyasini qanday o'tkazasiz?",
      "Triaj toifalarini tushuntiring.",
      "Nima uchun triaj takrorlanadi?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Kattalarda YO'R nisbati?", ru: "Соотношение при СЛР у взрослых?" },
        options: [
          { id: "a", text: { uz: "30 bosish : 2 nafas", ru: "30 компрессий : 2 вдоха" }, correct: true },
          { id: "b", text: { uz: "5 bosish : 1 nafas", ru: "5 компрессий : 1 вдох" }, correct: false },
          { id: "c", text: { uz: "15 bosish : 5 nafas", ru: "15 компрессий : 5 вдохов" }, correct: false },
        ],
        explanation: { uz: "Kattalarda — 30 ta ko'krak bosish va 2 ta nafas, daqiqasiga taxminan 100–120 bosish.", ru: "У взрослых — 30 компрессий и 2 вдоха, частота около 100–120 в минуту." },
      },
      {
        id: "q2",
        question: { uz: "Triajda qizil toifa nimani anglatadi?", ru: "Что означает красная категория триажа?" },
        options: [
          { id: "a", text: { uz: "Zudlik bilan yordam kerak", ru: "Нужна немедленная помощь" }, correct: true },
          { id: "b", text: { uz: "Yengil jarohat", ru: "Лёгкая травма" }, correct: false },
        ],
        explanation: { uz: "Qizil — hayotga xavf bor va zudlik bilan yordam berilsa saqlab qolish mumkin.", ru: "Красный — угроза жизни, при немедленной помощи пострадавшего можно спасти." },
      },
    ],
  },
];
