"use client";

import { useEffect, useRef, useState } from "react";
import type { TirActorState, TirScenario } from "@/data/scenarios/types";

/**
 * VirTra-style filmed layer. When the scenario ships a video pack and a clip
 * exists for the primary actor's current state, it plays full-bleed over the
 * 3D scene (the 3D stays underneath for hit-testing and as fallback). Clips
 * loop; on state change we crossfade to the next clip. Nothing renders when
 * the pack is absent — the 3D scene carries the training.
 */
export function TirVideoLayer({ scenario, state, muted }: { scenario: TirScenario; state: TirActorState | undefined; muted: boolean }) {
  const clips = scenario.video?.clips;
  const src = state && clips ? clips[state] : undefined;
  const [active, setActive] = useState<string | undefined>(src);
  const [fading, setFading] = useState(false);
  const a = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (src === active) return;
    setFading(true);
    const t = window.setTimeout(() => { setActive(src); setFading(false); }, 220);
    return () => window.clearTimeout(t);
  }, [src, active]);

  useEffect(() => {
    const v = a.current;
    if (!v || !active) return;
    v.muted = muted;
    v.play().catch(() => undefined);
  }, [active, muted]);

  if (!clips || !active) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}>
      <video ref={a} key={active} src={active} poster={scenario.video?.poster} className="h-full w-full object-cover" loop playsInline autoPlay muted={muted} />
    </div>
  );
}
