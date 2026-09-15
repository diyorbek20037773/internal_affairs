"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import type { TirActorState, TirHitZone, TirRole, TirWeapon } from "@/data/scenarios/types";
import { Human as ProceduralHuman, lerpAngle, type OfficerXZ } from "./Actor";

/**
 * Realistic human: Ready Player Me body (Wolf3D_Avatar, PBR skin/cloth
 * textures) + RPM motion-captured clips (idle, talking, gestures, walk, run,
 * crouch). Scenario states are layered on the clips by steering bones toward
 * world directions (gun aimed at the officer, knife raised, hands up, held,
 * cowering, kneeling, down). Same skeleton names as Mixamo without the
 * prefix, so any RPM/Mixamo glTF works. Assets are fetched at build time by
 * scripts/fetch-assets.mjs; if missing, falls back to the procedural figure.
 */

const AVATAR = { m: "/models/rpm_m_tpose.glb", f: "/models/rpm_f_tpose.glb" } as const;
const CLIPS = {
  m: { idle: "/models/anim/M_idle.glb", idle2: "/models/anim/M_idle_var.glb", talk: "/models/anim/M_talk1.glb", gesture: "/models/anim/M_expr1.glb", gesture2: "/models/anim/M_expr5.glb", walk: "/models/anim/M_walk.glb", run: "/models/anim/M_run.glb", crouch: "/models/anim/M_crouch.glb" },
  f: { idle: "/models/anim/F_idle.glb", idle2: "/models/anim/F_idle.glb", talk: "/models/anim/F_talk1.glb", gesture: "/models/anim/F_talk1.glb", gesture2: "/models/anim/F_idle.glb", walk: "/models/anim/F_walk.glb", run: "/models/anim/F_run.glb", crouch: "/models/anim/M_crouch.glb" },
} as const;
type ClipKey = keyof typeof CLIPS.m;

/**
 * Outfit recolor. The RPM atlas (1024²) keeps the whole T-shirt in the
 * bottom-left quadrant; we re-tint that quadrant per actor (keeping the folds
 * as luminance) and paint out the vendor logo (pixels far from the median
 * shirt luminance). One CanvasTexture per gender+colour, cached.
 */
const SHIRT_REGION = { x: 0, y: 0.5, w: 0.5, h: 0.5 } as const;
const SHIRT_PALETTE = ["#6b7280", "#8a5a3c", "#3f6b4f", "#5a6b8a", "#7a4a6a", "#4d4d4d", "#a06a3a", "#2f5f7a", "#8a8a5a", "#5c4b7a"];
const tintCache = new Map<string, THREE.CanvasTexture>();

let blobTex: THREE.CanvasTexture | null = null;
/** Soft radial ground-contact shadow (replaces the per-frame ContactShadows pass). */
function blobShadow(): THREE.CanvasTexture | null {
  if (blobTex || typeof document === "undefined") return blobTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.75)");
  g.addColorStop(0.45, "rgba(0,0,0,0.45)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  blobTex = new THREE.CanvasTexture(c);
  return blobTex;
}

function recolorAtlas(src: THREE.Texture, color: string, key: string): THREE.Texture {
  const hit = tintCache.get(key);
  if (hit) return hit;
  const img = src.image as CanvasImageSource & { width: number; height: number };
  if (!img || !img.width || typeof document === "undefined") return src;
  try {
    const W = img.width, H = img.height;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return src;
    ctx.drawImage(img, 0, 0);
    const rx = Math.floor(SHIRT_REGION.x * W), ry = Math.floor(SHIRT_REGION.y * H), rw = Math.floor(SHIRT_REGION.w * W), rh = Math.floor(SHIRT_REGION.h * H);
    const id = ctx.getImageData(rx, ry, rw, rh);
    const d = id.data;
    const lums: number[] = [];
    for (let i = 0; i < d.length; i += 4) {
      const l = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
      if (l > 0.03) lums.push(l);
    }
    if (lums.length === 0) return src;
    lums.sort((a, b) => a - b);
    const med = lums[Math.floor(lums.length / 2)];
    const tint = new THREE.Color(color);
    const tr = tint.r * 255, tg = tint.g * 255, tb = tint.b * 255;
    for (let i = 0; i < d.length; i += 4) {
      let l = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
      if (l <= 0.03) continue; // unused atlas space
      if (Math.abs(l - med) > Math.max(0.18, med * 0.5)) l = med; // logo / print → base cloth
      const shade = Math.max(0.5, Math.min(1.2, 0.35 + 0.65 * (l / Math.max(med, 0.05))));
      d[i] = Math.min(255, tr * shade); d[i + 1] = Math.min(255, tg * shade); d[i + 2] = Math.min(255, tb * shade);
    }
    ctx.putImageData(id, rx, ry);
    const tex = new THREE.CanvasTexture(c);
    tex.flipY = src.flipY;
    tex.colorSpace = src.colorSpace;
    tex.wrapS = src.wrapS; tex.wrapT = src.wrapT;
    tex.anisotropy = src.anisotropy;
    tex.needsUpdate = true;
    tintCache.set(key, tex);
    return tex;
  } catch {
    return src;
  }
}

