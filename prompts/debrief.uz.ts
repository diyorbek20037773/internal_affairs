import { COMPETENCIES, COMPETENCY_DEFINITIONS_UZ } from "@/data/scenarios/competencies";
import type {
  DecisionScenario,
  DialogScenario,
  DocumentScenario,
  MahallaScenario,
  TirScenario,
} from "@/data/scenarios/types";
import type {
  DecisionPayload,
  DialogPayload,
  DocumentPayload,
  MahallaPayload,
  TirPayload,
} from "@/lib/storage/trainingSchema";
import { LAWS } from "@/data/sops/laws";
import type { LawRef } from "@/data/sops/types";

/**
 * Smart Debrifing grader (pptx slide 7): 3 questions + 8 competency scores.
 * The model explains and scores; it never invents legal article numbers —
 * only the scenario's own `laws[]` may be cited.
 */
const REF_RULE: Record<string, string> = {
  dialog: `"turn:N" — xodimning N-navbati (yozuvda ko'rsatilgan). Boshqa ref turi ISHLATILMAYDI.`,
  decision: '"node:ID" yoki "node:ID/option:ID" — yozuvdagi tugun/variant idlari. Boshqa ref turi ISHLATILMAYDI.',
  mahalla: '"problem:ID" — muammo idlari. Boshqa ref turi ISHLATILMAYDI.',
  document: '"element:ID" — rubrika element idlari, yoki "fakt", "huquq". Boshqa ref turi ISHLATILMAYDI.',
  tir: '"t:SS" — jurnaldagi soniya (masalan t:24). Boshqa ref turi ISHLATILMAYDI.',
};

export function buildDebriefSystemInstruction(laws: LawRef[], kind: string = "dialog"): string {
  const defs = COMPETENCIES.map((c) => `- ${c}: ${COMPETENCY_DEFINITIONS_UZ[c]}`).join("\n");
  const lawList = laws.length
    ? laws
        .map((l) => `- ${l.code}${l.article ? `, ${l.article}` : ""}${l.title ? ` — ${l.title}` : ""}${l.verified ? "" : " (tasdiqlanishi kerak)"}`)
        .join("\n")
    : "- (yo'q)";

  return `Sen O'quv klasteri platformasining instruktor-yordamchisisan (Smart Debrifing). Ichki ishlar organi xodimining o'quv mashg'ulotini tahlil qilasan.

# TAMOYILLAR
- Xato JAZOLANMAYDI — u keyingi to'g'ri qaror uchun TAJRIBAGA aylantiriladi. Ohang: hurmatli, aniq, konstruktiv, o'zbek tilida.
- Har bir xato uchun ANIQ JOYNI ko'rsat. Bu mashg'ulot uchun ref formati: ${REF_RULE[kind] ?? REF_RULE.dialog} Shablon matn ("ID", "N") yozma — haqiqiy qiymat bo'lsin.
- Baholanadigan narsa TEZLIK EMAS — qarorning QONUNIYLIGI va MUTANOSIBLIGI, muloqot sifati, natija.
- Qurol/kuch ishlatmaslik, agar shart bo'lmagan bo'lsa — A'LO baho.
- Huquqiy asos sifatida FAQAT quyidagi ro'yxatdagi hujjatlarni tilga ol. Yangi modda raqami O'YLAB TOPMA. Ishonch bo'lmasa "rasmiy manbadan (lex.uz) tasdiqlash kerak" deb yoz.

# RUXSAT ETILGAN HUQUQIY ASOSLAR
${lawList}

# 8 KOMPETENSIYA (0–100)
${defs}
Faqat mashg'ulotda haqiqatan ko'ringan kompetensiyalarni asosli bahola. Ko'rinmagan kompetensiyaga neytral 50 qo'y.

# CHIQISH — FAQAT JSON
{
 "whatWentRight": string[] (2–4 band, aniq, mashg'ulotdan misol bilan),
 "mistakes": [{"ref": string, "text": string}] (1–4 band; ref formatlari yuqorida),
 "doDifferently": string[] (2–4 aniq harakat — "keyingi safar ..."),
 "scores": {${COMPETENCIES.map((c) => `"${c}": int`).join(", ")}},
 "summary": string (2–3 gap: xodim qaysi vaziyatni MUSTAQIL boshqara oladi, qayerda instruktor nazorati kerak)
}`;
}

