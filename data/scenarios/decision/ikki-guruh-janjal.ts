import type { DecisionScenario } from "../types";

export const ikkiGuruhJanjal: DecisionScenario = {
  id: "decision-ikki-guruh",
  kind: "decision",
  code: "Q-04",
  title: { uz: "Ko'chada ikki guruh janjali", ru: "Драка двух групп на улице", en: "Two groups fighting in the street" },
  brief: {
    uz: "To'y oldida ikki guruh (5+6 kishi) janjallashmoqda, mushtlashuv boshlangan. Siz sherik bilan birinchi yetib keldingiz. Ustuvorlik: ajratish, jarohatlanganlar, yordam, huquqiy rasmiylashtirish.",
    ru: "У свадебного зала дерутся две группы (5+6 человек). Вы с напарником прибыли первыми. Приоритет: разделить, пострадавшие, подкрепление, оформление.",
    en: "Two groups (5+6) are fighting outside a wedding hall. You and your partner arrive first. Priority: separate, injured, backup, paperwork.",
  },
  difficulty: 3,
  tags: ["vaziyat_tahlili", "deeskalatsiya", "huquqiy_qaror", "hujjatlashtirish"],
  estimatedMinutes: 6,
  laws: ["lawPolice", "mjtkPettyHooliganism", "jkHooliganism", "jpkRegister"],
  version: "1.0",
  startNodeId: "j1",
  optimalPath: ["j1-o2", "j2-o1", "j3-o2", "j4-o1"],
  nodes: {
    j1: {
      id: "j1",
      chainPrompt: "xavf",
      timerSec: 20,
      onTimeout: "j1",
      situation: {
        uz: "To'yxona oldi, 23:10. 11 kishi, 3 juft mushtlashmoqda, qolganlar baqirmoqda. Bir yigit yerda, boshini ushlab. Olomon 30 kishi tomosha qilmoqda. Sherigingiz bilan ikkovsiz.",
        ru: "Перед свадебным залом, 23:10. 11 человек, 3 пары дерутся, остальные кричат. Один парень на земле, держится за голову. 30 зрителей. Вы с напарником вдвоём.",
        en: "Outside a wedding hall, 23:10. 11 people, 3 pairs fighting, the rest shouting. One young man on the ground holding his head. 30 onlookers. Just you and your partner.",
      },
      options: [
        {
          id: "j1-o1",
          text: {
            uz: "Sherik bilan o'rtaga kirib, mushtlashayotganlarni kuch bilan ajratamiz, eng faollarini qo'lkishanlab mashinaga o'tqazamiz.",
            ru: "С напарником входим в толпу, силой разнимаем дерущихся, самых активных заковываем в наручники и сажаем в машину.",
            en: "My partner and I wade in, pull the fighters apart by force, cuff the most active ones and put them in the car.",
          },
          legality: 3,
          proportionality: 1,
          consequence: {
            uz: "Ikki xodim 11 kishi orasida — nazorat yo'qoldi, sherik zarba oldi.",
            ru: "Двое сотрудников среди 11 человек — контроль потерян, напарник получил удар.",
            en: "Two officers among 11 people — control lost, partner took a blow.",
          },
          next: "j2_bad",
        },
        {
          id: "j1-o2",
          text: {
            uz: "Navbatchiga: 2 naryad va tez yordam. Ovoz kuchaytirgich: «Politsiya! Hamma to'xtasin!». Sherik yerdagi yigitga.",
            ru: "Дежурному: 2 наряда и скорую. Громкоговоритель: «Полиция! Всем стоять!». Напарник — к парню на земле.",
            en: "Dispatch: 2 units and an ambulance. Loudspeaker: «Police! Everyone stop!». Partner goes to the man on the ground.",
          },
          legality: 3,
          proportionality: 3,
          laws: ["lawPolice"],
          consequence: {
            uz: "Ko'pchilik to'xtadi, 2 juft davom etmoqda. Yerdagi yigit hushida. Yordam 6 daqiqada.",
            ru: "Большинство остановилось, 2 пары продолжают. Парень на земле в сознании. Помощь через 6 минут.",
            en: "Most stopped, 2 pairs continue. The man on the ground is conscious. Backup in 6 minutes.",
          },
          next: "j2",
        },
        {
          id: "j1-o3",
          text: {
            uz: "Xizmat qurolini chiqarib havoga ogohlantiruvchi o'q uzaman — hamma bir zumda to'xtaydi, olomon tarqaladi.",
            ru: "Достаю табельное оружие и делаю предупредительный выстрел в воздух — все мгновенно остановятся, толпа разойдётся.",
            en: "I draw my service weapon and fire a warning shot in the air — everyone will stop instantly and the crowd disperses.",
          },
          legality: 1,
          proportionality: 0,
          laws: ["lawPolice"],
          consequence: {
            uz: "Olomon vahimaga tushdi, odamlar yiqildi. Qurol ishlatish sharti yo'q edi — nomutanosib.",
            ru: "Толпа запаниковала, люди падали. Условий для применения оружия не было — несоразмерно.",
            en: "The crowd panicked, people fell. No grounds for using a firearm — disproportionate.",
          },
          next: null,
          outcome: "fail",
        },
      ],
    },
    j2_bad: {
      id: "j2_bad",
      chainPrompt: "yordam",
      situation: {
        uz: "Sherik burnidan qon, siz ikki kishini ushlab turibsiz, qolganlar davom etmoqda.",
        ru: "У напарника кровь из носа, вы держите двоих, остальные продолжают.",
        en: "Your partner's nose is bleeding, you are holding two men, the rest carry on.",
      },
      options: [
        {
          id: "j2b-o1",
          text: {
            uz: "Chekinaman, sherik bilan to'siq ortiga o'taman, yordam chaqiraman, ovoz bilan boshqaraman.",
            ru: "Отхожу, с напарником укрываюсь за преградой, вызываю помощь, управляю голосом.",
            en: "I pull back, get behind cover with my partner, call for backup, control by voice.",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Kech bo'lsa ham to'g'ri: yordam yo'lda, olomon biroz tinchidi.",
            ru: "Поздно, но верно: помощь в пути, толпа немного успокоилась.",
            en: "Late but right: backup on the way, the crowd calmed a little.",
          },
          next: "j2",
        },
        {
          id: "j2b-o2",
          text: {
            uz: "Maxsus vosita (gaz) bilan olomonni tarqataman, sherikni to'siq ortiga o'tkazaman, keyin yordam chaqiraman.",
            ru: "Разгоняю толпу спецсредством (газ), отвожу напарника за преграду, затем вызываю помощь.",
            en: "Disperse the crowd with pepper spray, move my partner behind cover, then call for backup.",
          },
          legality: 2,
          proportionality: 1,
          consequence: {
            uz: "Gaz tomoshabinlar va bolalarga ham tegdi. Shikoyatlar.",
            ru: "Газ попал и на зрителей, и на детей. Жалобы.",
            en: "The gas hit onlookers and children too. Complaints.",
          },
          next: null,
          outcome: "partial",
        },
      ],
    },
    j2: {
      id: "j2",
      chainPrompt: "muloqot",
      timerSec: 25,
      onTimeout: "j2",
      situation: {
        uz: "Ikki guruhning 'kattalari' (kuyov tomoni — Bekzod, kelin tomoni — Sherzod) hali baqirishmoqda. Qolganlar ularga qarab turibdi.",
        ru: "«Старшие» двух групп (сторона жениха — Бекзод, сторона невесты — Шерзод) ещё кричат. Остальные смотрят на них.",
        en: "The two groups' 'elders' (groom's side — Bekzod, bride's side — Sherzod) are still shouting. The rest are watching them.",
      },
      options: [
        {
          id: "j2-o1",
          text: {
            uz: "Yetakchilarni ajratamiz (sherik bittasi, men bittasi), 10 m narida: «Kim jarohatlangan? Nima bo'ldi?»",
            ru: "Разделяем лидеров (напарник — одного, я — другого), в 10 м: «Кто ранен? Что случилось?»",
            en: "We split the leaders (partner takes one, I take the other), 10 m apart: «Who's hurt? What happened?»",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Guruhlar yetakchisiz jim bo'ldi. Bekzod: «U opamni haqorat qildi».",
            ru: "Без лидеров группы затихли. Бекзод: «Он оскорбил мою сестру».",
            en: "Without leaders the groups went quiet. Bekzod: «He insulted my sister».",
          },
          next: "j3",
        },
        {
          id: "j2-o2",
          text: {
            uz: "Ikkalasiga birga, olomon oldida: «Hozir ikkalangni ham olib ketaman! Kim gapiradi? To'yni buzdinglar!»",
            ru: "Обоим сразу, при всех: «Сейчас обоих заберу! Кто будет говорить? Свадьбу сорвали!»",
            en: "To both at once, in front of everyone: «I'll take you both in right now! Who's talking? You ruined the wedding!»",
          },
          legality: 2,
          proportionality: 1,
          consequence: {
            uz: "Ikkalasi sizga qarshi birlashdi: «Kimni olib ketasan?». Olomon qo'shildi.",
            ru: "Оба объединились против вас: «Кого заберёшь?». Толпа подключилась.",
            en: "Both united against you: «Take who?». The crowd joined in.",
          },
          next: "j2",
        },
      ],
    },
    j3: {
      id: "j3",
      chainPrompt: "kutish",
      timerSec: 25,
      onTimeout: "j3",
      situation: {
        uz: "Yordam 3 daqiqada. Sherzod tomonidan bir yigit qo'lida g'isht bilan yaqinlashmoqda, ammo hali otmadi. Bekzod qichqirdi.",
        ru: "Помощь через 3 минуты. Парень со стороны Шерзода приближается с кирпичом в руке, но пока не бросил. Бекзод закричал.",
        en: "Backup in 3 minutes. A young man from Sherzod's side approaches with a brick in hand but hasn't thrown it. Bekzod shouted.",
      },
      options: [
        {
          id: "j3-o1",
          text: {
            uz: "G'ishtli yigitga qarab xizmat qurolidan foydalanaman — u sherigimga va Bekzodga bevosita xavf solmoqda.",
            ru: "Применяю табельное оружие против парня с кирпичом — он непосредственно угрожает напарнику и Бекзоду.",
            en: "I use my service weapon on the man with the brick — he's an immediate threat to my partner and Bekzod.",
          },
          legality: 1,
          proportionality: 0,
          consequence: {
            uz: "Bevosita hayotga xavf yo'q edi (masofa, tashlanmagan). Nomutanosib.",
            ru: "Непосредственной угрозы жизни не было (дистанция, не бросил). Несоразмерно.",
            en: "No immediate threat to life (distance, not thrown). Disproportionate.",
          },
          next: null,
          outcome: "fail",
        },
        {
          id: "j3-o2",
          text: {
            uz: "Bekzodni to'siq ortiga o'tkazaman, g'ishtli yigitga aniq buyruq: «G'ishtni tashla! Politsiya!», masofa saqlayman.",
            ru: "Отвожу Бекзода за преграду, парню с кирпичом чёткая команда: «Брось кирпич! Полиция!», держу дистанцию.",
            en: "Move Bekzod behind cover, clear command to the man with the brick: «Drop the brick! Police!», keep distance.",
          },
          legality: 3,
          proportionality: 3,
          laws: ["lawPolice"],
          consequence: {
            uz: "Yigit to'xtadi, g'ishtni tashladi. Sirena eshitildi — yordam keldi.",
            ru: "Парень остановился, бросил кирпич. Послышалась сирена — помощь прибыла.",
            en: "The man stopped and dropped the brick. Siren heard — backup arrived.",
          },
          next: "j4",
        },
        {
          id: "j3-o3",
          text: {
            uz: "Maxsus vosita (elektroshok) bilan g'ishtli yigitni darhol to'xtataman, sherik uni qo'lkishanlaydi, g'ishtni olaman.",
            ru: "Немедленно останавливаю парня с кирпичом спецсредством (электрошокер), напарник надевает наручники, изымаю кирпич.",
            en: "Stop the man with the brick immediately with a taser; my partner cuffs him and I take the brick.",
          },
          legality: 2,
          proportionality: 2,
          laws: ["lawPolice"],
          consequence: {
            uz: "Yigit yiqildi. Qonuniy asos bor edi (qurol sifatidagi buyum), ammo og'zaki buyruq sinab ko'rilmadi.",
            ru: "Парень упал. Законное основание было (предмет, используемый как оружие), но устная команда не была испробована.",
            en: "The man went down. There were legal grounds (object used as a weapon), but a verbal command was not tried.",
          },
          next: "j4",
        },
      ],
    },
    j4: {
      id: "j4",
      chainPrompt: "chora",
      situation: {
        uz: "Yordam keldi, tomonlar ajratildi. Jarohatlanganlar: 2 kishi (yengil), 1 kishi bosh jarohati. Endi rasmiylashtirish.",
        ru: "Помощь прибыла, стороны разделены. Пострадавшие: 2 человека (лёгкие), 1 — травма головы. Теперь оформление.",
        en: "Backup arrived, parties separated. Injured: 2 (minor), 1 with a head injury. Now the paperwork.",
      },
      options: [
        {
          id: "j4-o1",
          text: {
            uz: "Jarohatlanganlarni tez yordamga topshiraman; yetakchilar va g'ishtli yigitni aniqlab, guvohlar va videoni yig'aman; hodisani ro'yxatga olib, surishtiruvga uzataman.",
            ru: "Передаю пострадавших скорой; устанавливаю лидеров и парня с кирпичом, собираю свидетелей и видео; регистрирую происшествие, передаю в дознание.",
            en: "Hand the injured to the ambulance; identify the leaders and the brick man, gather witnesses and video; register the incident, pass it to inquiry.",
          },
          legality: 3,
          proportionality: 3,
          laws: ["jpkRegister", "jkHooliganism"],
          consequence: {
            uz: "To'liq: tibbiy yordam, shaxslar, guvohlar, ro'yxat, kvalifikatsiya surishtiruvda.",
            ru: "Полно: медпомощь, лица, свидетели, регистрация, квалификация — в дознании.",
            en: "Complete: medical aid, persons, witnesses, registration, classification with inquiry.",
          },
          next: null,
          outcome: "success",
        },
        {
          id: "j4-o2",
          text: {
            uz: "Hammani og'zaki ogohlantirib tarqatib yuboraman, yerdagi yigitni qarindoshlariga topshiraman, hech narsa yozmayman — to'y-da, keyin o'zaro kelishib olishadi.",
            ru: "Всех устно предупреждаю и разгоняю, парня с земли передаю родственникам, ничего не пишу — свадьба же, потом сами между собой договорятся.",
            en: "Warn everyone verbally and send them off, hand the man on the ground to relatives, write nothing — it's a wedding, they'll settle it among themselves later.",
          },
          legality: 1,
          proportionality: 1,
          consequence: {
            uz: "Bosh jarohati bor, jinoyat belgilari bor — qayd etilmadi. Qonunbuzarlik.",
            ru: "Есть травма головы, есть признаки преступления — не зарегистрировано. Нарушение закона.",
            en: "Head injury, signs of a crime — not recorded. Breach of law.",
          },
          next: null,
          outcome: "fail",
        },
        {
          id: "j4-o3",
          text: {
            uz: "Faqat g'ishtli yigitni olib ketaman va u bo'yicha protokol tuzaman, qolgan ishtirokchilar va jarohatlanganlarni mahalla raisiga qoldiraman — u o'zi hal qiladi.",
            ru: "Забираю только парня с кирпичом и составляю на него протокол, остальных участников и пострадавших оставляю председателю махалли — он сам разберётся.",
            en: "Take only the brick man and write him up; leave the other participants and the injured to the mahalla chairman — he'll sort it out.",
          },
          legality: 2,
          proportionality: 2,
          consequence: {
            uz: "Qisman: jarohatlanganlar va boshqa ishtirokchilar qayd etilmadi.",
            ru: "Частично: пострадавшие и другие участники не зафиксированы.",
            en: "Partial: the injured and other participants were not recorded.",
          },
          next: null,
          outcome: "partial",
        },
      ],
    },
  },
};
