"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TirActorState, TirHitZone, TirRole, TirWeapon } from "@/data/scenarios/types";
import type { TirState } from "@/lib/training/tirEngine";

/** Live engine binding: read the actor from the state ref every frame (no React re-renders). */
export interface ActorSourceRef { ref: MutableRefObject<TirState>; id: string }

export interface OfficerXZ { x: number; z: number }
const ORIGIN: OfficerXZ = { x: 0, z: 0 };

/** Shortest-arc angle lerp (radians). */
export function lerpAngle(a: number, b: number, k: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * k;
}

/**
 * Procedural low-poly humanoid used for every human role (suspect, bystander,
 * hostage, uniformed police). No external assets; can be swapped for a
 * glTF/Mixamo rig — the props contract stays. Meshes report a hit zone.
 */
export function Human({
  x,
  z,
  state,
  role,
  weapon,
  agitation = 40,
  onShot,
  shirt,
  pants,
  skin = "#d9a679",
  officer = ORIGIN,
  actorId,
  hp = 1,
  source,
}: {
  x: number;
  z: number;
  state: TirActorState;
  role: TirRole;
  weapon: TirWeapon;
  agitation?: number;
  onShot?: (zone: TirHitZone) => void;
  shirt?: string;
  pants?: string;
  skin?: string;
  /** Where the officer stands — actors face and chase this point. */
  officer?: OfficerXZ;
  /** Engine actor id for camera-centre raycast hits. */
  actorId?: string;
  hp?: number;
  source?: ActorSourceRef;
}) {
  const root = useRef<THREE.Group>(null);
  const hurt = useRef({ hp, t: 0 });
  const live = useRef({ state, weapon, agitation });
  useEffect(() => {
    if (root.current) root.current.userData.actorId = actorId ?? source?.id;
  }, [actorId, source?.id]);
  const body = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);
  const sm = useRef({ x, z, armR: 0, armL: 0, kneel: 0, lean: 0, down: 0, crouch: 0 });

  const isPolice = role === "police";
  const shirtColor = shirt ?? (isPolice ? "#1c2a4a" : role === "hostage" ? "#d9c27a" : "#6b7280");
  const pantsColor = pants ?? (isPolice ? "#0f172a" : "#2b2f3a");

  useFrame((s, dt) => {
    const g = root.current;
    if (!g) return;
    const t = s.clock.elapsedTime;
    const v = sm.current;
    const lerp = (a: number, b: number, k: number) => a + (b - a) * Math.min(1, k * dt);

    // live actor from the engine ref, or static props
    let tx = x, tz = z, hpNow = hp;
    if (source) {
      const a = source.ref.current.actors.find((o) => o.id === source.id);
      if (a) { tx = a.x; tz = a.z; hpNow = a.hp; live.current = { state: a.state, weapon: a.weapon, agitation: a.agitation }; g.visible = !a.hidden; if (a.hidden) return; }
    } else live.current = { state, weapon, agitation };
    const { state: st, weapon: wp, agitation: ag } = live.current;
    void officer;

    v.x = lerp(v.x, tx, 4);
    v.z = lerp(v.z, tz, 4);
    g.position.x = v.x;
    g.position.z = v.z;
    // face the camera (officer's eyes), smooth turn
    const cam = s.camera.position;
    const yawGoal = Math.atan2(cam.x - v.x, cam.z - v.z) + Math.PI;
    g.rotation.y = lerpAngle(g.rotation.y, yawGoal, Math.min(1, 5 * dt));
    if (hpNow < hurt.current.hp) hurt.current.t = 0.25;
    hurt.current.hp = hpNow;
    hurt.current.t = Math.max(0, hurt.current.t - dt);

    const moving = st === "approaching" || st === "lunging" || st === "walking" || st === "fleeing";
    const speed = st === "lunging" ? 14 : st === "walking" || st === "fleeing" ? 9 : 5;
    const walk = moving ? Math.sin(t * speed) : 0;
    if (legL.current) legL.current.rotation.x = walk * 0.6;
    if (legR.current) legR.current.rotation.x = -walk * 0.6;

    const jitter = (ag / 100) * 0.04;
    if (body.current) {
      body.current.position.y = Math.abs(Math.sin(t * (moving ? speed : 2))) * (moving ? 0.05 : 0.015) + (role === "suspect" ? Math.sin(t * 9) * jitter : 0);
      body.current.rotation.y = st === "shouting" ? Math.sin(t * 3) * 0.15 : 0;
    }

    // target poses
    let tArmR = 0.15;
    let tArmL = 0.1 - walk * 0.4;
    let tKneel = 0;
    let tLean = 0;
    let tDown = 0;
    let tCrouch = 0;
    switch (st) {
      case "weapon_raised": tArmR = wp === "gun" ? -1.4 : -2.2; break;
      case "aiming": tArmR = -1.55; tArmL = -1.45; break;
      case "lunging": tArmR = -1.6; tLean = 0.45; break;
      case "shouting": tArmR = -0.9 + Math.sin(t * 6) * 0.3; tArmL = -0.6 + Math.sin(t * 6 + 1) * 0.3; break;
      case "dropping": tArmR = -0.4; break;
      case "kneeling": tKneel = 1; tArmL = -1.4; tArmR = -1.4; break;
      case "hands_up": tArmR = -2.9; tArmL = -2.9; break;
      case "cowering": tCrouch = 1; tArmR = -2.4; tArmL = -2.4; break;
      case "held": tArmR = -0.8; tArmL = -0.8; break;
      case "down": tDown = 1; break;
      default: break;
    }
    v.armR = lerp(v.armR, tArmR, 6);
    v.armL = lerp(v.armL, tArmL, 6);
    v.kneel = lerp(v.kneel, tKneel, 3);
    v.lean = lerp(v.lean, tLean, 6);
    v.down = lerp(v.down, tDown, 3);
    v.crouch = lerp(v.crouch, tCrouch, 3);

    if (armR.current) armR.current.rotation.x = v.armR;
    if (armL.current) armL.current.rotation.x = v.armL;
    g.rotation.x = v.lean + v.down * (Math.PI / 2) * 0.98;
    g.position.y = -v.kneel * 0.45 - v.down * 0.15 - v.crouch * 0.7;
    if (legL.current && legR.current) {
      legL.current.rotation.x -= v.kneel * 1.5 + v.crouch * 1.9;
      legR.current.rotation.x -= v.kneel * 1.5 + v.crouch * 1.9;
    }
    if (weaponRef.current) weaponRef.current.visible = wp !== "none" && !["kneeling", "down", "calm", "hands_up", "cowering", "held"].includes(st);
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
    ) : weapon === "gun" ? (
      <group position={[0, -0.02, 0.1]}>
        <mesh>
          <boxGeometry args={[0.04, 0.12, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0.03, 0.12]}>
          <boxGeometry args={[0.035, 0.05, 0.22]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    ) : weapon === "bat" ? (
      <mesh position={[0, -0.1, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.045, 0.7, 10]} />
        <meshStandardMaterial color="#8a5a2b" />
      </mesh>
    ) : null;

  return (
    <group ref={root} position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.35, 20]} />
        <meshBasicMaterial color="#000" transparent opacity={0.25} />
      </mesh>
      <group ref={body}>
        <group ref={legL} position={[-0.12, 0.9, 0]}>
          <mesh position={[0, -0.45, 0]} onPointerDown={hit("limb")} userData={{ zone: "limb" }}>
            <capsuleGeometry args={[0.09, 0.7, 4, 8]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>
        <group ref={legR} position={[0.12, 0.9, 0]}>
          <mesh position={[0, -0.45, 0]} onPointerDown={hit("limb")} userData={{ zone: "limb" }}>
            <capsuleGeometry args={[0.09, 0.7, 4, 8]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>
        <mesh position={[0, 1.25, 0]} onPointerDown={hit("torso")} userData={{ zone: "torso" }}>
          <capsuleGeometry args={[0.2, 0.5, 4, 12]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        {isPolice && (
          <>
            {/* reflective POLICE chest strip + badge */}
            <mesh position={[0, 1.35, 0.21]}>
              <boxGeometry args={[0.3, 0.07, 0.01]} />
              <meshStandardMaterial color="#e5e7eb" emissive="#9ca3af" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0.1, 1.5, 0.21]}>
              <circleGeometry args={[0.035, 12]} />
              <meshStandardMaterial color="#d4af37" metalness={0.8} />
            </mesh>
          </>
        )}
        <mesh position={[0, 1.78, 0]} onPointerDown={hit("head")} userData={{ zone: "head" }}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color={skin} />
        </mesh>
        {isPolice ? (
          <mesh position={[0, 1.9, 0]}>
            <cylinderGeometry args={[0.15, 0.16, 0.08, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ) : (
          <mesh position={[0, 1.86, 0]}>
            <sphereGeometry args={[0.135, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#1f1f1f" />
          </mesh>
        )}
        <group ref={armL} position={[-0.3, 1.5, 0]}>
          <mesh position={[0, -0.3, 0]} onPointerDown={hit("limb")} userData={{ zone: "limb" }}>
            <capsuleGeometry args={[0.065, 0.5, 4, 8]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color={skin} />
          </mesh>
        </group>
        <group ref={armR} position={[0.3, 1.5, 0]}>
          <mesh position={[0, -0.3, 0]} onPointerDown={hit("limb")} userData={{ zone: "limb" }}>
            <capsuleGeometry args={[0.065, 0.5, 4, 8]} />
            <meshStandardMaterial color={shirtColor} />
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

/** Sedan — tires/driver/body hit zones. Faces the officer (nose toward +Z). */
export function Vehicle({
  x,
  z,
  state,
  onShot,
  color = "#c8ccd2",
  officer = ORIGIN,
  actorId,
  source,
}: {
  x: number;
  z: number;
  state: TirActorState;
  onShot?: (zone: TirHitZone) => void;
  color?: string;
  officer?: OfficerXZ;
  actorId?: string;
  source?: ActorSourceRef;
}) {
  const root = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Mesh[]>([]);
  useEffect(() => {
    if (root.current) root.current.userData.actorId = actorId ?? source?.id;
  }, [actorId, source?.id]);
  const sm = useRef({ x, z, tilt: 0 });
  useFrame((s, dt) => {
    const g = root.current;
    if (!g) return;
    const v = sm.current;
    const lerp = (a: number, b: number, k: number) => a + (b - a) * Math.min(1, k * dt);
    let tx = x, tz = z, st = state;
    if (source) {
      const a = source.ref.current.actors.find((o) => o.id === source.id);
      if (a) { tx = a.x; tz = a.z; st = a.state; g.visible = !a.hidden; if (a.hidden) return; }
    }
    void officer;
    v.x = lerp(v.x, tx, 6);
    v.z = lerp(v.z, tz, 6);
    g.position.x = v.x;
    g.position.z = v.z;
    // nose (+Z) toward the camera / officer; a parked car keeps its heading
    const cam = s.camera.position;
    if (st !== "parked" && st !== "stopped") g.rotation.y = lerpAngle(g.rotation.y, Math.atan2(cam.x - v.x, cam.z - v.z), Math.min(1, 2.5 * dt));
    const t = s.clock.elapsedTime;
    const rev = st === "revving" ? Math.sin(t * 40) * 0.01 : 0;
    g.position.y = rev;
    const spin = st === "charging" ? 18 : st === "revving" ? 6 : 0;
    wheels.current.forEach((w) => { if (w) w.rotation.x += spin * dt; });
    v.tilt = lerp(v.tilt, st === "stopped" ? 0.08 : 0, 3);
    if (lightRef.current) lightRef.current.intensity = st === "charging" ? 80 : 0;
    headlights.current.forEach((m) => { if (m) (m.material as THREE.MeshStandardMaterial).emissiveIntensity = st === "charging" || st === "revving" ? 2.5 : 0.6; });
    g.rotation.z = v.tilt;
    // headlights flicker when charging
  });
  const lightRef = useRef<THREE.PointLight>(null);
  const headlights = useRef<THREE.Mesh[]>([]);
  const hit = (zone: TirHitZone) => (e: { stopPropagation: () => void }) => { e.stopPropagation(); onShot?.(zone); };
  const wheel = (i: number, px: number, pz: number) => (
    <mesh key={i} ref={(m) => { if (m) wheels.current[i] = m; }} position={[px, 0.32, pz]} rotation={[0, 0, Math.PI / 2]} onPointerDown={hit("tire")} userData={{ zone: "tire" }}>
      <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
      <meshStandardMaterial color="#111" roughness={0.9} />
    </mesh>
  );
  return (
    <group ref={root} position={[x, 0, z]}>
      {/* body */}
      <mesh position={[0, 0.65, 0]} onPointerDown={hit("body")} userData={{ zone: "body" }} castShadow>
        <boxGeometry args={[1.8, 0.6, 4.3]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.25} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      {/* cabin */}
      <mesh position={[0, 1.2, -0.2]} onPointerDown={hit("body")} userData={{ zone: "body" }} castShadow>
        <boxGeometry args={[1.6, 0.55, 2.2]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.25} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      {/* windshield (facing officer, +Z) */}
      <mesh position={[0, 1.2, 0.92]} onPointerDown={hit("driver")} userData={{ zone: "driver" }}>
        <boxGeometry args={[1.5, 0.5, 0.05]} />
        <meshStandardMaterial color="#7fb2e6" transparent opacity={0.55} />
      </mesh>
      {/* driver silhouette behind windshield */}
      <mesh position={[-0.4, 1.15, 0.5]} onPointerDown={hit("driver")} userData={{ zone: "driver" }}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color="#d9a679" />
      </mesh>
      {/* headlights */}
      {[-0.65, 0.65].map((hx, i) => (
        <mesh key={hx} ref={(m) => { if (m) headlights.current[i] = m; }} position={[hx, 0.7, 2.16]}>
          <boxGeometry args={[0.35, 0.18, 0.05]} />
          <meshStandardMaterial color="#fff7d6" emissive="#fff1b8" emissiveIntensity={0.6} />
        </mesh>
      ))}
      <pointLight ref={lightRef} position={[0, 0.8, 2.5]} intensity={0} color="#fff1b8" distance={12} />
      {wheel(0, -0.95, 1.4)}
      {wheel(1, 0.95, 1.4)}
      {wheel(2, -0.95, -1.4)}
      {wheel(3, 0.95, -1.4)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[2.2, 4.6]} />
        <meshBasicMaterial color="#000" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

/** Steel plate on a stand (marksmanship). Falls when hit. */
export function Plate({ x, z, state, onShot, label, actorId, source }: { x: number; z: number; state: TirActorState; onShot?: (zone: TirHitZone) => void; label: string; actorId?: string; source?: ActorSourceRef }) {
  const ref = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  const disc = useRef<THREE.Mesh>(null);
  useEffect(() => {
    if (root.current) root.current.userData.actorId = actorId ?? source?.id;
  }, [actorId, source?.id]);
  const sm = useRef(0);
  useFrame((_, dt) => {
    let st = state;
    if (source) { const a = source.ref.current.actors.find((o) => o.id === source.id); if (a) st = a.state; }
    const target = st === "hit" ? 1 : 0;
    sm.current += (target - sm.current) * Math.min(1, 8 * dt);
    if (ref.current) ref.current.rotation.x = -sm.current * (Math.PI / 2);
    if (disc.current) (disc.current.material as THREE.MeshStandardMaterial).color.set(st === "hit" ? "#9ca3af" : "#e5e7eb");
  });
  return (
    <group ref={root} position={[x, 0, z]}>
      <mesh position={[0, 0.55, 0]} userData={{ zone: "miss" }}>
        <boxGeometry args={[0.06, 1.1, 0.06]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <group ref={ref} position={[0, 1.1, 0]}>
        {/* steel disc faces the officer (+Z); the group tips it flat when hit */}
        <mesh ref={disc} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} onPointerDown={(e) => { e.stopPropagation(); onShot?.("plate"); }} userData={{ zone: "plate" }}>
          <cylinderGeometry args={[0.2, 0.2, 0.03, 24]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.06, 0.09, 24]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
      </group>
      <mesh position={[0, 0.05, 0.25]}>
        <boxGeometry args={[0.3, 0.1, 0.02]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* label as tiny colored marker */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.01]} />
        <meshBasicMaterial color={label.includes("1") ? "#f59e0b" : "#374151"} />
      </mesh>
    </group>
  );
}
