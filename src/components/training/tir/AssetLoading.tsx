"use client";

import { useProgress } from "@react-three/drei";
import { useTranslations } from "next-intl";

/** Overlay while HDRI / avatars / textures stream in (drei loader store works outside the Canvas). */
export function AssetLoading() {
  const t = useTranslations("sim.tir");
  const { active, progress, loaded, total } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-white">
      <div className="w-72 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{t("loading")}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full bg-accent transition-all" style={{ width: `${Math.max(4, progress)}%` }} />
        </div>
        <p className="mt-2 font-mono text-xs text-white/70">{Math.round(progress)}% · {loaded}/{total}</p>
      </div>
    </div>
  );
}
