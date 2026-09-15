import type { DecisionScenario } from "../types";

export const mastHaydovchi: DecisionScenario = {
  id: "decision-mast-haydovchi",
  kind: "decision",
  code: "Q-03",
  title: { uz: "Mast haydovchi va olomon", ru: "Нетрезвый водитель и толпа", en: "Drunk driver and a crowd" },
  brief: {
    uz: "Mahallada mashina bolalar maydonchasi panjarasiga urildi. Haydovchi mast, atrofda jahli chiqqan olomon. Haydovchini himoya qiling, olomonni tinchlantiring, qonuniy rasmiylashtiring.",
    ru: "В махалле машина врезалась в ограду детской площадки. Водитель нетрезв, вокруг разгневанная толпа. Защитите водителя, успокойте толпу, оформите по закону.",
    en: "In a mahalla a car has hit a playground fence. The driver is drunk, an angry crowd is gathering. Protect the driver, calm the crowd, process it lawfully.",
  },
  difficulty: 2,
  tags: ["vaziyat_tahlili", "deeskalatsiya", "huquqiy_qaror", "hujjatlashtirish"],
  estimatedMinutes: 5,
  laws: ["lawPolice", "mjtkProtocol", "jpkRegister", "mjtkDrunkDriving", "mjtkMedicalRefusal"],
  version: "1.0",
  startNodeId: "m1",
  optimalPath: ["m1-o2", "m2-o1", "m3-o2"],
  nodes: {
    m1: {
      id: "m1",
      chainPrompt: "xavf",
      timerSec: 20,
      onTimeout: "m1",
      situation: {
        uz: "Siz yolg'izsiz. Mashina panjaraga urilgan, jarohatlangan yo'q. Haydovchi (mast) mashinada. 15 ga yaqin odam atrofda, ikki kishi eshikni tortmoqda: «Chiqar uni! Bolalarni o'ldirmoqchi edi!»",
        ru: "Вы один. Машина врезалась в ограду, пострадавших нет. Водитель (нетрезвый) в машине. Вокруг около 15 человек, двое тянут дверь: «Вытаскивай его! Он хотел детей убить!»",
        en: "You are alone. The car has hit the fence, no one injured. The driver (drunk) is in the car. About 15 people around; two are pulling at the door: «Get him out! He was going to kill the kids!»",
      },
      options: [
        {
          id: "m1-o1",
          text: {
            uz: "Haydovchini darhol mashinadan chiqarib, olomon oldida hujjatini tekshiraman va hushyorligini aniqlayman.",
            ru: "Сразу вывожу водителя из машины, на глазах у толпы проверяю документы и состояние опьянения.",
            en: "I pull the driver out at once and check his documents and sobriety in front of the crowd.",
          },
          legality: 2,
          proportionality: 1,
          consequence: {
            uz: "Olomon haydovchiga tashlandi. Siz uni himoya qila olmadingiz. Nazorat yo'qoldi.",
            ru: "Толпа набросилась на водителя. Вы не смогли его защитить. Контроль потерян.",
            en: "The crowd went for the driver. You could not protect him. Control lost.",
          },
          next: "m2_riot",
        },
        {
          id: "m1-o2",
          text: {
            uz: "Navbatchiga xabar, naryad va YHXX chaqiraman. Mashina bilan olomon o'rtasiga turaman: «Politsiya. Hamma orqaga».",
            ru: "Докладываю дежурному, вызываю наряд и ДПС. Встаю между машиной и толпой: «Полиция. Всем назад».",
            en: "I report to dispatch, request backup and traffic police. I stand between the car and the crowd: «Police. Everyone back».",
          },
          legality: 3,
          proportionality: 3,
          laws: ["lawPolice"],
          consequence: {
            uz: "Olomon biroz chekindi. Haydovchi mashinada, eshik yopiq. Yordam 7 daqiqada.",
            ru: "Толпа немного отступила. Водитель в машине, дверь закрыта. Помощь через 7 минут.",
            en: "The crowd backed off a little. Driver in the car, door shut. Backup in 7 minutes.",
          },
          next: "m2",
        },
        {
          id: "m1-o3",
          text: {
            uz: "Qurolimni chiqarib olomonga ko'rsataman, baland ovozda: «Tarqalinglar! Yaqinlashgan javob beradi!»",
            ru: "Достаю оружие и показываю толпе, громко: «Разойтись! Кто подойдёт — ответит!»",
            en: "I draw and show my weapon to the crowd, loudly: «Disperse! Anyone who comes closer answers for it!»",
          },
          legality: 0,
          proportionality: 0,
          laws: ["lawPolice"],
          consequence: {
            uz: "Tinch fuqarolarga qurol ko'rsatish — qo'pol qonunbuzarlik. Olomon yanada g'azablandi, video tarqaldi.",
            ru: "Демонстрация оружия мирным гражданам — грубое нарушение закона. Толпа разозлилась ещё сильнее, видео разошлось.",
            en: "Displaying a weapon to peaceful citizens is a gross violation. The crowd grew angrier; the video spread online.",
          },
          next: null,
          outcome: "fail",
        },
      ],
    },
    m2_riot: {
      id: "m2_riot",
      chainPrompt: "yordam",
      situation: {
        uz: "Ikki kishi haydovchini urmoqda. Siz orada. Yordam chaqirilmagan.",
        ru: "Двое избивают водителя. Вы между ними. Помощь не вызвана.",
        en: "Two men are beating the driver. You are in between. No backup called.",
      },
      options: [
        {
          id: "m2r-o1",
          text: {
            uz: "Ratsiyadan shoshilinch yordam so'rayman, haydovchi bilan hujumchilar orasiga turaman, ovoz bilan to'xtataman.",
            ru: "По рации запрашиваю срочную помощь, встаю между водителем и нападающими, останавливаю голосом.",
            en: "Radio for urgent backup, put myself between the driver and the attackers, stop them by voice.",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Bir kishi to'xtadi. Haydovchi yengil jarohat oldi. Yordam yo'lda.",
            ru: "Один остановился. Водитель получил лёгкие травмы. Помощь в пути.",
            en: "One man stopped. The driver has minor injuries. Backup on the way.",
          },
          next: "m3",
        },
        {
          id: "m2r-o2",
          text: {
            uz: "Hujumchilardan eng faoliga qarshi maxsus vosita (gaz) ishlataman, keyin haydovchini mashinadan olib chiqaman.",
            ru: "Применяю спецсредство (газ) к самому активному нападающему, затем вывожу водителя из машины.",
            en: "Use pepper spray on the most active attacker, then get the driver out of the car.",
          },
          legality: 2,
          proportionality: 2,
          consequence: {
            uz: "Bir hujumchi to'xtadi, ammo olomon g'azabi oshdi. Yordam chaqirilmagan edi.",
            ru: "Один нападающий остановился, но гнев толпы вырос. Помощь так и не вызвана.",
            en: "One attacker stopped, but the crowd's anger grew. Backup still not called.",
          },
          next: "m3",
        },
      ],
    },
    m2: {
      id: "m2",
      chainPrompt: "muloqot",
      timerSec: 25,
      onTimeout: "m2",
      situation: {
        uz: "Olomondan bir ayol: «Nega uni himoya qilyapsiz?! Bu mening bolam o'ynaydigan joy!». Boshqalar qo'shildi. Haydovchi mashinada, boshini eggan.",
        ru: "Женщина из толпы: «Почему вы его защищаете?! Здесь мой ребёнок играет!». Другие подхватили. Водитель в машине, опустил голову.",
        en: "A woman from the crowd: «Why are you protecting him?! My child plays here!». Others join in. The driver sits in the car, head down.",
      },
      options: [
        {
          id: "m2-o1",
          text: {
            uz: "«Opa, tushunaman — bu joy bolalar uchun. Shuning uchun u qonun bo'yicha javob beradi. Guvoh bo'ling, video kerak».",
            ru: "«Сестра, понимаю — это место для детей. Поэтому он ответит по закону. Будьте свидетелем, нужно видео».",
            en: "«Ma'am, I understand — this is a place for children. That's why he'll answer under the law. Be a witness; we need video».",
          },
          legality: 3,
          proportionality: 3,
          consequence: {
            uz: "Ayol jim qoldi, keyin bosh irg'adi: «Videom bor». Olomon guvohga aylandi.",
            ru: "Женщина замолчала, потом кивнула: «У меня есть видео». Толпа стала свидетелями.",
            en: "The woman fell silent, then nodded: «I have video». The crowd became witnesses.",
          },
          next: "m3",
        },
        {
          id: "m2-o2",
          text: {
            uz: "«Orqaga, hamma orqaga! Bu sizning ishingiz emas, politsiya o'zi hal qiladi! Xalaqit bergan ham javob beradi!»",
            ru: "«Назад, все назад! Это не ваше дело, полиция разберётся сама! Кто мешает — тоже ответит!»",
            en: "«Back off, everyone back! This is none of your business, the police will handle it! Anyone who interferes answers too!»",
          },
          legality: 2,
          proportionality: 1,
          consequence: {
            uz: "Olomon: «Bizning mahallamiz — bizning ishimiz!». Qarshilik oshdi.",
            ru: "Толпа: «Наша махалля — наше дело!». Сопротивление усилилось.",
            en: "Crowd: «Our mahalla — our business!». Resistance grew.",
          },
          next: "m2",
        },
      ],
    },
    m3: {
      id: "m3",
      chainPrompt: "chora",
      situation: {
        uz: "Qo'shimcha naryad va YHXX keldi. Haydovchi (Farhod, 38) hushyor emas, hujjati bor. Endi sizning vazifangiz?",
        ru: "Прибыли наряд и ДПС. Водитель (Фарход, 38) нетрезв, документы при нём. Ваша задача теперь?",
        en: "Backup and traffic police have arrived. The driver (Farhod, 38) is intoxicated and has his documents. Your task now?",
      },
      options: [
        {
          id: "m3-o1",
          text: {
            uz: "Haydovchini YHXX ga topshiraman va uchastkaga qaytaman — YHH va mast holda haydashni rasmiylashtirish ularning ishi.",
            ru: "Передаю водителя ДПС и возвращаюсь на участок — оформление ДТП и нетрезвого вождения их работа.",
            en: "Hand the driver to traffic police and return to my beat — the crash and DUI paperwork is their job.",
          },
          legality: 2,
          proportionality: 2,
          consequence: {
            uz: "Mahalla hodisasi: guvohlar, video, mulkka zarar (panjara) — profilaktika inspektori qayd etishi kerak edi.",
            ru: "Происшествие в махалле: свидетели, видео, ущерб имуществу (ограда) — инспектор профилактики обязан был зафиксировать.",
            en: "A mahalla incident: witnesses, video, property damage (fence) — the prevention inspector had to record it.",
          },
          next: null,
          outcome: "partial",
        },
        {
          id: "m3-o2",
          text: {
            uz: "YHXX bilan guvohlar va videoni olaman, panjara zararini qayd etaman, hodisani ro'yxatga olaman, mahalla raisiga xabar beraman.",
            ru: "С ДПС собираю свидетелей и видео, фиксирую ущерб ограде, регистрирую происшествие, уведомляю председателя махалли.",
            en: "With traffic police I collect witnesses and video, record the fence damage, register the incident, notify the mahalla chairman.",
          },
          legality: 3,
          proportionality: 3,
          laws: ["jpkRegister", "mjtkProtocol"],
          consequence: {
            uz: "To'liq va qonuniy. Olomon tarqaldi, hech kim jarohatlanmadi.",
            ru: "Полно и законно. Толпа разошлась, никто не пострадал.",
            en: "Complete and lawful. The crowd dispersed, no one hurt.",
          },
          next: null,
          outcome: "success",
        },
        {
          id: "m3-o3",
          text: {
            uz: "Olomon talabi bilan haydovchini o'sha yerda «tarbiya qilib», hech narsa rasmiylashtirmasdan qo'yib yuboraman — ular tinchlansin, ish yopilsin.",
            ru: "По требованию толпы «воспитываю» водителя на месте и отпускаю без всякого оформления — пусть успокоятся, и дело закрыто.",
            en: "At the crowd's demand I «teach the driver a lesson» on the spot and let him go with no paperwork at all — that calms them and closes it.",
          },
          legality: 0,
          proportionality: 0,
          consequence: {
            uz: "Qonunsiz. Xodim olomon bosimiga berildi.",
            ru: "Незаконно. Сотрудник поддался давлению толпы.",
            en: "Unlawful. The officer gave in to crowd pressure.",
          },
          next: null,
          outcome: "fail",
        },
      ],
    },
  },
};
