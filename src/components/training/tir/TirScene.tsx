"use client";

import { memo, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { Bloom, EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import type { TirActorDef, TirHitZone, TirScenario } from "@/data/scenarios/types";
import { clampOfficer, type TirActor, type TirState } from "@/lib/training/tirEngine";
import type { WeaponConfig } from "@/lib/training/weaponConfig";
import { Plate, Vehicle } from "./Actor";
import { SmartHuman as Human } from "./RealHuman";
import { Environment } from "./Environments";
import { FpsControls } from "./player/FpsControls";
import type { PlayerState } from "./player/playerTypes";
import { Viewmodel } from "./weapons/Viewmodel";
import { ShotRaycaster } from "./weapons/ShotRaycaster";
import { Impacts, type ImpactEvent } from "./weapons/Impacts";

export const TIR_CANVAS_CLASS = "tir-canvas";

/** UI flags the scene reads per frame (kept in a ref so the 3D tree never re-renders on them). */
export interface TirRunFlags {
  started: boolean;
  locked: boolean;
  lockFailed: boolean;
  shotSeq: number;
}

export interface FpsProps {
  weapon: WeaponConfig;
  playerRef: MutableRefObject<PlayerState>;
  onMove: (x: number, z: number, crouch: boolean) => void;
  onLockChange: (locked: boolean) => void;
  onLockError: () => void;
  onStep: (sprint: boolean) => void;
  onDryFire: () => void;
}

/**
 * The 3-wall range view (multi-actor). CS-style render model: React mounts the
 * scene once per scenario; everything that changes while the round runs
 * (actor positions/states, officer, HUD flags) is read from `stateRef` /
 * `flagsRef` inside useFrame. Two control modes:
 *  - "fixed": camera fixed at eye height, auto-looks at the nearest threat
 *    (tablet / touch); clicking an actor mesh fires.
 *  - "fps": first-person officer (WASD + pointer lock); shots are a camera-
 *    centre raycast, actors turn toward and chase the moving officer.
 */
export function TirScene({
  scenario,
  stateRef,
  flagsRef,
  wide,
  onShoot,
  quality = "high",
  controls = "fixed",
  fps,
  onFps,
}: {
  scenario: TirScenario;
  stateRef: MutableRefObject<TirState>;
  flagsRef: MutableRefObject<TirRunFlags>;
  wide: boolean;
  onShoot: (actorId: string | null, zone: TirHitZone) => void;
  quality?: "high" | "low";
  controls?: "fps" | "fixed";
  fps?: FpsProps;
  /** Frame-rate sample every ~0.5 s (for the HUD meter). */
  onFps?: (fps: number) => void;
}) {
  const isFps = controls === "fps" && !!fps;
  // Adaptive quality: PerformanceMonitor drops the pixel ratio / post-effects when the frame rate sags.
  const [degraded, setDegraded] = useState(false);
  const impacts = useRef<ImpactEvent[]>([]);
  const fx = quality === "high" && !degraded;

  // Per-frame refs derived from engine state (updated by <FrameBridge/>).
  const enabledRef = useRef(false);
  const shockRef = useRef(0);
  const armedRef = useRef({ armed: false, canFire: false });
  const clickFiresRef = useRef(false);
  const shotSeqRef = useRef(0);

  // Fixed mode: clicking an actor fires only while armed (checked at click time).
  const armedNow = () => {
    const st = stateRef.current;
    return flagsRef.current.started && st.weaponDrawn && !st.outcome && !st.paused;
  };
  const shootFixed = (id: string | null, zone: TirHitZone) => { if (!isFps && armedNow()) onShoot(id, zone); };

  const actors = useMemo(() => scenario.actors, [scenario]);

  return (
    <Canvas
      className={TIR_CANVAS_CLASS}
      shadows={quality === "high" ? { type: THREE.PCFSoftShadowMap } : { type: THREE.PCFShadowMap }}
      dpr={fx ? [1, 1.5] : degraded ? [0.75, 1] : [1, 1]}
      gl={{ antialias: !fx, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9, powerPreference: "high-performance", stencil: false }}
      camera={{ position: [0, 1.6, 0], fov: wide ? 86 : isFps ? 70 : 55, near: 0.08, far: 200 }}
      style={{ cursor: isFps ? "none" : "crosshair" }}
      onCreated={({ camera }) => camera.lookAt(0, 1.35, -6)}
    >
      <FrameBridge stateRef={stateRef} flagsRef={flagsRef} enabledRef={enabledRef} shockRef={shockRef} armedRef={armedRef} clickFiresRef={clickFiresRef} shotSeqRef={shotSeqRef} onFps={onFps} />
      {isFps && fps ? (
        <>
          <FpsControls
            enabledRef={enabledRef}
            lockSelector={`.${TIR_CANVAS_CLASS} canvas`}
            clamp={(x, z) => clampOfficer(x, z, scenario, stateRef.current.actors)}
            onMove={fps.onMove}
            onLockChange={fps.onLockChange}
            onLockError={fps.onLockError}
            onStep={fps.onStep}
            shockRef={shockRef}
            recoilRef={recoilRef}
            playerRef={fps.playerRef}
          />
          <Viewmodel stateRef={stateRef} weapon={fps.weapon.id} shotSeqRef={shotSeqRef} playerRef={fps.playerRef} />
          <ShotRaycaster
            armedRef={armedRef}
            clickFiresRef={clickFiresRef}
            weapon={fps.weapon}
            onShoot={(id, zone, point) => {
              const a = id ? stateRef.current.actors.find((x) => x.id === id) : undefined;
              impacts.current.push({ point: point.clone(), kind: a?.kind === "human" && zone !== "miss" ? "blood" : a?.kind === "plate" || zone === "tire" || zone === "body" ? "spark" : "dust" });
              onShoot(id, zone);
            }}
            onDryFire={fps.onDryFire}
            onLockTimeout={fps.onLockError}
            recoilRef={recoilRef}
          />
        </>
      ) : (
        <CameraRig stateRef={stateRef} />
      )}
      <FovSync fov={wide ? 86 : isFps ? 70 : 55} />
      <Environment kind={scenario.environment} quality={quality} />
      <Impacts queue={impacts} />
      {quality === "high" && <PerformanceMonitor flipflops={3} onDecline={() => setDegraded(true)} onIncline={() => setDegraded(false)} onFallback={() => setDegraded(true)} />}

      <ActorLayer actors={actors} stateRef={stateRef} isFps={isFps} onShoot={shootFixed} />

      {scenario.partner && <Human x={-3.4} z={-4.4} state="idle" role="police" weapon="gun" seed={11} />}
      <BackupCop stateRef={stateRef} />

      {fx && (
        <EffectComposer multisampling={0}>
          <SMAA />
          <Bloom intensity={0.2} luminanceThreshold={0.92} luminanceSmoothing={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.4} />
        </EffectComposer>
      )}

      {/* miss backdrop (fixed mode: click = miss; fps: raycast target = miss) */}
      <mesh position={[0, 10, -40]} onPointerDown={() => shootFixed(null, "miss")}>
        <planeGeometry args={[300, 100]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -10]} onPointerDown={() => shootFixed(null, "miss")}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </Canvas>
  );
}

// Module-level recoil accumulator shared by the raycaster and the controller (one range per page).
const recoilRef: MutableRefObject<number> = { current: 0 };

/** All scenario actors mounted once; each reads its live actor from the state ref every frame. */
const ActorLayer = memo(function ActorLayer({
  actors,
  stateRef,
  isFps,
  onShoot,
}: {
  actors: TirActorDef[];
  stateRef: MutableRefObject<TirState>;
  isFps: boolean;
  onShoot: (id: string | null, zone: TirHitZone) => void;
}) {
  return (
    <>
      {actors.map((a) =>
        a.kind === "vehicle" ? (
          <Vehicle key={a.id} source={{ ref: stateRef, id: a.id }} x={a.x} z={a.z} state={a.state} onShot={isFps ? undefined : (z) => onShoot(a.id, z)} />
        ) : a.kind === "plate" ? (
          <Plate key={a.id} source={{ ref: stateRef, id: a.id }} x={a.x} z={a.z} state={a.state} label={a.name} onShot={isFps ? undefined : (z) => onShoot(a.id, z)} />
        ) : (
          <Human
            key={a.id}
            source={{ ref: stateRef, id: a.id }}
            x={a.x}
            z={a.z}
            state={a.state}
            role={a.role}
            weapon={a.weapon}
            agitation={a.agitation}
            shirt={a.shirt}
            gender={a.gender}
            seed={a.id.split("").reduce((h, c) => h * 31 + c.charCodeAt(0), 7)}
            onShot={isFps ? undefined : (z) => onShoot(a.id, z)}
          />
        )
      )}
    </>
  );
});

/** Backup officer appears when the engine says backup arrived (polled at 4 Hz, one re-render). */
function BackupCop({ stateRef }: { stateRef: MutableRefObject<TirState> }) {
  const [arrived, setArrived] = useState(false);
  const acc = useRef(0);
  useFrame((_, dt) => {
    acc.current += dt;
    if (acc.current < 0.25) return;
    acc.current = 0;
    const v = stateRef.current.backupArrived;
    if (v !== arrived) setArrived(v);
  });
  return arrived ? <Human x={-4.6} z={-5.2} state="idle" role="police" weapon="gun" seed={17} /> : null;
}

/** Copies engine/UI state into the per-frame refs and samples the frame rate. */
function FrameBridge({
  stateRef,
  flagsRef,
  enabledRef,
  shockRef,
  armedRef,
  clickFiresRef,
  shotSeqRef,
  onFps,
}: {
  stateRef: MutableRefObject<TirState>;
  flagsRef: MutableRefObject<TirRunFlags>;
  enabledRef: MutableRefObject<boolean>;
  shockRef: MutableRefObject<number>;
  armedRef: MutableRefObject<{ armed: boolean; canFire: boolean }>;
  clickFiresRef: MutableRefObject<boolean>;
  shotSeqRef: MutableRefObject<number>;
  onFps?: (fps: number) => void;
}) {
  const acc = useRef({ t: 0, n: 0 });
  useFrame((_, dt) => {
    const st = stateRef.current;
    const f = flagsRef.current;
    const playing = f.started && !st.outcome && !st.paused;
    enabledRef.current = playing;
    shockRef.current = st.shockSeq;
    armedRef.current.armed = playing && st.weaponDrawn;
    armedRef.current.canFire = st.ammo.mag > 0 && st.ammo.reloadLeft === 0;
    clickFiresRef.current = f.locked || f.lockFailed;
    shotSeqRef.current = f.shotSeq;
    if (onFps) {
      acc.current.t += dt; acc.current.n++;
      if (acc.current.t >= 0.5) { onFps(Math.round(acc.current.n / acc.current.t)); acc.current.t = 0; acc.current.n = 0; }
    }
  });
  return null;
}

function FovSync({ fov }: { fov: number }) {
  const { camera } = useThree();
  useFrame(() => {
    const c = camera as THREE.PerspectiveCamera;
    if (Math.abs(c.fov - fov) > 0.01) { c.fov += (fov - c.fov) * 0.2; if (Math.abs(c.fov - fov) < 0.05) c.fov = fov; c.updateProjectionMatrix(); }
  });
  return null;
}

const RESOLVED = new Set(["kneeling", "down", "calm", "fleeing", "hands_up", "stopped", "fled", "hit"]);
function nearestHostile(actors: TirActor[], o: { x: number; z: number }): TirActor | undefined {
  let best: TirActor | undefined;
  let bd = Infinity;
  for (const a of actors) {
    if (a.hidden || !(a.role === "suspect" || a.role === "vehicle") || RESOLVED.has(a.state)) continue;
    const d = Math.hypot(a.x - o.x, a.z - o.z);
    if (d < bd) { bd = d; best = a; }
  }
  return best;
}

/** Fixed (tablet) camera: eye height, auto-look at the nearest threat, cover lean, shock kick. */
function CameraRig({ stateRef }: { stateRef: MutableRefObject<TirState> }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const lastShock = useRef(stateRef.current.shockSeq);
  const kick = useRef(0);
  useEffect(() => {
    camera.position.set(0, 1.65, 0);
  }, [camera]);
  useFrame((s, dt) => {
    const st = stateRef.current;
    const primary = nearestHostile(st.actors, st.officer);
    const lookZ = primary ? Math.max(2, Math.hypot(primary.x, primary.z)) : 8;
    const lookX = primary ? primary.x * 0.5 : 0;
    const intense = !!primary && (primary.state === "lunging" || primary.state === "charging" || primary.state === "aiming");
    if (st.shockSeq !== lastShock.current) { lastShock.current = st.shockSeq; kick.current = 1; }
    kick.current = Math.max(0, kick.current - dt * 2.5);
    const k = Math.min(1, 4 * dt);
    const goalX = st.inCover ? 1.05 : 0;
    const goalY = st.inCover ? 1.35 : 1.65;
    camera.position.x += (goalX - camera.position.x) * k;
    camera.position.y += (goalY - camera.position.y) * k;
    camera.position.z += (0 - camera.position.z) * k;
    const shake = (intense ? 0.02 : 0.004) + kick.current * 0.12;
    const t = s.clock.elapsedTime;
    target.current.set(lookX + Math.sin(t * 1.3) * shake + (Math.random() - 0.5) * kick.current * 0.3, 1.3 + Math.cos(t * 1.7) * shake, -lookZ);
    camera.lookAt(target.current);
  });
  return null;
}
