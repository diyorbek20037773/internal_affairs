# Huquqni muhofaza qilish ta'lim klasteri (ex O'quv klasteri / HIMOYA-360) — Claude working rules

**What:** one learning & competency platform for Uzbek law-enforcement bodies (IIV, Milliy gvardiya, Bojxona, Prokuratura, FVV). Chain: kasb standarti → kompetensiya → o'quv klasteri → amaliyot → simulyator → baholash → kompetensiya pasporti → karyera. Professions/standards/clusters live in `data/kasblar/`, per-profession simulators in `data/kasblar/sims/` (`/kasb-simulyator`), AI tutor topics per agency in `data/tutor/` (`/tutor`), passport at `/pasport`. The original IIV trainers (muloqot, qaror, mahalla, hujjat, TIR) and "Mening Inspektorim" (profilaktika inspektori) remain modules inside it. Module UI strings live in `messages/{kasb,kasbsim,tutor}/<locale>.json` fragments. Next.js 15 App Router (React 19) + TS + Tailwind, next-intl 4 (uz/ru/en), Gemini (`@google/genai`), Three.js/r3f 9 + drei 10 for the TIR range (three pinned 0.160 / postprocessing 6.36 — newer postprocessing needs three ≥0.168).

**Live:** https://internalaffairs-production.up.railway.app (Railway, deploy-on-push from `main`, `GEMINI_API_KEYS` set there; no local `.env`).

## Process (autopilot)
- Source of truth for status: `PROGRESS.md`. Concept: `docs/TZ_concept_ru.md`. Loop rules: `AUTOPILOT_PROMPT.md`.
- Every item: build → `npm run build` clean → `npm run check:tir` (if TIR touched) → update `PROGRESS.md` → commit → `git push origin main`.
- Commit messages: Conventional Commits, English, `feat(tir): …` / `feat(store): …`.

## Hard constraints
- Scenarios are authored TS data in `data/scenarios/` — never LLM-generated at runtime.
- Legal references only from `data/sops/laws.ts` (lex.uz-verified). Never invent article numbers.
- HIMOYA-ID updates provisionally after a debrief; only an instructor confirmation finalises it.
- All AI routes follow the contract: `no_keys_configured` → 500, `ai_unavailable` → 503, `bad_ai_output` → 502. Use `generateJson()` for structured output.
- Storage goes through `TrainingRepo` (`src/lib/storage/training.ts`) / `CasesRepo` — never touch localStorage from components.
- Tablets: Android + 4G, browser only. Everything must work at tablet width and degrade offline (localStorage fallback stays).
- 3D assets (RPM avatars/anims, Poly Haven HDRI) are not in git — `scripts/fetch-assets.mjs` on `prebuild`. RPM anim licence: only with RPM avatars, no redistribution.
- UI text via `messages/{uz,ru,en}.json`; uz is the default locale.

## Verification notes
- Headless Chromium for 3D: `--use-gl=swiftshader`, `?controls=fixed&lock=0`; 2k HDRI can take 40–150 s to load headless.
- Engine logic: `npm run check:tir`, `npm run check:tir:fps`.
