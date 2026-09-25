"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Mail, Landmark, FileText, Lock } from "lucide-react";
import { localized } from "@/data/sops/types";
import type { SimMaterial } from "@/data/kasblar/types";
import { Body, DataTable, EmptyEnv, MaterialCard, MetaTable, NewBadge, TabStrip, type EnvProps } from "./shared";
import { cn } from "@/lib/utils";

type Tab = "chat" | "mail" | "bank" | "files";
const tabOf = (m: SimMaterial): Tab => (m.kind === "message" ? "chat" : m.kind === "email" ? "mail" : m.kind === "transaction" ? "bank" : "files");

/** Kiber: a closed sandbox desktop — messenger, mail client, bank statement, files. */
export function CyberSandbox({ materials, newIds, locale }: EnvProps) {
  const t = useTranslations("kasbsim.env.cyber");
  const groups: Record<Tab, SimMaterial[]> = { chat: [], mail: [], bank: [], files: [] };
  for (const m of materials) groups[tabOf(m)].push(m);
  const tabs = (Object.keys(groups) as Tab[]).filter((k) => groups[k].length > 0);
  const newestTab = (() => {
    const n = materials.filter((m) => newIds.has(m.id)).at(-1);
    return n ? tabOf(n) : undefined;
  })();
  const [tab, setTab] = useState<Tab>(tabs[0] ?? "chat");
  useEffect(() => {
    if (newestTab) setTab(newestTab);
  }, [newestTab]);
  if (!materials.length) return <EmptyEnv />;
  const active = tabs.includes(tab) ? tab : tabs[0];
  const icons: Record<Tab, React.ReactNode> = {
    chat: <MessageCircle className="h-3.5 w-3.5" />,
    mail: <Mail className="h-3.5 w-3.5" />,
    bank: <Landmark className="h-3.5 w-3.5" />,
    files: <FileText className="h-3.5 w-3.5" />,
  };

  return (
    <div className="overflow-hidden rounded-lg border border-[#334e68] bg-[#102a43] p-2 text-[#d9e2ec]">
      <div className="mb-2 flex items-center gap-2 px-1 text-[11px]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ef4e4e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f0b429]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3ebd93]" />
        <span className="ml-2 flex min-w-0 items-center gap-1 truncate rounded bg-[#243b53] px-2 py-0.5 font-mono">
          <Lock className="h-3 w-3" /> sandbox://{t("isolated")}
        </span>
      </div>
      <TabStrip
        items={tabs.map((k) => ({ id: k, label: t(k), icon: icons[k], isNew: groups[k].some((m) => newIds.has(m.id)) }))}
        active={active}
        onPick={setTab}
      />
      <div className="min-h-[300px] space-y-2 rounded-b-md rounded-tr-md bg-card p-3 text-foreground">
        {active === "chat" &&
          groups.chat.map((m, i) => (
            <div key={m.id} className={cn("flex", i % 2 ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[88%] rounded-2xl px-3 py-2 shadow-sm", i % 2 ? "rounded-br-sm bg-[#d6f5e3] dark:bg-[#1f4d3a]" : "rounded-bl-sm bg-muted")}>
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2680c2]">{localized(m.title, locale)}</span>
                  <NewBadge show={newIds.has(m.id)} />
                </div>
                <Body m={m} locale={locale} />
                <MetaTable m={m} locale={locale} className="mt-1 opacity-80" />
                <DataTable m={m} className="mt-1" />
              </div>
            </div>
          ))}
        {active === "mail" &&
          groups.mail.map((m) => (
            <div key={m.id} className={cn("rounded-md border bg-background", m.tone === "warn" ? "border-accent/60" : "border-border")}>
              <div className="flex items-start justify-between gap-2 border-b bg-muted/40 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{localized(m.title, locale)}</p>
                  <MetaTable m={m} locale={locale} className="mt-1" />
                </div>
                <NewBadge show={newIds.has(m.id)} />
              </div>
              <Body m={m} locale={locale} className="px-3 py-2" />
              <DataTable m={m} className="m-2" />
            </div>
          ))}
        {active === "bank" &&
          groups.bank.map((m) => (
            <div key={m.id} className="rounded-md border border-border bg-background p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Landmark className="h-4 w-4 text-primary" /> {localized(m.title, locale)}
                </p>
                <NewBadge show={newIds.has(m.id)} />
              </div>
              <Body m={m} locale={locale} className="text-xs text-muted-foreground" />
              <MetaTable m={m} locale={locale} className="mt-2 font-mono" />
              <DataTable m={m} className="mt-2 font-mono" />
            </div>
          ))}
        {active === "files" && groups.files.map((m) => <MaterialCard key={m.id} m={m} locale={locale} isNew={newIds.has(m.id)} />)}
      </div>
    </div>
  );
}
