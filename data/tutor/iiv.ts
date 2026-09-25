import type { LocalizedText } from "@/data/sops/types";
import type { TutorTopic } from "@/data/kasblar/types";

/**
 * AI-tutor lesson cards — Ichki ishlar vazirligi (IIV).
 * Authored data: the tutor teaches only from these cards. Article numbers
 * appear only via `lawKey` (data/sops/laws.ts); otherwise law NAMES only.
 */

const L = (uz: string): LocalizedText => ({ uz });
const ls = (...items: string[]): LocalizedText[] => items.map(L);

export const IIV_TOPICS: TutorTopic[] = [
  {
    id: "iiv-ariza-qabul",
    agency: "iiv",
    professions: ["profilaktika", "surishtiruvchi", "tergovchi"],
    title: {
      uz: "Ariza va xabarni qabul qilish hamda ro'yxatga olish",
      ru: "Приём и регистрация заявлений и сообщений",
      en: "Receiving and registering reports",
    },
    summary: {
      uz: "Fuqaroning jinoyat yoki huquqbuzarlik haqidagi ariza-xabarini to'g'ri qabul qilish, ro'yxatga olish, dastlabki tekshiruvni tashkil etish va qonuniy qaror qabul qilish tartibi.",
      ru: "Порядок правильного приёма заявления о преступлении или правонарушении, его регистрации, организации проверки и принятия законного решения.",
      en: "How to properly receive a citizen's report of a crime or offence, register it, organise the check and reach a lawful decision.",
    },
    keyPoints: ls(
      "Jinoyat haqidagi har qanday ariza yoki xabar — og'zaki, yozma, telefon orqali yoki elektron — qabul qilinishi va ro'yxatga olinishi shart; qabul qilishni rad etish mumkin emas.",
      "Ariza qayd etilgach, fuqaroga qabul qilinganligi haqida ma'lumot (talon yoki ro'yxat raqami) beriladi.",
      "Og'zaki ariza bayonnoma bilan rasmiylashtiriladi va arizachi imzolaydi; bila turib yolg'on xabar berganlik uchun javobgarlik haqida ogohlantiriladi.",
      "Ariza bo'yicha qaror belgilangan muddatda (10 kun ichida) qabul qilinadi: jinoyat ishini qo'zg'atish, qo'zg'atishni rad etish yoki tegishliligi bo'yicha yuborish.",
      "Tekshiruv davomida tushuntirish xatlari olinadi, hujjatlar so'raladi, zarur bo'lsa voqea joyi ko'zdan kechiriladi.",
      "Agar holat ma'muriy huquqbuzarlik bo'lsa, ma'muriy tartibda ish yuritiladi; murojaat mazmunidagi boshqa masalalar murojaatlar to'g'risidagi qonun tartibida ko'rib chiqiladi.",
      "Arizachiga qabul qilingan qaror haqida xabar beriladi va uning shikoyat qilish huquqi tushuntiriladi.",
      "Arizani yashirish, ro'yxatga olmaslik yoki «kelishib qo'yish» — jiddiy intizomiy va qonuniy javobgarlikka olib keladi."
    ),
    steps: ls(
      "Fuqaroni xushmuomalalik bilan qabul qilish, o'zini tanishtirish va murojaat mazmunini to'liq tinglash.",
      "Arizani yozma shaklda olish yoki og'zaki arizani bayonnoma bilan rasmiylashtirish, yolg'on xabar uchun javobgarlikni tushuntirish.",
      "Arizani belgilangan jurnalda/elektron tizimda ro'yxatga olish va arizachiga qabul qilinganligi haqida ma'lumot berish.",
      "Rahbarga zudlik bilan bildirish va ijrochini belgilash; shoshilinch holatda voqea joyiga guruh yuborish.",
      "Dastlabki tekshiruv: tushuntirishlar, hujjatlar, ko'zdan kechirish, zarur ekspert xulosalari.",
      "Belgilangan muddatda protsessual qaror qabul qilish va arizachini xabardor qilish."
    ),
    pitfalls: ls(
      "«Bu jinoyat emas» deb arizani ro'yxatga olmasdan fuqaroni qaytarib yuborish.",
      "Og'zaki arizani bayonnomasiz qoldirish yoki arizachi imzosini olmaslik.",
      "10 kunlik qaror muddatini o'tkazib yuborish.",
      "Arizachini qabul qilingan qarordan xabardor qilmaslik va shikoyat huquqini tushuntirmaslik."
    ),
    legalBasis: [{ lawKey: "jpkRegister" }, { lawKey: "lawAppeals" }, { lawKey: "lawPolice" }],
    questions: ls(
      "Fuqaro navbatchilik qismiga kelib, telefoni o'g'irlanganini aytdi. Birinchi navbatda nima qilasiz va nima uchun?",
      "Og'zaki arizani qanday rasmiylashtirasiz? Bayonnomada nimalar bo'lishi kerak?",
      "Ariza bo'yicha qaror qabul qilish muddati qancha va qanday qarorlar bo'lishi mumkin?",
      "Arizachi «ismim chiqmasin» desa, qanday yo'l tutasiz?",
      "Holat jinoyat emas, balki ma'muriy huquqbuzarlik bo'lib chiqsa, ish qanday davom etadi?",
      "Nima uchun arizani ro'yxatga olmaslik xavfli? Oqibatlarini ayting."
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Jinoyat haqidagi ariza bo'yicha qaror qaysi muddatda qabul qilinadi?", ru: "В какой срок принимается решение по заявлению о преступлении?" },
        options: [
          { id: "a", text: { uz: "3 kun ichida", ru: "В течение 3 дней" }, correct: false },
          { id: "b", text: { uz: "10 kun ichida", ru: "В течение 10 дней" }, correct: true },
          { id: "c", text: { uz: "1 oy ichida", ru: "В течение 1 месяца" }, correct: false },
        ],
        explanation: { uz: "Jinoyat-protsessual kodeksiga ko'ra ariza va xabarlar bo'yicha qaror 10 kun ichida qabul qilinadi.", ru: "Согласно УПК решение по заявлениям и сообщениям принимается в течение 10 дней." },
      },
      {
        id: "q2",
        question: { uz: "Fuqaro og'zaki ariza berdi. To'g'ri harakat qaysi?", ru: "Гражданин сделал устное заявление. Какое действие верно?" },
        options: [
          { id: "a", text: { uz: "Yozma ariza olib kelishini so'rab qaytarish", ru: "Отправить за письменным заявлением" }, correct: false },
          { id: "b", text: { uz: "Bayonnoma tuzib, imzolatib, ro'yxatga olish", ru: "Составить протокол, получить подпись и зарегистрировать" }, correct: true },
          { id: "c", text: { uz: "Faqat daftarga qisqacha yozib qo'yish", ru: "Кратко записать в тетрадь" }, correct: false },
        ],
        explanation: { uz: "Og'zaki ariza bayonnoma bilan rasmiylashtiriladi, arizachi imzolaydi va u darhol ro'yxatga olinadi.", ru: "Устное заявление оформляется протоколом, подписывается заявителем и сразу регистрируется." },
      },
    ],
  },
  {
    id: "iiv-voqea-joyi",
    agency: "iiv",
    professions: ["tergovchi", "surishtiruvchi", "ekspert", "profilaktika"],
    title: {
      uz: "Voqea joyini ko'zdan kechirish",
      ru: "Осмотр места происшествия",
      en: "Crime scene examination",
    },
    summary: {
      uz: "Voqea joyini qo'riqlash, izlar va ashyoviy dalillarni aniqlash, qayd etish va olish, ko'zdan kechirish bayonnomasini tuzish jarayoni.",
      ru: "Охрана места происшествия, обнаружение, фиксация и изъятие следов и вещественных доказательств, составление протокола осмотра.",
      en: "Securing the scene, finding, recording and seizing traces and physical evidence, and drafting the examination record.",
    },
    keyPoints: ls(
      "Birinchi yetib kelgan xodimning vazifasi — jabrlanuvchiga yordam, xavfni bartaraf etish va voqea joyini begona shaxslardan qo'riqlash.",
      "Ko'zdan kechirish tergovchi yoki surishtiruvchi tomonidan, zarur bo'lsa mutaxassis (ekspert-kriminalist) ishtirokida o'tkaziladi.",
      "Ko'zdan kechirish umumiydan xususiyga yoki markazdan chetga qarab — tizimli usulda olib boriladi.",
      "Har bir iz va buyum avval joyida suratga olinadi, o'lchanadi, keyin olinadi, qadoqlanadi va muhrlanadi.",
      "Og'ir jinoyatlarda ko'zdan kechirishni videoyozuvga olish talab etiladi; bu dalillarning maqbulligini oshiradi.",
      "Turar joyni egasining roziligisiz ko'zdan kechirish sud ruxsatini talab qiladi (kechiktirib bo'lmaydigan hollardan tashqari, keyinchalik qonuniylik tekshiriladi).",
      "Ko'zdan kechirish bayonnomasida faqat ko'rilgan faktlar yoziladi, taxmin va xulosalar yozilmaydi.",
      "Olingan dalillarning saqlash zanjiri (kim, qachon, kimga topshirdi) uzilmasligi kerak."
    ),
    steps: ls(
      "Voqea joyiga yetib kelish, xavfsizlikni ta'minlash, jabrlanuvchiga birinchi yordam va tez yordam chaqirish.",
      "Voqea joyi chegarasini belgilash, o'rab olish, begona shaxslarni kiritmaslik, kirib-chiqqanlarni qayd etish.",
      "Tergovchi/surishtiruvchi va mutaxassis kelgach, holatni ular ixtiyoriga topshirish, ko'rgan-bilganlarini aytish.",
      "Umumiy ko'rik, foto/videoqayd, so'ng batafsil ko'rik: izlarni aniqlash, o'lchash, qayd etish.",
      "Dalillarni olish, alohida qadoqlash, muhrlash va yorliqlash.",
      "Ko'zdan kechirish bayonnomasini tuzish, ishtirokchilarga o'qib berish va imzolatish."
    ),
    pitfalls: ls(
      "Qiziquvchilar, qarindoshlar yoki boshqa xodimlarni voqea joyiga kiritib, izlarni yo'q qilish.",
      "Buyumni suratga olmasdan joyidan qo'zg'atish.",
      "Bayonnomaga taxmin va xulosalarni yozish.",
      "Dalillarni bitta paketga aralash qadoqlash va muhrlamaslik."
    ),
    legalBasis: [{ lawKey: "jpkInspection" }, { lawKey: "jpkVideo" }],
    questions: ls(
      "Siz voqea joyiga birinchi yetib keldingiz. Dastlabki uchta harakatingizni ketma-ketlikda ayting.",
      "Voqea joyi chegarasini qanday belgilaysiz va nima uchun uni kengroq olish tavsiya etiladi?",
      "Pichoq polda yotibdi. Uni olishdan oldin nimalar qilinishi kerak?",
      "Ko'zdan kechirish bayonnomasiga nimalarni yozish mumkin emas va nima uchun?",
      "Qanday holatlarda turar joyni ko'zdan kechirish uchun sud ruxsati kerak bo'ladi?",
      "Dalil saqlash zanjiri nima va u uzilsa nima bo'ladi?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Voqea joyida topilgan buyum bilan birinchi nima qilinadi?", ru: "Что первым делом делают с предметом, обнаруженным на месте происшествия?" },
        options: [
          { id: "a", text: { uz: "Darhol paketga solinadi", ru: "Сразу упаковывают" }, correct: false },
          { id: "b", text: { uz: "Joyida suratga olinadi va o'lchanadi", ru: "Фотографируют и измеряют на месте" }, correct: true },
          { id: "c", text: { uz: "Bo'limga olib ketiladi", ru: "Увозят в отдел" }, correct: false },
        ],
        explanation: { uz: "Buyum avval joyida qayd etiladi (foto, o'lcham, joylashuv), shundan keyingina olinadi va qadoqlanadi.", ru: "Сначала предмет фиксируется на месте (фото, размеры, расположение), только затем изымается и упаковывается." },
      },
      {
        id: "q2",
        question: { uz: "Bayonnomaga nima yoziladi?", ru: "Что записывается в протокол?" },
        options: [
          { id: "a", text: { uz: "Faqat ko'rilgan va qayd etilgan faktlar", ru: "Только увиденные и зафиксированные факты" }, correct: true },
          { id: "b", text: { uz: "Aybdor kimligi haqidagi taxmin", ru: "Предположение о виновном" }, correct: false },
          { id: "c", text: { uz: "Guvohlarning fikrlari", ru: "Мнения свидетелей" }, correct: false },
        ],
        explanation: { uz: "Ko'zdan kechirish bayonnomasi obyektiv hujjat: unda faqat faktlar, taxminsiz yoziladi.", ru: "Протокол осмотра — объективный документ: только факты, без предположений." },
      },
    ],
  },
  {
    id: "iiv-profilaktik-hisob",
    agency: "iiv",
    professions: ["profilaktika", "psixolog"],
    title: {
      uz: "Profilaktik hisob va yakka tartibdagi profilaktika",
      ru: "Профилактический учёт и индивидуальная профилактика",
      en: "Preventive registration and individual prevention",
    },
    summary: {
      uz: "Shaxsni profilaktik hisobga olish asoslari, yakka tartibdagi profilaktika rejasini tuzish, hamkorlar bilan ishlash va hisobdan chiqarish tartibi.",
      ru: "Основания постановки на профилактический учёт, план индивидуальной профилактики, работа с партнёрами и снятие с учёта.",
      en: "Grounds for preventive registration, drafting an individual prevention plan, working with partners and removal from the register.",
    },
    keyPoints: ls(
      "Profilaktika tizimi umumiy, maxsus, yakka tartibdagi va viktimologik profilaktikadan iborat.",
      "Profilaktik hisobga olish faqat qonunda nazarda tutilgan asoslar bilan va rasmiy qaror asosida amalga oshiriladi.",
      "Yakka tartibdagi profilaktika — muayyan shaxsning g'ayriijtimoiy xulqiga ta'sir o'tkazish choralari (suhbat, ogohlantirish, ijtimoiy yordam, bandlikka ko'maklashish).",
      "Har bir hisobdagi shaxs uchun yakka tartibdagi profilaktika rejasi tuziladi va bajarilishi hujjatlashtiriladi.",
      "Inspektor mahalla, xotin-qizlar faoli, yoshlar yetakchisi, maktab va tibbiyot muassasalari bilan hamkorlikda ishlaydi.",
      "Profilaktik ta'sir choralari shaxsning huquq va erkinliklarini cheklamasligi, uni kamsitmasligi kerak.",
      "Asoslar bartaraf etilganda shaxs hisobdan chiqariladi va bu ham hujjat bilan rasmiylashtiriladi.",
      "Profilaktika natijasi — takroriy huquqbuzarlikning oldini olish; formal «tadbir o'tkazildi» yozuvi maqsad emas."
    ),
    steps: ls(
      "Asoslarni aniqlash: huquqbuzarliklar tarixi, sud qarorlari, murojaatlar, hamkorlardan ma'lumot.",
      "Hisobga olish haqida qaror tayyorlash va rahbar tasdig'idan o'tkazish.",
      "Shaxs bilan tanishuv suhbati, turmush sharoitini o'rganish, xavf omillarini aniqlash.",
      "Yakka tartibdagi profilaktika rejasini tuzish: choralar, muddatlar, mas'ul hamkorlar.",
      "Rejani bajarish va har bir tadbirni hujjatlashtirish, natijani baholash.",
      "Asoslar bartaraf bo'lganda hisobdan chiqarish yoki qo'shimcha choralar belgilash."
    ),
    pitfalls: ls(
      "Qonuniy asos va qarorsiz shaxsni «ro'yxatga» kiritib qo'yish.",
      "Rejani faqat qog'ozda tuzib, amalda ishlamaslik.",
      "Shaxsni ish joyi yoki qo'shnilar oldida obro'sizlantiradigan harakatlar.",
      "Asos yo'qolganda ham hisobdan chiqarmaslik."
    ),
    legalBasis: [{ lawKey: "lawPrevention" }, { lawKey: "regInspector" }],
    questions: ls(
      "Profilaktikaning qanday turlarini bilasiz? Har biriga bittadan misol keltiring.",
      "Shaxsni profilaktik hisobga olish uchun nima zarur? Faqat qo'shnining shikoyati yetarlimi?",
      "Yakka tartibdagi profilaktika rejasiga qanday choralarni kiritasiz?",
      "Qaysi hamkorlarni jalb qilasiz va ularning har biri qanday yordam beradi?",
      "Shaxs qachon hisobdan chiqariladi?",
      "Profilaktik suhbatni qanday o'tkazasiz, shunda shaxs kamsitilgan his qilmasin?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Shaxsni profilaktik hisobga olish uchun nima shart?", ru: "Что обязательно для постановки лица на профилактический учёт?" },
        options: [
          { id: "a", text: { uz: "Qonunda nazarda tutilgan asos va rasmiy qaror", ru: "Предусмотренное законом основание и официальное решение" }, correct: true },
          { id: "b", text: { uz: "Inspektorning shaxsiy fikri", ru: "Личное мнение инспектора" }, correct: false },
          { id: "c", text: { uz: "Mahalla yig'inining og'zaki iltimosi", ru: "Устная просьба схода махалли" }, correct: false },
        ],
        explanation: { uz: "Hisobga olish faqat qonundagi asoslar bilan va qaror asosida amalga oshiriladi.", ru: "Постановка на учёт — только по основаниям закона и на основании решения." },
      },
      {
        id: "q2",
        question: { uz: "Yakka tartibdagi profilaktikaning asosiy maqsadi nima?", ru: "Какова главная цель индивидуальной профилактики?" },
        options: [
          { id: "a", text: { uz: "Hisobot uchun tadbirlar sonini oshirish", ru: "Увеличить число мероприятий для отчёта" }, correct: false },
          { id: "b", text: { uz: "Takroriy huquqbuzarlikning oldini olish", ru: "Предупредить повторное правонарушение" }, correct: true },
          { id: "c", text: { uz: "Shaxsni jazolash", ru: "Наказать лицо" }, correct: false },
        ],
        explanation: { uz: "Profilaktika jazo emas — u xulqqa ta'sir o'tkazib, takroriy huquqbuzarlikning oldini olishga qaratilgan.", ru: "Профилактика — не наказание, её цель — предупредить повторные правонарушения." },
      },
    ],
  },
  {
    id: "iiv-himoya-orderi",
    agency: "iiv",
    professions: ["profilaktika", "psixolog"],
    title: {
      uz: "Himoya orderi: berish va ijrosini nazorat qilish",
      ru: "Охранный ордер: выдача и контроль исполнения",
      en: "Protection order: issuing and monitoring",
    },
    summary: {
      uz: "Tazyiq va zo'ravonlikka uchragan shaxsga himoya orderini berish asoslari, tartibi, tajovuzkorga qo'yiladigan taqiqlar va ijroni monitoring qilish.",
      ru: "Основания и порядок выдачи охранного ордера пострадавшему от притеснения и насилия, запреты для агрессора и мониторинг исполнения.",
      en: "Grounds and procedure for issuing a protection order to a victim of harassment and violence, restrictions on the aggressor and monitoring.",
    },
    keyPoints: ls(
      "Himoya orderi — tazyiq va zo'ravonlikdan jabrlanuvchiga davlat himoyasini ta'minlovchi hujjat; u jabrlanuvchining arizasi yoki xabar asosida beriladi.",
      "Orderni berishda jabrlanuvchining xavfsizligi birinchi o'rinda: tajovuzkor bilan birga «yarashtirish» uchrashuvi orderni almashtira olmaydi.",
      "Order tajovuzkorga jabrlanuvchi bilan aloqa qilish, uni ta'qib qilish, qidirish va zo'ravonlik qilishni taqiqlaydi; qo'shimcha cheklovlar Nizomda belgilangan.",
      "Order tajovuzkorga ma'lum qilinadi va unga talablarni bajarmaslik oqibatlari tushuntiriladi.",
      "Himoya orderi talablarini bajarmaslik ma'muriy javobgarlikka sabab bo'ladi.",
      "Jabrlanuvchiga reabilitatsiya markazlari, psixologik va huquqiy yordam imkoniyatlari haqida ma'lumot beriladi.",
      "Order muddati, uzaytirish va monitoring tartibi Vazirlar Mahkamasining tegishli Nizomi bilan belgilanadi.",
      "Inspektor ijroni muntazam tekshiradi va har bir aloqani hujjatlashtiradi."
    ),
    steps: ls(
      "Murojaatni qabul qilish, jabrlanuvchini xavfsiz joyda, alohida tinglash.",
      "Xavfni baholash: zo'ravonlik turi, takrorlanishi, bolalar borligi, qurol yoki tahdid.",
      "Himoya orderini rasmiylashtirish va jabrlanuvchiga topshirish.",
      "Tajovuzkorga orderni ma'lum qilish, taqiqlar va javobgarlikni tushuntirish, imzolatish.",
      "Jabrlanuvchini yordam xizmatlariga yo'naltirish (reabilitatsiya markazi, psixolog).",
      "Ijroni monitoring qilish, buzilish holatida ma'muriy bayonnoma rasmiylashtirish."
    ),
    pitfalls: ls(
      "Jabrlanuvchini tajovuzkor ishtirokida so'roq qilish yoki «oilaviy masala» deb yarashtirishga majburlash.",
      "Xavfni baholamasdan orderni rasmiyatchilik uchun berish.",
      "Tajovuzkorni order bilan tanishtirmaslik — keyin buzilishni isbotlash qiyinlashadi.",
      "Monitoringni o'tkazmaslik va buzilishga javob choralarini ko'rmaslik."
    ),
    legalBasis: [{ lawKey: "lawDv" }, { lawKey: "regProtectionOrder" }, { lawKey: "mjtkOrderBreach" }],
    questions: ls(
      "Ayol kechasi qo'ng'iroq qilib, eri urganini aytdi. Sizning birinchi harakatlaringiz qanday?",
      "Nima uchun jabrlanuvchini tajovuzkordan alohida tinglash kerak?",
      "Xavfni baholashda qaysi omillarga e'tibor berasiz?",
      "Himoya orderi tajovuzkorga qanday cheklovlar qo'yadi?",
      "Tajovuzkor orderni buzsa, qanday javob chorasi ko'riladi?",
      "Jabrlanuvchini qaysi yordam xizmatlariga yo'naltirish mumkin?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Himoya orderi talablarini bajarmaslik qanday javobgarlikka olib keladi?", ru: "Какую ответственность влечёт неисполнение охранного ордера?" },
        options: [
          { id: "a", text: { uz: "Hech qanday", ru: "Никакой" }, correct: false },
          { id: "b", text: { uz: "Ma'muriy javobgarlik", ru: "Административную ответственность" }, correct: true },
          { id: "c", text: { uz: "Faqat og'zaki ogohlantirish", ru: "Только устное предупреждение" }, correct: false },
        ],
        explanation: { uz: "Ma'muriy javobgarlik to'g'risidagi kodeksda himoya orderi talablarini bajarmaslik uchun javobgarlik belgilangan.", ru: "КоАО предусматривает ответственность за неисполнение требований охранного ордера." },
      },
      {
        id: "q2",
        question: { uz: "Jabrlanuvchi bilan birinchi suhbat qanday o'tkaziladi?", ru: "Как проводится первая беседа с пострадавшей?" },
        options: [
          { id: "a", text: { uz: "Er bilan birga, yarashtirish maqsadida", ru: "Вместе с мужем, чтобы примирить" }, correct: false },
          { id: "b", text: { uz: "Alohida, xavfsiz joyda", ru: "Отдельно, в безопасном месте" }, correct: true },
          { id: "c", text: { uz: "Qo'shnilar ishtirokida", ru: "В присутствии соседей" }, correct: false },
        ],
        explanation: { uz: "Jabrlanuvchi tajovuzkor bosimisiz, xavfsiz sharoitda alohida tinglanadi.", ru: "Пострадавшую выслушивают отдельно, в безопасной обстановке, без давления агрессора." },
      },
    ],
  },
  {
    id: "iiv-mamuriy-bayonnoma",
    agency: "iiv",
    professions: ["profilaktika", "surishtiruvchi"],
    title: {
      uz: "Ma'muriy huquqbuzarlik bayonnomasini rasmiylashtirish",
      ru: "Оформление протокола об административном правонарушении",
      en: "Drafting an administrative offence record",
    },
    summary: {
      uz: "Ma'muriy huquqbuzarlikni aniqlash, bayonnoma tuzish, huquqbuzarga huquqlarini tushuntirish va ishni ko'rib chiqish uchun yuborish tartibi.",
      ru: "Выявление административного правонарушения, составление протокола, разъяснение прав и направление дела на рассмотрение.",
      en: "Detecting an administrative offence, drafting the record, explaining rights and forwarding the case for consideration.",
    },
    keyPoints: ls(
      "Bayonnoma — ma'muriy ishni qo'zg'atuvchi asosiy hujjat; u vakolatli mansabdor shaxs tomonidan tuziladi.",
      "Bayonnomada tuzilgan sana va joy, tuzuvchi, huquqbuzar shaxsi, huquqbuzarlik vaqti, joyi, mohiyati, tegishli modda, guvohlar va jabrlanuvchilar ko'rsatiladi.",
      "Huquqbuzarga uning huquqlari (tushuntirish berish, dalil taqdim etish, advokat yordamidan foydalanish, ona tilida so'zlash) tushuntiriladi.",
      "Huquqbuzar bayonnomani imzolaydi; rad etsa, bu bayonnomada qayd etiladi va u o'z e'tirozlarini yozishga haqli.",
      "Bayonnomaga dalillar (fotosurat, video, tushuntirishlar) ilova qilinadi.",
      "Ish vakolatli organ yoki sudga ko'rib chiqish uchun yuboriladi; ko'rib chiqishning umumiy muddati — 15 kun.",
      "Bir huquqbuzarlik uchun ikki marta bayonnoma tuzilmaydi; noaniq yoki taxminiy ma'lumot bayonnomani qonunsiz qiladi.",
      "Mayda bezorilik, jamoat joyida spirtli ichimlik ichish kabi tarkiblarni jinoyatdan to'g'ri farqlash zarur."
    ),
    steps: ls(
      "Huquqbuzarlikni to'xtatish va o'zini tanishtirish.",
      "Shaxsni aniqlash (hujjat asosida), guvohlarni va dalillarni qayd etish.",
      "Huquqbuzarga huquqlarini tushuntirish.",
      "Bayonnomani barcha majburiy rekvizitlar bilan to'ldirish.",
      "Huquqbuzar va guvohlarga imzolatish, rad etish yoki e'tirozlarni qayd etish, nusxasini berish.",
      "Ishni ilovalar bilan ko'rib chiqish uchun yuborish."
    ),
    pitfalls: ls(
      "Modda raqamini noto'g'ri ko'rsatish yoki tarkibni noto'g'ri kvalifikatsiya qilish.",
      "Huquqlarni tushuntirmaslik — bayonnoma keyin bekor qilinishi mumkin.",
      "Imzodan bosh tortishni qayd etmaslik.",
      "Dalillarni ilova qilmaslik va guvohlarni ko'rsatmaslik."
    ),
    legalBasis: [{ lawKey: "mjtkProtocol" }, { lawKey: "mjtkConsideration" }, { lawKey: "mjtkPettyHooliganism" }, { lawKey: "mjtkPublicDrinking" }],
    questions: ls(
      "Bayonnomaning majburiy rekvizitlarini sanab bering.",
      "Huquqbuzar bayonnomani imzolashdan bosh tortdi. Nima qilasiz?",
      "Huquqbuzarga qaysi huquqlarini tushuntirasiz?",
      "Mayda bezorilikni jinoiy bezorilikdan qanday farqlaysiz?",
      "Bayonnomaga qanday dalillarni ilova qilasiz?",
      "Bayonnoma nima sababdan sudda bekor qilinishi mumkin?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Huquqbuzar imzolashdan bosh tortsa-chi?", ru: "Если нарушитель отказался подписать протокол?" },
        options: [
          { id: "a", text: { uz: "Bayonnoma bekor qilinadi", ru: "Протокол аннулируется" }, correct: false },
          { id: "b", text: { uz: "Rad etish bayonnomada qayd etiladi", ru: "Отказ фиксируется в протоколе" }, correct: true },
          { id: "c", text: { uz: "Uning o'rniga xodim imzolaydi", ru: "Вместо него подписывает сотрудник" }, correct: false },
        ],
        explanation: { uz: "Imzodan bosh tortish bayonnomada qayd etiladi; bu bayonnomaning kuchini yo'qotmaydi.", ru: "Отказ от подписи фиксируется в протоколе; это не лишает протокол силы." },
      },
      {
        id: "q2",
        question: { uz: "Ma'muriy ishni ko'rib chiqishning umumiy muddati?", ru: "Общий срок рассмотрения административного дела?" },
        options: [
          { id: "a", text: { uz: "15 kun", ru: "15 дней" }, correct: true },
          { id: "b", text: { uz: "3 oy", ru: "3 месяца" }, correct: false },
          { id: "c", text: { uz: "24 soat", ru: "24 часа" }, correct: false },
        ],
        explanation: { uz: "Ma'muriy ishlarni ko'rib chiqishning umumiy muddati 15 kun (aniq moddani lex.uz'da tasdiqlang).", ru: "Общий срок рассмотрения — 15 дней (номер статьи уточните на lex.uz)." },
      },
    ],
  },
  {
    id: "iiv-ushlab-turish",
    agency: "iiv",
    professions: ["surishtiruvchi", "tergovchi", "profilaktika"],
    title: {
      uz: "Ushlab turish va huquqlarni tushuntirish",
      ru: "Задержание и разъяснение прав",
      en: "Detention and explaining rights",
    },
    summary: {
      uz: "Shaxsni gumon asosida ushlab turishning asoslari, ushlash vaqtida huquqlarni tushuntirish, bayonnoma va prokurorni xabardor qilish tartibi.",
      ru: "Основания задержания по подозрению, разъяснение прав в момент задержания, протокол и уведомление прокурора.",
      en: "Grounds for detaining a suspect, explaining rights at the moment of detention, the record and notifying the prosecutor.",
    },
    keyPoints: ls(
      "Ushlab turish — jinoyat sodir etishda gumon qilingan shaxsni qisqa muddatga ozodlikdan mahrum qilish; faqat qonunda sanab o'tilgan asoslar bo'lganda qo'llaniladi.",
      "Ushlash paytida shaxsga ushlash sababi va uning huquqlari darhol tushuntiriladi: advokat yordami, jim turish, yaqinlarini xabardor qilish, tarjimon.",
      "Advokat ishtirok etish huquqi ushlangan paytdan boshlab ta'minlanadi.",
      "Ushlab turish bayonnomasi tuziladi: vaqt (soat va daqiqa), asoslar, tushuntirilgan huquqlar, shaxsiy tintuv natijalari.",
      "Ushlab turish haqida prokurorga belgilangan muddatda yozma xabar beriladi.",
      "Ushlab turish muddati qonunda qat'iy cheklangan; muddat tugaguncha sud qarori bo'lmasa shaxs ozod qilinadi.",
      "Jismoniy kuch faqat qarshilik ko'rsatilganda va mutanosib darajada qo'llaniladi; tan jarohatlari qayd etiladi.",
      "Qiynoq, tahdid yoki aldov bilan olingan ko'rsatuv dalil sifatida yaroqsiz va javobgarlikka sabab bo'ladi."
    ),
    steps: ls(
      "Asosni aniqlash: jinoyat ustida qo'lga tushish, guvohlar ko'rsatishi, izlar va boshqa qonuniy asoslar.",
      "O'zini tanishtirish, ushlash sababini va huquqlarni tushuntirish.",
      "Xavfsizlik uchun yuzaki ko'rik, zarur bo'lsa mutanosib kuch qo'llash.",
      "Bo'limga olib kelish va ushlab turish bayonnomasini aniq vaqt bilan tuzish.",
      "Yaqinlarini xabardor qilish imkonini berish, advokat ishtirokini ta'minlash.",
      "Prokurorga yozma xabar berish va muddatni nazorat qilish."
    ),
    pitfalls: ls(
      "Huquqlarni tushuntirmasdan «suhbat» niqobida so'roq qilish.",
      "Ushlash vaqtini bayonnomada kechroq ko'rsatish.",
      "Advokatni kechiktirish yoki «keyin chaqiramiz» deyish.",
      "Muddat tugaganini kuzatmaslik va shaxsni asossiz ushlab qolish."
    ),
    legalBasis: [{ lawKey: "lawPolice" }, { title: { uz: "Jinoyat-protsessual kodeksi (ushlab turish to'g'risidagi qoidalar)" } }],
    questions: ls(
      "Qanday holatlarda shaxsni gumon asosida ushlab turish mumkin?",
      "Ushlash paytida qaysi huquqlarni tushuntirasiz? Qanday so'zlar bilan aytasiz?",
      "Ushlab turish bayonnomasida vaqtni aniq ko'rsatish nega muhim?",
      "Ushlangan shaxs advokat so'radi, lekin advokat kechikmoqda. So'roqni boshlaysizmi?",
      "Ushlab turish muddati tugasa-yu sud qarori bo'lmasa, nima qilasiz?",
      "Ushlash vaqtida shaxs qarshilik ko'rsatdi. Kuch qo'llagandan keyin nimalarni hujjatlashtirasiz?"
    ),
    quiz: [
      {
        id: "q1",
        question: { uz: "Advokat yordamidan foydalanish huquqi qachondan ta'minlanadi?", ru: "С какого момента обеспечивается право на адвоката?" },
        options: [
          { id: "a", text: { uz: "Ushlangan paytdan boshlab", ru: "С момента задержания" }, correct: true },
          { id: "b", text: { uz: "Ayblov e'lon qilingandan keyin", ru: "После предъявления обвинения" }, correct: false },
          { id: "c", text: { uz: "Faqat sudda", ru: "Только в суде" }, correct: false },
        ],
        explanation: { uz: "Ushlangan shaxs ushlangan paytdan boshlab advokat yordamidan foydalanish huquqiga ega.", ru: "Задержанный имеет право на помощь адвоката с момента задержания." },
      },
      {
        id: "q2",
        question: { uz: "Tahdid bilan olingan ko'rsatuv...", ru: "Показания, полученные под угрозой..." },
        options: [
          { id: "a", text: { uz: "Agar to'g'ri bo'lsa, dalil bo'ladi", ru: "Являются доказательством, если правдивы" }, correct: false },
          { id: "b", text: { uz: "Dalil sifatida yaroqsiz", ru: "Недопустимы как доказательство" }, correct: true },
          { id: "c", text: { uz: "Prokuror ruxsati bilan ishlatiladi", ru: "Используются с разрешения прокурора" }, correct: false },
        ],
        explanation: { uz: "Qiynoq, tahdid yoki aldov bilan olingan ko'rsatuv dalil sifatida yaroqsiz va xodimning javobgarligiga sabab bo'ladi.", ru: "Показания, полученные пыткой, угрозой или обманом, недопустимы и влекут ответственность сотрудника." },
      },
    ],
  },
];
