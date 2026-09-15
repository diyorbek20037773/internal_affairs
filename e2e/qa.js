// End-to-end QA of HIMOYA-360 against the Railway deployment (real Gemini keys).
const { chromium } = require("playwright");
const B = process.env.BASE || "https://internalaffairs-production.up.railway.app";
const OUT = __dirname + "/.out";
require("fs").mkdirSync(OUT, { recursive: true });

const errors = [];
const results = [];
const step = (name, ok, note = "") => {
  results.push({ name, ok, note });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${note ? " — " + note : ""}`);
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 820, height: 1180 }, locale: "uz" }); // tablet portrait
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[console] ${m.text().slice(0, 200)}`); });
  page.on("pageerror", (e) => errors.push(`[pageerror] ${String(e).slice(0, 200)}`));
  page.on("response", (r) => { if (r.status() >= 500) errors.push(`[http ${r.status()}] ${r.url()}`); });

  const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png`, fullPage: true });

  // 1. Profile (instructor, so we can confirm debriefs)
  await page.goto(`${B}/uz/profil`, { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder("Muminov Joldas Kamalovich").fill("Muminov Joldas Kamalovich");
  await page.getByPlaceholder("SH-0473").fill("SH-0473");
  await page.getByPlaceholder("mayor").fill("mayor");
  await page.getByPlaceholder(/Bog'imaydon/).fill("Bog'imaydon MFY, Mirzo Ulug'bek tumani");
  await page.getByRole("radio", { name: "Instruktor" }).or(page.getByRole("button", { name: "Instruktor", exact: true })).first().click();
  await page.getByRole("button", { name: "Saqlash" }).click();
  await page.waitForTimeout(800);
  const saved = await page.getByText("Profil saqlandi").count();
  step("Profil saqlash", saved > 0);
  await shot("01-profil");

  // Sidebar shows instructor entry + groups
  await page.goto(`${B}/uz/simulyator`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.innerText.includes("Instruktor kabineti"), null, { timeout: 20000 }).catch(() => {});
  step("Sidebar guruhlari", (await page.getByText("HIMOYA-360 trenajyorlar").count()) > 0 && (await page.getByText("Mening Inspektorim").count()) > 0);
  step("Instruktor kabineti ko'rinadi", (await page.getByText("Instruktor kabineti").count()) > 0);
  step("Model banner (sikl)", (await page.getByText("Xizmat poligoni").count()) > 0);
  step("5 trenajyor kartasi", (await page.getByText("Hujjatlashtirish").count()) > 0 && (await page.getByText("Bir kunlik xizmat").count()) > 0);
  await shot("02-hub");

  // 2. AI-Muloqot — Case 04
  await page.goto(`${B}/uz/simulyator/muloqot/dialog-case04-agressiv`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("textarea");
  step("Dialog: fuqaro ochilish gapi", (await page.getByText(/Uch oydan beri/).count()) > 0);
  const TURNS = [
    "Assalomu alaykum, otaxon. Men profilaktika inspektori Muminov Joldas. Uch oy kutganingiz uchun chin dildan uzr so'rayman. Marhamat, o'tiring — sizni to'liq eshitay.",
    "Tushundim, Abdulla aka — qo'shningizning tungi shovqini uch oy sizni bezovta qilyapti va hech kim aniq javob bermagan. To'g'rimi? Murojaat raqami esingizdami?",
    "Rahmat. Sog'ligingiz qalay, uyqusizlik qiyin bo'lyaptimi? Qo'shningiz bilan ilgari munosabat qanday edi?",
    "Abdulla aka, aniq aytaman: bugun 15:00 gacha murojaatingizni tekshirib, o'zim qo'ng'iroq qilaman. Ertaga 11:00 da qo'shningiz bilan birgalikda uchrashuv tashkil qilaman.",
    "Qonun bo'yicha murojaat 15 kunda ko'rilishi shart edi — buning uchun ham uzr. Agar qo'shni kelmasa, mahalla raisi bilan uyiga chiqamiz. Kelishdikmi, Abdulla aka?",
    "Kelishdik. Mana ish telefonim, istalgan vaqt qo'ng'iroq qiling. Bugun 15:00 da o'zim aloqaga chiqaman. Sabringiz uchun rahmat.",
  ];
  let ended = false;
  for (let i = 0; i < TURNS.length; i++) {
    await page.locator("textarea").fill(TURNS[i]);
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => document.body.innerText.includes("Fuqaro javob bermoqda"), null, { timeout: 10000 }).catch(() => {});
    await page.waitForFunction(() => !document.body.innerText.includes("Fuqaro javob bermoqda"), null, { timeout: 90000 }).catch(() => {});
    await page.waitForTimeout(300);
    if ((await page.getByText("Debrifingga o'tish").count()) > 0) { ended = true; break; }
  }
  const trendChip = await page.getByText(/yumshayapti|keskinlashyapti|o'zgarishsiz/).count();
  step("Dialog: trend chip ko'rinadi", trendChip > 0);
  step("Dialog: yakunlandi (kelishuv/limit) 6 navbatda", ended, ended ? "" : "6 navbatda tugamadi");
  await shot("03-dialog");
  if (!ended) { await page.getByText("Mashg'ulotni to'xtatish").click().catch(() => {}); }
  else {
    await page.getByText("Debrifingga o'tish").click();
    await page.waitForURL(/debrif/);
    await page.waitForFunction(() => document.body.innerText.includes("Nima TO'G'RI bo'ldi?"), null, { timeout: 90000 }).catch(() => {});
    const q = await page.getByText("Nima TO'G'RI bo'ldi?").count();
    step("Debrif: 3 savol chiqdi", q > 0);
    step("Debrif: turn:N ref", (await page.getByText(/turn:\d/).count()) > 0);
    await shot("04-debrif");
    const confirmBtn = page.getByRole("button", { name: /Tasdiqlash va HIMOYA-ID/ });
    if (await confirmBtn.count()) {
      await page.getByPlaceholder("Instruktor izohi (ixtiyoriy)").fill("Yaxshi ish. Keyingi safar sog'liqni ertaroq so'rang.");
      await confirmBtn.click();
      await page.waitForTimeout(800);
      step("Debrif: instruktor tasdiqladi", (await page.getByText("Instruktor tasdiqladi").count()) > 0);
    } else step("Debrif: tasdiqlash tugmasi", false, "tugma topilmadi");
  }

  // 3. Qaror simulyatori — optimal path
  await page.goto(`${B}/uz/simulyator/qaror/decision-pichoqli-shaxs`, { waitUntil: "domcontentloaded" });
  const pick = async (re) => {
    await page.getByRole("button", { name: re }).first().click();
    await page.getByRole("button", { name: "Davom etish" }).click();
    await page.waitForTimeout(400);
  };
  await pick(/8 m masofada to'xtayman/);
  await pick(/Tushunaman, bu og'ir/);
  await pick(/men ishonaman/);
  await pick(/Pichoqni dalil sifatida olaman/);
  step("Qaror: qonuniy yo'l → success", (await page.getByText("Qonuniy va mutanosib yakun").count()) > 0);
  await shot("05-qaror");
  await page.getByRole("button", { name: /Smart Debrifing/ }).click();
  await page.waitForURL(/debrif/);
  await page.waitForFunction(() => document.body.innerText.includes("Nima TO'G'RI bo'ldi?"), null, { timeout: 90000 }).catch(() => {});
  step("Qaror debrif: node ref", (await page.getByText(/node:/).count()) > 0);

  // 4. Smart Mahalla
  await page.goto(`${B}/uz/simulyator/mahalla/mahalla-sh12`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /9-uy: takroriy/ }).click();
  await page.getByRole("button", { name: /33-uy: hisobdagi/ }).click();
  await page.getByRole("button", { name: /Bolalar maydonchasi: kechki/ }).click();
  const tas = page.locator("textarea");
  await tas.nth(0).fill("Bugun 11:00 da 7-uyga chiqaman, ayol bilan alohida gaplashaman, tibbiy ko'rikka yo'llanma, himoya orderi masalasini rahbariyatga kiritaman, bolalar holatini tekshirib vasiylikka xabar beraman, erkak bilan profilaktik suhbat.");
  await tas.nth(1).fill("33-uyga chiqib shaxsni topaman, qo'shnilar va oila bilan suhbat, kelmaganlik faktini rasmiylashtiraman, notanish shaxslar haqida ma'lumot yig'aman, rahbariyatga xabar.");
  await tas.nth(2).fill("20:30 da reyd, mahalla raisi va yoshlar yetakchisi bilan, shaxslarni aniqlash, profilaktik suhbat, zarur bo'lsa MJTK protokol, yoritish va kamera taklifi.");
  await page.getByRole("button", { name: "Rejani topshirish" }).click();
  await page.waitForURL(/debrif/, { timeout: 120000 }).catch(() => {});
  step("Mahalla: topshirildi → debrif", /debrif/.test(page.url()));
  await shot("06-mahalla-debrif");

  // 5. Hujjat
  await page.goto(`${B}/uz/simulyator/hujjat/document-pichoq-hodisa`, { waitUntil: "domcontentloaded" });
  await page.locator("textarea").fill(JSON.parse(require("fs").readFileSync(__dirname + "/fixtures/doc1.json", "utf8")).text);
  await page.getByRole("button", { name: "AI tekshiruviga yuborish" }).click();
  await page.waitForFunction(() => document.body.innerText.includes("Tekshiruv natijasi"), null, { timeout: 120000 }).catch(() => {});
  step("Hujjat: AI tekshiruv natijasi", (await page.getByText("Tekshiruv natijasi").count()) > 0);
  await shot("07-hujjat");

  // 6. Mashg'ulotlarim + HIMOYA-ID + KPI
  await page.goto(`${B}/uz/mashgulotlarim`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  step("HIMOYA-ID radar (tasdiqlangan)", (await page.getByText("Kuchli tomonlar").count()) > 0);
  step("Amaliy xizmat KPI kartasi", (await page.getByText(/Amaliy xizmat/).count()) > 0);
  step("Sessiyalar ro'yxati ≥ 4", (await page.getByRole("button", { name: "Ochish" }).count()) >= 4);
  await shot("08-mashgulotlarim");

  // 7. Instruktor + imtihon
  await page.goto(`${B}/uz/instruktor`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(600);
  step("Instruktor: tasdiq kutayotganlar", (await page.getByText("Tasdiq kutayotgan debriflar").count()) > 0);
  await shot("09-instruktor");
  await page.goto(`${B}/uz/simulyator/imtihon`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.innerText.includes("16:30"), null, { timeout: 20000 }).catch(() => {});
  step("Imtihon: 5 bosqich (09:00…16:30)", (await page.getByText("16:30").count()) > 0 && (await page.getByText("15:00").count()) > 0);
  await shot("10-imtihon");

  // Locale switch sanity
  await page.goto(`${B}/ru/simulyator`, { waitUntil: "domcontentloaded" });
  step("RU lokal", (await page.getByText("Тренажёры HIMOYA-360").count()) > 0);

  await browser.close();
  console.log("\n=== ERRORS (console/page/5xx) ===");
  console.log(errors.length ? errors.join("\n") : "(none)");
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error("FATAL", e); process.exit(2); });
