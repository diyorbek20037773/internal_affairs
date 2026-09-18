import { readFileSync } from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { z } from "zod";

/**
 * Server-side PDF of the instructor's trainee report. The client sends the
 * already-localised rows (it has the translations, scenario titles and the
 * Klaster-ID maths); this module only lays them out. DejaVu Sans is embedded
 * so Uzbek Latin (oʻ, gʻ) and Cyrillic render — PDF standard fonts cannot.
 */

const Str = (max: number) => z.string().max(max);

export const ReportDocSchema = z.object({
  locale: z.enum(["uz", "ru", "en"]),
  labels: z.object({
    title: Str(80),
    generated: Str(40),
    instructor: Str(40),
    trainee: Str(40),
    exams: Str(80),
    sessions: Str(80),
    date: Str(30),
    scenario: Str(30),
    score: Str(30),
    debrief: Str(30),
    confirmed: Str(40),
    provisional: Str(40),
  }),
  trainee: z.object({ name: Str(120), badge: Str(40), meta: Str(200) }),
  generatedAt: Str(40),
  instructorName: Str(120),
  himoya: z.object({
    avg: z.number().int().min(0).max(100).nullable(),
    rows: z.array(z.object({ label: Str(80), value: z.number().int().min(0).max(100).nullable() })).max(20),
  }),
  summary: Str(200),
  exams: z
    .array(z.object({ title: Str(160), verdict: Str(40), tone: z.enum(["ok", "bad", "neutral"]), date: Str(40), by: Str(80), note: Str(400).optional() }))
    .max(50),
  sessions: z.array(z.object({ date: Str(40), scenario: Str(160), score: Str(10), debrief: Str(20) })).max(200),
});
export type ReportDoc = z.infer<typeof ReportDocSchema>;

const FONT_DIR = path.join(process.cwd(), "src", "lib", "pdf", "fonts");
let fonts: { regular: Buffer; bold: Buffer } | null = null;
function loadFonts() {
  if (!fonts) {
    fonts = {
      regular: readFileSync(path.join(FONT_DIR, "DejaVuSans.ttf")),
      bold: readFileSync(path.join(FONT_DIR, "DejaVuSans-Bold.ttf")),
    };
  }
  return fonts;
}

const PAGE = { w: 595.28, h: 841.89, margin: 42 }; // A4 portrait, pt
const INK = "#111111";
const MUTED = "#666666";
const LINE = "#cccccc";

