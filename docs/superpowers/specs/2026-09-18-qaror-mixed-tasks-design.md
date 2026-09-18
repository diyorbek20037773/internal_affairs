# Qaror simulyatori — one scenario, mixed task types (+ TIR last, rebrand)

Date: 2026-09-18. Approved in chat.

## 1. TIR last
TIR moves to the last slot wherever trainers are listed: `TRAINERS` (hub grid), sidebar `nav.ts`, dashboard `ModulesGrid`, guide text.

## 2. Rebrand
- Every user-visible "HIMOYA-360" → **"O'quv klasteri"** (uz), "Учебный кластер" (ru), "Training Cluster" (en): messages, manifest, layout metadata, PDF report, AI system prompts that name the platform.
- "HIMOYA-ID" → **"Klaster-ID"** (uz/ru/en same token).
- Internal identifiers stay (`h360_*` tables, cookies, localStorage keys, `HimoyaId` type, `/api/store/himoya-id`) — renaming them loses stored data.

## 3–5. Decision simulator with mixed tasks
The 4 multiple-choice scenarios are removed; one scenario remains: **Q-01 «3-qavatdagi chaqiruv»** (domestic violence call, ~10 min). The exam day does not reference decision scenarios, so nothing to re-point there.

### Data model (`data/scenarios/types.ts`)
`DecisionNode` gets a `task` discriminated union instead of a flat `options` list:

| kind | trainee does | graded by |
|---|---|---|
| `choice` | picks an option (optional timer) | authored legality/proportionality (unchanged) |
| `scan` | taps hazards on an SVG scene | deterministic: found − false picks → 0–3 |
| `order` | taps actions in priority order | deterministic: position match → 0–3 |
| `voice` | speaks (server STT), transcript editable, typing fallback | AI rubric → 0–3 |
| `text` | writes a short text (report narrative) | AI rubric → 0–3 |

Non-choice tasks carry `competencies`, and `branches: {minScore, next, outcome?, consequence}[]` — the score picks the branch, so how well you spoke/wrote/analysed changes what happens next. `voice`/`text` carry `rubric: {id, text}[]`, `minWords`, `sample` (model answer shown after).

### Session payload
`DecisionStepSchema` gains optional `task`, `score` (0–3), `response` (text/transcript), `picks` (scan/order ids), `rubric` (id → met), `feedback`, `ungraded`. Old sessions still parse.

### Grading route
`POST /api/sim/task-grade {scenarioId, nodeId, response, locale}` — rubric taken from server-side scenario data, `generateJson()` returns per-item `met` + `violation` (insult/threat/unlawful promise) + feedback + strength. Server computes score = round(3 × coverage), violation caps at 1, below `minWords` caps at 1. Error contract unchanged (500/503/502). On AI failure the client offers **Retry** or **Continue ungraded** (branches as score 2 — an outage must not steer the story against the trainee; `ungraded: true` steps are left out of competency scoring and flagged for the instructor).

### Scoring
`decisionDeterministic`: choice steps as before; task steps add `score/3×100` into each of their competencies; means per competency; `natijadorlik` from outcome.

### UI
`DecisionSimClient` dispatches on `task.kind` to `ChoiceTask`, `ScanTask`, `OrderTask`, `SpeakWriteTask` (voice+text). Result card shows consequence, score 0–3, rubric checklist, sample answer. Right rail: step list with task-type icons. Touch-first (tap, no drag), tablet width.

### Checks
`npm run check:decision`: graph integrity, branch resolution, scan/order scoring, every scenario law key exists. Build clean.
