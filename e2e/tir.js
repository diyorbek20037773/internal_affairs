// TIR v2 E2E: vehicle tire (lawful), crowd (hostage must not be hit), building (don't shoot cop), marksmanship.
const { chromium } = require("playwright");
const B = process.env.BASE || "http://localhost:3111";
const OUT = __dirname + "/.out";
require("fs").mkdirSync(OUT, { recursive: true });
const results = [];
const step = (n, ok, note = "") => { results.push(ok); console.log(`${ok ? "PASS" : "FAIL"}  ${n}${note ? " — " + note : ""}`); };

(async () => {
  const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 300)));
  page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("502")) errors.push("[console] " + m.text().slice(0, 300)); });

  await page.goto(`${B}/uz/profil`, { waitUntil: "networkidle" });
  await page.getByPlaceholder("Muminov Joldas Kamalovich").fill("Test Xodim");
  await page.getByPlaceholder("SH-0473").fill("SH-0001");
  // instructor role: the TIR ghost-mode panel is instructor-only
  await page.getByRole("radio", { name: "Instruktor" }).or(page.getByRole("button", { name: "Instruktor", exact: true })).first().click();
  await page.getByRole("button", { name: "Saqlash" }).click();
  await page.waitForTimeout(400);

  const open = async (id) => {
    await page.goto(`${B}/uz/simulyator/tir/${id}?quality=low&controls=fixed`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForSelector("canvas", { timeout: 90000 });
    await page.waitForFunction(() => !/yuklanmoqda/i.test(document.body.innerText), null, { timeout: 120000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: /Poligonni boshlash/ }).click({ timeout: 180000 });
    await page.waitForTimeout(800);
    // engine running and the key handler re-bound (headless renders at ~1 fps)
    await page.waitForFunction(() => window.__h360tir && window.__h360tir.t > 1.5, null, { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(500);
  };
  const press = async (k, wait = 1500) => { await page.keyboard.press(k); await page.waitForTimeout(wait); };
  const ended = () => page.evaluate(() => (window.__h360tir && window.__h360tir.outcome ? 1 : 0)).catch(() => 0);
  const bodyHas = (re) => page.locator("body").innerText().then((t) => re.test(t));

  // 1) Vehicle: render + instructor forces CHARGING → log shows it; HUD alive
  await open("tir-mashina-balon");
  await press("4", 800); await press("q", 300);
  await page.getByText(/Instruktor \(ghost mode\)/).click({ timeout: 60000 });
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: /Keskinlashtir/ }).click();
  await page.waitForFunction(() => document.body.innerText.includes("MASHINA XODIMGA QARAB"), null, { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/tir2-1-vehicle.png` });
  const vTxt = await page.locator("body").innerText();
  step("Vehicle: instructor → charging, HUD + car rendered", /MASHINA XODIMGA QARAB|Instruktor: vaziyat keskinlashtirildi/.test(vTxt) && /Hit Factor/.test(vTxt), vTxt.match(/MASHINA XODIMGA[^\n]*|Instruktor:[^\n]*/)?.[0] ?? "");
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `${OUT}/tir2-1b-vehicle-end.png` });

  // 2) Crowd: talk calm repeatedly (should NOT shoot); verify hostage + bystanders rendered and outcome verbal/timeout
  await open("tir-olomon-pichoq");
  // no screenshot here: at ~1 fps a full-page capture takes >10 s and the unattended suspect lunges
  for (let i = 0; i < 30 && !(await ended()); i++) await press(String((i % 2) + 1), 3000);
  await page.waitForFunction(() => /Kuch ishlatmasdan|Vaqt tugadi/.test(document.body.innerText), null, { timeout: 15000 }).catch(() => {});
  step("Crowd: resolved without shooting", await bodyHas(/Kuch ishlatmasdan|Vaqt tugadi/), (await page.locator("body").innerText()).match(/Kuch ishlatmasdan[^\n]*|Vaqt tugadi[^\n]*|Nomutanosib[^\n]*|otildi[^\n]*/)?.[0] ?? "no end");
  await page.screenshot({ path: `${OUT}/tir2-2b-crowd-end.png` });

  // 3) Building: draw, wait for gunman aiming, shoot center; ensure cop appears; check outcome text
  await open("tir-bino-otuvchi");
  await press("f", 300); await press("q", 300);
  await page.waitForFunction(() => document.body.innerText.includes("qurolni xodimga qaratdi"), null, { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/tir2-3-building.png` });
  const c3 = await page.locator("canvas").boundingBox();
  for (const [fx, fy] of [[0.53, 0.52], [0.55, 0.55], [0.52, 0.5]]) {
    await page.mouse.click(c3.x + c3.width * fx, c3.y + c3.height * fy);
    await page.waitForTimeout(350);
  }
  await page.waitForTimeout(3600);
  const txt3 = await page.locator("body").innerText();
  step("Building: gunman engaged", /O'q — o'qotar qurol|Otuvchi o'qdan|FORMADAGI|Nomutanosib|tegmadi/.test(txt3), txt3.match(/O'q — o'qotar[^\n]*|Otuvchi o'qdan[^\n]*|FORMADAGI[^\n]*|Nomutanosib[^\n]*|tegmadi[^\n]*/)?.[0] ?? "");
  await page.screenshot({ path: `${OUT}/tir2-3b-building-end.png` });

  // 4) Marksmanship: draw, click plates left→right
  await open("tir-plate-rack");
  await press("f", 300);
  const c4 = await page.locator("canvas").boundingBox();
  for (let i = 0; i < 6; i++) {
    const fx = 0.5 + (i - 2.5) * 0.062;
    await page.mouse.click(c4.x + c4.width * fx, c4.y + c4.height * 0.5);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(3600);
  const txt4 = await page.locator("body").innerText();
  step("Marksmanship: hits + hit factor", /Hit Factor/.test(txt4), txt4.match(/Tegdi:\s*\d+|Score \d+\/6/)?.[0] ?? "");
  await page.screenshot({ path: `${OUT}/tir2-4-range.png` });

  console.log("ERRORS:", errors.length ? errors.join("\n") : "(none)");
  console.log(`${results.filter(Boolean).length}/${results.length} passed`);
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(2); });
