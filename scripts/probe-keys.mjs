// Check every Gemini key in the pool and report which ones are usable.
//
// Keys are read from the environment, never from an argument, so they do not
// end up in shell history:
//
//   GEMINI_API_KEYS="AIza...,AIza..." node scripts/probe-keys.mjs
//   node scripts/probe-keys.mjs                 # reads .env.local if present
//
// Output is masked (AIzaSyC9…7h08). With --write it also writes the cleaned,
// de-duplicated list of WORKING keys to keys.valid.txt (git-ignored) so it can
// be pasted into Railway's GEMINI_API_KEYS.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const WRITE = process.argv.includes("--write");

function readKeys() {
  let raw = process.env.GEMINI_API_KEYS ?? "";
  if (!raw && existsSync(".env.local")) {
    const line = readFileSync(".env.local", "utf8").split(/\r?\n/).find((l) => l.startsWith("GEMINI_API_KEYS="));
    raw = line ? line.slice("GEMINI_API_KEYS=".length).replace(/^["']|["']$/g, "") : "";
  }
  return raw.split(/[\s,]+/).map((k) => k.trim()).filter(Boolean);
}

const mask = (k) => (k.length <= 14 ? "***" : `${k.slice(0, 8)}…${k.slice(-4)}`);
const WELL_FORMED = /^AIza[0-9A-Za-z_-]{35}$/;

async function probe(key) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "ok" }] }], generationConfig: { maxOutputTokens: 1 } }),
      }
    );
    if (res.ok) return { verdict: "ok", note: "" };
    const body = await res.text();
    const msg = /"message":\s*"([^"]{0,160})/.exec(body)?.[1] ?? `HTTP ${res.status}`;
    if (res.status === 429) return { verdict: "quota", note: msg };
    if (res.status === 400 || res.status === 401 || res.status === 403) return { verdict: "invalid", note: msg };
    return { verdict: "error", note: `HTTP ${res.status}: ${msg}` };
  } catch (e) {
    return { verdict: "error", note: String(e).slice(0, 120) };
  }
}

const all = readKeys();
if (all.length === 0) {
  console.error("GEMINI_API_KEYS bo'sh. Ishga tushirish:  GEMINI_API_KEYS=\"AIza...,AIza...\" node scripts/probe-keys.mjs");
  process.exit(2);
}

const unique = [...new Set(all)];
const duplicates = all.filter((k, i) => all.indexOf(k) !== i);
const malformed = unique.filter((k) => !WELL_FORMED.test(k));
const testable = unique.filter((k) => WELL_FORMED.test(k));

console.log(`Yozilgan: ${all.length} | takrorsiz: ${unique.length} | takror: ${[...new Set(duplicates)].length} | format xato: ${malformed.length}`);
for (const k of new Set(duplicates)) console.log(`  TAKROR      ${mask(k)}`);
for (const k of malformed) console.log(`  FORMAT XATO ${mask(k)} (uzunlik ${k.length}, kerak 39, "AIza" bilan boshlanishi shart)`);

const good = [];
for (const [i, key] of testable.entries()) {
  const { verdict, note } = await probe(key);
  if (verdict === "ok" || verdict === "quota") good.push(key);
  const label = { ok: "ISHLAYDI  ", quota: "KVOTA     ", invalid: "YAROQSIZ  ", error: "XATO      " }[verdict];
  console.log(`  ${label} ${mask(key)}${note ? " — " + note : ""}`);
  if (i < testable.length - 1) await new Promise((r) => setTimeout(r, 400));
}

console.log(`\nIshlatsa bo'ladi: ${good.length}/${unique.length}`);
if (WRITE) {
  writeFileSync("keys.valid.txt", good.join(","), "utf8");
  console.log("Toza ro'yxat yozildi: keys.valid.txt (git-ignored) — Railway GEMINI_API_KEYS ga shuni qo'ying.");
} else {
  console.log("Toza ro'yxatni faylga yozish uchun: --write");
}
