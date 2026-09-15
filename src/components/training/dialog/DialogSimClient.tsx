"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Volume2, VolumeX, ArrowRight, XCircle, User, ShieldCheck } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { useSpeech } from "@/hooks/useSpeech";
import { useDialogSim } from "@/hooks/useDialogSim";
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
  const speech = useSpeech({ locale });
  const [speakReplies, setSpeakReplies] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastSpokenRef = useRef<number>(-1);

  // Auto-scroll.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sim.transcript.length, sim.busy]);

  // Voice: mic transcript → send.
  useEffect(() => {
    if (!speech.listening && speech.transcript) {
      const text = speech.transcript;
      speech.setTranscript("");
      void sim.send(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.listening, speech.transcript]);

  // Voice: read the citizen's newest reply.
  useEffect(() => {
    if (!speakReplies) return;
    const last = sim.transcript[sim.transcript.length - 1];
    if (last && last.role === "citizen" && last.i !== lastSpokenRef.current && last.i > 0) {
      lastSpokenRef.current = last.i;
      void speech.speak(last.text.replace(/\([^)]*\)/g, ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.transcript.length, speakReplies]);

  useEffect(() => {
    if (!sim.error) return;
    toast.error(
      sim.error === "ai_unavailable"
        ? tc("aiUnavailable")
        : sim.error === "no_keys_configured"
          ? tc("noKeys")
          : sim.error === "bad_ai_output"
            ? tc("badOutput")
            : sim.error === "too_long"
              ? t("tooLong")
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
          <Button
            variant={speakReplies ? "accent" : "ghost"}
            size="icon"
            onClick={() => {
              if (speakReplies) speech.stopSpeaking();
              setSpeakReplies((v) => !v);
            }}
            aria-label={t("speakReplies")}
            title={t("speakReplies")}
          >
            {speakReplies ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>

        <StateStrip state={sim.state} last={sim.lastAssessment} />

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
                  <p className="whitespace-pre-wrap">{turn.text}</p>
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
                <div className="rounded-2xl rounded-bl-md border border-border/70 bg-card px-4 py-2.5 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce [animation-delay:120ms]">•</span>
                    <span className="animate-bounce [animation-delay:240ms]">•</span>
                  </span>{" "}
                  {t("thinking")}
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
              <p className={cn("px-4 pt-2 text-xs", speech.listening ? "text-destructive" : "text-muted-foreground")}>
                🎤 {speech.processing ? t("sttProcessing") : speech.listening && speech.sttMode === "server" ? t("sttRecording") : speech.interim || "…"}
              </p>
            )}
            <ChatComposer
              onSend={(text) => void sim.send(text)}
              onStop={() => undefined}
              isStreaming={sim.busy}
              placeholder={t("placeholder")}
              onMic={speech.sttSupported ? () => (speech.listening ? speech.stopListening() : speech.startListening()) : undefined}
              micActive={speech.listening}
            />
            <div className="flex justify-end border-t border-border/50 px-3 py-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={async () => {
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
