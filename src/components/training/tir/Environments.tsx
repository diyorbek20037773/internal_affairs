"use client";

import { Suspense } from "react";
import { Environment as DreiEnvironment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { TirEnvironment } from "@/data/scenarios/types";

/**
 * Photographic environments: a real HDRI panorama (Poly Haven, CC0) is
 * projected onto a ground disc + dome, lights the scene (IBL) and IS the
 * backdrop — the officer stands in a real courtyard / street / square. PBR
 * textured props (cover wall, floor patch) sit on top. If an HDRI is missing
 * (assets not fetched) we fall back to a flat gradient sky.
 */

interface EnvDef {
  /** Poly Haven asset name — 2k for HQ, 1k for LQ. */
  hdri: string;
  groundHeight: number; // camera height in the HDRI shot
  radius: number;
  floor?: { tex: string; size: number; repeat: number };
  cover: string; // texture set for the cover wall
  ambient: number;
  /** IBL / backdrop intensity — tames blown-out midday HDRIs. */
  envIntensity?: number;
  bgIntensity?: number;
  sun?: { pos: [number, number, number]; intensity: number; color?: string };
}

const ENVS: Record<TirEnvironment, EnvDef> = {
  yard: { hdri: "overcast_industrial_courtyard", groundHeight: 1.6, radius: 40, floor: { tex: "aerial_grass_rock", size: 30, repeat: 8 }, cover: "rough_plaster_brick", ambient: 0.25, envIntensity: 0.9, bgIntensity: 0.9, sun: { pos: [8, 12, 6], intensity: 0.9 } },
  street: { hdri: "modern_evening_street", groundHeight: 1.6, radius: 45, floor: { tex: "asphalt_02", size: 40, repeat: 10 }, cover: "concrete_floor_worn_001", ambient: 0.25, envIntensity: 1, bgIntensity: 1, sun: { pos: [-8, 9, 5], intensity: 0.6, color: "#ffe2c0" } },
  plaza: { hdri: "palermo_square", groundHeight: 1.7, radius: 50, floor: { tex: "floor_tiles_06", size: 40, repeat: 16 }, cover: "rough_plaster_brick", ambient: 0.2, envIntensity: 0.7, bgIntensity: 0.75, sun: { pos: [10, 14, -4], intensity: 1.8 } },
  // real office lobby (reception, glass, stairs) — the VirTra reference look
  lobby: { hdri: "cinema_lobby", groundHeight: 1.6, radius: 16, cover: "concrete_floor_worn_001", ambient: 0.35, envIntensity: 0.9, bgIntensity: 0.95, sun: { pos: [2, 6, 3], intensity: 0.6 } },
  hallway: { hdri: "large_corridor", groundHeight: 1.6, radius: 10, cover: "rough_plaster_brick", ambient: 0.35, envIntensity: 0.85, bgIntensity: 0.9, sun: { pos: [0, 5, 2], intensity: 0.5 } },
  range: { hdri: "abandoned_parking", groundHeight: 1.6, radius: 60, floor: { tex: "asphalt_02", size: 60, repeat: 14 }, cover: "concrete_floor_worn_001", ambient: 0.2, envIntensity: 0.8, bgIntensity: 0.85, sun: { pos: [6, 14, 8], intensity: 2.0 } },
};

export function Environment({ kind, quality = "high" }: { kind: TirEnvironment; quality?: "high" | "low" }) {
  const def = ENVS[kind];
  const hdri = `/hdri/${def.hdri}_${quality === "high" ? "2k" : "1k"}.hdr`;
  return (
    <group>
      <ambientLight intensity={def.ambient} />
      {def.sun && (
        <directionalLight
          position={def.sun.pos}
          intensity={def.sun.intensity}
          color={def.sun.color}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0003}
          shadow-normalBias={0.02}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-camera-near={1}
          shadow-camera-far={40}
        />
      )}
      <Suspense fallback={<FlatSky kind={kind} />}>
        <DreiEnvironment files={hdri} background ground={{ height: def.groundHeight, radius: def.radius, scale: def.radius * 2 }} environmentIntensity={def.envIntensity ?? 1} backgroundIntensity={def.bgIntensity ?? 1} />
      </Suspense>
      {def.floor && (
        <Suspense fallback={null}>
          <TexturedFloor tex={def.floor.tex} size={def.floor.size} repeat={def.floor.repeat} />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <CoverWall tex={def.cover} />
      </Suspense>
      <Props kind={kind} />
    </group>
  );
}

function usePbr(name: string, repeat: number) {
  const maps = useTexture({
    map: `/tex/${name}_diff_1k.jpg`,
    normalMap: `/tex/${name}_nor_gl_1k.jpg`,
    roughnessMap: `/tex/${name}_rough_1k.jpg`,
  });
  Object.values(maps).forEach((t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.anisotropy = 8;
  });
  maps.map.colorSpace = THREE.SRGBColorSpace;
  return maps;
}

/** A textured patch under the action area — blends with the projected HDRI floor. */
function TexturedFloor({ tex, size, repeat }: { tex: string; size: number; repeat: number }) {
  const maps = usePbr(tex, repeat);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -size / 3]} receiveShadow>
      <circleGeometry args={[size / 2, 48]} />
      <meshStandardMaterial {...maps} roughness={1} transparent opacity={0.92} />
    </mesh>
  );
}

