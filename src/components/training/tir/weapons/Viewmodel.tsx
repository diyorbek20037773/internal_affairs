"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { PlayerState } from "../player/playerTypes";

/**
 * First-person weapon viewmodel (service pistol / stun gun) built from
 * primitives — no licensed game assets. Follows the camera every frame with
 * idle sway, walk bob, recoil kick, reload dip and a short muzzle flash.
 * Marked `userData.noHit` so the shot raycast ignores it.
 */
export function Viewmodel({
  visible,
  weapon,
  shotSeq,
  reloading,
  playerRef,
}: {
  visible: boolean;
  weapon: "pistol" | "taser";
  shotSeq: number;
  reloading: boolean;
  playerRef: MutableRefObject<PlayerState>;
}) {
  const { camera } = useThree();
  const root = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const lastShot = useRef(shotSeq);
  const kick = useRef(0);
  const flashT = useRef(0);
  const sway = useRef({ x: 0, y: 0 });
  const lastYaw = useRef(0);
  const lastPitch = useRef(0);
  const bob = useRef(0);
  const dip = useRef(0);
  const e = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);

  useEffect(() => {
    if (root.current) root.current.userData.noHit = true;
  }, []);

  useFrame((s, rawDt) => {
    const dt = Math.min(0.05, rawDt);
    const g = root.current;
    const r = rig.current;
    if (!g || !r) return;
    g.visible = visible;
    if (!visible) return;

    // follow the camera
    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);

    // sway from look delta
    e.setFromQuaternion(camera.quaternion, "YXZ");
    let dYaw = e.y - lastYaw.current;
    if (dYaw > Math.PI) dYaw -= Math.PI * 2; else if (dYaw < -Math.PI) dYaw += Math.PI * 2;
    const dPitch = e.x - lastPitch.current;
    lastYaw.current = e.y; lastPitch.current = e.x;
    sway.current.x = THREE.MathUtils.clamp(sway.current.x - dYaw * 0.35, -0.05, 0.05);
    sway.current.y = THREE.MathUtils.clamp(sway.current.y - dPitch * 0.35, -0.04, 0.04);
    sway.current.x *= Math.max(0, 1 - 8 * dt);
    sway.current.y *= Math.max(0, 1 - 8 * dt);

    // walk bob
    const p = playerRef.current;
    const hs = Math.hypot(p.vx, p.vz);
    if (p.grounded && hs > 0.3) bob.current += dt * (p.sprint ? 11 : 8);
    const bobAmp = hs > 0.3 ? (p.sprint ? 0.012 : 0.006) : 0;
    const bx = Math.cos(bob.current * 0.5) * bobAmp;
    const by = Math.abs(Math.sin(bob.current)) * bobAmp;

    // recoil / flash
    if (shotSeq !== lastShot.current) { lastShot.current = shotSeq; kick.current = 1; flashT.current = 0.06; }
    kick.current = Math.max(0, kick.current - dt * 9);
    flashT.current = Math.max(0, flashT.current - dt);
    if (flash.current) { flash.current.visible = flashT.current > 0; flash.current.rotation.z = s.clock.elapsedTime * 50; }
    if (light.current) light.current.intensity = flashT.current > 0 ? 12 : 0;

    // reload dip / sprint lower
    const dipGoal = reloading ? 1 : p.sprint ? 0.6 : 0;
    dip.current += (dipGoal - dip.current) * Math.min(1, 8 * dt);

    const idle = Math.sin(s.clock.elapsedTime * 1.6) * 0.002;
    r.position.set(0.19 + sway.current.x + bx, -0.19 + sway.current.y + by + idle - dip.current * 0.12, -0.6 + kick.current * 0.05);
    r.rotation.set(-kick.current * 0.22 - dip.current * 0.55 + (reloading ? Math.sin(s.clock.elapsedTime * 9) * 0.05 : 0), -0.06 + (p.sprint ? -0.35 * dip.current : 0), dip.current * 0.25 + kick.current * 0.03);
  });

  const dark = "#1b1d22";
  const grip = "#26282e";
  return (
    <group ref={root} visible={visible}>
      <group ref={rig} scale={0.75}>
        {weapon === "pistol" ? (
          <group>
            {/* slide */}
            <mesh position={[0, 0.045, -0.02]}>
              <boxGeometry args={[0.034, 0.03, 0.2]} />
              <meshStandardMaterial color={dark} metalness={0.75} roughness={0.35} />
            </mesh>
            {/* frame */}
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.032, 0.022, 0.19]} />
              <meshStandardMaterial color={grip} metalness={0.4} roughness={0.6} />
            </mesh>
            {/* barrel tip */}
            <mesh position={[0, 0.045, -0.125]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.02, 12]} />
              <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* grip */}
            <mesh position={[0, -0.04, 0.06]} rotation={[0.28, 0, 0]}>
              <boxGeometry args={[0.03, 0.11, 0.04]} />
              <meshStandardMaterial color={grip} roughness={0.85} />
            </mesh>
            {/* trigger guard */}
            <mesh position={[0, -0.005, 0.012]}>
              <torusGeometry args={[0.018, 0.003, 8, 16, Math.PI]} />
              <meshStandardMaterial color={dark} metalness={0.6} roughness={0.4} />
            </mesh>
            {/* sights */}
            <mesh position={[0, 0.065, -0.11]}>
              <boxGeometry args={[0.004, 0.008, 0.006]} />
              <meshStandardMaterial color="#e5e7eb" emissive="#9ae6b4" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0, 0.065, 0.07]}>
              <boxGeometry args={[0.018, 0.008, 0.006]} />
              <meshStandardMaterial color={dark} />
            </mesh>
            {/* hands (gloved) */}
            <mesh position={[0.008, -0.055, 0.07]} rotation={[0.3, 0, -0.15]}>
              <capsuleGeometry args={[0.019, 0.05, 4, 10]} />
              <meshStandardMaterial color="#2a2d33" roughness={0.9} />
            </mesh>
            <mesh position={[-0.016, -0.065, 0.065]} rotation={[0.35, 0, 0.35]}>
              <capsuleGeometry args={[0.017, 0.045, 4, 10]} />
              <meshStandardMaterial color="#2a2d33" roughness={0.9} />
            </mesh>
          </group>
        ) : (
          <group>
            <mesh position={[0, 0.04, -0.02]}>
              <boxGeometry args={[0.04, 0.05, 0.17]} />
              <meshStandardMaterial color="#f5c518" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.04, -0.11]}>
              <boxGeometry args={[0.042, 0.052, 0.02]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[0, -0.04, 0.05]} rotation={[0.28, 0, 0]}>
              <boxGeometry args={[0.03, 0.11, 0.04]} />
              <meshStandardMaterial color={grip} roughness={0.85} />
            </mesh>
            <mesh position={[0.012, -0.05, 0.075]} rotation={[0.3, 0, -0.15]}>
              <capsuleGeometry args={[0.028, 0.06, 4, 10]} />
              <meshStandardMaterial color="#2a2d33" roughness={0.9} />
            </mesh>
          </group>
        )}
        {/* muzzle flash */}
        <mesh ref={flash} position={[0, 0.045, -0.16]} visible={false}>
          <planeGeometry args={[0.09, 0.09]} />
          <meshBasicMaterial color="#ffd27a" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <pointLight ref={light} position={[0, 0.05, -0.2]} intensity={0} color="#ffcf80" distance={6} decay={2} />
      </group>
    </group>
  );
}
