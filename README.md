# 🛡 HIMOYA-360 — milliy smart-ta'lim modeli

**HIMOYA-360** — O'zbekiston Respublikasi IIV xodimlarini real xizmat vaziyatlariga tayyorlovchi **ssenariyli simulyatsion o'qitish platformasi** (Kasbiy rivojlanish markazi modeli). Ichida **«Mening Inspektorim»** — xizmat jarayonidagi AI yordamchi moduli.

> **Shior:** «Xodimni o'qitmaymiz — uni real xizmatga tayyorlaymiz». Sikl: VAZIYAT → TAHLIL → MULOQOT → QAROR → HARAKAT → NATIJA.

🌐 **Jonli:** https://internalaffairs-production.up.railway.app · 🗣 uz / ru / en · 📱 planshet brauzerida ishlaydi (Android, 4G) · ✅ E2E QA (Playwright, real Gemini): 21/21

## Trenajyorlar (HIMOYA-360)

| Xona | Route | Nima qiladi |
|---|---|---|
| **AI-Muloqot simulyatori** | `/simulyator/muloqot` | Gemini rol o'ynaydigan virtual fuqaro (jahldor / qo'rqqan / nizoli / jabrlanuvchi / norozi). Yashirin holat (taranglik, ishonch, hamkorlik) serverda hisoblanadi; xodim faqat trend + ohang + bosqichni ko'radi. Matn + ovoz (STT/TTS). |
| **TIR — 3D qaror poligoni** | `/simulyator/tir` | PDF'dagi TIR o'quv zonasi (3 devorli ekran) uchun: Three.js real-vaqt 3D sahna (hovli / ko'cha / koridor), personaj yaqinlashadi, qurol ko'taradi, tashlanadi yoki taslim bo'ladi; xodim gapiradi (mikrofon / iboralar / matn), buyruq beradi, qurol chiqaradi, elektroshok, **nishonga oladi va otadi** (raycast), yordam chaqiradi, chekinadi, to'siq. Deterministik dvigatel har harakatni qonuniylik/mutanosiblik bilan jurnalga yozadi. 48:9 «3 ekran» rejimi, fullscreen, klaviatura. Personaj ovozi — TTS. |
| **Qaror simulyatori (planshet)** | `/simulyator/qaror` | Tarmoqlanuvchi (branching) ssenariy, tugun taymeri, 3–5 variant. Har variantda **qonuniylik** va **mutanosiblik** (0–3). Tezlik baholanmaydi; «to'g'ri otmaslik» = a'lo. |
| **Smart Mahalla** | `/simulyator/mahalla` | Virtual uchastka (SVG xarita, yashil/sariq/qizil), murojaatlar oqimi, TOP-3 muammo + harakat rejasi. Ustuvorlik deterministik, reja — AI rubrika bo'yicha. |
| **Hujjatlashtirish** | `/simulyator/hujjat` | AI hujjat tekshiruvi (qonun va fakt): berilgan faktlardan bayonnoma/ma'lumotnoma, rubrika bo'yicha to'liqlik, o'ylab topilgan fakt/modda, aybdorlik xulosasi — xato. |
| **Smart Debrifing** | `/simulyator/debrif/[id]` | 3 savol (to'g'ri / xato qayerda `turn:N`, `node:ID` / keyingi safar), 8 kompetensiya. `final = 0.6·tizim + 0.4·AI`. **Instruktor tasdiqlaydi** — shundan keyin HIMOYA-ID yangilanadi. |
| **HIMOYA-ID + AI-Mentor** | `/mashgulotlarim`, `/simulyator` | 8 yo'nalishli kompetensiya radar (rolling mean). Mentor eng zaif yo'nalish bo'yicha keyingi ssenariyni tavsiya qiladi (rule-based). |
| **Bir kunlik xizmat** | `/simulyator/imtihon` | Yakuniy imtihon — 09:00 hudud → 10:30 nizoli fuqaro → 13:00 xavfli vaziyat → 15:00 hujjatlashtirish → 16:30 debrifing/baho. |
| **Amaliy xizmat (KPI)** | `/mashgulotlarim` | 30–90 kunlik xizmat natijasi («Mening Inspektorim» ishlari) + instruktor KPI → HIMOYA-ID natijadorlik. |
| **Instruktor kabineti** | `/instruktor` | Tasdiq kutayotgan debriflar, o'quvchilar jadvali (profil roli = instruktor). |

Ssenariylar — `data/scenarios/` da qo'lda yozilgan TS data (runtime'da LLM yaratmaydi → deterministik baho, instruktor tekshira oladi). Huquqiy asos faqat `data/sops/laws.ts` dagi tasdiqlangan moddalardan.

**Xalqaro asos:** Stockton PD ssenariyli mashq (rol o'ynovchi + darhol debrif), PERF ICAT (Critical Decision-Making Model), VirTra/Axon (branching), UK Hydra (immersiv debrif), Niderlandiya Politieacademie VR, Singapur HTA. Biz **AI + veb** bilan boshlaymiz — planshet brauzerida ishlaydi, jihoz kerak emas; VR — keyingi bosqich.

### Muhim texnik qarorlar
- `src/lib/gemini/client.ts` → `generateJson()` — Gemini JSON mode (`responseSchema` + zod + 1 repair retry).
- `src/lib/storage/training.ts` → `TrainingRepo` (async, localStorage) — Postgres'ga almashtirish nuqtasi. Kalitlar: `h360:profile:v1`, `h360:sessions:v1`, `h360:himoyaId:v1`.
- `src/lib/training/` → `dialogState` (holat matematikasi), `decisionEngine`, `tirEngine` (3D poligon holat mashinasi), `competency` (baholash), `mentor`, `debrief`.
- `src/components/training/tir/` → Three.js sahna (`TirScene`, `Actor` — protsedural personaj, `Environments`); glTF/Mixamo personajlar va lazer qurol (HID) uchun kontrakt tayyor.
- `/api/sim/{dialog,debrief,mahalla-grade,document-check}` — barchasi `no_keys_configured` (500) / `ai_unavailable` (503) / `bad_ai_output` (502) kontraktida.
- Auth yo'q (MVP): lokal profil `role: trainee|instructor`. Har yozuvda `traineeId` bor.

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

> ⚠️ Haqiqiy kalitlar hech qachon gitga qo'shilmaydi (`.env` gitignore'da). Faqat `.env.example` repoda.

## Railway'ga deploy

1. GitHub reponi Railway'ga ulang (deploy-on-push).
2. Railway → **Variables**: `GEMINI_API_KEYS` (bir nechta kalit; yaroqsiz kalit avtomatik o'tkazib yuboriladi), ixtiyoriy `GEMINI_MODEL`, `NEXT_PUBLIC_SITE_URL` (OpenGraph/link preview uchun).
3. Build: `npm run build` · Start: `npm run start` (Railway `$PORT` ni avtomatik bog'laydi). Nixpacks avtomatik aniqlaydi.

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
- Postgres persistensiyasi (hozir `CasesRepo` interfeys orqali localStorage).
- O'zbek tili uchun kuchliroq STT/TTS (hozir brauzer Web Speech API).
- Auth (JWT + RBAC), "Mahalla Yettiligi", "Xavfsiz Shahar" modullari.

---

O'zbekiston Respublikasi Ichki ishlar vazirligi — HIMOYA-360 v2.0 (MVP)
