# 🛡 HIMOYA-360 — milliy smart-ta'lim modeli

**HIMOYA-360** — O'zbekiston Respublikasi IIV xodimlarini real xizmat vaziyatlariga tayyorlovchi **ssenariyli simulyatsion o'qitish platformasi** (Kasbiy rivojlanish markazi modeli). Ichida **«Mening Inspektorim»** — xizmat jarayonidagi AI yordamchi moduli.

> **Shior:** «Xodimni o'qitmaymiz — uni real xizmatga tayyorlaymiz». Sikl: VAZIYAT → TAHLIL → MULOQOT → QAROR → HARAKAT → NATIJA.

📱 **PWA:** planshetda «Bosh ekranga qo'shish» — HIMOYA-360 ilova sifatida ochiladi (manifest + service worker, statik assetlar keshlanadi).

🌐 **Jonli:** https://internalaffairs-production.up.railway.app · 🗣 uz / ru / en · 📱 planshet brauzerida ishlaydi (Android, 4G) · ✅ E2E: `e2e/` (Playwright, jonli Gemini bilan) — `npm run e2e:qa` 21 tekshiruv, `e2e:tir`, `e2e:fps`

## Trenajyorlar (HIMOYA-360)

| Xona | Route | Nima qiladi |
|---|---|---|
| **AI-Muloqot simulyatori** | `/simulyator/muloqot` | Gemini rol o'ynaydigan virtual fuqaro (jahldor / qo'rqqan / nizoli / jabrlanuvchi / norozi). Yashirin holat (taranglik, ishonch, hamkorlik) serverda hisoblanadi; xodim faqat trend + ohang + bosqichni ko'radi. Matn + ovoz (STT/TTS). |
| **TIR — 3D poligon (VirTra V-300 uslubi)** | `/simulyator/tir` | PDF'dagi TIR o'quv zonasi uchun ko'p aktyorli real-vaqt 3D poligon (Three.js). **3 shablon:** mashina — balonga o'q oxirgi chora sifatida; olomon ichida garovdagi bilan qurolli shaxs; bino ichida otuvchi + formadagi hamkasb + tinch fuqarolar. + hovli/bekat ssenariylari, **marksmanship** (plate rack, Score / Hit Factor / split). Nishonni farqlash: olomon, garovdagi, formadagi xodim, to'xtab turgan mashina otilsa — mashg'ulot to'xtaydi. Xodimga o'q tegsa — **elektroshok** (qizil vignet, vibratsiya, `h360:shock` hodisasi — real kamar uchun). «ALL STOP! SCENARIO COMPLETE» → debrif. **Instruktor stansiyasi** (ghost mode): ikkinchi oyna/planshetdan jonli keskinlashtirish, personaj kiritish, pauza, ALL STOP (BroadcastChannel). 48:9 «3 ekran» rejimi, fullscreen, klaviatura, TTS. |
| **Qaror simulyatori (planshet)** | `/simulyator/qaror` | Tarmoqlanuvchi (branching) ssenariy, tugun taymeri, 3–5 variant. Har variantda **qonuniylik** va **mutanosiblik** (0–3). Tezlik baholanmaydi; «to'g'ri otmaslik» = a'lo. |
| **Smart Mahalla** | `/simulyator/mahalla` | Virtual uchastka (SVG xarita, yashil/sariq/qizil), murojaatlar oqimi, TOP-3 muammo + harakat rejasi. Ustuvorlik deterministik, reja — AI rubrika bo'yicha. |
| **Hujjatlashtirish** | `/simulyator/hujjat` | AI hujjat tekshiruvi (qonun va fakt): berilgan faktlardan bayonnoma/ma'lumotnoma, rubrika bo'yicha to'liqlik, o'ylab topilgan fakt/modda, aybdorlik xulosasi — xato. |
| **Smart Debrifing** | `/simulyator/debrif/[id]` | 3 savol (to'g'ri / xato qayerda `turn:N`, `node:ID` / keyingi safar), 8 kompetensiya. `final = 0.6·tizim + 0.4·AI`. **Instruktor tasdiqlaydi** — shundan keyin HIMOYA-ID yangilanadi. |
| **HIMOYA-ID + AI-Mentor** | `/mashgulotlarim`, `/simulyator` | 8 yo'nalishli kompetensiya radar (rolling mean). Har mashg'ulotdan keyin **avtomatik (dastlabki)** yangilanadi, instruktor tasdig'i yakunlaydi. Mentor: qoida bilan ssenariy tanlaydi + **Gemini shaxsiy tavsiya** (matn, e'tibor nuqtalari, mikro-mashq). |
| **Bir kunlik xizmat** | `/simulyator/imtihon` | Yakuniy imtihon — 09:00 hudud → 10:30 nizoli fuqaro → 13:00 xavfli vaziyat (TIR) → 15:00 hujjatlashtirish → **16:30 butun kun bo'yicha AI yakuniy xulosa** (O'TDI / SHARTLI / O'TMADI, mustaqil/nazorat ostida vaziyatlar, keyingi hafta rejasi). |
| **Amaliy xizmat (KPI)** | `/mashgulotlarim` | 30–90 kunlik xizmat natijasi («Mening Inspektorim» ishlari) + instruktor KPI → HIMOYA-ID natijadorlik. |
| **Instruktor kabineti** | `/instruktor` | Tasdiq kutayotgan debriflar, o'quvchilar jadvali (profil roli = instruktor). |

