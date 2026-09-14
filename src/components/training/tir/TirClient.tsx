"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight, Crosshair, Maximize2, Mic, MonitorPlay, Radio, Shield, ShieldOff, Zap, MoveLeft, Volume2, VolumeX,
  Play, MessageCircle, AlertTriangle, CheckCircle2, Timer, Trophy, Pause, Square, Flame, ExternalLink, ChevronDown, ChevronUp,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSessionBootstrap } from "@/hooks/useSessionBootstrap";
import { useSpeech } from "@/hooks/useSpeech";
import { newTirSession, touch } from "@/lib/training/sessionFactory";
import { localTrainingRepo } from "@/lib/storage/training";
import {
  ACTOR_TEXT, applyAction, applyInstructor, classifyTalk, hitFactor, initTir, outcomeSummary, primarySuspect, tick,
  TIR_PRESET_PHRASES, type InstructorCmd, type TirState,
} from "@/lib/training/tirEngine";
import { localized } from "@/data/sops/types";
import type { TirAction, TirHitZone, TirScenario } from "@/data/scenarios/types";
import type { TrainingSession } from "@/lib/storage/trainingSchema";
import { ProfileGate } from "../profile/ProfileGate";
import { TirVideoLayer } from "./TirVideoLayer";
import { cn } from "@/lib/utils";

const TirScene = dynamic(() => import("./TirScene").then((m) => m.TirScene), { ssr: false });

