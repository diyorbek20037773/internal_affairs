"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight, Crosshair, Maximize2, Mic, MonitorPlay, Radio, Shield, ShieldOff, Zap, MoveLeft, Volume2, VolumeX,
  Play, MessageCircle, AlertTriangle, CheckCircle2, Timer, Trophy, Pause, Square, Flame, ExternalLink, ChevronDown, ChevronUp,
  RotateCcw, Gamepad2, MousePointer2, Heart, Skull, Usb, Glasses,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSessionBootstrap } from "@/hooks/useSessionBootstrap";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { useSpeech } from "@/hooks/useSpeech";
import { newTirSession, touch } from "@/lib/training/sessionFactory";
import { trainingRepo } from "@/lib/storage/training";
import {
  ACTOR_TEXT, applyAction, applyInstructor, classifyTalk, hitFactor, initTir, outcomeSummary, primarySuspect, setOfficer, tick,
  TIR_PRESET_PHRASES, type InstructorCmd, type TirState,
} from "@/lib/training/tirEngine";
import { PISTOL } from "@/lib/training/weaponConfig";
import { localized } from "@/data/sops/types";
import type { TirAction, TirHitZone, TirScenario } from "@/data/scenarios/types";
import type { TrainingSession } from "@/lib/storage/trainingSchema";
import { ProfileGate } from "../profile/ProfileGate";
import { TirVideoLayer } from "./TirVideoLayer";
import { AssetLoading } from "./AssetLoading";
import { sfx } from "./tirAudio";
import { initialPlayer, type PlayerState, type TirGameState } from "./player/playerTypes";
import type { FpsProps, TirRunFlags } from "./TirScene";
import { detectQuality } from "./quality";
import { InputDevicesPanel } from "./InputDevicesPanel";
import { inputHub, onTirInput } from "@/lib/tir/input";
import { shockHub } from "@/lib/tir/shock";
import { openStationLink, type StationLink } from "@/lib/tir/stationLink";
import { XR_EVENT, XR_STATE_EVENT, xrSupported, type XrCmd } from "./xr/XrRig";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TirSceneInner = dynamic(() => import("./TirScene").then((m) => m.TirScene), { ssr: false });

/** WebGL / asset crash inside the range must not take the whole trainer page down. */
class SceneBoundary extends Component<{ children: React.ReactNode; label: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    console.error("[h360] TIR scene crashed", e);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex h-full w-full items-center justify-center bg-black p-6 text-center text-sm text-white/80">{this.props.label}</div>
    );
  }
}
const TirScene: typeof TirSceneInner = (props) => {
  const t = useTranslations("sim.tir");
  return (
    <SceneBoundary label={t("sceneError")}>
      <TirSceneInner {...props} />
    </SceneBoundary>
  );
};

const TICK_MS = 100;
type ControlMode = "fps" | "fixed";
const isTouch = () => typeof window !== "undefined" && (navigator.maxTouchPoints > 0 || /Android|iPhone|iPad/i.test(navigator.userAgent));
export { tirChannelName } from "@/lib/tir/stationLink";

export function TirClient({
  scenario,
  sessionId,
  exam,
}: {
  scenario: TirScenario;
  sessionId?: string;
  exam?: { examId: string; examStageIndex: number };
}) {
  const create = useCallback(
    (traineeId: string, ex?: { examId: string; examStageIndex: number }) => newTirSession(scenario, { traineeId, ...ex }),
    [scenario]
  );
  const { session, ready, needsProfile } = useSessionBootstrap({ scenarioId: scenario.id, sessionId, create, exam });
  if (needsProfile) return <ProfileGate />;
  if (!ready || !session) return null;
  return <TirRunner scenario={scenario} initial={session} />;
}

