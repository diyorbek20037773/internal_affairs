import type { HimoyaId, TraineeProfile, TrainingSession } from "@/lib/storage/trainingSchema";

/**
 * E-O'quv embed bridge. O'quv klasteri runs inside the tablet app either as an
 * <iframe> (messages go to `window.parent`) or an Android WebView with a
 * `@JavascriptInterface` object named `H360Host` (messages go to
 * `H360Host.postMessage(json)`). The page announces itself, receives the
 * officer profile from the host and reports every completed session and
 * Klaster-ID change back. Protocol: docs/embed-bridge.md.
 *
 * Embed mode is on when the URL has `?embed=1` (remembered in sessionStorage
 * for in-app navigation) or when `H360Host` is present.
 */

export const EMBED_PROTOCOL = 1;
export const EMBED_KEY = "h360:embed";
const ORIGIN_KEY = "h360:embed-origin";

/* ---------- outbound ---------- */

export type HostMessage =
  | { type: "h360:ready"; protocol: number; locale: string; authEnabled: boolean }
  | { type: "h360:profile"; profile: TraineeProfile | null }
  | { type: "h360:session"; session: TrainingSession }
  | { type: "h360:himoya-id"; himoyaId: HimoyaId }
  | { type: "h360:navigate"; path: string }
  | { type: "h360:error"; code: string; message: string };

/* ---------- inbound ---------- */

export type HostCommand =
  | { type: "h360:set-profile"; profile: { badgeId: string; name: string; rank?: string; district?: string; role?: "trainee" | "instructor" } }
  | { type: "h360:navigate"; path: string }
  | { type: "h360:get-sessions" }
  | { type: "h360:logout" };

type Win = Window & { H360Host?: { postMessage(json: string): void }; h360?: { receive(json: string | object): void } };

export function isEmbedded(): boolean {
  if (typeof window === "undefined") return false;
  if ((window as Win).H360Host) return true;
  try {
    return document.documentElement.dataset.embed === "1" || sessionStorage.getItem(EMBED_KEY) === "1";
  } catch {
    return document.documentElement.dataset.embed === "1";
  }
}

/**
 * Host origins allowed to talk to us over the iframe path. `?origin=` and
 * `?embed=1` can be set by anyone who frames the site, so the only trusted
 * source is the build-time allow-list. Same-origin (our own demo page) is
 * always allowed. The WebView path (`H360Host`) needs no list: the native
 * app that injected the interface is the host by definition.
 */
export function allowedOrigins(): string[] {
  const env = (process.env.NEXT_PUBLIC_EMBED_ORIGINS ?? "").split(/[,\s]+/).filter(Boolean);
  return typeof window === "undefined" ? env : [...env, window.location.origin];
}

/** Origin the host page gave us (`?origin=`), only if it is on the allow-list. */
function targetOrigins(): string[] {
  const list = allowedOrigins();
  try {
    const o = sessionStorage.getItem(ORIGIN_KEY);
    if (o && list.includes(o)) return [o];
  } catch {}
  return list;
}

let warnedNoList = false;
export function embedPost(msg: HostMessage): void {
  if (typeof window === "undefined" || !isEmbedded()) return;
  const w = window as Win;
  try {
    if (w.H360Host) {
      w.H360Host.postMessage(JSON.stringify(msg));
    } else if (window.parent && window.parent !== window) {
      // One postMessage per allowed origin: the browser delivers only the one that matches the parent.
      const targets = targetOrigins();
      if (targets.length <= 1 && !warnedNoList) {
        warnedNoList = true;
        console.warn("[embed] NEXT_PUBLIC_EMBED_ORIGINS is empty — iframe bridge only talks to same-origin hosts");
      }
      for (const t of targets) window.parent.postMessage(msg, t);
    }
  } catch (e) {
    console.warn("[embed] post failed", e);
  }
}

/* ---------- inbound wiring ---------- */

type Handler = (cmd: HostCommand) => void | Promise<void>;
const handlers = new Set<Handler>();
let installed = false;

function allowedOrigin(origin: string): boolean {
  return allowedOrigins().includes(origin);
}

function dispatch(raw: unknown) {
  let cmd: HostCommand | null = null;
  try {
    cmd = (typeof raw === "string" ? JSON.parse(raw) : raw) as HostCommand;
  } catch {
    return;
  }
  if (!cmd || typeof cmd !== "object" || typeof cmd.type !== "string" || !cmd.type.startsWith("h360:")) return;
  handlers.forEach((h) => void h(cmd!));
}

/** Idempotent: installs the message listener + `window.h360.receive` for WebViews. */
export function installEmbedReceiver(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("message", (e) => {
    if (!isEmbedded()) return;
    if (e.source !== window.parent) return;
    if (!allowedOrigin(e.origin)) return;
    dispatch(e.data);
  });
  (window as Win).h360 = { receive: dispatch };
}

export function onHostCommand(h: Handler): () => void {
  handlers.add(h);
  return () => handlers.delete(h);
}

/**
 * Inline script for <head>: marks the document as embedded before hydration
 * so the shell chrome never flashes. Also remembers `?origin=` for postMessage.
 */
export const EMBED_BOOT_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search);var e=q.get("embed");var s=sessionStorage;if(e==="1"||e==="true"){s.setItem("${EMBED_KEY}","1");var o=q.get("origin");if(o)s.setItem("${ORIGIN_KEY}",o);}else if(e==="0"){s.removeItem("${EMBED_KEY}");}if(s.getItem("${EMBED_KEY}")==="1"||window.H360Host){document.documentElement.dataset.embed="1";}}catch(x){if(window.H360Host)document.documentElement.dataset.embed="1";}})();`;
