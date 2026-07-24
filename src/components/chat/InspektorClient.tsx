"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatComposer } from "./ChatComposer";
import { RightPanel } from "./RightPanel";
import { useChatStream } from "@/hooks/useChatStream";
import { useCases } from "@/hooks/useCases";
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
        <ChatComposer
          onSend={handleSend}
          onStop={stop}
          isStreaming={isStreaming}
          placeholder={t("placeholder")}
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
  return tc("errorGeneric");
}
