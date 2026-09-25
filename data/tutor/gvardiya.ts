import type { LocalizedText } from "@/data/sops/types";
import type { TutorTopic } from "@/data/kasblar/types";

/**
 * AI-tutor lesson cards — Milliy gvardiya.
 * No article numbers: laws are referenced by NAME only.
 */

const L = (uz: string): LocalizedText => ({ uz });
const ls = (...items: string[]): LocalizedText[] => items.map(L);

const LAW_GUARD = { title: { uz: "«O'zbekiston Respublikasi Milliy gvardiyasi to'g'risida»gi Qonun", ru: "Закон «О Национальной гвардии Республики Узбекистан»" } };

export const GVARDIYA_TOPICS: TutorTopic[] = [
  {
    id: "gv-ommaviy-tadbir",
    agency: "gvardiya",
    professions: ["gvardiyachi"],
    title: {
      uz: "Ommaviy tadbirlarda jamoat tartibini saqlash",
      ru: "Охрана общественного порядка на массовых мероприятиях",
      en: "Public order at mass events",
    },
    summary: {
      uz: "Konsert, sport musobaqasi yoki bayram tadbirida xizmatni rejalashtirish, kirish nazorati, olomonni boshqarish va hodisalarga javob berish.",
      ru: "Планирование службы на концерте, спортивном или праздничном мероприятии, контроль входа, управление толпой и реагирование на инциденты.",
      en: "Planning duty at a concert, sports or festive event: entry control, crowd management and incident response.",
    },
    keyPoints: ls(
      "Tadbirdan oldin obyekt razvedkasi o'tkaziladi: kirish-chiqish yo'llari, evakuatsiya yo'laklari, xavfli nuqtalar, tibbiy va yong'in xizmati joylashuvi.",
      "Xizmat rejasi tuziladi: postlar, sektorlar, zaxira guruh, aloqa kanallari va boshqaruv punkti.",
      "Kirish nazorati punktlarida shaxsiy ko'rik texnik vositalar (metall detektor) yordamida, hurmat bilan o'tkaziladi; taqiqlangan buyumlar ro'yxati oldindan e'lon qilinadi.",
      "Olomon zichligi kuzatiladi; tiqilinch xavfi paydo bo'lsa oqimni to'xtatish va muqobil yo'laklarni ochish kerak.",
      "Xodimlar tashkilotchilar, IIV, tez yordam va FVV bilan yagona aloqa tarmog'ida ishlaydi.",
      "Huquqbuzarlikka birinchi navbatda so'z bilan ta'sir qilinadi; kuch ishlatish — oxirgi chora.",
      "Hodisa yuz berganda xodim o'z postini tashlab ketmaydi, zaxira guruhni chaqiradi.",
      "Tadbir yakunida tarqalish bosqichi ham rejalashtiriladi — ko'p hodisalar aynan chiqishda yuz beradi."
    ),
    steps: ls(
      "Topshiriq va tadbir ma'lumotlarini olish, obyektni oldindan o'rganish.",
      "Xizmat rejasi va postlar sxemasini tuzish, instruktaj o'tkazish.",
      "Kirish nazoratini tashkil etish va ko'rikni o'tkazish.",
      "Tadbir davomida sektorlarni kuzatish, olomon zichligini nazorat qilish.",
      "Hodisalarga javob: ogohlantirish, ajratib olish, IIVga topshirish, tibbiy yordam chaqirish.",
      "Tarqalish bosqichini boshqarish va xizmat yakunida hisobot berish."
    ),
    pitfalls: ls(
      "Evakuatsiya yo'laklarini to'sib qo'yish yoki ularni bilmaslik.",
      "Kirishda shoshilib yoki qo'pol ko'rik o'tkazish — norozilikni keltirib chiqaradi.",
      "Mayda nizoga ortiqcha kuch bilan javob berib, olomonni qo'zg'atish.",
      "Postni tashlab hodisa tomon yugurish — boshqa sektor nazoratsiz qoladi."
    ),
    legalBasis: [LAW_GUARD, { title: { uz: "«Ichki ishlar organlari to'g'risida»gi Qonun (hamkorlik qismida)" } }, { lawKey: "mjtkPettyHooliganism" }],
    questions: ls(
      "Tadbir oldidan obyektni o'rganishda nimalarga e'tibor berasiz?",
      "Kirish nazorati punktida fuqaro ko'rikdan bosh tortdi. Qanday harakat qilasiz?",
      "Sahna oldida olomon zichligi keskin oshdi. Birinchi harakatingiz nima?",
      "Tribunada ikki muxlis janjallashmoqda. Qanday bosqichma-bosqich aralashasiz?",
      "Nega tarqalish bosqichini alohida rejalashtirish kerak?",
      "Qaysi xizmatlar bilan aloqa o'rnatasiz va qanday?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Olomonda tiqilinch xavfi paydo bo'ldi. To'g'ri harakat?", ru: "Возникла угроза давки. Правильное действие?" },
        options: [
          { id: "a", text: { uz: "Oqimni to'xtatish va muqobil yo'laklarni ochish", ru: "Остановить поток и открыть альтернативные проходы" }, correct: true },
          { id: "b", text: { uz: "Olomonni kuch bilan orqaga surish", ru: "Силой оттеснить толпу" }, correct: false },
          { id: "c", text: { uz: "Tadbir tugashini kutish", ru: "Дождаться окончания мероприятия" }, correct: false },
        ],
        explanation: { uz: "Tiqilinchda bosimni kamaytirish kerak: kirishni to'xtatish va yangi chiqish yo'llarini ochish.", ru: "При давке нужно снизить давление: остановить вход и открыть новые выходы." },
      },
      {
        id: "q2",
        question: { uz: "Huquqbuzarlikka birinchi ta'sir usuli qaysi?", ru: "Каков первый способ воздействия на нарушителя?" },
        options: [
          { id: "a", text: { uz: "Maxsus vosita", ru: "Спецсредство" }, correct: false },
          { id: "b", text: { uz: "So'z bilan ogohlantirish", ru: "Словесное предупреждение" }, correct: true },
          { id: "c", text: { uz: "Darhol ushlash", ru: "Немедленное задержание" }, correct: false },
        ],
        explanation: { uz: "Avval og'zaki ta'sir; kuch faqat boshqa usullar natija bermaganda qo'llaniladi.", ru: "Сначала словесное воздействие; сила — только если иные меры не помогли." },
      },
    ],
  },
  {
    id: "gv-obyekt-qoriqlash",
    agency: "gvardiya",
    professions: ["gvardiyachi"],
    title: {
      uz: "Obyektlarni qo'riqlash va o'tkazish rejimi",
      ru: "Охрана объектов и пропускной режим",
      en: "Facility protection and access control",
    },
    summary: {
      uz: "Muhim davlat obyektida postni qabul qilish, o'tkazish rejimini ta'minlash, hujjatlarni tekshirish va begona shaxs yoki shubhali buyumga javob berish.",
      ru: "Приём поста на важном гособъекте, обеспечение пропускного режима, проверка документов и реагирование на посторонних лиц и подозрительные предметы.",
      en: "Taking over a post at a key state facility, enforcing access control, checking documents and responding to intruders or suspicious items.",
    },
    keyPoints: ls(
      "Postni qabul qilishda qo'riqlanadigan hudud, texnik vositalar, aloqa va oldingi smena yozuvlari tekshiriladi va jurnalga qayd etiladi.",
      "O'tkazish rejimi — shaxslar, transport va yuklarning obyektga kirishi-chiqishini ruxsatnoma asosida tartibga solish.",
      "Ruxsatnoma egasining shaxsi hujjat va surat bilan solishtiriladi; muddati, ruxsat etilgan zona tekshiriladi.",
      "Transport va yuk ko'rigi hujjatdagi ma'lumotlar bilan solishtirib o'tkaziladi.",
      "Shubhali buyumga tegilmaydi: hudud bo'shatiladi, rahbar va tegishli xizmatlar xabardor qilinadi.",
      "Begona shaxs aniqlanganda to'xtatiladi, shaxsi aniqlanadi va vakolatli organga topshiriladi.",
      "Qo'riqchi postni ruxsatsiz tark etmaydi, xizmatdan chalg'itadigan narsalar bilan shug'ullanmaydi.",
      "Barcha hodisalar xizmat jurnaliga vaqti bilan yoziladi."
    ),
    steps: ls(
      "Postni qabul qilish: hudud, texnika, aloqa, jurnal va qurol-yarog'ni tekshirish.",
      "Kirish-chiqishni ruxsatnoma asosida nazorat qilish.",
      "Transport va yuklarni hujjatlar bilan solishtirib ko'rikdan o'tkazish.",
      "Perimetrni va texnik qo'riqlash signallarini kuzatish.",
      "Hodisa yuz berganda: to'xtatish, xabar berish, zaxira chaqirish, hudud xavfsizligini ta'minlash.",
      "Postni topshirish va jurnalga yozuv kiritish."
    ),
    pitfalls: ls(
      "Tanish xodimni ruxsatnomasiz «bir daqiqaga» o'tkazib yuborish.",
      "Shubhali sumkani ochib ko'rishga urinish.",
      "Hodisani jurnalga yozmaslik yoki keyinroq yozish.",
      "Postni qabul qilishda texnik vositalarni tekshirmaslik."
    ),
    legalBasis: [LAW_GUARD],
    questions: ls(
      "Postni qabul qilishda nimalarni tekshirasiz?",
      "Rahbariyatdan bir xodim ruxsatnomasiz kirmoqchi. Qanday yo'l tutasiz?",
      "Kirish oldida egasiz sumka topildi. Harakatlaringiz ketma-ketligi?",
      "Yuk mashinasini qanday tekshirasiz?",
      "Perimetr signalizatsiyasi ishga tushdi. Birinchi nima qilasiz?",
      "Xizmat jurnaliga nimalarni yozish shart?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Egasiz shubhali buyum topilganda?", ru: "Обнаружен бесхозный подозрительный предмет?" },
        options: [
          { id: "a", text: { uz: "Ochib, ichini tekshirish", ru: "Открыть и проверить" }, correct: false },
          { id: "b", text: { uz: "Tegmaslik, hududni bo'shatish, xabar berish", ru: "Не трогать, освободить зону, доложить" }, correct: true },
          { id: "c", text: { uz: "Chetga olib qo'yish", ru: "Отнести в сторону" }, correct: false },
        ],
        explanation: { uz: "Shubhali buyumga tegilmaydi; odamlar uzoqlashtiriladi va maxsus xizmatlar chaqiriladi.", ru: "Подозрительный предмет не трогают; людей удаляют и вызывают спецслужбы." },
      },
      {
        id: "q2",
        question: { uz: "Ruxsatnomani tekshirishda nima solishtiriladi?", ru: "Что сверяется при проверке пропуска?" },
        options: [
          { id: "a", text: { uz: "Faqat ism", ru: "Только имя" }, correct: false },
          { id: "b", text: { uz: "Shaxs, surat, muddat va ruxsat etilgan zona", ru: "Личность, фото, срок и разрешённая зона" }, correct: true },
          { id: "c", text: { uz: "Hech narsa, tanish bo'lsa", ru: "Ничего, если знаком" }, correct: false },
        ],
        explanation: { uz: "Ruxsatnoma to'liq tekshiriladi: shaxsi, surati, amal qilish muddati va zonasi.", ru: "Пропуск проверяется полностью: личность, фото, срок и зона допуска." },
      },
    ],
  },
  {
    id: "gv-kuch-mutanosibligi",
    agency: "gvardiya",
    professions: ["gvardiyachi"],
    title: {
      uz: "Jismoniy kuch va maxsus vositalarni qo'llash mutanosibligi",
      ru: "Соразмерность применения физической силы и спецсредств",
      en: "Proportional use of force and special means",
    },
    summary: {
      uz: "Kuch qo'llash asoslari, ogohlantirish majburiyati, mutanosiblik tamoyili, taqiqlar va kuch qo'llangandan keyingi harakatlar.",
      ru: "Основания применения силы, обязанность предупреждения, принцип соразмерности, запреты и действия после применения силы.",
      en: "Grounds for using force, the duty to warn, proportionality, prohibitions and after-action duties.",
    },
    keyPoints: ls(
      "Jismoniy kuch, maxsus vositalar va qurol faqat qonunda belgilangan hollarda va boshqa usullar natija bermaganda qo'llaniladi.",
      "Kuch qo'llashdan oldin xodim o'zini tanishtiradi va niyati haqida ogohlantiradi, bunga vaqt beradi (kechiktirish hayot uchun xavf tug'dirmasa).",
      "Mutanosiblik: qo'llaniladigan kuch tahdid darajasiga mos bo'lishi va zararni eng kam darajada tutishi kerak.",
      "Tahdid to'xtashi bilan kuch qo'llash ham to'xtatiladi.",
      "Ayollar, voyaga yetmaganlar, nogironligi aniq ko'rinib turgan shaxslarga nisbatan maxsus vositalar qo'llash qonun bilan cheklangan (qurolli hujum yoki guruhiy hujum hollaridan tashqari).",
      "Kuch qo'llanganidan keyin jabrlanganga birinchi yordam ko'rsatiladi va tibbiy yordam chaqiriladi.",
      "Har bir kuch qo'llash holati rahbarga zudlik bilan bildiriladi va yozma hisobot bilan rasmiylashtiriladi; og'ir oqibatlarda prokuror xabardor qilinadi.",
      "Ortiqcha kuch — xodimning intizomiy va jinoiy javobgarligiga asos."
    ),
    steps: ls(
      "Vaziyatni baholash: tahdid turi, qurol bor-yo'qligi, atrofdagilar xavfsizligi.",
      "O'zini tanishtirish, talabni aniq aytish va kuch qo'llash haqida ogohlantirish.",
      "Eng yengil samarali usulni tanlash va qo'llash.",
      "Tahdid bartaraf etilishi bilan kuchni to'xtatish.",
      "Birinchi yordam ko'rsatish, tibbiy yordam chaqirish.",
      "Rahbarga bildirish va yozma hisobot tuzish."
    ),
    pitfalls: ls(
      "Ogohlantirishsiz darhol maxsus vosita qo'llash.",
      "Qarshilik to'xtaganidan keyin ham kuch qo'llashni davom ettirish.",
      "Jarohatlanganga yordam bermaslik.",
      "Hisobot yozmaslik yoki holatni yumshatib ko'rsatish."
    ),
    legalBasis: [LAW_GUARD, { lawKey: "lawPolice" }],
    questions: ls(
      "Mutanosiblik tamoyilini o'z so'zlaringiz bilan tushuntiring.",
      "Qaysi hollarda ogohlantirishsiz kuch qo'llash mumkin?",
      "Mast fuqaro qo'l siltab so'kinmoqda, lekin qurolsiz. Qanday chora tanlaysiz?",
      "Kuch qo'llanganidan keyingi majburiyatlaringiz qanday?",
      "Qaysi toifadagi shaxslarga maxsus vositalar qo'llash cheklangan?",
      "Hisobotga nimalarni yozasiz?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Tahdid bartaraf etildi. Keyingi qadam?", ru: "Угроза устранена. Следующий шаг?" },
        options: [
          { id: "a", text: { uz: "Kuchni to'xtatish va yordam ko'rsatish", ru: "Прекратить силу и оказать помощь" }, correct: true },
          { id: "b", text: { uz: "Saboq bo'lishi uchun davom ettirish", ru: "Продолжить «для урока»" }, correct: false },
          { id: "c", text: { uz: "Hech narsa, joyni tark etish", ru: "Ничего, покинуть место" }, correct: false },
        ],
        explanation: { uz: "Tahdid to'xtashi bilan kuch to'xtatiladi, jabrlanganga yordam beriladi va holat hisobot qilinadi.", ru: "С прекращением угрозы сила прекращается, пострадавшему оказывается помощь, составляется рапорт." },
      },
      {
        id: "q2",
        question: { uz: "Kuch qo'llashdan oldin odatda nima qilinadi?", ru: "Что обычно делается до применения силы?" },
        options: [
          { id: "a", text: { uz: "Ogohlantirish va vaqt berish", ru: "Предупреждение и время на выполнение" }, correct: true },
          { id: "b", text: { uz: "Suratga olish", ru: "Фотосъёмка" }, correct: false },
          { id: "c", text: { uz: "Hech narsa", ru: "Ничего" }, correct: false },
        ],
        explanation: { uz: "Kechiktirish hayotga xavf tug'dirmasa, xodim ogohlantiradi va talabni bajarish uchun vaqt beradi.", ru: "Если промедление не опасно для жизни, сотрудник предупреждает и даёт время выполнить требование." },
      },
    ],
  },
  {
    id: "gv-patrul",
    agency: "gvardiya",
    professions: ["gvardiyachi"],
    title: {
      uz: "Patrul-post xizmati",
      ru: "Патрульно-постовая служба",
      en: "Patrol duty",
    },
    summary: {
      uz: "Patrul marshrutini o'tash, fuqarolar bilan muloqot, shaxsni tekshirish, hodisaga javob berish va xizmat hujjatlarini yuritish.",
      ru: "Прохождение маршрута патрулирования, общение с гражданами, проверка личности, реагирование на происшествия и служебная документация.",
      en: "Walking the patrol route, dealing with citizens, identity checks, incident response and duty paperwork.",
    },
    keyPoints: ls(
      "Xizmatdan oldin instruktaj: marshrut, tezkor vaziyat, qidiruvdagi shaxslar, aloqa signallari.",
      "Patrul juftlikda ishlaydi: biri muloqot qiladi, ikkinchisi xavfsizlikni kuzatadi.",
      "Fuqaroga murojaat: salomlashish, o'zini tanishtirish (unvon, familiya), murojaat sababini aytish.",
      "Hujjatni tekshirish faqat qonuniy asos bo'lganda va hurmat bilan o'tkaziladi.",
      "Hodisa joyida: xavfsizlik, yordam, navbatchi qismga xabar, voqea joyini qo'riqlash.",
      "Xizmat davomidagi barcha muhim holatlar navbatchi qismga ma'lum qilinadi va hisobotga yoziladi.",
      "Tana kamerasi (agar berilgan bo'lsa) muloqot boshidan yoqiladi — bu ham xodimni, ham fuqaroni himoya qiladi.",
      "Qo'pollik, provokatsiyaga berilish va shaxsiy telefon bilan chalg'ish — xizmat intizomini buzish."
    ),
    steps: ls(
      "Instruktajdan o'tish, jihozlar va aloqani tekshirish.",
      "Marshrutni belgilangan vaqt bo'yicha o'tash, xavfli nuqtalarga e'tibor berish.",
      "Fuqarolar bilan muloqot va zarur hollarda hujjatlarni tekshirish.",
      "Hodisaga javob: baholash, yordam, xabar berish, qo'riqlash.",
      "Topilgan ma'lumotlarni navbatchi qismga uzatish.",
      "Xizmatni topshirish va hisobot yozish."
    ),
    pitfalls: ls(
      "O'zini tanishtirmasdan hujjat talab qilish.",
      "Juftlikdagi sherigini qoldirib, yakka harakat qilish.",
      "Hodisani navbatchi qismga bildirmaslik.",
      "Tana kamerasini o'chiq qoldirish."
    ),
    legalBasis: [LAW_GUARD, { lawKey: "lawPolice" }, { lawKey: "mjtkPassportRegime" }],
    questions: ls(
      "Fuqaroga qanday murojaat qilasiz? Birinchi gaplaringizni ayting.",
      "Juftlikda vazifalar qanday taqsimlanadi va nima uchun?",
      "Fuqaro hujjat ko'rsatishdan bosh tortdi va videoga ola boshladi. Harakatingiz?",
      "Marshrutda yaralangan odamni ko'rdingiz. Ketma-ketlikni ayting.",
      "Tana kamerasi nima uchun kerak?",
      "Xizmat oxirida hisobotga nimalarni kiritasiz?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Fuqaroga murojaatdagi birinchi qadam?", ru: "Первый шаг при обращении к гражданину?" },
        options: [
          { id: "a", text: { uz: "Hujjatni talab qilish", ru: "Потребовать документы" }, correct: false },
          { id: "b", text: { uz: "Salomlashish va o'zini tanishtirish", ru: "Поздороваться и представиться" }, correct: true },
          { id: "c", text: { uz: "Qo'lini ushlash", ru: "Взять за руку" }, correct: false },
        ],
        explanation: { uz: "Xodim avval salomlashadi, unvon va familiyasini aytadi, murojaat sababini tushuntiradi.", ru: "Сотрудник сначала здоровается, называет звание и фамилию, объясняет причину обращения." },
      },
      {
        id: "q2",
        question: { uz: "Fuqaro xodimni videoga olmoqda. Bu...", ru: "Гражданин снимает сотрудника на видео. Это..." },
        options: [
          { id: "a", text: { uz: "Taqiqlanishi kerak, telefonni olish lozim", ru: "Нужно запретить и изъять телефон" }, correct: false },
          { id: "b", text: { uz: "Xotirjam va qonuniy ishlashni davom ettirish kerak", ru: "Нужно спокойно и законно продолжать работу" }, correct: true },
        ],
        explanation: { uz: "Xodim videoga olinishiga xotirjam munosabatda bo'ladi; qonuniy va odobli harakat har qanday yozuvda himoya bo'ladi.", ru: "Сотрудник спокойно относится к съёмке; законные и вежливые действия защищают его на любой записи." },
      },
    ],
  },
  {
    id: "gv-favqulodda-hamkorlik",
    agency: "gvardiya",
    professions: ["gvardiyachi", "qutqaruvchi"],
    title: {
      uz: "Favqulodda holatlarda idoralararo hamkorlik",
      ru: "Межведомственное взаимодействие при чрезвычайных ситуациях",
      en: "Inter-agency cooperation in emergencies",
    },
    summary: {
      uz: "Favqulodda vaziyat hududida o'rab olish, aholini evakuatsiya qilishga ko'maklashish, FVV, IIV va tibbiyot xizmati bilan yagona boshqaruvda ishlash.",
      ru: "Оцепление зоны ЧС, содействие эвакуации населения, работа под единым управлением с МЧС, МВД и медслужбой.",
      en: "Cordoning an emergency zone, supporting evacuation and working under a single command with MES, police and medical services.",
    },
    keyPoints: ls(
      "Favqulodda vaziyatda yagona boshqaruv tamoyili amal qiladi: operatsiya rahbari (shtab) belgilanadi va barcha kuchlar unga bo'ysunadi.",
      "Gvardiya vazifasi odatda: hududni o'rab olish, tartibni saqlash, muhim obyektlarni qo'riqlash, evakuatsiyaga ko'maklashish.",
      "Qutqaruv ishlarini FVV mutaxassislari olib boradi; gvardiyachi ularning xavfsiz ishlashini ta'minlaydi.",
      "O'rab olish chegarasi xavf zonasi va xizmat texnikasi yo'lagini hisobga olib belgilanadi.",
      "Evakuatsiya qilingan uy-joylar va mulk talon-taroj qilinmasligi uchun qo'riqlanadi.",
      "Aloqa yagona kanal va chaqiruv belgilar orqali yuritiladi; ma'lumot faqat shtab orqali tarqatiladi.",
      "Xodimlar o'z xavfsizligini ham ta'minlaydi: himoya vositalari, xavfli zonaga ruxsatsiz kirmaslik.",
      "Operatsiya yakunida harakatlar tahlili (debrifing) o'tkaziladi."
    ),
    steps: ls(
      "Signal olish, shtab bilan aloqa o'rnatish, topshiriqni aniqlashtirish.",
      "Hududga yetib kelish va operatsiya rahbariga bildirish.",
      "O'rab olish chegarasini belgilash, kirish-chiqishni nazorat qilish.",
      "Evakuatsiyaga ko'maklashish, transport yo'laklarini bo'sh saqlash.",
      "Evakuatsiya qilingan hudud va obyektlarni qo'riqlash.",
      "Topshiriq yakunida hisobot va debrifingda ishtirok etish."
    ),
    pitfalls: ls(
      "Shtabga bildirmasdan o'zboshimchalik bilan harakat qilish.",
      "Xavfli zonaga himoya vositalarisiz kirish.",
      "Tez yordam va o't o'chirish texnikasi yo'lagini to'sib qo'yish.",
      "Tasdiqlanmagan ma'lumotni aholiga tarqatish."
    ),
    legalBasis: [LAW_GUARD, { title: { uz: "«Aholini va hududlarni tabiiy va texnogen xususiyatli favqulodda vaziyatlardan muhofaza qilish to'g'risida»gi Qonun" } }],
    questions: ls(
      "Yagona boshqaruv tamoyili nima va u nega muhim?",
      "Gaz portlashi joyiga yetib keldingiz. Kimga bildirasiz va qanday vazifa kutasiz?",
      "O'rab olish chegarasini qanday belgilaysiz?",
      "Evakuatsiya qilingan uylar oldida begona odamlar aylanib yuribdi. Nima qilasiz?",
      "Jurnalistlar sizdan qurbonlar soni haqida so'rashmoqda. Qanday javob berasiz?",
      "Debrifing nima uchun o'tkaziladi?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Favqulodda vaziyatda qutqaruv ishlarini kim olib boradi?", ru: "Кто ведёт спасательные работы при ЧС?" },
        options: [
          { id: "a", text: { uz: "FVV mutaxassislari, gvardiya ularga ko'maklashadi", ru: "Специалисты МЧС, гвардия содействует" }, correct: true },
          { id: "b", text: { uz: "Birinchi yetib kelgan har qanday xodim", ru: "Любой первый прибывший сотрудник" }, correct: false },
        ],
        explanation: { uz: "Qutqaruv ishlari FVV vakolatida; gvardiya o'rab olish, tartib va qo'riqlashni ta'minlaydi.", ru: "Спасработы — компетенция МЧС; гвардия обеспечивает оцепление, порядок и охрану." },
      },
      {
        id: "q2",
        question: { uz: "Ommaviy axborot vositalariga ma'lumot kim orqali beriladi?", ru: "Через кого передаётся информация для СМИ?" },
        options: [
          { id: "a", text: { uz: "Shtab (operatsiya rahbari) orqali", ru: "Через штаб (руководителя операции)" }, correct: true },
          { id: "b", text: { uz: "Postdagi har bir xodim o'zi", ru: "Каждый сотрудник на посту сам" }, correct: false },
        ],
        explanation: { uz: "Tasdiqlangan ma'lumot faqat shtab orqali tarqatiladi — bu vahima va yolg'on xabarlarning oldini oladi.", ru: "Проверенная информация распространяется только через штаб — это предотвращает панику и слухи." },
      },
    ],
  },
];
