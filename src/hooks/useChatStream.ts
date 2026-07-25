"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { uid } from "@/lib/utils";
import { parseResponse } from "@/lib/parseResponse";
import type {
  ChatMessage,
  ParsedResponse,
  WorkflowContext,
} from "@/types/chat";

interface UseChatStreamOptions {
  endpoint?: string;
  initialMessages?: ChatMessage[];
  onComplete?: (messages: ChatMessage[]) => void;
}

export function useChatStream({
  endpoint = "/api/chat",
  initialMessages = [],
  onComplete,
}: UseChatStreamOptions = {}) {
  const locale = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string, context?: WorkflowContext) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;
      setError(null);

      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      const assistantMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };

      const history = [...messages, userMsg];
      setMessages([...history, assistantMsg]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: history.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            locale,
            context,
          }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, content: acc } : m
            )
          );
        }

        const finalMessages = [
          ...history,
          { ...assistantMsg, content: acc },
        ];
        onComplete?.(finalMessages);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // keep partial content
        } else {
          setError((err as Error).message || "error");
          setMessages((prev) =>
            prev.filter((m) => m.id !== assistantMsg.id || m.content.length > 0)
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [endpoint, isStreaming, locale, messages, onComplete]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback((msgs: ChatMessage[] = []) => {
    setMessages(msgs);
    setError(null);
  }, []);

  const lastAssistant = useMemo(
    () => [...messages].reverse().find((m) => m.role === "assistant"),
    [messages]
  );

  const parsed: ParsedResponse = useMemo(
    () => parseResponse(lastAssistant?.content ?? ""),
    [lastAssistant?.content]
  );

  return { messages, isStreaming, error, send, stop, reset, parsed };
}
