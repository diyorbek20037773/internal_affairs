process.env.GEMINI_API_KEYS = "k1,k2,k3,k4";

import { __resetPool, coolKey, loadKeys, pickKey, poolHealth, classifyKeyError, withKeyFailover } from "@/lib/gemini/keyPool";

let pass = 0, fail = 0;
const check = (name: string, ok: boolean, note = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${note ? " — " + note : ""}`); };
const none = () => new Set<string>();
const quota = () => Object.assign(new Error("429 quota exceeded"), { status: 429 });

async function main() {
  // 1) Consecutive requests walk the pool in order and wrap around.
  {
    __resetPool();
    const keys = loadKeys();
    const seen = [0, 1, 2, 3, 4, 5].map(() => pickKey(keys, none()));
    check("round-robin order", JSON.stringify(seen) === JSON.stringify(["k1", "k2", "k3", "k4", "k1", "k2"]), seen.join(","));
    check("no key twice in a row", seen.slice(1).every((k, i) => k !== seen[i]));
  }

  // 2) Every key carries the same share of the load (random picking did not).
  {
    __resetPool();
    const keys = loadKeys();
    const count = new Map<string, number>();
    for (let i = 0; i < 400; i++) {
      const k = pickKey(keys, none())!;
      count.set(k, (count.get(k) ?? 0) + 1);
    }
    const shares = keys.map((k) => count.get(k) ?? 0);
    check("even distribution (100 each)", shares.every((n) => n === 100), shares.join(","));
  }

  // 3) A key that hit its quota is skipped by the following requests.
  {
    __resetPool();
    const keys = loadKeys();
    let burned = "";
    await withKeyFailover(async (_ai, key) => { burned = key; throw quota(); }, { maxRetries: 1 }).catch(() => {});
    const after = [0, 1, 2, 3, 4, 5].map(() => pickKey(keys, none()));
    check("quota-cooled key skipped", burned === "k1" && !after.includes("k1"), `burned=${burned} after=${after.join(",")}`);
    check("healthy keys keep rotating", new Set(after).size === 3, after.join(","));
  }

  // 4) Failover inside one request rotates through distinct keys, then gives up.
  {
    __resetPool();
    const used: string[] = [];
    let caught = "";
    await withKeyFailover(async (_ai, key) => { used.push(key); throw quota(); }, { maxRetries: 4 })
      .catch((e) => { caught = (e as Error).name; });
    check("failover tries 4 distinct keys", used.length === 4 && new Set(used).size === 4, used.join(","));
    check("exhausted pool → AllKeysExhaustedError", caught === "AllKeysExhaustedError", caught);
  }

  // 5) A fatal error is not retried on another key.
  {
    __resetPool();
    const used: string[] = [];
    await withKeyFailover(async (_ai, key) => { used.push(key); throw new Error("bad request shape"); }).catch(() => {});
    check("fatal error → no rotation", used.length === 1, used.join(","));
  }

  // 6) A wave of server-side errors must never park the whole pool.
  {
    __resetPool();
    const keys = loadKeys();
    keys.forEach((k) => coolKey(k, "timeout", keys));
    const h = poolHealth();
    check("cooling capped at half the pool", h.cooling <= keys.length / 2 && h.healthy >= keys.length / 2, `healthy=${h.healthy} cooling=${h.cooling}`);
    const picks = [0, 1].map(() => pickKey(keys, none()));
    check("healthy keys still served after the wave", picks.every((k) => k !== null) && new Set(picks).size === 2, picks.join(","));
  }

  check("classify: 429 → quota", classifyKeyError(quota()) === "quota");
  check("classify: 503 → overloaded", classifyKeyError(Object.assign(new Error("x"), { status: 503 })) === "overloaded");
  check("classify: bad key → invalid", classifyKeyError(new Error("API_KEY_INVALID")) === "invalid");

  console.log(`\n${pass}/${pass + fail} key pool checks passed`);
  process.exit(fail ? 1 : 0);
}

void main();
