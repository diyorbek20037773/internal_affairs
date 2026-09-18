import type { DecisionScenario } from "../types";

/**
 * Q-01 «3-qavatdagi chaqiruv» — one call, five kinds of work: read the scene,
 * decide fast, speak to the aggressor, set priorities, talk the victim open,
 * write the report, take the legal measure. Free-response scores pick the
 * branch, so how the officer speaks and writes changes what happens next.
 */
export const uchinchiQavat: DecisionScenario = {
  id: "decision-uchinchi-qavat",
  kind: "decision",
  code: "Q-01",
  title: {
    uz: "3-qavatdagi chaqiruv",
    ru: "Вызов на 3-й этаж",
    en: "The third-floor call",
  },
  brief: {
    uz: "22:10, «102»ga qo'shni ayol qo'ng'iroq qildi: 12-xonadonda baqiriq, idish sinishi. Bitta chaqiruv — besh xil vazifa: sahnani o'qing, tez qaror qiling, gapiring, ustuvorlikni belgilang, raport yozing.",
    ru: "22:10, соседка позвонила в «102»: в квартире 12 крики, бьётся посуда. Один вызов — пять видов задач: прочитайте обстановку, решите быстро, говорите, расставьте приоритеты, напишите рапорт.",
    en: "22:10, a neighbour called 102: shouting and breaking dishes in flat 12. One call, five kinds of work: read the scene, decide fast, speak, set priorities, write the report.",
  },
  difficulty: 2,
  tags: ["vaziyat_tahlili", "muloqot", "deeskalatsiya", "profiling", "hujjatlashtirish", "huquqiy_qaror"],
  estimatedMinutes: 12,
  laws: ["lawDv", "regProtectionOrder", "lawPolice", "jpkRegister"],
  version: "2.0",
  startNodeId: "n1",
  optimalPath: ["n2-o2", "n6-o1", "n8-o2"],
  nodes: {
    /* 1 — read the scene -------------------------------------------------- */
    n1: {
      id: "n1",
      chainPrompt: "xavf",
      situation: {
        uz: "Siz va sherigingiz 3-qavat zinapoya maydonchasidasiz. 12-xonadondan erkak ovozi eshitilyapti. Ichkariga kirishdan oldin atrofga qarang.",
        ru: "Вы с напарником на площадке 3-го этажа. Из квартиры 12 слышен мужской голос. Прежде чем входить — осмотритесь.",
        en: "You and your partner are on the third-floor landing. A man's voice carries from flat 12. Before going in, look around.",
      },
      task: {
        kind: "scan",
        scene: "podyezd",
        prompt: {
          uz: "Rasmda xavfli yoki muhim deb bilgan joylarga bosing. Keraksiz belgilar ball kamaytiradi. Tayyor bo'lsangiz — «Tahlilni yakunlash».",
          ru: "Нажмите на места, которые считаете опасными или важными. Лишние отметки снижают балл. Когда готовы — «Завершить анализ».",
          en: "Tap the spots you consider dangerous or important. Extra marks cost points. When ready, press “Finish analysis”.",
        },
        competencies: ["vaziyat_tahlili", "profiling"],
        hotspots: [
          {
            id: "door",
            x: 50, y: 48, hazard: true,
            label: { uz: "Qiya ochiq eshik", ru: "Приоткрытая дверь", en: "Door left ajar" },
            note: {
              uz: "Ichkarini ko'rmay turib kirish — eng xavfli lahza. Eshik chetidan qarang.",
              ru: "Входить, не видя помещения, — самый опасный момент. Смотрите из-за косяка.",
              en: "Entering blind is the most dangerous moment. Look in from the door frame.",
            },
          },
          {
            id: "knife",
            x: 57, y: 45, hazard: true,
            label: { uz: "Koridordagi pichoq", ru: "Нож в коридоре", en: "Knife in the hallway" },
            note: {
              uz: "Qurol yetib olish masofasida. Kirgach birinchi nazoratga olinadi.",
              ru: "Оружие в зоне досягаемости. После входа — первым под контроль.",
              en: "A weapon within reach. It is the first thing to control once inside.",
            },
          },
          {
            id: "glass",
            x: 46, y: 88, hazard: true,
            label: { uz: "Siniq shisha", ru: "Битое стекло", en: "Broken glass" },
            note: {
              uz: "Zo'ravonlik izi va dalil — bosib o'tmang, raportda qayd eting.",
              ru: "След насилия и доказательство — не наступать, отметить в рапорте.",
              en: "A sign of violence and evidence — don't step on it, note it in the report.",
            },
          },
          {
            id: "shoes",
            x: 38, y: 82, hazard: true,
            label: { uz: "Bola poyabzali", ru: "Детская обувь", en: "Child's shoes" },
            note: {
              uz: "Xonadonda bola bor. Uning xavfsizligi — alohida vazifa.",
              ru: "В квартире ребёнок. Его безопасность — отдельная задача.",
              en: "There is a child in the flat. Their safety is a separate task.",
            },
          },
          {
            id: "stairs",
            x: 12, y: 30, hazard: true,
            label: { uz: "Yuqoriga qorong'i zina", ru: "Тёмная лестница наверх", en: "Dark stairs going up" },
            note: {
              uz: "Orqa tomon ochiq. Sherik orqani nazorat qiladi.",
              ru: "Тыл открыт. Напарник контролирует тыл.",
              en: "Your back is exposed. The partner covers the rear.",
            },
          },
          {
            id: "neighbor",
            x: 86, y: 50, hazard: true,
            label: { uz: "Qo'shni eshigi (guvoh)", ru: "Дверь соседки (свидетель)", en: "Neighbour's door (witness)" },
            note: {
              uz: "Qo'ng'iroq qilgan qo'shni — guvoh. Keyin so'rab olinadi.",
              ru: "Позвонившая соседка — свидетель. Опросить позже.",
              en: "The neighbour who called is a witness. Interview her later.",
            },
          },
          {
            id: "mailbox",
            x: 76, y: 20, hazard: false,
            label: { uz: "Pochta qutilari", ru: "Почтовые ящики", en: "Mailboxes" },
          },
          {
            id: "plant",
            x: 93, y: 80, hazard: false,
            label: { uz: "Gul tuvagi", ru: "Цветочный горшок", en: "Plant pot" },
          },
        ],
        branches: [
          {
            minScore: 2,
            next: "n2",
            consequence: {
              uz: "Pichoq va bolani oldindan payqadingiz. Sherik bilan kelishdingiz: u orqani va zinani nazorat qiladi, siz eshikni.",
              ru: "Нож и ребёнка вы заметили заранее. С напарником договорились: он держит тыл и лестницу, вы — дверь.",
              en: "You spotted the knife and the child in advance. You agree roles: your partner covers the rear and stairs, you take the door.",
            },
          },
          {
            minScore: 0,
            next: "n2",
            consequence: {
              uz: "Muhim belgilar e'tibordan chetda qoldi. Endi eshik oldida rollarni kelishib olishga vaqt yo'q.",
              ru: "Важные признаки остались незамеченными. Договориться о ролях у двери уже некогда.",
              en: "Key signs went unnoticed. There is no time left to agree roles at the door.",
            },
          },
        ],
      },
    },

    /* 2 — fast entry decision -------------------------------------------- */
    n2: {
      id: "n2",
      chainPrompt: "xavf",
      timerSec: 15,
      onTimeout: "n3",
      situation: {
        uz: "Ichkaridan idish sinish ovozi va ayolning qisqa qichqirig'i. Eshik qiya ochiq.",
        ru: "Изнутри звук бьющейся посуды и короткий женский крик. Дверь приоткрыта.",
        en: "The sound of breaking dishes and a short scream from a woman inside. The door is ajar.",
      },
      task: {
        kind: "choice",
        options: [
          {
            id: "n2-o1",
            text: {
              uz: "Sherik bilan darhol ichkariga yuguramiz — ovoz kelgan tomonga.",
              ru: "С напарником сразу вбегаем внутрь — на звук.",
              en: "My partner and I rush straight in toward the noise.",
            },
            legality: 3,
            proportionality: 1,
            consequence: {
              uz: "Koridorda erkak bilan to'qnashdingiz — u sizni ko'rmagan edi, qo'li pichoq turgan tokcha yonida. Xavfli kirish.",
              ru: "В коридоре столкнулись с мужчиной — он вас не видел, рука у полки с ножом. Опасный вход.",
              en: "You collide with the man in the hallway — he hadn't seen you, his hand by the shelf with the knife. A dangerous entry.",
            },
            next: "n3",
          },
          {
            id: "n2-o2",
            text: {
              uz: "Eshik chetida to'xtab e'lon qilaman: «Politsiya! Hamma koridorga, qo'llar ko'rinsin!» Sherik orqani kuzatadi.",
              ru: "Встаю у косяка и объявляю: «Полиция! Всем в коридор, руки на виду!» Напарник держит тыл.",
              en: "I stop at the door frame and announce: “Police! Everyone into the hallway, hands where I can see them!” My partner covers the rear.",
            },
            legality: 3,
            proportionality: 3,
            laws: ["lawPolice"],
            consequence: {
              uz: "Erkak koridorga chiqdi, qo'llari bo'sh. Kirish nazorat ostida.",
              ru: "Мужчина вышел в коридор, руки пустые. Вход под контролем.",
              en: "The man steps into the hallway, hands empty. The entry is under control.",
            },
            next: "n3",
          },
          {
            id: "n2-o3",
            text: {
              uz: "Qo'shimcha naryad kelguncha zinada kutaman, ichkariga kirmayman.",
              ru: "Жду на лестнице подкрепление, внутрь не захожу.",
              en: "I wait on the stairs for backup and don't go in.",
            },
            legality: 1,
            proportionality: 1,
            consequence: {
              uz: "Ayol yana qichqirdi. Jabrlanuvchi xavf ostida — kechikish bilan kirishga majbur bo'ldingiz.",
              ru: "Женщина закричала снова. Потерпевшая в опасности — пришлось входить с опозданием.",
              en: "The woman screams again. The victim is in danger, and you have to go in late.",
            },
            next: "n3",
          },
        ],
      },
    },

    /* 3 — speak to the aggressor ----------------------------------------- */
    n3: {
      id: "n3",
      chainPrompt: "muloqot",
      situation: {
        uz: "Erkak (Bobur, ~35 yosh) sizga qarab yuribdi, yuzi qizargan: «Nima kerak?! Bu mening uyim, chiqib keting!»",
        ru: "Мужчина (Бобур, ~35 лет) идёт на вас, лицо красное: «Чего надо?! Это мой дом, уходите!»",
        en: "The man (Bobur, about 35) walks toward you, face flushed: “What do you want?! This is my home, get out!”",
      },
      task: {
        kind: "voice",
        addressee: { uz: "Boburga", ru: "Бобуру", en: "To Bobur" },
        prompt: {
          uz: "Boburga ovoz chiqarib gapiring (mikrofon). O'zingizni tanishtiring, nega kelganingizni ayting, uni tinchlantiring va aniq ko'rsatma bering.",
          ru: "Скажите Бобуру вслух (микрофон). Представьтесь, объясните, зачем пришли, успокойте его и дайте чёткое указание.",
          en: "Speak to Bobur out loud (microphone). Introduce yourself, say why you came, calm him down and give a clear instruction.",
        },
        competencies: ["muloqot", "deeskalatsiya"],
        minWords: 12,
        rubric: [
          { id: "intro", text: { uz: "O'zini tanishtirdi (lavozim/unvon, familiya, ichki ishlar organi)", ru: "Представился (должность/звание, фамилия, ОВД)", en: "Introduced self (rank/post, surname, police)" } },
          { id: "reason", text: { uz: "Kelish sababini aytdi (chaqiruv tushgani)", ru: "Назвал причину прихода (поступил вызов)", en: "Stated the reason (a call was received)" } },
          { id: "calm", text: { uz: "Xotirjam, hurmatli ohang — haqorat va tahdidsiz", ru: "Спокойный, уважительный тон — без оскорблений и угроз", en: "Calm, respectful tone — no insults or threats" } },
          { id: "command", text: { uz: "Aniq, bajarsa bo'ladigan ko'rsatma (qo'llar ko'rinsin / to'xtang / o'tiring)", ru: "Чёткое выполнимое указание (руки на виду / остановитесь / сядьте)", en: "A clear, doable instruction (hands visible / stop / sit down)" } },
          { id: "next", text: { uz: "Keyingi qadamni tushuntirdi (har kim bilan alohida gaplashamiz)", ru: "Объяснил следующий шаг (поговорим с каждым отдельно)", en: "Explained the next step (we'll talk to each of you separately)" } },
        ],
        sample: {
          uz: "Assalomu alaykum. Men IIB profilaktika inspektori, leytenant Karimov. Bu xonadondan chaqiruv tushdi, shuning uchun keldik. Iltimos, to'xtang va qo'llaringizni ko'rinadigan joyda tuting. Hozir hammasini tinch hal qilamiz — siz bilan sherigim alohida gaplashadi, men esa rafiqangiz bilan.",
          ru: "Здравствуйте. Я участковый инспектор, лейтенант Каримов. Из этой квартиры поступил вызов, поэтому мы здесь. Пожалуйста, остановитесь и держите руки на виду. Сейчас спокойно всё решим — с вами поговорит напарник, а я — с вашей супругой.",
          en: "Good evening. I'm Lieutenant Karimov, the district police inspector. We received a call from this flat, that's why we're here. Please stop and keep your hands where I can see them. We'll sort this out calmly: my partner will talk with you, and I'll talk with your wife.",
        },
        branches: [
          {
            minScore: 2,
            next: "n4",
            consequence: {
              uz: "Bobur to'xtadi, ovozini pasaytirdi: «Mayli... lekin hech narsa bo'lgani yo'q». Sherik uni xonaga olib o'tdi.",
              ru: "Бобур остановился, понизил голос: «Ладно... но ничего не случилось». Напарник увёл его в комнату.",
              en: "Bobur stops and lowers his voice: “Fine... but nothing happened.” Your partner takes him to another room.",
            },
          },
          {
            minScore: 0,
            next: "n3x",
            consequence: {
              uz: "Bobur sizni eshitmadi — yanada keskinlashdi va ko'zi pichoq turgan tokchaga tushdi.",
              ru: "Бобур вас не услышал — завёлся сильнее, взгляд упал на полку с ножом.",
              en: "Bobur didn't hear you — he flares up and his eyes go to the shelf with the knife.",
            },
          },
        ],
      },
    },

    /* 3x — escalation after a weak opening -------------------------------- */
    n3x: {
      id: "n3x",
      chainPrompt: "xavf",
      timerSec: 8,
      onTimeout: "n4",
      situation: {
        uz: "Bobur tokcha tomon bir qadam tashladi. Pichoqqacha — bir metr. Sherik yoningizda.",
        ru: "Бобур шагнул к полке. До ножа — метр. Напарник рядом.",
        en: "Bobur takes a step toward the shelf. The knife is a metre away. Your partner is beside you.",
      },
      task: {
        kind: "choice",
        options: [
          {
            id: "n3x-o1",
            text: {
              uz: "Oraga turib qat'iy buyruq beraman: «To'xtang! Orqaga!», sherik pichoqni olib qo'yadi.",
              ru: "Встаю между ним и полкой, твёрдо: «Стоять! Назад!», напарник убирает нож.",
              en: "I step between him and the shelf and order firmly: “Stop! Step back!” My partner removes the knife.",
            },
            legality: 3,
            proportionality: 3,
            laws: ["lawPolice"],
            consequence: {
              uz: "Bobur to'xtadi. Pichoq sherikda. Vaziyat qayta nazoratda.",
              ru: "Бобур остановился. Нож у напарника. Ситуация снова под контролем.",
              en: "Bobur stops. The knife is with your partner. You're back in control.",
            },
            next: "n4",
          },
          {
            id: "n3x-o2",
            text: {
              uz: "Qurolni chiqarib, Boburga qarataman.",
              ru: "Достаю оружие и направляю на Бобура.",
              en: "I draw my firearm and point it at Bobur.",
            },
            legality: 1,
            proportionality: 0,
            consequence: {
              uz: "Pichoq hali uning qo'lida emas — o'q otar qurol nomutanosib. Bola qo'rquvdan qichqirdi, oila siz bilan gaplashishdan bosh tortdi.",
              ru: "Нож ещё не в его руке — огнестрельное оружие несоразмерно. Ребёнок закричал от страха, семья отказывается говорить.",
              en: "The knife isn't in his hand yet — a firearm is disproportionate. The child screams in fear, and the family refuses to talk.",
            },
            next: "n4",
          },
        ],
      },
    },

    /* 4 — priorities ------------------------------------------------------ */
    n4: {
      id: "n4",
      chainPrompt: "yordam",
      situation: {
        uz: "Oshxonada ayol (Madina) — yuzida shish. Xonada 6 yoshli bola yig'layapti. Tokchada pichoq bor edi. Bobur boshqa xonada, sherik bilan.",
        ru: "На кухне женщина (Мадина) — на лице отёк. В комнате плачет ребёнок 6 лет. На полке был нож. Бобур в другой комнате с напарником.",
        en: "In the kitchen, a woman (Madina) with a swollen face. A six-year-old is crying in the next room. There was a knife on the shelf. Bobur is in another room with your partner.",
      },
      task: {
        kind: "order",
        prompt: {
          uz: "Nimani birinchi qilasiz? Harakatlarni bajarilish tartibida ketma-ket bosing (qayta bossangiz — olib tashlanadi).",
          ru: "Что делаете первым? Нажимайте действия в порядке выполнения (повторное нажатие — убрать).",
          en: "What comes first? Tap the actions in the order you'd do them (tap again to remove).",
        },
        competencies: ["vaziyat_tahlili"],
        items: [
          { id: "report", text: { uz: "Navbatchi qismga xabar berish, hodisani ro'yxatga olish", ru: "Доложить в дежурную часть, зарегистрировать происшествие", en: "Report to the duty unit and register the incident" } },
          { id: "child", text: { uz: "Bolani xotirjam joyga, ishonchli kattalar nazoratiga", ru: "Ребёнка — в спокойное место, под присмотр взрослого", en: "Move the child somewhere calm, with a trusted adult" } },
          { id: "knife", text: { uz: "Pichoqni nazoratga olish", ru: "Взять нож под контроль", en: "Secure the knife" } },
          { id: "medical", text: { uz: "Madinaning jarohatini ko'rish, kerak bo'lsa «103»", ru: "Осмотреть травму Мадины, при необходимости «103»", en: "Check Madina's injury, call an ambulance if needed" } },
          { id: "separate", text: { uz: "Tomonlarni alohida xonalarga ajratish", ru: "Развести стороны по разным комнатам", en: "Keep the parties in separate rooms" } },
        ],
        answer: ["knife", "separate", "medical", "child", "report"],
        branches: [
          {
            minScore: 2,
            next: "n5",
            consequence: {
              uz: "Tartibli ishladingiz: pichoq olib qo'yildi, tomonlar ajratildi, Madinaning jarohati yengil — tez yordam shart emas. Bola qo'shni ayol bilan.",
              ru: "Вы действовали по порядку: нож убран, стороны разведены, травма Мадины лёгкая — скорая не нужна. Ребёнок с соседкой.",
              en: "You worked in order: knife secured, parties separated, Madina's injury is minor, so no ambulance is needed. The child is with the neighbour.",
            },
          },
          {
            minScore: 0,
            next: "n5",
            consequence: {
              uz: "Xavf manbai oxirgi o'ringa qoldi — pichoq bir necha daqiqa ochiq turdi. Sherik uni oxirgi lahzada payqab olib qo'ydi.",
              ru: "Источник опасности оказался в конце — нож несколько минут лежал открыто. Напарник заметил и убрал его в последний момент.",
              en: "The source of danger came last — the knife lay in the open for minutes. Your partner noticed and secured it at the last moment.",
            },
          },
        ],
      },
    },

    /* 5 — talk to the victim ---------------------------------------------- */
    n5: {
      id: "n5",
      chainPrompt: "muloqot",
      situation: {
        uz: "Madina ko'zlarini yerga tikkan: «Hech narsa bo'lmadi... o'zim yiqildim. Iltimos, ketinglar, qaynonam bilib qolsa...»",
        ru: "Мадина смотрит в пол: «Ничего не было... я сама упала. Пожалуйста, уходите, если свекровь узнает...»",
        en: "Madina stares at the floor: “Nothing happened... I fell. Please go, if my mother-in-law finds out...”",
      },
      task: {
        kind: "voice",
        addressee: { uz: "Madinaga", ru: "Мадине", en: "To Madina" },
        prompt: {
          uz: "Madina bilan gaplashing. Maqsad — u o'zini xavfsiz his qilib, nima bo'lganini aytib berishi. Bosim o'tkazmang.",
          ru: "Поговорите с Мадиной. Цель — чтобы она почувствовала себя в безопасности и рассказала, что произошло. Без давления.",
          en: "Talk to Madina. The goal is for her to feel safe and tell you what happened. No pressure.",
        },
        competencies: ["muloqot", "profiling"],
        minWords: 15,
        rubric: [
          { id: "safety", text: { uz: "Xavfsizlikni ta'kidladi (eri boshqa xonada, hozir u xavfsiz)", ru: "Подчеркнул безопасность (муж в другой комнате, сейчас она в безопасности)", en: "Stressed safety (husband in another room, she is safe now)" } },
          { id: "empathy", text: { uz: "Hamdardlik, ayblamaslik, uyaltirmaslik", ru: "Сочувствие, без обвинений и стыжения", en: "Empathy — no blaming, no shaming" } },
          { id: "open", text: { uz: "Kamida bitta ochiq savol berdi («nima bo'ldi, aytib bera olasizmi?»)", ru: "Задал хотя бы один открытый вопрос («расскажете, что произошло?»)", en: "Asked at least one open question (“can you tell me what happened?”)" } },
          { id: "rights", text: { uz: "Himoya imkoniyatini tushuntirdi (himoya orderi, tibbiy yordam, ishonch telefoni)", ru: "Объяснил возможности защиты (охранный ордер, медпомощь, телефон доверия)", en: "Explained protection options (protection order, medical help, helpline)" } },
          { id: "nopressure", text: { uz: "Majburlamadi, tanlovni unga qoldirdi", ru: "Не принуждал, оставил выбор за ней", en: "Didn't force her; left the choice to her" } },
        ],
        sample: {
          uz: "Madina opa, eringiz boshqa xonada, sherigim u bilan. Hozir siz xavfsizsiz va sizni hech kim ayblamayapti. Nima bo'lganini o'zingiz aytib bera olasizmi? Bilishingiz kerak: sizni himoya qilish uchun himoya orderi bor, shifokor ko'rigi ham tashkil qilamiz. Qaror sizniki — men shu yerdaman.",
          ru: "Мадина, ваш муж в другой комнате с моим напарником. Сейчас вы в безопасности, вас никто не обвиняет. Можете сами рассказать, что произошло? Знайте: для вашей защиты есть охранный ордер, мы организуем и осмотр врача. Решать вам — я рядом.",
          en: "Madina, your husband is in the other room with my partner. You're safe now and nobody is blaming you. Can you tell me in your own words what happened? You should know there's a protection order to keep you safe, and we can arrange a doctor too. It's your choice, and I'm here.",
        },
        branches: [
          {
            minScore: 2,
            next: "n6",
            consequence: {
              uz: "Madina yig'lab yubordi: «U meni urdi... bu uchinchi marta». Qo'lidagi eski ko'karishni ko'rsatdi.",
              ru: "Мадина расплакалась: «Он меня ударил... уже в третий раз». Показала старый синяк на руке.",
              en: "Madina breaks down: “He hit me... it's the third time.” She shows an old bruise on her arm.",
            },
          },
          {
            minScore: 0,
            next: "n6",
            consequence: {
              uz: "Madina yopildi, faqat bosh irg'adi. Faktlar kam — endi faqat ko'rganingizga tayanasiz.",
              ru: "Мадина закрылась, лишь кивает. Фактов мало — остаётся опираться только на увиденное.",
              en: "Madina shuts down and only nods. You have few facts and must rely on what you saw.",
            },
          },
        ],
      },
    },

    /* 6 — rear threat while writing -------------------------------------- */
    n6: {
      id: "n6",
      chainPrompt: "xavf",
      timerSec: 10,
      onTimeout: "n7",
      situation: {
        uz: "Siz yozib olyapsiz. Bobur xonadan chiqib, orqangizdan yaqinlashmoqda. Sherik koridorda navbatchi qism bilan telefonda.",
        ru: "Вы записываете. Бобур вышел из комнаты и подходит к вам со спины. Напарник в коридоре говорит с дежурной частью.",
        en: "You're taking notes. Bobur leaves the room and comes up behind you. Your partner is in the hallway on the phone with the duty unit.",
      },
      task: {
        kind: "choice",
        options: [
          {
            id: "n6-o1",
            text: {
              uz: "Yozishni to'xtatib, masofa saqlagan holda unga yuzlanaman: «Xonangizga qayting». Sherikni chaqiraman.",
              ru: "Прекращаю писать, разворачиваюсь к нему с дистанцией: «Вернитесь в комнату». Зову напарника.",
              en: "I stop writing, turn to face him at a distance: “Go back to your room.” I call my partner.",
            },
            legality: 3,
            proportionality: 3,
            consequence: {
              uz: "Bobur to'xtadi. Sherik keldi. Nazorat saqlandi.",
              ru: "Бобур остановился. Напарник подошёл. Контроль сохранён.",
              en: "Bobur stops. Your partner arrives. Control is kept.",
            },
            next: "n7",
          },
          {
            id: "n6-o2",
            text: {
              uz: "Yozishda davom etaman — sherik koridordan kuzatib turibdi, deb o'ylayman.",
              ru: "Продолжаю писать — думаю, напарник смотрит из коридора.",
              en: "I keep writing, assuming my partner is watching from the hallway.",
            },
            legality: 3,
            proportionality: 0,
            consequence: {
              uz: "Bobur orqadan yelkangizdan tortdi, Madina qo'rqib ketdi. Sherik yugurib kelib ajratdi. Atrofni kuzatish yo'qotildi.",
              ru: "Бобур дёрнул вас сзади за плечо, Мадина испугалась. Напарник подбежал и развёл. Контроль обстановки потерян.",
              en: "Bobur grabs your shoulder from behind and Madina is frightened. Your partner runs in and separates you. You had lost awareness of your surroundings.",
            },
            next: "n7",
          },
        ],
      },
    },

    /* 7 — write the report ------------------------------------------------ */
    n7: {
      id: "n7",
      chainPrompt: "chora",
      situation: {
        uz: "Vaziyat nazoratda. Navbatchi qism raport kutmoqda. Hozir voqea bayonini yozing.",
        ru: "Ситуация под контролем. Дежурная часть ждёт рапорт. Напишите описание происшествия.",
        en: "The situation is under control. The duty unit is waiting for your report. Write the incident narrative.",
      },
      task: {
        kind: "text",
        addressee: { uz: "Raport — voqea bayoni", ru: "Рапорт — описание происшествия", en: "Report — incident narrative" },
        prompt: {
          uz: "Voqea bayonini 5–8 gapda yozing: vaqt va joy, shaxslar, o'zingiz ko'rgan faktlar, ko'rilgan choralar, huquqiy asos. Taxmin va baho bermang.",
          ru: "Опишите происшествие в 5–8 предложениях: время и место, лица, факты, которые вы видели, принятые меры, правовое основание. Без догадок и оценок.",
          en: "Write the narrative in 5–8 sentences: time and place, people involved, facts you saw yourself, measures taken, legal basis. No guesses or judgements.",
        },
        competencies: ["hujjatlashtirish", "huquqiy_qaror"],
        minWords: 40,
        rubric: [
          { id: "when", text: { uz: "Vaqt (22:10) va joy (3-qavat, 12-xonadon) ko'rsatilgan", ru: "Указаны время (22:10) и место (3-й этаж, кв. 12)", en: "Time (22:10) and place (3rd floor, flat 12) stated" } },
          { id: "who", text: { uz: "Shaxslar: Bobur, Madina, 6 yoshli bola, qo'ng'iroq qilgan qo'shni", ru: "Лица: Бобур, Мадина, ребёнок 6 лет, позвонившая соседка", en: "People: Bobur, Madina, the 6-year-old child, the neighbour who called" } },
          { id: "facts", text: { uz: "Ko'rilgan faktlar (siniq shisha, yuzdagi shish, pichoq) — taxminsiz", ru: "Увиденные факты (битое стекло, отёк на лице, нож) — без догадок", en: "Observed facts (broken glass, facial swelling, knife) — no guesses" } },
          { id: "actions", text: { uz: "Ko'rilgan choralar (ajratish, pichoqni olish, bola, tibbiy ko'rik)", ru: "Принятые меры (разведение сторон, изъятие ножа, ребёнок, медосмотр)", en: "Measures taken (separation, knife secured, child, medical check)" } },
          { id: "legal", text: { uz: "Huquqiy asos: O'RQ-561 Qonun / himoya orderi (ruxsat etilgan ro'yxatdan)", ru: "Правовое основание: Закон ЗРУ-561 / охранный ордер (из разрешённого списка)", en: "Legal basis: Law O'RQ-561 / protection order (from the allowed list)" } },
          { id: "neutral", text: { uz: "Neytral rasmiy uslub, ayb e'lon qilinmagan", ru: "Нейтральный официальный стиль, без объявления виновным", en: "Neutral official style, no one declared guilty" } },
        ],
        sample: {
          uz: "2026-yil 18-sentabr, soat 22:10 da «102» orqali qo'shni fuqaroning xabari bo'yicha ko'p qavatli uyning 3-qavat 12-xonadoniga yetib keldik. Xonadonda fuqaro Bobur (taxm. 35 yosh), uning rafiqasi Madina va 6 yoshli bola bor edi. Eshik oldida siniq shisha, koridor tokchasida oshxona pichog'i, Madinaning yuzida shish qayd etildi. Tomonlar alohida xonalarga ajratildi, pichoq nazoratga olindi, bola qo'shni nazoratiga berildi, Madina tibbiy ko'rikka yo'llandi. Madina og'zaki ravishda eri uni urganini ma'lum qildi. «Xotin-qizlarni tazyiq va zo'ravonlikdan himoya qilish to'g'risida»gi Qonun (O'RQ-561) asosida himoya orderi rasmiylashtirish uchun materiallar tayyorlanmoqda.",
          ru: "18 сентября 2026 г. в 22:10 по сообщению соседки через «102» прибыли в квартиру 12 на 3-м этаже многоквартирного дома. В квартире находились гражданин Бобур (ок. 35 лет), его супруга Мадина и ребёнок 6 лет. У двери зафиксировано битое стекло, на полке в коридоре — кухонный нож, у Мадины — отёк на лице. Стороны разведены по разным комнатам, нож взят под контроль, ребёнок передан под присмотр соседки, Мадина направлена на медосмотр. Мадина устно сообщила, что муж её ударил. На основании Закона «О защите женщин от притеснения и насилия» (ЗРУ-561) готовятся материалы для оформления охранного ордера.",
          en: "On 18 September 2026 at 22:10, following a neighbour's call to 102, we arrived at flat 12 on the 3rd floor of an apartment block. Present were Bobur (approx. 35), his wife Madina and a 6-year-old child. Broken glass was recorded at the door, a kitchen knife on the hallway shelf, and swelling on Madina's face. The parties were separated, the knife secured, the child placed with the neighbour, and Madina referred for a medical examination. Madina stated verbally that her husband hit her. Materials for a protection order are being prepared under the Law on protecting women from harassment and violence (O'RQ-561).",
        },
        branches: [
          {
            minScore: 2,
            next: "n8",
            consequence: {
              uz: "Navbatchi qism raportni qabul qildi: «Aniq, to'liq. Order bo'yicha qaror sizda».",
              ru: "Дежурная часть приняла рапорт: «Чётко и полно. Решение по ордеру за вами».",
              en: "The duty unit accepts the report: “Clear and complete. The protection-order decision is yours.”",
            },
          },
          {
            minScore: 0,
            next: "n8",
            consequence: {
              uz: "Navbatchi qism raportni qaytardi: faktlar va asos yetarli emas. Keyinchalik to'ldirishga to'g'ri keladi.",
              ru: "Дежурная часть вернула рапорт: фактов и основания недостаточно. Придётся дополнять.",
              en: "The duty unit sends the report back: not enough facts or legal basis. It will need completing later.",
            },
          },
        ],
      },
    },

    /* 8 — legal measure --------------------------------------------------- */
    n8: {
      id: "n8",
      chainPrompt: "chora",
      situation: {
        uz: "Madina: «Ariza yozmayman». Yuzida shish, qo'lida eski ko'karish, bola qo'rqqan. Qaror sizda.",
        ru: "Мадина: «Заявление писать не буду». Отёк на лице, старый синяк на руке, ребёнок напуган. Решение за вами.",
        en: "Madina: “I won't file a complaint.” Swelling on her face, an old bruise on her arm, a frightened child. The decision is yours.",
      },
      task: {
        kind: "choice",
        options: [
          {
            id: "n8-o1",
            text: {
              uz: "«Arizasiz hech narsa qila olmayman» — ishonch telefonini qoldirib, Boburni og'zaki ogohlantirib ketaman.",
              ru: "«Без заявления ничего не могу» — оставляю телефон доверия, устно предупреждаю Бобура и ухожу.",
              en: "“Without a complaint I can't do anything” — I leave a helpline number, warn Bobur verbally and go.",
            },
            legality: 0,
            proportionality: 1,
            laws: ["lawDv"],
            consequence: {
              uz: "Noto'g'ri: himoya orderi jabrlanuvchi arizasisiz ham beriladi. Ko'rinib turgan zo'ravonlik belgilarida xodim harakatsiz qoldi.",
              ru: "Неверно: охранный ордер выдаётся и без заявления потерпевшей. При явных признаках насилия сотрудник бездействовал.",
              en: "Wrong: a protection order can be issued without the victim's complaint. With visible signs of violence, the officer failed to act.",
            },
            next: null,
            outcome: "fail",
          },
          {
            id: "n8-o2",
            text: {
              uz: "Himoya orderi arizasiz ham berilishini tushuntiraman, orderni rasmiylashtiraman, Madinani tibbiy ko'rikka yo'llayman, jarohatlarni qayd etaman.",
              ru: "Объясняю, что охранный ордер выдаётся и без заявления, оформляю ордер, направляю Мадину на медосмотр, фиксирую травмы.",
              en: "I explain that a protection order doesn't need her complaint, issue the order, refer Madina for a medical exam and record the injuries.",
            },
            legality: 3,
            proportionality: 3,
            laws: ["lawDv", "regProtectionOrder", "jpkRegister"],
            consequence: {
              uz: "Himoya orderi rasmiylashtirildi, hodisa ro'yxatga olindi, jarohatlar qayd etildi. Bola va Madina xavfsiz.",
              ru: "Охранный ордер оформлен, происшествие зарегистрировано, травмы зафиксированы. Ребёнок и Мадина в безопасности.",
              en: "The protection order is issued, the incident registered and the injuries recorded. The child and Madina are safe.",
            },
            next: null,
            outcome: "success",
          },
          {
            id: "n8-o3",
            text: {
              uz: "Boburni darhol qo'lkishanlab punktga olib ketaman, Madinaga ertaga kelishini aytaman.",
              ru: "Сразу надеваю на Бобура наручники и везу в пункт, Мадине говорю прийти завтра.",
              en: "I handcuff Bobur on the spot and take him to the station, telling Madina to come in tomorrow.",
            },
            legality: 2,
            proportionality: 1,
            laws: ["lawPolice"],
            consequence: {
              uz: "Asos bor, ammo jabrlanuvchi va bola bilan ishlash tugallanmadi, himoya orderi yo'q.",
              ru: "Основание есть, но работа с потерпевшей и ребёнком не завершена, охранного ордера нет.",
              en: "There are grounds, but the work with the victim and the child is unfinished and there is no protection order.",
            },
            next: null,
            outcome: "partial",
          },
        ],
      },
    },
  },
};
