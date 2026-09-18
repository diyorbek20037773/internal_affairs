"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Crosshair, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localized } from "@/data/sops/types";
import type { DecisionTask } from "@/data/scenarios/types";
import { resolveTaps, scoreScan, type TaskResult } from "@/lib/training/decisionEngine";
import { cn } from "@/lib/utils";

type ScanTaskDef = Extract<DecisionTask, { kind: "scan" }>;
type Tap = { x: number; y: number };

/** Scene box is 16:10 — hotspot coordinates are % of width / height. */
const W = 160;
const H = 100;

/**
 * Free-tap scene analysis: the officer marks anything they consider a risk or
 * important. Taps are matched to authored hotspots only on submit, so the
 * scene gives no hint which objects count.
 */
export function ScanTask({ task, onSubmit }: { task: ScanTaskDef; onSubmit: (r: TaskResult) => void }) {
  const t = useTranslations("sim.decision.task.scan");
  const [taps, setTaps] = useState<Tap[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  const onTap = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    // Tapping an existing mark removes it.
    const near = taps.findIndex((p) => Math.hypot(p.x - x, (p.y - y) / 1.6) < 4);
    setTaps(near >= 0 ? taps.filter((_, i) => i !== near) : [...taps, { x, y }]);
  };

  const finish = () => {
    const { picks, misses } = resolveTaps(task, taps);
    onSubmit({ score: scoreScan(task, picks, misses), picks, misses });
  };

  return (
    <div className="space-y-3">
      <div
        ref={boxRef}
        onPointerDown={onTap}
        className="relative aspect-[16/10] w-full cursor-crosshair touch-manipulation select-none overflow-hidden rounded-xl border border-border/80 shadow-card"
        data-testid="scan-scene"
      >
        <Scene id={task.scene} />
        {taps.map((p, i) => (
          <span
            key={i}
            className="pointer-events-none absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-amber-300 bg-amber-400/25 text-xs font-bold text-amber-100 shadow-[0_0_0_3px_rgba(0,0,0,0.35)]"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Crosshair className="h-4 w-4" /> {t("marks", { n: taps.length })}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" disabled={!taps.length} onClick={() => setTaps([])}>
            <Eraser className="h-4 w-4" /> {t("clear")}
          </Button>
          <Button onClick={finish} disabled={!taps.length}>
            {t("finish")}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** After grading: every hotspot revealed with its label, found vs missed. */
export function ScanReview({ task, picks, misses }: { task: ScanTaskDef; picks: string[]; misses: number }) {
  const t = useTranslations("sim.decision.task.scan");
  const locale = useLocale();
  const set = new Set(picks);
  // Hazards get numbers; a distractor only shows up if it was (wrongly) marked.
  const shown = task.hotspots.filter((h) => h.hazard || set.has(h.id));
  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/80">
        <Scene id={task.scene} />
        {shown.map((h, i) => {
          const hit = set.has(h.id);
          return (
            <span
              key={h.id}
              className={cn(
                "pointer-events-none absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-bold text-white shadow-[0_0_0_3px_rgba(0,0,0,0.35)]",
                !h.hazard ? "border-slate-300 bg-slate-500" : hit ? "border-emerald-200 bg-emerald-600" : "border-red-200 bg-red-600"
              )}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              {i + 1}
            </span>
          );
        })}
      </div>
      <ul className="space-y-1.5 text-sm">
        {shown.map((h, i) => {
          const hit = set.has(h.id);
          return (
            <li key={h.id} className="flex gap-2">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                  !h.hazard ? "bg-slate-500" : hit ? "bg-emerald-600" : "bg-red-600"
                )}
              >
                {i + 1}
              </span>
              <span>
                <span className={cn("font-semibold", !h.hazard ? "text-muted-foreground" : hit ? "text-success" : "text-destructive")}>
                  {!h.hazard ? t("distractor") : hit ? t("found") : t("missed")}:
                </span>{" "}
                <b>{localized(h.label, locale)}</b>
                {h.note ? ` — ${localized(h.note, locale)}` : ""}
              </span>
            </li>
          );
        })}
        {misses > 0 && <li className="text-muted-foreground">{t("falseAlarm", { n: misses })}</li>}
      </ul>
    </div>
  );
}

function Scene({ id }: { id: string }) {
  if (id === "podyezd") return <PodyezdScene />;
  return <div className="h-full w-full bg-muted" />;
}

/** Third-floor landing at night: stairs up (left), flat 12 ajar (centre), neighbour's door (right). */
function PodyezdScene() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="pz-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b4252" />
          <stop offset="1" stopColor="#2e3440" />
        </linearGradient>
        <linearGradient id="pz-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c4f56" />
          <stop offset="1" stopColor="#5d6068" />
        </linearGradient>
        <linearGradient id="pz-stairs" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#434c5e" />
          <stop offset="1" stopColor="#0b0d12" />
        </linearGradient>
        <linearGradient id="pz-light" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f6d38a" />
          <stop offset="1" stopColor="#c99b4e" />
        </linearGradient>
        <radialGradient id="pz-lamp" cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* wall + floor */}
      <rect width={W} height={H} fill="url(#pz-wall)" />
      <rect y="78" width={W} height="22" fill="url(#pz-floor)" />
      <line x1="0" y1="78" x2={W} y2="78" stroke="#1f232b" strokeWidth="0.6" />
      <rect x="0" y="52" width={W} height="1" fill="#566076" opacity="0.5" />
      <ellipse cx="80" cy="0" rx="70" ry="60" fill="url(#pz-lamp)" />
      <rect x="74" y="0" width="12" height="2.5" rx="1" fill="#d8dee9" opacity="0.7" />

      {/* stairs going up into the dark */}
      <polygon points="0,78 0,4 46,4 46,20 40,20 40,30 34,30 34,40 28,40 28,50 22,50 22,60 16,60 16,70 10,70 10,78" fill="url(#pz-stairs)" />
      {[20, 30, 40, 50, 60, 70].map((y, i) => (
        <line key={y} x1={40 - i * 6} y1={y} x2={46 - i * 6} y2={y} stroke="#5e6779" strokeWidth="0.5" opacity="0.6" />
      ))}
      <line x1="3" y1="74" x2="44" y2="10" stroke="#8a93a6" strokeWidth="0.9" opacity="0.7" />

      {/* mailboxes */}
      <g transform="translate(110,12)">
        <rect width="24" height="16" rx="0.8" fill="#6b7a8f" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <rect key={`${r}${c}`} x={1.2 + c * 5.7} y={1.2 + r * 5} width="4.8" height="4.2" fill="#56657a" stroke="#465366" strokeWidth="0.3" />
          ))
        )}
      </g>

      {/* flat 12 — door ajar with light from the hallway */}
      <rect x="64" y="17" width="32" height="61" fill="#20242c" />
      <rect x="66" y="19" width="28" height="59" fill="url(#pz-light)" />
      {/* hallway shelf with a knife */}
      <rect x="84" y="46" width="10" height="1.2" fill="#7a5a33" />
      <g transform="translate(86.5,44.2) rotate(-8)">
        <rect x="0" y="0" width="3.2" height="1.3" rx="0.4" fill="#2b2b2b" />
        <polygon points="3.2,0.1 8.6,0.55 3.2,1.2" fill="#e5e9f0" />
      </g>
      {/* silhouette deep in the hallway */}
      <ellipse cx="90" cy="35" rx="2.2" ry="2.6" fill="#6d5738" opacity="0.55" />
      <rect x="87.6" y="37.5" width="4.8" height="14" rx="2" fill="#6d5738" opacity="0.45" />
      {/* door leaf swung inward */}
      <polygon points="66,19 81,23 81,74 66,78" fill="#7b4f2c" stroke="#5a381d" strokeWidth="0.6" />
      <circle cx="78.5" cy="50" r="0.9" fill="#d8b36a" />
      <rect x="70" y="10.5" width="20" height="5" rx="0.8" fill="#e5e9f0" />
      <text x="80" y="14.4" textAnchor="middle" fontSize="4" fontWeight="700" fill="#2e3440">12</text>
      {/* doormat */}
      <rect x="68" y="80" width="24" height="4" rx="0.6" fill="#6e4b3a" />

      {/* child's shoes */}
      <g transform="translate(57,80.5)">
        <path d="M0,2.2 Q0,0 2.2,0 L3.6,0 Q4.2,1.3 5.8,1.4 Q6.4,1.6 6.4,2.4 L6.4,3 L0,3 Z" fill="#e06c75" />
        <path d="M2,4.6 Q2,2.4 4.2,2.4 L5.6,2.4 Q6.2,3.7 7.8,3.8 Q8.4,4 8.4,4.8 L8.4,5.4 L2,5.4 Z" fill="#d05560" />
      </g>

      {/* broken glass */}
      <g fill="#cfe7f5" opacity="0.9" stroke="#8fb8cf" strokeWidth="0.2">
        <polygon points="70,87 73,86 72,89" />
        <polygon points="74.5,88 77,87.3 76.2,90.2" />
        <polygon points="72,91 74.6,90.4 73.4,92.6" />
        <polygon points="77.8,90 79.2,89.6 78.7,91.3" />
        <polygon points="68.6,90 70,89.6 69.6,91" />
      </g>

      {/* neighbour's door (13), slightly open */}
      <rect x="122" y="22" width="26" height="56" fill="#20242c" />
      <rect x="124" y="24" width="22" height="54" fill="#8c6b4a" />
      <rect x="144.5" y="24" width="1.5" height="54" fill="#f6d38a" opacity="0.8" />
      <circle cx="141" cy="50" r="0.9" fill="#d8b36a" />
      <circle cx="146.4" cy="46" r="0.55" fill="#e5e9f0" />
      <rect x="128" y="15.5" width="14" height="4.6" rx="0.8" fill="#e5e9f0" />
      <text x="135" y="19.1" textAnchor="middle" fontSize="3.8" fontWeight="700" fill="#2e3440">13</text>

      {/* plant pot */}
      <g transform="translate(149,76)">
        <polygon points="-3,4 3,4 2.2,10 -2.2,10" fill="#b5673f" />
        <path d="M0,4 Q-5,-2 -2,-6 M0,4 Q1,-4 4,-7 M0,4 Q4,0 6,-2" stroke="#6aa56a" strokeWidth="1.2" fill="none" />
      </g>

      {/* electricity panel */}
      <rect x="100" y="30" width="12" height="16" rx="0.6" fill="#4c566a" stroke="#3b4252" strokeWidth="0.4" />
      <line x1="102" y1="34" x2="110" y2="34" stroke="#3b4252" strokeWidth="0.4" />
    </svg>
  );
}
