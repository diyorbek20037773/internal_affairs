"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatComposer } from "./ChatComposer";
import { RightPanel } from "./RightPanel";
import { useChatStream } from "@/hooks/useChatStream";
import { useSpeech } from "@/hooks/useSpeech";
import { useCases } from "@/hooks/useCases";
import { parseResponse } from "@/lib/parseResponse";
import { localCasesRepo } from "@/lib/storage/cases";
import { INCIDENT_TITLES, getSop } from "@/data/sops";
import { localized } from "@/data/sops/types";
import { initWorkflow, completeStep } from "@/lib/workflow/engine";
import {
  toggleChecklistItem,
  remainingChecklistLabels,
} from "@/lib/workflow/checklist";
import { uid } from "@/lib/utils";
import type { IncidentType } from "@/types/incident";
import type { Case, WorkflowState } from "@/lib/storage/schema";
import type { ChatMessage as ChatMessageT } from "@/types/chat";

interface Props {
  initialCaseId?: string;
  initialIncidentType?: IncidentType;
}

export function InspektorClient({ initialCaseId, initialIncidentType }: Props) {
  const t = useTranslations("chat");
  const tIncident = useTranslations("incident");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { saveCase } = useCases();

  const [meta, setMeta] = useState<{
    id: string;
    createdAt: string;
    incidentType: IncidentType;
    title: string;
  } | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowState | undefined>(undefined);

  const workflowRef = useRef<WorkflowState | undefined>(undefined);
  const metaRef = useRef<typeof meta>(null);
  workflowRef.current = workflow;
  metaRef.current = meta;

  const buildContext = useCallback(() => {
    const wf = workflowRef.current;
    if (!wf) return undefined;
    const sop = getSop(wf.sopType);
    const step = sop.steps.find((s) => s.id === wf.currentStepId);
    return {
      incidentType: wf.sopType,
      incidentLabel: localized(INCIDENT_TITLES[wf.sopType], locale),
      sopId: sop.type,
      currentStepTitle: step ? localized(step.title, locale) : undefined,
      remainingChecklist: remainingChecklistLabels(wf, locale),
    };
  }, [locale]);

  const persist = useCallback(
    (messages: ChatMessageT[]) => {
      const m = metaRef.current;
      const wf = workflowRef.current;
      if (!m || !wf) return;
      const record: Case = {
        id: m.id,
        createdAt: m.createdAt,
        updatedAt: new Date().toISOString(),
        incidentType: m.incidentType,
        title: m.title,
        workflow: wf,
        messages,
      };
      saveCase(record);
    },
    [saveCase]
  );

  const { messages, isStreaming, send, stop, reset, parsed, error } =
    useChatStream({
      endpoint: "/api/chat",
      onComplete: persist,
    });

  const messagesRef = useRef<ChatMessageT[]>([]);
  messagesRef.current = messages;

  // Bootstrap: load existing case or create a new one for the incident type.
  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    if (initialCaseId) {
      const existing = localCasesRepo.get(initialCaseId);
      if (existing) {
        setMeta({
          id: existing.id,
          createdAt: existing.createdAt,
          incidentType: existing.incidentType,
          title: existing.title,
        });
        setWorkflow(existing.workflow);
        reset(existing.messages);
        return;
      }
    }

    if (initialIncidentType) {
      const wf = initWorkflow(initialIncidentType);
      const title = `${localized(
        INCIDENT_TITLES[initialIncidentType],
        locale
      )} — ${new Date().toLocaleDateString(locale === "uz" ? "uz-UZ" : locale)}`;
      const m = {
        id: uid(),
        createdAt: new Date().toISOString(),
        incidentType: initialIncidentType,
        title,
      };
      setMeta(m);
      setWorkflow(wf);
      workflowRef.current = wf;
      metaRef.current = m;

      const primeText = tIncident("primeMessage", {
        type: localized(INCIDENT_TITLES[initialIncidentType], locale),
      });
      setTimeout(() => send(primeText, buildContext()), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) toast.error(errorMessage(error, tc));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleSend = useCallback(
    (text: string) => {
      send(text, buildContext());
    },
    [send, buildContext]
  );

  const handleToggle = useCallback(
    (itemId: string) => {
      setWorkflow((prev) => {
        if (!prev) return prev;
        const next = toggleChecklistItem(prev, itemId);
        workflowRef.current = next;
        persist(messagesRef.current);
        return next;
      });
    },
    [persist]
  );

  const handleCompleteStep = useCallback(() => {
    setWorkflow((prev) => {
      if (!prev) return prev;
      const next = completeStep(prev);
      workflowRef.current = next;
      persist(messagesRef.current);
      if (next.progressPct >= 100) toast.success("✓ 100%");
      return next;
    });
  }, [persist]);

  // ---- Ovozli rejim (STT -> yuborish, TTS -> javobni o'qish) ----
  const speech = useSpeech({ locale });
  const prevListeningRef = useRef(false);
  const spokenRef = useRef<string>("");
  const voiceModeRef = useRef(false); // oxirgi kiritish ovozli bo'lganmi

  // Tinglash tugagach (final transkript) -> avtomatik yuborish
  useEffect(() => {
    if (prevListeningRef.current && !speech.listening) {
      const text = speech.transcript.trim();
      if (text) {
        voiceModeRef.current = true;
        handleSend(text);
        speech.setTranscript("");
      }
    }
    prevListeningRef.current = speech.listening;
  }, [speech.listening, speech.transcript, handleSend, speech]);

  // Javobni faqat ovozli so'rovdan keyin ovozli o'qish
  const lastAssistant = useMemo(
    () => [...messages].reverse().find((m) => m.role === "assistant"),
    [messages]
  );
  useEffect(() => {
    if (isStreaming || !lastAssistant?.content) return;
    if (spokenRef.current === lastAssistant.id) return;
    spokenRef.current = lastAssistant.id;
    if (!voiceModeRef.current) return;
    const p = parseResponse(lastAssistant.content);
    const toSay = [p.firstAction, p.nextStep].filter(Boolean).join(". ");
    speech.speak(toSay || lastAssistant.content.slice(0, 400));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming, lastAssistant?.id]);

  const handleComposerSend = useCallback(
    (text: string) => {
      voiceModeRef.current = false; // yozilgan matn -> ovozli o'qilmaydi
      handleSend(text);
    },
    [handleSend]
  );

  const handleMic = useCallback(() => {
    if (speech.speaking) {
      speech.stopSpeaking();
      return;
    }
    if (speech.listening) speech.stopListening();
    else speech.startListening();
  }, [speech]);

  // Surface STT errors (mic permission, no speech, no mic, network, unsupported)
  useEffect(() => {
    if (!speech.sttError) return;
    const map: Record<string, string> = {
      "not-allowed": "voiceErrPermission",
      "service-not-allowed": "voiceErrPermission",
      "no-speech": "voiceErrNoSpeech",
      "audio-capture": "voiceErrMic",
      network: "voiceErrNetwork",
      unsupported: "voiceErrUnsupported",
    };
    const key = map[speech.sttError] || "voiceErrGeneric";
    toast.error(t(key));
    speech.clearSttError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.sttError]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const empty = messages.length === 0;

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
      {/* CHAT */}
      <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border bg-card shadow-card">
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin"
        >
          {empty ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)]">
                <span className="text-2xl">🚔</span>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                {t("empty")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                {t("emptyHint")}
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <ChatMessage
                key={m.id}
                message={m}
                streaming={
                  isStreaming &&
                  i === messages.length - 1 &&
                  m.role === "assistant"
                }
              />
            ))
          )}
        </div>
        {(speech.listening || speech.speaking) && (
          <div className="flex items-center gap-2 border-t border-border/70 bg-accent/10 px-4 py-1.5 text-xs font-medium text-foreground">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-accent" />
            {speech.listening ? t("voiceListening") : t("voiceSpeaking")}
          </div>
        )}
        <ChatComposer
          onSend={handleComposerSend}
          onStop={stop}
          isStreaming={isStreaming}
          placeholder={t("placeholder")}
          onMic={speech.sttSupported ? handleMic : undefined}
          micActive={speech.listening || speech.speaking}
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden min-h-0 rounded-xl border bg-card p-3 shadow-card lg:block">
        <RightPanel
          state={workflow}
          parsed={parsed}
          onToggleItem={handleToggle}
          onCompleteStep={handleCompleteStep}
        />
      </div>
    </div>
  );
}

function errorMessage(code: string, tc: (k: string) => string): string {
  if (code === "ai_unavailable") return tc("aiUnavailable");
  if (code === "no_keys_configured") return tc("noKeys");
  if (code === "invalid_request") return tc("errorGeneric");
  if (code === "internal_error" || !code) return tc("errorGeneric");
  // Otherwise surface the real (Gemini) error text to help diagnose.
  return `${tc("errorGeneric")} (${code})`;
}
