// TIR FPS-mode E2E: lock hint, WASD movement (engine officer position), F draw + centre click fires, R reload, HUD, death + restart, mode toggle.
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
  const body = () => page.locator("body").innerText();
  const dbg = () => page.evaluate(() => window.__h360tir);

  await page.goto(`${B}/uz/profil`, { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder("Muminov Joldas Kamalovich").fill("Test Xodim");
  await page.getByPlaceholder("SH-0473").fill("SH-0001");
  await page.getByRole("button", { name: "Saqlash" }).click();
  await page.waitForTimeout(400);

  const open = async (id) => {
    await page.goto(`${B}/uz/simulyator/tir/${id}?quality=low&controls=fps&lock=0`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForSelector("canvas", { timeout: 90000 });
    await page.waitForFunction(() => !/yuklanmoqda/i.test(document.body.innerText), null, { timeout: 120000 }).catch(() => {});
    await page.waitForTimeout(2500);
  };

  // ---- 1. Marksmanship range: movement + shooting mechanics (no hostiles) ----
  await open("tir-plate-rack");
  step("FPS badge + key hint on briefing", /WASD/.test(await body()) && /FPS/.test(await body()));
  await page.getByRole("button", { name: /Poligonni boshlash/ }).click({ timeout: 180000 });
  await page.waitForTimeout(800);
  step("lock=0: no lock hint, keyboard-only mode", !/Sahnaga bosing/.test(await body()));
  await page.screenshot({ path: `${OUT}/fps-1-start.png` });

  const o0 = (await dbg()).officer;
  await page.keyboard.down("KeyW"); await page.waitForTimeout(1500); await page.keyboard.up("KeyW"); await page.waitForTimeout(400);
  const o1 = (await dbg()).officer;
  step("W → officer moves forward (-Z)", o1.z < o0.z - 0.5, `z ${o0.z.toFixed(2)} → ${o1.z.toFixed(2)}`);
  await page.keyboard.down("KeyD"); await page.waitForTimeout(1200); await page.keyboard.up("KeyD"); await page.waitForTimeout(400);
  const o2 = (await dbg()).officer;
  step("D → strafes right (+X)", o2.x > o1.x + 0.4, `x ${o1.x.toFixed(2)} → ${o2.x.toFixed(2)}`);
  await page.keyboard.down("ShiftLeft"); await page.keyboard.down("KeyW"); await page.waitForTimeout(1200); await page.keyboard.up("KeyW"); await page.keyboard.up("ShiftLeft"); await page.waitForTimeout(400);
  const o3 = (await dbg()).officer;
  step("Bounds: never beyond 6 m radius", Math.hypot(o3.x, o3.z) <= 6.01, Math.hypot(o3.x, o3.z).toFixed(2));
  await page.keyboard.down("KeyC"); await page.waitForTimeout(600);
  const oc = (await dbg()).officer;
  await page.keyboard.up("KeyC"); await page.waitForTimeout(300);
  step("C → crouch reported to engine", oc.crouch === true && (await dbg()).officer.crouch === false);
  step("HUD: ammo 15 / 30 shown", /15\s*\/\s*30/.test(await body()));

  await page.keyboard.press("f"); await page.waitForTimeout(300);
  step("F draws the weapon", /Qurol qo'lda/.test(await body()));
  // line up plate #3 (x=-0.5, z=-10) with the camera centre by strafing left
  for (let i = 0; i < 60 && (await dbg()).officer.x > -0.4; i++) { await page.keyboard.down("KeyA"); await page.waitForTimeout(60); await page.keyboard.up("KeyA"); await page.waitForTimeout(350); }
  for (let i = 0; i < 20 && (await dbg()).officer.x < -0.62; i++) { await page.keyboard.down("KeyD"); await page.waitForTimeout(50); await page.keyboard.up("KeyD"); await page.waitForTimeout(350); }
  const ox = (await dbg()).officer.x;
  const c = await page.locator("canvas").boundingBox();
  // first click = lock request (falls back to click-to-fire after 0.5 s in headless), then shots
  await page.mouse.click(c.x + c.width / 2, c.y + c.height / 2); await page.waitForTimeout(900);
  for (let i = 0; i < 3; i++) { await page.mouse.click(c.x + c.width / 2, c.y + c.height / 2); await page.waitForTimeout(400); }
  const d1 = await dbg();
  step("Centre clicks fire (shots ≥ 2, magazine decreases)", d1.shots >= 2 && d1.ammo.mag <= 13, `shots=${d1.shots} mag=${d1.ammo.mag} locked=${d1.locked}`);
  step("Camera-centre raycast hits the lined-up plate", d1.hits >= 1, `hits=${d1.hits} officer.x=${ox.toFixed(2)}`);
  await page.screenshot({ path: `${OUT}/fps-2-fired.png` });
  await page.keyboard.press("r"); await page.waitForTimeout(300);
  step("R starts reload", /zaryadlanmoqda/.test(await body()) && (await dbg()).ammo.reloadLeft > 0);
  await page.waitForTimeout(2200);
  const d2 = await dbg();
  step("Reload completes to 15", d2.ammo.mag === 15 && d2.ammo.reserve < 30 && /Magazin almashtirildi/.test(await body()), `${d2.ammo.mag}/${d2.ammo.reserve}`);
  await page.keyboard.press("Space"); await page.waitForTimeout(900);
  step("No page errors after move/shoot/reload/crouch/jump", errors.length === 0, errors.join(" | ").slice(0, 300));

  // ---- 2. Crowd scenario: health HUD, officer injured → PLAYER_DEAD overlay → restart ----
  await open("tir-olomon-pichoq");
  await page.getByRole("button", { name: /Poligonni boshlash/ }).click({ timeout: 180000 });
  await page.waitForTimeout(600);
  step("Health HUD visible", /Salomatlik/i.test(await body()) && (await dbg()).health === 100, JSON.stringify(await dbg()));
  await page.keyboard.down("KeyW"); await page.waitForTimeout(3500); await page.keyboard.up("KeyW");
  await page.waitForFunction(() => window.__h360tir && window.__h360tir.outcome, null, { timeout: 40000 }).catch(() => {});
  const d3 = await dbg();
  step("Walking into the knife → officer injured/down (PLAYER_DEAD)", d3.outcome === "officer_injured" || d3.outcome === "officer_down", `outcome=${d3.outcome} health=${d3.health}`);
  await page.waitForFunction(() => /Xodim safdan chiqdi/i.test(document.body.innerText), null, { timeout: 10000 }).catch(() => {});
  step("Death overlay + restart button", /Xodim safdan chiqdi/i.test(await body()) && (await page.getByRole("button", { name: /Qayta boshlash/ }).count()) > 0);
  await page.screenshot({ path: `${OUT}/fps-3-dead.png` });
  await page.getByRole("button", { name: /Qayta boshlash/ }).click();
  await page.waitForTimeout(600);
  const d4 = await dbg();
  step("Restart → new round at briefing, health 100, officer at origin", /Poligonni boshlash/.test(await body()) && d4.health === 100 && d4.outcome === null && d4.officer.x === 0 && d4.officer.z === 0);

  // ---- 3. Mode toggle ----
  await page.locator("button[title^=\"Boshqaruv\"]").click();
  await page.waitForTimeout(400);
  step("Toggle to Statik (fixed) mode", (await dbg()).controls === "fixed" && /Statik/.test(await body()));

  console.log("ERRORS:", errors.length ? errors.join("\n") : "(none)");
  console.log(`${results.filter(Boolean).length}/${results.length} passed`);
  await browser.close();
  process.exit(results.every(Boolean) ? 0 : 1);
})().catch((e) => { console.error("FATAL", e); process.exit(2); });
