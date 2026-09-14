import {
  DIALOG_PHASES,
  type DialogEndReason,
  type DialogHiddenState,
  type DialogScenario,
  type DialogTurnAssessment,
} from "@/data/scenarios/types";

const MAX_DELTA = 25;
const POSITIVE: ReadonlySet<string> = new Set(["faol_tinglash", "empatiya", "huquqiy_tushuntirish", "savol_ochiq"]);
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));

/**
 * Server-side state math for the virtual citizen. The LLM proposes deltas; we
 * bound them, advance the phase machine and detect end conditions. The client
 * never trusts its own copy of the state.
 */
export function applyDelta(
  state: DialogHiddenState,
  a: DialogTurnAssessment,
  scenario: DialogScenario
): DialogHiddenState {
  let dT = clamp(a.delta.tension, -MAX_DELTA, MAX_DELTA);
  let dR = clamp(a.delta.trust, -MAX_DELTA, MAX_DELTA);
  let dC = clamp(a.delta.cooperation, -MAX_DELTA, MAX_DELTA);

  // Consistency floor: a turn the model itself tagged with 2+ constructive
  // behaviours must move the needle, whatever mood the citizen is in.
  const positives = a.flags.filter((f) => POSITIVE.has(f)).length;
  const negatives = a.flags.some((f) => f === "haqorat" || f === "tahdid" || f === "qonun_buzilishi");
  if (positives >= 2 && !negatives) {
    dT = Math.min(dT, -8);
    dR = Math.max(dR, 6);
    dC = Math.max(dC, 4);
  } else if (positives === 1 && !negatives) {
    dT = Math.min(dT, -3);
    dR = Math.max(dR, 2);
  }

  let tension = clamp(state.tension + dT, 0, 100);
  let trust = clamp(state.trust + dR, 0, 100);
  const cooperation = clamp(state.cooperation + dC, 0, 100);

  // Hard consequences that don't depend on the model's generosity.
  const hostile = a.flags.includes("haqorat") || a.flags.includes("tahdid");
  const unlawful = a.flags.includes("qonun_buzilishi");
  if (hostile) {
    tension = clamp(Math.max(tension, state.tension + 12), 0, 100);
    trust = clamp(Math.min(trust, state.trust - 8), 0, 100);
  }
  if (unlawful) trust = clamp(trust - 10, 0, 100);

  // Phase machine: advances at most ONE step per turn, never skips; hostility
  // drops the officer back to de-escalation work. Kelishuv is gated by the
  // scenario's success thresholds so the citizen can't be "talked into" it early.
  const curIdx = DIALOG_PHASES.indexOf(state.phase);
  const detIdx = DIALOG_PHASES.indexOf(a.phaseDetected);
  const kelishuvIdx = DIALOG_PHASES.indexOf("kelishuv");
  const meetsSuccess =
    trust >= scenario.successCondition.minTrust && tension <= scenario.successCondition.maxTension;
  let phase = state.phase;
  if (hostile) {
    phase = curIdx > DIALOG_PHASES.indexOf("deeskalatsiya") ? "deeskalatsiya" : state.phase;
  } else if (detIdx > curIdx) {
    const nextIdx = Math.min(detIdx, curIdx + 1);
    if (nextIdx === kelishuvIdx && !meetsSuccess) {
      phase = state.phase; // hold until thresholds are met
    } else {
      phase = DIALOG_PHASES[nextIdx];
    }
  }
  // Thresholds met and the officer is already explaining / proposing terms →
  // the citizen is ready to agree; allow the jump to kelishuv.
  const tushIdx = DIALOG_PHASES.indexOf("tushuntirish");
  if (!hostile && meetsSuccess && (detIdx >= tushIdx || DIALOG_PHASES.indexOf(phase) >= tushIdx)) {
    phase = "kelishuv";
  }

  return { tension, trust, cooperation, phase, revealed: state.revealed };
}

/** Mark secret facts the citizen's reply has surfaced (fuzzy contains match). */
export function detectReveals(
  reply: string,
  state: DialogHiddenState,
  scenario: DialogScenario
): string[] {
  // No trust gate here: the model decides WHEN to reveal (prompt-gated);
  // we only record what actually surfaced in the reply.
  const lower = reply.toLowerCase();
  const found = scenario.persona.secretFacts.filter((fact) => {
    if (state.revealed.includes(fact)) return false;
    // any 2 "significant" words of the fact appearing in the reply counts
    const words = fact
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 5);
    const hits = words.filter((w) => lower.includes(w)).length;
    return hits >= Math.min(2, words.length);
  });
  return found.length ? [...state.revealed, ...found] : state.revealed;
}

export function checkEnd(
  state: DialogHiddenState,
  officerTurns: number,
  scenario: DialogScenario
): DialogEndReason | null {
  if (state.tension >= scenario.failCondition.tension) return "eskalatsiya";
  if (
    state.phase === "kelishuv" &&
    state.trust >= scenario.successCondition.minTrust &&
    state.tension <= scenario.successCondition.maxTension
  )
    return "kelishuv";
  if (officerTurns >= scenario.maxTurns) return "limit";
  return null;
}
