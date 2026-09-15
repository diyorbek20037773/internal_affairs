"use client";

import { useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Bloom, EffectComposer, Noise, SMAA, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { TirHitZone, TirScenario } from "@/data/scenarios/types";
import { clampOfficer, type TirActor, type TirState } from "@/lib/training/tirEngine";
import type { WeaponConfig } from "@/lib/training/weaponConfig";
import { Plate, Vehicle } from "./Actor";
import { SmartHuman as Human } from "./RealHuman";
import { Environment } from "./Environments";
import { FpsControls } from "./player/FpsControls";
import type { PlayerState } from "./player/playerTypes";
import { Viewmodel } from "./weapons/Viewmodel";
import { ShotRaycaster } from "./weapons/ShotRaycaster";

export const TIR_CANVAS_CLASS = "tir-canvas";

export interface FpsProps {
  /** Movement/look allowed (PLAYING). */
  playing: boolean;
  /** Pointer is locked, or locking is unavailable (headless/iframe) — clicks fire. */
  canFireFromClick: boolean;
  /** Request pointer lock on canvas click (false when lock is unavailable or disabled). */
  allowLock: boolean;
  weapon: WeaponConfig;
  canFire: boolean;
  reloading: boolean;
  shotSeq: number;
  playerRef: MutableRefObject<PlayerState>;
  onMove: (x: number, z: number, crouch: boolean) => void;
  onLockChange: (locked: boolean) => void;
  onLockError: () => void;
  onStep: (sprint: boolean) => void;
  onDryFire: () => void;
}

/**
 * The 3-wall range view (multi-actor). Two control modes:
 *  - "fixed": camera fixed at eye height, auto-looks at the nearest threat
 *    (tablet / touch); clicking an actor mesh fires.
 *  - "fps": first-person officer (WASD + pointer lock); shots are a camera-
 *    centre raycast, actors turn toward and chase the moving officer.
 * `wide` opens the FOV for the 48:9 three-screen wall.
 */
export function TirScene({
  scenario,
  state,
  wide,
  onShoot,
  quality = "high",
  controls = "fixed",
  fps,
}: {
  scenario: TirScenario;
  state: TirState;
  wide: boolean;
  onShoot: (actorId: string | null, zone: TirHitZone) => void;
  quality?: "high" | "low";
  controls?: "fps" | "fixed";
  fps?: FpsProps;
}) {
  const armed = state.weaponDrawn && !state.outcome && !state.paused;
  const isFps = controls === "fps" && !!fps;
  const clickToShoot = armed && !isFps;
  const primary = nearestHostile(state.actors, state.officer);
  const lookZ = primary ? Math.max(2, Math.hypot(primary.x, primary.z)) : 8;
  const lookX = primary ? primary.x * 0.5 : 0;
  const officer = state.officer;

  return (
    <Canvas
      className={TIR_CANVAS_CLASS}
      shadows={quality === "high" ? { type: THREE.PCFSoftShadowMap } : true}
      dpr={quality === "high" ? [1, 1.75] : [1, 1]}
      gl={{ antialias: quality !== "high", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.6, 0], fov: wide ? 86 : 55, near: 0.08, far: 200 }}
      style={{ cursor: isFps ? "none" : armed ? "crosshair" : "default" }}
      onCreated={({ camera }) => camera.lookAt(0, 1.35, -6)}
    >
      {isFps && fps ? (
        <>
          <FpsControls
            enabled={fps.playing}
            lockSelector={fps.allowLock ? `.${TIR_CANVAS_CLASS} canvas` : ".__no-pointer-lock__"}
            clamp={(x, z) => clampOfficer(x, z, scenario, state.actors)}
            onMove={fps.onMove}
            onLockChange={fps.onLockChange}
            onLockError={fps.onLockError}
            onStep={fps.onStep}
            shockSeq={state.shockSeq}
            recoilRef={recoilRef}
            playerRef={fps.playerRef}
          />
          <Viewmodel visible={state.weaponDrawn && !state.outcome} weapon={fps.weapon.id} shotSeq={fps.shotSeq} reloading={state.ammo.reloadLeft > 0} playerRef={fps.playerRef} />
          <ShotRaycaster
            armed={armed && fps.playing}
            clickFires={fps.canFireFromClick}
            canFire={fps.canFire}
            weapon={fps.weapon}
            onShoot={(id, zone) => onShoot(id, zone)}
            onDryFire={fps.onDryFire}
            onLockTimeout={fps.onLockError}
            recoilRef={recoilRef}
          />
        </>
      ) : (
        <CameraRig inCover={state.inCover} lookX={lookX} lookZ={lookZ} intense={!!primary && (primary.state === "lunging" || primary.state === "charging" || primary.state === "aiming")} shockSeq={state.shockSeq} />
      )}
      <Environment kind={scenario.environment} quality={quality} />

      {state.actors.filter((a) => !a.hidden).map((a) =>
        a.kind === "vehicle" ? (
          <Vehicle key={a.id} actorId={a.id} officer={officer} x={a.x} z={a.z} state={a.state} onShot={clickToShoot ? (z) => onShoot(a.id, z) : undefined} />
        ) : a.kind === "plate" ? (
          <Plate key={a.id} actorId={a.id} x={a.x} z={a.z} state={a.state} label={a.name} onShot={clickToShoot ? (z) => onShoot(a.id, z) : undefined} />
        ) : (
          <Human
            key={a.id}
            actorId={a.id}
            officer={officer}
            hp={a.hp}
            x={a.x}
            z={a.z}
            state={a.state}
            role={a.role}
            weapon={a.weapon}
            agitation={a.agitation}
            shirt={a.shirt}
            gender={a.gender}
            seed={a.id.split("").reduce((h, c) => h * 31 + c.charCodeAt(0), 7)}
            onShot={clickToShoot ? (z) => onShoot(a.id, z) : undefined}
          />
        )
      )}

      {scenario.partner && <Human x={-3.4} z={-4.4} state="idle" role="police" weapon="gun" seed={11} officer={officer} />}
      {state.backupArrived && <Human x={-4.6} z={-5.2} state="idle" role="police" weapon="gun" seed={17} officer={officer} />}

      {quality === "high" && (
        <EffectComposer multisampling={0}>
          <SMAA />
          <Bloom intensity={0.25} luminanceThreshold={0.9} luminanceSmoothing={0.2} mipmapBlur />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
          <Vignette eskil={false} offset={0.22} darkness={0.5} />
        </EffectComposer>
      )}

      {/* miss backdrop (fixed mode: click = miss; fps: raycast target = miss) */}
      <mesh position={[0, 10, -40]} onPointerDown={() => clickToShoot && onShoot(null, "miss")}>
        <planeGeometry args={[300, 100]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -10]} onPointerDown={() => clickToShoot && onShoot(null, "miss")}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </Canvas>
  );
}

