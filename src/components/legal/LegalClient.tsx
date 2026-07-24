"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Scale, AlertTriangle, FileText, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { useChatStream } from "@/hooks/useChatStream";

const DOC_KEYS = [
  "constitution",
  "criminal",
  "criminalProc",
  "family",
  "admin",
  "police",
  "prevention",
  "dv",
  "inspectorReg",
  "civil",
  "civilProc",
  "decrees",
  "resolutions",
] as const;

// lex.uz source per document (only where a confident document id exists).
const DOC_URL: Partial<Record<(typeof DOC_KEYS)[number], string>> = {
  criminal: "https://lex.uz/docs/-111453",
  criminalProc: "https://lex.uz/docs/-111460",
  family: "https://lex.uz/docs/-104720",
  admin: "https://lex.uz/docs/-97664",
  police: "https://lex.uz/acts/-3027843",
  prevention: "https://lex.uz/docs/-2387357",
  dv: "https://lex.uz/docs/-4494709",
  inspectorReg: "https://lex.uz/docs/-3175732",
};

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
      <div className="flex h-[70vh] min-h-0 flex-col overflow-hidden rounded-xl border bg-card shadow-card">
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)]">
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
        <div className="flex items-start gap-1.5 border-t border-accent/20 bg-accent/10 px-4 py-2.5 text-xs text-foreground/90">
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
          <p className="mb-3 text-sm font-semibold tracking-tight">{t("docListTitle")}</p>
          <div className="space-y-2">
            {DOC_KEYS.map((key) => (
              <div
                key={key}
                className="flex items-start gap-2.5 rounded-lg border border-border/70 p-2.5 transition-colors hover:border-primary/30 hover:bg-muted/40"
              >
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs font-medium leading-tight">
                    {t(`documents.${key}`)}
                  </p>
                  {DOC_URL[key] ? (
                    <a
                      href={DOC_URL[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      lex.uz
                    </a>
                  ) : (
                    <Badge variant="outline" className="mt-1 text-[10px]">
                      {t("pdfSoon")}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
