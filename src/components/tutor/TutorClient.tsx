"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ArrowLeft,
  AudioLines,
  GraduationCap,
  Loader2,
  Mic,
  Play,
  Volume2,
  VolumeX,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { Markdown } from "@/components/chat/Markdown";
import { Icon } from "@/components/icon";
import { ProfileGate } from "@/components/training/profile/ProfileGate";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { useSpeech } from "@/hooks/useSpeech";
import { useSentenceSpeaker } from "@/hooks/useSentenceSpeaker";
import { kasbRepo, type TutorProgress } from "@/lib/storage/kasb";
import { AGENCY_MAP } from "@/data/kasblar/agencies";
import { localized } from "@/data/sops/types";
import type { TutorTopic } from "@/data/kasblar/types";
import { cn } from "@/lib/utils";
import { useTutorChat } from "./useTutorChat";
import { LessonPanel } from "./LessonPanel";
import { QuickQuiz } from "./QuickQuiz";

/** Q&A turns needed (with all quiz items answered) to mark a topic completed. */
export const TUTOR_MIN_TURNS = 6;

export function TutorClient({ topic }: { topic: TutorTopic }) {
  const { profile, loaded } = useTraineeProfile();
  if (!loaded) return null;
  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <ProfileGate />
      </div>
    );
  }
  return <TutorRunner topic={topic} traineeId={profile.id} />;
}

