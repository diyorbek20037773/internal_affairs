"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import type { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { initialPlayer, PLAYER_CFG, type PlayerState } from "./playerTypes";

/**
 * First-person officer controller (Counter-Strike style, adapted for the
 * decision range). Keyboard: W/A/S/D relative to the camera yaw, Shift sprint,
 * C or Ctrl crouch, Space jump. Mouse look via Pointer Lock (click the scene,
 * Esc releases). Simple physics: gravity, flat ground at y=0, no library.
 * Collision is delegated to `clamp` (engine `clampOfficer`). The camera IS the
 * player's eyes: position = body + eye height + a small bob while moving.
 */
export function FpsControls({
  enabledRef,
  lockSelector,
  clamp,
  onMove,
  onLockChange,
  onLockError,
  onStep,
  shockRef,
  recoilRef,
  playerRef,
}: {
  /** Movement/look allowed (PLAYING) — read every frame, never re-renders. */
  enabledRef: MutableRefObject<boolean>;
  lockSelector: string;
  clamp: (x: number, z: number) => { x: number; z: number };
  onMove: (x: number, z: number, crouch: boolean) => void;
  onLockChange: (locked: boolean) => void;
  onLockError?: () => void;
  onStep?: (sprint: boolean) => void;
  /** Engine shock counter (read from the state ref). */
  shockRef: MutableRefObject<number>;
  /** Pending camera pitch kick (radians) written by the shooter; consumed here. */
  recoilRef: MutableRefObject<number>;
  playerRef?: MutableRefObject<PlayerState>;
}) {
  const { camera } = useThree();
  const plc = useRef<PointerLockControlsImpl>(null);
  const keys = useRef<Set<string>>(new Set());
  const local = useRef<PlayerState>(initialPlayer());
  const body = playerRef ?? local;
  const eye = useRef(PLAYER_CFG.eye);
  const bobPhase = useRef(0);
  const lastStepCycle = useRef(0);
  const lastReport = useRef({ t: 0, x: 0, z: 0, crouch: false });
  const kick = useRef(0);
  const lastShock = useRef(shockRef.current);
  const wasEnabled = useRef(false);
  const recoilRecover = useRef(0);
  const jumpLatch = useRef(false);
  const tmp = useRef({ fwd: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0), wish: new THREE.Vector3(), e: new THREE.Euler(0, 0, 0, "YXZ") }).current;

  // Keyboard (ignored inside inputs). Uses e.code so layout doesn't matter.
  useEffect(() => {
    const isTyping = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
    };
    const MOVE = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", "KeyC", "Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
    const down = (e: KeyboardEvent) => {
      if (isTyping(e.target) || !MOVE.has(e.code)) return;
      if (!enabledRef.current) return;
      keys.current.add(e.code);
      if (e.code === "Space" || e.code.startsWith("Arrow") || (e.ctrlKey && e.code === "KeyW")) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => { keys.current.delete(e.code); };
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); };
  }, [enabledRef]);

  // Surface lock errors (headless, iframes).
  useEffect(() => {
    const err = () => onLockError?.();
    document.addEventListener("pointerlockerror", err);
    return () => document.removeEventListener("pointerlockerror", err);
  }, [onLockError]);

  useFrame((s, rawDt) => {
    const dt = Math.min(0.1, rawDt);
    const p = body.current;
    const k = keys.current;
    const t = s.clock.elapsedTime;
    const enabled = enabledRef.current;
    const shockSeq = shockRef.current;
    // Release the pointer when the round ends / pauses.
    if (wasEnabled.current && !enabled) { keys.current.clear(); if (document.pointerLockElement) document.exitPointerLock(); }
    wasEnabled.current = enabled;

    // --- horizontal movement relative to camera yaw ---
    camera.getWorldDirection(tmp.fwd);
    tmp.fwd.y = 0;
    if (tmp.fwd.lengthSq() < 1e-6) tmp.fwd.set(0, 0, -1);
    tmp.fwd.normalize();
    tmp.right.crossVectors(tmp.fwd, tmp.up).normalize();
    p.yaw = Math.atan2(tmp.fwd.x, tmp.fwd.z);

    const fw = (k.has("KeyW") || k.has("ArrowUp") ? 1 : 0) - (k.has("KeyS") || k.has("ArrowDown") ? 1 : 0);
    const sd = (k.has("KeyD") || k.has("ArrowRight") ? 1 : 0) - (k.has("KeyA") || k.has("ArrowLeft") ? 1 : 0);
    const wantCrouch = enabled && (k.has("ControlLeft") || k.has("ControlRight") || k.has("KeyC"));
    p.crouch = wantCrouch;
    p.sprint = enabled && !p.crouch && (k.has("ShiftLeft") || k.has("ShiftRight")) && fw > 0;

    tmp.wish.set(0, 0, 0);
    if (enabled && (fw || sd)) {
      tmp.wish.addScaledVector(tmp.fwd, fw).addScaledVector(tmp.right, sd).normalize();
    }
    const speed = p.crouch ? PLAYER_CFG.crouch : p.sprint ? PLAYER_CFG.sprint : PLAYER_CFG.walk;
    const air = p.grounded ? 1 : 0.35;
    const a = Math.min(1, PLAYER_CFG.accel * air * dt);
    p.vx += (tmp.wish.x * speed - p.vx) * a;
    p.vz += (tmp.wish.z * speed - p.vz) * a;

    // --- vertical: gravity, ground, jump ---
    if (enabled && k.has("Space") && p.grounded && !jumpLatch.current && !p.crouch) {
      p.vy = PLAYER_CFG.jump;
      p.grounded = false;
      jumpLatch.current = true;
    }
    if (!k.has("Space")) jumpLatch.current = false;
    p.vy -= PLAYER_CFG.gravity * dt;
    p.y += p.vy * dt;
    if (p.y <= 0) { p.y = 0; p.vy = 0; p.grounded = true; }

    // --- integrate + collide ---
    const nx = p.x + p.vx * dt;
    const nz = p.z + p.vz * dt;
    const c = clamp(nx, nz);
    if (Math.abs(c.x - nx) > 1e-6) p.vx = 0;
    if (Math.abs(c.z - nz) > 1e-6) p.vz = 0;
    p.x = c.x;
    p.z = c.z;

    const hSpeed = Math.hypot(p.vx, p.vz);
    p.motion = !p.grounded ? (p.vy > 0 ? "JUMPING" : "FALLING") : p.crouch ? "CROUCHING" : hSpeed < 0.2 ? "IDLE" : p.sprint ? "SPRINTING" : "WALKING";

    // --- eye height + bob ---
    const eyeGoal = p.crouch ? PLAYER_CFG.crouchEye : PLAYER_CFG.eye;
    eye.current += (eyeGoal - eye.current) * Math.min(1, 10 * dt);
    let bob = 0;
    if (p.grounded && hSpeed > 0.3) {
      bobPhase.current += dt * (p.sprint ? 11 : p.crouch ? 6 : 8);
      const amp = p.sprint ? PLAYER_CFG.sprintBobAmp : PLAYER_CFG.bobAmp;
      bob = Math.sin(bobPhase.current) * amp;
      const cycle = Math.floor(bobPhase.current / Math.PI);
      if (cycle !== lastStepCycle.current) { lastStepCycle.current = cycle; onStep?.(p.sprint); }
    }
    camera.position.set(p.x, p.y + eye.current + bob, p.z);

    // --- shock roll shake + recoil pitch (YXZ so PointerLock keeps its yaw/pitch) ---
    if (shockSeq !== lastShock.current) { lastShock.current = shockSeq; kick.current = 1; }
    kick.current = Math.max(0, kick.current - dt * 2.2);
    const e = tmp.e.setFromQuaternion(camera.quaternion, "YXZ");
    let changed = false;
    if (recoilRef.current !== 0) {
      e.x += recoilRef.current;
      recoilRecover.current += recoilRef.current * 0.6;
      recoilRef.current = 0;
      changed = true;
    }
    if (recoilRecover.current > 0) {
      const back = Math.min(recoilRecover.current, 0.35 * dt);
      e.x -= back;
      recoilRecover.current -= back;
      changed = true;
    }
    const roll = kick.current > 0 ? Math.sin(t * 40) * 0.05 * kick.current : 0;
    if (roll !== e.z) { e.z = roll; changed = true; }
    if (changed) {
      const lim = THREE.MathUtils.degToRad(PLAYER_CFG.pitchLimitDeg);
      e.x = Math.max(-lim, Math.min(lim, e.x));
      camera.quaternion.setFromEuler(e);
    }

    // --- report to the engine at ~10 Hz when something changed ---
    const now = performance.now();
    const r = lastReport.current;
    if (now - r.t >= 100 && (Math.abs(r.x - p.x) > 0.02 || Math.abs(r.z - p.z) > 0.02 || r.crouch !== p.crouch)) {
      r.t = now; r.x = p.x; r.z = p.z; r.crouch = p.crouch;
      onMove(p.x, p.z, p.crouch);
    }
  });

  const lim = THREE.MathUtils.degToRad(90 - PLAYER_CFG.pitchLimitDeg);
  return (
    <PointerLockControls
      ref={plc}
      selector={lockSelector}
      minPolarAngle={lim}
      maxPolarAngle={Math.PI - lim}
      pointerSpeed={PLAYER_CFG.sensitivity}
      onLock={() => onLockChange(true)}
      onUnlock={() => onLockChange(false)}
    />
  );
}