export function renderTraineeReportPdf(r: ReportDoc): Promise<Buffer> {
  const f = loadFonts();
  const doc = new PDFDocument({ size: "A4", margin: PAGE.margin, bufferPages: true, info: { Title: `${r.labels.title} — ${r.trainee.name}`, Author: "O'quv klasteri", Creator: "O'quv klasteri" } });
  doc.registerFont("R", f.regular);
  doc.registerFont("B", f.bold);
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const left = PAGE.margin;
  const width = PAGE.w - PAGE.margin * 2;
  const bottom = PAGE.h - PAGE.margin;
  const ensure = (need: number) => {
    if (doc.y + need > bottom) doc.addPage();
  };
  const rule = () => {
    doc.moveTo(left, doc.y).lineTo(left + width, doc.y).strokeColor(LINE).lineWidth(0.5).stroke();
  };
  const section = (title: string) => {
    ensure(40);
    doc.moveDown(0.9);
    doc.font("B").fontSize(9).fillColor(MUTED).text(title.toUpperCase(), left, doc.y, { characterSpacing: 0.6 });
    doc.moveDown(0.3);
  };

  // header
  doc.font("R").fontSize(8).fillColor(MUTED).text(`O'quv klasteri · ${r.labels.title}`, left, PAGE.margin, { characterSpacing: 0.8 });
  doc.moveDown(0.3);
  doc.font("B").fontSize(18).fillColor(INK).text(r.trainee.name);
  doc.font("R").fontSize(10).fillColor(MUTED).text([r.trainee.badge, r.trainee.meta].filter(Boolean).join(" · "));
  doc.moveDown(0.2);
  doc.fontSize(8).text(`${r.labels.generated}: ${r.generatedAt} · ${r.labels.instructor}: ${r.instructorName}`);
  doc.moveDown(0.5);
  rule();

  // Klaster-ID
  section(`Klaster-ID${r.himoya.avg != null ? ` · ${r.himoya.avg}%` : ""}`);
  const barX = left + width - 200;
  const barW = 150;
  for (const row of r.himoya.rows) {
    ensure(18);
    const y = doc.y;
    doc.font("R").fontSize(9.5).fillColor(INK).text(row.label, left, y, { width: barX - left - 8, lineBreak: false, ellipsis: true });
    doc.rect(barX, y + 2, barW, 6).strokeColor("#999999").lineWidth(0.5).stroke();
    if (row.value != null) doc.rect(barX, y + 2, (barW * row.value) / 100, 6).fillColor(INK).fill();
    doc.font("R").fontSize(9).fillColor(INK).text(row.value != null ? String(row.value) : "—", barX + barW + 8, y, { width: 40, align: "right", lineBreak: false });
    doc.y = y + 15;
  }
  doc.moveDown(0.2);
  doc.font("R").fontSize(8.5).fillColor(MUTED).text(r.summary, left);

  // exams
  if (r.exams.length) {
    section(r.labels.exams);
    for (const x of r.exams) {
      ensure(30);
      const y = doc.y;
      doc.font("B").fontSize(9.5).fillColor(INK).text(x.title, left, y, { width: width - 130, lineBreak: false, ellipsis: true });
      const color = x.tone === "ok" ? "#15803d" : x.tone === "bad" ? "#b91c1c" : MUTED;
      doc.font("B").fontSize(8.5).fillColor(color).text(x.verdict, left + width - 125, y, { width: 125, align: "right", lineBreak: false });
      doc.y = y + 13;
      doc.font("R").fontSize(8).fillColor(MUTED).text(`${x.date} · ${x.by}`, left);
      if (x.note) doc.font("R").fontSize(8).fillColor(MUTED).text(x.note, left, doc.y, { width });
      doc.moveDown(0.25);
      rule();
      doc.moveDown(0.25);
    }
  }

  // sessions table
  section(`${r.labels.sessions} (${r.sessions.length})`);
  const cols = { date: left, scenario: left + 95, score: left + width - 95, debrief: left + width - 45 };
  const th = (label: string, x: number, w: number, align: "left" | "right" = "left") =>
    doc.font("B").fontSize(7.5).fillColor(MUTED).text(label.toUpperCase(), x, doc.y, { width: w, align, lineBreak: false, characterSpacing: 0.4 });
  const header = () => {
    const y = doc.y;
    th(r.labels.date, cols.date, 90); doc.y = y;
    th(r.labels.scenario, cols.scenario, cols.score - cols.scenario - 8); doc.y = y;
    th(r.labels.score, cols.score, 45, "right"); doc.y = y;
    th(r.labels.debrief, cols.debrief, 45, "right");
    doc.y = y + 12;
    rule();
    doc.moveDown(0.15);
  };
  header();
  for (const s of r.sessions) {
    if (doc.y + 14 > bottom) {
      doc.addPage();
      header();
    }
    const y = doc.y;
    doc.font("R").fontSize(8.5).fillColor(INK);
    doc.text(s.date, cols.date, y, { width: 90, lineBreak: false });
    doc.text(s.scenario, cols.scenario, y, { width: cols.score - cols.scenario - 8, lineBreak: false, ellipsis: true });
    doc.text(s.score, cols.score, y, { width: 45, align: "right", lineBreak: false });
    doc.text(s.debrief, cols.debrief, y, { width: 45, align: "right", lineBreak: false });
    doc.y = y + 12;
    rule();
    doc.moveDown(0.15);
  }

  // signatures
  ensure(60);
  doc.moveDown(2);
  const y = doc.y;
  doc.font("R").fontSize(9).fillColor(INK);
  doc.text(`${r.labels.instructor}: ____________________`, left, y, { lineBreak: false });
  doc.text(`${r.labels.trainee}: ____________________`, left + width / 2, y, { width: width / 2, align: "right", lineBreak: false });

  // page numbers
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // writing inside the bottom margin would auto-add a page — lift the margin for the footer
    const keep = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.font("R").fontSize(7.5).fillColor(MUTED).text(`${i + 1} / ${range.count}`, left, PAGE.h - 28, { width, align: "right", lineBreak: false });
    doc.page.margins.bottom = keep;
  }
  doc.end();
  return done;
}
