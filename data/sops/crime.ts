import type { IncidentType } from "@/types/incident";
import type { LawRef, LocalizedText, Sop } from "./types";
import { LAWS } from "./laws";

/**
 * Standard first-responder SOP for a property/criminal incident, sequenced to
 * the Jinoyat-protsessual kodeksi order: register -> secure -> inspect ->
 * explanations -> qualification (material law) -> hand off. The material-law
 * article is attached ONCE, at the qualification step, so legal bases are
 * ordered (procedural first, material next) and never duplicated.
 */
export function buildCrimeSop(
  type: IncidentType,
  title: LocalizedText,
  materialLaw: LawRef
): Sop {
  return {
    type,
    version: "2.0",
    title,
    steps: [
      {
        id: `${type}.register`,
        order: 1,
        title: {
          uz: "Xabarni qabul qilish va ro'yxatga olish",
          ru: "Приём и регистрация сообщения",
          en: "Receive and register the report",
        },
        instruction: {
          uz: "Arizani/xabarni qabul qiling, navbatchi qismga xabar bering va ro'yxatga oling. Hayotga xavf bo'lsa — avval 102 va tez tibbiy yordam.",
          ru: "Примите заявление/сообщение, доложите в дежурную часть и зарегистрируйте. При угрозе жизни — сначала 102 и скорая.",
          en: "Accept the report, notify the duty unit and register it. If life is at risk — 102 and emergency medical first.",
        },
        checklist: [
          {
            id: `${type}.register.duty`,
            label: {
              uz: "Navbatchi qismga xabar berish",
              ru: "Доклад в дежурную часть",
              en: "Notify the duty unit",
            },
            required: true,
          },
          {
            id: `${type}.register.journal`,
            label: {
              uz: "Ariza/xabarni ro'yxatga olish",
              ru: "Регистрация заявления/сообщения",
              en: "Register the report",
            },
            required: true,
          },
        ],
        documents: [
          {
            id: `${type}.doc.statement`,
            name: { uz: "Ariza", ru: "Заявление", en: "Statement" },
            kind: "ariza",
          },
        ],
        laws: [LAWS.jpkRegister],
      },
      {
        id: `${type}.secure`,
        order: 2,
        title: {
          uz: "Voqea joyini muhofaza qilish",
          ru: "Охрана места происшествия",
          en: "Secure the scene",
        },
        instruction: {
          uz: "Voqea joyini o'rab oling, izlarni saqlang, guvohlarni ushlab turing — tergov guruhi kelgunicha hech narsani o'zgartirmang.",
          ru: "Оцепите место, сохраните следы, удержите свидетелей — ничего не меняйте до прибытия следственной группы.",
          en: "Cordon the scene, preserve traces, keep witnesses — change nothing until the investigative team arrives.",
        },
        checklist: [
          {
            id: `${type}.secure.cordon`,
            label: {
              uz: "Hodisa joyini o'rab olish",
              ru: "Оцепление места",
              en: "Cordon the scene",
            },
            required: true,
          },
          {
            id: `${type}.secure.traces`,
            label: {
              uz: "Izlarni saqlash",
              ru: "Сохранение следов",
              en: "Preserve traces",
            },
            required: true,
          },
        ],
        documents: [],
        laws: [LAWS.lawPolice],
      },
      {
        id: `${type}.inspect`,
        order: 3,
        title: {
          uz: "Voqea joyini ko'zdan kechirish va bayonnoma",
          ru: "Осмотр места происшествия и протокол",
          en: "Scene inspection and protocol",
        },
        instruction: {
          uz: "Ko'zdan kechirish bayonnomasini tuzing, foto va (og'ir jinoyatda) videoga oling. Turar joyni ko'zdan kechirish sud ruxsatini talab qiladi.",
          ru: "Составьте протокол осмотра, сделайте фото и (при тяжком преступлении) видео. Осмотр жилища требует судебного разрешения.",
          en: "Draft the inspection protocol; take photos and (for grave crimes) video. Inspecting a dwelling requires court authorization.",
        },
        checklist: [
          {
            id: `${type}.inspect.photo`,
            label: { uz: "Fotosurat", ru: "Фотосъёмка", en: "Photos" },
            required: true,
          },
          {
            id: `${type}.inspect.video`,
            label: { uz: "Videoyozuv (og'ir jinoyatda)", ru: "Видео (при тяжком)", en: "Video (grave crimes)" },
            required: false,
          },
        ],
        documents: [
          {
            id: `${type}.doc.inspection`,
            name: {
              uz: "Ko'zdan kechirish bayonnomasi",
              ru: "Протокол осмотра",
              en: "Inspection protocol",
            },
            kind: "bayonnoma",
          },
          {
            id: `${type}.doc.photo`,
            name: { uz: "Foto/video ilova", ru: "Фото/видео приложение", en: "Photo/video annex" },
            kind: "foto",
          },
        ],
        laws: [LAWS.jpkInspection, LAWS.jpkVideo],
      },
      {
        id: `${type}.explanations`,
        order: 4,
        title: {
          uz: "Jabrlanuvchi va guvohlardan tushuntirish olish",
          ru: "Объяснения потерпевшего и свидетелей",
          en: "Explanations from victim and witnesses",
        },
        instruction: {
          uz: "Jabrlanuvchi va guvohlardan yozma tushuntirish oling. Bu tergovgacha bo'lgan bosqich — rasmiy so'roqni surishtiruvchi/tergovchi o'tkazadi.",
          ru: "Возьмите письменные объяснения. Это доследственная стадия — формальный допрос проводит следователь.",
          en: "Take written explanations. This is the pre-investigation stage — formal interrogation is done by the investigator.",
        },
        checklist: [
          {
            id: `${type}.explanations.victim`,
            label: {
              uz: "Jabrlanuvchi tushuntirishi",
              ru: "Объяснение потерпевшего",
              en: "Victim explanation",
            },
            required: true,
          },
          {
            id: `${type}.explanations.witness`,
            label: {
              uz: "Guvohlar tushuntirishi",
              ru: "Объяснения свидетелей",
              en: "Witness explanations",
            },
            required: false,
          },
        ],
        documents: [
          {
            id: `${type}.doc.explanation`,
            name: { uz: "Tushuntirish xati", ru: "Объяснение", en: "Explanation note" },
            kind: "bayonnoma",
          },
        ],
        laws: [],
      },
      {
        id: `${type}.qualify`,
        order: 5,
        title: {
          uz: "Dastlabki huquqiy kvalifikatsiya",
          ru: "Предварительная правовая квалификация",
          en: "Preliminary legal qualification",
        },
        instruction: {
          uz: "Xatti-harakatni tegishli modda bo'yicha dastlabki baholang. Yakuniy kvalifikatsiyani surishtiruvchi/tergovchi belgilaydi — siz aybdorlikni aniqlamaysiz.",
          ru: "Предварительно оцените деяние по соответствующей статье. Окончательную квалификацию определяет следователь.",
          en: "Preliminarily assess the act under the relevant article. Final qualification is set by the investigator — you do not establish guilt.",
        },
        checklist: [
          {
            id: `${type}.qualify.assess`,
            label: {
              uz: "Xatti-harakatni moddaga solishtirish",
              ru: "Сопоставить деяние со статьёй",
              en: "Match the act to the article",
            },
            required: true,
          },
        ],
        documents: [],
        laws: [materialLaw],
      },
      {
        id: `${type}.handoff`,
        order: 6,
        title: {
          uz: "Surishtiruvchi/tergovchiga topshirish",
          ru: "Передача дознавателю/следователю",
          en: "Hand off to inquiry officer / investigator",
        },
        instruction: {
          uz: "To'plangan materiallarni surishtiruvchi yoki tergovchiga topshiring. Jarayonni tegishli xizmatga o'tkazing.",
          ru: "Передайте собранные материалы дознавателю или следователю.",
          en: "Hand the collected materials to the inquiry officer or investigator.",
        },
        checklist: [
          {
            id: `${type}.handoff.transfer`,
            label: {
              uz: "Materiallarni topshirish",
              ru: "Передача материалов",
              en: "Transfer the materials",
            },
            required: true,
          },
        ],
        documents: [],
        laws: [],
        notifyAgencies: ["Navbatchi qism", "Surishtiruv/Tergov bo'limi"],
      },
    ],
  };
}