export interface HumanProps {
  x: number;
  z: number;
  state: TirActorState;
  role: TirRole;
  weapon: TirWeapon;
  agitation?: number;
  onShot?: (zone: TirHitZone) => void;
  shirt?: string;
  gender?: "m" | "f";
  /** Deterministic per-actor variation (height, idle offset). */
  seed?: number;
  /** Where the officer stands — the actor faces this point. */
  officer?: OfficerXZ;
  /** Engine actor id for the camera-centre raycast. */
  actorId?: string;
  /** Remaining hp (0-1); a drop flashes the body red. */
  hp?: number;
}

const ORIGIN: OfficerXZ = { x: 0, z: 0 };

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

const RUN: ReadonlySet<TirActorState> = new Set(["lunging", "fleeing"]);
const WALK: ReadonlySet<TirActorState> = new Set(["approaching", "walking"]);
const WEAPON_HIDDEN: ReadonlySet<TirActorState> = new Set(["kneeling", "down", "calm", "hands_up", "cowering", "held", "dropping"]);

function clipFor(state: TirActorState, role: TirRole): ClipKey {
  if (RUN.has(state)) return "run";
  if (WALK.has(state)) return "walk";
  if (state === "cowering") return "crouch";
  if (state === "shouting") return "gesture";
  if (state === "calm" || state === "dropping") return "talk";
  if (state === "aiming" || state === "weapon_raised" || state === "held" || state === "hands_up" || state === "kneeling" || state === "down") return "idle";
  return role === "bystander" ? "idle2" : "idle";
}

function findBone(root: THREE.Object3D, name: string): THREE.Bone | undefined {
  let found: THREE.Bone | undefined;
  root.traverse((o) => {
    if (!found && (o as THREE.Bone).isBone && o.name.replace(/^mixamorig[:_]?/i, "").toLowerCase() === name.toLowerCase()) found = o as THREE.Bone;
  });
  return found;
}

