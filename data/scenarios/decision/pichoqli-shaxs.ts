import type { DecisionScenario } from "../types";

/**
 * Pichoqli shaxs — hovlida. Stockton PD "man displaying a knife" ssenariysi
 * asosida, PERF ICAT tamoyili: vaqt + masofa + muloqot; qurol — oxirgi chora.
 */
export const pichoqliShaxs: DecisionScenario = {
  id: "decision-pichoqli-shaxs",
  kind: "decision",
  code: "Q-01",
  title: { uz: "Pichoqli shaxs hovlida", ru: "Человек с ножом во дворе", en: "Man with a knife in the yard" },
  brief: {
    uz: "Qo'shni chaqiruvi: erkak hovlida pichoq bilan baqirmoqda. Xavfni baholang, masofa va vaqtdan foydalaning, mutanosib chora tanlang. Qurol — eng oxirgi chora.",
    ru: "Вызов соседа: мужчина во дворе кричит с ножом. Оцените угрозу, используйте дистанцию и время, выберите соразмерную меру. Оружие — крайняя мера.",
    en: "Neighbor call: a man is shouting in the yard with a knife. Assess the threat, use distance and time, choose a proportionate response. Firearm is the last resort.",
  },
  difficulty: 3,
  tags: ["vaziyat_tahlili", "huquqiy_qaror", "deeskalatsiya", "natijadorlik"],
  estimatedMinutes: 6,
  laws: ["lawPolice", "jpkRegister"],
  version: "1.0",
  startNodeId: "n1",
  optimalPath: ["n1-o2", "n2-o1", "n3-o1", "n4-o2"],
  nodes: {
    n1: {
      id: "n1",
      chainPrompt: "xavf",
      timerSec: 20,
      onTimeout: "n1_timeout",
      situation: {
        uz: "Sherigingiz bilan hovliga kirdingiz. 35 yoshlar erkak, qo'lida oshxona pichog'i, 8 metr narida: «Yaqinlashmanglar! Hammangiz yolg'onchisiz!». Hovlida boshqa odam yo'q, uy eshigi ochiq. U hali hech kimga hujum qilmagan.",
        ru: "Вы с напарником вошли во двор. Мужчина ~35 лет с кухонным ножом в 8 м: «Не подходите! Все вы лжёте!». Во дворе никого, дверь дома открыта. Он ни на кого не напал.",
        en: "You and your partner enter the yard. A man ~35 with a kitchen knife 8 m away: «Don't come closer! You're all liars!». Nobody else in the yard, house door open. He has attacked no one.",
      },
      options: [
        {
          id: "n1-o1",
          text: {
            uz: "Darhol unga yaqinlashaman, qat'iy ovozda pichoqni tashlashni buyuraman, sherik ortimdan keladi.",
            ru: "Сразу подхожу к нему, твёрдым голосом приказываю бросить нож, напарник идёт за мной.",
            en: "I move in immediately and order him firmly to drop the knife; my partner follows behind me.",
          },
          legality: 2,
          proportionality: 1,
          consequence: {
            uz: "Masofa 3 metrga tushdi. Erkak orqaga tisarilib, pichoqni ko'tardi. Xavf oshdi.",
            ru: "Дистанция сократилась до 3 м. Мужчина отступил и поднял нож. Угроза возросла.",
            en: "Distance dropped to 3 m. The man backed away and raised the knife. Threat increased.",
          },
          next: "n2_close",
        },
        {
          id: "n1-o2",
          text: {
            uz: "8 m masofada to'xtayman, sherikka eshikni kuzatishni ishora qilaman, xotirjam o'zimni tanishtiraman.",
            ru: "Останавливаюсь на 8 м, жестом показываю напарнику следить за дверью, спокойно представляюсь.",
            en: "I hold at 8 m, signal my partner to watch the door, and calmly identify myself.",
          },
          legality: 3,
          proportionality: 3,
          laws: ["lawPolice"],
          consequence: {
            uz: "Erkak to'xtab qaradi. Baqirish biroz pasaydi. Sherik eshikni nazoratga oldi.",
            ru: "Мужчина остановился и посмотрел. Крик немного стих. Напарник взял дверь под контроль.",
            en: "The man stopped and looked. The shouting eased slightly. Partner covers the door.",
          },
          next: "n2",
        },
        {
          id: "n1-o3",
          text: {
            uz: "Xizmat qurolimni chiqarib unga qarataman, baland ovozda ogohlantiraman: «Pichoqni tashla!».",
            ru: "Достаю табельное оружие, направляю на него и громко предупреждаю: «Брось нож!».",
            en: "I draw my service weapon, point it at him and warn loudly: «Drop the knife!».",
          },
          legality: 1,
          proportionality: 0,
          laws: ["lawPolice"],
          consequence: {
            uz: "Erkak qichqirib yubordi: «Otinglar, oting!». U hech kimga xavf tug'dirmagan edi — endi eskalatsiya.",
            ru: "Мужчина закричал: «Стреляйте, ну стреляйте!». Он никому не угрожал — теперь эскалация.",
            en: "The man screamed: «Shoot, go on, shoot!». He had threatened no one — now it escalates.",
          },
          next: "n2_gun",
        },
        {
          id: "n1-o4",
          text: {
            uz: "Sherik bilan hovlidan chiqib, darvoza tashqarisida turib qo'shimcha kuch kelguncha kutaman, uni ko'zdan qochirmayman.",
            ru: "Выхожу с напарником со двора, жду за воротами прибытия подкрепления, не упуская его из виду.",
            en: "My partner and I leave the yard and wait outside the gate for backup, keeping him in sight.",
          },
          legality: 3,
          proportionality: 2,
          consequence: {
            uz: "Erkak uy ichiga kirib ketdi. Uyda kim borligi noma'lum. Nazorat yo'qoldi.",
            ru: "Мужчина ушёл в дом. Кто находится в доме — неизвестно. Контроль потерян.",
            en: "The man went into the house. Unknown who is inside. Control lost.",
          },
          next: "n2_wait",
        },
      ],
    },
    n1_timeout: {
      id: "n1_timeout",
      situation: {
        uz: "Siz 20 soniya hech narsa qilmadingiz. Erkak sizga qarab ikki qadam tashladi, sherigingiz qurolga qo'l uzatdi. Vaziyat nazoratdan chiqmoqda.",
        ru: "Вы 20 секунд ничего не предпринимали. Мужчина сделал два шага к вам, напарник потянулся к оружию. Ситуация выходит из-под контроля.",
        en: "You did nothing for 20 seconds. The man took two steps toward you; your partner reached for his weapon. The situation is slipping out of control.",
      },
      options: [
        {
          id: "n1t-o1",
          text: {
            uz: "Qo'llarimni ko'tarib, xotirjam: «To'xtang. Men sizni eshitmoqchiman». Sherikka: qurol chiqarilmasin.",
            ru: "Поднимаю руки, спокойно: «Стойте. Я хочу вас выслушать». Напарнику: оружие не доставать.",
            en: "Hands raised, calmly: «Stop. I want to hear you out». To my partner: do not draw.",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Erkak to'xtadi. Vaziyat qaytadan nazoratga keldi, ammo vaqt yo'qotildi.",
            ru: "Мужчина остановился. Ситуация снова под контролем, но время потеряно.",
            en: "The man stopped. Situation back under control, but time was lost.",
          },
          next: "n2",
        },
        {
          id: "n1t-o2",
          text: {
            uz: "Sherik bilan ikki tomondan unga tashlanib, pichoqni kuch bilan tortib olaman — u chalg'igan, imkon bor.",
            ru: "Вместе с напарником бросаемся на него с двух сторон и силой отбираем нож — он отвлёкся, шанс есть.",
            en: "My partner and I rush him from two sides and wrestle the knife away — he's distracted, there's a chance.",
          },
          legality: 1,
          proportionality: 0,
          consequence: {
            uz: "Sherigingiz qo'lidan jarohat oldi. Nomutanosib va rejasiz kuch.",
            ru: "Напарник получил ранение руки. Несоразмерная и непродуманная сила.",
            en: "Your partner's hand was cut. Disproportionate, unplanned force.",
          },
          next: null,
          outcome: "fail",
        },
      ],
    },
    n2: {
      id: "n2",
      chainPrompt: "muloqot",
      timerSec: 25,
      onTimeout: "n2",
      situation: {
        uz: "Erkak: «Xotinim bolalarni olib ketdi! Sud hammasini unga berdi! Men nima qilay?!» — pichoq hali qo'lida, ammo pastga qaratilgan. Masofa 8 m.",
        ru: "Мужчина: «Жена забрала детей! Суд всё отдал ей! Что мне делать?!» — нож в руке, но опущен. Дистанция 8 м.",
        en: "Man: «My wife took the kids! The court gave her everything! What am I supposed to do?!» — knife still in hand, pointed down. Distance 8 m.",
      },
      options: [
        {
          id: "n2-o1",
          text: {
            uz: "«Tushunaman, bu og'ir. Ismingiz nima? Pichoqni yerga qo'ysangiz, bemalol gaplashamiz».",
            ru: "«Понимаю, это тяжело. Как вас зовут? Положите нож на землю — и спокойно поговорим».",
            en: "«I understand, this is hard. What's your name? Put the knife down and we'll talk properly».",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "«Anvar...» — dedi u. Pichoqni hali qo'ymadi, ammo ovozi pasaydi.",
            ru: "«Анвар...» — сказал он. Нож пока не положил, но голос стал тише.",
            en: "«Anvar...» he said. Knife not down yet, but his voice dropped.",
          },
          next: "n3",
        },
        {
          id: "n2-o2",
          text: {
            uz: "«Sud qarorini bu yerda muhokama qilmaymiz. Pichoqni tashlang, aks holda kuch ishlatamiz».",
            ru: "«Решение суда здесь обсуждать не будем. Бросьте нож, иначе применим силу».",
            en: "«We're not discussing the court ruling here. Drop the knife or we use force».",
          },
          legality: 2,
          proportionality: 1,
          consequence: {
            uz: "«Kuch ishlat! Menga baribir!» — pichoqni ko'tardi. Ultimatum ishlamadi.",
            ru: "«Применяй! Мне всё равно!» — поднял нож. Ультиматум не сработал.",
            en: "«Go ahead! I don't care!» — he raised the knife. The ultimatum failed.",
          },
          next: "n2_close",
        },
        {
          id: "n2-o3",
          text: {
            uz: "Sherikka tez yordam va psixolog chaqirtiraman, o'zim: «Bolalaringiz sizni sog' ko'rishi kerak».",
            ru: "Поручаю напарнику вызвать скорую и психолога, сам: «Ваши дети должны видеть вас здоровым».",
            en: "I have my partner call an ambulance and a psychologist; I say: «Your children need to see you safe».",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Erkak yig'lab yubordi. Pichoq pastga tushdi. Yordam yo'lda.",
            ru: "Мужчина заплакал. Нож опустился. Помощь в пути.",
            en: "The man broke down crying. The knife lowered. Help is on the way.",
          },
          next: "n3",
        },
      ],
    },
    n2_close: {
      id: "n2_close",
      chainPrompt: "kutish",
      timerSec: 15,
      onTimeout: "n2_close",
      situation: {
        uz: "Masofa 3 m. Erkak pichoqni ko'tarib, siz tomon yurmoqda: «Chiqib ket!». Orqangizda darvoza, chiqish yo'li ochiq.",
        ru: "Дистанция 3 м. Мужчина с поднятым ножом идёт на вас: «Убирайся!». За вами ворота, путь отхода открыт.",
        en: "Distance 3 m. The man walks toward you with the knife raised: «Get out!». The gate is behind you, exit route open.",
      },
      options: [
        {
          id: "n2c-o1",
          text: {
            uz: "Orqaga chekinib masofani 8 m ga qaytaraman, qo'llarimni ko'rsataman: «Yaxshi, chekinaman. Gaplashamiz».",
            ru: "Отхожу назад, восстанавливаю дистанцию 8 м, показываю руки: «Хорошо, я отхожу. Поговорим».",
            en: "I back off to restore 8 m and show my hands: «Okay, I'm backing off. Let's talk».",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Erkak to'xtadi. Masofa tiklandi. Vaqt yutildi.",
            ru: "Мужчина остановился. Дистанция восстановлена. Время выиграно.",
            en: "The man stopped. Distance restored. Time gained.",
          },
          next: "n2",
        },
        {
          id: "n2c-o2",
          text: {
            uz: "Qurolni chiqarib o'q uzaman — u 3 metrda pichoq bilan yaqinlashmoqda, kutishga vaqt yo'q, hayotimga xavf.",
            ru: "Достаю оружие и стреляю — он в 3 м с ножом и приближается, ждать некогда, угроза моей жизни.",
            en: "I draw and fire — he's 3 m away with a knife and closing, no time to wait, my life is at risk.",
          },
          legality: 1,
          proportionality: 1,
          laws: ["lawPolice"],
          consequence: {
            uz: "Chekinish imkoni bor edi (darvoza ochiq). Qurol — oxirgi chora, bu yerda shart bajarilmagan. Erkak jarohatlandi.",
            ru: "Была возможность отойти (ворота открыты). Оружие — крайняя мера, условие здесь не выполнено. Мужчина ранен.",
            en: "Retreat was possible (gate open). A firearm is the last resort; that condition was not met. The man was wounded.",
          },
          next: null,
          outcome: "fail",
        },
        {
          id: "n2c-o3",
          text: {
            uz: "Maxsus vosita (gaz balloni / elektroshok) ishlataman, u yiqilgach sherik pichoqni oladi, men qoplayman.",
            ru: "Применяю спецсредство (газовый баллончик / электрошокер), после падения напарник забирает нож, я прикрываю.",
            en: "I use a less-lethal tool (pepper spray / taser); once he's down my partner takes the knife while I cover.",
          },
          legality: 2,
          proportionality: 2,
          laws: ["lawPolice"],
          consequence: {
            uz: "Erkak yiqildi, pichoq olindi. Jarohatsiz, ammo muloqot imkoni to'liq ishlatilmagan edi.",
            ru: "Мужчина упал, нож изъят. Без травм, но возможности диалога не были исчерпаны.",
            en: "The man went down, knife secured. No injuries, but communication had not been exhausted.",
          },
          next: null,
          outcome: "partial",
        },
      ],
    },
    n2_gun: {
      id: "n2_gun",
      chainPrompt: "chora",
      situation: {
        uz: "Sizning qurolingiz unga qaratilgan. Erkak: «Otinglar! Baribir yashagim kelmayapti!» — pichoqni o'z bo'yniga tutdi. Vaziyat suitsidal xarakterga o'tdi.",
        ru: "Ваше оружие направлено на него. Мужчина: «Стреляйте! Я всё равно не хочу жить!» — приставил нож к своему горлу. Ситуация приобрела суицидальный характер.",
        en: "Your weapon is pointed at him. Man: «Shoot! I don't want to live anyway!» — he holds the knife to his own throat. The situation has turned suicidal.",
      },
      options: [
        {
          id: "n2g-o1",
          text: {
            uz: "Qurolni pastga tushiraman (g'ilofga solmay), ovozni pasaytiraman: «Hech kim otmaydi. Men yordamga keldim».",
            ru: "Опускаю оружие (не убирая в кобуру), понижаю голос: «Никто не стреляет. Я пришёл помочь».",
            en: "I lower my weapon (not holstered) and lower my voice: «Nobody is shooting. I'm here to help».",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Erkak pichoqni bo'ynidan uzoqlashtirdi. Gaplashishga tayyor.",
            ru: "Мужчина отвёл нож от горла. Готов говорить.",
            en: "The man moved the knife away from his throat. Ready to talk.",
          },
          next: "n2",
        },
        {
          id: "n2g-o2",
          text: {
            uz: "Qurolni unga qaratgan holda baland ovozda: «Pichoqni tashla! Bu oxirgi ogohlantirish! Hozir otaman!»",
            ru: "Не опуская оружия, громко: «Брось нож! Это последнее предупреждение! Буду стрелять!»",
            en: "Weapon still on him, loudly: «Drop the knife! This is your final warning! I will shoot!»",
          },
          legality: 2,
          proportionality: 0,
          consequence: {
            uz: "Suitsidal shaxsga ultimatum — xavfni oshirdi. U o'ziga jarohat yetkazdi.",
            ru: "Ультиматум суицидальному лицу повысил риск. Он нанёс себе ранение.",
            en: "An ultimatum to a suicidal person raised the risk. He injured himself.",
          },
          next: null,
          outcome: "fail",
        },
      ],
    },
    n2_wait: {
      id: "n2_wait",
      chainPrompt: "yordam",
      situation: {
        uz: "Siz tashqarida. Uy ichidan qichqiriq eshitildi — ayol ovozi. Qo'shimcha kuch 10 daqiqada keladi.",
        ru: "Вы снаружи. Из дома донёсся крик — женский голос. Подкрепление прибудет через 10 минут.",
        en: "You are outside. A scream from inside the house — a woman's voice. Backup arrives in 10 minutes.",
      },
      options: [
        {
          id: "n2w-o1",
          text: {
            uz: "Navbatchiga xabar beraman (uyda jabrlanuvchi bor), sherik bilan kiramiz, masofa saqlab gaplashaman.",
            ru: "Докладываю дежурному (в доме пострадавшая), входим с напарником, держу дистанцию и начинаю диалог.",
            en: "I report to dispatch (victim inside), enter with my partner, keep distance and open a dialogue.",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Erkak koridorda, ayol (onasi) xonada. U hech kimga tegmagan, faqat baqirgan. Muloqot mumkin.",
            ru: "Мужчина в коридоре, женщина (его мать) в комнате. Он никого не тронул, только кричал. Диалог возможен.",
            en: "The man is in the hallway, the woman (his mother) in a room. He touched no one, only shouted. Dialogue is possible.",
          },
          next: "n2",
        },
        {
          id: "n2w-o2",
          text: {
            uz: "Qo'shimcha kuch kelguncha tashqarida kutaman — pichoqli shaxs oldiga ikki kishi kirish xavfli, taktika shuni talab qiladi.",
            ru: "Жду подкрепления снаружи — входить вдвоём к человеку с ножом слишком опасно, этого требует тактика.",
            en: "I wait outside for backup — two officers going in on a man with a knife is too dangerous; tactics require it.",
          },
          legality: 2,
          proportionality: 1,
          consequence: {
            uz: "Uyda uchinchi shaxs xavf ostida qoldi. Xodim majburiyatini bajarmadi.",
            ru: "Третье лицо в доме осталось в опасности. Сотрудник не выполнил свою обязанность.",
            en: "A third person in the house was left at risk. The officer failed in his duty.",
          },
          next: null,
          outcome: "fail",
        },
      ],
    },
    n3: {
      id: "n3",
      chainPrompt: "kutish",
      timerSec: 25,
      onTimeout: "n3",
      situation: {
        uz: "Anvar pichoqni pastga tushirdi, yig'layapti: «Menga hech kim ishonmaydi». Tez yordam 5 daqiqada. Masofa 6 m.",
        ru: "Анвар опустил нож, плачет: «Мне никто не верит». Скорая через 5 минут. Дистанция 6 м.",
        en: "Anvar has lowered the knife, crying: «Nobody believes me». Ambulance in 5 minutes. Distance 6 m.",
      },
      options: [
        {
          id: "n3-o1",
          text: {
            uz: "«Anvar aka, men ishonaman. Pichoqni oyog'ingiz oldiga qo'ying, o'tirib gaplashamiz».",
            ru: "«Анвар-ака, я верю. Положите нож у ног, сядем и поговорим».",
            en: "«Anvar, I believe you. Put the knife by your feet and we'll sit and talk».",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "U pichoqni yerga qo'ydi va o'tirdi.",
            ru: "Он положил нож на землю и сел.",
            en: "He put the knife down and sat.",
          },
          next: "n4",
        },
        {
          id: "n3-o2",
          text: {
            uz: "U yig'lab chalg'igan paytda sherik orqadan sekin yaqinlashib pichoqni tortib oladi.",
            ru: "Пока он отвлечён и плачет, напарник тихо подходит сзади и выхватывает нож.",
            en: "While he's distracted and crying, my partner creeps up behind and grabs the knife.",
          },
          legality: 2,
          proportionality: 1,
          consequence: {
            uz: "Anvar seskanib pichoqni siltadi — sherikning qo'li tilindi. Ishonch yo'qoldi.",
            ru: "Анвар вздрогнул и взмахнул ножом — напарнику порезало руку. Доверие потеряно.",
            en: "Anvar flinched and swung the knife — partner's hand was cut. Trust lost.",
          },
          next: null,
          outcome: "fail",
        },
        {
          id: "n3-o3",
          text: {
            uz: "Jim kutaman — hech narsa demayman, u tinchlanib pichoqni o'zi qo'yadi, tez yordam kelguncha vaqt bor.",
            ru: "Молча жду — ничего не говорю, он успокоится и сам положит нож, до скорой время есть.",
            en: "I wait in silence — say nothing; he'll calm down and put it down himself, there's time before the ambulance.",
          },
          legality: 3,
          proportionality: 2,
          consequence: {
            uz: "30 soniya jimlik. U yana bezovtalandi: «Nega jimsiz?!». Muloqotni uzmaslik kerak edi.",
            ru: "30 секунд тишины. Он снова занервничал: «Почему молчите?!». Нельзя было прерывать диалог.",
            en: "30 seconds of silence. He grew agitated again: «Why are you silent?!». Dialogue should not have been broken.",
          },
          next: "n3",
        },
      ],
    },
    n4: {
      id: "n4",
      chainPrompt: "chora",
      situation: {
        uz: "Pichoq yerda, Anvar o'tiribdi. Tez yordam keldi. Endi qanday rasmiylashtirasiz?",
        ru: "Нож на земле, Анвар сидит. Скорая прибыла. Как оформляете?",
        en: "Knife on the ground, Anvar sitting. The ambulance has arrived. How do you process it?",
      },
      options: [
        {
          id: "n4-o1",
          text: {
            uz: "Qo'lkishan solib, mayda bezorilik bo'yicha protokol tuzaman, pichoqni dalil sifatida olib, punktga olib boraman, tushuntirish olaman.",
            ru: "Надеваю наручники, составляю протокол о мелком хулиганстве, изымаю нож как доказательство, доставляю в опорный пункт, беру объяснение.",
            en: "Handcuff him, write up a petty hooliganism report, seize the knife as evidence, take him to the station, take a statement.",
          },
          legality: 2,
          proportionality: 1,
          laws: ["mjtkPettyHooliganism"],
          consequence: {
            uz: "Vaziyat ruhiy inqiroz edi — birinchi navbatda tibbiy-psixologik yordam. Qo'lkishan bu yerda nomutanosib.",
            ru: "Это был психический кризис — в первую очередь медико-психологическая помощь. Наручники здесь несоразмерны.",
            en: "This was a mental-health crisis — medical and psychological help comes first. Handcuffs are disproportionate here.",
          },
          next: null,
          outcome: "partial",
        },
        {
          id: "n4-o2",
          text: {
            uz: "Pichoqni dalil sifatida olaman, Anvarni tibbiy ko'rikka topshiraman, hodisani ro'yxatga olaman, profilaktik hisobni ko'raman.",
            ru: "Изымаю нож как доказательство, передаю Анвара медикам, регистрирую происшествие, рассматриваю профилактический учёт.",
            en: "Secure the knife as evidence, hand Anvar to the medics, register the incident, consider preventive registration.",
          },
          legality: 3,
          proportionality: 3,
          laws: ["jpkRegister", "lawPrevention"],
          consequence: {
            uz: "Hech kim jarohatlanmadi. Qonuniy va mutanosib yakun. «To'g'ri otmaslik» — a'lo baho.",
            ru: "Никто не пострадал. Законный и соразмерный исход. «Правильно не выстрелить» — отличная оценка.",
            en: "No one was hurt. Lawful, proportionate outcome. Choosing not to shoot — top marks.",
          },
          next: null,
          outcome: "success",
        },
        {
          id: "n4-o3",
          text: {
            uz: "Hech narsa rasmiylashtirmayman — tinch tugadi, pichoqni oshxonaga qaytarib, tez yordamni jo'natib, uyiga qo'yib yuboraman.",
            ru: "Ничего не оформляю — всё закончилось мирно, возвращаю нож на кухню, отпускаю скорую и его домой.",
            en: "No paperwork — it ended peacefully; I return the knife to the kitchen, send the ambulance away and let him go home.",
          },
          legality: 1,
          proportionality: 1,
          consequence: {
            uz: "Hodisa qayd etilmadi, shaxs yordamsiz qoldi — takrorlanish xavfi yuqori.",
            ru: "Происшествие не зарегистрировано, лицо осталось без помощи — высокий риск повторения.",
            en: "Incident not recorded, the person left without help — high risk of recurrence.",
          },
          next: null,
          outcome: "partial",
        },
      ],
    },
  },
};
