// TIR relay across server instances: a fake range (node fetch) publishes to BASE, the real instructor-station UI runs on BASE2.
// Same URL for both = single instance (memory or Postgres relay); two `next start` on one DATABASE_URL = multi-instance check.
const { chromium } = require("playwright");
const A = process.env.BASE || "http://localhost:3000";
const B = process.env.BASE2 || A;
let fails = 0;
const t = (ok, m, n = "") => { console.log((ok ? "PASS " : "FAIL ") + m + (n ? " — " + n : "")); if (!ok) fails++; };
const sid = crypto.randomUUID();
const state = (tt) => ({ t: tt, actors: [], officer: { x: 0, z: 0, yaw: 0 }, health: 100, ammo: { mag: 15, reserve: 30, reloadLeft: 0 }, weaponDrawn: false, inCover: false, backupCalled: false, backupEta: null, backupArrived: false, lastTalkAt: null, talkCount: 0, shotsFired: 3, hits: 1, officerHits: 0, lastShotAt: null, firstShotAt: null, score: 0, outcome: null, events: [{ t: 1, kind: "info", text: "fake range" }], currentLine: null, lineSeq: 0, shockSeq: 0, scriptDone: [], paused: false });
const cmds = [];
let after = -1, tick = 0, stop = false;
const range = async () => {
  while (!stop) {
    tick++;
    await fetch(`${A}/api/tir/station`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ session: sid, from: "range", msg: { type: "state", state: state(tick), scenarioId: "tir-bino-otuvchi", started: true, mid: "r" + tick }, scenarioId: "tir-bino-otuvchi", traineeId: "tr-1" }) }).catch(() => {});
    const r = await fetch(`${A}/api/tir/station?session=${sid}&role=range&after=${after}`).then((r) => r.json()).catch(() => null);
    if (r) { for (const it of r.items) { after = Math.max(after, it.seq); if (it.msg.type === "cmd") cmds.push(it.msg.cmd.cmd); } if (after < 0) after = r.seq; }
    await new Promise((r) => setTimeout(r, 1000));
  }
};
const waitFor = async (fn, ms = 15000) => { const end = Date.now() + ms; while (Date.now() < end) { if (fn()) return true; await new Promise((r) => setTimeout(r, 200)); } return fn(); };
(async () => {
  const rp = range();
  await new Promise((r) => setTimeout(r, 2500));
  const liveB = await fetch(`${B}/api/tir/station?list=1`).then((r) => r.json());
  t(liveB.items.some((x) => x.sessionId === sid), "range published on A is listed on B");
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const b = await ctx.newPage(); b.setDefaultTimeout(60000);
  const errs = []; b.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
  await b.goto(`${B}/profil`, { waitUntil: "domcontentloaded" });
  await b.evaluate(() => localStorage.setItem("h360:profile:v1", JSON.stringify({ version: 1, profile: { id: "ins-1", badgeId: "SH-0001", name: "i", rank: "", district: "", role: "instructor", createdAt: new Date().toISOString() } })));
  await b.goto(`${B}/simulyator/tir/instruktor`, { waitUntil: "domcontentloaded" });
  await b.getByTestId("live-range").first().waitFor({ timeout: 30000 });
  t(true, "picker on B shows the range from A");
  await b.getByTestId("live-range").first().getByRole("link").click();
  await b.waitForFunction(() => /server/.test(document.querySelector('[data-testid="station-status"]')?.innerText || ""), null, { timeout: 30000 });
  t(true, "station on B connected via server relay");
  const shown = await b.evaluate(() => document.body.innerText);
  t(/3\s*\/\s*1|1\s*\/\s*3/.test(shown.replace(/\n/g, " ")), "station renders range stats (shots 1/3)", shown.match(/\d\/\d/)?.[0]);
  await b.getByRole("button", { name: /Pauza|Pause|Пауза/ }).first().click();
  t(await waitFor(() => cmds.includes("pause")), "pause command reached the range on A", cmds.join(","));
  await b.getByRole("button", { name: /ALL STOP/ }).click();
  t(await waitFor(() => cmds.includes("all_stop")), "ALL STOP reached the range on A", cmds.join(","));
  // late joiner on a third context: gets latest state immediately
  const ctx2 = await browser.newContext(); const c = await ctx2.newPage();
  await c.goto(`${B}/profil`, { waitUntil: "domcontentloaded" });
  await c.evaluate(() => localStorage.setItem("h360:profile:v1", JSON.stringify({ version: 1, profile: { id: "ins-2", badgeId: "SH-0002", name: "i2", rank: "", district: "", role: "instructor", createdAt: new Date().toISOString() } })));
  await c.goto(`${B}/simulyator/tir/instruktor?session=${sid}&scenario=tir-bino-otuvchi`, { waitUntil: "domcontentloaded" });
  const late = await c.waitForFunction(() => /server/.test(document.querySelector('[data-testid="station-status"]')?.innerText || ""), null, { timeout: 15000 }).then(() => true).catch(() => false);
  t(late, "late-joining station gets state");
  const liveA = await fetch(`${A}/api/tir/station?list=1`).then((r) => r.json());
  const row = liveA.items.find((x) => x.sessionId === sid);
  t(row && row.stationSeen >= 0 && row.stationSeen < 5000, "A sees the station attached on B", JSON.stringify(row));
  t(errs.length === 0, "no page errors", errs.join(" | "));
  stop = true; await rp; await browser.close();
  console.log(fails ? `FAILS: ${fails}` : "ALL PASS");
  process.exit(fails ? 1 : 0);
})();