function RiggedHuman({ x, z, state, role, weapon, agitation = 40, onShot, gender = "m", seed = 0, officer = ORIGIN, actorId, hp = 1, shirt }: HumanProps) {
  const avatar = useGLTF(AVATAR[gender]);
  const clipSet = CLIPS[gender];
  const clipGltfs = {
    idle: useGLTF(clipSet.idle), idle2: useGLTF(clipSet.idle2), talk: useGLTF(clipSet.talk), gesture: useGLTF(clipSet.gesture),
    gesture2: useGLTF(clipSet.gesture2), walk: useGLTF(clipSet.walk), run: useGLTF(clipSet.run), crouch: useGLTF(clipSet.crouch),
  };
  const group = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);

  const { scene, mixer, actions, bones, height, mats } = useMemo(() => {
    const scene = SkeletonUtils.clone(avatar.scene) as THREE.Group;
    // every actor gets their own shirt colour (scenario `shirt`, police navy, else palette by seed)
    const shirtColor = role === "police" ? "#1c2a4a" : shirt ?? SHIRT_PALETTE[Math.abs(seed) % SHIRT_PALETTE.length];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        m.frustumCulled = false;
        const mat = (m.material as THREE.MeshStandardMaterial).clone();
        mat.envMapIntensity = 0.9;
        if (mat.map) mat.map = recolorAtlas(mat.map, shirtColor, `${gender}:${shirtColor}`);
        m.material = mat;
      }
    });
    const mixer = new THREE.AnimationMixer(scene);
    const actions: Partial<Record<ClipKey, THREE.AnimationAction>> = {};
    (Object.keys(clipGltfs) as ClipKey[]).forEach((k) => {
      const clip = clipGltfs[k].animations[0];
      if (clip) actions[k] = mixer.clipAction(clip);
    });
    const mats: THREE.MeshStandardMaterial[] = [];
    scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) mats.push(m.material as THREE.MeshStandardMaterial); });
    const bones = {
      hips: findBone(scene, "Hips"), spine: findBone(scene, "Spine1"), head: findBone(scene, "Head"),
      rArm: findBone(scene, "RightArm"), rFore: findBone(scene, "RightForeArm"), rHand: findBone(scene, "RightHand"),
      lArm: findBone(scene, "LeftArm"), lFore: findBone(scene, "LeftForeArm"),
      rUpLeg: findBone(scene, "RightUpLeg"), lUpLeg: findBone(scene, "LeftUpLeg"), rLeg: findBone(scene, "RightLeg"), lLeg: findBone(scene, "LeftLeg"),
    };
    // subtle per-actor height variation so a crowd doesn't look cloned
    const height = 0.96 + (((seed * 9301 + 49297) % 233280) / 233280) * 0.1;
    return { scene, mixer, actions, bones, height, mats };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar, gender, shirt, role]);

  // Raycast identity: actor id + zone-by-height on the root group.
  useEffect(() => {
    const g = group.current;
    if (!g) return;
    g.userData.actorId = actorId;
    g.userData.zoneOf = (p: THREE.Vector3): TirHitZone => {
      const localY = (p.y - g.position.y) / height;
      if (stateRef.current === "down") return "torso";
      if (localY > 1.5) return "head";
      if (localY > 0.85) return "torso";
      return "limb";
    };
  }, [actorId, height]);
  const stateRef = useRef(state);
  stateRef.current = state;
  const hurt = useRef({ hp, t: 0 });

  // Weapon → right hand bone.
  useEffect(() => {
    const hand = bones.rHand;
    const w = weaponRef.current;
    if (!hand || !w) return;
    hand.add(w);
    return () => { hand.remove(w); };
  }, [bones.rHand]);

  // Clip crossfade.
  const current = useRef<ClipKey | null>(null);
  useEffect(() => {
    const want = clipFor(state, role);
    if (want === current.current) return;
    const next = actions[want] ?? actions.idle;
    if (!next) return;
    const prev = current.current ? actions[current.current] : undefined;
    next.reset().setEffectiveTimeScale(state === "lunging" ? 1.35 : 1).setEffectiveWeight(1).fadeIn(0.3).play();
    if (prev && prev !== next) prev.fadeOut(0.3);
    current.current = want;
  }, [state, role, actions]);

  const sm = useRef({ x, z, down: 0, kneel: 0, crouch: 0, lean: 0 });
  const tmp = useMemo(() => ({ q: new THREE.Quaternion(), pq: new THREE.Quaternion(), v: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0), tgt: new THREE.Vector3() }), []);

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
    // face the officer wherever they walk (smooth turn, faster when hostile)
    const yawGoal = Math.atan2(officer.x - v.x, officer.z - v.z) + Math.PI;
    const turn = state === "lunging" || state === "aiming" ? 9 : 4;
    g.rotation.y = lerpAngle(g.rotation.y, yawGoal, Math.min(1, turn * dt));

    // hit reaction: short red flash
    if (hp < hurt.current.hp) hurt.current.t = 0.3;
    hurt.current.hp = hp;
    if (hurt.current.t > 0 || mats[0]?.emissiveIntensity) {
      hurt.current.t = Math.max(0, hurt.current.t - dt);
      const k = hurt.current.t / 0.3;
      for (const m of mats) { m.emissive.setRGB(1, 0.05, 0.05); m.emissiveIntensity = k * 0.8; }
    }

    mixer.update(dt);

    const tDown = state === "down" ? 1 : 0;
    const tKneel = state === "kneeling" ? 1 : 0;
    const tCrouch = state === "cowering" ? 1 : 0;
    const tLean = 0;
    v.down = lerp(v.down, tDown, 3);
    v.kneel = lerp(v.kneel, tKneel, 3);
    v.crouch = lerp(v.crouch, tCrouch, 3);
    v.lean = lerp(v.lean, tLean, 5);
    g.rotation.x = v.lean + v.down * (Math.PI / 2) * 0.98;
    g.position.y = -v.kneel * 0.5 - v.crouch * 0.35 - v.down * 0.1;
    g.updateWorldMatrix(true, true);

    const toOfficer = tmp.tgt.set(officer.x - v.x, 0, officer.z - v.z).normalize();
    const jitter = (agitation / 100) * 0.05;
    const t = s.clock.elapsedTime;

    switch (state) {
      case "aiming":
        tmp.v.set(toOfficer.x, 0.12 + Math.sin(t * 7) * jitter, toOfficer.z); aimBone(bones.rArm, tmp.v); aimBone(bones.rFore, tmp.v.clone());
        tmp.v.set(toOfficer.x, 0.04, toOfficer.z); aimBone(bones.lArm, tmp.v); aimBone(bones.lFore, tmp.v.clone());
        break;
      case "weapon_raised":
        tmp.v.set(toOfficer.x * 0.5, 0.8, toOfficer.z * 0.5); aimBone(bones.rArm, tmp.v);
        tmp.v.set(toOfficer.x * 0.2, 1, toOfficer.z * 0.2); aimBone(bones.rFore, tmp.v);
        break;
      case "lunging":
        tmp.v.set(toOfficer.x, 0.2, toOfficer.z); aimBone(bones.rArm, tmp.v); aimBone(bones.rFore, tmp.v.clone());
        tmp.v.set(toOfficer.x * 0.5, 0.85, toOfficer.z * 0.5); aimBone(bones.spine, tmp.v, 0.45);
        break;
      case "hands_up":
        tmp.v.set(0.25, 1, 0); aimBone(bones.rArm, tmp.v); tmp.v.set(0, 1, 0); aimBone(bones.rFore, tmp.v);
        tmp.v.set(-0.25, 1, 0); aimBone(bones.lArm, tmp.v); tmp.v.set(0, 1, 0); aimBone(bones.lFore, tmp.v);
        break;
      case "held":
        tmp.v.set(-toOfficer.x * 0.4, -0.7, -toOfficer.z * 0.4); aimBone(bones.rArm, tmp.v); aimBone(bones.lArm, tmp.v.clone());
        break;
      case "kneeling":
        tmp.v.set(toOfficer.x, -1, toOfficer.z); aimBone(bones.rUpLeg, tmp.v); aimBone(bones.lUpLeg, tmp.v.clone());
        tmp.v.set(-toOfficer.x, -0.1, -toOfficer.z); aimBone(bones.rLeg, tmp.v); aimBone(bones.lLeg, tmp.v.clone());
        tmp.v.set(0.3, 0.9, 0); aimBone(bones.rArm, tmp.v); tmp.v.set(-0.3, 0.9, 0); aimBone(bones.lArm, tmp.v);
        break;
      case "cowering":
        tmp.v.set(toOfficer.x * 0.3, 0.9, toOfficer.z * 0.3); aimBone(bones.rArm, tmp.v, 0.8); aimBone(bones.lArm, tmp.v.clone(), 0.8);
        tmp.v.set(toOfficer.x, -0.5, toOfficer.z); aimBone(bones.spine, tmp.v, 0.35);
        break;
      case "dropping":
        tmp.v.set(toOfficer.x * 0.6, -0.8, toOfficer.z * 0.6); aimBone(bones.rArm, tmp.v, 0.8);
        break;
      default:
        break;
    }
    if (weaponRef.current) weaponRef.current.visible = weapon !== "none" && !WEAPON_HIDDEN.has(state);
  });

  const zoneFromPoint = (p: THREE.Vector3): TirHitZone => {
    const g = group.current;
    const fn = g?.userData.zoneOf as ((q: THREE.Vector3) => TirHitZone) | undefined;
    if (fn) return fn(p);
    const localY = (g ? p.y - g.position.y : p.y) / height;
    if (state === "down") return "torso";
    if (localY > 1.5) return "head";
    if (localY > 0.85) return "torso";
    return "limb";
  };

  const blob = useMemo(() => blobShadow(), []);
  return (
    <group ref={group} position={[x, 0, z]}>
      {blob && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} renderOrder={1} userData={{ noHit: true }}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial map={blob} transparent depthWrite={false} opacity={0.85} />
        </mesh>
      )}
      <group scale={height}>
        <primitive
          object={scene}
          onPointerDown={(e: { stopPropagation: () => void; point: THREE.Vector3 }) => {
            e.stopPropagation();
            onShot?.(zoneFromPoint(e.point));
          }}
        />
        {role === "police" && <PoliceKit bones={bones} />}
      </group>
      <group ref={weaponRef} visible={false}>
        <WeaponMesh weapon={weapon} />
      </group>
    </group>
  );
}

