// Ta'lim klasteri modules: crawl new routes at tablet + desktop widths (errors, overflow,
// untranslated keys) and play one profession simulator's first stage.
// BASE=http://localhost:3100 node e2e/kasb.js
const { chromium } = require("playwright");
const fs = require("fs");
const B = process.env.BASE || "https://internalaffairs-production.up.railway.app";
const OUT = __dirname + "/.out/kasb";
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = [
  "/", "/kasblar", "/kasblar/tergovchi", "/kasblar/bojxona", "/klasterlar", "/pasport",
  "/kasb-simulyator", "/kasb-simulyator?profession=kiber",
  "/kasb-simulyator/sim-tergovchi-01", "/kasb-simulyator/sim-ekspert-01", "/kasb-simulyator/sim-kiber-01",
  "/kasb-simulyator/sim-tahlilchi-01", "/kasb-simulyator/sim-bojxona-01",
  "/tutor", "/tutor?agency=bojxona", "/tutor/iiv-ariza-qabul",
  "/simulyator/muloqot/dialog-case04-agressiv", "/ru/kasblar", "/en/pasport",
];
let fails = 0;
(async () => {
  const browser = await chromium.launch();
  for (const [name, vp] of [["tab", { width: 820, height: 1180 }], ["desk", { width: 1366, height: 900 }]]) {
    const ctx = await browser.newContext({ viewport: vp, locale: "uz" });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { if (m.type() === "error") errs.push("[console] " + m.text().slice(0, 200)); });
    page.on("pageerror", (e) => errs.push("[pageerror] " + String(e).slice(0, 200)));
    page.on("response", (r) => { if (r.status() >= 400 && !/\/api\/(tts|auth|store)/.test(r.url())) errs.push(`[http ${r.status()}] ${r.url().replace(B, "")}`); });
    await page.goto(`${B}/profil`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const ph = page.getByPlaceholder("Muminov Joldas Kamalovich");
    if (await ph.count()) {
      await ph.fill("Muminov Joldas Kamalovich");
      await page.getByPlaceholder("SH-0473").fill("SH-0473");
      await page.getByPlaceholder("mayor").fill("mayor").catch(() => {});
      await page.getByRole("button", { name: "Saqlash" }).click().catch(() => {});
      await page.waitForTimeout(600);
    }
    for (const r of ROUTES) {
      errs.length = 0;
      await page.goto(`${B}${r}`, { waitUntil: "domcontentloaded", timeout: 60000 }).catch((e) => errs.push("[nav] " + e));
      await page.waitForTimeout(1500);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      const text = await page.locator("body").innerText().catch(() => "");
      const rawKeys = (text.match(/\b(kasb|kasbsim|tutor|dashboard|nav)\.[a-zA-Z.]+\b/g) || []).slice(0, 3);
      await page.screenshot({ path: `${OUT}/${name}-${r.replace(/[/?=]/g, "_") || "root"}.png`, fullPage: true }).catch(() => {});
      const bad = overflow || rawKeys.length || errs.length;
      if (bad) fails++;
      console.log(`${bad ? "FAIL" : "ok  "} ${name} ${r} overflow=${overflow} keys=${rawKeys.join(",")} ${[...new Set(errs)].slice(0, 3).join(" | ")}`);
    }

    // Play the first stage of T-01: start, pick the first option / item, submit.
    if (name === "tab") {
      await page.goto(`${B}/kasb-simulyator/sim-tergovchi-01`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);
      const before = await page.locator("body").innerText();
      const start = page.getByRole("button", { name: /Boshlash|Start/i }).first();
      if (await start.count()) await start.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/play-1.png`, fullPage: true });
      console.log("play: started =", (await page.locator("body").innerText()) !== before);
    }
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? `\n${fails} route checks failed` : "\nall route checks passed");
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error("FATAL", e); process.exit(2); });
