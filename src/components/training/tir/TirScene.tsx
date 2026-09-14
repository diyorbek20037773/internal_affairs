"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Bloom, EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import type { TirHitZone, TirScenario } from "@/data/scenarios/types";
import type { TirActor, TirState } from "@/lib/training/tirEngine";
import { Plate, Vehicle } from "./Actor";
import { SmartHuman as Human } from "./RealHuman";
import { Environment } from "./Environments";

/**
 * The 3-wall range view (multi-actor). Officer camera at eye height on the
 * platform, actors on the scene plane. `wide` opens the FOV for the 48:9
 * three-screen wall. While the weapon is drawn, any click fires: actor meshes
 * report (actorId, zone); the backdrop reports a miss.
 */
export function TirScene({
  scenario,
  state,
  wide,
  onShoot,
  quality = "high",
}: {
  scenario: TirScenario;
  state: TirState;
  wide: boolean;
  onShoot: (actorId: string | null, zone: TirHitZone) => void;
  quality?: "high" | "low";
}) {
  const armed = state.weaponDrawn && !state.outcome && !state.paused;
  const primary = nearestHostile(state.actors);
  const lookZ = primary ? Math.max(2, Math.hypot(primary.x, primary.z)) : 8;
  const lookX = primary ? primary.x * 0.5 : 0;

  return (
    <Canvas
      shadows={quality === "high" ? { type: THREE.PCFSoftShadowMap } : true}
      dpr={quality === "high" ? [1, 1.75] : [1, 1]}
      gl={{ antialias: quality !== "high", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.65, 0], fov: wide ? 98 : 64, near: 0.1, far: 200 }}
      style={{ cursor: armed ? "crosshair" : "default" }}
      onCreated={({ camera }) => camera.lookAt(0, 1.2, -8)}
    >
      <CameraRig inCover={state.inCover} lookX={lookX} lookZ={lookZ} intense={!!primary && (primary.state === "lunging" || primary.state === "charging" || primary.state === "aiming")} shockSeq={state.shockSeq} />
      <Environment kind={scenario.environment} />

      {state.actors.filter((a) => !a.hidden).map((a) =>
        a.kind === "vehicle" ? (
          <Vehicle key={a.id} x={a.x} z={a.z} state={a.state} onShot={(z) => armed && onShoot(a.id, z)} />
        ) : a.kind === "plate" ? (
          <Plate key={a.id} x={a.x} z={a.z} state={a.state} label={a.name} onShot={(z) => armed && onShoot(a.id, z)} />
        ) : (
          <Human
            key={a.id}
            x={a.x}
            z={a.z}
            state={a.state}
            role={a.role}
            weapon={a.weapon}
            agitation={a.agitation}
            shirt={a.shirt}
            gender={a.gender}
            seed={a.id.split("").reduce((h, c) => h * 31 + c.charCodeAt(0), 7)}
            onShot={(z) => armed && onShoot(a.id, z)}
          />
        )
      )}

      {scenario.partner && <Human x={-3.4} z={-4.4} state="idle" role="police" weapon="gun" seed={11} />}
      {state.backupArrived && <Human x={-4.6} z={-5.2} state="idle" role="police" weapon="gun" seed={17} />}

      {quality === "high" && (
        <EffectComposer multisampling={0}>
          <SMAA />
          <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
        </EffectComposer>
      )}

      {/* miss backdrop */}
      <mesh position={[0, 10, -40]} onPointerDown={() => armed && onShoot(null, "miss")}>
        <planeGeometry args={[300, 100]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -10]} onPointerDown={() => armed && onShoot(null, "miss")}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </Canvas>
  );
}

function nearestHostile(actors: TirActor[]): TirActor | undefined {
  const resolved = new Set(["kneeling", "down", "calm", "fleeing", "hands_up", "stopped", "fled", "hit"]);
  return actors
    .filter((a) => !a.hidden && (a.role === "suspect" || a.role === "vehicle") && !resolved.has(a.state))
    .sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z))[0];
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
