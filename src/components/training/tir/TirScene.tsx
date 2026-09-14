"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { TirHitZone, TirScenario } from "@/data/scenarios/types";
import type { TirState } from "@/lib/training/tirEngine";
import { Actor, Partner } from "./Actor";
import { Environment } from "./Environments";

/**
 * The 3-wall range view. Officer camera at eye height on the platform; actor
 * on -Z. `wide` widens FOV for the 48:9 three-screen wall. Clicking anywhere
 * while the weapon is drawn fires: actor meshes report the zone, the
 * backdrop reports a miss.
 */
export function TirScene({
  scenario,
  state,
  wide,
  onShoot,
}: {
  scenario: TirScenario;
  state: TirState;
  wide: boolean;
  onShoot: (zone: TirHitZone) => void;
}) {
  const armed = state.weaponDrawn && !state.outcome;
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.65, 0], fov: wide ? 95 : 62, near: 0.1, far: 80 }}
      style={{ cursor: armed ? "crosshair" : "default" }}
      onCreated={({ camera }) => camera.lookAt(0, 1.2, -6)}
    >
      <CameraRig inCover={state.inCover} distance={state.distance} lunging={state.actorState === "lunging"} />
      <ambientLight intensity={scenario.environment === "street" ? 0.55 : 0.8} />
      <directionalLight position={[6, 10, 4]} intensity={scenario.environment === "street" ? 0.5 : 1.4} castShadow />
      <Environment kind={scenario.environment} />
      <Actor
        distance={state.distance}
        state={state.actorState}
        weapon={scenario.actor.weapon}
        agitation={state.agitation}
        onShot={(z) => armed && onShoot(z)}
        shirt={scenario.environment === "street" ? "#3b4a8a" : scenario.environment === "hallway" ? "#5b5b5b" : "#8b2f2f"}
      />
      {scenario.partner && <Partner />}
      {state.backupArrived && <Partner position={[-1.8, 0, -1.6]} />}
      {/* miss backdrop: anything not the actor */}
      <mesh position={[0, 10, -30]} onPointerDown={() => armed && onShoot("miss")}>
        <planeGeometry args={[200, 80]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -10]} onPointerDown={() => armed && onShoot("miss")}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </Canvas>
  );
}

function CameraRig({ inCover, distance, lunging }: { inCover: boolean; distance: number; lunging: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  useFrame((s, dt) => {
    const k = Math.min(1, 4 * dt);
    const goalX = inCover ? 1.05 : 0;
    const goalY = inCover ? 1.35 : 1.65;
    camera.position.x += (goalX - camera.position.x) * k;
    camera.position.y += (goalY - camera.position.y) * k;
    // subtle breathing / stress shake when the actor lunges
    const shake = lunging ? 0.02 : 0.004;
    const t = s.clock.elapsedTime;
    target.current.set(Math.sin(t * 1.3) * shake, 1.3 + Math.cos(t * 1.7) * shake, -Math.max(2, distance));
    camera.lookAt(target.current);
  });
  return null;
}
