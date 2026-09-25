import type { LocalizedText } from "@/data/sops/types";
import type { TutorTopic } from "@/data/kasblar/types";

/**
 * AI-tutor lesson cards — Prokuratura organlari.
 * Article numbers only via `lawKey`; otherwise law NAMES only.
 */

const L = (uz: string): LocalizedText => ({ uz });
const ls = (...items: string[]): LocalizedText[] => items.map(L);

const LAW_PROSECUTION = { title: { uz: "«Prokuratura to'g'risida»gi Qonun", ru: "Закон «О прокуратуре»" } };
const JPK = { title: { uz: "Jinoyat-protsessual kodeksi", ru: "Уголовно-процессуальный кодекс" } };

export const PROKURATURA_TOPICS: TutorTopic[] = [
  {
    id: "pr-tergov-nazorat",
    agency: "prokuratura",
    professions: ["prokuror"],
    title: {
      uz: "Tergov va surishtiruv qonuniyligi ustidan nazorat",
      ru: "Надзор за законностью следствия и дознания",
      en: "Oversight of the legality of investigation and inquiry",
    },
    summary: {
      uz: "Jinoyat ishi materiallarini o'rganish, protsessual qarorlar qonuniyligini tekshirish, buzilishlarni aniqlash va ularga javob choralarini ko'rish.",
      ru: "Изучение материалов уголовного дела, проверка законности процессуальных решений, выявление нарушений и реагирование на них.",
      en: "Studying case files, checking the legality of procedural decisions, finding violations and responding to them.",
    },
    keyPoints: ls(
      "Prokuror tergov va surishtiruv organlarining qonunlarni aniq va bir xilda ijro etishi ustidan nazoratni amalga oshiradi.",
      "Nazorat predmeti: ariza-xabarlarni ro'yxatga olish, ishni qo'zg'atish yoki rad etish asoslari, tergov harakatlari, ehtiyot choralari, muddatlar, ishtirokchilar huquqlari.",
      "Prokuror ish materiallarini talab qilib olish, tergovchiga yozma ko'rsatma berish, qonunsiz qarorlarni bekor qilish vakolatiga ega.",
      "Dalillarning maqbulligi tekshiriladi: qonunni buzib olingan dalil ayblov asosiga qo'yilmaydi.",
      "Protsessual muddatlar nazorati — asossiz cho'zilish shaxs huquqlarini buzadi.",
      "Gumon qilinuvchi, ayblanuvchi va jabrlanuvchining huquqlari (advokat, tarjimon, iltimosnoma berish) ta'minlanganligi tekshiriladi.",
      "Aniqlangan buzilishlar bo'yicha prokuror javob chorasini qo'llaydi va ijrosini nazorat qiladi.",
      "Nazorat tergovning mustaqilligiga aralashish emas: prokuror qonuniylikni tekshiradi, tergovchi o'rniga ishni tergov qilmaydi."
    ),
    steps: ls(
      "Ish materiallarini yoki ro'yxatga olish hujjatlarini talab qilib olish.",
      "Ishni qo'zg'atish asoslari va qarorlar qonuniyligini tekshirish.",
      "Tergov harakatlari bayonnomalari va dalillar maqbulligini o'rganish.",
      "Muddatlar va ishtirokchilar huquqlari ta'minlanganini tekshirish.",
      "Buzilishlarni qayd etish va javob chorasini tanlash.",
      "Javob chorasi ijrosini nazorat qilish."
    ),
    pitfalls: ls(
      "Faqat yakuniy hujjatni ko'rib, bayonnomalarni o'qimaslik.",
      "Muddat buzilishini «kichik kamchilik» deb e'tiborsiz qoldirish.",
      "Tergovchining ishini o'zi bajarishga urinish.",
      "Javob chorasi ijrosini kuzatmaslik."
    ),
    legalBasis: [LAW_PROSECUTION, JPK, { lawKey: "jpkRegister" }],
    questions: ls(
      "Prokuror nazoratining predmetiga nimalar kiradi?",
      "Tergovchi ushlab turish bayonnomasini advokatsiz tuzgan. Bu qanday buzilish va nima qilasiz?",
      "Dalilning maqbulligini qanday tekshirasiz?",
      "Nazorat va tergovga aralashish o'rtasidagi chegarani tushuntiring.",
      "Ish 10 kun o'rniga bir oy ro'yxatga olinmay yotgan. Qanday choralar ko'rasiz?",
      "Javob chorasi ijrosini qanday nazorat qilasiz?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Qonunni buzib olingan dalil...", ru: "Доказательство, полученное с нарушением закона..." },
        options: [
          { id: "a", text: { uz: "Ayblov asosiga qo'yilmaydi", ru: "Не может быть положено в основу обвинения" }, correct: true },
          { id: "b", text: { uz: "Prokuror roziligi bilan ishlatiladi", ru: "Используется с согласия прокурора" }, correct: false },
        ],
        explanation: { uz: "Maqbul bo'lmagan dalil ayblov asosiga qo'yilmaydi; prokuror buni tekshirishi shart.", ru: "Недопустимое доказательство не кладётся в основу обвинения; прокурор обязан это проверить." },
      },
      {
        id: "q2",
        question: { uz: "Prokuror nazoratining mohiyati?", ru: "Суть прокурорского надзора?" },
        options: [
          { id: "a", text: { uz: "Qonuniylikni tekshirish va buzilishlarni bartaraf etish", ru: "Проверка законности и устранение нарушений" }, correct: true },
          { id: "b", text: { uz: "Tergovchi o'rniga tergov o'tkazish", ru: "Вести следствие вместо следователя" }, correct: false },
        ],
        explanation: { uz: "Prokuror qonuniylikni ta'minlaydi, lekin tergovchining protsessual mustaqilligini hurmat qiladi.", ru: "Прокурор обеспечивает законность, уважая процессуальную самостоятельность следователя." },
      },
    ],
  },
  {
    id: "pr-murojaatlar",
    agency: "prokuratura",
    professions: ["prokuror"],
    title: {
      uz: "Murojaatlarni ko'rib chiqish",
      ru: "Рассмотрение обращений",
      en: "Handling citizens' appeals",
    },
    summary: {
      uz: "Jismoniy va yuridik shaxslarning murojaatlarini qabul qilish, ro'yxatga olish, tekshirish, muddatlarga rioya qilish va asoslantirilgan javob berish.",
      ru: "Приём, регистрация и проверка обращений физических и юридических лиц, соблюдение сроков и мотивированный ответ.",
      en: "Receiving, registering and checking appeals of individuals and legal entities, meeting deadlines and giving reasoned answers.",
    },
    keyPoints: ls(
      "Murojaat turlari: ariza, taklif, shikoyat; ular og'zaki, yozma yoki elektron shaklda berilishi mumkin.",
      "Murojaat qabul qilinishi va ro'yxatga olinishi shart; uni ko'rib chiqishdan asossiz bosh tortish mumkin emas.",
      "Umumiy muddat: qo'shimcha o'rganish talab qilmaydigan murojaatlar 15 kun ichida, qo'shimcha o'rganish talab qiladiganlari bir oygacha ko'rib chiqiladi.",
      "Muddatni uzaytirish asoslantirilgan qaror bilan va murojaatchini xabardor qilgan holda amalga oshiriladi.",
      "Shikoyat ustidan shikoyat qilinayotgan mansabdor shaxsga ko'rib chiqish uchun yuborilmaydi.",
      "Vakolatga kirmaydigan murojaat belgilangan muddatda tegishli organga yuboriladi va murojaatchi xabardor qilinadi.",
      "Javob asoslantirilgan bo'lishi, har bir dalilga javob berishi va shikoyat qilish tartibini ko'rsatishi kerak.",
      "Murojaatchining shaxsiy ma'lumotlari uning roziligisiz oshkor qilinmaydi."
    ),
    steps: ls(
      "Murojaatni qabul qilish va ro'yxatga olish.",
      "Vakolatga taalluqliligini aniqlash; tegishli bo'lmasa, qonuniy muddatda yo'naltirish.",
      "Tekshiruv: tushuntirish olish, hujjatlarni so'rash, joyiga chiqish.",
      "Buzilish aniqlansa, prokuror javob chorasini qo'llash.",
      "Asoslantirilgan javob tayyorlash va murojaatchiga yuborish.",
      "Nazoratdan olish va natijani qayd etish."
    ),
    pitfalls: ls(
      "Shikoyatni shikoyat qilinayotgan shaxsning o'ziga «ko'rib chiqish uchun» yuborish.",
      "Formal «ma'lumot uchun» javob berish, dalillarga javob bermaslik.",
      "Muddatni uzaytirishni murojaatchiga bildirmaslik.",
      "Murojaatchi ma'lumotlarini oshkor qilish."
    ),
    legalBasis: [{ lawKey: "lawAppeals" }, LAW_PROSECUTION],
    questions: ls(
      "Murojaatlarning qanday turlarini bilasiz?",
      "Murojaatni ko'rib chiqish muddatlari qanday?",
      "Fuqaro tuman IIB boshlig'i ustidan shikoyat qildi. Shikoyatni kimga yuborish mumkin emas?",
      "Asoslantirilgan javob qanday bo'lishi kerak?",
      "Murojaat prokuratura vakolatiga kirmasa-chi?",
      "Tekshiruvda buzilish aniqlansa, qanday harakat qilasiz?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Qo'shimcha o'rganish talab qilmaydigan murojaat muddati?", ru: "Срок по обращению, не требующему дополнительного изучения?" },
        options: [
          { id: "a", text: { uz: "15 kun", ru: "15 дней" }, correct: true },
          { id: "b", text: { uz: "3 oy", ru: "3 месяца" }, correct: false },
          { id: "c", text: { uz: "3 kun", ru: "3 дня" }, correct: false },
        ],
        explanation: { uz: "Murojaatlar to'g'risidagi qonunga ko'ra — 15 kun; qo'shimcha o'rganish talab qilsa bir oygacha.", ru: "По закону об обращениях — 15 дней; при необходимости дополнительного изучения — до месяца." },
      },
      {
        id: "q2",
        question: { uz: "Shikoyatni kimga yuborish mumkin emas?", ru: "Кому нельзя направлять жалобу?" },
        options: [
          { id: "a", text: { uz: "Ustidan shikoyat qilingan mansabdor shaxsga", ru: "Должностному лицу, на которое жалуются" }, correct: true },
          { id: "b", text: { uz: "Yuqori turuvchi organga", ru: "Вышестоящему органу" }, correct: false },
        ],
        explanation: { uz: "Shikoyat ustidan shikoyat qilinayotgan shaxsga ko'rib chiqish uchun yuborilmaydi.", ru: "Жалоба не направляется на рассмотрение лицу, действия которого обжалуются." },
      },
    ],
  },
  {
    id: "pr-javob-choralari",
    agency: "prokuratura",
    professions: ["prokuror"],
    title: {
      uz: "Prokuror javob choralari",
      ru: "Акты прокурорского реагирования",
      en: "Prosecutorial response measures",
    },
    summary: {
      uz: "Protest, taqdimnoma, ko'rsatma, qonunbuzarlikka yo'l qo'ymaslik haqida ogohlantirish va qaror — qaysi holatda qaysi chora tanlanadi va qanday rasmiylashtiriladi.",
      ru: "Протест, представление, указание, предостережение и постановление — какую меру выбрать и как её оформить.",
      en: "Protest, submission, instruction, warning and resolution — which measure fits which situation and how to draft it.",
    },
    keyPoints: ls(
      "Protest — qonunga zid huquqiy hujjat yoki qaror ustidan uni chiqargan organga yoki yuqori organga keltiriladi; maqsad — hujjatni bekor qilish yoki qonunga muvofiqlashtirish.",
      "Taqdimnoma — qonun buzilishlarini, ularning sabablari va shart-sharoitlarini bartaraf etish talabi bilan kiritiladi.",
      "Ko'rsatma — tergov va surishtiruv organlariga ish yuritish bo'yicha yozma beriladi va bajarilishi majburiy (qonunda belgilangan shikoyat tartibi bilan).",
      "Ogohlantirish — qonunbuzarlik sodir etilishi mumkinligi haqida ma'lumot bo'lganda, uni oldini olish uchun e'lon qilinadi.",
      "Qaror — jinoiy, ma'muriy yoki intizomiy javobgarlik masalasini hal qilish uchun chiqariladi.",
      "Har bir hujjatda aniq buzilish, qonun normasi (nomi bilan), dalillar va aniq talab ko'rsatiladi.",
      "Javob chorasini ko'rib chiqish muddati va natijasi haqida prokurorga xabar berish talab qilinadi.",
      "Hujjat mutanosib bo'lishi kerak: kichik buzilishga eng kuchli chora emas, buzilish mohiyatiga mos chora tanlanadi."
    ),
    steps: ls(
      "Buzilish mohiyatini va uning huquqiy asosini aniqlash.",
      "Maqsadni belgilash: hujjatni bekor qilish, sabablarni bartaraf etish, oldini olish yoki javobgarlik.",
      "Mos javob chorasini tanlash.",
      "Hujjatni tayyorlash: faktlar, normalar, dalillar, talab va muddat.",
      "Hujjatni yuborish va ro'yxatga olish.",
      "Ko'rib chiqilishi va ijrosini nazorat qilish."
    ),
    pitfalls: ls(
      "Protest o'rniga taqdimnoma kiritish yoki aksincha — chora va maqsadning nomuvofiqligi.",
      "Hujjatda dalilsiz umumiy iboralar ishlatish.",
      "Aniq talab va muddatni ko'rsatmaslik.",
      "Ijroni nazoratsiz qoldirish."
    ),
    legalBasis: [LAW_PROSECUTION],
    questions: ls(
      "Protest va taqdimnoma o'rtasidagi farqni tushuntiring.",
      "Hokimning qonunga zid qarori aniqlandi. Qaysi chorani tanlaysiz va nega?",
      "Tashkilotda muntazam ish haqi kechiktirilmoqda. Qanday chora ko'rasiz?",
      "Ogohlantirish qachon e'lon qilinadi?",
      "Yaxshi taqdimnomada qanday elementlar bo'lishi kerak?",
      "Javob chorasi ijro etilmasa, keyingi qadamingiz?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Qonunga zid huquqiy hujjatni bekor qilish uchun qaysi chora?", ru: "Какая мера для отмены незаконного правового акта?" },
        options: [
          { id: "a", text: { uz: "Protest", ru: "Протест" }, correct: true },
          { id: "b", text: { uz: "Ogohlantirish", ru: "Предостережение" }, correct: false },
          { id: "c", text: { uz: "Og'zaki tavsiya", ru: "Устная рекомендация" }, correct: false },
        ],
        explanation: { uz: "Protest qonunga zid hujjat yoki qaror ustidan keltiriladi va uni bekor qilish yoki o'zgartirishga qaratilgan.", ru: "Протест приносится на незаконный акт или решение с целью его отмены или изменения." },
      },
      {
        id: "q2",
        question: { uz: "Buzilish sabablari va shart-sharoitlarini bartaraf etish talabi qaysi hujjat?", ru: "Какой документ требует устранить причины и условия нарушений?" },
        options: [
          { id: "a", text: { uz: "Taqdimnoma", ru: "Представление" }, correct: true },
          { id: "b", text: { uz: "Protest", ru: "Протест" }, correct: false },
        ],
        explanation: { uz: "Taqdimnoma buzilishlar, ularning sabablari va shart-sharoitlarini bartaraf etishga qaratilgan.", ru: "Представление направлено на устранение нарушений, их причин и условий." },
      },
    ],
  },
  {
    id: "pr-ushlash-qonuniyligi",
    agency: "prokuratura",
    professions: ["prokuror"],
    title: {
      uz: "Ushlab turish qonuniyligini tekshirish",
      ru: "Проверка законности задержания",
      en: "Checking the legality of detention",
    },
    summary: {
      uz: "Ushlab turish joylarini tekshirish, ushlash asoslari, bayonnoma, muddat va huquqlar ta'minlanganini baholash, qonunsiz ushlangan shaxsni ozod qilish.",
      ru: "Проверка мест содержания задержанных: основания, протокол, сроки, соблюдение прав, освобождение незаконно задержанных.",
      en: "Inspecting holding facilities: grounds, record, time limits, rights compliance and releasing anyone unlawfully held.",
    },
    keyPoints: ls(
      "Prokuror ushlab turish joylarini istalgan vaqtda tekshirish va ushlanganlar bilan shaxsan suhbatlashish huquqiga ega.",
      "Tekshiruvda ushlash asoslari, bayonnoma tuzilgan vaqt va haqiqiy ushlash vaqti solishtiriladi.",
      "Ushlangan shaxsga huquqlari tushuntirilgani, advokat ishtiroki va yaqinlari xabardor qilingani tekshiriladi.",
      "Ushlab turishning qonunda belgilangan muddati o'tganmi — alohida tekshiriladi.",
      "Qonunsiz ushlangan har qanday shaxs prokuror tomonidan zudlik bilan ozod qilinadi.",
      "Tan jarohatlari, qiynoq yoki bosim haqida arizalar zudlik bilan qayd etiladi, tibbiy ko'rik tayinlanadi va tekshiriladi.",
      "Ro'yxatga olinmagan ushlash («yashirin ushlash») — o'ta jiddiy buzilish.",
      "Tekshiruv natijalari bo'yicha javob choralari qo'llaniladi va aybdor xodimlar javobgarligi masalasi hal qilinadi."
    ),
    steps: ls(
      "Ushlab turish joyiga oldindan ogohlantirmasdan kelish.",
      "Ro'yxat jurnalini va ushlangan shaxslar sonini solishtirish.",
      "Har bir ushlangan shaxs bayonnomasini, vaqtini va asosini tekshirish.",
      "Ushlanganlar bilan alohida suhbat o'tkazish, arizalarni qabul qilish.",
      "Qonunsiz ushlanganni darhol ozod qilish, jarohat bo'lsa tibbiy ko'rik tayinlash.",
      "Natijalarni rasmiylashtirish va javob choralarini qo'llash."
    ),
    pitfalls: ls(
      "Faqat jurnalni ko'rib, xonalarni va shaxslarni tekshirmaslik.",
      "Ushlanganlar bilan xodimlar ishtirokida suhbatlashish.",
      "Bayonnoma vaqtidagi farqni «texnik xato» deb qabul qilish.",
      "Qiynoq haqidagi arizani qayd etmaslik."
    ),
    legalBasis: [LAW_PROSECUTION, JPK, { lawKey: "lawPolice" }],
    questions: ls(
      "Ushlab turish joyini tekshirishni qanday boshlaysiz?",
      "Jurnalda 4 kishi, xonada 5 kishi bor. Nima qilasiz?",
      "Ushlanganlar bilan suhbatni nega alohida o'tkazish kerak?",
      "Ushlangan shaxs kaltaklanganini aytdi. Harakatlaringiz?",
      "Bayonnoma vaqti haqiqiy ushlash vaqtidan 6 soat keyin ko'rsatilgan. Bu nimani anglatadi?",
      "Qonunsiz ushlanganni ozod qilish kimning vakolati?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Qonunsiz ushlangan shaxs bilan prokuror nima qiladi?", ru: "Что прокурор делает с незаконно задержанным?" },
        options: [
          { id: "a", text: { uz: "Zudlik bilan ozod qiladi", ru: "Немедленно освобождает" }, correct: true },
          { id: "b", text: { uz: "Ertangi kun hal qiladi", ru: "Решает на следующий день" }, correct: false },
        ],
        explanation: { uz: "Qonunsiz ushlangan shaxs prokuror tomonidan zudlik bilan ozod qilinadi.", ru: "Незаконно задержанный немедленно освобождается прокурором." },
      },
      {
        id: "q2",
        question: { uz: "Qiynoq haqida ariza tushsa?", ru: "Поступило заявление о пытках?" },
        options: [
          { id: "a", text: { uz: "Qayd etish, tibbiy ko'rik tayinlash, tekshirish", ru: "Зафиксировать, назначить медосвидетельствование, проверить" }, correct: true },
          { id: "b", text: { uz: "Xodimlardan og'zaki so'rab, yopish", ru: "Устно спросить сотрудников и закрыть" }, correct: false },
        ],
        explanation: { uz: "Ariza zudlik bilan qayd etiladi, tibbiy ko'rik tayinlanadi va mustaqil tekshiriladi.", ru: "Заявление немедленно фиксируется, назначается медосвидетельствование и независимая проверка." },
      },
    ],
  },
  {
    id: "pr-davlat-ayblovi",
    agency: "prokuratura",
    professions: ["prokuror"],
    title: {
      uz: "Sudda davlat ayblovini qo'llab-quvvatlash asoslari",
      ru: "Основы поддержания государственного обвинения в суде",
      en: "Basics of state prosecution in court",
    },
    summary: {
      uz: "Sud jarayoniga tayyorgarlik, dalillarni taqdim etish, so'roq taktikasi, ayblovdan voz kechish asoslari va sud nutqi.",
      ru: "Подготовка к процессу, представление доказательств, тактика допроса, основания отказа от обвинения и речь в прениях.",
      en: "Preparing for trial, presenting evidence, questioning tactics, grounds for dropping charges and the closing speech.",
    },
    keyPoints: ls(
      "Davlat ayblovchisi ish materiallarini to'liq o'rganadi: ayblov xulosasi, dalillar, ularning maqbulligi va zaif tomonlari.",
      "Sud jarayonida tomonlarning tortishuvi va tengligi tamoyili amal qiladi: prokuror sudga ko'rsatma bermaydi, dalillar bilan ishontiradi.",
      "Dalillar tizimli tartibda taqdim etiladi — ayblovning har bir elementi dalil bilan tasdiqlanishi kerak.",
      "So'roqda yo'naltiruvchi savollar cheklangan; savollar aniq, qisqa va bitta faktga qaratilgan bo'ladi.",
      "Agar sud tergovida ayblov tasdiqlanmasa, prokuror ayblovdan to'liq yoki qisman voz kechishi shart.",
      "Barcha shubhalar sudlanuvchi foydasiga talqin qilinadi (aybsizlik prezumpsiyasi).",
      "Sud nutqida faktlar, dalillar tahlili, kvalifikatsiya va jazo bo'yicha asoslangan taklif beriladi.",
      "Prokuror sud qarori qonunga zid deb hisoblasa, belgilangan tartibda shikoyat (protest) keltiradi."
    ),
    steps: ls(
      "Ish materiallarini o'rganish va dalillar xaritasini tuzish.",
      "Guvohlar va ekspertlar so'roqi rejasini tayyorlash.",
      "Sud tergovida dalillarni taqdim etish va so'roqlarda ishtirok etish.",
      "Ayblov tasdiqlanganini qayta baholash, zarur bo'lsa ayblovni o'zgartirish yoki voz kechish.",
      "Sud muzokarasida nutq so'zlash.",
      "Hukmni o'rganish va zarur bo'lsa shikoyat keltirish."
    ),
    pitfalls: ls(
      "Ish materiallarini jarayon kuni birinchi marta o'qish.",
      "Tasdiqlanmagan ayblovni «tergov shunday yozgan» deb qo'llab-quvvatlashda davom etish.",
      "Guvohga javobni aytib beradigan savollar berish.",
      "Nutqda dalillar o'rniga his-tuyg'ularga tayanish."
    ),
    legalBasis: [JPK, LAW_PROSECUTION],
    questions: ls(
      "Sud jarayoniga tayyorgarlikni qanday tashkil qilasiz?",
      "Dalillar xaritasi nima va u nima beradi?",
      "Asosiy guvoh sudda ko'rsatmasini o'zgartirdi. Qanday harakat qilasiz?",
      "Qachon ayblovdan voz kechish kerak?",
      "Aybsizlik prezumpsiyasi prokuror ishida qanday namoyon bo'ladi?",
      "Sud nutqining tuzilishini ayting."
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Sud tergovida ayblov tasdiqlanmasa, prokuror...", ru: "Если обвинение не подтвердилось, прокурор..." },
        options: [
          { id: "a", text: { uz: "Ayblovdan voz kechishi shart", ru: "Обязан отказаться от обвинения" }, correct: true },
          { id: "b", text: { uz: "Tergov xulosasini baribir qo'llab-quvvatlaydi", ru: "Всё равно поддерживает обвинение" }, correct: false },
        ],
        explanation: { uz: "Prokuror faqat dalillar bilan tasdiqlangan ayblovni qo'llab-quvvatlaydi; aks holda voz kechadi.", ru: "Прокурор поддерживает только подтверждённое обвинение, иначе отказывается от него." },
      },
      {
        id: "q2",
        question: { uz: "Bartaraf etilmagan shubhalar...", ru: "Неустранимые сомнения..." },
        options: [
          { id: "a", text: { uz: "Sudlanuvchi foydasiga talqin qilinadi", ru: "Толкуются в пользу подсудимого" }, correct: true },
          { id: "b", text: { uz: "Ayblov foydasiga talqin qilinadi", ru: "Толкуются в пользу обвинения" }, correct: false },
        ],
        explanation: { uz: "Aybsizlik prezumpsiyasi: barcha bartaraf etilmagan shubhalar sudlanuvchi foydasiga.", ru: "Презумпция невиновности: неустранимые сомнения — в пользу подсудимого." },
      },
    ],
  },
];