const TICK_MS = 100;
export const tirChannelName = (sessionId: string) => `h360-tir-${sessionId}`;

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
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const speech = useSpeech({ locale });

  const [session, setSession] = useState(initial);
  const [state, setState] = useState<TirState>(() => initTir(scenario));
  const [started, setStarted] = useState(false);
  const [wide, setWide] = useState(false);
  const [voice, setVoice] = useState(true);
  const [quality, setQuality] = useState<"high" | "low">(() => (typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent) ? "low" : "high"));
  const [flash, setFlash] = useState(false);
  const [shockFx, setShockFx] = useState(false);
  const [allStop, setAllStop] = useState(false);
  const [instructorOpen, setInstructorOpen] = useState(false);
  const [talkText, setTalkText] = useState("");
  const [lastFeedback, setLastFeedback] = useState<{ text: string; L: number; P: number } | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const wrapRef = useRef<HTMLDivElement>(null);
  const spokenSeq = useRef(-1);
  const shockSeen = useRef(0);
  const savedOutcome = useRef(false);
  const channel = useRef<BroadcastChannel | null>(null);

  // Instructor station channel (second window / tablet in the same browser profile).
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(tirChannelName(session.id));
    channel.current = ch;
    ch.onmessage = (ev: MessageEvent<{ type: "cmd"; cmd: InstructorCmd } | { type: "hello" }>) => {
      const msg = ev.data;
      if (msg?.type === "cmd") setState((cur) => applyInstructor(cur, scenario, msg.cmd));
      if (ev.data?.type === "hello") ch.postMessage({ type: "state", state: stateRef.current, scenarioId: scenario.id, started });
    };
    return () => ch.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id, scenario]);
  useEffect(() => {
    channel.current?.postMessage({ type: "state", state, scenarioId: scenario.id, started });
  }, [state, started, scenario.id]);

  // Engine loop.
  useEffect(() => {
    if (!started || state.outcome) return;
    const id = window.setInterval(() => setState(tick(stateRef.current, scenario, TICK_MS / 1000)), TICK_MS);
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
    window.dispatchEvent(new CustomEvent("h360:shock", { detail: { sessionId: session.id, t: state.t } }));
  }, [state.shockSeq, state.t, session.id]);

  // Mic → talk.
  useEffect(() => {
    if (!speech.listening && speech.transcript) {
      const text = speech.transcript;
      speech.setTranscript("");
      doTalk(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.listening, speech.transcript]);

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
    void localTrainingRepo.saveSession(done);
    speech.stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.outcome]);

  const act = useCallback(
    (action: TirAction, detail?: { hit?: TirHitZone; actorId?: string; phrase?: string }) => {
      const cur = stateRef.current;
      if (!started || cur.outcome || cur.paused) return;
      const r = applyAction(cur, scenario, action, detail);
      if (r.state !== cur) {
        setState(r.state);
        if (r.text) setLastFeedback({ text: r.text, L: r.legality, P: r.proportionality });
      }
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
    setFlash(true);
    window.setTimeout(() => setFlash(false), 90);
    buzz(120, 0.35, "square");
    act("shoot", { hit: zone, actorId: actorId ?? undefined });
  };

  const instructor = (cmd: InstructorCmd) => setState((cur) => applyInstructor(cur, scenario, cmd));

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen().catch(() => undefined);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      const k = e.key.toLowerCase();
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < TIR_PRESET_PHRASES.length) act(TIR_PRESET_PHRASES[idx].action, { phrase: TIR_PRESET_PHRASES[idx].uz });
      else if (k === "d") act("draw");
      else if (k === "h") act("holster");
      else if (k === "t") act("taser");
      else if (k === "b") act("backup");
      else if (k === "r") act("retreat");
      else if (k === "c") act("cover");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [act]);

  const outcome = state.outcome ? outcomeSummary(state.outcome) : null;
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
        <TirScene scenario={scenario} state={state} wide={wide} onShoot={onShoot} quality={quality} />
        <TirVideoLayer scenario={scenario} state={primarySuspect(state)?.state} muted={!voice} />

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

        {state.weaponDrawn && !state.outcome && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80">
            <Crosshair className="h-10 w-10 drop-shadow" />
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

        <div className="absolute right-3 bottom-3 flex gap-1">
          <Button size="sm" variant="secondary" className="h-8 bg-black/60 px-2 font-mono text-[10px] text-white hover:bg-black/80" onClick={() => setQuality((q) => (q === "high" ? "low" : "high"))} title={t("quality")}>{quality === "high" ? "HQ" : "LQ"}</Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 bg-black/60 text-white hover:bg-black/80" onClick={() => setWide((v) => !v)} title={t("wide")}><MonitorPlay className="h-4 w-4" /></Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 bg-black/60 text-white hover:bg-black/80" onClick={() => { if (!voice) speech.stopSpeaking(); setVoice((v) => !v); }} title={t("voice")}>{voice ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 bg-black/60 text-white hover:bg-black/80" onClick={toggleFullscreen} title={t("fullscreen")}><Maximize2 className="h-4 w-4" /></Button>
        </div>

        {!started && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-white">
            <div className="max-w-xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{t("briefing")}</p>
              <p className="mt-2 text-lg leading-relaxed">{localized(scenario.briefing, locale)}</p>
              <p className="mt-3 text-sm text-white/70">{marks ? t("hintRange") : t("hint")}</p>
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
              {outcome.tone === "good" ? <CheckCircle2 className="mx-auto h-12 w-12 text-success" /> : <AlertTriangle className={cn("mx-auto h-12 w-12", outcome.tone === "bad" ? "text-destructive" : "text-accent")} />}
              <p className="mt-3 text-xl font-bold">{outcome.uz}</p>
              <p className="mt-2 font-mono text-sm text-white/70">
                {t("time")}: {marks ? `${rangeTime.toFixed(2)}s` : `${Math.round(state.t)}s`} · {t("shots")}: {state.shotsFired} · {t("hits")}: {state.hits} · Hit Factor: {hf.toFixed(3)}
                {state.officerHits > 0 && <> · <Zap className="inline h-3 w-3" /> {state.officerHits}</>}
              </p>
              {marks && <p className="mt-1 flex items-center justify-center gap-1 text-accent"><Trophy className="h-4 w-4" /> Score {state.score}/{state.actors.length}</p>}
              <Button size="lg" className="mt-5" onClick={() => router.push(`/simulyator/debrif/${session.id}`)}>
                Smart Debrifing <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
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
            <Input value={speech.listening ? speech.interim || talkText : talkText} onChange={(e) => setTalkText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") doTalk(talkText); }} placeholder={t("talkPlaceholder")} disabled={!started || !!state.outcome || marks} />
            <Button disabled={!started || !!state.outcome || !talkText.trim() || marks} onClick={() => doTalk(talkText)}><MessageCircle className="h-4 w-4" /></Button>
          </div>
        </Card>

        <Card className="p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("actionsTitle")}</p>
          <div className="grid grid-cols-3 gap-1.5">
            <ActBtn icon={state.weaponDrawn ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />} label={state.weaponDrawn ? t("act.holster") : t("act.draw")} hint="D/H" onClick={() => act(state.weaponDrawn ? "holster" : "draw")} disabled={!started || !!state.outcome} variant={state.weaponDrawn ? "secondary" : "outline"} />
            <ActBtn icon={<Zap className="h-4 w-4" />} label={t("act.taser")} hint="T" onClick={() => act("taser")} disabled={!started || !!state.outcome || marks} variant="outline" />
            <ActBtn icon={<Radio className="h-4 w-4" />} label={t("act.backup")} hint="B" onClick={() => act("backup")} disabled={!started || !!state.outcome || state.backupCalled || marks} variant="outline" />
            <ActBtn icon={<MoveLeft className="h-4 w-4" />} label={t("act.retreat")} hint="R" onClick={() => act("retreat")} disabled={!started || !!state.outcome || marks} variant="outline" />
            <ActBtn icon={<Shield className="h-4 w-4" />} label={t("act.cover")} hint="C" onClick={() => act("cover")} disabled={!started || !!state.outcome || marks} variant={state.inCover ? "secondary" : "outline"} />
            <ActBtn icon={<Crosshair className="h-4 w-4" />} label={t("act.shoot")} hint={t("click")} onClick={() => undefined} disabled variant="ghost" />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{t("shootHint")}</p>
        </Card>
      </div>

      {/* Instructor (ghost mode) */}
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
