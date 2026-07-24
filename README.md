# 🚔 Mening Inspektorim — AI Digital Inspector

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

> ⚠️ Haqiqiy kalitlar hech qachon gitga qo'shilmaydi (`.env` gitignore'da). Faqat `.env.example` repoda.

## Railway'ga deploy

1. GitHub reponi Railway'ga ulang (deploy-on-push).
2. Railway → **Variables**: `GEMINI_API_KEYS` (bir nechta kalit), ixtiyoriy `GEMINI_MODEL`.
3. Build: `npm run build` · Start: `npm run start` (Railway `$PORT` ni avtomatik bog'laydi). Nixpacks avtomatik aniqlaydi.

## Arxitektura

```
prompts/system-prompt.uz.ts   # PROMPT.txt → Gemini system instruction (6-bo'limli format)
data/sops/                    # SOP ma'lumot modeli (hodisa turlari, bosqichlar, checklist, qonunlar)
src/lib/gemini/keyPool.ts     # random key rotatsiya + failover
src/lib/gemini/client.ts      # streamChat() — Gemini streaming
src/app/api/chat|legal        # streaming route handler (nodejs runtime)
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

O'zbekiston Respublikasi Ichki ishlar vazirligi — MVP 1.0
