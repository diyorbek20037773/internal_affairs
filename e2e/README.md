# E2E (Playwright)

Jonli saytga qarshi ishlaydi (real Gemini). `BASE` — server URL (default: Railway).

```bash
npm i -D playwright && npx playwright install chromium
BASE=http://localhost:3000 npm run e2e:qa     # 21 platform tekshiruvi: profil, dialog, debrif, qaror, mahalla, hujjat, HIMOYA-ID, instruktor, imtihon
npm run e2e:tir                                # TIR statik rejim: mashina, olomon, bino, marksmanship
npm run e2e:fps                                # TIR FPS rejimi (?controls=fps&lock=0): harakat, otish, zaryad, o'lim, qayta boshlash
npm run e2e:crawl                              # barcha sahifalar desktop + planshet: xatolar, overflow, skrinshotlar (.out/audit)
npm run e2e:relay                              # TIR relay: soxta poligon (fetch) → BASE, instruktor stansiyasi UI → BASE2 (ikki instans + bitta DATABASE_URL = multi-instance)
npm run e2e:station                            # TIR instruktor stansiyasi: real 3D poligon (kontekst A) ⇄ stansiya (kontekst B), pauza + ALL STOP
npm run e2e:report-pdf                         # Instruktor kabineti → o'quvchi hisoboti → /api/report/pdf yuklab olish (uz, ru)
npm run e2e:auth                               # Xizmat ID + PIN: ro'yxatdan o'tish, oflayn sessiya yuklanishi, instruktor boshqa planshetda (DATABASE_URL + AUTH_SECRET + INSTRUCTOR_BADGES=SH-0001)
npm run e2e:embed                              # E-O'quv embed bridge: /embed-demo.html → postMessage protokoli (qurilma rejimi — DATABASE_URL'siz server)
```

3D testlar headless Chromium bilan `--use-gl=swiftshader` ishlatadi; 2k panoramalar birinchi yuklanishda 40–150 s olishi mumkin.
