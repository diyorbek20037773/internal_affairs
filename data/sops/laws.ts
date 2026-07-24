import type { LawRef } from "./types";

/**
 * Canonical, single-source legal references (dedup — each act/article defined
 * ONCE and reused across SOPs). Sourced via lex.uz research.
 *
 * verified=true  -> HIGH confidence, cross-confirmed article number (safe to show as fact)
 * verified=false -> number/scope must be confirmed on lex.uz (UI shows a "verify" badge)
 *
 * NEVER upgrade a reference to verified=true without cross-confirmation on lex.uz.
 */

const LEX = "https://lex.uz";

export const LAWS = {
  // ---- Jinoyat kodeksi (1994, amaldagi tahrir) — mulkka qarshi jinoyatlar ----
  jkTheft: {
    code: "Jinoyat kodeksi",
    article: "169-modda",
    title: "O'g'irlik",
    url: `${LEX}/docs/-111453`,
    verified: true,
  },
  jkMugging: {
    code: "Jinoyat kodeksi",
    article: "166-modda",
    title: "Talonchilik",
    url: `${LEX}/docs/-111453`,
    verified: true,
  },
  jkRobbery: {
    code: "Jinoyat kodeksi",
    article: "164-modda",
    title: "Bosqinchilik",
    url: `${LEX}/docs/-111453`,
    verified: true,
  },
  jkExtortion: {
    code: "Jinoyat kodeksi",
    article: "165-modda",
    title: "Tovlamachilik",
    url: `${LEX}/docs/-111453`,
    verified: true,
  },
  jkFraud: {
    code: "Jinoyat kodeksi",
    article: "168-modda",
    title: "Firibgarlik",
    url: `${LEX}/docs/-111453`,
    verified: true,
  },
  jkHooliganism: {
    code: "Jinoyat kodeksi",
    article: "277-modda",
    title: "Bezorilik",
    note: "Mayda bezorilik — ma'muriy (MJTK 183-modda). Jinoyat darajasini surishtiruvchi belgilaydi.",
    url: `${LEX}/docs/-111453`,
    verified: true,
  },
  jkNarcotics: {
    code: "Jinoyat kodeksi",
    article: "19-bob (270–276-moddalar)",
    title: "Giyohvandlik vositalari bilan bog'liq jinoyatlar",
    note: "Aniq moddani lex.uz'dan tasdiqlang. Maxsus xizmat/tergov yuritadi.",
    url: `${LEX}/docs/-111453`,
    verified: false,
  },
  jkCyber: {
    code: "Jinoyat kodeksi",
    article: "20¹-bob (278-seriya)",
    title: "Axborot texnologiyalari sohasidagi jinoyatlar",
    note: "Aniq modda raqamini lex.uz'dan tasdiqlang. Kiber bo'linma yuritadi.",
    url: `${LEX}/docs/-111453`,
    verified: false,
  },

  // ---- Jinoyat-protsessual kodeksi (JPK) ----
  jpkRegister: {
    code: "Jinoyat-protsessual kodeksi",
    article: "329-modda",
    title: "Arizalar va xabarlarni ro'yxatga olish va ko'rib chiqish",
    note: "Ariza/xabar ro'yxatga olinadi; qaror 10 kun ichida.",
    url: `${LEX}/docs/-111460`,
    verified: true,
  },
  jpkInspection: {
    code: "Jinoyat-protsessual kodeksi",
    article: "135–141-moddalar (ko'zdan kechirish)",
    title: "Voqea joyini ko'zdan kechirish",
    note: "Aniq moddani lex.uz'dan tasdiqlang. Turar joyni ko'zdan kechirish sud ruxsatini talab qiladi.",
    url: `${LEX}/docs/-111460`,
    verified: false,
  },
  jpkVideo: {
    code: "Jinoyat-protsessual kodeksi",
    article: "91-modda",
    title: "Og'ir jinoyatlarda ko'zdan kechirishning majburiy videoyozuvi",
    note: "Raqamni lex.uz'dan tasdiqlang.",
    url: `${LEX}/docs/-111460`,
    verified: false,
  },

  // ---- Ma'muriy javobgarlik to'g'risidagi kodeks (MJTK) ----
  mjtkPettyHooliganism: {
    code: "Ma'muriy javobgarlik to'g'risidagi kodeks",
    article: "183-modda",
    title: "Mayda bezorilik",
    url: `${LEX}/docs/-97664`,
    verified: true,
  },
  mjtkChildUpbringing: {
    code: "Ma'muriy javobgarlik to'g'risidagi kodeks",
    article: "47-modda",
    title: "Bolalarni tarbiyalash majburiyatlarini bajarmaslik",
    url: `${LEX}/docs/-97664`,
    verified: true,
  },
  mjtkPublicDrinking: {
    code: "Ma'muriy javobgarlik to'g'risidagi kodeks",
    article: "187-modda",
    title: "Jamoat joylarida spirtli ichimlik ichish",
    note: "Modda raqamini lex.uz'dan tasdiqlang.",
    url: `${LEX}/docs/-97664`,
    verified: false,
  },
  mjtkOrderBreach: {
    code: "Ma'muriy javobgarlik to'g'risidagi kodeks",
    article: "206¹-modda",
    title: "Himoya orderi talablarini bajarmaslik",
    url: `${LEX}/docs/-97664`,
    verified: true,
  },
  mjtkProtocol: {
    code: "Ma'muriy javobgarlik to'g'risidagi kodeks",
    article: "281-modda",
    title: "Ma'muriy huquqbuzarlik to'g'risidagi bayonnoma",
    url: `${LEX}/docs/-97664`,
    verified: true,
  },
  mjtkConsideration: {
    code: "Ma'muriy javobgarlik to'g'risidagi kodeks",
    article: "289-modda",
    title: "Ishni ko'rib chiqish muddati (~15 kun)",
    note: "Modda raqamini lex.uz'dan tasdiqlang; muddat 15 kun.",
    url: `${LEX}/docs/-97664`,
    verified: false,
  },

  // ---- Qonunlar va reglamentlar ----
  lawPolice: {
    code: "«Ichki ishlar organlari to'g'risida»gi Qonun",
    title: "Majburiyatlar (16-modda), Huquqlar (17-modda)",
    url: `${LEX}/acts/-3027843`,
    verified: true,
  },
  lawPrevention: {
    code: "«Huquqbuzarliklar profilaktikasi to'g'risida»gi Qonun (O'RQ-371)",
    title: "Profilaktik hisob, yakka tartibdagi profilaktika",
    url: `${LEX}/docs/-2387357`,
    verified: true,
  },
  lawDv: {
    code: "«Xotin-qizlarni tazyiq va zo'ravonlikdan himoya qilish to'g'risida»gi Qonun (O'RQ-561)",
    title: "Himoya orderi asoslari",
    url: `${LEX}/docs/-4494709`,
    verified: true,
  },
  regProtectionOrder: {
    code: "Vazirlar Mahkamasi qarori №3 (04.01.2020)",
    title: "Himoya orderini berish, ijro etish va monitoring Nizomi",
    url: `${LEX}/docs/-4676892`,
    verified: true,
  },
  regInspector: {
    code: "Prezident qarori PQ-2896 (18.04.2017)",
    title: "Ichki ishlar organlari tayanch punkti to'g'risida Nizom",
    url: `${LEX}/docs/-3175732`,
    verified: true,
  },
  familyCode: {
    code: "Oila kodeksi",
    article: "79–81-moddalar",
    title: "Ota-onalik huquqlaridan mahrum qilish",
    note: "Modda raqamlarini lex.uz'dan tasdiqlang. Sud hal qiladi.",
    url: `${LEX}/docs/-104720`,
    verified: false,
  },
} satisfies Record<string, LawRef>;

export type LawKey = keyof typeof LAWS;
