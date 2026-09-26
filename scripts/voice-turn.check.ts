/**
 * One-call voice turn: HEARD-line splitting + transcript hygiene.
 * Run: npm run check:voice
 */
import { createHeardSplitter } from "@/lib/voice/heardSplitter";
import { cleanTranscript } from "@/lib/voice/transcript";

const INSTR =
  "Sen nutqni matnga o'giruvchi tizimsan. Faqat audioda aytilgan so'zlarni o'zbek tilida aniq yoz. Izoh, tarjima, qo'shimcha matn yozma.";

let pass = 0;
let fail = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "✓" : "✗"} ${name}${ok ? "" : ` → ${JSON.stringify(detail)}`}`);
}

function run(chunks: string[]) {
  const out = { heard: null as string | null, noSpeech: false, reply: "", events: [] as string[] };
  const s = createHeardSplitter(
    {
      heard: (t) => {
        out.heard = t;
        out.events.push("heard");
      },
      noSpeech: () => {
        out.noSpeech = true;
        out.events.push("nospeech");
      },
      delta: (t) => {
        out.reply += t;
        if (out.events[out.events.length - 1] !== "delta") out.events.push("delta");
      },
    },
    INSTR
  );
  for (const c of chunks) {
    if (s.stopped) break;
    s.push(c);
  }
  s.end();
  return out;
}

let r = run(["HEARD: Pasport va ", "invoys kerak\nTo'g", "ri! Yana nima?"]);
check("split across chunks", r.heard === "Pasport va invoys kerak" && r.reply === "To'gri! Yana nima?", r);
check("heard before any delta", r.events[0] === "heard", r.events);

r = run(["**HEARD:** salom ustoz\n\nAssalomu alaykum."]);
check("bold label tolerated", r.heard === "salom ustoz" && r.reply === "Assalomu alaykum.", r);

r = run(["HE", "ARD: [NUTQ_YOQ]"]);
check("no-speech marker → nospeech, no reply", r.noSpeech && r.reply === "" && r.heard === null, r);

r = run(["HEARD: [NUTQ_YOQ]\n", "Kechirasiz, eshitmadim."]);
check("marker then text still nospeech", r.noSpeech && r.reply === "", r);

r = run(["Yaxshi savol. Deklaratsiyaga ", "invoys ilova qilinadi."]);
check("format ignored → reply streams, heard ''", r.heard === "" && r.reply.startsWith("Yaxshi savol"), r);

r = run(["HEARD: " + INSTR + "\nJavob"]);
check("echoed instruction is not a transcript", r.heard === "" && r.reply === "Javob", r);

r = run(["HEARD: salom"]);
check("stream ends inside HEARD line (words, no reply)", r.heard === "salom" && r.reply === "", r);

r = run([""]);
check("empty stream → nospeech", r.noSpeech, r);

check("clean: plain text kept", cleanTranscript("Deklaratsiya qabul qilinadi", INSTR) === "Deklaratsiya qabul qilinadi");
check("clean: marker dropped", cleanTranscript("[NUTQ_YOQ]", INSTR) === "");
check(
  "clean: live echo from the screenshot dropped",
  cleanTranscript(
    "Bu audio — ichki ishlar xodimining o'quv mashg'ulotidagi nutqi (o'zbek (lotin yozuvi) tilida). Faqat aytilgan so'zlarni o'zbek (lotin yozuvi) tilida aniq transkripsiya qil.",
    INSTR
  ) === ""
);

console.log(`\n${pass}/${pass + fail} passed`);
if (fail) process.exit(1);
