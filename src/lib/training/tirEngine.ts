import type {
  Score03,
  TirAction,
  TirActorState,
  TirEvent,
  TirHitZone,
  TirOutcome,
  TirScenario,
} from "@/data/scenarios/types";

/**
 * TIR — immersive decision-range engine. Pure and deterministic: the 3D
 * scene only renders `TirState`; every officer action and every actor
 * transition is logged with legality / proportionality so the debrief can
 * point at the exact second. Speed is never scored — lawfulness is.
 */

export interface TirState {
  t: number;
  distance: number; // metres between officer and actor
  agitation: number; // 0-100
  compliance: number; // 0-100
  actorState: TirActorState;
  stateSince: number; // t when actorState was entered
  weaponDrawn: boolean;
  inCover: boolean;
  backupCalled: boolean;
  backupEta: number | null; // seconds remaining
  backupArrived: boolean;
  lastTalkAt: number | null;
  talkCount: number;
  shotsFired: number;
  hits: number;
  outcome: TirOutcome | null;
  events: TirEvent[];
  /** Subtitle line the actor is currently saying (for HUD/TTS). */
  currentLine: string | null;
  lineSeq: number;
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

export function initTir(s: TirScenario): TirState {
  const st: TirState = {
    t: 0,
    distance: s.initial.distance,
    agitation: s.initial.agitation,
    compliance: s.initial.compliance,
    actorState: "shouting",
    stateSince: 0,
    weaponDrawn: false,
    inCover: false,
    backupCalled: false,
    backupEta: null,
    backupArrived: false,
    lastTalkAt: null,
    talkCount: 0,
    shotsFired: 0,
    hits: 0,
    outcome: null,
    events: [],
    currentLine: null,
    lineSeq: 0,
  };
  return say(pushEvent(st, { kind: "system", text: s.briefing.uz }), s, "shouting");
}

function pushEvent(st: TirState, e: Omit<TirEvent, "t" | "distance" | "agitation" | "compliance">): TirState {
  return {
    ...st,
    events: [
      ...st.events,
      {
        t: Math.round(st.t * 10) / 10,
        distance: Math.round(st.distance * 10) / 10,
        agitation: Math.round(st.agitation),
        compliance: Math.round(st.compliance),
        ...e,
      },
    ],
  };
}

function say(st: TirState, s: TirScenario, state: TirActorState): TirState {
  const lines = s.actor.lines[state];
  if (!lines || lines.length === 0) return st;
  const line = lines[st.lineSeq % lines.length];
  return { ...st, currentLine: line, lineSeq: st.lineSeq + 1 };
}

function setActor(st: TirState, s: TirScenario, next: TirActorState, text?: string): TirState {
  if (st.actorState === next) return st;
  let out: TirState = { ...st, actorState: next, stateSince: st.t };
  out = pushEvent(out, { kind: "actor", actorState: next, text: text ?? ACTOR_TEXT[next] });
  return say(out, s, next);
}

const ACTOR_TEXT: Record<TirActorState, string> = {
  shouting: "Shaxs baqirmoqda",
  approaching: "Shaxs yaqinlashmoqda",
  knife_raised: "Shaxs qurolni ko'tardi",
  lunging: "Shaxs tashlandi!",
  dropping: "Shaxs qurolni tashlamoqda",
  kneeling: "Shaxs tiz cho'kdi — itoat qildi",
  fleeing: "Shaxs qochmoqda",
  down: "Shaxs yerda",
  calm: "Shaxs tinchlandi",
};

const weaponVisible = (s: TirScenario) => s.actor.weapon !== "none";
const threatState = (a: TirActorState) => a === "knife_raised" || a === "lunging";
const resolvedState = (a: TirActorState) => a === "kneeling" || a === "down" || a === "calm" || a === "fleeing";

/* ------------------------------------------------------------------------ */
/* Officer actions                                                          */
/* ------------------------------------------------------------------------ */

export interface ActionResult {
  state: TirState;
  legality: Score03;
  proportionality: Score03;
  text: string;
}

export function applyAction(
  st: TirState,
  s: TirScenario,
  action: TirAction,
  detail?: { hit?: TirHitZone; phrase?: string }
): ActionResult {
  if (st.outcome) return { state: st, legality: 3, proportionality: 3, text: "" };
  let n: TirState = { ...st };
  let L: Score03 = 3;
  let P: Score03 = 3;
  let text = "";
  const a = st.actorState;
  const d = st.distance;

  // Talking works — but not as a button-mash: rapid repeats lose effect, and
  // compliance only grows once agitation has been brought down first.
  const sinceTalk = st.lastTalkAt == null ? 99 : st.t - st.lastTalkAt;
  const talkEff = sinceTalk < 2.5 ? 0.35 : sinceTalk < 5 ? 0.7 : 1;
  const complyGain = (base: number) => base * talkEff * Math.max(0.25, 1.15 - n.agitation / 100);

  switch (action) {
    case "talk_calm": {
      const drop = (a === "knife_raised" ? 6 : 10) * talkEff;
      n.agitation = clamp(n.agitation - drop);
      n.compliance = clamp(n.compliance + complyGain(9));
      n.lastTalkAt = st.t;
      n.talkCount++;
      text = detail?.phrase ?? "Xotirjam muloqot";
      if (a === "lunging") { P = 1; text += " (tashlanish paytida — kech)"; }
      break;
    }
    case "talk_command": {
      if (n.agitation < 60 || a === "knife_raised") n.compliance = clamp(n.compliance + complyGain(12));
      else n.agitation = clamp(n.agitation + 4 * talkEff);
      n.lastTalkAt = st.t;
      n.talkCount++;
      text = detail?.phrase ?? "Buyruq";
      break;
    }
    case "talk_threat": {
      n.agitation = clamp(n.agitation + 14);
      n.compliance = clamp(n.compliance - 5);
      n.lastTalkAt = st.t;
      n.talkCount++;
      text = detail?.phrase ?? "Tahdid";
      L = a === "lunging" ? 3 : 2;
      P = a === "lunging" || a === "knife_raised" ? 2 : 1;
      break;
    }
    case "draw": {
      if (n.weaponDrawn) return { state: st, legality: 3, proportionality: 3, text: "" };
      n.weaponDrawn = true;
      const justified = weaponVisible(s) && (threatState(a) || d <= 5);
      L = justified ? 3 : 2;
      P = justified ? 2 : 1;
      if (!justified) n.agitation = clamp(n.agitation + 10);
      else n.agitation = clamp(n.agitation + 3);
      text = justified ? "Qurol chiqarildi (past tayyor holat)" : "Qurol muddatidan oldin chiqarildi";
      break;
    }
    case "holster": {
      if (!n.weaponDrawn) return { state: st, legality: 3, proportionality: 3, text: "" };
      n.weaponDrawn = false;
      const safe = !threatState(a);
      L = 3;
      P = safe ? 3 : 1;
      if (safe) n.agitation = clamp(n.agitation - 6);
      text = safe ? "Qurol g'ilofga solindi" : "Xavf paytida qurol g'ilofga solindi";
      break;
    }
    case "taser": {
      const inRange = d <= 6;
      const threat = weaponVisible(s) && (threatState(a) || (a === "approaching" && n.agitation > 70 && d <= 4));
      const verbalTried = n.talkCount >= 1;
      if (!inRange) {
        text = "Elektroshok — masofa uzoq, ta'sir yo'q";
        L = threat ? 3 : 1;
        P = threat ? 2 : 0;
        break;
      }
      if (threat) {
        L = 3;
        P = verbalTried ? 3 : 2;
        text = "Elektroshok qo'llanildi — shaxs yerga tushdi";
        n = setActor(n, s, "down", "Shaxs elektroshokdan yerga tushdi");
        n.outcome = "resolved_less_lethal";
      } else {
        L = 1;
        P = 0;
        text = "Elektroshok xavf bo'lmagan holatda — nomutanosib kuch";
        n = setActor(n, s, "down", "Shaxs elektroshokdan yerga tushdi");
        n.outcome = "unlawful_force";
      }
      break;
    }
    case "shoot": {
      if (!n.weaponDrawn) {
        return { state: st, legality: 3, proportionality: 3, text: "" };
      }
      const hit: TirHitZone = detail?.hit ?? "miss";
      n.shotsFired++;
      const lastResort = a === "lunging" && d <= s.rules.lungeDistance + 0.5;
      const imminent = a === "knife_raised" && d <= 3 && n.agitation >= 85;
      if (lastResort) { L = 3; P = 3; }
      else if (imminent) { L = 2; P = 2; }
      else { L = 0; P = 0; }
      text =
        (lastResort ? "O'q uzildi — oxirgi chora" : imminent ? "O'q uzildi — bevosita xavf" : "O'q uzildi — xavf shartlari YO'Q") +
        (hit === "miss" ? " (o'q tegmadi)" : ` (${hit})`);
      if (hit !== "miss") {
        n.hits++;
        n = setActor(n, s, "down", "Shaxs o'qdan yerga tushdi");
        n.outcome = L === 0 ? "unlawful_force" : "resolved_lethal_lawful";
      } else if (L === 0) {
        // Missing does not make an unlawful shot lawful.
        n.outcome = "unlawful_force";
        n.agitation = 100;
      } else {
        n.agitation = clamp(n.agitation + 5);
      }
      return { state: pushEvent(n, { kind: "action", action, text, legality: L, proportionality: P, hit }), legality: L, proportionality: P, text };
    }
    case "backup": {
      if (n.backupCalled) return { state: st, legality: 3, proportionality: 3, text: "" };
      n.backupCalled = true;
      n.backupEta = s.rules.backupEtaSec;
      text = `Qo'shimcha kuch va tez yordam chaqirildi (≈${s.rules.backupEtaSec}s)`;
      break;
    }
    case "retreat": {
      n.distance = Math.min(n.distance + 2, 12);
      n.agitation = clamp(n.agitation - 3);
      const useful = d < 6 && a !== "kneeling" && a !== "down";
      L = 3;
      P = useful ? 3 : 2;
      text = "Masofa oshirildi (vaqt + masofa)";
      if (a === "lunging") { n.distance = Math.min(n.distance + 1, 12); }
      break;
    }
    case "cover": {
      n.inCover = !n.inCover;
      text = n.inCover ? "To'siq ortiga o'tildi" : "To'siqdan chiqildi";
      P = n.inCover ? 3 : 2;
      break;
    }
  }
  return { state: pushEvent(n, { kind: "action", action, text, legality: L, proportionality: P }), legality: L, proportionality: P, text };
}

/* ------------------------------------------------------------------------ */
/* Tick                                                                     */
/* ------------------------------------------------------------------------ */

export function tick(st: TirState, s: TirScenario, dt: number): TirState {
  if (st.outcome) return st;
  let n: TirState = { ...st, t: st.t + dt };
  const r = s.rules;
  const a = n.actorState;
  const sinceTalk = n.lastTalkAt == null ? n.t : n.t - n.lastTalkAt;

  // Backup timer.
  if (n.backupCalled && n.backupEta != null && !n.backupArrived) {
    n.backupEta = Math.max(0, n.backupEta - dt);
    if (n.backupEta === 0) {
      n.backupArrived = true;
      n.agitation = clamp(n.agitation - 15);
      if (!threatState(a)) n.compliance = clamp(n.compliance + 15);
      n = pushEvent(n, { kind: "system", text: "Qo'shimcha kuch yetib keldi" });
    }
  }

  // Silence drift: unaddressed shouting escalates.
  if ((a === "shouting" || a === "approaching" || a === "knife_raised") && sinceTalk > 6) {
    n.agitation = clamp(n.agitation + r.silenceDrift * dt);
  }
  // Drawn weapon on a non-threatening actor keeps agitation up.
  if (n.weaponDrawn && !threatState(a) && !resolvedState(a)) n.agitation = clamp(n.agitation + 1.5 * dt);

  // State transitions.
  if (a === "shouting") {
    if (n.agitation >= 55 && n.t - n.stateSince > 4) n = setActor(n, s, "approaching");
    else if (n.compliance >= r.complyCompliance && n.agitation < 45) n = setActor(n, s, "calm");
  } else if (a === "approaching") {
    if (n.distance > r.minDistance) n.distance = Math.max(r.minDistance, n.distance - r.approachSpeed * dt);
    if (weaponVisible(s) && (n.agitation >= 70 || (n.lastTalkAt == null && n.t >= r.raiseWeaponAfterSec)))
      n = setActor(n, s, "knife_raised");
    else if (n.compliance >= r.complyCompliance && n.agitation < 55) n = setActor(n, s, weaponVisible(s) ? "dropping" : "calm");
    else if (n.agitation < 40) n = setActor(n, s, "shouting");
  } else if (a === "knife_raised") {
    if (n.distance > r.minDistance && n.agitation >= 60) n.distance = Math.max(r.minDistance, n.distance - r.approachSpeed * 0.6 * dt);
    if (n.agitation >= r.lungeAgitation && n.distance <= r.lungeDistance) n = setActor(n, s, "lunging");
    else if (n.compliance >= r.complyCompliance) n = setActor(n, s, "dropping");
    else if (n.agitation < 50 && n.t - n.stateSince > 6) n = setActor(n, s, "approaching");
  } else if (a === "lunging") {
    n.distance = Math.max(0, n.distance - 3.2 * dt);
    if (n.distance <= 0.4) {
      n = pushEvent(n, { kind: "system", text: n.inCover ? "Shaxs to'siqqa urildi — xodim to'siq ortida" : "Shaxs xodimga yetib keldi — xodim jarohatlandi" });
      if (n.inCover) {
        n.agitation = clamp(n.agitation - 20);
        n.distance = 2;
        n = setActor(n, s, "knife_raised");
      } else {
        n.outcome = "officer_injured";
      }
    }
  } else if (a === "dropping") {
    if (n.t - n.stateSince > 2) n = setActor(n, s, "kneeling");
  } else if (a === "kneeling" || a === "calm") {
    if (n.t - n.stateSince > 3) {
      n.outcome = "resolved_verbal";
      n = pushEvent(n, { kind: "system", text: "Vaziyat kuch ishlatmasdan hal qilindi" });
    }
  }

  if (!n.outcome && n.t >= r.durationSec) {
    n.outcome = "timeout";
    n = pushEvent(n, { kind: "system", text: "Vaqt tugadi — vaziyat hal qilinmadi" });
  }
  return n;
}

/* ------------------------------------------------------------------------ */
/* Talk classification (deterministic keyword heuristics, uz/ru)             */
/* ------------------------------------------------------------------------ */

const THREAT_WORDS = ["otaman", "o'ldiraman", "sindiraman", "urib", "ot!", "tashla bo'lmasa", "стреля", "убью", "сломаю"];
const COMMAND_WORDS = ["qo'ying", "qo'y", "tashlang", "tashla", "to'xtang", "to'xta", "orqaga", "yerga", "qo'lingizni", "положи", "брось", "стой", "назад", "руки"];
const CALM_WORDS = ["tushunaman", "eshitaman", "yordam", "xotirjam", "ismingiz", "gaplashamiz", "kerak emas", "hech kim", "ishonaman", "понимаю", "помогу", "спокойно", "поговорим"];

export function classifyTalk(text: string): TirAction {
  const t = text.toLowerCase();
  if (THREAT_WORDS.some((w) => t.includes(w))) return "talk_threat";
  const cmd = COMMAND_WORDS.some((w) => t.includes(w));
  const calm = CALM_WORDS.some((w) => t.includes(w));
  if (cmd && !calm) return "talk_command";
  return "talk_calm";
}

export const TIR_PRESET_PHRASES: { action: TirAction; uz: string }[] = [
  { action: "talk_calm", uz: "Men ichki ishlar xodimi. Sizga yordam berish uchun keldim — meni eshiting." },
  { action: "talk_calm", uz: "Tushunaman, sizga og'ir. Hech kim sizga tegmaydi. Ismingiz nima?" },
  { action: "talk_command", uz: "Pichoqni yerga qo'ying va orqaga bir qadam tashlang." },
  { action: "talk_command", uz: "To'xtang! Yaqinlashmang. Qo'llaringizni ko'rsating." },
  { action: "talk_threat", uz: "Tashla, bo'lmasa otaman!" },
];

export function outcomeSummary(o: TirOutcome): { uz: string; tone: "good" | "partial" | "bad" } {
  switch (o) {
    case "resolved_verbal": return { uz: "Kuch ishlatmasdan hal qilindi — a'lo natija", tone: "good" };
    case "resolved_less_lethal": return { uz: "Elektroshok bilan, qonuniy va mutanosib", tone: "good" };
    case "resolved_lethal_lawful": return { uz: "O'q uzildi — oxirgi chora sifatida qonuniy", tone: "partial" };
    case "unlawful_force": return { uz: "Nomutanosib / qonunsiz kuch", tone: "bad" };
    case "officer_injured": return { uz: "Xodim jarohatlandi — vaziyat nazoratdan chiqdi", tone: "bad" };
    case "timeout": return { uz: "Vaqt tugadi — vaziyat hal qilinmadi", tone: "partial" };
  }
}
