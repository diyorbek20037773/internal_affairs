"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import type { TirActorState, TirHitZone, TirRole, TirWeapon } from "@/data/scenarios/types";
import { Human as ProceduralHuman } from "./Actor";

/**
 * Rigged, animated human (Mixamo skeleton, /public/models/soldier.glb —
 * three.js example asset). Idle / Walk / Run clips drive locomotion; the
 * scenario state is layered on top by steering bones directly (weapon arm
 * toward the officer, hands up, kneel, cower, lying down), so any Mixamo-
 * compatible glTF dropped into /public/models works with the same props.
 * Falls back to the procedural figure if the asset fails to load.
 */

const MODEL_URL = "/models/soldier.glb";

export interface HumanProps {
  x: number;
  z: number;
  state: TirActorState;
  role: TirRole;
  weapon: TirWeapon;
  agitation?: number;
  onShot?: (zone: TirHitZone) => void;
  shirt?: string;
}

export function SmartHuman(props: HumanProps) {
  return (
    <ModelErrorBoundary fallback={<ProceduralHuman {...props} />}>
      <Suspense fallback={<ProceduralHuman {...props} />}>
        <RiggedHuman {...props} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const ROLE_TINT: Record<TirRole, string> = {
  suspect: "#b04a4a",
  bystander: "#8d8d94",
  hostage: "#d9c27a",
  police: "#2f4f8f",
  vehicle: "#ffffff",
  target: "#ffffff",
};

const MOVING: ReadonlySet<TirActorState> = new Set(["approaching", "walking", "fleeing", "lunging"]);
const WEAPON_HIDDEN: ReadonlySet<TirActorState> = new Set(["kneeling", "down", "calm", "hands_up", "cowering", "held", "dropping"]);

function findBone(root: THREE.Object3D, suffix: string): THREE.Bone | undefined {
  let found: THREE.Bone | undefined;
  root.traverse((o) => {
    if (!found && (o as THREE.Bone).isBone && o.name.replace(/[:_]/g, "").toLowerCase().endsWith(suffix.toLowerCase())) found = o as THREE.Bone;
  });
  return found;
}

function RiggedHuman({ x, z, state, role, weapon, agitation = 40, onShot, shirt }: HumanProps) {
  const gltf = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);

  // Per-instance clone (shared skeleton would make every actor move together).
  const { scene, mixer, actions, bones, scale } = useMemo(() => {
    const scene = SkeletonUtils.clone(gltf.scene) as THREE.Group;
    // Soldier.glb is authored at ~1.8 m; skinned-mesh bounds are unreliable
    // before the first pose, so don't measure — assume metres.
    const scale = 1;
    // tint + hit zones
    const tint = new THREE.Color(shirt ?? ROLE_TINT[role]);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.frustumCulled = false;
        const mat = (m.material as THREE.MeshStandardMaterial).clone();
        if (/visor/i.test(m.name)) {
          m.visible = role === "police";
        } else {
          mat.color = tint;
        }
        m.material = mat;
      }
    });
    const mixer = new THREE.AnimationMixer(scene);
    const actions: Record<string, THREE.AnimationAction> = {};
    for (const clip of gltf.animations) actions[clip.name] = mixer.clipAction(clip);
    const bones = {
      hips: findBone(scene, "Hips"),
      spine: findBone(scene, "Spine1"),
      head: findBone(scene, "Head"),
      rArm: findBone(scene, "RightArm"),
      rFore: findBone(scene, "RightForeArm"),
      rHand: findBone(scene, "RightHand"),
      lArm: findBone(scene, "LeftArm"),
      lFore: findBone(scene, "LeftForeArm"),
      rUpLeg: findBone(scene, "RightUpLeg"),
      lUpLeg: findBone(scene, "LeftUpLeg"),
      rLeg: findBone(scene, "RightLeg"),
      lLeg: findBone(scene, "LeftLeg"),
    };
    return { scene, mixer, actions, bones, scale };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf, role, shirt]);

  // Attach weapon to the right hand bone.
  useEffect(() => {
    const hand = bones.rHand;
    const w = weaponRef.current;
    if (!hand || !w) return;
    hand.add(w);
    // hand bone space is in model units — undo the group scale
    w.scale.setScalar(1 / scale);
    return () => { hand.remove(w); };
  }, [bones.rHand, scale]);

  // Locomotion clip crossfade.
  const current = useRef<string>("");
  useEffect(() => {
    const want = state === "lunging" || state === "fleeing" ? "Run" : MOVING.has(state) ? "Walk" : state === "down" ? "TPose" : "Idle";
    if (want === current.current) return;
    const next = actions[want] ?? actions.Idle;
    const prev = actions[current.current];
    next.reset().setEffectiveTimeScale(state === "lunging" ? 1.4 : 1).setEffectiveWeight(1).fadeIn(0.25).play();
    if (prev && prev !== next) prev.fadeOut(0.25);
    current.current = want;
  }, [state, actions]);

  const sm = useRef({ x, z, down: 0, kneel: 0, crouch: 0, lean: 0 });
  const tmp = useMemo(
    () => ({ q: new THREE.Quaternion(), pq: new THREE.Quaternion(), v: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0), wp: new THREE.Vector3(), tgt: new THREE.Vector3() }),
    []
  );

  /** Point a limb bone (whose +Y runs along the limb) toward a world direction. */
  const aimBone = (bone: THREE.Bone | undefined, dirWorld: THREE.Vector3, blend = 1) => {
    if (!bone || !bone.parent) return;
    bone.parent.getWorldQuaternion(tmp.pq);
    tmp.q.setFromUnitVectors(tmp.up, dirWorld.normalize());
    tmp.q.premultiply(tmp.pq.invert());
    bone.quaternion.slerp(tmp.q, blend);
  };

  useFrame((s, dt) => {
    const g = group.current;
    if (!g) return;
    const v = sm.current;
    const lerp = (a: number, b: number, k: number) => a + (b - a) * Math.min(1, k * dt);
    v.x = lerp(v.x, x, 4);
    v.z = lerp(v.z, z, 4);
    g.position.x = v.x;
    g.position.z = v.z;
    g.rotation.y = Math.atan2(-v.x, -v.z) + Math.PI; // face the officer

    mixer.update(dt);

    // Whole-body targets
    const tDown = state === "down" ? 1 : 0;
    const tKneel = state === "kneeling" ? 1 : 0;
    const tCrouch = state === "cowering" ? 1 : 0;
    const tLean = state === "lunging" ? 0.35 : state === "shouting" ? 0.08 : 0;
    v.down = lerp(v.down, tDown, 3);
    v.kneel = lerp(v.kneel, tKneel, 3);
    v.crouch = lerp(v.crouch, tCrouch, 3);
    v.lean = lerp(v.lean, tLean, 5);
    g.rotation.x = v.lean + v.down * (Math.PI / 2) * 0.98;
    g.position.y = -v.kneel * 0.5 - v.crouch * 0.55 - v.down * 0.12;

    g.updateWorldMatrix(true, true);

    // Direction toward the officer (world), slightly upward for the arm.
    const toOfficer = tmp.tgt.set(-v.x, 0, -v.z).normalize();
    const jitter = (agitation / 100) * 0.05;
    const t = s.clock.elapsedTime;

    switch (state) {
      case "aiming":
        tmp.v.set(toOfficer.x, 0.15 + Math.sin(t * 7) * jitter, toOfficer.z);
        aimBone(bones.rArm, tmp.v);
        aimBone(bones.rFore, tmp.v.clone());
        tmp.v.set(toOfficer.x, 0.05, toOfficer.z);
        aimBone(bones.lArm, tmp.v);
        aimBone(bones.lFore, tmp.v.clone());
        break;
      case "weapon_raised":
        tmp.v.set(toOfficer.x * 0.5, 0.8, toOfficer.z * 0.5);
        aimBone(bones.rArm, tmp.v);
        tmp.v.set(toOfficer.x * 0.2, 1, toOfficer.z * 0.2);
        aimBone(bones.rFore, tmp.v);
        break;
      case "lunging":
        tmp.v.set(toOfficer.x, 0.2, toOfficer.z);
        aimBone(bones.rArm, tmp.v);
        aimBone(bones.rFore, tmp.v.clone());
        break;
      case "shouting":
        tmp.v.set(toOfficer.x * 0.6, 0.5 + Math.sin(t * 6) * 0.25, toOfficer.z * 0.6);
        aimBone(bones.rArm, tmp.v, 0.6);
        tmp.v.set(-toOfficer.x * 0.2, -0.3 + Math.sin(t * 6 + 1) * 0.3, -toOfficer.z * 0.2);
        aimBone(bones.lArm, tmp.v, 0.4);
        break;
      case "hands_up":
        tmp.v.set(0.25, 1, 0); aimBone(bones.rArm, tmp.v);
        tmp.v.set(0, 1, 0); aimBone(bones.rFore, tmp.v);
        tmp.v.set(-0.25, 1, 0); aimBone(bones.lArm, tmp.v);
        tmp.v.set(0, 1, 0); aimBone(bones.lFore, tmp.v);
        break;
      case "held":
        // arms pulled back / restrained
        tmp.v.set(-toOfficer.x * 0.4, -0.7, -toOfficer.z * 0.4); aimBone(bones.rArm, tmp.v); aimBone(bones.lArm, tmp.v.clone());
        break;
      case "cowering":
        tmp.v.set(toOfficer.x * 0.3, 0.9, toOfficer.z * 0.3); aimBone(bones.rArm, tmp.v); aimBone(bones.lArm, tmp.v.clone());
        tmp.v.set(toOfficer.x, -0.6, toOfficer.z); aimBone(bones.spine, tmp.v, 0.5);
        tmp.v.set(toOfficer.x, -0.2, toOfficer.z); aimBone(bones.rUpLeg, tmp.v); aimBone(bones.lUpLeg, tmp.v.clone());
        tmp.v.set(-toOfficer.x, -1, -toOfficer.z); aimBone(bones.rLeg, tmp.v); aimBone(bones.lLeg, tmp.v.clone());
        break;
      case "kneeling":
        tmp.v.set(toOfficer.x, -1, toOfficer.z); aimBone(bones.rUpLeg, tmp.v); aimBone(bones.lUpLeg, tmp.v.clone());
        tmp.v.set(-toOfficer.x, -0.1, -toOfficer.z); aimBone(bones.rLeg, tmp.v); aimBone(bones.lLeg, tmp.v.clone());
        tmp.v.set(0.3, 0.9, 0); aimBone(bones.rArm, tmp.v); tmp.v.set(-0.3, 0.9, 0); aimBone(bones.lArm, tmp.v);
        break;
      case "dropping":
        tmp.v.set(toOfficer.x * 0.6, -0.8, toOfficer.z * 0.6); aimBone(bones.rArm, tmp.v);
        break;
      default:
        break;
    }
    if (weaponRef.current) weaponRef.current.visible = weapon !== "none" && !WEAPON_HIDDEN.has(state);
  });

  const zoneFromPoint = (p: THREE.Vector3): TirHitZone => {
    const g = group.current;
    const localY = g ? p.y - g.position.y : p.y;
    if (state === "down") return "torso";
    if (localY > 1.5) return "head";
    if (localY > 0.85) return "torso";
    return "limb";
  };

  return (
    <group ref={group} position={[x, 0, z]}>
      <primitive
        object={scene}
        scale={scale}
        onPointerDown={(e: { stopPropagation: () => void; point: THREE.Vector3 }) => {
          e.stopPropagation();
          onShot?.(zoneFromPoint(e.point));
        }}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.35, 20]} />
        <meshBasicMaterial color="#000" transparent opacity={0.25} />
      </mesh>
      {role === "police" && (
        <mesh position={[0, 1.36, 0.16]}>
          <boxGeometry args={[0.32, 0.08, 0.02]} />
          <meshStandardMaterial color="#e5e7eb" emissive="#9ca3af" emissiveIntensity={0.5} />
        </mesh>
      )}
      {/* weapon lives in the hand bone (re-parented in effect) */}
      <group ref={weaponRef} visible={false}>
        <WeaponMesh weapon={weapon} />
      </group>
    </group>
  );
}

