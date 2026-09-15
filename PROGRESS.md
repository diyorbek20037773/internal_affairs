# PROGRESS — HIMOYA-360

Status file for the autopilot loop (see `AUTOPILOT_PROMPT.md`). First unchecked item = next job.

## Done
- [x] "Mening Inspektorim" module: dashboard, AI Inspektor chat + SOP panel, Hodisa, Voice, Qonunchilik (RAG-lite), Ishlarim; uz/ru/en; Gemini key pool. (2026-09-13)
- [x] Rebrand to HIMOYA-360; 4 trainers (AI-Muloqot, Qaror, Smart Mahalla, Smart Debrifing) + HIMOYA-ID + Mentor + Bir kunlik xizmat + Instruktor kabineti. (2026-09-14)
- [x] Hujjatlashtirish trainer, Amaliy xizmat KPI card, all pptx slides covered. (2026-09-14)
- [x] TIR 3D range (VirTra V-300 style): multi-actor engine, 3 template scenarios + yard/bus-stop + plate rack, instructor station, `npm run check:tir`. (2026-09-14)
- [x] Realism: RPM avatars + mocap, Poly Haven 2k HDRI, PBR, post-fx; `scripts/fetch-assets.mjs` on prebuild. (2026-09-14/15)
- [x] Completion pass: `/api/stt`, `/api/sim/mentor`, provisional HIMOYA-ID after debrief, `/api/sim/exam-summary`, PWA, 18 scenarios. Verified live. (2026-09-15)
- [x] FPS pass: PointerLock WASD, viewmodel, centre raycast, ammo/health, game states; perf pass (3D decoupled from React, GPU-based quality). (2026-09-15)
- [x] Project docs: `CLAUDE.md`, `AUTOPILOT_PROMPT.md`, `docs/TZ_concept_ru.md`, this file. (2026-09-15)

## Backlog (in order)
- [x] **Server persistence (Postgres)** — `/api/store/{profile,sessions,himoya-id}` backed by `DATABASE_URL` (auto-migrate), `TrainingRepo` hybrid: local write-through + server when reachable; instructor cabinet sees all trainees across tablets; no `DATABASE_URL` → local-only, unchanged behaviour. (2026-09-15)
  - How: `src/lib/db/pg.ts` (pool + idempotent schema `h360_profiles/sessions/himoya_ids`, jsonb), `src/lib/storage/serverStore.ts` (last-writer-wins by `updatedAt`), `src/lib/storage/trainingRemote.ts` (fetch client, cached `/api/store` mode probe, 60 s re-check), `hybridTrainingRepo` = default `trainingRepo`. `GET /api/store` → `{mode}`; `/api/health.store`.
  - Verify: local `docker run postgres` + `DATABASE_URL=… next dev` → curl PUT/GET/DELETE; Playwright two-context test (scratchpad `pw/store.js`) 8/8: offline-seeded session uploads on list, instructor on another device sees it, blocked API → local fallback, no page errors.
  - Railway: add Postgres plugin, set `DATABASE_URL=${{Postgres.DATABASE_URL}}` on the app service. Until then live site stays local-only.
- [ ] **Auth (MVP)** — badge ID + PIN login backed by the same DB, instructor role server-side, `traineeId` from session; keep local-profile fallback when no DB.
- [ ] **E-O'quv embed mode** — `?embed=1` (no sidebar/header), `postMessage` bridge: tablet app passes profile in, receives session results out; docs for the tablet vendor.
- [ ] **Laser gun / HID input adapter** — WebHID + Gamepad + keyboard mapping → `onShoot`; settings UI to bind a device; docs.
- [ ] **Shock belt output adapter** — `h360:shock` → Web Serial / Web Bluetooth bridge with a test button; docs.
- [ ] **Video packs** — software side exists (`TirVideoLayer`); needs filmed content (`docs/tir-video-pack.md`). Blocked on content.
- [ ] **WebXR mode for TIR** — VR entry button when `navigator.xr` present, controller trigger = shoot.