function CoverWall({ tex }: { tex: string }) {
  const maps = usePbr(tex, 1.5);
  return (
    <mesh position={[1.4, 0.5, -0.6]} castShadow receiveShadow>
      <boxGeometry args={[0.6, 1.0, 1.6]} />
      <meshStandardMaterial {...maps} roughness={1} />
    </mesh>
  );
}

/** Minimal physical props per environment (things actors interact with). */
function Props({ kind }: { kind: TirEnvironment }) {
  if (kind === "street")
    return (
      <group position={[-2.5, 0, -7]}>
        <mesh position={[0, 2.45, 0]} castShadow>
          <boxGeometry args={[4, 0.1, 1.6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.5} />
        </mesh>
        {[-1.9, 1.9].map((x) => (
          <mesh key={x} position={[x, 1.2, -0.7]} castShadow>
            <boxGeometry args={[0.08, 2.4, 0.08]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 1.3, -0.75]}>
          <boxGeometry args={[4, 2.2, 0.03]} />
          <meshPhysicalMaterial color="#cfe6ff" transmission={0.85} thickness={0.05} roughness={0.05} />
        </mesh>
        <mesh position={[0, 0.5, -0.4]} castShadow>
          <boxGeometry args={[3, 0.08, 0.4]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <pointLight position={[0, 2.3, 0]} intensity={6} color="#dbeafe" distance={7} decay={2} />
      </group>
    );
  if (kind === "lobby")
    return (
      <group>
        <mesh position={[3.2, 0.55, -7]} castShadow>
          <boxGeometry args={[2.6, 1.1, 0.9]} />
          <meshStandardMaterial color="#4b5b6c" roughness={0.7} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.2, 0.01, -6]}>
          <circleGeometry args={[0.6, 20]} />
          <meshStandardMaterial color="#4a0a0a" roughness={0.2} transparent opacity={0.8} />
        </mesh>
      </group>
    );
  if (kind === "plaza")
    return (
      <Suspense fallback={null}>
        <PlazaStalls />
      </Suspense>
    );
  if (kind === "range")
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1]}>
        <planeGeometry args={[8, 0.1]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>
    );
  return null;
}

/** Market stalls: brick counter, timber posts, fabric canopy. */
function PlazaStalls() {
  const brick = usePbr("rough_plaster_brick", 2);
  return (
    <group>
      {[-6, 6].map((x) =>
        [-5, -9].map((z) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.4, 1.1, 1.1]} />
              <meshStandardMaterial {...brick} roughness={1} />
            </mesh>
            <mesh position={[0, 1.12, 0]} castShadow>
              <boxGeometry args={[2.6, 0.05, 1.3]} />
              <meshStandardMaterial color="#6b4a2e" roughness={0.85} />
            </mesh>
            {[-1.15, 1.15].map((px) =>
              [-0.5, 0.5].map((pz) => (
                <mesh key={`${px}${pz}`} position={[px, 1.6, pz]} castShadow>
                  <cylinderGeometry args={[0.035, 0.035, 1.0, 10]} />
                  <meshStandardMaterial color="#4a3320" roughness={0.9} />
                </mesh>
              ))
            )}
            <mesh position={[0, 2.12, 0]} rotation={[0.08, 0, 0]} castShadow>
              <boxGeometry args={[2.9, 0.03, 1.7]} />
              <meshStandardMaterial color={x < 0 ? "#a8342c" : "#2f6d94"} roughness={0.95} side={THREE.DoubleSide} />
            </mesh>
            {/* goods: crates */}
            {[-0.7, 0.1, 0.8].map((cx, i) => (
              <mesh key={cx} position={[cx, 1.27, (i % 2) * 0.3 - 0.15]} castShadow>
                <boxGeometry args={[0.5, 0.25, 0.4]} />
                <meshStandardMaterial color={["#c2782e", "#7f9a3a", "#b8402e"][i]} roughness={0.9} />
              </mesh>
            ))}
          </group>
        ))
      )}
    </group>
  );
}

function FlatSky({ kind }: { kind: TirEnvironment }) {
  const top = kind === "street" ? "#1b2233" : "#7fb2e6";
  const bottom = kind === "street" ? "#3a4560" : "#dfe9f3";
  return (
    <group>
      <mesh>
        <sphereGeometry args={[70, 24, 16]} />
        <meshBasicMaterial color={top} side={THREE.BackSide} fog={false} />
      </mesh>
      <hemisphereLight args={[top, bottom, 0.8]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={kind === "street" ? "#3a3d43" : "#7a8a63"} />
      </mesh>
    </group>
  );
}