function WeaponMesh({ weapon }: { weapon: TirWeapon }) {
  // Positioned for a Mixamo right hand: +Y along fingers, palm facing -Z-ish.
  if (weapon === "knife")
    return (
      <mesh position={[0, 0.08, 0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.03, 0.3, 0.008]} />
        <meshStandardMaterial color="#cfd6dd" metalness={0.85} roughness={0.2} />
      </mesh>
    );
  if (weapon === "bottle")
    return (
      <mesh position={[0, 0.1, 0.02]}>
        <cylinderGeometry args={[0.035, 0.04, 0.27, 10]} />
        <meshStandardMaterial color="#3d7a4a" transparent opacity={0.85} />
      </mesh>
    );
  if (weapon === "gun")
    return (
      <group position={[0, 0.05, 0.02]}>
        <mesh>
          <boxGeometry args={[0.035, 0.11, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0.06, 0.1]}>
          <boxGeometry args={[0.032, 0.045, 0.22]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    );
  if (weapon === "bat")
    return (
      <mesh position={[0, 0.3, 0.02]}>
        <cylinderGeometry args={[0.03, 0.045, 0.7, 10]} />
        <meshStandardMaterial color="#8a5a2b" />
      </mesh>
    );
  return null;
}

useGLTF.preload(MODEL_URL);
