"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Volume2, VolumeX, ArrowRight, XCircle, User, ShieldCheck, AudioLines, Mic } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { useSpeech } from "@/hooks/useSpeech";
import { useDialogSim, HEARING_PLACEHOLDER } from "@/hooks/useDialogSim";
import { useSentenceSpeaker } from "@/hooks/useSentenceSpeaker";
import { useSessionBootstrap } from "@/hooks/useSessionBootstrap";
import { newDialogSession } from "@/lib/training/sessionFactory";
import { localized } from "@/data/sops/types";
import type { DialogScenario } from "@/data/scenarios/types";
import type { TrainingSession } from "@/lib/storage/trainingSchema";
import { ProfileGate } from "../profile/ProfileGate";
import { StateIndicators, StateStrip } from "./StateIndicators";
import { cn } from "@/lib/utils";

export function DialogSimClient({
  scenario,
  sessionId,
  exam,
}: {
  scenario: DialogScenario;
  sessionId?: string;
  exam?: { examId: string; examStageIndex: number };
}) {
  const create = useCallback(
    (traineeId: string, exam?: { examId: string; examStageIndex: number }) =>
      newDialogSession(scenario, { traineeId, ...exam }),
    [scenario]
  );
  const { session, ready, needsProfile } = useSessionBootstrap({
    scenarioId: scenario.id,
    sessionId,
    create,
    exam,
  });

  if (needsProfile) return <ProfileGate />;
  if (!ready || !session) return null;
  return <DialogRunner scenario={scenario} initial={session} />;
}

