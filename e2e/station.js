// Cross-device instructor station E2E: range in context A, station in context B (no shared BroadcastChannel → server relay).
const { chromium } = require("playwright");
const B = process.env.BASE || "http://localhost:3000";
const B2 = process.env.BASE2 || B;
let fails = 0;
const t = (ok, m, n = "") => { console.log((ok ? "PASS " : "FAIL ") + m + (n ? " — " + n : "")); if (!ok) fails++; };
const seed = async (page, id, role, base = B) => {
  await page.goto(`${base}/profil`, { waitUntil: "domcontentloaded" });
  await page.evaluate(([id, role]) => localStorage.setItem("h360:profile:v1", JSON.stringify({ version: 1, profile: { id, badgeId: role === "instructor" ? "SH-0001" : "SH-0473", name: role, rank: "", district: "", role, createdAt: new Date().toISOString() } })), [id, role]);
};
(async () => {
  const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const A = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await A.newPage(); a.setDefaultTimeout(90000); a.setDefaultNavigationTimeout(120000);
  const errs = []; a.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
  await seed(a, "tr-1", "trainee");
  await a.goto(`${B}/simulyator/tir/tir-bino-otuvchi?quality=low&controls=fixed&lock=0`, { waitUntil: "domcontentloaded" });
  await a.waitForSelector("canvas", { timeout: 120000 });
  await a.waitForTimeout(2000);
  await a.getByRole("button", { name: /Poligonni boshlash/ }).click();
  await a.waitForTimeout(2500);
  const sid = await a.evaluate(() => JSON.parse(localStorage.getItem("h360:sessions:v1")).items.map((s) => s.id).at(-1));
  t(!!sid, "range session id", sid);

  // relay sees the range
  const live = await a.evaluate(() => fetch("/api/tir/station?list=1").then((r) => r.json()));
  t(live.items.some((r) => r.sessionId === sid && r.scenarioId === "tir-bino-otuvchi"), "range listed as live on the server", JSON.stringify(live.items).slice(0, 120));

  // station on another "device"
  const Bc = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const b = await Bc.newPage(); b.setDefaultTimeout(90000); b.setDefaultNavigationTimeout(120000);
  await seed(b, "ins-1", "instructor", B2);
  await b.goto(`${B2}/simulyator/tir/instruktor`, { waitUntil: "domcontentloaded" });
  await b.getByTestId("live-range").first().waitFor({ timeout: 20000 });
  t(true, "live ranges picker shows the range");
  await b.getByTestId("live-range").first().getByRole("link").click();
  await b.waitForFunction(() => /server/.test(document.querySelector('[data-testid="station-status"]')?.innerText || ""), null, { timeout: 20000 });
  t(true, "station connected via server");
  const t0 = await a.evaluate(() => window.__h360tir.t);
  // pause from the station → range engine stops advancing
  await b.getByRole("button", { name: /Pauza|Pause|Пауза/ }).first().click();
  await b.waitForTimeout(2500);
  const t1 = await a.evaluate(() => window.__h360tir.t);
  await b.waitForTimeout(2000);
  const t2 = await a.evaluate(() => window.__h360tir.t);
  t(t1 > t0 && Math.abs(t2 - t1) < 0.3, "pause command over the relay stops the range clock", `t0=${t0} t1=${t1} t2=${t2}`);
  // ALL STOP
  await b.getByRole("button", { name: /ALL STOP/ }).click();
  await b.waitForTimeout(2500);
  const out = await a.evaluate(() => window.__h360tir.outcome);
  t(out === "timeout", "ALL STOP over the relay ends the scenario", `outcome=${out}`);
  t(errs.length === 0, "no page errors on the range", errs.join(" | "));
  await browser.close();
  console.log(fails ? `FAILS: ${fails}` : "ALL PASS");
  process.exit(fails ? 1 : 0);
})();
