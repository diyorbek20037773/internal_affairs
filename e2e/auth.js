// Auth + hybrid store UI E2E. Server needs DATABASE_URL, AUTH_SECRET and INSTRUCTOR_BADGES=SH-0001.
// The instructor account (SH-0001 / PIN 9999) is created on first run if missing.
const { chromium } = require("playwright");
const B = process.env.BASE || "http://localhost:3000";
const G = { waitUntil: "load", timeout: 120000 };
(async () => {
  const browser = await chromium.launch();
  let fails = 0;
  const t = (ok, m) => { console.log((ok ? "PASS " : "FAIL ") + m); if (!ok) fails++; };
  const badge = "SH-" + String(Math.floor(Math.random() * 9000) + 1000);
  await fetch(B + "/api/auth/register", { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ badgeId: "SH-0001", pin: "9999", name: "Instruktor", rank: "", district: "" }) }); // 201 first time, 409 after

  // Tablet A: fresh device → /profil shows auth form (not the plain profile form)
  const A = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const a = await A.newPage();
  const errs = []; a.on("pageerror", (e) => errs.push(e.message));
  await a.goto(B + "/uz/profil", G);
  await a.waitForSelector('[data-testid="auth-form"]', { timeout: 30000 });
  t(true, "auth form shown on fresh tablet");

  // register
  await a.click('button[role="tab"]:nth-child(2)');
  await a.fill('input[name="badgeId"]', badge);
  await a.fill('input[name="pin"]', "2468");
  await a.fill('input[name="name"]', "Test Xodim");
  await a.fill('input[name="rank"]', "leytenant");
  await a.click('button[type="submit"]');
  await a.waitForSelector('[data-testid="auth-form"]', { state: "detached", timeout: 30000 });
  const me = await a.evaluate(() => fetch("/api/auth/me").then((r) => r.json()));
  t(me.profile?.badgeId === badge && me.profile.role === "trainee", "registered via UI, cookie set, role trainee");
  const local = await a.evaluate(() => JSON.parse(localStorage.getItem("h360:profile:v1") || "null"));
  t(local?.profile?.badgeId === badge, "server profile mirrored to localStorage");
  const health = await a.evaluate(() => fetch("/api/store").then((r) => r.json()));
  t(health.authenticated === true, "store health authenticated");

  // seed a session locally (as if trained offline) then open sessions page → uploads
  const tid = me.profile.id;
  await a.evaluate((tid) => {
    const s = { id: "ui-" + tid.slice(0, 6), traineeId: tid, kind: "decision", scenarioId: "pichoqli-shaxs", scenarioVersion: "1",
      startedAt: new Date(Date.now() - 60000).toISOString(), updatedAt: new Date().toISOString(), status: "completed",
      payload: { kind: "decision", path: [], currentNodeId: null, outcome: "success" } };
    localStorage.setItem("h360:sessions:v1", JSON.stringify({ version: 1, items: [s] }));
  }, tid);
  await a.goto(B + "/uz/mashgulotlarim", G);
  await a.waitForTimeout(2500);
  const mine = await a.evaluate(() => fetch("/api/store/sessions").then((r) => r.json()));
  t(mine.items?.some((s) => s.traineeId === tid), "offline session uploaded after login");

  // Tablet B: instructor logs in via UI, sees tablet A's trainee
  const Bc = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const b = await Bc.newPage();
  await b.goto(B + "/uz/profil", G);
  await b.waitForSelector('[data-testid="auth-form"]', { timeout: 30000 });
  await b.fill('input[name="badgeId"]', "SH-0001");
  await b.fill('input[name="pin"]', "9999");
  await b.click('button[type="submit"]');
  await b.waitForSelector('[data-testid="auth-form"]', { state: "detached", timeout: 30000 });
  const meB = await b.evaluate(() => fetch("/api/auth/me").then((r) => r.json()));
  t(meB.profile?.role === "instructor", "instructor role from INSTRUCTOR_BADGES");
  await b.goto(B + "/uz/instruktor", G);
  await b.waitForTimeout(2500);
  const html = await b.content();
  t(html.includes("Test Xodim"), "instructor cabinet lists tablet A trainee by name");
  t(html.includes("Postgres"), "server note shown");

  // wrong PIN → error toast, still on auth form; logout works
  await b.goto(B + "/uz/profil", G);
  await b.waitForTimeout(1500);
  const hasLogout = await b.locator("button:has-text('Chiqish')").count();
  t(hasLogout === 1, "logout button visible when signed in");
  await b.click("button:has-text('Chiqish')");
  await b.waitForSelector('[data-testid="auth-form"]', { timeout: 30000 });
  t(true, "logout returns to auth form");
  await b.fill('input[name="badgeId"]', "SH-0001");
  await b.fill('input[name="pin"]', "1111");
  await b.click('button[type="submit"]');
  await b.waitForTimeout(1500);
  t((await b.locator('[data-testid="auth-form"]').count()) === 1, "wrong PIN keeps auth form");

  t(errs.length === 0, "no page errors on tablet A" + (errs.length ? " :: " + errs.join(" | ") : ""));
  await browser.close();
  console.log(fails ? `FAILS: ${fails}` : "ALL PASS");
  process.exit(fails ? 1 : 0);
})();