function TirRunner({ scenario, initial }: { scenario: TirScenario; initial: TrainingSession }) {
  const t = useTranslations("sim.tir");
  const tdlg = useTranslations("sim.dialog");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const speech = useSpeech({ locale });

  const [session, setSession] = useState(initial);
  const [state, setState] = useState<TirState>(() => initTir(scenario));
  const [started, setStarted] = useState(false);
  const [wide, setWide] = useState(false);
  const [voice, setVoice] = useState(true);
  const [quality, setQuality] = useState<"high" | "low">(() => {
    if (typeof window === "undefined") return "high";
    const q = new URLSearchParams(window.location.search).get("quality");
    if (q === "low" || q === "high") return q;
    return detectQuality();
  });
  const [fpsMeter, setFpsMeter] = useState(0);
  const [controls, setControls] = useState<ControlMode>(() => {
    if (typeof window === "undefined") return "fixed";
    const q = new URLSearchParams(window.location.search).get("controls");
    if (q === "fps" || q === "fixed") return q;
    return isTouch() ? "fixed" : "fps";
  });
  const [locked, setLocked] = useState(false);
  // ?lock=0 — no pointer capture (embedded/kiosk/E2E): keyboard moves, clicks fire from the centre.
  const [lockFailed, setLockFailed] = useState<boolean>(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("lock") === "0");
  const [shotSeq, setShotSeq] = useState(0);
  const [hitMark, setHitMark] = useState(false);
  const [hurtFx, setHurtFx] = useState(false);
  const playerRef = useRef<PlayerState>(initialPlayer());
  const [flash, setFlash] = useState(false);
  const [shockFx, setShockFx] = useState(false);
  const [allStop, setAllStop] = useState(false);
  const [instructorOpen, setInstructorOpen] = useState(false);
  const { isInstructor } = useTraineeProfile();
  const touchDevice = useMemo(() => isTouch(), []);
  const [devicesOpen, setDevicesOpen] = useState(false);
  // WebXR: VR button only when a headset runtime is present; state mirrors the session.
  const [xrOk, setXrOk] = useState(false);
  const [xrOn, setXrOn] = useState(false);
  useEffect(() => {
    void xrSupported().then(setXrOk);
    const onState = (e: Event) => {
      const d = (e as CustomEvent<{ presenting: boolean; error?: string }>).detail;
      setXrOn(d.presenting);
      if (d.error) toast.error(`VR: ${d.error}`);
    };
    window.addEventListener(XR_STATE_EVENT, onState);
    return () => window.removeEventListener(XR_STATE_EVENT, onState);
  }, []);
  const xrCmd = (cmd: XrCmd["cmd"]) => window.dispatchEvent(new CustomEvent<XrCmd>(XR_EVENT, { detail: { cmd } }));
  const [talkText, setTalkText] = useState("");
  const [lastFeedback, setLastFeedback] = useState<{ text: string; L: number; P: number } | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  // Flags the 3D scene reads per frame (never re-renders the Canvas tree).
  const flagsRef = useRef<TirRunFlags>({ started: false, locked: false, lockFailed: false, shotSeq: 0 });
  const controlsRef = useRef<ControlMode>("fixed");
  const officerRef = useRef({ x: 0, z: 0, crouch: false });
  const wrapRef = useRef<HTMLDivElement>(null);
  const spokenSeq = useRef(-1);
  const shockSeen = useRef(0);
  const savedOutcome = useRef(false);
  const channel = useRef<StationLink | null>(null);

  // Debug/telemetry hook for E2E and the instructor station (read-only).
  useEffect(() => {
    (window as unknown as { __h360tir?: unknown }).__h360tir = { officer: state.officer, health: state.health, ammo: state.ammo, shots: state.shotsFired, hits: state.hits, outcome: state.outcome, locked, controls, t: state.t };
  }, [state, locked, controls]);

  // Instructor station link: BroadcastChannel (same browser) + server relay (another tablet/PC).
  useEffect(() => {
    const link = openStationLink({
      sessionId: session.id,
      role: "range",
      scenarioId: scenario.id,
      traineeId: session.traineeId,
      onMessage: (msg) => {
        if (msg.type === "cmd") setState((cur) => applyInstructor(cur, scenario, msg.cmd as InstructorCmd));
        if (msg.type === "hello") link.send({ type: "state", state: stateRef.current, scenarioId: scenario.id, started: startedRef.current });
      },
    });
    channel.current = link;
    return () => { link.close(); channel.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id, scenario]);
  const startedRef = useRef(false);
  startedRef.current = started;
  useEffect(() => {
    channel.current?.send({ type: "state", state, scenarioId: scenario.id, started });
  }, [state, started, scenario.id]);

  // Engine loop — wall-clock driven so slow renderers (tablets, CPU GL) don't
  // slow the scenario down: catch up in fixed 100 ms sub-steps, capped at 1 s.
  useEffect(() => {
    if (!started || state.outcome) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const elapsed = Math.min(1000, now - last);
      const steps = Math.floor(elapsed / TICK_MS);
      last = now - (elapsed - steps * TICK_MS); // carry the remainder
      if (steps === 0) return;
      // Functional update so a concurrent officer-position update is never overwritten.
      setState((cur) => {
        const o = officerRef.current;
        let s = controlsRef.current === "fps" ? setOfficer(cur, scenario, o.x, o.z, o.crouch) : cur;
        for (let i = 0; i < steps && !s.outcome; i++) s = tick(s, scenario, TICK_MS / 1000);
        return s;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [started, state.outcome, scenario]);

  // Actor voice.
  useEffect(() => {
    if (!voice || !started || !state.currentLine || state.lineSeq === spokenSeq.current) return;
    spokenSeq.current = state.lineSeq;
    void speech.speak(state.currentLine.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.lineSeq, voice, started]);

  // Shock feedback (belt stimulus stand-in): red vignette, buzz, vibration, custom event for real hardware.
  useEffect(() => {
    if (state.shockSeq === shockSeen.current) return;
    shockSeen.current = state.shockSeq;
    setShockFx(true);
    window.setTimeout(() => setShockFx(false), 700);
    try { navigator.vibrate?.([200, 80, 300]); } catch {}
    buzz(70, 0.6);
    sfx.hurt();
    setHurtFx(true);
    window.setTimeout(() => setHurtFx(false), 450);
    window.dispatchEvent(new CustomEvent("h360:shock", { detail: { sessionId: session.id, t: state.t } }));
  }, [state.shockSeq, state.t, session.id]);

  // Enemy gunfire audio (actor "o'q uzdi" events).
  const seenEvents = useRef(0);
  useEffect(() => {
    const evs = state.events;
    for (let i = seenEvents.current; i < evs.length; i++) {
      const e = evs[i];
      if (started && (e.kind === "actor" || e.kind === "shock") && /o'q uzdi/.test(e.text)) sfx.enemyShot();
    }
    seenEvents.current = evs.length;
  }, [state.events, started]);

  // Mic → talk.
  useEffect(() => {
    if (!speech.listening && speech.transcript) {
      const text = speech.transcript;
      speech.setTranscript("");
      doTalk(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.listening, speech.transcript]);

  // Leaving mid-scenario (back button, tab closed) → the session is not left "in progress" forever.
  const sessionRef = useRef(session);
  sessionRef.current = session;
  useEffect(() => {
    const finish = () => {
      const s = sessionRef.current;
      if (s.status !== "in_progress") return;
      const st = stateRef.current;
      if (!startedRef.current || st.outcome) return;
      void trainingRepo.saveSession(touch(s, { status: "abandoned", endedAt: new Date().toISOString(), payload: { kind: "tir", events: st.events, outcome: undefined, elapsedSec: st.t, shotsFired: st.shotsFired, hits: st.hits, officerHits: st.officerHits, score: st.score, hitFactor: hitFactor(st) } }));
    };
    window.addEventListener("pagehide", finish);
    return () => { window.removeEventListener("pagehide", finish); finish(); };
  }, []);

  // Outcome → ALL STOP → persist.
  useEffect(() => {
    if (!state.outcome || savedOutcome.current) return;
    savedOutcome.current = true;
    setAllStop(true);
    window.setTimeout(() => setAllStop(false), 2600);
    const done = touch(session, {
      status: "completed",
      endedAt: new Date().toISOString(),
      payload: {
        kind: "tir", events: state.events, outcome: state.outcome, elapsedSec: state.t, shotsFired: state.shotsFired, hits: state.hits,
        officerHits: state.officerHits, score: state.score, hitFactor: hitFactor(state),
      },
    });
    setSession(done);
    void trainingRepo.saveSession(done);
    speech.stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.outcome]);

  const act = useCallback(
    (action: TirAction, detail?: { hit?: TirHitZone; actorId?: string; phrase?: string }) => {
      const o = officerRef.current;
      const cur = controlsRef.current === "fps" ? setOfficer(stateRef.current, scenario, o.x, o.z, o.crouch) : stateRef.current;
      if (!started || cur.outcome || cur.paused) return;
      const r = applyAction(cur, scenario, action, detail);
      if (r.state !== cur) setState(r.state);
      if (r.text) setLastFeedback({ text: r.text, L: r.legality, P: r.proportionality });
      return r;
    },
    [started, scenario]
  );

  const doTalk = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    act(classifyTalk(trimmed), { phrase: trimmed });
    setTalkText("");
  };

  const onShoot = (actorId: string | null, zone: TirHitZone) => {
    const cur = stateRef.current;
    if (!cur.weaponDrawn || cur.ammo.reloadLeft > 0) return;
    if (cur.ammo.mag <= 0) { sfx.dry(); setLastFeedback({ text: "Magazin bo'sh — R (qayta zaryad)", L: 3, P: 3 }); return; }
    setFlash(true);
    window.setTimeout(() => setFlash(false), 70);
    setShotSeq((n) => n + 1);
    sfx.shot();
    const r = act("shoot", { hit: zone, actorId: actorId ?? undefined });
    if (r && r.state.hits > cur.hits) {
      sfx.hit();
      setHitMark(true);
      window.setTimeout(() => setHitMark(false), 140);
    }
  };

  const doReload = () => {
    const cur = stateRef.current;
    if (cur.ammo.reloadLeft > 0 || cur.ammo.reserve <= 0 || cur.ammo.mag >= PISTOL.magazine) return;
    sfx.reload();
    act("reload");
  };

  const doDraw = () => { const r = act("draw"); if (r && r.state !== stateRef.current) sfx.draw(); };

  // FPS bridge (all callbacks stable; hot data lives in refs).
  const fpsMove = useCallback((x: number, z: number, crouch: boolean) => {
    officerRef.current = { x, z, crouch }; // the 10 Hz tick stamps it into the engine — no extra React render
  }, []);
  const onFpsSample = useCallback((v: number) => setFpsMeter(v), []);
  const fpsLock = useCallback((v: boolean) => setLocked(v), []);
  const fpsLockError = useCallback(() => setLockFailed(true), []);
  const fpsStep = useCallback((sprint: boolean) => sfx.step(sprint), []);
  const fpsDry = useCallback(() => { sfx.dry(); setLastFeedback({ text: "Magazin bo'sh — R (qayta zaryad)", L: 3, P: 3 }); }, []);

  const restart = () => {
    speech.stopSpeaking();
    savedOutcome.current = false;
    spokenSeq.current = -1;
    shockSeen.current = 0;
    playerRef.current = initialPlayer();
    officerRef.current = { x: 0, z: 0, crouch: false };
    seenEvents.current = 0;
    setLastFeedback(null);
    setAllStop(false);
    setStarted(false);
    setState(initTir(scenario));
    setSession(newTirSession(scenario, { traineeId: session.traineeId, examId: session.examId, examStageIndex: session.examStageIndex }));
  };

  const instructor = (cmd: InstructorCmd) => setState((cur) => applyInstructor(cur, scenario, cmd));
  const instructorRef = useRef(instructor);
  instructorRef.current = instructor;

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen().catch(() => undefined);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const k = e.key.toLowerCase();
      const idx = Number(e.key) - 1;
      const fpsMode = controlsRef.current === "fps";
      if (idx >= 0 && idx < TIR_PRESET_PHRASES.length) act(TIR_PRESET_PHRASES[idx].action, { phrase: TIR_PRESET_PHRASES[idx].uz });
      else if (k === "f") { const r = act("draw"); if (r && r.text) sfx.draw(); }
      else if (k === "h") act("holster");
      else if (k === "t") { const r = act("taser"); if (r && r.text) sfx.taser(); }
      else if (k === "b") act("backup");
      else if (k === "r") { const cur = stateRef.current; if (cur.ammo.reloadLeft === 0 && cur.ammo.reserve > 0 && cur.ammo.mag < PISTOL.magazine) sfx.reload(); act("reload"); }
      else if (k === "x" && !fpsMode) act("retreat");
      else if (k === "q" && !fpsMode) act("cover");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [act]);

  // External devices (laser pistol / gamepad): "fire" is handled inside the scene (hit-scan);
  // the rest map onto the same actions as the keyboard.
  useEffect(() => {
    inputHub.start();
    shockHub.start();
    const off = onTirInput(({ action }) => {
      const cur = stateRef.current;
      switch (action) {
        case "reload": if (cur.ammo.reloadLeft === 0 && cur.ammo.reserve > 0 && cur.ammo.mag < PISTOL.magazine) sfx.reload(); act("reload"); break;
        case "draw": { const r = act("draw"); if (r && r.text) sfx.draw(); break; }
        case "holster": act("holster"); break;
        case "taser": { const r = act("taser"); if (r && r.text) sfx.taser(); break; }
        case "backup": act("backup"); break;
        case "cover": if (controlsRef.current !== "fps") act("cover"); break;
        case "retreat": if (controlsRef.current !== "fps") act("retreat"); break;
        case "pause": instructorRef.current({ cmd: stateRef.current.paused ? "resume" : "pause" }); break;
      }
    });
    return () => { off(); inputHub.stop(); shockHub.stop(); };
  }, [act]);

  controlsRef.current = controls;
  const outcome = state.outcome ? outcomeSummary(state.outcome) : null;
  const fpsMode = controls === "fps";
  const playing = started && !state.outcome && !state.paused;
  const gameState: TirGameState = !started ? "MENU" : state.paused ? "PAUSED" : !state.outcome ? "PLAYING"
    : state.outcome === "officer_down" || state.outcome === "officer_injured" ? "PLAYER_DEAD"
    : outcome?.tone === "good" ? "ROUND_WON" : "ROUND_LOST";
  const reloading = state.ammo.reloadLeft > 0;
  flagsRef.current = { started, locked, lockFailed, shotSeq };
  const fpsProps = useMemo<FpsProps>(() => ({
    weapon: PISTOL,
    playerRef,
    onMove: fpsMove,
    onLockChange: fpsLock,
    onLockError: fpsLockError,
    onStep: fpsStep,
    onDryFire: fpsDry,
  }), [fpsMove, fpsLock, fpsLockError, fpsStep, fpsDry]);
  const remaining = Math.max(0, Math.ceil(scenario.rules.durationSec - state.t));
  const primary = primarySuspect(state);
  const shots = state.events.filter((e) => e.kind === "action" && e.action === "shoot");
  const hf = hitFactor(state);
  const marks = scenario.mode === "marksmanship";
  const rangeTime = state.firstShotAt != null ? (state.lastShotAt ?? state.t) - state.firstShotAt : 0;

  return (
    <div className="space-y-3">
      <div
        ref={wrapRef}
        className={cn("relative w-full overflow-hidden rounded-xl border bg-black shadow-elevated", wide ? "aspect-[48/9]" : "aspect-video")}
      >
        <TirScene scenario={scenario} stateRef={stateRef} flagsRef={flagsRef} wide={wide} onShoot={onShoot} quality={quality} controls={controls} fps={fpsMode ? fpsProps : undefined} onFps={onFpsSample} />
        <TirVideoLayer scenario={scenario} state={primarySuspect(state)?.state} muted={!voice} />
        <AssetLoading />

        {/* muzzle flash / shock vignette */}
        <div className={cn("pointer-events-none absolute inset-0 bg-white transition-opacity", flash ? "opacity-60" : "opacity-0")} />
        <div className={cn("pointer-events-none absolute inset-0 transition-opacity duration-300", shockFx ? "opacity-100" : "opacity-0")} style={{ background: "radial-gradient(ellipse at center, rgba(220,38,38,0) 40%, rgba(220,38,38,0.85) 100%)" }} />
        {shockFx && (
          <div className="pointer-events-none absolute inset-x-0 top-1/3 flex justify-center">
            <p className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-lg font-black uppercase tracking-wider text-white shadow-lg animate-pulse">
              <Zap className="h-6 w-6" /> {t("shock")}
            </p>
          </div>
        )}

        <div className={cn("pointer-events-none absolute inset-0 transition-opacity duration-200", hurtFx ? "opacity-100" : "opacity-0")} style={{ background: "radial-gradient(ellipse at center, rgba(220,38,38,0) 55%, rgba(220,38,38,0.55) 100%)" }} />
        {state.weaponDrawn && !state.outcome && !fpsMode && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80">
            <Crosshair className="h-10 w-10 drop-shadow" />
          </div>
        )}
        {fpsMode && playing && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
            {state.weaponDrawn ? (
              <div className={cn("relative h-8 w-8 transition-transform", hitMark ? "scale-125" : "scale-100")}>
                <span className="absolute left-1/2 top-0 h-2.5 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_2px_#000]" />
                <span className="absolute bottom-0 left-1/2 h-2.5 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_2px_#000]" />
                <span className="absolute left-0 top-1/2 h-0.5 w-2.5 -translate-y-1/2 bg-white shadow-[0_0_2px_#000]" />
                <span className="absolute right-0 top-1/2 h-0.5 w-2.5 -translate-y-1/2 bg-white shadow-[0_0_2px_#000]" />
                {hitMark && (
                  <>
                    <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-destructive" />
                    <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-destructive" />
                  </>
                )}
              </div>
            ) : (
              <span className="block h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_2px_#000]" />
            )}
          </div>
        )}
        {fpsMode && playing && !locked && !lockFailed && (
          <div className="pointer-events-none absolute inset-x-0 top-[58%] flex justify-center px-4">
            <p className="rounded-lg bg-black/70 px-4 py-2 text-center text-sm text-white backdrop-blur">
              <MousePointer2 className="mr-1 inline h-4 w-4" /> {t("controls.lockHint")}
              <span className="mt-1 block font-mono text-[11px] text-white/70">{t("controls.keys")}</span>
            </p>
          </div>
        )}

        {/* V-300 HUD: left shot list, center score, right status */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 text-white">
          <div className="w-44 rounded-lg bg-black/60 p-2 text-[11px] backdrop-blur">
            <div className="mb-1 flex items-center justify-between border-b border-white/15 pb-1 font-semibold">
              <span className="flex items-center gap-1"><Timer className="h-3 w-3 text-success" /> {t("shots")}</span>
              <span className="font-mono">{state.shotsFired}</span>
            </div>
            <ol className="max-h-28 space-y-0.5 overflow-hidden font-mono">
              {shots.slice(-7).map((e, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-white/60">#{shots.length - Math.min(7, shots.length) + i + 1}</span>
                  <span>{e.split != null ? `${e.split.toFixed(2)}s` : "—"}</span>
                  <span className={e.hit === "miss" ? "text-destructive" : "text-success"}>{e.hit === "miss" ? "MISS" : "HIT"}</span>
                </li>
              ))}
              {shots.length === 0 && <li className="text-white/40">—</li>}
            </ol>
            <div className="mt-1 flex justify-between border-t border-white/15 pt-1">
              <span>{t("hits")}</span><span className="font-mono">{state.hits}/{state.shotsFired}</span>
            </div>
          </div>

          <div className="rounded-lg bg-black/60 px-4 py-2 text-center backdrop-blur">
            <p className="text-[10px] uppercase tracking-wider text-white/60">{scenario.code} · {localized(scenario.title, locale)}</p>
            <p className="mt-0.5 font-mono text-sm">
              <span className="text-white/70">Score:</span> <b>{marks ? state.score : Math.max(0, state.hits - (state.officerHits ?? 0))}</b>
              <span className="mx-2 text-white/30">|</span>
              <span className="text-white/70">Hit Factor:</span> <b>{hf.toFixed(3)}</b>
            </p>
            <p className="mt-0.5 font-mono text-xs text-white/70">
              {marks ? <>{t("time")}: <b className="text-white">{rangeTime.toFixed(2)}s</b></> : <>{t("time")}: <b className="text-white">{remaining}s</b> · {t("distance")}: <b className="text-white">{primary ? Math.hypot(primary.x, primary.z).toFixed(1) : "—"} m</b></>}
              {state.backupCalled && <> · {t("backup")}: <b className="text-white">{state.backupArrived ? "✓" : `${Math.ceil(state.backupEta ?? 0)}s`}</b></>}
            </p>
          </div>

          <div className="flex w-44 flex-col items-end gap-1">
            {primary && !marks && (
              <Badge variant={["lunging", "charging", "aiming", "weapon_raised"].includes(primary.state) ? "destructive" : ["kneeling", "calm", "hands_up", "stopped"].includes(primary.state) ? "success" : "secondary"} className="max-w-full truncate">
                {primary.name}: {ACTOR_TEXT[primary.state] ?? primary.state}
              </Badge>
            )}
            <div className="flex flex-wrap justify-end gap-1">
              <Badge variant="outline" className="border-white/30 text-white">{state.weaponDrawn ? t("armed") : t("holstered")}</Badge>
              {!marks && <Badge variant="outline" className={cn("border-white/30 font-mono", state.health <= 40 ? "text-destructive" : "text-white")}><Heart className="mr-1 h-3 w-3" />{state.health}</Badge>}
              {state.inCover && <Badge variant="outline" className="border-white/30 text-white">{t("cover")}</Badge>}
              {state.officerHits > 0 && <Badge variant="destructive"><Zap className="mr-1 h-3 w-3" />{state.officerHits}</Badge>}
              {state.paused && <Badge variant="accent">{t("paused")}</Badge>}
            </div>
          </div>
        </div>

        {started && state.currentLine && !state.outcome && !marks && (
          <div className="pointer-events-none absolute inset-x-0 bottom-14 flex justify-center px-4">
            <p className="max-w-3xl rounded-lg bg-black/65 px-4 py-2 text-center text-base font-medium text-white backdrop-blur md:text-lg">
              <span className="text-accent">{state.actors.find((a) => a.id === state.currentLine?.actorId)?.name ?? ""}:</span> {state.currentLine.text}
            </p>
          </div>
        )}
        {lastFeedback && !state.outcome && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-4">
            <p className={cn("rounded-md px-3 py-1 text-xs font-medium backdrop-blur", lastFeedback.L >= 3 && lastFeedback.P >= 3 ? "bg-success/80 text-white" : lastFeedback.L <= 1 || lastFeedback.P <= 1 ? "bg-destructive/85 text-white" : "bg-accent/85 text-white")}>
              {lastFeedback.text}
            </p>
          </div>
        )}

        {started && !state.outcome && (
          <div className="pointer-events-none absolute bottom-3 left-3 flex items-end gap-3 text-white">
            {!marks && (
              <div className="w-36 rounded-lg bg-black/60 p-2 backdrop-blur">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-white/70"><span>{t("controls.health")}</span><span className="font-mono text-white">{state.health}</span></div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-white/15">
                  <div className={cn("h-full transition-all", state.health > 60 ? "bg-success" : state.health > 30 ? "bg-accent" : "bg-destructive")} style={{ width: `${state.health}%` }} />
                </div>
              </div>
            )}
            <div className="rounded-lg bg-black/60 px-3 py-2 backdrop-blur">
              <p className="text-[10px] uppercase tracking-wider text-white/70">{PISTOL.name}</p>
              <p className="font-mono text-lg leading-tight">
                <b className={cn(state.ammo.mag === 0 && "text-destructive")}>{state.ammo.mag}</b> <span className="text-white/50">/ {state.ammo.reserve}</span>
                {reloading && <span className="ml-2 animate-pulse text-xs text-accent">{t("controls.reloading")}</span>}
              </p>
            </div>
          </div>
        )}


        {!started && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-white">
            <div className="max-w-xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{t("briefing")}</p>
              <p className="mt-2 text-lg leading-relaxed">{localized(scenario.briefing, locale)}</p>
              <p className="mt-3 text-sm text-white/70">{touchDevice ? (marks ? t("hintRangeTouch") : t("hintTouch")) : marks ? t("hintRange") : t("hint")}</p>
              {fpsMode && <p className="mt-2 font-mono text-xs text-accent">{t("controls.keys")}</p>}
              <Button size="xl" className="mt-6" onClick={() => setStarted(true)}><Play className="h-5 w-5" /> {t("start")}</Button>
            </div>
          </div>
        )}

        {/* ALL STOP banner (VirTra) */}
        {allStop && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b1a3a]/90 text-white">
            <div className="rounded-xl border-2 border-destructive/70 bg-black/70 px-10 py-6 text-center shadow-2xl">
              <p className="text-2xl font-black tracking-widest text-destructive md:text-4xl">ALL STOP! ALL STOP!</p>
              <p className="mt-1 text-lg font-bold uppercase tracking-wider md:text-2xl">{t("scenarioComplete")}</p>
              <p className="mt-2 text-xs text-white/60">{t("allStopHint")}</p>
            </div>
          </div>
        )}

        {outcome && !allStop && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/75 p-6 text-white">
            <div className="max-w-xl text-center">
              {gameState === "PLAYER_DEAD" ? <Skull className="mx-auto h-12 w-12 text-destructive" /> : outcome.tone === "good" ? <CheckCircle2 className="mx-auto h-12 w-12 text-success" /> : <AlertTriangle className={cn("mx-auto h-12 w-12", outcome.tone === "bad" ? "text-destructive" : "text-accent")} />}
              <p className={cn("mt-2 text-xs font-black uppercase tracking-[0.3em]", gameState === "ROUND_WON" ? "text-success" : "text-destructive")}>
                {gameState === "PLAYER_DEAD" ? t("controls.dead") : gameState === "ROUND_WON" ? t("controls.won") : t("controls.lost")}
              </p>
              <p className="mt-2 text-xl font-bold">{outcome.uz}</p>
              <p className="mt-2 font-mono text-sm text-white/70">
                {t("time")}: {marks ? `${rangeTime.toFixed(2)}s` : `${Math.round(state.t)}s`} · {t("shots")}: {state.shotsFired} · {t("hits")}: {state.hits} · Hit Factor: {hf.toFixed(3)}
                {state.officerHits > 0 && <> · <Zap className="inline h-3 w-3" /> {state.officerHits}</>}
              </p>
              {marks && <p className="mt-1 flex items-center justify-center gap-1 text-accent"><Trophy className="h-4 w-4" /> Score {state.score}/{state.actors.length}</p>}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20" onClick={restart}>
                  <RotateCcw className="h-4 w-4" /> {t("controls.restart")}
                </Button>
                <Button size="lg" onClick={() => router.push(`/simulyator/debrif/${session.id}`)}>
                  Smart Debrifing <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute right-3 bottom-3 flex gap-1">
          {fpsMeter > 0 && <span className={cn("flex h-8 items-center rounded-md bg-black/60 px-2 font-mono text-[10px]", fpsMeter >= 50 ? "text-success" : fpsMeter >= 30 ? "text-accent" : "text-destructive")} title="FPS">{fpsMeter} fps</span>}
          {!touchDevice && <Button size="sm" variant="secondary" className="h-10 bg-black/60 px-3 font-mono text-[10px] text-white hover:bg-black/80 md:h-8 md:px-2" onClick={() => setControls((c) => (c === "fps" ? "fixed" : "fps"))} title={t("controls.toggle")}>{fpsMode ? <Gamepad2 className="mr-1 h-3.5 w-3.5" /> : <MousePointer2 className="mr-1 h-3.5 w-3.5" />}{fpsMode ? t("controls.fps") : t("controls.fixed")}</Button>}
          <Button size="sm" variant="secondary" className="h-10 bg-black/60 px-3 font-mono text-[10px] text-white hover:bg-black/80 md:h-8 md:px-2" onClick={() => setQuality((q) => (q === "high" ? "low" : "high"))} title={t("quality")}>{quality === "high" ? "HQ" : "LQ"}</Button>
          <Button size="icon" variant="secondary" className="h-10 w-10 bg-black/60 text-white hover:bg-black/80 md:h-8 md:w-8" onClick={() => setDevicesOpen((v) => !v)} title={t("input.title")} data-testid="devices-toggle"><Usb className="h-4 w-4" /></Button>
          {xrOk && (
            <Button size="sm" variant={xrOn ? "accent" : "secondary"} className={cn("h-10 px-3 font-mono text-[10px] md:h-8 md:px-2", !xrOn && "bg-black/60 text-white hover:bg-black/80")} onClick={() => xrCmd(xrOn ? "exit" : "enter")} title={xrOn ? t("xr.exit") : t("xr.enter")} data-testid="xr-toggle"><Glasses className="mr-1 h-3.5 w-3.5" />{xrOn ? t("xr.exit") : "VR"}</Button>
          )}
          <Button size="icon" variant="secondary" className="h-10 w-10 bg-black/60 text-white hover:bg-black/80 md:h-8 md:w-8" onClick={() => setWide((v) => !v)} title={t("wide")}><MonitorPlay className="h-4 w-4" /></Button>
          <Button size="icon" variant="secondary" className="h-10 w-10 bg-black/60 text-white hover:bg-black/80 md:h-8 md:w-8" onClick={() => { if (!voice) speech.stopSpeaking(); setVoice((v) => !v); }} title={t("voice")}>{voice ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</Button>
          <Button size="icon" variant="secondary" className="h-10 w-10 bg-black/60 text-white hover:bg-black/80 md:h-8 md:w-8" onClick={toggleFullscreen} title={t("fullscreen")}><Maximize2 className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <Card className="p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("talk")}</p>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {TIR_PRESET_PHRASES.map((p, i) => (
              <Button key={i} size="sm" variant={p.action === "talk_threat" ? "destructive" : p.action === "talk_command" ? "secondary" : "outline"} disabled={!started || !!state.outcome || marks} onClick={() => act(p.action, { phrase: p.uz })} className="h-auto whitespace-normal py-1.5 text-left text-xs">
                <span className="mr-1 font-mono text-[10px] opacity-60">{i + 1}</span> {p.uz}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {speech.sttSupported && (
              <Button variant={speech.listening ? "accent" : "outline"} size="icon" disabled={!started || !!state.outcome || marks} onClick={() => (speech.listening ? speech.stopListening() : speech.startListening())} title={t("mic")}><Mic className="h-4 w-4" /></Button>
            )}
            <Input value={speech.listening || speech.processing ? (speech.processing ? tdlg("sttProcessing") : speech.sttMode === "server" ? tdlg("sttRecording") : speech.interim || talkText) : talkText} onChange={(e) => setTalkText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") doTalk(talkText); }} placeholder={t("talkPlaceholder")} disabled={!started || !!state.outcome || marks} className={cn(speech.listening && "text-destructive")} />
            <Button disabled={!started || !!state.outcome || !talkText.trim() || marks} onClick={() => doTalk(talkText)}><MessageCircle className="h-4 w-4" /></Button>
          </div>
        </Card>

        <Card className="p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("actionsTitle")}</p>
          <div className="grid grid-cols-3 gap-1.5">
            <ActBtn icon={state.weaponDrawn ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />} label={state.weaponDrawn ? t("act.holster") : t("act.draw")} hint="F/H" onClick={() => (state.weaponDrawn ? act("holster") : doDraw())} disabled={!started || !!state.outcome} variant={state.weaponDrawn ? "secondary" : "outline"} />
            <ActBtn icon={<Zap className="h-4 w-4" />} label={t("act.taser")} hint="T" onClick={() => { const r = act("taser"); if (r && r.text) sfx.taser(); }} disabled={!started || !!state.outcome || marks} variant="outline" />
            <ActBtn icon={<Radio className="h-4 w-4" />} label={t("act.backup")} hint="B" onClick={() => act("backup")} disabled={!started || !!state.outcome || state.backupCalled || marks} variant="outline" />
            <ActBtn icon={<RotateCcw className="h-4 w-4" />} label={`${t("act.reload")} ${state.ammo.mag}/${state.ammo.reserve}`} hint="R" onClick={doReload} disabled={!started || !!state.outcome || reloading || state.ammo.reserve <= 0 || state.ammo.mag >= PISTOL.magazine} variant="outline" />
            {fpsMode ? (
              <ActBtn icon={<Gamepad2 className="h-4 w-4" />} label={t("act.move")} hint="WASD · C" onClick={() => undefined} disabled variant="ghost" />
            ) : (
              <ActBtn icon={<MoveLeft className="h-4 w-4" />} label={t("act.retreat")} hint="X" onClick={() => act("retreat")} disabled={!started || !!state.outcome || marks} variant="outline" />
            )}
            {fpsMode ? (
              <ActBtn icon={<Crosshair className="h-4 w-4" />} label={t("act.shoot")} hint={t("click")} onClick={() => undefined} disabled variant="ghost" />
            ) : (
              <ActBtn icon={<Shield className="h-4 w-4" />} label={t("act.cover")} hint="Q" onClick={() => act("cover")} disabled={!started || !!state.outcome || marks} variant={state.inCover ? "secondary" : "outline"} />
            )}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{fpsMode ? t("controls.shootHintFps") : t("shootHint")}</p>
        </Card>
      </div>

      {devicesOpen && <InputDevicesPanel onClose={() => setDevicesOpen(false)} />}

      {/* Instructor (ghost mode) — instructors only */}
      {isInstructor && (
      <Card className="p-3">
        <button className="flex w-full items-center justify-between text-left" onClick={() => setInstructorOpen((v) => !v)}>
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Flame className="h-3.5 w-3.5 text-accent" /> {t("instructor")}</span>
          {instructorOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {instructorOpen && (
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <Button size="sm" variant="outline" disabled={!started || !!state.outcome} onClick={() => instructor({ cmd: "escalate" })}>↑ {t("ins.escalate")}</Button>
              <Button size="sm" variant="outline" disabled={!started || !!state.outcome} onClick={() => instructor({ cmd: "deescalate" })}>↓ {t("ins.deescalate")}</Button>
              {state.actors.filter((a) => a.hidden).map((a) => (
                <Button key={a.id} size="sm" variant="outline" disabled={!started || !!state.outcome} onClick={() => instructor({ cmd: "spawn", actorId: a.id })}>+ {a.name}</Button>
              ))}
              <Button size="sm" variant="outline" disabled={!started || !!state.outcome} onClick={() => instructor({ cmd: state.paused ? "resume" : "pause" })}>{state.paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />} {state.paused ? t("ins.resume") : t("ins.pause")}</Button>
              <Button size="sm" variant="destructive" disabled={!started || !!state.outcome} onClick={() => instructor({ cmd: "all_stop" })}><Square className="h-3.5 w-3.5" /> ALL STOP</Button>
              <Button size="sm" variant="ghost" onClick={() => window.open(`/${locale}/simulyator/tir/instruktor?session=${session.id}&scenario=${scenario.id}`, "_blank", "noopener")}>
                <ExternalLink className="h-3.5 w-3.5" /> {t("ins.station")}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">{t("ins.hint")}</p>
          </div>
        )}
      </Card>
      )}

      <Card className="max-h-40 overflow-y-auto p-3 text-xs scrollbar-thin">
        <ol className="space-y-1">
          {[...state.events].reverse().slice(0, 14).map((e, i) => (
            <li key={i} className="flex gap-2">
              <span className="w-10 shrink-0 font-mono text-muted-foreground">t:{Math.round(e.t)}</span>
              <span className={cn("shrink-0 font-semibold", e.kind === "action" ? "text-primary" : e.kind === "actor" ? "text-accent" : e.kind === "shock" ? "text-destructive" : "text-muted-foreground")}>
                {e.kind === "action" ? "XODIM" : e.kind === "actor" ? (state.actors.find((a) => a.id === e.actorId)?.name ?? "SHAXS").toUpperCase() : e.kind === "shock" ? "⚡ SHOCK" : "TIZIM"}
              </span>
              <span className="flex-1">{e.text}</span>
              {e.legality != null && (
                <span className={cn("shrink-0 font-mono", e.legality >= 3 && (e.proportionality ?? 3) >= 3 ? "text-success" : e.legality <= 1 || (e.proportionality ?? 3) <= 1 ? "text-destructive" : "text-accent")}>Q{e.legality}/M{e.proportionality}</span>
              )}
            </li>
          ))}
        </ol>
      </Card>
      <p className="text-center text-[11px] text-muted-foreground">{tc("disclaimer")}</p>
    </div>
  );
}

function buzz(freq: number, gain: number, type: OscillatorType = "sawtooth") {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (type === "square" ? 0.15 : 0.6));
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + (type === "square" ? 0.15 : 0.6));
  } catch {}
}

function ActBtn({ icon, label, hint, onClick, disabled, variant }: { icon: React.ReactNode; label: string; hint: string; onClick: () => void; disabled?: boolean; variant: "outline" | "secondary" | "ghost" }) {
  return (
    <Button variant={variant} disabled={disabled} onClick={onClick} className="flex h-auto flex-col gap-0.5 py-2">
      {icon}
      <span className="text-[11px] leading-tight">{label}</span>
      <span className="font-mono text-[9px] opacity-50">{hint}</span>
    </Button>
  );
}
