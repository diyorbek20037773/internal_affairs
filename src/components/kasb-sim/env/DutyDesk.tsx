"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Inbox, Phone, FileText, MessageSquare } from "lucide-react";
import { localized } from "@/data/sops/types";
import type { SimMaterial } from "@/data/kasblar/types";
import { Body, DataTable, EmptyEnv, MaterialCard, MetaTable, NewBadge, type EnvProps } from "./shared";
import { cn } from "@/lib/utils";

const INBOX_KINDS = new Set(["application", "message", "email"]);

function channelIcon(m: SimMaterial) {
  const ch = (m.meta ?? []).map((x) => x.value.toLowerCase()).join(" ");
  if (ch.includes("102") || ch.includes("telefon")) return <Phone className="h-4 w-4" />;
  if (m.kind === "message" || ch.includes("telegram")) return <MessageSquare className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
}

/** Surishtiruvchi / profilaktika: the duty desk — an inbox of stamped applications plus desk papers. */
export function DutyDesk({ materials, newIds, locale }: EnvProps) {
  const t = useTranslations("kasbsim.env");
  const inbox = materials.filter((m) => INBOX_KINDS.has(m.kind));
  const desk = materials.filter((m) => !INBOX_KINDS.has(m.kind));
  const [open, setOpen] = useState(inbox[0]?.id ?? "");
  const newest = inbox.filter((m) => newIds.has(m.id)).at(-1)?.id;
  useEffect(() => {
    if (newest) setOpen(newest);
  }, [newest]);
  if (!materials.length) return <EmptyEnv />;
  const current = inbox.find((m) => m.id === open) ?? inbox[0];

  return (
    <div className="space-y-3 rounded-lg bg-[#2f3b4c]/10 p-2 dark:bg-[#2f3b4c]/40">
      {inbox.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Inbox className="h-4 w-4" /> {t("dutyDesk.inbox")} · {inbox.length}
          </div>
          <ul className="divide-y">
            {inbox.map((m) => {
              const time = m.meta?.find((x) => /vaqt|время|time/i.test(x.label.uz + (x.label.ru ?? "")))?.value;
              return (
                <li key={m.id}>
                  <button
                    onClick={() => setOpen(m.id)}
                    className={cn(
                      "flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                      current?.id === m.id ? "bg-primary/10" : "hover:bg-muted/60"
                    )}
                  >
                    <span className={cn("text-muted-foreground", m.tone === "warn" && "text-accent")}>{channelIcon(m)}</span>
                    <span className="min-w-0 flex-1 truncate font-medium">{localized(m.title, locale)}</span>
                    {time && <span className="shrink-0 font-mono text-xs text-muted-foreground">{time}</span>}
                    {newIds.has(m.id) && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {current && (
        <div className="relative overflow-hidden rounded-lg border border-border bg-[#fffef9] p-4 shadow-sm dark:bg-card">
          <div
            aria-hidden
            className="pointer-events-none absolute right-3 top-3 rotate-[-8deg] rounded border-2 border-[#1d4ed8]/60 px-2 py-1 text-center font-mono text-[10px] font-bold uppercase leading-tight text-[#1d4ed8]/70"
          >
            {t("dutyDesk.stamp")}
            <br />
            {current.meta?.find((x) => /vaqt|время|time/i.test(x.label.uz + (x.label.ru ?? "")))?.value ?? ""}
          </div>
          <div className="mb-2 flex items-start gap-2 pr-24">
            <h4 className="text-sm font-bold leading-snug">{localized(current.title, locale)}</h4>
            <NewBadge show={newIds.has(current.id)} />
          </div>
          <Body m={current} locale={locale} />
          <MetaTable m={current} locale={locale} className="mt-3" />
          <DataTable m={current} className="mt-3" />
        </div>
      )}

      {desk.length > 0 && (
        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("dutyDesk.desk")}</p>
          {desk.map((m) => (
            <MaterialCard key={m.id} m={m} locale={locale} isNew={newIds.has(m.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
