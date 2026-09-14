"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight, Crosshair, Maximize2, Minimize2, Mic, MonitorPlay, Radio, Shield, ShieldOff, Zap,
  MoveLeft, Volume2, VolumeX, Play, MessageCircle, AlertTriangle, CheckCircle2,
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
  applyAction, classifyTalk, initTir, outcomeSummary, tick, TIR_PRESET_PHRASES, type TirState,
} from "@/lib/training/tirEngine";
import { localized } from "@/data/sops/types";
import type { TirAction, TirHitZone, TirScenario } from "@/data/scenarios/types";
import type { TrainingSession } from "@/lib/storage/trainingSchema";
import { ProfileGate } from "../profile/ProfileGate";
import { cn } from "@/lib/utils";

const TirScene = dynamic(() => import("./TirScene").then((m) => m.TirScene), { ssr: false });

const TICK_MS = 100;

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
  const [flash, setFlash] = useState(false);
  const [talkText, setTalkText] = useState("");
  const [lastFeedback, setLastFeedback] = useState<{ text: string; L: number; P: number } | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const wrapRef = useRef<HTMLDivElement>(null);
  const spokenSeq = useRef(-1);
  const savedOutcome = useRef(false);

  // Engine loop.
  useEffect(() => {
    if (!started || state.outcome) return;
    const id = window.setInterval(() => {
      const next = tick(stateRef.current, scenario, TICK_MS / 1000);
      setState(next);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [started, state.outcome, scenario]);

  // Actor voice (TTS) on new line.
  useEffect(() => {
    if (!voice || !started || !state.currentLine || state.lineSeq === spokenSeq.current) return;
    spokenSeq.current = state.lineSeq;
    void speech.speak(state.currentLine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.lineSeq, voice, started]);

  // Mic → talk.
  useEffect(() => {
    if (!speech.listening && speech.transcript) {
      const text = speech.transcript;
      speech.setTranscript("");
      doTalk(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.listening, speech.transcript]);

  // Persist on outcome.
  useEffect(() => {
    if (!state.outcome || savedOutcome.current) return;
    savedOutcome.current = true;
    const done = touch(session, {
      status: "completed",
      endedAt: new Date().toISOString(),
      payload: { kind: "tir", events: state.events, outcome: state.outcome, elapsedSec: state.t, shotsFired: state.shotsFired, hits: state.hits },
    });
    setSession(done);
    void localTrainingRepo.saveSession(done);
    speech.stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.outcome]);

  const act = useCallback(
    (action: TirAction, detail?: { hit?: TirHitZone; phrase?: string }) => {
      const cur = stateRef.current;
      if (!started || cur.outcome) return;
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

  const onShoot = (zone: TirHitZone) => {
    setFlash(true);
    window.setTimeout(() => setFlash(false), 90);
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 120;
      g.gain.setValueAtTime(0.4, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.15);
    } catch {}
    act("shoot", { hit: zone });
  };

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen().catch(() => undefined);
  };

  // Keyboard shortcuts (range PC): 1-5 phrases, D draw, H holster, T taser, B backup, R retreat, C cover.
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

  return (
    <div className="space-y-3">
      {/* Range viewport */}
      <div
        ref={wrapRef}
        className={cn(
          "relative w-full overflow-hidden rounded-xl border bg-black shadow-elevated",
          wide ? "aspect-[48/9]" : "aspect-video",
          "fullscreen:rounded-none"
        )}
      >
        <TirScene scenario={scenario} state={state} wide={wide} onShoot={onShoot} />

        {/* muzzle flash */}
        <div className={cn("pointer-events-none absolute inset-0 bg-white transition-opacity", flash ? "opacity-60" : "opacity-0")} />

        {/* crosshair */}
        {state.weaponDrawn && !state.outcome && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80">
            <Crosshair className="h-10 w-10 drop-shadow" />
          </div>
        )}

        {/* HUD top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 text-white">
          <div className="rounded-lg bg-black/55 px-3 py-2 text-xs backdrop-blur">
            <p className="font-semibold">{scenario.code} · {localized(scenario.title, locale)}</p>
            <p className="mt-0.5 text-white/70">
              {t("distance")}: <b className="font-mono">{state.distance.toFixed(1)} m</b> · {t("time")}: <b className="font-mono">{remaining}s</b>
              {state.backupCalled && (
                <> · {t("backup")}: <b className="font-mono">{state.backupArrived ? "✓" : `${Math.ceil(state.backupEta ?? 0)}s`}</b></>
              )}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={state.actorState === "lunging" || state.actorState === "knife_raised" ? "destructive" : state.actorState === "kneeling" || state.actorState === "calm" ? "success" : "secondary"}>
              {t(`actor.${state.actorState}`)}
            </Badge>
            <div className="flex gap-1">
              <Badge variant="outline" className="border-white/30 text-white">{state.weaponDrawn ? t("armed") : t("holstered")}</Badge>
              {state.inCover && <Badge variant="outline" className="border-white/30 text-white">{t("cover")}</Badge>}
            </div>
          </div>
        </div>

        {/* subtitles */}
        {started && state.currentLine && !state.outcome && (
          <div className="pointer-events-none absolute inset-x-0 bottom-14 flex justify-center px-4">
            <p className="max-w-3xl rounded-lg bg-black/65 px-4 py-2 text-center text-base font-medium text-white backdrop-blur md:text-lg">
              <span className="text-accent">{scenario.actor.name}:</span> {state.currentLine}
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

        {/* view controls */}
        <div className="absolute right-3 bottom-3 flex gap-1">
          <Button size="icon" variant="secondary" className="h-8 w-8 bg-black/60 text-white hover:bg-black/80" onClick={() => setWide((v) => !v)} title={t("wide")}>
            <MonitorPlay className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 bg-black/60 text-white hover:bg-black/80" onClick={() => { if (!voice) speech.stopSpeaking(); setVoice((v) => !v); }} title={t("voice")}>
            {voice ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 bg-black/60 text-white hover:bg-black/80" onClick={toggleFullscreen} title={t("fullscreen")}>
            {typeof document !== "undefined" && document.fullscreenElement ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* start overlay */}
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-white">
            <div className="max-w-xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{t("briefing")}</p>
              <p className="mt-2 text-lg leading-relaxed">{localized(scenario.briefing, locale)}</p>
              <p className="mt-3 text-sm text-white/70">{t("hint")}</p>
              <Button size="xl" className="mt-6" onClick={() => setStarted(true)}>
                <Play className="h-5 w-5" /> {t("start")}
              </Button>
            </div>
          </div>
        )}

        {/* outcome overlay */}
        {outcome && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/75 p-6 text-white">
            <div className="max-w-xl text-center">
              {outcome.tone === "good" ? <CheckCircle2 className="mx-auto h-12 w-12 text-success" /> : <AlertTriangle className={cn("mx-auto h-12 w-12", outcome.tone === "bad" ? "text-destructive" : "text-accent")} />}
              <p className="mt-3 text-xl font-bold">{outcome.uz}</p>
              <p className="mt-2 text-sm text-white/70">
                {t("time")}: {Math.round(state.t)}s · {t("shots")}: {state.shotsFired} · {t("actions")}: {state.events.filter((e) => e.kind === "action").length}
              </p>
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
              <Button
                key={i}
                size="sm"
                variant={p.action === "talk_threat" ? "destructive" : p.action === "talk_command" ? "secondary" : "outline"}
                disabled={!started || !!state.outcome}
                onClick={() => act(p.action, { phrase: p.uz })}
                className="h-auto whitespace-normal py-1.5 text-left text-xs"
              >
                <span className="mr-1 font-mono text-[10px] opacity-60">{i + 1}</span> {p.uz}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {speech.sttSupported && (
              <Button variant={speech.listening ? "accent" : "outline"} size="icon" disabled={!started || !!state.outcome} onClick={() => (speech.listening ? speech.stopListening() : speech.startListening())} title={t("mic")}>
                <Mic className="h-4 w-4" />
              </Button>
            )}
            <Input
              value={speech.listening ? speech.interim || talkText : talkText}
              onChange={(e) => setTalkText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") doTalk(talkText); }}
              placeholder={t("talkPlaceholder")}
              disabled={!started || !!state.outcome}
            />
            <Button disabled={!started || !!state.outcome || !talkText.trim()} onClick={() => doTalk(talkText)}>
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("actionsTitle")}</p>
          <div className="grid grid-cols-3 gap-1.5">
            <ActBtn icon={state.weaponDrawn ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />} label={state.weaponDrawn ? t("act.holster") : t("act.draw")} hint="D/H" onClick={() => act(state.weaponDrawn ? "holster" : "draw")} disabled={!started || !!state.outcome} variant={state.weaponDrawn ? "secondary" : "outline"} />
            <ActBtn icon={<Zap className="h-4 w-4" />} label={t("act.taser")} hint="T" onClick={() => act("taser")} disabled={!started || !!state.outcome} variant="outline" />
            <ActBtn icon={<Radio className="h-4 w-4" />} label={t("act.backup")} hint="B" onClick={() => act("backup")} disabled={!started || !!state.outcome || state.backupCalled} variant="outline" />
            <ActBtn icon={<MoveLeft className="h-4 w-4" />} label={t("act.retreat")} hint="R" onClick={() => act("retreat")} disabled={!started || !!state.outcome} variant="outline" />
            <ActBtn icon={<Shield className="h-4 w-4" />} label={t("act.cover")} hint="C" onClick={() => act("cover")} disabled={!started || !!state.outcome} variant={state.inCover ? "secondary" : "outline"} />
            <ActBtn icon={<Crosshair className="h-4 w-4" />} label={t("act.shoot")} hint={t("click")} onClick={() => undefined} disabled variant="ghost" />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{t("shootHint")}</p>
        </Card>
      </div>

      {/* Event log (compact) */}
      <Card className="max-h-40 overflow-y-auto p-3 text-xs scrollbar-thin">
        <ol className="space-y-1">
          {[...state.events].reverse().slice(0, 12).map((e, i) => (
            <li key={i} className="flex gap-2">
              <span className="w-10 shrink-0 font-mono text-muted-foreground">t:{Math.round(e.t)}</span>
              <span className={cn("shrink-0 font-semibold", e.kind === "action" ? "text-primary" : e.kind === "actor" ? "text-accent" : "text-muted-foreground")}>
                {e.kind === "action" ? "XODIM" : e.kind === "actor" ? scenario.actor.name.toUpperCase() : "TIZIM"}
              </span>
              <span className="flex-1">{e.text}</span>
              {e.legality != null && (
                <span className={cn("shrink-0 font-mono", e.legality >= 3 && (e.proportionality ?? 3) >= 3 ? "text-success" : e.legality <= 1 || (e.proportionality ?? 3) <= 1 ? "text-destructive" : "text-accent")}>
                  Q{e.legality}/M{e.proportionality}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Card>
      <p className="text-center text-[11px] text-muted-foreground">{tc("disclaimer")}</p>
    </div>
  );
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
