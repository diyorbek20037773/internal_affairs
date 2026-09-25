import type { DialogHiddenState, DialogScenario } from "@/data/scenarios/types";

/**
 * How long the virtual citizen's next reply must be.
 *
 * Left to itself the model answers in 2 short sentences whatever the officer
 * says, so a probe over all seven dialog scenarios came back with ~40 words for
 * an open "tell me everything" invitation. The length is therefore decided
 * server-side from (a) what the officer just did and (b) the hidden state, and
 * injected into the system instruction as a hard budget.
 */
export type ReplyMode = "qisqa" | "orta" | "batafsil" | "portlash";

export interface ReplyBudget {
  mode: ReplyMode;
  minWords: number;
  maxWords: number;
  minSentences: number;
  maxSentences: number;
}

/** "Tell me the whole story" — uz / ru / en. */
const OPEN_INVITE =
  /(boshidan|batafsil|to'?liq|to'?lig'?icha|aytib bering|so'?zlab bering|gapirib bering|hikoya qil|tushuntirib bering|nima bo'?l(di|gan)|qanday bo'?l(di|gan)|nimalar bo'?l|sizni eshitay|eshitaman|расскажи|подробн|что случилось|как это было|tell me|what happened|walk me through)/i;

/**
 * Identity / paperwork asks that deserve a one-liner. Deliberately narrow:
 * "qachondan beri nizolashasiz?" is short but invites an account, so time and
 * place words are NOT here.
 */
const CLOSED_ASK =
  /(familiya|ism(ingiz|i)\b|otangizning ismi|yosh(ingiz)?\b|manzil|telefon|raqam(ingiz)?|pasport|guvohnoma|hujjat(ingiz)?|фамили|как вас зовут|адрес|телефон|паспорт|surname|passport|phone number)/i;

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** Deterministic ±10% wobble so consecutive turns never land on the same number. */
function jitter(turnIndex: number, seed: number): number {
  const n = Math.sin(turnIndex * 12.9898 + seed * 78.233) * 43758.5453;
  return 0.9 + (n - Math.floor(n)) * 0.2;
}

const RANGES: Record<ReplyMode, [number, number]> = {
  qisqa: [5, 22],
  orta: [35, 70],
  batafsil: [95, 165],
  portlash: [70, 130],
};

export function replyBudget({
  officerText,
  state,
  scenario,
  turnIndex,
}: {
  officerText: string;
  state: DialogHiddenState;
  scenario: DialogScenario;
  turnIndex: number;
}): ReplyBudget {
  const words = wordCount(officerText);
  const invitesStory = OPEN_INVITE.test(officerText);
  // A one-liner is warranted by an identity/paperwork ask, or by a very terse
  // officer utterance — not merely by any short question.
  const isClosed = !invitesStory && ((CLOSED_ASK.test(officerText) && words <= 12) || words <= 4);

  let mode: ReplyMode;
  if (isClosed) mode = "qisqa";
  else if (invitesStory && state.tension >= 70) mode = "portlash";
  else if (invitesStory || words >= 28) mode = "batafsil";
  else mode = "orta";

  let [min, max] = RANGES[mode];

  // A citizen who does not trust the officer keeps things general and short;
  // a co-operative one elaborates. Never applied to "qisqa" — it is short already.
  if (mode !== "qisqa") {
    if (state.trust < 30) {
      min = Math.round(min * 0.65);
      max = Math.round(max * 0.7);
    } else if (state.cooperation >= 60 || state.trust >= 60) {
      min = Math.round(min * 1.15);
      max = Math.round(max * 1.25);
    }
    // Snapping-angry citizens bite off short answers unless invited to vent.
    if (state.tension >= 80 && mode === "orta") {
      min = Math.round(min * 0.6);
      max = Math.round(max * 0.65);
    }
  }

  const seed = scenario.persona.name.length + scenario.id.length;
  min = Math.max(4, Math.round(min * jitter(turnIndex, seed)));
  max = Math.max(min + 6, Math.round(max * jitter(turnIndex + 1, seed)));

  return {
    mode,
    minWords: min,
    maxWords: max,
    minSentences: Math.max(1, Math.round(min / 14)),
    maxSentences: Math.max(2, Math.round(max / 9)),
  };
}

/** The Uzbek instruction block appended to the citizen system prompt. */
export function budgetInstruction(b: ReplyBudget): string {
  const shape: Record<ReplyMode, string> = {
    qisqa:
      "Xodim QISQA, aniq savol berdi — qisqa javob ber. Ortiqcha hikoya qilma, faqat so'ralganini ayt (kerak bo'lsa bitta qarshi savol qo'sh).",
    orta:
      "O'rtacha hajmli javob: so'ralganiga javob ber va ustiga 1-2 ta yangi tafsilot yoki his-tuyg'u qo'sh.",
    batafsil:
      "Xodim seni gapirishga chaqirdi — VOQEANI BATAFSIL AYT: qachon boshlangani, kimlar ishtirok etgani, aniq sanalar/vaqtlar, nima deyilgani, o'zingni qanday his qilganing, oldin kimga murojaat qilganing. Kamida uchta aniq tafsilot bo'lsin. Bitta umumiy gap bilan qutulma.",
    portlash:
      "Sen juda tarangsan va dardingni to'kib solasan: uzuq-yuluq, hissiyotli, gapdan gapga sakraydigan uzun javob. Shikoyatingni takrorlaysan, aniq misollar va sanalar keltirasan, xodimdan javob talab qilasan.",
  };
  return `\n# BU NAVBATDAGI JAVOB HAJMI — MAJBURIY
- Javobing ${b.minWords}–${b.maxWords} so'z (${b.minSentences}–${b.maxSentences} gap) bo'lsin. Bu chegaradan chiqma.
- ${shape[b.mode]}
- Gaplaring qisqa-qisqa bo'lib ketmasin; odam kabi to'liq gapir. Oldingi javobing bilan bir xil uzunlikda bo'lmasin.`;
}

/**
 * Voice turns arrive as audio, so the server can't read the officer's words
 * before the model call. Give the model the same three server-computed
 * budgets and let it pick the one that fits what it hears.
 */
export function adaptiveBudgetInstruction({
  state,
  scenario,
  turnIndex,
}: {
  state: DialogHiddenState;
  scenario: DialogScenario;
  turnIndex: number;
}): string {
  const short = replyBudget({ officerText: "ismingiz", state, scenario, turnIndex });
  const mid = replyBudget({
    officerText: "men sizni tushunaman keling shu masalani birga ko'rib chiqamiz nima qilsak bo'ladi",
    state,
    scenario,
    turnIndex,
  });
  const long = replyBudget({ officerText: "boshidan batafsil aytib bering", state, scenario, turnIndex });
  return `\n# BU NAVBATDAGI JAVOB HAJMI — MAJBURIY (xodim gapini eshitib o'zing tanla)
- Xodim shaxsni aniqlovchi / hujjat haqida QISQA savol bersa yoki juda qisqa gapirsa: ${short.minWords}–${short.maxWords} so'z. ${"Faqat so'ralganini ayt."}
- Oddiy gap yoki savol: ${mid.minWords}–${mid.maxWords} so'z; so'ralganiga javob ber va 1-2 yangi tafsilot qo'sh.
- Xodim voqeani aytib berishga chaqirsa ("boshidan aytib bering", "nima bo'ldi?"): ${long.minWords}–${long.maxWords} so'z${long.mode === "portlash" ? ", hissiyotli, uzuq-yuluq" : ", kamida uchta aniq tafsilot bilan"}.
- Bu ovozli suhbat: jonli og'zaki gapir, ro'yxat va belgilar ishlatma.`;
}
