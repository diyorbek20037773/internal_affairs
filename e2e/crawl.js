// Full-site visual crawl: every route at desktop + tablet widths, console/page errors, HTTP errors, overflow check.
const { chromium } = require("playwright");
const fs = require("fs");
const B = process.env.BASE || "https://internalaffairs-production.up.railway.app";
const OUT = __dirname + "/.out/audit";
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = [
  "/uz", "/uz/simulyator", "/uz/simulyator/muloqot", "/uz/simulyator/muloqot/dialog-case04-agressiv",
  "/uz/simulyator/qaror", "/uz/simulyator/qaror/decision-pichoqli-shaxs", "/uz/simulyator/mahalla", "/uz/simulyator/mahalla/mahalla-sh12",
  "/uz/simulyator/hujjat", "/uz/simulyator/hujjat/document-pichoq-hodisa", "/uz/simulyator/tir", "/uz/simulyator/imtihon",
  "/uz/mashgulotlarim", "/uz/instruktor", "/uz/profil", "/uz/inspektor", "/uz/hodisa", "/uz/qonunchilik", "/uz/ishlarim", "/uz/guide",
  "/ru/simulyator", "/en/simulyator", "/uz/simulyator/tir/instruktor",
];
(async () => {
  const browser = await chromium.launch();
  const report = [];
  for (const [name, vp] of [["desk", { width: 1400, height: 900 }], ["tab", { width: 820, height: 1180 }]]) {
    const ctx = await browser.newContext({ viewport: vp, locale: "uz" });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { if (m.type() === "error") errs.push("[console] " + m.text().slice(0, 160)); });
    page.on("pageerror", (e) => errs.push("[pageerror] " + String(e).slice(0, 160)));
    page.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("/api/tts")) errs.push(`[http ${r.status()}] ${r.url().replace(B, "")}`); });
    // profile so gated pages render
    await page.goto(`${B}/uz/profil`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    const ph = page.getByPlaceholder("Muminov Joldas Kamalovich");
    if (await ph.count()) {
      await ph.fill("Muminov Joldas Kamalovich");
      await page.getByPlaceholder("SH-0473").fill("SH-0473");
      await page.getByPlaceholder("mayor").fill("mayor").catch(() => {});
      await page.getByRole("button", { name: "Saqlash" }).click().catch(() => {});
      await page.waitForTimeout(500);
    }
    for (const r of ROUTES) {
      errs.length = 0;
      const t0 = Date.now();
      try {
        await page.goto(`${B}${r}`, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.waitForTimeout(r.includes("/tir/") ? 6000 : 1800);
      } catch (e) { errs.push("[nav] " + String(e).slice(0, 100)); }
      const dt = Date.now() - t0;
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2).catch(() => false);
      const text = await page.locator("body").innerText().catch(() => "");
      const mojibake = (text.match(/�/g) || []).length;
      const placeholders = (text.match(/lorem|TODO|tez orada|coming soon|undefined|NaN|\[object/gi) || []).slice(0, 5);
      const fn = `${OUT}/${name}-${r.replace(/\//g, "_").replace(/^_/, "") || "root"}.png`;
      await page.screenshot({ path: fn, fullPage: true }).catch(() => {});
      report.push({ vp: name, route: r, ms: dt, overflow, mojibake, placeholders, errors: [...new Set(errs)].slice(0, 6), title: (await page.title().catch(() => "")) });
      console.log(`${name} ${r} ${dt}ms overflow=${overflow} mojibake=${mojibake} ph=${placeholders.join(",")} errs=${errs.length}`);
    }
    await ctx.close();
  }
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(2); });
