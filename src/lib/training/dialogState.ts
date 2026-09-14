import {
  DIALOG_PHASES,
  type DialogEndReason,
  type DialogHiddenState,
  type DialogScenario,
  type DialogTurnAssessment,
} from "@/data/scenarios/types";

const MAX_DELTA = 25;
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
  const dT = clamp(a.delta.tension, -MAX_DELTA, MAX_DELTA);
  const dR = clamp(a.delta.trust, -MAX_DELTA, MAX_DELTA);
  const dC = clamp(a.delta.cooperation, -MAX_DELTA, MAX_DELTA);

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

  // Phase machine: may advance or hold; hostility resets to de-escalation work.
  const curIdx = DIALOG_PHASES.indexOf(state.phase);
  const detIdx = DIALOG_PHASES.indexOf(a.phaseDetected);
  let phase = state.phase;
  if (hostile) {
    phase = "deeskalatsiya";
  } else if (detIdx > curIdx) {
    // Kelishuv is gated by the scenario's success thresholds.
    if (a.phaseDetected === "kelishuv") {
      if (trust >= scenario.successCondition.minTrust && tension <= scenario.successCondition.maxTension) {
        phase = "kelishuv";
      } else {
        phase = DIALOG_PHASES[Math.min(detIdx, curIdx + 1)] === "kelishuv" ? state.phase : DIALOG_PHASES[curIdx + 1];
      }
    } else {
      phase = a.phaseDetected;
    }
  }

  return { tension, trust, cooperation, phase, revealed: state.revealed };
}

/** Mark secret facts the citizen's reply has surfaced (fuzzy contains match). */
export function detectReveals(
  reply: string,
  state: DialogHiddenState,
  scenario: DialogScenario
): string[] {
  if (state.trust < scenario.revealTrust) return state.revealed;
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