export const DEBRIEF_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    whatWentRight: { type: "ARRAY", items: { type: "STRING" } },
    mistakes: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { ref: { type: "STRING" }, text: { type: "STRING" } },
        required: ["ref", "text"],
      },
    },
    doDifferently: { type: "ARRAY", items: { type: "STRING" } },
    scores: {
      type: "OBJECT",
      properties: Object.fromEntries(COMPETENCIES.map((c) => [c, { type: "INTEGER" }])),
      required: [...COMPETENCIES],
    },
    summary: { type: "STRING" },
  },
  required: ["whatWentRight", "mistakes", "doDifferently", "scores", "summary"],
} as const;

/* ---------------- user-turn builders (compact evidence) ---------------- */

export function dialogEvidence(s: DialogScenario, p: DialogPayload): string {
  let officerN = 0;
  const lines = p.transcript.map((t) => {
    if (t.role === "officer") {
      officerN++;
      const a = t.assessment;
      const meta = a
        ? ` [ohang=${a.tone}; bosqich=${a.phaseDetected}; Δtaranglik=${a.delta.tension}; flags=${a.flags.join(",") || "-"}${a.coachNote ? `; murabbiy: ${a.coachNote}` : ""}]`
        : "";
      return `turn:${officerN} XODIM: ${t.text}${meta}`;
    }
    return `FUQARO: ${t.text}`;
  });
  const hints = Object.entries(s.rubricHints)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");
  return `# SSENARIY: ${s.code} — ${s.title.uz}
Fuqaro: ${s.persona.name}, ${s.persona.age}, turi=${s.persona.type}. Joy: ${s.setting.uz}
Fuqaro nima istagan edi: ${s.persona.grievance}
Sir faktlar (ochilishi kerak edi): ${s.persona.secretFacts.join(" | ")}
Ochilganlari: ${p.state.revealed.length ? p.state.revealed.join(" | ") : "hech biri"}
Yakun: ${p.endReason ?? "noma'lum"}; oxirgi holat: taranglik=${p.state.tension}, ishonch=${p.state.trust}, hamkorlik=${p.state.cooperation}, bosqich=${p.state.phase}

# BAHOLASH UCHUN YO'RIQ (instruktor rubrikasi)
${hints || "-"}

# YOZUV
${lines.join("\n")}`;
}

export function decisionEvidence(s: DecisionScenario, p: DecisionPayload): string {
  const steps = p.path.map((st, i) => {
    const node = s.nodes[st.nodeId];
    if (!node) return `${i + 1}. node:${st.nodeId} (?)`;
    const head = `${i + 1}. node:${node.id} [vazifa=${node.task.kind}]${node.chainPrompt ? ` (${node.chainPrompt})` : ""}: ${node.situation.uz}`;
    if (st.timedOut) return `${head}
   Oqibat: VAQT TUGADI (vaziyat baholanmadi)`;
    const task = node.task;
    if (task.kind === "choice") {
      const opt = st.optionId ? task.options.find((o) => o.id === st.optionId) : undefined;
      const alt = task.options
        .map((o) => `   · option:${o.id} [qonuniylik=${o.legality}/3, mutanosiblik=${o.proportionality}/3]${o.id === st.optionId ? " ← TANLANDI" : ""}: ${o.text.uz}`)
        .join("\n");
      return `${head}
${alt}
   Oqibat: ${opt?.consequence.uz ?? "-"}`;
    }
    const lines = [`${head}`, `   Topshiriq: ${task.prompt.uz}`, `   Tizim bali: ${st.score ?? "-"}/3${st.ungraded ? " (AI baholay olmadi — instruktor ko'rsin)" : ""}`];
    if (task.kind === "voice" || task.kind === "text") {
      lines.push(`   Xodim ${task.kind === "voice" ? "aytdi" : "yozdi"}: «${st.response ?? ""}»`);
      const met = st.rubric ?? {};
      lines.push(...task.rubric.map((r) => `   · rubric:${r.id} ${met[r.id] ? "✓" : "✗"} ${r.text.uz}`));
    } else if (task.kind === "scan") {
      const picked = new Set(st.picks ?? []);
      lines.push(...task.hotspots.map((h) => `   · ${h.hazard ? "XAVF" : "chalg'ituvchi"} ${h.label.uz}: ${picked.has(h.id) ? "belgiladi" : "belgilamadi"}`));
    } else if (task.kind === "order") {
      const name = (id: string) => task.items.find((x) => x.id === id)?.text.uz ?? id;
      lines.push(`   Xodim tartibi: ${(st.picks ?? []).map(name).join(" → ")}`);
      lines.push(`   To'g'ri tartib: ${task.answer.map(name).join(" → ")}`);
    }
    return lines.join("\n");
  });
  return `# SSENARIY: ${s.code} — ${s.title.uz}
${s.brief.uz}
Yakun: ${p.outcome ?? "tugallanmagan"}
Optimal yo'l (option id lar): ${s.optimalPath?.join(" → ") ?? "-"}

# XODIM YO'LI
${steps.join("\n")}`;
}

