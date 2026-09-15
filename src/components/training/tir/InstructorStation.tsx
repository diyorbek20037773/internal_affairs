"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Flame, Pause, Play, Square, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTirScenario } from "@/data/scenarios";
import { localized } from "@/data/sops/types";
import { ACTOR_TEXT, primarySuspect, type InstructorCmd, type TirState } from "@/lib/training/tirEngine";
import { tirChannelName } from "./TirClient";
import { cn } from "@/lib/utils";

/**
 * Instructor station ("ghost mode") — opened on a second screen/tablet in the
 * same browser profile. Mirrors the live state over BroadcastChannel and
 * sends commands back to the running range.
 */
export function InstructorStation({ sessionId, scenarioId }: { sessionId: string; scenarioId: string }) {
  const t = useTranslations("sim.tir");
  const locale = useLocale();
  const scenario = getTirScenario(scenarioId);
  const [state, setState] = useState<TirState | null>(null);
  const [connected, setConnected] = useState(false);
  const ch = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel(tirChannelName(sessionId));
    ch.current = c;
    c.onmessage = (ev: MessageEvent<{ type: "state"; state: TirState }>) => {
      if (ev.data?.type === "state") { setState(ev.data.state); setConnected(true); }
    };
    c.postMessage({ type: "hello" });
    const ping = window.setInterval(() => { if (!connected) c.postMessage({ type: "hello" }); }, 2000);
    return () => { window.clearInterval(ping); c.close(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const send = (cmd: InstructorCmd) => ch.current?.postMessage({ type: "cmd", cmd });
  if (!scenario) return <Card className="p-6 text-sm text-muted-foreground">—</Card>;
  const primary = state ? primarySuspect(state) : undefined;

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{scenario.code} · {t("instructor")}</p>
          <p className="font-semibold">{localized(scenario.title, locale)}</p>
        </div>
        <Badge variant={connected ? "success" : "outline"}>{connected ? t("ins.connected") : t("ins.waiting")}</Badge>
      </Card>

      {state && (
        <Card className="grid gap-3 p-4 sm:grid-cols-4">
          <Stat label={t("time")} value={`${Math.round(state.t)}s`} />
          <Stat label={t("shots")} value={`${state.hits}/${state.shotsFired}`} />
          <Stat label="⚡" value={String(state.officerHits)} tone={state.officerHits ? "bad" : undefined} />
          <Stat label={t("armed")} value={state.weaponDrawn ? "✓" : "—"} />
          {primary && (
            <div className="sm:col-span-4 grid gap-2 sm:grid-cols-3">
              <Meter label={t("ins.agitation")} value={primary.agitation} tone="bad" />
              <Meter label={t("ins.compliance")} value={primary.compliance} tone="good" />
              <div className="rounded-lg border p-2 text-sm">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{primary.name}</p>
                <p className="font-semibold">{ACTOR_TEXT[primary.state] ?? primary.state}</p>
                <p className="text-xs text-muted-foreground">{Math.hypot(primary.x, primary.z).toFixed(1)} m</p>
              </div>
            </div>
          )}
        </Card>
      )}

      <Card className="p-4">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Flame className="h-3.5 w-3.5 text-accent" /> {t("ins.commands")}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => send({ cmd: "escalate" })}>↑ {t("ins.escalate")}</Button>
          <Button variant="outline" onClick={() => send({ cmd: "deescalate" })}>↓ {t("ins.deescalate")}</Button>
          {scenario.actors.filter((a) => a.hidden && !state?.actors.find((x) => x.id === a.id && !x.hidden)).map((a) => (
            <Button key={a.id} variant="outline" onClick={() => send({ cmd: "spawn", actorId: a.id })}>+ {a.name}</Button>
          ))}
          {primary && primary.kind === "human" && (
            <>
              <Button variant="outline" onClick={() => send({ cmd: "set_state", actorId: primary.id, state: "weapon_raised" })}>{ACTOR_TEXT.weapon_raised}</Button>
              <Button variant="outline" onClick={() => send({ cmd: "set_state", actorId: primary.id, state: "dropping" })}>{ACTOR_TEXT.dropping}</Button>
            </>
          )}
          {primary && primary.kind === "vehicle" && (
            <>
              <Button variant="outline" onClick={() => send({ cmd: "set_state", actorId: primary.id, state: "charging" })}>{ACTOR_TEXT.charging}</Button>
              <Button variant="outline" onClick={() => send({ cmd: "set_state", actorId: primary.id, state: "stopped" })}>{ACTOR_TEXT.stopped}</Button>
            </>
          )}
          <Button variant="outline" onClick={() => send({ cmd: state?.paused ? "resume" : "pause" })}>{state?.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />} {state?.paused ? t("ins.resume") : t("ins.pause")}</Button>
          <Button variant="destructive" onClick={() => send({ cmd: "all_stop" })}><Square className="h-4 w-4" /> ALL STOP</Button>
        </div>
        <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground"><Radio className="h-3 w-3" /> {t("ins.hint")}</p>
      </Card>

      {state && (
        <Card className="max-h-72 overflow-y-auto p-3 text-xs scrollbar-thin">
          <ol className="space-y-1">
            {[...state.events].reverse().slice(0, 30).map((e, i) => (
              <li key={i} className="flex gap-2">
                <span className="w-10 shrink-0 font-mono text-muted-foreground">t:{Math.round(e.t)}</span>
                <span className={cn("shrink-0 font-semibold", e.kind === "action" ? "text-primary" : e.kind === "shock" ? "text-destructive" : "text-accent")}>{e.kind === "action" ? "XODIM" : e.kind === "shock" ? "⚡" : "SAHNA"}</span>
                <span className="flex-1">{e.text}</span>
                {e.legality != null && <span className="shrink-0 font-mono">Q{e.legality}/M{e.proportionality}</span>}
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "bad" }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className={cn("text-xl font-bold tabular-nums", tone === "bad" && "text-destructive")}>{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
function Meter({ label, value, tone }: { label: string; value: number; tone: "good" | "bad" }) {
  return (
    <div className="rounded-lg border p-2">
      <div className="mb-1 flex justify-between text-[11px]"><span className="text-muted-foreground">{label}</span><span className="font-mono">{Math.round(value)}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary"><div className={cn("h-full", tone === "bad" ? "bg-destructive" : "bg-success")} style={{ width: `${value}%` }} /></div>
    </div>
  );
}
