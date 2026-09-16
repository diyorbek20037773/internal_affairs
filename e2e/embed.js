// E-O'quv embed bridge E2E: demo host page frames /uz?embed=1 (same-origin).
const { chromium } = require("playwright");
const B = process.env.BASE || "http://localhost:3000";
(async () => {
  const browser = await chromium.launch();
  let fails = 0;
  const t = (ok, m) => { console.log((ok ? "PASS " : "FAIL ") + m); if (!ok) fails++; };
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(B + "/embed-demo.html", { waitUntil: "load", timeout: 120000 });
  const frame = page.frameLocator("#app");
  await frame.locator("main").waitFor({ timeout: 60000 });
  const wait = (type, n = 1) => page.waitForFunction(([ty, n]) => window.h360Messages.filter((m) => m.type === ty).length >= n, [type, n], { timeout: 30000 });

  await wait("h360:ready");
  const ready = await page.evaluate(() => window.h360Messages.find((m) => m.type === "h360:ready"));
  t(ready.protocol === 1 && ready.locale === "uz" && ready.authEnabled === false, "h360:ready protocol 1, locale uz, local mode");

  const f = page.frames().find((fr) => fr !== page.mainFrame());
  t(await f.evaluate(() => document.documentElement.dataset.embed === "1"), "html[data-embed=1] set by boot script");
  t(await f.evaluate(() => [...document.querySelectorAll(".h360-chrome")].every((el) => getComputedStyle(el).display === "none")), "sidebar + topbar hidden");
  t(await f.evaluate(() => sessionStorage.getItem("h360:embed") === "1"), "embed flag persisted in sessionStorage");

  // set-profile from host
  await page.click("#setProfile");
  await wait("h360:profile", 2);
  const prof = await page.evaluate(() => window.h360Messages.filter((m) => m.type === "h360:profile").pop().profile);
  t(prof && prof.badgeId === "SH-0473" && prof.name.startsWith("Muminov"), "h360:set-profile → profile saved and echoed");
  const local = await f.evaluate(() => JSON.parse(localStorage.getItem("h360:profile:v1") || "null"));
  t(local?.profile?.badgeId === "SH-0473", "profile in localStorage");

  // navigate from host — chrome stays hidden after in-app navigation
  await page.click("#goTir");
  await wait("h360:navigate");
  await page.waitForFunction(() => document.getElementById("app").contentWindow.location.pathname.includes("/simulyator/tir"), null, { timeout: 30000 });
  t(true, "h360:navigate → /uz/simulyator/tir");
  t(await f.evaluate(() => document.documentElement.dataset.embed === "1" && getComputedStyle(document.querySelector("aside.h360-chrome")).display === "none"), "chrome still hidden after navigation");

  // a completed session saved inside the app reaches the host
  await f.evaluate(async (tid) => {
    const s = { id: "emb-1", traineeId: tid, kind: "decision", scenarioId: "pichoqli-shaxs", scenarioVersion: "1",
      startedAt: new Date(Date.now() - 60000).toISOString(), updatedAt: new Date().toISOString(), status: "completed",
      payload: { kind: "decision", path: [], currentNodeId: null, outcome: "success" } };
    const items = JSON.parse(localStorage.getItem("h360:sessions:v1") || '{"version":1,"items":[]}');
    items.items.push(s); localStorage.setItem("h360:sessions:v1", JSON.stringify(items));
  }, local.profile.id);
  await page.click("#getSessions");
  await wait("h360:session");
  const sess = await page.evaluate(() => window.h360Messages.find((m) => m.type === "h360:session").session);
  t(sess.id === "emb-1" && sess.status === "completed", "h360:get-sessions → h360:session for the trainee");

  // untrusted origin: message from a non-parent source is ignored (self-post inside frame)
  const before = await page.evaluate(() => window.h360Messages.filter((m) => m.type === "h360:profile").length);
  await f.evaluate(() => window.postMessage({ type: "h360:set-profile", profile: { badgeId: "EVIL", name: "Evil Hacker" } }, "*"));
  await page.waitForTimeout(800);
  const after = await f.evaluate(() => JSON.parse(localStorage.getItem("h360:profile:v1")).profile.badgeId);
  t(after === "SH-0473", "non-parent message ignored (profile unchanged)");

  // logout
  await page.click("#logout");
  await page.waitForFunction(() => { const l = window.h360Messages.filter((m) => m.type === "h360:profile").pop(); return l && l.profile === null; }, null, { timeout: 30000 });
  t(true, "h360:logout → profile null echoed");

  // direct open without embed: chrome visible
  const p2 = await ctx.newPage();
  await p2.goto(B + "/uz", { waitUntil: "load", timeout: 120000 });
  t(await p2.evaluate(() => document.documentElement.dataset.embed !== "1"), "plain /uz not embedded");

  t(errs.length === 0, "no host page errors" + (errs.length ? " :: " + errs.join(" | ") : ""));
  await browser.close();
  console.log(fails ? `FAILS: ${fails}` : "ALL PASS");
  process.exit(fails ? 1 : 0);
})();
