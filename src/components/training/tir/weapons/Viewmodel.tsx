"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { MutableRefObject } from "react";
import type { PlayerState } from "../player/playerTypes";
import type { TirState } from "@/lib/training/tirEngine";

/**
 * First-person weapon viewmodel (service pistol / stun gun) built from
 * primitives — no licensed game assets. Follows the camera every frame with
 * idle sway, walk bob, recoil kick, reload dip and a short muzzle flash.
 * Marked `userData.noHit` so the shot raycast ignores it.
 */
export function Viewmodel({
  stateRef,
  weapon,
  shotSeqRef,
  playerRef,
}: {
  stateRef: MutableRefObject<TirState>;
  weapon: "pistol" | "taser";
  shotSeqRef: MutableRefObject<number>;
  playerRef: MutableRefObject<PlayerState>;
}) {
  const { camera } = useThree();
  const root = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const lastShot = useRef(shotSeqRef.current);
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
    const st = stateRef.current;
    const visible = st.weaponDrawn && !st.outcome;
    const reloading = st.ammo.reloadLeft > 0;
    const shotSeq = shotSeqRef.current;
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
    <group ref={root} visible={false}>
      <group ref={rig} scale={0.75}>
        {weapon === "pistol" ? (
          <group>
            {/* slide */}
            <RoundedBox args={[0.03, 0.03, 0.19]} radius={0.006} smoothness={3} position={[0, 0.047, -0.025]}>
              <meshStandardMaterial color="#17191d" metalness={0.8} roughness={0.32} />
            </RoundedBox>
            {/* slide serrations */}
            {[0.035, 0.045, 0.055, 0.065].map((z) => (
              <mesh key={z} position={[0, 0.047, z]}>
                <boxGeometry args={[0.0315, 0.02, 0.002]} />
                <meshStandardMaterial color="#0b0c0e" metalness={0.6} roughness={0.5} />
              </mesh>
            ))}
            {/* ejection port */}
            <mesh position={[0.0155, 0.052, -0.02]}>
              <boxGeometry args={[0.002, 0.012, 0.03]} />
              <meshStandardMaterial color="#050506" />
            </mesh>
            {/* frame + rail */}
            <RoundedBox args={[0.03, 0.026, 0.17]} radius={0.004} smoothness={2} position={[0, 0.02, -0.005]}>
              <meshStandardMaterial color="#202329" metalness={0.35} roughness={0.7} />
            </RoundedBox>
            {/* barrel / muzzle */}
            <mesh position={[0, 0.047, -0.122]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.0055, 0.0055, 0.01, 14]} />
              <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.047, -0.1205]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.0055, 0.011, 16]} />
              <meshStandardMaterial color="#2a2d33" metalness={0.8} roughness={0.35} side={THREE.DoubleSide} />
            </mesh>
            {/* grip (textured polymer) */}
            <RoundedBox args={[0.028, 0.105, 0.042]} radius={0.006} smoothness={2} position={[0, -0.04, 0.055]} rotation={[0.3, 0, 0]}>
              <meshStandardMaterial color="#1e2126" roughness={0.95} />
            </RoundedBox>
            {/* magazine baseplate */}
            <mesh position={[0, -0.094, 0.07]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.03, 0.008, 0.046]} />
              <meshStandardMaterial color="#111318" metalness={0.5} roughness={0.5} />
            </mesh>
            {/* trigger guard + trigger */}
            <mesh position={[0, -0.006, 0.012]}>
              <torusGeometry args={[0.017, 0.0028, 8, 18, Math.PI]} />
              <meshStandardMaterial color="#1b1d22" metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.006, 0.014]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.005, 0.016, 0.003]} />
              <meshStandardMaterial color="#2b2e35" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* sights (tritium dots) */}
            <mesh position={[0, 0.067, -0.108]}>
              <boxGeometry args={[0.003, 0.007, 0.005]} />
              <meshStandardMaterial color="#e5e7eb" emissive="#a7f3d0" emissiveIntensity={0.7} />
            </mesh>
            {[-0.005, 0.005].map((x) => (
              <mesh key={x} position={[x, 0.066, 0.06]}>
                <boxGeometry args={[0.003, 0.007, 0.004]} />
                <meshStandardMaterial color="#e5e7eb" emissive="#a7f3d0" emissiveIntensity={0.5} />
              </mesh>
            ))}
            <mesh position={[0, 0.062, 0.06]}>
              <boxGeometry args={[0.02, 0.003, 0.004]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            {/* hands — right wraps the grip, left supports */}
            <group position={[0.004, -0.05, 0.062]} rotation={[0.3, 0, -0.12]}>
              <RoundedBox args={[0.036, 0.062, 0.044]} radius={0.012} smoothness={3} position={[0.01, -0.004, 0.006]}>
                <meshStandardMaterial color="#2a2d33" roughness={0.95} />
              </RoundedBox>
              <mesh position={[-0.014, 0.024, -0.004]} rotation={[0, 0, 0.9]}>
                <capsuleGeometry args={[0.008, 0.024, 4, 10]} />
                <meshStandardMaterial color="#2a2d33" roughness={0.95} />
              </mesh>
            </group>
            <group position={[-0.02, -0.062, 0.05]} rotation={[0.35, 0.2, 0.55]}>
              <RoundedBox args={[0.032, 0.056, 0.042]} radius={0.011} smoothness={3}>
                <meshStandardMaterial color="#2a2d33" roughness={0.95} />
              </RoundedBox>
            </group>
          </group>
        ) : (
          <group>
            <RoundedBox args={[0.038, 0.05, 0.16]} radius={0.008} smoothness={3} position={[0, 0.04, -0.02]}>
              <meshStandardMaterial color="#f5c518" roughness={0.5} />
            </RoundedBox>
            <mesh position={[0, 0.04, -0.105]}>
              <boxGeometry args={[0.04, 0.052, 0.014]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <RoundedBox args={[0.028, 0.105, 0.042]} radius={0.006} smoothness={2} position={[0, -0.04, 0.05]} rotation={[0.28, 0, 0]}>
              <meshStandardMaterial color="#1e2126" roughness={0.95} />
            </RoundedBox>
            <group position={[0.004, -0.05, 0.06]} rotation={[0.3, 0, -0.12]}>
              <RoundedBox args={[0.036, 0.062, 0.044]} radius={0.012} smoothness={3} position={[0.01, -0.004, 0.006]}>
                <meshStandardMaterial color="#2a2d33" roughness={0.95} />
              </RoundedBox>
            </group>
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
