"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square, Mic } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ChatComposer({
  onSend,
  onStop,
  isStreaming,
  placeholder,
  onMic,
  micActive,
}: {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  placeholder: string;
  onMic?: () => void;
  micActive?: boolean;
}) {
  const t = useTranslations("chat");
  const tc = useTranslations("common");
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if (!text || isStreaming) return;
    onSend(text);
    setValue("");
  };

  return (
    <div className="border-t bg-background p-3">
      <div className="flex items-end gap-2 rounded-xl border bg-card p-2 focus-within:ring-2 focus-within:ring-ring">
        {onMic && (
          <Button
            type="button"
            variant={micActive ? "accent" : "ghost"}
            size="icon"
            className="shrink-0"
            onClick={onMic}
            aria-label="Mic"
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          rows={1}
          className="min-h-0 resize-none border-0 bg-transparent px-1 py-2 shadow-none focus-visible:ring-0"
        />
        {isStreaming ? (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="shrink-0"
            onClick={onStop}
            aria-label={t("stop")}
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            className="shrink-0"
            onClick={submit}
            disabled={!value.trim()}
            aria-label={tc("send")}
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
