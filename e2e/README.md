# E2E (Playwright)

Jonli saytga qarshi ishlaydi (real Gemini). `BASE` — server URL (default: Railway).

```bash
npm i -D playwright && npx playwright install chromium
BASE=http://localhost:3000 npm run e2e:qa     # 21 platform tekshiruvi: profil, dialog, debrif, qaror, mahalla, hujjat, HIMOYA-ID, instruktor, imtihon
npm run e2e:tir                                # TIR statik rejim: mashina, olomon, bino, marksmanship
npm run e2e:fps                                # TIR FPS rejimi (?controls=fps&lock=0): harakat, otish, zaryad, o'lim, qayta boshlash
npm run e2e:crawl                              # barcha sahifalar desktop + planshet: xatolar, overflow, skrinshotlar (.out/audit)
```

3D testlar headless Chromium bilan `--use-gl=swiftshader` ishlatadi; 2k panoramalar birinchi yuklanishda 40–150 s olishi mumkin.
