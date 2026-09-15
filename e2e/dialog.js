// Live dialog simulator smoke: open Case 04, send one long officer turn, capture network/console.
const { chromium } = require("playwright");
const B = process.env.BASE || "https://internalaffairs-production.up.railway.app";
const OUT = __dirname + "/.out";
require("fs").mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1300, height: 900 } });
  const log = [];
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") log.push(`[console.${m.type()}] ${m.text().slice(0, 300)}`); });
  page.on("pageerror", (e) => log.push(`[pageerror] ${String(e).slice(0, 300)}`));
  page.on("response", async (r) => { if (r.url().includes("/api/")) { let t = ""; try { t = (await r.text()).slice(0, 300); } catch {} log.push(`[http ${r.status()}] ${r.url()} ${t}`); } });
  page.on("requestfailed", (r) => log.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));

  await page.goto(`${B}/uz/profil`, { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder("Muminov Joldas Kamalovich").fill("Test Xodim");
  await page.getByPlaceholder("SH-0473").fill("SH-0001");
  await page.getByRole("button", { name: "Saqlash" }).click();
  await page.waitForTimeout(500);

  await page.goto(`${B}/uz/simulyator/muloqot/dialog-case04-agressiv`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("textarea", { timeout: 30000 });
  await page.waitForTimeout(800);
  const t0 = Date.now();
  await page.locator("textarea").fill("Assalomu alaykum, otaxon. Men profilaktika inspektori Muminov Joldas. Uch oy kutganingiz uchun chin dildan uzr so'rayman. Marhamat, o'tiring — sizni to'liq eshitay, nima bo'lganini boshidan aytib bering.");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => !document.body.innerText.includes("Fuqaro javob bermoqda") && document.querySelectorAll("textarea").length > 0, null, { timeout: 60000 }).catch(() => log.push("[timeout] waiting for reply"));
  await page.waitForTimeout(1500);
  const txt = await page.locator("body").innerText();
  console.log("elapsed ms", Date.now() - t0);
  console.log("has trend chip:", /yumshayapti|keskinlashyapti|o'zgarishsiz/.test(txt));
  console.log("has error text:", /xato|Xato|error|Error|mavjud emas|urinib/.test(txt) ? txt.match(/[^\n]*(xato|Xato|error|Error|mavjud emas|urinib)[^\n]*/)?.[0] : "no");
  const bubbles = await page.locator("[class*=bubble], [data-role], p").allInnerTexts().catch(() => []);
  console.log("last texts:", bubbles.slice(-6).map((s) => s.slice(0, 160)));
  await page.screenshot({ path: `${OUT}/dlg-live.png`, fullPage: true });
  console.log("LOG:\n" + log.join("\n"));
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(2); });