/** Uniform accessories parented to bones: cap + tactical vest with reflective strip. */
function PoliceKit({ bones }: { bones: { head?: THREE.Bone; spine?: THREE.Bone } }) {
  const cap = useRef<THREE.Group>(null);
  const vest = useRef<THREE.Group>(null);
  useEffect(() => {
    const h = bones.head, s = bones.spine, c = cap.current, v = vest.current;
    if (h && c) h.add(c);
    if (s && v) s.add(v);
    return () => { if (h && c) h.remove(c); if (s && v) s.remove(v); };
  }, [bones.head, bones.spine]);
  return (
    <>
      <group ref={cap} position={[0, 0.11, 0.01]}>
        <mesh>
          <cylinderGeometry args={[0.105, 0.11, 0.07, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.03, 0.09]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.16, 0.012, 0.09]} />
          <meshStandardMaterial color="#0b1222" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.02, 0.105]}>
          <circleGeometry args={[0.02, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
      <group ref={vest} position={[0, 0.08, 0.02]}>
        <mesh>
          <boxGeometry args={[0.36, 0.42, 0.26]} />
          <meshStandardMaterial color="#1c2a4a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.02, 0.135]}>
          <boxGeometry args={[0.3, 0.05, 0.005]} />
          <meshStandardMaterial color="#e5e7eb" emissive="#9ca3af" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0.02, -0.135]}>
          <boxGeometry args={[0.3, 0.05, 0.005]} />
          <meshStandardMaterial color="#e5e7eb" emissive="#9ca3af" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </>
  );
}

