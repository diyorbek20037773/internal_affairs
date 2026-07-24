"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Scale, AlertTriangle, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { useChatStream } from "@/hooks/useChatStream";

const DOC_KEYS = [
  "constitution",
  "criminal",
  "criminalProc",
  "civil",
  "civilProc",
  "family",
  "admin",
  "police",
  "decrees",
  "resolutions",
] as const;

export function LegalClient() {
  const t = useTranslations("legal");
  const tc = useTranslations("common");
  const { messages, isStreaming, send, stop, error } = useChatStream({
    endpoint: "/api/legal",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast.error(
        error === "ai_unavailable"
          ? tc("aiUnavailable")
          : error === "no_keys_configured"
          ? tc("noKeys")
          : tc("errorGeneric")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      {/* CHAT */}
      <div className="flex h-[70vh] min-h-0 flex-col overflow-hidden rounded-xl border bg-card">
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Scale className="h-7 w-7" />
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                {t("empty")}
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <ChatMessage
                key={m.id}
                message={m}
                streaming={
                  isStreaming && i === messages.length - 1 && m.role === "assistant"
                }
              />
            ))
          )}
        </div>
        <div className="flex items-start gap-1.5 border-t bg-accent/5 px-4 py-2 text-xs text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          <span>{tc("disclaimer")}</span>
        </div>
        <ChatComposer
          onSend={(text) => send(text)}
          onStop={stop}
          isStreaming={isStreaming}
          placeholder={t("placeholder")}
        />
      </div>

      {/* DOCUMENT BASE */}
      <div>
        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold">{t("docListTitle")}</p>
          <div className="space-y-2">
            {DOC_KEYS.map((key) => (
              <div
                key={key}
                className="flex items-start gap-2.5 rounded-lg border p-2.5"
              >
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs font-medium leading-tight">
                    {t(`documents.${key}`)}
                  </p>
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {t("pdfSoon")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
