"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Mic, Square, Send, Volume2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useSpeech } from "@/hooks/useSpeech";
import { useChatStream } from "@/hooks/useChatStream";
import { parseResponse } from "@/lib/parseResponse";
import { cn } from "@/lib/utils";

export function VoiceClient() {
  const t = useTranslations("voice");
  const tc = useTranslations("common");
  const locale = useLocale();

  const {
    sttSupported,
    listening,
    speaking,
    transcript,
    interim,
    setTranscript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useSpeech({ locale });

  const { messages, isStreaming, send } = useChatStream({ endpoint: "/api/chat" });
  const [manual, setManual] = useState("");
  const spokenRef = useRef<string>("");

  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");

  // Speak the assistant's key sections once streaming settles.
  useEffect(() => {
    if (isStreaming || !lastAssistant?.content) return;
    if (spokenRef.current === lastAssistant.id) return;
    spokenRef.current = lastAssistant.id;
    const parsed = parseResponse(lastAssistant.content);
    const toSay = [parsed.firstAction, parsed.nextStep]
      .filter(Boolean)
      .join(". ");
    speak(toSay || lastAssistant.content.slice(0, 400));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming, lastAssistant?.id]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setTranscript("");
    setManual("");
    send(value);
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[320px_1fr]">
      {/* ORB */}
      <Card className="relative flex flex-col items-center justify-center gap-6 overflow-hidden p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,hsl(var(--primary)/0.12),transparent_70%)]"
        />
        <div className="relative flex h-40 w-40 items-center justify-center">
          <span className="absolute inset-[6px] rounded-full bg-gradient-to-b from-primary/10 to-accent/10 blur-xl" />
          {(listening || speaking) && (
            <>
              <span
                className={cn(
                  "absolute inset-0 animate-pulse-ring rounded-full",
                  listening ? "bg-destructive/30" : "bg-accent/30"
                )}
              />
              <span
                className={cn(
                  "absolute inset-0 animate-pulse-ring rounded-full [animation-delay:0.4s]",
                  listening ? "bg-destructive/20" : "bg-accent/20"
                )}
              />
            </>
          )}
          <button
            onClick={() => {
              if (speaking) return stopSpeaking();
              if (listening) {
                stopListening();
                submit(transcript);
              } else {
                startListening();
              }
            }}
            disabled={!sttSupported}
            className={cn(
              "relative z-10 flex h-32 w-32 items-center justify-center rounded-full text-white shadow-elevated ring-4 ring-black/5 transition-all duration-300 hover:scale-[1.04] active:scale-100 disabled:opacity-40 disabled:hover:scale-100 dark:ring-white/10",
              listening
                ? "bg-gradient-to-br from-destructive to-red-800"
                : speaking
                ? "bg-gradient-to-br from-accent to-amber-600"
                : "bg-gradient-to-br from-[hsl(222,62%,34%)] to-[hsl(222,60%,15%)]"
            )}
          >
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-white/0 to-black/10" />
            {speaking ? (
              <Volume2 className="relative h-12 w-12" />
            ) : listening ? (
              <Square className="relative h-11 w-11" />
            ) : (
              <Mic className="relative h-12 w-12" />
            )}
          </button>
        </div>
        <p className="relative text-center text-sm font-semibold tracking-tight">
          {speaking
            ? t("speaking")
            : listening
            ? t("listening")
            : t("tapToSpeak")}
        </p>
        {!sttSupported && (
          <div className="relative flex items-start gap-2 rounded-lg border border-border/70 bg-muted p-3 text-xs text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{t("unsupported")}</span>
          </div>
        )}
        {sttSupported && (
          <div className="relative flex items-start gap-2 rounded-lg border border-accent/25 bg-accent/10 p-3 text-xs text-foreground">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <span>{t("uzWarning")}</span>
          </div>
        )}
      </Card>

      {/* TRANSCRIPT + RESPONSE */}
      <div className="space-y-4">
        <Card className="p-4">
          <p className="label-eyebrow mb-2">{t("transcript")}</p>
          <Textarea
            value={transcript + (interim ? ` ${interim}` : "")}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={t("textFallback")}
            className="min-h-[80px]"
          />
          <div className="mt-2 flex justify-end">
            <Button
              onClick={() => submit(transcript || manual)}
              disabled={isStreaming || !(transcript || manual).trim()}
            >
              <Send className="h-4 w-4" />
              {t("send")}
            </Button>
          </div>
        </Card>

        {lastAssistant && (
          <Card className="p-4">
            <p className="label-eyebrow mb-2 flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5" />
              {tc("ai")}
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {lastAssistant.content ||
                (isStreaming ? tc("loading") : "")}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