// Module-level recoil accumulator shared by the raycaster and the controller (one range per page).
const recoilRef: MutableRefObject<number> = { current: 0 };

function nearestHostile(actors: TirActor[], o: { x: number; z: number }): TirActor | undefined {
  const resolved = new Set(["kneeling", "down", "calm", "fleeing", "hands_up", "stopped", "fled", "hit"]);
  return actors
    .filter((a) => !a.hidden && (a.role === "suspect" || a.role === "vehicle") && !resolved.has(a.state))
    .sort((a, b) => Math.hypot(a.x - o.x, a.z - o.z) - Math.hypot(b.x - o.x, b.z - o.z))[0];
}

function CameraRig({ inCover, lookX, lookZ, intense, shockSeq }: { inCover: boolean; lookX: number; lookZ: number; intense: boolean; shockSeq: number }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const lastShock = useRef(shockSeq);
  const kick = useRef(0);
  useFrame((s, dt) => {
    if (shockSeq !== lastShock.current) { lastShock.current = shockSeq; kick.current = 1; }
    kick.current = Math.max(0, kick.current - dt * 2.5);
    const k = Math.min(1, 4 * dt);
    const goalX = inCover ? 1.05 : 0;
    const goalY = inCover ? 1.35 : 1.65;
    camera.position.x += (goalX - camera.position.x) * k;
    camera.position.y += (goalY - camera.position.y) * k;
    const shake = (intense ? 0.02 : 0.004) + kick.current * 0.12;
    const t = s.clock.elapsedTime;
    target.current.set(lookX + Math.sin(t * 1.3) * shake + (Math.random() - 0.5) * kick.current * 0.3, 1.3 + Math.cos(t * 1.7) * shake, -lookZ);
    camera.lookAt(target.current);
  });
  return null;
}
