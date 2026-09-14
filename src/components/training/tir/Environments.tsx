"use client";

import type { TirEnvironment } from "@/data/scenarios/types";

/** Procedural environments — yard / street / hallway. Officer at origin, actor on -Z. */
export function Environment({ kind }: { kind: TirEnvironment }) {
  if (kind === "street") return <Street />;
  if (kind === "hallway") return <Hallway />;
  return <Yard />;
}

function Sky({ top, bottom }: { top: string; bottom: string }) {
  // Gradient dome — reliable across GPUs (scene.background is skipped on some).
  return (
    <group>
      <mesh>
        <sphereGeometry args={[70, 24, 16]} />
        <meshBasicMaterial color={top} side={1} fog={false} />
      </mesh>
      <mesh position={[0, -20, 0]}>
        <sphereGeometry args={[69, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshBasicMaterial color={bottom} side={1} fog={false} transparent opacity={0.9} />
      </mesh>
      <hemisphereLight args={[top, bottom, 0.6]} />
    </group>
  );
}

function Ground({ color, size = 60 }: { color: string; size?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Yard() {
  return (
    <group>
      <Sky top="#7fb2e6" bottom="#dfe9f3" />
      <fog attach="fog" args={["#bcd3ea", 22, 60]} />
      <Ground color="#7a8a63" />
      {/* paved path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -6]}>
        <planeGeometry args={[3, 16]} />
        <meshStandardMaterial color="#9a9a94" />
      </mesh>
      {/* house behind actor */}
      <mesh position={[0, 1.8, -16]} castShadow>
        <boxGeometry args={[10, 3.6, 6]} />
        <meshStandardMaterial color="#d9cbb4" />
      </mesh>
      <mesh position={[0, 4.2, -16]}>
        <coneGeometry args={[7.5, 2, 4]} />
        <meshStandardMaterial color="#7a3b2e" />
      </mesh>
      {[-3.2, 3.2].map((x) => (
        <mesh key={x} position={[x, 1.6, -13.01]}>
          <boxGeometry args={[1.4, 1.2, 0.05]} />
          <meshStandardMaterial color="#3a5a80" />
        </mesh>
      ))}
      {/* fence left/right */}
      {[-6, 6].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.9, -8]}>
            <boxGeometry args={[0.1, 1.8, 24]} />
            <meshStandardMaterial color="#6b7a86" />
          </mesh>
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={i} position={[x, 0.9, -i * 4 + 4]}>
              <boxGeometry args={[0.25, 2.1, 0.25]} />
              <meshStandardMaterial color="#4b5560" />
            </mesh>
          ))}
        </group>
      ))}
      {/* tree */}
      <mesh position={[-4, 1.5, -9]}>
        <cylinderGeometry args={[0.15, 0.22, 3, 8]} />
        <meshStandardMaterial color="#5a4030" />
      </mesh>
      <mesh position={[-4, 3.6, -9]}>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial color="#3f7a3a" />
      </mesh>
      <CoverWall />
    </group>
  );
}

function Street() {
  return (
    <group>
      <Sky top="#1b2233" bottom="#3a4560" />
      <fog attach="fog" args={["#2b3547", 18, 55]} />
      <Ground color="#3a3d43" />
      {/* sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -6]}>
        <planeGeometry args={[8, 20]} />
        <meshStandardMaterial color="#6a6d72" />
      </mesh>
      {/* bus shelter */}
      <group position={[-2.5, 0, -7]}>
        <mesh position={[0, 2.45, 0]}>
          <boxGeometry args={[4, 0.1, 1.6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {[-1.9, 1.9].map((x) => (
          <mesh key={x} position={[x, 1.2, -0.7]}>
            <boxGeometry args={[0.08, 2.4, 0.08]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))}
        <mesh position={[0, 1.3, -0.75]}>
          <boxGeometry args={[4, 2.2, 0.03]} />
          <meshStandardMaterial color="#93c5fd" transparent opacity={0.35} />
        </mesh>
        <mesh position={[0, 0.5, -0.4]}>
          <boxGeometry args={[3, 0.08, 0.4]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>
      {/* street lamp */}
      <mesh position={[3, 2.5, -5]}>
        <cylinderGeometry args={[0.06, 0.08, 5, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <pointLight position={[3, 5, -5]} intensity={260} color="#ffd9a0" distance={26} decay={1.6} />
      <pointLight position={[-2.5, 2.3, -7]} intensity={60} color="#cfe6ff" distance={10} decay={1.6} />
      {/* buildings */}
      {[-9, 9].map((x) => (
        <mesh key={x} position={[x, 5, -14]}>
          <boxGeometry args={[8, 10, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}
      <CoverWall color="#2d3440" />
    </group>
  );
}

function Hallway() {
  return (
    <group>
      <Sky top="#9a9a9e" bottom="#c8c4bc" />
      <Ground color="#6b6b70" size={12} />
      {/* walls */}
      {[-1.8, 1.8].map((x) => (
        <mesh key={x} position={[x, 1.4, -6]}>
          <boxGeometry args={[0.2, 2.8, 20]} />
          <meshStandardMaterial color="#c9c2b5" />
        </mesh>
      ))}
      {/* ceiling */}
      <mesh position={[0, 2.8, -6]}>
        <boxGeometry args={[3.8, 0.1, 20]} />
        <meshStandardMaterial color="#e5e1d8" />
      </mesh>
      {/* far end wall + door behind actor */}
      <mesh position={[0, 1.4, -9]}>
        <boxGeometry args={[3.8, 2.8, 0.2]} />
        <meshStandardMaterial color="#bfb7a8" />
      </mesh>
      <mesh position={[0, 1.05, -8.85]}>
        <boxGeometry args={[1.0, 2.1, 0.1]} />
        <meshStandardMaterial color="#5a3a24" />
      </mesh>
      {/* ceiling lights */}
      {[-2, -5, -8].map((z) => (
        <pointLight key={z} position={[0, 2.6, z]} intensity={45} distance={9} decay={1.6} />
      ))}
      <CoverWall color="#a39a8a" />
    </group>
  );
}

/** Low wall / planter to the officer's right — the "cover" position. */
function CoverWall({ color = "#8a8f7a" }: { color?: string }) {
  return (
    <mesh position={[1.4, 0.5, -0.6]}>
      <boxGeometry args={[0.6, 1.0, 1.6]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