Ssenariylar — `data/scenarios/` da qo'lda yozilgan TS data (runtime'da LLM yaratmaydi → deterministik baho, instruktor tekshira oladi). Huquqiy asos faqat `data/sops/laws.ts` dagi tasdiqlangan moddalardan.

**Xalqaro asos:** Stockton PD ssenariyli mashq (rol o'ynovchi + darhol debrif), PERF ICAT (Critical Decision-Making Model), VirTra/Axon (branching), UK Hydra (immersiv debrif), Niderlandiya Politieacademie VR, Singapur HTA. Biz **AI + veb** bilan boshlaymiz — planshet brauzerida ishlaydi, jihoz kerak emas; VR — keyingi bosqich.

### Muhim texnik qarorlar
- `src/lib/gemini/client.ts` → `generateJson()` — Gemini JSON mode (`responseSchema` + zod + 1 repair retry).
- `src/lib/storage/training.ts` → `TrainingRepo`: **gibrid** — har yozuv avval localStorage'ga (oflayn planshet), `DATABASE_URL` bo'lsa Postgres'ga ham (`/api/store/*`, jadval avtomatik yaratiladi, `updatedAt` bo'yicha oxirgi yozuv g'olib). Instruktor kabineti server bilan barcha planshetlarni ko'radi; serversiz — faqat shu qurilma. Kalitlar: `h360:profile:v1`, `h360:sessions:v1`, `h360:himoyaId:v1`.
- `src/lib/training/` → `dialogState` (holat matematikasi), `decisionEngine`, `tirEngine` (ko'p aktyorli 3D poligon holat mashinasi: odam/mashina/plastina, qonuniylik jurnali, instruktor buyruqlari), `competency` (baholash), `mentor`, `debrief`.
- `src/components/training/tir/` → Three.js sahna: `TirScene` (ACES tone mapping, soft shadows, SMAA/Bloom/Vignette post-effektlar, HQ/LQ), `RealHuman` (**real avatarlar**: Ready Player Me tana/yuz meshi M+F, motion-capture kliplar — idle/talking/gestures/walk/run/crouch; holatga qarab suyaklar boshqariladi: qurol qaratish, qo'l ko'tarish, garov, tiz cho'kish, yotish; politsiya — kepka + jilet), `Environments` (**foto-panoramalar**: Poly Haven HDRI — real hovli, kechki ko'cha, maydon, ofis vestibyuli, koridor; HQ=2k, LQ=1k; yerga proyeksiya = real fon + real yoritish; video-kamera FOV 55°, kino-grain/vinyetka; PBR teksturali asfalt/beton/o't/g'isht), `TirVideoLayer` (real aktyor videosi qatlami), `Actor` (protsedural fallback, mashina, plastina).
- **Assetlar** (`npm run assets`, `prebuild`da avtomatik): RPM avatarlar+animatsiyalar (litsenziya: RPM avatarlari bilan foydalanish mumkin, tarqatish yo'q → repoga qo'shilmaydi, Railway build'da yuklanadi), Poly Haven HDRI/teksturalar (CC0). `.glb` butunligi tekshiriladi, 3 urinish. Asset bo'lmasa — protsedural figura / tekis osmon fallback.
- **FPS boshqaruv (Counter-Strike uslubi, loyihaga moslangan)** — `src/components/training/tir/player/FpsControls.tsx`: birinchi shaxs xodim — **WASD** (kameraga nisbatan), **Shift** yugurish, **C/Ctrl** cho'kkalash, **Space** sakrash, sichqoncha bilan qarash (**Pointer Lock**, pitch ±85°, **Esc** — chiqish); gravitatsiya, yer, chegara doirasi (`scenario.bounds.radius`, 6 m), to'siq bloki va aktyor tanalari bilan to'qnashuv (`tirEngine.clampOfficer`, kutubxonasiz). `weapons/Viewmodel.tsx` — xizmat tapanchasi viewmodel (primitivlar, sway/bob/recoil/reload), `weapons/ShotRaycaster.tsx` — **ekran markazidan raycast** (`userData.actorId` + zona), `src/lib/training/weaponConfig.ts` — yarim avtomat, **15/30 o'q**, R — qayta zaryad 1.8 s, recoil, zona koeffitsiyentlari (bosh 1.0 / tana 0.65 / oyoq-qo'l 0.35 → `hp`). Dvigatel: `TirState.officer {x,z,crouch}` — aktyorlar xodimga qarab **silliq buriladi va quvadi**, masofa/tashlanish/mashina xodimning real joyiga nisbatan; to'siq ortida cho'kkalash = himoya (tegish ehtimoli 0.25); **salomatlik 100** (har tegish −100/officerHitsToFail). O'yin holatlari: MENU → PLAYING → PAUSED → PLAYER_DEAD / ROUND_WON / ROUND_LOST, **Qayta boshlash** = shu ssenariyda yangi sessiya. HUD: crosshair, hit-marker, salomatlik, `15 / 30`, WebAudio ovozlar (o't, quruq bosish, zaryad, qadam, jarohat). Rejim: `?controls=fps|fixed` (sensorli qurilma → `fixed` — planshetdagi eski bosish rejimi saqlanadi), `?lock=0` — pointer lock'siz (kiosk/E2E). Tugmalar: F qurol, H g'ilof, T elektroshok, B yordam, R zaryad, Q to'siq / X chekinish (faqat statik).
- **Video-pak** (VirTra'ning asl usuli — real aktyorlar): `docs/tir-video-pack.md` — fayl tuzilmasi, suratga olish qo'llanmasi; ssenariyga `video.clips` qo'shilsa dvigatel holatga mos klipni ko'rsatadi.
- `/api/sim/{dialog,debrief,mahalla-grade,document-check,mentor,exam-summary}`, `/api/stt` (Gemini audio STT — o'zbekcha mikrofon), `/api/tts` — barchasi `no_keys_configured` (500) / `ai_unavailable` (503) / `bad_ai_output` (502) kontraktida.
- **Hisoblar.** Ikki rejim: (1) *qurilma rejimi* (`DATABASE_URL` yo'q) — profil planshetda, instruktor roli markaz kodi (`INSTRUCTOR_CODE`) bilan ochiladi; (2) *server rejimi* — xizmat ID + PIN (`/api/auth/*`, scrypt, httpOnly cookie, 5 xato → 1 daqiqa blok), instruktor roli `INSTRUCTOR_BADGES` ro'yxatidan. Har yozuvda `traineeId` bor; o'quvchi faqat o'z yozuvlarini, instruktor hammasini ko'radi.

---

## «Mening Inspektorim» moduli


AI raqamli yordamchi — O'zbekiston Respublikasi Ichki ishlar organlari **profilaktika inspektori** uchun. Bu oddiy chatbot emas, **AI Workflow Engine**: hodisa yuz berganda inspektorni bosqichma-bosqich (SOP) yo'naltiradi — nima qilish, qaysi hujjat, qaysi qonun moddasi, qaysi organga xabar berish.

> **Shior:** Har bir inspektor uchun ishonchli AI yordamchi. Har bir qaror — qonunchilik va tasdiqlangan tartiblar asosida, har bir jarayon — bosqichma-bosqich.

## Imkoniyatlar

- **6 sahifa:** Bosh sahifa (dashboard + statistika), AI Inspektor (chat + Checklist/Jarayon/Hujjatlar/Qonunlar paneli), Hodisa boshlash, Ovozli yordamchi (STT→AI→TTS), Qonunchilik (RAG-lite), Mening ishlarim.
- **3 til:** o'zbek (default) / rus / ingliz — to'liq tarjima (`next-intl`).
- **Light / Dark** mavzu (`next-themes`), IIV rasmiy uslubi (chuqur ko'k + oltin urg'u).
- **Gemini backend:** server tarafda, `@google/genai`, streaming. Ko'p API kalit **random rotatsiya + failover** bilan.
- **Workflow Engine:** har hodisa uchun SOP, deterministik bosqich tartibi + checklist, progress %. Ishlar `localStorage`da saqlanadi.
- **Huquqiy xavfsizlik:** modda raqamlarini o'ylab topmaydi; ishonch bo'lmasa rasmiy manbaga (lex.uz) yo'naltiradi; har javobda disclaimer.

## Texnologiya

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui uslubi · `@google/genai` · `next-intl` · `next-themes` · `zod`.

## Ishga tushirish (lokal)

```bash
npm install
cp .env.example .env        # GEMINI_API_KEYS ni to'ldiring
npm run dev                 # http://localhost:3000
```

### Muhit o'zgaruvchilari

| Nomi | Tavsif |
|------|--------|
| `GEMINI_API_KEYS` | Bir yoki bir nechta Gemini kaliti (vergul yoki yangi qatordan). Random tanlanadi, 429/quota'da boshqasiga o'tadi. |
| `GEMINI_MODEL` | Ixtiyoriy. Default: `gemini-2.5-flash`. |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Ixtiyoriy. Default: `uz`. |
| `NEXT_PUBLIC_SITE_URL` | Ixtiyoriy. Sayt URL — OpenGraph/Telegram preview uchun. |
| `DATABASE_URL` | Ixtiyoriy. Postgres — profil, mashg'ulotlar, HIMOYA-ID barcha planshetlar uchun bitta joyda (`/api/store/*`, sxema avtomatik). Yo'q bo'lsa — hammasi planshetda (localStorage), oflayn ishlaydi. |
| `DATABASE_SSL` | Ixtiyoriy. `false` — SSL'siz ulanish (lokal Postgres). |
| `AUTH_SECRET` | `DATABASE_URL` bilan birga **majburiy** (production): sessiya cookie imzosi. Uzun tasodifiy satr. |
| `INSTRUCTOR_BADGES` | Server rejimi: instruktor roli beriladigan xizmat ID'lar (`SH-0001,SH-0002`). |
| `INSTRUCTOR_CODE` | Qurilma rejimi: profilda «Instruktor» rolini ochadigan markaz kodi. Bo'sh bo'lsa rol erkin (demo). |
| `NEXT_PUBLIC_EMBED_ORIGINS` | E-O'quv ilovasi iframe'da ochsa — ruxsat etilgan origin'lar (vergul bilan). WebView uchun kerak emas. |

> ⚠️ Haqiqiy kalitlar hech qachon gitga qo'shilmaydi (`.env` gitignore'da). Faqat `.env.example` repoda.

## Railway'ga deploy

1. GitHub reponi Railway'ga ulang (deploy-on-push).
2. Railway → **Variables**: `GEMINI_API_KEYS` (bir nechta kalit; yaroqsiz kalit avtomatik o'tkazib yuboriladi), ixtiyoriy `GEMINI_MODEL`, `NEXT_PUBLIC_SITE_URL` (OpenGraph/link preview uchun).
3. Build: `npm run build` · Start: `npm run start` (Railway `$PORT` ni avtomatik bog'laydi). Nixpacks avtomatik aniqlaydi. `prebuild` 3D assetlarni (RPM avatarlar, Poly Haven HDRI/teksturalar) internetdan yuklaydi — build tarmoqqa chiqa olishi kerak.
4. Bir nechta planshet uchun: Railway **Postgres** plagini → `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `AUTH_SECRET`, `INSTRUCTOR_BADGES`. Bitta planshet/demo uchun shart emas.

## Ma'lumotlar, oflayn va zaxira

- **Qurilma rejimi:** hamma narsa planshetning localStorage'ida (`h360:*` kalitlari). «Mashg'ulotlarim» → **JSON eksport/import** — zaxira va boshqa qurilmaga ko'chirish. Eski build yozgan noma'lum yozuvlar o'chirilmaydi, chetga olib qo'yiladi.
- **Server rejimi:** har yozuv avval planshetga, keyin serverga (write-through). 4G uzilsa mashg'ulot davom etadi, ulanish qaytganda «Mashg'ulotlarim» ochilganda sinxronlanadi. To'qnashuvda `updatedAt` bo'yicha yangisi g'olib. O'quvchi o'z debrifini tasdiqlay olmaydi — tasdiq faqat instruktor sessiyasidan qabul qilinadi.
- **Zaxira:** Railway Postgres snapshot yoki `pg_dump`. Jadval: `h360_profiles`, `h360_sessions`, `h360_himoya_ids`, `h360_auth` (jsonb).
- AI so'rovlari (dialog, debrif, hujjat tekshiruvi, STT/TTS) Gemini'ga yuboriladi; kalitlar faqat serverda. Shaxsiy ma'lumotlarni ssenariy matniga kiritmaslik tavsiya etiladi.

## Planshetda o'rnatish (Android, Chrome)

1. Chrome'da saytni oching → menyu → **«Bosh ekranga qo'shish»** — HIMOYA-360 alohida ilova sifatida ochiladi (PWA, to'liq ekran).
2. Birinchi ochilishda profilni to'ldiring (server rejimida — xizmat ID + PIN bilan kiring).
3. Mikrofon ruxsatini bering — AI-Muloqotda ovoz bilan gapirish uchun (`/api/stt`).
4. TIR poligoni planshetda **statik rejim**da ishlaydi (nishonga bosish); 3D sifat avtomatik tanlanadi (LQ — 1k panorama, post-effektsiz). Birinchi yuklanish ~10–15 MB.
5. Ko'p planshet + instruktor kabineti bitta joyda — server rejimi (`DATABASE_URL`).

## Jihozlar (halol ro'yxat)

| Jihoz | Holat |
|---|---|
| Planshet / kompyuter brauzeri | **Ishlaydi** — asosiy rejim, qo'shimcha jihoz kerak emas. |
| Ikkinchi monitor / ikkinchi oyna / alohida planshet — instruktor stansiyasi (TIR) | **Ishlaydi** — shu kompyuterda ikkinchi oyna (`BroadcastChannel`) **va** alohida planshetdan server relay orqali (`/api/tir/station`, 1 s so'rov): `/simulyator/tir/instruktor` sahifasida «Jonli poligonlar» ro'yxati. Auth yoqilgan bo'lsa — faqat instruktor. |
| 3 ekranli devor (48:9) | «3 ekran» tugmasi keng FOV beradi; **haqiqiy 3 proyektorli devor** — videokarta 3 chiqishni bitta keng ekran qilib bersa ishlaydi (Windows «Span»/NVIDIA Surround). Maxsus sozlash yo'q. |
| Lazerli o'quv tapanchasi (USB HID / gamepad) | **Adapter bor** — `docs/tir-input-devices.md`: tugmani bog'lash, otish → markazdan raycast. Muayyan model bilan sinash markazda. |
| Elektroshok kamari | **Adapter bor** — `docs/tir-shock-belt.md` (Web Serial / Web Bluetooth) + `h360:shock` hodisasi. Muayyan qurilma protokoli bilan moslash kerak. |
| Real aktyorli video-paketlar | Dasturiy tomoni tayyor (`TirVideoLayer`, `docs/tir-video-pack.md`); **kontent suratga olinishi kerak**. |
| VR (WebXR) | Rejada. |

## Arxitektura

```
prompts/system-prompt.uz.ts   # PROMPT.txt → Gemini system instruction (6-bo'limli format)
prompts/virtual-citizen.uz.ts # HIMOYA-360: virtual fuqaro (yashirin holat + JSON baho)
prompts/debrief.uz.ts         # HIMOYA-360: Smart Debrifing grader (3 savol + 8 kompetensiya)
prompts/mahalla-grader.uz.ts  # HIMOYA-360: harakat rejasi rubrikasi
prompts/document-checker.uz.ts# HIMOYA-360: hujjat tekshiruvi (qonun va fakt)
data/scenarios/               # HIMOYA-360 ssenariylari: dialog/ decision/ mahalla/ document/ exam/ (+ competencies)
data/sops/                    # SOP ma'lumot modeli (hodisa turlari, bosqichlar, checklist, qonunlar)
src/lib/gemini/keyPool.ts     # random key rotatsiya + failover
src/lib/gemini/client.ts      # streamChat() — Gemini streaming
src/app/api/chat|legal        # streaming route handler (nodejs runtime)
src/app/api/sim/*             # HIMOYA-360: dialog, debrief, mahalla-grade, document-check (JSON mode)
src/lib/training/             # HIMOYA-360: dialogState, decisionEngine, competency, mentor, debrief
src/lib/storage/training.ts   # TrainingRepo (profil, sessiyalar, HIMOYA-ID) — localStorage
src/components/training/      # trenajyor UI: dialog/ decision/ mahalla/ document/ debrief/ exam/ profile/ instructor/
src/lib/workflow/             # deterministik bosqich + checklist engine
src/hooks/useChatStream.ts    # stream o'qish + 6-bo'lim jonli parsing
src/components/                # UI (layout, chat, dashboard, incident, voice, legal)
messages/{uz,ru,en}.json      # tarjimalar
```

## Keyingi bosqich (roadmap)

- Haqiqiy huquqiy PDF/DOCX + vektor RAG (Qdrant/pgvector) — `/api/legal` da `// RAG hook` qoldirilgan.
- Instruktor kabineti: PDF eksportni server tomonda (brauzer print o'rniga) generatsiya qilish; guruhlarni alohida ma'lumot sifatida yuritish (hozir — hudud).
- Instruktor stansiyasi relayi bir instansiya xotirasida — ko'p instansiyali Railway uchun Postgres/Redis'ga ko'chirish.
- «Mening Inspektorim» xizmat tizimlari bilan integratsiya (E-patrul, Shakl 17, Raqamli mahalla) — hozir bosh sahifada integratsiya xaritasi.

---

O'zbekiston Respublikasi Ichki ishlar vazirligi — HIMOYA-360 v2.1
