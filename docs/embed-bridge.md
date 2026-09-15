# HIMOYA-360 внутри планшета E-O'quv — режим `embed` и мост postMessage

Документ для разработчика планшетного приложения (Android, 4G, только браузер/WebView).
Протокол: **версия 1**. Реализация: `src/lib/embed/bridge.ts`, `src/components/layout/EmbedBridge.tsx`.
Живая демо-страница хоста: `https://<host>/embed-demo.html`.

## 1. Как открыть

| Способ | URL / настройка | Что скрывается |
|---|---|---|
| iframe в веб-приложении E-O'quv | `https://<host>/uz?embed=1&origin=https://eoquv.example` | боковое меню, верхняя панель |
| Android WebView | `https://<host>/uz?embed=1` + `addJavascriptInterface(obj, "H360Host")` | то же |
| Прямое открытие (без хоста) | `https://<host>/uz` | ничего (обычный режим) |

* `embed=1` запоминается в `sessionStorage` — внутренние переходы (ссылки, `router.push`) остаются без «хрома». `embed=0` выключает.
* Локаль в пути: `/uz`, `/ru`, `/en`.
* Нужные страницы: `/` (панель), `/simulyator/tir`, `/simulyator/dialog`, `/simulyator/qaror`, `/mashgulotlarim`, `/profil`, `/instruktor`.

## 2. Безопасность (iframe)

Параметры `embed` и `origin` может подставить кто угодно, поэтому доверенный источник один — allow-list на сервере:

```
NEXT_PUBLIC_EMBED_ORIGINS=https://eoquv.iiv.uz,https://tablet.iiv.uz
```

* Входящие `postMessage` принимаются **только** от `window.parent` с origin из списка (или same-origin).
* Исходящие отправляются с явным `targetOrigin` (каждому из списка; браузер доставит только совпадающему). Без списка мост работает только same-origin (демо-страница).
* WebView-путь (`H360Host`) allow-list не требует: интерфейс внедряет само приложение.

## 3. Сообщения HIMOYA-360 → хост

iframe: `window.parent.postMessage(msg, origin)`; WebView: `H360Host.postMessage(JSON.stringify(msg))`.

| `type` | Поля | Когда |
|---|---|---|
| `h360:ready` | `protocol: 1`, `locale`, `authEnabled` | после загрузки и чтения профиля |
| `h360:profile` | `profile: TraineeProfile \| null` | при готовности и при каждом изменении профиля (login/logout/set-profile) |
| `h360:session` | `session: TrainingSession` | каждое сохранение сессии со `status: "completed"` (дебрифинг, подтверждение инструктора присылают её повторно — дедуп по `id` + `updatedAt`); также в ответ на `h360:get-sessions` |
| `h360:himoya-id` | `himoyaId: HimoyaId` | при каждом пересчёте HIMOYA-ID (провизорный после дебрифа, финальный после инструктора — поле `status`) |
| `h360:navigate` | `path` | подтверждение перехода по команде хоста |
| `h360:error` | `code`, `message` | `auth_enabled`, `bad_profile` |

Схемы `TraineeProfile`, `TrainingSession` (`kind`: `dialog` / `decision` / `mahalla` / `document` / `tir`, `scores`, `debrief`), `HimoyaId` — `src/lib/storage/trainingSchema.ts` (zod, это и есть контракт).

## 4. Команды хост → HIMOYA-360

iframe: `frame.contentWindow.postMessage(cmd, "https://<host>")`; WebView: `webView.evaluateJavascript("window.h360.receive(" + json + ")", null)`.

| `type` | Поля | Действие |
|---|---|---|
| `h360:set-profile` | `profile: { badgeId, name, rank?, district?, role? }` | создаёт/обновляет профиль на устройстве, без формы «Профиль». Работает только в локальном режиме; при включённом логине по жетону+PIN (`authEnabled: true`) → `h360:error auth_enabled` |
| `h360:navigate` | `path` (без локали, напр. `/simulyator/tir`) | переход внутри приложения |
| `h360:get-sessions` | — | присылает все сессии текущего профиля по одной (`h360:session`) |
| `h360:logout` | — | сбрасывает профиль устройства / сессию логина |

Все сообщения — JSON-объекты с полем `type`, начинающимся на `h360:`. Неизвестные типы игнорируются.

## 5. Пример (iframe)

```html
<iframe id="h360" src="https://<host>/uz?embed=1&origin=https://eoquv.iiv.uz"></iframe>
<script>
  const H = "https://<host>";
  const f = document.getElementById("h360");
  window.addEventListener("message", (e) => {
    if (e.origin !== H) return;
    const m = e.data;
    if (m.type === "h360:ready") {
      f.contentWindow.postMessage({ type: "h360:set-profile",
        profile: { badgeId: "SH-0473", name: "Muminov J.K.", rank: "leytenant", district: "Yunusobod" } }, H);
      f.contentWindow.postMessage({ type: "h360:navigate", path: "/simulyator/tir" }, H);
    }
    if (m.type === "h360:session") saveToEoquv(m.session);   // ваш бэкенд
    if (m.type === "h360:himoya-id") showBadge(m.himoyaId);
  });
</script>
```

## 6. Пример (Android WebView, Kotlin)

```kotlin
class H360Host(private val web: WebView) {
    @JavascriptInterface fun postMessage(json: String) { /* parse type, save session/himoyaId */ }
    fun send(json: String) = web.post { web.evaluateJavascript("window.h360.receive($json)", null) }
}
web.settings.javaScriptEnabled = true
web.settings.domStorageEnabled = true          // localStorage обязателен (офлайн-хранилище)
web.addJavascriptInterface(H360Host(web), "H360Host")
web.loadUrl("https://<host>/uz?embed=1")
```

## 7. Офлайн и синхронизация

Планшет работает без сети: сессии и HIMOYA-ID лежат в `localStorage` и уходят на сервер HIMOYA-360 (Postgres) при появлении связи. Хосту события приходят сразу при сохранении, независимо от сети. Если хосту нужен полный список после переподключения — `h360:get-sessions`.
