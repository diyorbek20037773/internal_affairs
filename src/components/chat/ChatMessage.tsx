"use client";

import { Bot, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Markdown } from "./Markdown";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";

export function ChatMessage({
  message,
  streaming,
}: {
  message: ChatMessageType;
  streaming?: boolean;
}) {
  const t = useTranslations("common");
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 animate-fade-in", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-xs",
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      <div
        className={cn(
          "min-w-0 max-w-[85%] rounded-2xl px-4 py-3 shadow-xs",
          isUser
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm border border-border/80 bg-card"
        )}
      >
        <p className="mb-1 text-[11px] font-medium opacity-70">
          {isUser ? t("you") : t("ai")}
        </p>
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        ) : (
          <>
            <Markdown content={message.content || ""} />
            {streaming && !message.content && (
              <span className="inline-flex gap-1 py-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
