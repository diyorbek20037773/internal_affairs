import type { DecisionScenario } from "../types";

/** Oilaviy zo'ravonlik chaqiruvi — Stockton "domestic violence" + "orqadan xavf" ssenariysi. */
export const oilaviyChaqiruv: DecisionScenario = {
  id: "decision-oilaviy-chaqiruv",
  kind: "decision",
  code: "Q-02",
  title: { uz: "Oilaviy zo'ravonlik chaqiruvi", ru: "Вызов: семейное насилие", en: "Domestic violence call" },
  brief: {
    uz: "Kechki chaqiruv: er-xotin janjali. Kirishdan rasmiylashtirishgacha — xavfsizlik, tomonlarni ajratish, himoya orderi. Orqangizni kuzating.",
    ru: "Вечерний вызов: ссора супругов. От входа до оформления — безопасность, разделение сторон, охранный ордер. Контролируйте тыл.",
    en: "Evening call: spousal fight. From entry to paperwork — safety, separation, protection order. Watch your back.",
  },
  difficulty: 2,
  tags: ["vaziyat_tahlili", "huquqiy_qaror", "hujjatlashtirish", "deeskalatsiya"],
  estimatedMinutes: 6,
  laws: ["lawDv", "regProtectionOrder", "lawPolice", "jpkRegister"],
  version: "1.0",
  startNodeId: "d1",
  optimalPath: ["d1-o2", "d2-o1", "d3-o2", "d4-o1"],
  nodes: {
    d1: {
      id: "d1",
      chainPrompt: "xavf",
      timerSec: 20,
      onTimeout: "d1",
      situation: {
        uz: "Ko'p qavatli uy, 3-qavat, 22:10. Eshik ochiq. Ichkaridan erkak baqirmoqda, idish sinish ovozi. Sherigingiz yoningizda.",
        ru: "Многоквартирный дом, 3-й этаж, 22:10. Дверь открыта. Изнутри кричит мужчина, звук бьющейся посуды. Напарник рядом.",
        en: "Apartment block, 3rd floor, 22:10. Door open. A man shouting inside, sound of breaking dishes. Your partner is beside you.",
      },
      options: [
        {
          id: "d1-o1",
          text: {
            uz: "Sherik bilan darhol ichkariga yugurib kiramiz, koridor bo'ylab ovoz kelgan tomonga — har soniya muhim.",
            ru: "С напарником сразу вбегаем внутрь, по коридору на звук — каждая секунда важна.",
            en: "My partner and I rush straight in, down the hallway toward the noise — every second counts.",
          },
          legality: 3,
          proportionality: 1,
          consequence: {
            uz: "Koridorda erkak bilan to'qnashdingiz — u sizni ko'rmagan, qo'lida shisha. Xavfli kirish.",
            ru: "В коридоре столкнулись с мужчиной — он вас не видел, в руке бутылка. Опасный вход.",
            en: "You collided with the man in the hallway — he hadn't seen you, bottle in hand. Dangerous entry.",
          },
          next: "d2",
        },
        {
          id: "d1-o2",
          text: {
            uz: "Eshik yonida to'xtab e'lon qilaman: «Politsiya! Kim bor?», sherik orqamni kuzatadi, ichkariga qarayman.",
            ru: "Останавливаюсь у двери и объявляю: «Полиция! Кто дома?», напарник прикрывает тыл, осматриваю помещение.",
            en: "I stop at the door and announce: «Police! Who's here?», partner covers my back, I look inside.",
          },
          legality: 3,
          proportionality: 3,
          laws: ["lawPolice"],
          consequence: {
            uz: "Erkak (Bobur) koridorga chiqdi, qo'lida hech narsa yo'q. Ayol (Madina) oshxonada. Kirish nazoratli.",
            ru: "Мужчина (Бобур) вышел в коридор, руки пустые. Женщина (Мадина) на кухне. Вход под контролем.",
            en: "The man (Bobur) came into the hallway, hands empty. The woman (Madina) is in the kitchen. Controlled entry.",
          },
          next: "d2",
        },
        {
          id: "d1-o3",
          text: {
            uz: "Zinada to'xtab, qo'shimcha naryad chaqiraman va u kelguncha eshik oldida kutaman, ichkariga kirmayman.",
            ru: "Останавливаюсь на лестнице, вызываю дополнительный наряд и жду его у двери, внутрь не захожу.",
            en: "I hold on the stairs, call for another unit and wait at the door until it arrives, without going in.",
          },
          legality: 3,
          proportionality: 1,
          consequence: {
            uz: "Ichkarida ayol qichqirdi. Kechikish jabrlanuvchi uchun xavf. Kirishga majbur bo'ldingiz.",
            ru: "Внутри закричала женщина. Промедление — риск для пострадавшей. Пришлось входить.",
            en: "A woman screamed inside. Delay endangers the victim. You were forced to enter.",
          },
          next: "d2",
        },
      ],
    },
    d2: {
      id: "d2",
      chainPrompt: "muloqot",
      timerSec: 20,
      onTimeout: "d2",
      situation: {
        uz: "Bobur: «Hech narsa bo'lgani yo'q, o'zimiz hal qilamiz, chiqib keting!». Madina jim, yuzida qizarish, orqada bola (6 yosh) yig'layapti.",
        ru: "Бобур: «Ничего не случилось, сами разберёмся, уходите!». Мадина молчит, на лице покраснение, за ней плачет ребёнок (6 лет).",
        en: "Bobur: «Nothing happened, we'll sort it out ourselves, get out!». Madina is silent, redness on her face; a child (6) is crying behind her.",
      },
      options: [
        {
          id: "d2-o1",
          text: {
            uz: "Sherik Boburni boshqa xonaga olib chiqadi, men Madina bilan alohida gaplashaman, bolani tekshiraman.",
            ru: "Напарник уводит Бобура в другую комнату, я говорю с Мадиной отдельно, проверяю состояние ребёнка.",
            en: "Partner takes Bobur to another room; I speak with Madina separately and check on the child.",
          },
          legality: 3,
          proportionality: 3,
          laws: ["lawDv"],
          consequence: {
            uz: "Tomonlar ajratildi. Madina asta gapira boshladi: «U meni urdi... uchinchi marta».",
            ru: "Стороны разделены. Мадина тихо начала говорить: «Он меня ударил... уже третий раз».",
            en: "Parties separated. Madina slowly began: «He hit me... third time now».",
          },
          next: "d3",
        },
        {
          id: "d2-o2",
          text: {
            uz: "Ikkalasini shu yerda, birga so'roq qilaman: «Kim boshladi? Nima uchun idish sindi? Bola nega yig'layapti?»",
            ru: "Опрашиваю обоих здесь же, вместе: «Кто начал? Почему разбита посуда? Почему плачет ребёнок?»",
            en: "I question them both right here, together: «Who started it? Why the broken dishes? Why is the child crying?»",
          },
          legality: 2,
          proportionality: 1,
          consequence: {
            uz: "Madina eri oldida «hech narsa» dedi. Bobur g'olib. Jabrlanuvchi ochilmadi.",
            ru: "Мадина при муже сказала «ничего». Бобур выиграл. Пострадавшая не раскрылась.",
            en: "In front of her husband Madina said «nothing». Bobur wins. The victim did not open up.",
          },
          next: "d3_silent",
        },
        {
          id: "d2-o3",
          text: {
            uz: "Boburga qat'iy: «Chiqib ketmaymiz. Hoziroq tinchlaning, aks holda punktga olib ketamiz», sherik yonimda turadi.",
            ru: "Бобуру жёстко: «Мы не уйдём. Успокойтесь немедленно, иначе доставим в отдел», напарник стоит рядом.",
            en: "To Bobur, firmly: «We're not leaving. Calm down right now or we take you in», my partner beside me.",
          },
          legality: 2,
          proportionality: 2,
          consequence: {
            uz: "Bobur keskinlashdi: «Meni qo'rqitasanmi?!». Tahdid o'rniga ajratish kerak edi.",
            ru: "Бобур обострился: «Ты меня пугаешь?!». Вместо угрозы нужно было разделить стороны.",
            en: "Bobur escalated: «Are you threatening me?!». Separation was needed, not threats.",
          },
          next: "d2",
        },
      ],
    },
    d3_silent: {
      id: "d3_silent",
      chainPrompt: "kutish",
      situation: {
        uz: "Madina gapirmayapti. Bobur «ketishingiz mumkin» deydi. Bola yig'layapti. Yuzdagi iz ko'rinib turibdi.",
        ru: "Мадина не говорит. Бобур: «можете идти». Ребёнок плачет. След на лице виден.",
        en: "Madina isn't talking. Bobur says «you can go». The child is crying. The mark on her face is visible.",
      },
      options: [
        {
          id: "d3s-o1",
          text: {
            uz: "Madina bilan yolg'iz gaplashishni talab qilaman — bu vakolatim. Sherik Boburni ajratadi.",
            ru: "Требую поговорить с Мадиной наедине — это моё полномочие. Напарник отводит Бобура.",
            en: "I insist on speaking to Madina alone — that's within my authority. Partner separates Bobur.",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Kech bo'lsa ham to'g'ri. Madina ochildi.",
            ru: "Поздно, но верно. Мадина раскрылась.",
            en: "Late, but right. Madina opened up.",
          },
          next: "d3",
        },
        {
          id: "d3s-o2",
          text: {
            uz: "Ariza yo'q — Boburni og'zaki ogohlantirib, Madinaga ishonch telefonini qoldirib, sherik bilan chiqib ketaman.",
            ru: "Заявления нет — устно предупреждаю Бобура, оставляю Мадине телефон доверия и ухожу с напарником.",
            en: "No complaint — I give Bobur a verbal warning, leave Madina a helpline number and go with my partner.",
          },
          legality: 1,
          proportionality: 0,
          laws: ["lawDv"],
          consequence: {
            uz: "Ko'rinib turgan zo'ravonlik belgilarida xodim harakatsiz qoldi. Qonun buzildi.",
            ru: "При явных признаках насилия сотрудник бездействовал. Нарушение закона.",
            en: "Visible signs of violence, and the officer did nothing. The law was breached.",
          },
          next: null,
          outcome: "fail",
        },
      ],
    },
    d3: {
      id: "d3",
      chainPrompt: "chora",
      timerSec: 30,
      onTimeout: "d3",
      situation: {
        uz: "Madina: «Ariza yozmayman, qaynonam bilib qolsa...». Yuzida shish, qo'lida eski ko'karish. Bola qo'rqqan. Bobur boshqa xonada, hovliqmoqda.",
        ru: "Мадина: «Заявление писать не буду, если свекровь узнает...». На лице отёк, на руке старый синяк. Ребёнок напуган. Бобур в другой комнате, нервничает.",
        en: "Madina: «I won't file a complaint, if my mother-in-law finds out...». Swelling on her face, an old bruise on her arm. The child is scared. Bobur is in the other room, agitated.",
      },
      options: [
        {
          id: "d3-o1",
          text: {
            uz: "«Arizasiz hech narsa qila olmayman» deyman, ishonch telefonini qoldirib, Boburni ogohlantirib, ketishga tayyorlanaman.",
            ru: "Говорю: «Без заявления ничего сделать не могу», оставляю телефон доверия, предупреждаю Бобура и собираюсь уходить.",
            en: "I say «Without a complaint I can't do anything», leave a helpline number, warn Bobur and prepare to go.",
          },
          legality: 0,
          proportionality: 0,
          laws: ["lawDv"],
          consequence: {
            uz: "Noto'g'ri: himoya orderi jabrlanuvchi arizasisiz ham beriladi. Xodim vakolatini bilmaydi.",
            ru: "Неверно: охранный ордер выдаётся и без заявления пострадавшей. Сотрудник не знает своих полномочий.",
            en: "Wrong: a protection order is issued even without the victim's complaint. The officer doesn't know his powers.",
          },
          next: null,
          outcome: "fail",
        },
        {
          id: "d3-o2",
          text: {
            uz: "Himoya orderi arizasiz ham berilishini tushuntiraman, tibbiy ko'rikka yo'llayman, jarohatlarni qayd etaman.",
            ru: "Разъясняю, что охранный ордер выдаётся и без заявления, направляю на медосвидетельствование, фиксирую травмы.",
            en: "I explain a protection order doesn't require her complaint, refer her for a medical exam, document the injuries.",
          },
          legality: 3,
          proportionality: 3,
          laws: ["lawDv", "regProtectionOrder"],
          consequence: {
            uz: "Madina rozi bo'ldi. Jarohatlar qayd etildi. Bola holati tekshirildi.",
            ru: "Мадина согласилась. Травмы зафиксированы. Состояние ребёнка проверено.",
            en: "Madina agreed. Injuries documented. The child's condition checked.",
          },
          next: "d4",
        },
        {
          id: "d3-o3",
          text: {
            uz: "Boburni darhol qo'lkishanlab, sherik bilan punktga olib ketaman, Madinaga ertaga kelishini aytaman.",
            ru: "Сразу надеваю на Бобура наручники, доставляем в отдел, Мадине говорю прийти завтра.",
            en: "Cuff Bobur immediately, take him to the station with my partner, tell Madina to come by tomorrow.",
          },
          legality: 2,
          proportionality: 2,
          consequence: {
            uz: "Asos bor, ammo jabrlanuvchi va bola bilan ishlash tugallanmadi, hujjat yo'q.",
            ru: "Основание есть, но работа с пострадавшей и ребёнком не завершена, документов нет.",
            en: "There are grounds, but work with the victim and child is unfinished, no paperwork.",
          },
          next: "d4",
        },
      ],
    },
    d4: {
      id: "d4",
      chainPrompt: "chora",
      situation: {
        uz: "Siz Madina bilan gaplashib, yozib olyapsiz. Bobur xonadan chiqib, orqangizdan yaqinlashmoqda — sherigingiz koridorda telefon bilan band.",
        ru: "Вы беседуете с Мадиной и записываете. Бобур вышел из комнаты и приближается к вам сзади — напарник в коридоре занят телефоном.",
        en: "You are talking with Madina and taking notes. Bobur has left the room and is approaching from behind — your partner is in the hallway on the phone.",
      },
      timerSec: 15,
      onTimeout: "d4_timeout",
      options: [
        {
          id: "d4-o1",
          text: {
            uz: "Yozishni to'xtatib Boburga yuzlanaman, masofa saqlab: «Xonangizga qayting», sherikni chaqiraman.",
            ru: "Прекращаю запись, разворачиваюсь к Бобуру, держу дистанцию: «Вернитесь в комнату», зову напарника.",
            en: "I stop writing, turn to face Bobur, keep distance: «Go back to your room», and call my partner.",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Bobur to'xtadi. Sherik keldi. Nazorat saqlandi. Rasmiylashtirish yakunlandi: hodisa ro'yxatga olindi, himoya orderi tayyorlandi.",
            ru: "Бобур остановился. Напарник подошёл. Контроль сохранён. Оформление завершено: происшествие зарегистрировано, охранный ордер подготовлен.",
            en: "Bobur stopped. Partner arrived. Control kept. Paperwork completed: incident registered, protection order prepared.",
          },
          next: null,
          outcome: "success",
        },
        {
          id: "d4-o2",
          text: {
            uz: "Yozishni davom ettiraman — Bobur tinchlangan, sherik koridordan kuzatadi deb o'ylayman, Madina gapini bo'lmayman.",
            ru: "Продолжаю записывать — считаю, что Бобур успокоился, а напарник следит из коридора, Мадину не перебиваю.",
            en: "I keep writing — Bobur has calmed down, I assume my partner is watching from the hallway, and I don't interrupt Madina.",
          },
          legality: 3,
          proportionality: 0,
          // Stockton "threat from behind" lesson.
          consequence: {
            uz: "Bobur orqadan yelkangizga urdi. Vaziyatli xabardorlik yo'qotildi.",
            ru: "Бобур ударил вас сзади по плечу. Ситуационная осведомлённость потеряна.",
            en: "Bobur struck you from behind on the shoulder. Situational awareness lost.",
          },
          next: null,
          outcome: "partial",
        },
      ],
    },
    d4_timeout: {
      id: "d4_timeout",
      situation: {
        uz: "Siz reaksiya bermadingiz. Bobur sizga orqadan hujum qildi.",
        ru: "Вы не отреагировали. Бобур напал на вас сзади.",
        en: "You did not react. Bobur attacked you from behind.",
      },
      options: [
        {
          id: "d4t-o1",
          text: { uz: "Davom etish", ru: "Продолжить", en: "Continue" },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Xodim jarohat oldi. Har doim atrofni kuzating.",
            ru: "Сотрудник получил травму. Всегда контролируйте обстановку вокруг.",
            en: "The officer was injured. Always keep watch on your surroundings.",
          },
          next: null,
          outcome: "partial",
        },
      ],
    },
  },
};
