import type { LocalizedText, ProfessionSim } from "../types";

const L = (uz: string, ru: string, en?: string): LocalizedText => (en ? { uz, ru, en } : { uz, ru });

/**
 * B-01 — Bojxona inspektori: chegara nazorat postidagi yuk avtomobili.
 * Muhit: nazorat posti (customs_post) — deklaratsiya, invoys, CMR, qadoqlash varag'i.
 *
 * DIQQAT: TIF TN kodlari, stavkalar va valyuta kursi — O'QUV QIYMATLARI (illustrative),
 * rasmiy tarif emas. Huquqiy asos faqat nomi bilan: «Bojxona kodeksi».
 */
export const SIM_BOJXONA: ProfessionSim = {
  id: "sim-bojxona-01",
  professionId: "bojxona",
  code: "B-01",
  title: L("Elektronika yuki: deklaratsiyadagi nomuvofiqliklar", "Груз электроники: несоответствия в декларации", "Electronics cargo: declaration mismatches"),
  setting: L(
    "Avtomobil nazorat posti, import yo'nalishi",
    "Автомобильный пункт пропуска, направление импорта",
    "Road border checkpoint, import lane"
  ),
  env: "customs_post",
  intro: L(
    "Postga yarim tirkamali yuk avtomobili keldi. Deklarant elektron deklaratsiyani oldindan yuborgan. Siz hujjatlarni tekshirishingiz, tovarni tasniflashingiz, bojxona qiymati va to'lovlarni hisoblashingiz, xavf profilini baholashingiz va yakuniy qaror qabul qilishingiz kerak. Mashg'ulotdagi TIF TN kodlari va stavkalar — o'quv qiymatlari.",
    "На пост прибыл грузовик с полуприцепом. Декларант заранее подал электронную декларацию. Вам нужно проверить документы, классифицировать товар, рассчитать таможенную стоимость и платежи, оценить профиль риска и принять итоговое решение. Коды ТН ВЭД и ставки в занятии — учебные значения.",
    "A semi-trailer truck arrives at the post. The declarant filed an electronic declaration in advance. Check documents, classify the goods, calculate customs value and payments, assess the risk profile and decide. HS codes and rates here are training values."
  ),
  minutes: 25,
  stages: [
    /* 1 ------------------------------------------------------------ */
    {
      id: "b1-docs",
      title: L("Hujjatlarni solishtirish", "Сверка документов", "Document cross-check"),
      brief: L(
        "Deklaratsiyani invoys, CMR, qadoqlash varag'i va kelib chiqish sertifikati bilan solishtiring. Nomuvofiqliklarni toping.",
        "Сверьте декларацию с инвойсом, CMR, упаковочным листом и сертификатом происхождения. Найдите несоответствия.",
        "Cross-check the declaration against the invoice, CMR, packing list and certificate of origin. Find mismatches."
      ),
      materials: [
        {
          id: "b-decl",
          kind: "declaration",
          title: L("Yuk bojxona deklaratsiyasi (import)", "Декларация на товары (импорт)"),
          body: L(
            "Deklarant: «Global Tech Trade» MChJ, Toshkent. Jo'natuvchi: Shenzhen Mobile Co., Ltd. Transport: 01 A 777 AA / tirkama 01 1234 A. Tovarlar: 1) smartfonlar — 200 dona; 2) silikon g'iloflar — 2 000 dona.",
            "Декларант: ООО «Global Tech Trade», Ташкент. Отправитель: Shenzhen Mobile Co., Ltd. Транспорт: 01 A 777 AA / прицеп 01 1234 A. Товары: 1) смартфоны — 200 шт.; 2) силиконовые чехлы — 2 000 шт."
          ),
          meta: [
            { label: L("Kelib chiqish mamlakati", "Страна происхождения"), value: "Vyetnam / Вьетнам" },
            { label: L("Brutto og'irlik", "Вес брутто"), value: "520 kg" },
            { label: L("Invoys qiymati", "Фактурная стоимость"), value: "18 600 USD" },
            { label: L("Yetkazib berish sharti", "Условия поставки"), value: "FCA Shenzhen" },
          ],
        },
        {
          id: "b-invoice",
          kind: "document",
          title: L("Invoys №SZ-0918", "Инвойс №SZ-0918"),
          body: L("Tijorat hisob-fakturasi.", "Коммерческий счёт-фактура."),
          table: {
            head: ["#", "Tovar / Товар", "Soni / Кол-во", "Narx / Цена, USD", "Jami / Итого, USD"],
            rows: [
              [1, "Smartphone X12 128GB", 200, 90, 18000],
              [2, "Silicone case", 2000, 0.3, 600],
            ],
          },
        },
        {
          id: "b-cmr",
          kind: "document",
          title: L("CMR yuk xati", "Накладная CMR"),
          body: L("Xalqaro tovar-transport yuk xati.", "Международная товарно-транспортная накладная."),
          meta: [
            { label: L("Transport", "Транспорт"), value: "01 A 777 AA / 01 1234 A" },
            { label: L("Joylar soni", "Мест"), value: "72" },
            { label: L("Brutto", "Брутто"), value: "780 kg" },
          ],
        },
        {
          id: "b-packing",
          kind: "table",
          title: L("Qadoqlash varag'i (packing list)", "Упаковочный лист (packing list)"),
          body: L("Jo'natuvchi tomonidan tuzilgan.", "Составлен отправителем."),
          table: {
            head: ["Joy / Места", "Mazmun / Содержимое", "Soni / Кол-во", "Brutto, kg"],
            rows: [
              ["1–20", "Smartphone X12", 200, 180],
              ["21–32", "Silicone case", 2000, 120],
              ["33–52", "Charger 20W", 500, 260],
              ["53–72", "USB-C cable", 1000, 220],
            ],
          },
          tone: "warn",
        },
        {
          id: "b-origin",
          kind: "document",
          title: L("Kelib chiqish sertifikati", "Сертификат происхождения"),
          body: L("Mamlakat: Xitoy Xalq Respublikasi. Tovar: smartfonlar, aksessuarlar.", "Страна: Китайская Народная Республика. Товар: смартфоны, аксессуары."),
        },
      ],
      task: {
        kind: "multi",
        prompt: L("Hujjatlar o'rtasidagi haqiqiy nomuvofiqliklarni belgilang.", "Отметьте реальные несоответствия между документами."),
        options: [
          { id: "a", text: L("Brutto og'irlik: deklaratsiyada 520 kg, CMR'da 780 kg", "Вес брутто: в декларации 520 кг, в CMR 780 кг"), correct: true },
          { id: "b", text: L("Qadoqlash varag'ida deklaratsiyada ko'rsatilmagan tovarlar bor (zaryadlovchi, kabel)", "В упаковочном листе есть товары, не указанные в декларации (зарядки, кабели)"), correct: true },
          { id: "c", text: L("Kelib chiqish mamlakati: deklaratsiyada Vyetnam, sertifikatda Xitoy", "Страна происхождения: в декларации Вьетнам, в сертификате Китай"), correct: true },
          {
            id: "d",
            text: L("Invoys summasi deklaratsiyadagi qiymatga mos kelmaydi", "Сумма инвойса не совпадает со стоимостью в декларации"),
            correct: false,
            feedback: L("Ikkalasida ham 18 600 USD — bu yerda mos.", "В обоих документах 18 600 USD — здесь совпадает."),
          },
          {
            id: "e",
            text: L("Transport vositasi raqami CMR bilan mos emas", "Номер транспортного средства не совпадает с CMR"),
            correct: false,
            feedback: L("Raqamlar bir xil: 01 A 777 AA / 01 1234 A.", "Номера совпадают: 01 A 777 AA / 01 1234 A."),
          },
        ],
      },
      competencies: ["bojxona.hujjat_nazorat"],
      consequence: L(
        "Nomuvofiqliklar o'tkazib yuborilsa, deklaratsiya qilinmagan tovar chegaradan o'tadi, davlat budjeti to'lovlarni ololmaydi, inspektor esa xizmat tekshiruviga tortiladi.",
        "Если несоответствия пропущены, незадекларированный товар пересекает границу, бюджет недополучает платежи, а инспектор попадает под служебную проверку."
      ),
    },

    /* 2 ------------------------------------------------------------ */
    {
      id: "b2-classify",
      title: L("Tovarlarni tasniflash", "Классификация товаров", "Classifying the goods"),
      brief: L(
        "Rentgen skanerlash qadoqlash varag'ini tasdiqladi: yukda to'rt turdagi tovar bor. Har birini TIF TN bo'yicha tasniflang (o'quv kodlari — mashg'ulot uchun soddalashtirilgan).",
        "Рентген подтвердил упаковочный лист: в грузе четыре вида товаров. Классифицируйте каждый по ТН ВЭД (учебные коды, упрощены для занятия).",
        "X-ray confirmed the packing list: four kinds of goods. Classify each (training codes, simplified)."
      ),
      materials: [
        {
          id: "b-xray",
          kind: "photo",
          title: L("Rentgen skaner xulosasi", "Заключение рентген-сканирования"),
          body: L(
            "Joylar 1–20: bir xil o'lchamli qutilar, ichida batareyali elektron qurilmalar. Joylar 33–72: kichik elektron bloklar va o'ralgan kabellar — deklaratsiyada yo'q.",
            "Места 1–20: коробки одного размера, внутри электронные устройства с аккумуляторами. Места 33–72: мелкие электронные блоки и смотанные кабели — в декларации отсутствуют."
          ),
          tone: "warn",
        },
      ],
      task: {
        kind: "match",
        prompt: L("Tovarni o'quv TIF TN kodi bilan bog'lang.", "Соедините товар с учебным кодом ТН ВЭД."),
        left: [
          { id: "phone", text: L("Smartfonlar (uyali aloqa telefonlari)", "Смартфоны (телефоны сотовой связи)") },
          { id: "case", text: L("Silikon g'iloflar", "Силиконовые чехлы") },
          { id: "charger", text: L("Zaryadlovchi qurilmalar (statik o'zgartirgich)", "Зарядные устройства (статические преобразователи)") },
          { id: "cable", text: L("Ulagichli USB-C kabellar", "Кабели USB-C с разъёмами") },
        ],
        right: [
          { id: "8517", text: L("8517 13 — smartfonlar (o'quv qiymati)", "8517 13 — смартфоны (учебное значение)") },
          { id: "3926", text: L("3926 90 — plastmassadan boshqa buyumlar (o'quv qiymati)", "3926 90 — прочие изделия из пластмасс (учебное значение)") },
          { id: "8504", text: L("8504 40 — statik o'zgartirgichlar (o'quv qiymati)", "8504 40 — статические преобразователи (учебное значение)") },
          { id: "8544", text: L("8544 42 — ulagichli izolyatsiyalangan o'tkazgichlar (o'quv qiymati)", "8544 42 — изолированные проводники с соединителями (учебное значение)") },
          { id: "8471", text: L("8471 30 — portativ kompyuterlar (o'quv qiymati)", "8471 30 — портативные компьютеры (учебное значение)") },
        ],
        pairs: [
          ["phone", "8517"],
          ["case", "3926"],
          ["charger", "8504"],
          ["cable", "8544"],
        ],
      },
      competencies: ["bojxona.tasnif"],
      consequence: L(
        "Noto'g'ri tasnif noto'g'ri stavka va imtiyozlarga olib keladi: to'lovlar kam undiriladi yoki tadbirkorga asossiz yuk tushadi, qaror sudda bekor qilinadi.",
        "Неверная классификация ведёт к неверной ставке и льготам: платежи недобираются либо на бизнес ложится необоснованная нагрузка, решение отменяется в суде."
      ),
    },

    /* 3 ------------------------------------------------------------ */
    {
      id: "b3-value",
      title: L("Bojxona qiymati", "Таможенная стоимость", "Customs value"),
      brief: L(
        "Smartfonlar partiyasi uchun bojxona qiymatini bitim qiymati usulida hisoblang. Yetkazib berish sharti FCA Shenzhen — chegaragacha tashish va sug'urta qiymatga qo'shiladi.",
        "Рассчитайте таможенную стоимость партии смартфонов по методу стоимости сделки. Условия FCA Shenzhen — перевозка и страхование до границы включаются в стоимость.",
        "Calculate the customs value of the smartphone batch by the transaction value method. FCA terms — freight and insurance to the border are added."
      ),
      materials: [
        {
          id: "b-freight",
          kind: "document",
          title: L("Tashish va sug'urta hujjatlari", "Документы о перевозке и страховании"),
          body: L(
            "Smartfonlar partiyasiga taqsimlangan xarajatlar (o'quv ma'lumotlari).",
            "Расходы, отнесённые на партию смартфонов (учебные данные)."
          ),
          meta: [
            { label: L("Invoys (smartfonlar)", "Инвойс (смартфоны)"), value: "18 000 USD" },
            { label: L("Chegaragacha tashish", "Перевозка до границы"), value: "1 200 USD" },
            { label: L("Sug'urta", "Страхование"), value: "300 USD" },
            { label: L("Chegaradan keyingi tashish", "Перевозка после границы"), value: "400 USD" },
          ],
        },
      ],
      task: {
        kind: "numeric",
        prompt: L("Smartfonlarning bojxona qiymati (USD)?", "Таможенная стоимость смартфонов (USD)?"),
        unit: "USD",
        answer: 19500,
        tolerance: 0,
        solution: L(
          "Bojxona qiymati = invoys + chegaragacha tashish + sug'urta = 18 000 + 1 200 + 300 = 19 500 USD. Chegaradan keyingi tashish (400 USD) qo'shilmaydi.",
          "Таможенная стоимость = инвойс + перевозка до границы + страхование = 18 000 + 1 200 + 300 = 19 500 USD. Перевозка после границы (400 USD) не включается."
        ),
      },
      competencies: ["bojxona.tolov"],
      consequence: L(
        "Qiymatga kerakli xarajatlar qo'shilmasa yoki ortiqchasi qo'shilsa, barcha to'lovlar noto'g'ri hisoblanadi — bu budjet zarari yoki tadbirkor shikoyatining sababi.",
        "Если в стоимость не включены нужные расходы или включены лишние, все платежи рассчитаны неверно — это ущерб бюджету или повод для жалобы бизнеса."
      ),
    },

    /* 4 ------------------------------------------------------------ */
    {
      id: "b4-payments",
      title: L("Bojxona to'lovlari hisobi", "Расчёт таможенных платежей", "Customs payments"),
      brief: L(
        "O'quv stavkalari (rasmiy emas): import bojxona boji — bojxona qiymatining 10%; QQS — 12%, baza = bojxona qiymati + boj. Smartfonlar uchun jami to'lovni hisoblang.",
        "Учебные ставки (не официальные): ввозная пошлина — 10% от таможенной стоимости; НДС — 12%, база = таможенная стоимость + пошлина. Рассчитайте итог платежей за смартфоны.",
        "Training rates (not official): duty 10% of customs value; VAT 12% on (value + duty). Calculate total payments for the smartphones."
      ),
      materials: [],
      task: {
        kind: "numeric",
        prompt: L("Jami to'lov (boj + QQS), USD?", "Итого платежей (пошлина + НДС), USD?"),
        unit: "USD",
        answer: 4524,
        tolerance: 5,
        solution: L(
          "Boj = 19 500 × 10% = 1 950. QQS bazasi = 19 500 + 1 950 = 21 450; QQS = 21 450 × 12% = 2 574. Jami = 1 950 + 2 574 = 4 524 USD.",
          "Пошлина = 19 500 × 10% = 1 950. База НДС = 19 500 + 1 950 = 21 450; НДС = 21 450 × 12% = 2 574. Итого = 1 950 + 2 574 = 4 524 USD."
        ),
      },
      competencies: ["bojxona.tolov"],
      consequence: L(
        "QQS bazasiga boj qo'shilmasa, to'lov kam undiriladi; farq keyinchalik bojxona auditida aniqlanib, inspektorning javobgarligi masalasi ko'riladi.",
        "Если пошлину не включить в базу НДС, платёж будет недобран; разница вскроется при таможенном аудите, и встанет вопрос об ответственности инспектора."
      ),
    },

    /* 5 ------------------------------------------------------------ */
    {
      id: "b5-risk",
      title: L("Xavf profili", "Профиль риска", "Risk profile"),
      brief: L(
        "Xavflarni boshqarish tizimi ma'lumotnomasini ko'rib chiqing. Qaysi belgilar ushbu yuk bo'yicha xavf indikatori hisoblanadi?",
        "Изучите справку системы управления рисками. Какие признаки являются индикаторами риска по этому грузу?",
        "Review the risk-management note. Which signs are risk indicators for this shipment?"
      ),
      materials: [
        {
          id: "b-srm",
          kind: "note",
          title: L("Xavflarni boshqarish tizimi ma'lumotnomasi", "Справка системы управления рисками"),
          body: L(
            "Import qiluvchi 2 oy oldin ro'yxatdan o'tgan, avval import qilmagan. X12 128GB modelining o'quv ma'lumotnomadagi o'rtacha narxi — 180 USD. Ta'sischi ilgari bojxona qoidalarini buzgan boshqa kompaniyada direktor bo'lgan. To'lov bank o'tkazmasi orqali.",
            "Импортёр зарегистрирован 2 месяца назад, ранее не импортировал. Средняя цена модели X12 128GB по учебному справочнику — 180 USD. Учредитель ранее был директором другой компании, нарушавшей таможенные правила. Оплата банковским переводом."
          ),
          tone: "warn",
        },
      ],
      task: {
        kind: "multi",
        prompt: L("Xavf indikatorlarini belgilang.", "Отметьте индикаторы риска."),
        options: [
          { id: "a", text: L("Deklaratsiya qilingan narx ma'lumotnoma narxidan ikki baravar past (90 va 180 USD)", "Заявленная цена вдвое ниже справочной (90 против 180 USD)"), correct: true },
          { id: "b", text: L("Yangi import qiluvchi, tashqi savdo tarixi yo'q", "Новый импортёр без истории ВЭД"), correct: true },
          { id: "c", text: L("Ta'sischining qoidabuzar kompaniya bilan bog'liqligi", "Связь учредителя с компанией-нарушителем"), correct: true },
          { id: "d", text: L("Og'irlik va tovar tarkibidagi nomuvofiqlik, kelib chiqish mamlakati farqi", "Несоответствие веса и состава товара, расхождение в стране происхождения"), correct: true },
          {
            id: "e",
            text: L("To'lov bank o'tkazmasi orqali amalga oshirilgan", "Оплата произведена банковским переводом"),
            correct: false,
            feedback: L("Bank o'tkazmasi — oddiy, shaffof to'lov usuli; o'zi xavf belgisi emas.", "Банковский перевод — обычный прозрачный способ оплаты; сам по себе не индикатор риска."),
          },
          {
            id: "f",
            text: L("Tovar Osiyodan kelmoqda", "Товар следует из Азии"),
            correct: false,
            feedback: L("Geografiyaning o'zi xavf indikatori emas — bu kamsituvchi yondashuv bo'lardi.", "Сама география не индикатор риска — это был бы дискриминационный подход."),
          },
        ],
      },
      competencies: ["bojxona.xavf"],
      consequence: L(
        "Xavf indikatorlari e'tiborsiz qolsa, qiymatni pasaytirish sxemasi takrorlanadi; aksincha, asossiz indikatorlar halol tadbirkorlarni to'xtatib, postda navbat hosil qiladi.",
        "Если индикаторы проигнорированы, схема занижения стоимости повторяется; необоснованные же индикаторы задерживают добросовестный бизнес и создают очереди на посту."
      ),
    },

    /* 6 ------------------------------------------------------------ */
    {
      id: "b6-decision",
      title: L("Yakuniy qaror", "Итоговое решение", "Final decision"),
      brief: L(
        "Deklarant vakili: «Qo'shimcha tovarlar — namuna, ularni hisobga olmang. Tezroq chiqaring, yuk kechikyapti». Qaror qabul qiling.",
        "Представитель декларанта: «Дополнительные товары — образцы, не учитывайте их. Выпускайте быстрее, груз опаздывает». Примите решение.",
        "The declarant's agent: \"The extra goods are samples, ignore them. Release fast.\" Decide."
      ),
      materials: [],
      task: {
        kind: "choice",
        prompt: L("To'g'ri qaror qaysi?", "Какое решение правильное?"),
        options: [
          {
            id: "a",
            text: L("Tovarni deklaratsiyadagidek chiqarish: namunalar ahamiyatsiz", "Выпустить товар как задекларировано: образцы несущественны"),
            score: 0,
            feedback: L("1 500 dona tovar «namuna» emas. Deklaratsiya qilinmagan tovarni chiqarish — jiddiy qoidabuzarlik.", "1 500 единиц — не «образцы». Выпуск незадекларированного товара — серьёзное нарушение."),
          },
          {
            id: "b",
            text: L(
              "Chiqarishni to'xtatib turish; deklarant vakili ishtirokida bojxona ko'rigini o'tkazib, dalolatnoma tuzish; tovarlar va og'irlikni qayta hisoblash; qiymat bo'yicha qo'shimcha hujjatlar so'rash; aniqlangan qoidabuzarlik bo'yicha Bojxona kodeksida belgilangan tartibda ish yuritish",
              "Приостановить выпуск; провести таможенный досмотр с участием представителя декларанта и составить акт; пересчитать товары и вес; запросить дополнительные документы по стоимости; по выявленному нарушению действовать в порядке, установленном Таможенным кодексом"
            ),
            score: 3,
            feedback: L("To'g'ri: dalillar qayd etiladi, deklarant huquqlari hurmat qilinadi, qaror asoslanadi.", "Верно: доказательства фиксируются, права декларанта соблюдены, решение обосновано."),
          },
          {
            id: "c",
            text: L("Yukni musodara qilib, haydovchini ushlash", "Конфисковать груз и задержать водителя"),
            score: 0,
            feedback: L("Musodara — ko'rik va belgilangan tartibdagi qarorsiz mumkin emas; haydovchi deklarant emas.", "Конфискация без досмотра и установленного решения невозможна; водитель не декларант."),
          },
          {
            id: "d",
            text: L("Og'zaki ogohlantirib, to'lovlarni «ko'z bilan» 20% ga oshirib chiqarish", "Устно предупредить и выпустить, увеличив платежи «на глаз» на 20%"),
            score: 1,
            feedback: L("To'lovlar hisob-kitobsiz belgilanmaydi; ko'rik dalolatnomasiz qaror asossiz.", "Платежи не назначаются без расчёта; решение без акта досмотра необоснованно."),
          },
        ],
      },
      competencies: ["bojxona.qaror", "bojxona.xavf"],
      consequence: L(
        "Asossiz chiqarish — kontrabanda kanali ochilishi; asossiz musodara — sudda bekor qilinadigan qaror va davlatdan zarar undirilishi.",
        "Необоснованный выпуск открывает канал контрабанды; необоснованная конфискация — решение, отменяемое в суде, с взысканием убытков с государства."
      ),
    },

    /* 7 ------------------------------------------------------------ */
    {
      id: "b7-report",
      title: L("Xizmat bildirishnomasi", "Служебная записка", "Service report"),
      brief: L(
        "Post boshlig'iga ko'rik natijalari bo'yicha xizmat bildirishnomasining asosiy qismini yozing.",
        "Напишите основную часть служебной записки начальнику поста по итогам досмотра.",
        "Write the main part of the service report to the post chief."
      ),
      materials: [],
      task: {
        kind: "text",
        prompt: L("Xizmat bildirishnomasi (kamida 60 so'z).", "Служебная записка (не менее 60 слов)."),
        rubric: [
          L("Aniqlangan nomuvofiqliklarni raqamlar bilan keltiradi: og'irlik 520/780 kg, deklaratsiya qilinmagan zaryadlovchi va kabellar, kelib chiqish mamlakati", "Приводит несоответствия с цифрами: вес 520/780 кг, незадекларированные зарядки и кабели, страна происхождения"),
          L("Tovar tasnifi va hisob-kitobni ko'rsatadi: qiymat 19 500 USD, to'lovlar 4 524 USD (o'quv stavkalari)", "Указывает классификацию и расчёт: стоимость 19 500 USD, платежи 4 524 USD (учебные ставки)"),
          L("Qiymatni pasaytirish xavfini (90 va 180 USD) va boshqa xavf indikatorlarini qayd etadi", "Отмечает риск занижения стоимости (90 против 180 USD) и другие индикаторы"),
          L("Ko'rilgan chora: chiqarish to'xtatilgan, ko'rik dalolatnomasi tuzilgan, qo'shimcha hujjatlar so'ralgan", "Принятые меры: выпуск приостановлен, составлен акт досмотра, запрошены документы"),
          L("Taklif: Bojxona kodeksida belgilangan tartibda ish yuritish; o'ylab topilgan modda raqamlari yo'q", "Предложение: действовать в порядке Таможенного кодекса; без выдуманных номеров статей"),
        ],
        minWords: 60,
        model: L(
          "Post boshlig'iga. «Global Tech Trade» MChJ yuk deklaratsiyasi bo'yicha hujjatlarni solishtirishda quyidagilar aniqlandi: brutto og'irlik deklaratsiyada 520 kg, CMR'da 780 kg; qadoqlash varag'ida deklaratsiya qilinmagan 500 dona zaryadlovchi qurilma va 1 000 dona USB-C kabel bor; kelib chiqish mamlakati deklaratsiyada Vyetnam, sertifikatda Xitoy. Rentgen skanerlash natijalari qadoqlash varag'ini tasdiqladi. Tovarlar o'quv kodlari bo'yicha tasniflandi (8517 13, 3926 90, 8504 40, 8544 42). Smartfonlarning bojxona qiymati 19 500 USD, o'quv stavkalari bo'yicha to'lovlar 4 524 USD. Deklaratsiya qilingan narx (90 USD) ma'lumotnoma narxidan (180 USD) ikki baravar past; import qiluvchi yangi, ta'sischi qoidabuzar kompaniya bilan bog'liq. Tovar chiqarilishi to'xtatildi, deklarant vakili ishtirokida ko'rik o'tkazilib, dalolatnoma tuzildi, qiymat bo'yicha qo'shimcha hujjatlar so'raldi. Bojxona kodeksida belgilangan tartibda ish yuritishni taklif qilaman. Inspektor: ___",
          "Начальнику поста. При сверке документов по декларации ООО «Global Tech Trade» выявлено: вес брутто в декларации 520 кг, в CMR 780 кг; в упаковочном листе незадекларированные 500 зарядных устройств и 1 000 кабелей USB-C; страна происхождения в декларации — Вьетнам, в сертификате — Китай. Рентген подтвердил упаковочный лист. Товары классифицированы по учебным кодам (8517 13, 3926 90, 8504 40, 8544 42). Таможенная стоимость смартфонов 19 500 USD, платежи по учебным ставкам 4 524 USD. Заявленная цена (90 USD) вдвое ниже справочной (180 USD); импортёр новый, учредитель связан с компанией-нарушителем. Выпуск приостановлен, проведён досмотр с участием представителя декларанта, составлен акт, запрошены документы по стоимости. Предлагаю действовать в порядке, установленном Таможенным кодексом. Инспектор: ___"
        ),
      },
      competencies: ["bojxona.hujjat_nazorat", "bojxona.qaror"],
      consequence: L(
        "Raqamlarsiz va asossiz bildirishnoma keyingi bosqichda ishlatib bo'lmaydi: qoidabuzarlik ishi dalilsiz qoladi va deklarant qarorni osonlik bilan bekor qildiradi.",
        "Записку без цифр и обоснования нельзя использовать дальше: дело о нарушении остаётся без доказательств, и декларант легко добивается отмены решения."
      ),
    },
  ],
};