function DialogRunner({ scenario, initial }: { scenario: DialogScenario; initial: TrainingSession }) {
  const t = useTranslations("sim.dialog");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const sim = useDialogSim(scenario, initial, locale);
  /** Hands-free: talk → auto-send on silence → the citizen answers aloud → mic reopens. */
  const [live, setLive] = useState(false);
  const speech = useSpeech({ locale, autoStop: live, direct: true, maxRecordMs: live ? 45000 : 60000 });
  const [speakReplies, setSpeakReplies] = useState(false);
  const speaker = useSentenceSpeaker(speech, speakReplies);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastSpokenRef = useRef<number>(sim.transcript[sim.transcript.length - 1]?.i ?? -1);

  // Auto-scroll.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sim.transcript.length, sim.busy, sim.streamingReply]);

  const sendTurn = useCallback(
    (input: Parameters<typeof sim.send>[0]) => {
      speaker.reset();
      void sim.send(input, { onDelta: speaker.feed });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sim.send, speaker.reset, speaker.feed]
  );

  // Voice (server mode): the recorded clip goes straight to the dialog model —
  // it transcribes and answers in one call.
  useEffect(() => {
    if (!speech.clip) return;
    const clip = speech.clip;
    speech.clearClip();
    sendTurn({ audio: clip.base64, mimeType: clip.mimeType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.clip]);

  // Voice (browser Web Speech fallback): mic transcript → send.
  useEffect(() => {
    if (!speech.listening && speech.transcript) {
      const text = speech.transcript;
      speech.setTranscript("");
      sendTurn(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.listening, speech.transcript]);

  // Voice: finish reading the citizen's newest reply (its head was already
  // spoken while it streamed).
  useEffect(() => {
    const last = sim.transcript[sim.transcript.length - 1];
    if (last && last.role === "citizen" && last.i !== lastSpokenRef.current && last.i > 0) {
      lastSpokenRef.current = last.i;
      speaker.end(last.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.transcript.length]);

  // Hands-free: reopen the mic once the citizen has finished speaking.
  useEffect(() => {
    if (!live || sim.ended || sim.busy || !speaker.idle || speech.listening || speech.processing) return;
    const id = window.setTimeout(() => speech.startListening(), 350);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, sim.ended, sim.busy, speaker.idle, speech.listening, speech.processing]);

  useEffect(() => {
    if (sim.ended && live) {
      setLive(false);
      speech.cancelListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.ended]);

  const toggleLive = () => {
    speech.unlockAudio();
    if (live) {
      setLive(false);
      speech.cancelListening();
      return;
    }
    setLive(true);
    setSpeakReplies(true);
  };

  useEffect(() => {
    if (!sim.error) return;
    if (sim.error === "no_speech") {
      if (!live) toast.message(t("noSpeech"));
      sim.clearError();
      return;
    }
    toast.error(
      sim.error === "ai_unavailable"
        ? tc("aiUnavailable")
        : sim.error === "no_keys_configured"
          ? tc("noKeys")
          : sim.error === "bad_ai_output"
            ? tc("badOutput")
            : sim.error === "too_long"
              ? t("tooLong")
              : sim.error === "rate_limited"
                ? tc("rateLimited")
                : tc("errorGeneric")
    );
    sim.clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.error]);

  const endedText =
    sim.ended === "kelishuv"
      ? t("endedKelishuv")
      : sim.ended === "eskalatsiya"
        ? t("endedEskalatsiya")
        : sim.ended === "limit"
          ? t("endedLimit")
          : null;

  return (
    <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[1fr_300px]">
      <Card className="flex min-h-0 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {scenario.persona.name}, {scenario.persona.age}
            </p>
            <p className="truncate text-xs text-muted-foreground">{localized(scenario.setting, locale)}</p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            {scenario.code}
          </Badge>
          {speech.sttSupported && speech.sttMode === "server" && !sim.ended && (
            <Button
              variant={live ? "accent" : "outline"}
              size="sm"
              onClick={toggleLive}
              aria-pressed={live}
              title={t("liveHint")}
              className="h-10"
            >
              <AudioLines className="h-4 w-4" />
              <span className="hidden sm:inline">{live ? t("liveOn") : t("live")}</span>
            </Button>
          )}
          <Button
            variant={speakReplies ? "accent" : "ghost"}
            size="icon"
            onClick={() => {
              speech.unlockAudio();
              if (speakReplies) speaker.reset();
              setSpeakReplies((v) => !v);
            }}
            aria-label={t("speakReplies")}
            title={t("speakReplies")}
          >
            {speakReplies ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>

        <StateStrip state={sim.state} last={sim.lastAssessment} turns={sim.officerTurns} maxTurns={scenario.maxTurns} />

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-3 p-4">
            {sim.transcript.map((turn) => (
              <div
                key={turn.i}
                className={cn("flex gap-2", turn.role === "officer" ? "justify-end" : "justify-start")}
              >
                {turn.role === "citizen" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs",
                    turn.role === "officer"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-card border border-border/70"
                  )}
                >
                  <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-60">
                    {turn.role === "officer" ? t("you") : t("citizen")}
                  </p>
                  <p className={cn("whitespace-pre-wrap", turn.text === HEARING_PLACEHOLDER && "animate-pulse")}>
                    {turn.text === HEARING_PLACEHOLDER ? t("hearing") : turn.text}
                  </p>
                </div>
                {turn.role === "officer" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {sim.busy && (
              <div className="flex gap-2">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <User className="h-4 w-4" />
                </div>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl rounded-bl-md border border-border/70 bg-card px-4 py-2.5 text-sm leading-relaxed",
                    !sim.streamingReply && "text-muted-foreground"
                  )}
                >
                  {sim.streamingReply ? (
                    <>
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-60">
                        {t("citizen")}
                      </p>
                      <p className="whitespace-pre-wrap">
                        {sim.streamingReply}
                        <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-accent align-middle" />
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex gap-1">
                        <span className="animate-bounce">•</span>
                        <span className="animate-bounce [animation-delay:120ms]">•</span>
                        <span className="animate-bounce [animation-delay:240ms]">•</span>
                      </span>{" "}
                      {t("thinking")}
                    </>
                  )}
                </div>
              </div>
            )}
            {endedText && (
              <div
                className={cn(
                  "rounded-xl border p-4 text-sm",
                  sim.ended === "kelishuv"
                    ? "border-success/40 bg-success/10"
                    : "border-destructive/40 bg-destructive/10"
                )}
              >
                <p className="font-semibold">{endedText}</p>
                <Button className="mt-3" variant={sim.ended === "kelishuv" ? "default" : "accent"} onClick={() => router.push(`/simulyator/debrif/${sim.session.id}`)}>
                  {t("goDebrief")} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {!sim.ended ? (
          <>
            {(speech.listening || speech.processing || speech.interim) && (
              <div
                className={cn(
                  "flex items-center gap-3 px-4 pt-2 text-xs",
                  speech.listening ? "text-destructive" : "text-muted-foreground"
                )}
              >
                <Mic className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {speech.processing
                    ? t("sttProcessing")
                    : speech.listening && speech.sttMode === "server"
                      ? live
                        ? speech.heard
                          ? t("liveListening")
                          : t("liveSpeak")
                        : t("sttRecording")
                      : speech.interim || "…"}
                </span>
                {speech.listening && speech.sttMode === "server" && (
                  <span className="flex h-3 items-end gap-0.5" aria-hidden>
                    {[0.35, 0.7, 1, 0.7, 0.35].map((k, i) => (
                      <span
                        key={i}
                        className="w-1 rounded-full bg-destructive/80 transition-[height] duration-75"
                        style={{ height: `${Math.max(15, Math.min(100, speech.level * 160 * k))}%` }}
                      />
                    ))}
                  </span>
                )}
                {live && speech.listening && (
                  <Button variant="ghost" size="sm" className="ml-auto h-8" onClick={() => speech.stopListening()}>
                    {t("liveSendNow")}
                  </Button>
                )}
              </div>
            )}
            <ChatComposer
              onSend={(text) => sendTurn(text)}
              onStop={() => undefined}
              isStreaming={sim.busy}
              placeholder={t("placeholder")}
              onMic={
                speech.sttSupported && !live
                  ? () => {
                      speech.unlockAudio();
                      if (speech.listening) speech.stopListening();
                      else speech.startListening();
                    }
                  : undefined
              }
              micActive={speech.listening}
            />
            <div className="flex justify-end border-t border-border/50 px-3 py-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={async () => {
                  if (!window.confirm(tc("abandonConfirm"))) return;
                  await sim.abandon();
                  router.push("/mashgulotlarim");
                }}
              >
                <XCircle className="h-4 w-4" /> {t("abandon")}
              </Button>
            </div>
          </>
        ) : null}
      </Card>

      <div className="hidden space-y-4 lg:block">
        <StateIndicators
          state={sim.state}
          last={sim.lastAssessment}
          turns={sim.officerTurns}
          maxTurns={scenario.maxTurns}
        />
      </div>
    </div>
  );
}
