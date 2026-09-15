# AUTOPILOT — HIMOYA-360

Read `CLAUDE.md`, `docs/TZ_concept_ru.md`, `PROGRESS.md`. Take the **first unchecked item** in `PROGRESS.md` and build it end-to-end. Repeat until the user stops you or the list is empty.

Rules per item:
1. Scope = the item as written. No scope creep; note discovered gaps as new unchecked items at the bottom of `PROGRESS.md`.
2. Keep the TZ constraints from `CLAUDE.md` (authored scenarios, laws only from `laws.ts`, instructor confirms HIMOYA-ID, API error contract, storage via repos).
3. Verify before claiming done: `npm run build` clean; TIR changes → `npm run check:tir`; API/store changes → curl/Playwright smoke against `next dev` (or the live URL after deploy).
4. Update `PROGRESS.md`: tick the item, one-line "how it works / how to verify" under it, date (YYYY-MM-DD).
5. Commit (Conventional Commits) and `git push origin main`. Railway deploys from `main`.
6. Anything that needs hardware, filmed content, credentials or external systems we don't have: build the software side + adapter + docs, mark the item as "software done, needs X", move on.
7. Never delete user data paths (localStorage keys `h360:*`, `mi:*`) — only add migrations.