function TutorRunner({ topic, traineeId }: { topic: TutorTopic; traineeId: string }) {
  const t = useTranslations("tutor");
  const tc = useTranslations("common");
  const locale = useLocale();
  const agency = AGENCY_MAP[topic.agency];

  /* ---------------- progress (kasbRepo) ---------------- */
  const [turns, setTurns] = useState(0);
  const [quiz, setQuiz] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const progRef = useRef<{ turns: number; quiz: Record<string, string>; completed: boolean }>({
    turns: 0,
    quiz: {},
    completed: false,
  });

  useEffect(() => {
    let alive = true;
    void kasbRepo.listTutor(traineeId).then((rows) => {
      const p = rows.find((r) => r.topicId === topic.id);
      if (!alive || !p) return;
      progRef.current = { turns: p.turns ?? 0, quiz: p.quiz ?? {}, completed: !!p.completed };
      setTurns(progRef.current.turns);
      setQuiz(progRef.current.quiz);
      setCompleted(progRef.current.completed);
    });
    return () => {
      alive = false;
    };
  }, [traineeId, topic.id]);

  const persist = useCallback(
    (patch: Partial<{ turns: number; quiz: Record<string, string> }>) => {
      const cur = { ...progRef.current, ...patch };
      const total = topic.quiz.length;
      const allAnswered = topic.quiz.every((q) => cur.quiz[q.id]);
      const correct = topic.quiz.filter((q) => q.options.find((o) => o.id === cur.quiz[q.id])?.correct).length;
      const done = cur.completed || (allAnswered && cur.turns >= TUTOR_MIN_TURNS);
      progRef.current = { ...cur, completed: done };
      setTurns(cur.turns);
      setQuiz(cur.quiz);
      if (done && !completed) toast.success(t("completedToast"));
      setCompleted(done);
      const row: TutorProgress = {
        topicId: topic.id,
        traineeId,
        turns: cur.turns,
        quiz: cur.quiz,
        quizScore: allAnswered && total > 0 ? Math.round((correct / total) * 100) : undefined,
        updatedAt: new Date().toISOString(),
        completed: done,
      };
      void kasbRepo.saveTutor(row);
    },
    [topic, traineeId, completed, t]
  );

  /* ---------------- voice ---------------- */
  const speech = useSpeech({ locale, maxRecordMs: 60000, autoStop: true });
  const [speakOn, setSpeakOn] = useState(false);
  const [live, setLive] = useState(false);
  const speaker = useSentenceSpeaker(speech, speakOn || live);

  /* ---------------- chat ---------------- */
  const chat = useTutorChat({
    topicId: topic.id,
    locale,
    onDelta: (partial) => speaker.feed(partial),
    onDone: (full) => speaker.end(full),
    onTurn: () => persist({ turns: progRef.current.turns + 1 }),
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat.messages.length, chat.streaming]);

  // AI / network errors → toast (the three documented AI codes + transport).
  useEffect(() => {
    if (!chat.error) return;
    const e = chat.error;
    toast.error(
      e === "ai_unavailable"
        ? tc("aiUnavailable")
        : e === "no_keys_configured"
          ? tc("noKeys")
          : e === "bad_ai_output"
            ? tc("badOutput")
            : e === "rate_limited"
              ? tc("rateLimited")
              : e === "stream_interrupted"
                ? t("errInterrupted")
                : e === "network"
                  ? t("errNetwork")
                  : tc("errorGeneric")
    );
    if (live) setLive(false);
    chat.clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.error]);

  // Recognised speech → send (dictation and hands-free alike).
  useEffect(() => {
    if (speech.listening || speech.processing || !speech.transcript) return;
    const text = speech.transcript.trim();
    speech.setTranscript("");
    if (!text) return;
    if (!chat.started || chat.busy) return;
    speaker.reset();
    chat.send(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.listening, speech.processing, speech.transcript]);

  // STT failures: permission / support problems end hands-free mode.
  useEffect(() => {
    const err = speech.sttError;
    if (!err) return;
    if (err === "no-speech" || err === "aborted") {
      speech.clearSttError();
      return;
    }
    toast.error(err === "not-allowed" ? t("micDenied") : t("micError"));
    setLive(false);
    speech.clearSttError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.sttError]);

  // Hands-free loop: once the tutor has finished speaking and nothing is in
  // flight, start listening again.
  useEffect(() => {
    if (!live || !chat.started || chat.busy || !speaker.idle) return;
    if (speech.listening || speech.processing || speech.speaking || speech.transcript) return;
    const id = window.setTimeout(() => speech.startListening(), 450);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, chat.started, chat.busy, speaker.idle, speech.listening, speech.processing, speech.speaking, speech.transcript]);

  const startLesson = () => {
    speech.unlockAudio();
    if (!chat.busy) void chat.start();
  };

  const toggleMic = () => {
    if (speech.listening) {
      speech.stopListening();
      return;
    }
    speaker.reset();
    speech.unlockAudio();
    speech.startListening();
  };

  const toggleSpeak = () => {
    if (speakOn) speaker.reset();
    else speech.unlockAudio();
    setSpeakOn((v) => !v);
  };

  const toggleLive = () => {
    if (live) {
      setLive(false);
      if (speech.listening) speech.cancelListening();
      if (!speakOn) speaker.reset();
      return;
    }
    if (!speech.sttSupported) {
      toast.error(t("micUnsupported"));
      return;
    }
    speech.unlockAudio();
    setLive(true);
    if (!chat.started) startLesson();
  };

  const onSend = (text: string) => {
    speaker.reset();
    if (speech.listening) speech.stopListening();
    chat.send(text);
  };

  const onStop = () => {
    chat.stop();
    speaker.reset();
  };

  /* ---------------- step checklist (session-local) ---------------- */
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggleStep = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const onAnswer = (itemId: string, optionId: string) => {
    if (progRef.current.quiz[itemId]) return;
    persist({ quiz: { ...progRef.current.quiz, [itemId]: optionId } });
  };

  const status = speech.listening
    ? t("statusListening")
    : speech.processing
      ? t("statusRecognizing")
      : chat.busy
        ? t("statusThinking")
        : !speaker.idle
          ? t("statusSpeaking")
          : live
            ? t("statusWaiting")
            : null;

  const answeredQuiz = topic.quiz.filter((q) => quiz[q.id]).length;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* ---------------- chat ---------------- */}
      <Card className="flex h-[72dvh] min-h-[440px] min-w-0 flex-col overflow-hidden lg:h-[calc(100dvh-8rem)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-border/70 px-3 py-2">
          <Button asChild variant="ghost" size="icon" aria-label={t("back")} title={t("back")}>
            <Link href={`/tutor?agency=${topic.agency}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon name={agency?.icon ?? "GraduationCap"} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{localized(topic.title, locale)}</p>
            <p className="truncate text-xs text-muted-foreground">
              {agency ? localized(agency.short, locale) : ""} · {t("tutorName")}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant={speakOn || live ? "accent" : "ghost"}
              size="icon"
              onClick={toggleSpeak}
              disabled={live}
              aria-pressed={speakOn || live}
              aria-label={t("speakReplies")}
              title={t("speakReplies")}
            >
              {speakOn || live ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              variant={live ? "accent" : "outline"}
              className="h-10"
              onClick={toggleLive}
              aria-pressed={live}
              title={t("liveHint")}
            >
              <AudioLines className={cn("h-4 w-4", live && "animate-pulse")} />
              <span className="hidden sm:inline">{t("live")}</span>
            </Button>
          </div>
        </div>

        {status && (
          <div className="flex items-center gap-2 border-b border-border/50 bg-muted/40 px-4 py-1.5 text-xs text-muted-foreground">
            {speech.listening ? (
              <Mic className="h-3.5 w-3.5 animate-pulse text-accent" />
            ) : (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            {status}
            {live && speech.listening && (
              <button type="button" onClick={() => speech.stopListening()} className="ml-auto min-h-8 px-2 font-medium text-primary">
                {t("stopListening")}
              </button>
            )}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-4">
          {!chat.started && !chat.busy ? (
            <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg font-semibold">{localized(topic.title, locale)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{localized(topic.summary, locale)}</p>
              </div>
              <p className="text-sm text-muted-foreground">{t("introHow")}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="lg" onClick={startLesson}>
                  <Play className="h-4 w-4" /> {t("startLesson")}
                </Button>
                <Button size="lg" variant="outline" onClick={toggleLive}>
                  <AudioLines className="h-4 w-4" /> {t("startLive")}
                </Button>
              </div>
              {turns > 0 && (
                <p className="text-xs text-muted-foreground">{t("prevTurns", { count: turns })}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {chat.messages.map((m) => (
                <Bubble key={m.id} role={m.role} text={m.text} />
              ))}
              {chat.busy && (
                chat.streaming ? (
                  <Bubble role="tutor" text={chat.streaming} />
                ) : (
                  <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> {t("statusThinking")}
                  </div>
                )
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {chat.started && (
          <ChatComposer
            onSend={onSend}
            onStop={onStop}
            isStreaming={chat.busy}
            placeholder={speech.processing ? t("statusRecognizing") : t("placeholder")}
            onMic={speech.sttSupported ? toggleMic : undefined}
            micActive={speech.listening}
          />
        )}
      </Card>

      {/* ---------------- lesson card + quiz ---------------- */}
      <div className="min-w-0 space-y-4 lg:h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:pr-1">
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{t("progressTitle")}</span>
            {completed && (
              <Badge className="ml-auto gap-1" variant="outline">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {t("completed")}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-lg font-bold">
                {Math.min(turns, TUTOR_MIN_TURNS)}/{TUTOR_MIN_TURNS}
              </p>
              <p className="text-xs text-muted-foreground">{t("turnsLabel")}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-lg font-bold">
                {answeredQuiz}/{topic.quiz.length}
              </p>
              <p className="text-xs text-muted-foreground">{t("quizLabel")}</p>
            </div>
          </div>
          {!completed && <p className="mt-2 text-xs text-muted-foreground">{t("completeRule", { turns: TUTOR_MIN_TURNS })}</p>}
        </Card>

        <Card className="p-4">
          <LessonPanel topic={topic} locale={locale} checked={checked} onToggle={toggleStep} />
        </Card>

        <Card className="p-4">
          <QuickQuiz items={topic.quiz} locale={locale} answers={quiz} onAnswer={onAnswer} />
        </Card>
      </div>
    </div>
  );
}

function Bubble({ role, text }: { role: "learner" | "tutor"; text: string }) {
  const tutor = role === "tutor";
  return (
    <div className={cn("flex", tutor ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-4 py-2.5 text-sm shadow-xs",
          tutor ? "rounded-tl-sm border border-border/70 bg-card" : "rounded-tr-sm bg-primary text-primary-foreground"
        )}
      >
        {tutor ? <Markdown content={text} /> : <p className="whitespace-pre-wrap break-words">{text}</p>}
      </div>
    </div>
  );
}
