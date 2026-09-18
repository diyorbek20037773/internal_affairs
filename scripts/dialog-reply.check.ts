import { replyBudget } from "@/lib/training/replyBudget";
import { partialString } from "@/lib/gemini/partialJson";
import { qoshniNizo } from "@/data/scenarios/dialog/qoshni-nizo";

let pass = 0, fail = 0;
const check = (name: string, ok: boolean, note = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${note ? " — " + note : ""}`); };

const sc = qoshniNizo;
const st = (o: Partial<{ tension: number; trust: number; cooperation: number }> = {}) => ({
  tension: 50, trust: 40, cooperation: 40, phase: "tinglash" as const, revealed: [] as string[], ...o,
});

// 1) The officer's utterance decides the size of the reply.
{
  const open = replyBudget({
    officerText: "Iltimos, boshidan, hech narsani tashlab qo'ymay nima bo'lganini batafsil aytib bering.",
    state: st(), scenario: sc, turnIndex: 1,
  });
  check("open invitation → batafsil, ≥80 so'z", open.mode === "batafsil" && open.maxWords >= 80, JSON.stringify(open));

  const closed = replyBudget({ officerText: "Familiyangiz nima?", state: st(), scenario: sc, turnIndex: 1 });
  check("closed question → qisqa, ≤30 so'z", closed.mode === "qisqa" && closed.maxWords <= 30, JSON.stringify(closed));
  check("closed < open", closed.maxWords < open.minWords, `${closed.maxWords} vs ${open.minWords}`);

  const mid = replyBudget({ officerText: "Qo'shningiz bilan qachondan beri nizolashasiz?", state: st(), scenario: sc, turnIndex: 2 });
  check("ordinary question → orta", mid.mode === "orta" && mid.maxWords > closed.maxWords, JSON.stringify(mid));

  const vent = replyBudget({
    officerText: "Boshidan aytib bering, nima bo'lgan?", state: st({ tension: 85 }), scenario: sc, turnIndex: 1,
  });
  check("high tension + invitation → portlash", vent.mode === "portlash" && vent.maxWords >= 60, JSON.stringify(vent));
}

// 2) Hidden state moves the budget.
{
  const guarded = replyBudget({ officerText: "Nima bo'lganini tushuntiring, eshitaman.", state: st({ trust: 10 }), scenario: sc, turnIndex: 3 });
  const trusting = replyBudget({ officerText: "Nima bo'lganini tushuntiring, eshitaman.", state: st({ trust: 70, cooperation: 70 }), scenario: sc, turnIndex: 3 });
  check("low trust → shorter than high trust", guarded.maxWords < trusting.maxWords, `${guarded.maxWords} vs ${trusting.maxWords}`);
}

// 3) Consecutive turns never get an identical budget (no robotic rhythm).
{
  const lens = [1, 2, 3, 4, 5].map(
    (i) => replyBudget({ officerText: "Qo'shningiz nima dedi?", state: st(), scenario: sc, turnIndex: i }).maxWords
  );
  check("budget varies across turns", new Set(lens).size >= 4, lens.join(","));
  const a = replyBudget({ officerText: "Qo'shningiz nima dedi?", state: st(), scenario: sc, turnIndex: 7 });
  const b = replyBudget({ officerText: "Qo'shningiz nima dedi?", state: st(), scenario: sc, turnIndex: 7 });
  check("same input → same budget (deterministic)", a.maxWords === b.maxWords && a.minWords === b.minWords);
  check("min < max always", lens.every((n) => n > 0) && a.minWords < a.maxWords);
}

// 4) Partial JSON reading — what the stream shows while the model is still typing.
{
  check("complete value", partialString('{"reply":"Salom aka","assessment":{}}', "reply") === "Salom aka");
  check("still streaming", partialString('{"reply":"Salom ak', "reply") === "Salom ak");
  check("escaped quote + newline", partialString('{"reply":"U \\"ket\\" dedi.\\nKeyin', "reply") === 'U "ket" dedi.\nKeyin');
  check("dangling backslash dropped", partialString('{"reply":"Salom\\', "reply") === "Salom");
  check("partial \\u escape dropped", partialString('{"reply":"Salom\\u04', "reply") === "Salom");
  check("unicode escape decoded", partialString('{"reply":"\\u0421alom"', "reply") === "Сalom");
  check("key absent yet", partialString('{"rep', "reply") === "");
}

console.log(`\n${pass}/${pass + fail} dialog reply checks passed`);
process.exit(fail ? 1 : 0);
