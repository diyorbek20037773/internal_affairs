"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TirActorState, TirHitZone, TirWeapon } from "@/data/scenarios/types";

/**
 * Procedural low-poly humanoid. No external assets (offline-safe); can be
 * swapped for a glTF/Mixamo rig later — the props contract stays the same.
 * Meshes carry `userData.zone` so a raycast click reports the hit zone.
 */
export function Actor({
  distance,
  state,
  weapon,
  agitation,
  onShot,
  shirt = "#8b2f2f",
  pants = "#2b2f3a",
  skin = "#d9a679",
}: {
  distance: number;
  state: TirActorState;
  weapon: TirWeapon;
  agitation: number;
  onShot?: (zone: TirHitZone) => void;
  shirt?: string;
  pants?: string;
  skin?: string;
}) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);
  const smooth = useRef({ z: -distance, kneel: 0, armR: 0, lean: 0, down: 0 });

  useFrame((s, dt) => {
    const g = root.current;
    if (!g) return;
    const t = s.clock.elapsedTime;
    const sm = smooth.current;
    const lerp = (a: number, b: number, k: number) => a + (b - a) * Math.min(1, k * dt);

    // position: actor stands on -Z axis in front of the officer camera
    sm.z = lerp(sm.z, -distance, 4);
    g.position.z = sm.z;

    const moving = state === "approaching" || state === "lunging";
    const speed = state === "lunging" ? 14 : 5;
    const walk = moving ? Math.sin(t * speed) : 0;
    if (legL.current) legL.current.rotation.x = walk * 0.6;
    if (legR.current) legR.current.rotation.x = -walk * 0.6;

    // agitation → idle jitter / breathing
    const jitter = (agitation / 100) * 0.04;
    if (body.current) {
      body.current.position.y = Math.abs(Math.sin(t * (moving ? speed : 2))) * (moving ? 0.05 : 0.015) + Math.sin(t * 9) * jitter;
      body.current.rotation.y = state === "shouting" ? Math.sin(t * 3) * 0.15 : 0;
    }

    // target poses
    const targetArm = state === "knife_raised" ? -2.2 : state === "lunging" ? -1.6 : state === "shouting" ? -0.9 + Math.sin(t * 6) * 0.3 : state === "dropping" ? -0.4 : 0.15;
    const targetKneel = state === "kneeling" ? 1 : 0;
    const targetLean = state === "lunging" ? 0.45 : 0;
    const targetDown = state === "down" ? 1 : 0;
    sm.armR = lerp(sm.armR, targetArm, 6);
    sm.kneel = lerp(sm.kneel, targetKneel, 3);
    sm.lean = lerp(sm.lean, targetLean, 6);
    sm.down = lerp(sm.down, targetDown, 3);

    if (armR.current) armR.current.rotation.x = sm.armR;
    if (armL.current) armL.current.rotation.x = state === "shouting" ? -0.6 + Math.sin(t * 6 + 1) * 0.3 : state === "kneeling" ? -1.4 : 0.1 - walk * 0.4;
    g.rotation.x = sm.lean + sm.down * (Math.PI / 2) * 0.98;
    g.position.y = -sm.kneel * 0.45 - sm.down * 0.15;
    if (legL.current && legR.current) {
      legL.current.rotation.x = legL.current.rotation.x - sm.kneel * 1.5;
      legR.current.rotation.x = legR.current.rotation.x - sm.kneel * 1.5;
    }
    if (weaponRef.current) weaponRef.current.visible = weapon !== "none" && state !== "kneeling" && state !== "down" && state !== "calm";
  });

  const hit = (zone: TirHitZone) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onShot?.(zone);
  };

  const weaponMesh =
    weapon === "knife" ? (
      <mesh position={[0, -0.05, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.03, 0.28, 0.01]} />
        <meshStandardMaterial color="#cfd6dd" metalness={0.8} roughness={0.2} />
      </mesh>
    ) : weapon === "bottle" ? (
      <mesh position={[0, -0.02, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.26, 10]} />
        <meshStandardMaterial color="#3d7a4a" transparent opacity={0.85} />
      </mesh>
    ) : weapon === "bat" ? (
      <mesh position={[0, -0.1, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.045, 0.7, 10]} />
        <meshStandardMaterial color="#8a5a2b" />
      </mesh>
    ) : null;

  return (
    <group ref={root} position={[0, 0, -distance]}>
      {/* shadow blob */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.35, 20]} />
        <meshBasicMaterial color="#000" transparent opacity={0.25} />
      </mesh>
      <group ref={body}>
        {/* legs */}
        <group ref={legL} position={[-0.12, 0.9, 0]}>
          <mesh position={[0, -0.45, 0]} onPointerDown={hit("limb")} userData={{ zone: "limb" }}>
            <capsuleGeometry args={[0.09, 0.7, 4, 8]} />
            <meshStandardMaterial color={pants} />
          </mesh>
        </group>
        <group ref={legR} position={[0.12, 0.9, 0]}>
          <mesh position={[0, -0.45, 0]} onPointerDown={hit("limb")} userData={{ zone: "limb" }}>
            <capsuleGeometry args={[0.09, 0.7, 4, 8]} />
            <meshStandardMaterial color={pants} />
          </mesh>
        </group>
        {/* torso */}
        <mesh position={[0, 1.25, 0]} onPointerDown={hit("torso")} userData={{ zone: "torso" }}>
          <capsuleGeometry args={[0.2, 0.5, 4, 12]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
        {/* head */}
        <mesh position={[0, 1.78, 0]} onPointerDown={hit("head")} userData={{ zone: "head" }}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color={skin} />
        </mesh>
        <mesh position={[0, 1.86, 0]}>
          <sphereGeometry args={[0.135, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1f1f1f" />
        </mesh>
        {/* arms */}
        <group ref={armL} position={[-0.3, 1.5, 0]}>
          <mesh position={[0, -0.3, 0]} onPointerDown={hit("limb")} userData={{ zone: "limb" }}>
            <capsuleGeometry args={[0.065, 0.5, 4, 8]} />
            <meshStandardMaterial color={shirt} />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color={skin} />
          </mesh>
        </group>
        <group ref={armR} position={[0.3, 1.5, 0]}>
          <mesh position={[0, -0.3, 0]} onPointerDown={hit("limb")} userData={{ zone: "limb" }}>
            <capsuleGeometry args={[0.065, 0.5, 4, 8]} />
            <meshStandardMaterial color={shirt} />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          <group ref={weaponRef} position={[0, -0.66, 0]}>{weaponMesh}</group>
        </group>
      </group>
    </group>
  );
}

/** Static partner officer standing to the right. */
export function Partner({ position = [1.6, 0, -1.2] as [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.25, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.16, 0.7, 4, 8]} />
        <meshStandardMaterial color="#1c2a4a" />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <capsuleGeometry args={[0.2, 0.5, 4, 12]} />
        <meshStandardMaterial color="#1c2a4a" />
      </mesh>
      <mesh position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#d9a679" />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.15, 0.16, 0.08, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}