function WeaponMesh({ weapon }: { weapon: TirWeapon }) {
  if (weapon === "knife")
    return (
      <mesh position={[0, 0.08, 0.02]}>
        <boxGeometry args={[0.03, 0.3, 0.008]} />
        <meshStandardMaterial color="#cfd6dd" metalness={0.85} roughness={0.2} />
      </mesh>
    );
  if (weapon === "bottle")
    return (
      <mesh position={[0, 0.1, 0.02]}>
        <cylinderGeometry args={[0.035, 0.04, 0.27, 10]} />
        <meshPhysicalMaterial color="#2f6b3a" transmission={0.6} thickness={0.2} roughness={0.15} />
      </mesh>
    );
  if (weapon === "gun")
    return (
      <group position={[0, 0.05, 0.02]}>
        <mesh>
          <boxGeometry args={[0.035, 0.11, 0.05]} />
          <meshStandardMaterial color="#111" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.06, 0.1]}>
          <boxGeometry args={[0.032, 0.045, 0.22]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    );
  if (weapon === "bat")
    return (
      <mesh position={[0, 0.3, 0.02]}>
        <cylinderGeometry args={[0.03, 0.045, 0.7, 10]} />
        <meshStandardMaterial color="#8a5a2b" roughness={0.6} />
      </mesh>
    );
  return null;
}

useGLTF.preload(AVATAR.m);
useGLTF.preload(AVATAR.f);
Object.values(CLIPS.m).forEach((u) => useGLTF.preload(u));
Object.values(CLIPS.f).forEach((u) => useGLTF.preload(u));
