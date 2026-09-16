// Trainee report → server-side PDF (device mode): open report, download PDF, ru locale.
const { chromium } = require("playwright");
const B = process.env.BASE || "http://localhost:3000";
let fails = 0;
const t = (ok, m, n = "") => { console.log((ok ? "PASS " : "FAIL ") + m + (n ? " — " + n : "")); if (!ok) fails++; };
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 } }); page.setDefaultTimeout(90000); page.setDefaultNavigationTimeout(120000);
  const errors = []; page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(`${B}/profil`, { waitUntil: "domcontentloaded" });
  // seed: instructor profile + 2 trainee profiles + sessions (one exam attempt complete, one dialog 40 days old)
  await page.evaluate(() => {
    const now = Date.now();
    const iso = (d) => new Date(d).toISOString();
    const prof = (id, badge, name, district, role) => ({ id, badgeId: badge, name, rank: "leytenant", district, role, createdAt: iso(now) });
    const me = prof("ins-1", "SH-0001", "Instruktor Test", "Markaz", "instructor");
    localStorage.setItem("h360:profile:v1", JSON.stringify({ version: 1, profile: me }));
    const p1 = prof("tr-1", "SH-0473", "Muminov Joldas", "Yunusobod", "trainee");
    const p2 = prof("tr-2", "SH-0520", "Karimova Nilufar", "Chilonzor", "trainee");
    localStorage.setItem("h360:profiles:v1", JSON.stringify({ version: 1, items: [p1, p2] }));
    const scores = Object.fromEntries(["huquqiy_qaror","vaziyat_tahlili","muloqot","deeskalatsiya","profiling","raqamli","hujjatlashtirish","natijadorlik"].map((c) => [c, 70]));
    const ses = (id, tid, kind, scenarioId, daysAgo, extra = {}) => ({ id, traineeId: tid, kind, scenarioId, scenarioVersion: "1",
      startedAt: iso(now - daysAgo * 86400000 - 60000), updatedAt: iso(now - daysAgo * 86400000), endedAt: iso(now - daysAgo * 86400000), status: "completed",
      payload: kind === "dialog" ? { kind: "dialog", transcript: [], state: { tension: 30, trust: 50, cooperation: 50, phase: "tinglash", revealed: [] } } : { kind: "decision", path: [], currentNodeId: null, outcome: "success" },
      finalScores: scores, ...extra });
    const items = [
      ses("s1", "tr-1", "decision", "pichoqli-shaxs", 1, { examId: "exam-bir-kunlik-xizmat", examStageIndex: 0 }),
      ses("s2", "tr-1", "decision", "mast-haydovchi", 1, { examId: "exam-bir-kunlik-xizmat", examStageIndex: 1 }),
      ses("s3", "tr-2", "dialog", "dialog-case04-agressiv", 40),
      ses("s4", "tr-2", "decision", "oilaviy-chaqiruv", 2, { debrief: { status: "pending", summary: "x", whatWentRight: [], mistakes: [], doDifferently: [], scores, createdAt: iso(now) } }),
    ];
    localStorage.setItem("h360:sessions:v1", JSON.stringify({ version: 1, items }));
  });
  await page.goto(`${B}/instruktor`, { waitUntil: "domcontentloaded" });
  await page.getByTestId("cabinet-filters").waitFor({ timeout: 30000 });
  await page.getByTestId("open-report").first().click();
  await page.getByTestId("trainee-report").waitFor();
  t(true, "report opened");
  const [dl, resp] = await Promise.all([
    page.waitForEvent("download", { timeout: 30000 }),
    page.waitForResponse((r) => r.url().includes("/api/report/pdf"), { timeout: 30000 }),
    page.getByTestId("report-pdf").click(),
  ]);
  t(resp.status() === 200 && (resp.headers()["content-type"] || "").includes("application/pdf"), "POST /api/report/pdf → 200 application/pdf", `${resp.status()} ${resp.headers()["content-type"]}`);
  const p = await dl.path();
  const head = require("fs").readFileSync(p).subarray(0, 5).toString();
  t(head === "%PDF-", "downloaded file is a PDF", `${dl.suggestedFilename()} ${head}`);
  t(/^himoya360-(SH-0\d+|tr-1)\.pdf$/.test(dl.suggestedFilename()), "filename carries the badge id (trainee id in device mode)", dl.suggestedFilename());
  t((await page.getByTestId("report-print").count()) === 1, "print button still present");
  // ru locale: same flow, PDF still generated
  await page.goto(`${B}/ru/instruktor`, { waitUntil: "domcontentloaded" });
  await page.getByTestId("open-report").first().click();
  const [dl2] = await Promise.all([page.waitForEvent("download", { timeout: 30000 }), page.getByTestId("report-pdf").click()]);
  t(require("fs").readFileSync(await dl2.path()).length > 5000, "ru PDF generated", String(require("fs").readFileSync(await dl2.path()).length));
  t(errors.length === 0, "no page errors", errors.join(" | "));
  await browser.close();
  console.log(fails ? `FAILS: ${fails}` : "ALL PASS");
  process.exit(fails ? 1 : 0);
})();