export function mahallaEvidence(s: MahallaScenario, p: MahallaPayload): string {
  const title = (id: string) => s.problems.find((x) => x.id === id)?.title.uz ?? id;
  const plans = Object.entries(p.plans)
    .map(([id, text]) => `problem:${id} (${title(id)}):\n${text || "(bo'sh)"}`)
    .join("\n\n");
  const grade = p.grade
    ? `Ustuvorlik bali (tizim): ${p.grade.prioritizationScore}/100\n` +
      Object.entries(p.grade.planScores)
        .map(([id, g]) => `problem:${id}: reja ${g.score}/100; yetishmaydi: ${g.missing.join("; ") || "-"}`)
        .join("\n")
    : "-";
  return `# SSENARIY: ${s.code} — ${s.title.uz}
Xodim tanlagan TOP-3 (tartib bilan): ${p.picked.map((id, i) => `${i + 1}) problem:${id} ${title(id)}`).join("; ")}
To'g'ri TOP-3: ${s.answerKey.top3.map((id, i) => `${i + 1}) problem:${id} ${title(id)}`).join("; ")}
Asos: ${s.answerKey.rationale.uz}

# TIZIM BAHOSI
${grade}

# XODIM REJALARI
${plans || "(reja yozilmagan)"}`;
}

export function documentEvidence(s: DocumentScenario, p: DocumentPayload): string {
  const g = p.grade;
  const el = g
    ? s.rubric.map((r) => `- ${r.id} (${r.label.uz}): ${g.elements[r.id]?.present ? "BOR" : "YO'Q"}${g.elements[r.id]?.note ? ` — ${g.elements[r.id].note}` : ""}`).join("\n")
    : "-";
  return `# SSENARIY: ${s.code} — ${s.title.uz} (${s.documentKind})
Berilgan faktlar:
${s.facts.map((f) => `- ${f.uz}`).join("\n")}

# TIZIM TEKSHIRUVI
Ball: ${g?.score ?? "-"}/100
Elementlar:
${el}
Fakt xatolari: ${g?.factErrors.join("; ") || "-"}
Huquqiy xatolar: ${g?.legalErrors.join("; ") || "-"}

# XODIM HUJJATI
${p.text.trim() || "(bo'sh)"}`;
}

export function tirEvidence(s: TirScenario, p: TirPayload): string {
  const rows = p.events.map((e) => {
    const who = e.kind === "action" ? "XODIM" : e.kind === "actor" ? "SHAXS" : "TIZIM";
    const score = e.legality != null ? ` [qonuniylik=${e.legality}/3, mutanosiblik=${e.proportionality}/3]` : "";
    return `t:${Math.round(e.t)} ${who}: ${e.text}${score} (masofa ${e.distance}m, taranglik ${e.agitation}, itoat ${e.compliance})`;
  });
  const hints = Object.entries(s.rubricHints).map(([k, v]) => `- ${k}: ${v}`).join("\n");
  return `# SSENARIY: ${s.code} — ${s.title.uz} (TIR, real vaqt 3D)
${s.briefing.uz}
Aktyorlar: ${s.actors.map((a) => `${a.id}=${a.name} [${a.role}${a.weapon !== "none" ? `, ${a.weapon}` : ""}]`).join("; ")}
Yakun: ${p.outcome ?? "tugallanmagan"}; davomiylik ${Math.round(p.elapsedSec)}s; o'q ${p.shotsFired} (tegdi ${p.hits}); xodimga tekkan o'q: ${p.officerHits ?? 0}${p.hitFactor != null ? `; Hit Factor ${p.hitFactor}` : ""}
Qoida: qurol — faqat bevosita xavfda oxirgi chora (o'qotar qurol qaratilgan, tashlanish, harakatlanayotgan mashina → balon); olomon/garovdagi/formadagi xodim otilsa — 0; qurolsiz yoki shisha bilan shaxsga qurol — 0; "to'g'ri otmaslik" — a'lo.

# BAHOLASH UCHUN YO'RIQ
${hints || "-"}

# JURNAL
${rows.join("\n")}`;
}

export function lawsFor(keys: (keyof typeof LAWS)[]): LawRef[] {
  return keys.map((k) => LAWS[k] as LawRef);
}
