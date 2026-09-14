# TIR — video-pak (real aktyorli ssenariylar), VirTra uslubi

3D sahna — mashg'ulotning asosi. Lekin eng realistik ko'rinish — **haqiqiy aktyorlar bilan suratga olingan video** (VirTra V-300 aynan shunday ishlaydi). HIMOYA-360 bunga tayyor: ssenariyga `video` paketi qo'shilsa, dvigatel shaxs holatiga mos klipni 3D ustidan ko'rsatadi; baholash, jurnal, instruktor buyruqlari, debrif — o'zgarmaydi.

## Fayl tuzilmasi

```
public/video/<scenarioId>/
  poster.jpg
  shouting.mp4        # shaxs baqirmoqda (loop, 8–15 s)
  approaching.mp4     # yaqinlashmoqda (loop)
  weapon_raised.mp4   # qurol ko'tarilgan (loop)
  aiming.mp4          # qurol xodimga qaratilgan (loop)
  lunging.mp4         # tashlanish (3–4 s)
  dropping.mp4        # qurolni tashlamoqda (2–3 s)
  kneeling.mp4        # tiz cho'kdi (loop)
  calm.mp4            # tinchlandi, gaplashmoqda (loop)
  down.mp4            # yerda (loop)
  # mashina: parked / revving / charging / stopped
```

Ssenariyda (`data/scenarios/tir/index.ts`):

```ts
video: {
  poster: "/video/tir-pichoq-hovli/poster.jpg",
  clips: {
    shouting: "/video/tir-pichoq-hovli/shouting.mp4",
    approaching: "/video/tir-pichoq-hovli/approaching.mp4",
    weapon_raised: "/video/tir-pichoq-hovli/weapon_raised.mp4",
    lunging: "/video/tir-pichoq-hovli/lunging.mp4",
    dropping: "/video/tir-pichoq-hovli/dropping.mp4",
    kneeling: "/video/tir-pichoq-hovli/kneeling.mp4",
    calm: "/video/tir-pichoq-hovli/calm.mp4",
    down: "/video/tir-pichoq-hovli/down.mp4",
  },
},
```

Klip bo'lmagan holatlar uchun 3D sahna ko'rinadi — paket bosqichma-bosqich to'ldirilishi mumkin.

## Suratga olish qo'llanmasi (markaz uchun)

- **Kamera:** xodim ko'z balandligida (≈1,6 m), keng burchak (3 ekran uchun ≥ 120°, ideal — 3 kamerali rig yoki 180° kamera), statik. Aktyor kadr markazida, xodim tomon qarab.
- **Joy:** haqiqiy hovli / bekat / bino vestibyuli (Toshkent). Har ssenariy uchun bitta joy, hamma kliplar bir xil kamera pozitsiyasidan.
- **Aktyorlar:** IIO xodimlari yoki o'quv markaz aktyorlari. Qurollar — muqoya (rekvizit). Olomon ssenariysida 5–8 statist, garovdagi — alohida aktyor.
- **Har holat uchun alohida klip**, boshi va oxiri bir xil pozadan (loop uchun). Davomiylik: loop kliplar 8–15 s, o'tish kliplar 2–4 s.
- **Ovoz:** kamera mikrofoni + aktyor gapi. Dvigatel subtitr ko'rsatadi; TTS o'chiriladi (video ovozi bor).
- **Format:** MP4 (H.264), 1920×1080 yoki 3840×1080 (3 ekran), 30 fps, ≤ 25 Mbit/s. Fayl nomlari — yuqoridagi holat nomlari.
- **Nishon zonalari:** video ustidan bosilganda hozircha 3D dagi ko'rinmas personaj koordinatasi ishlatiladi; keyingi bosqichda klipga zona-maskasi (JSON: vaqt → to'rtburchaklar) qo'shiladi.

## Yo'l xaritasi
1. Bitta ssenariy (TIR-04 hovli) uchun to'liq paket → sinov.
2. 3 shablon (mashina, olomon, bino) paketlari.
3. Zona-maskasi + lazer qurol (HID) — to'liq VirTra ekvivalenti.
