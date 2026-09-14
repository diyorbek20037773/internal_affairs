"use client";

import type { TirEnvironment } from "@/data/scenarios/types";

/** Procedural environments — yard / street / hallway. Officer at origin, actor on -Z. */
export function Environment({ kind }: { kind: TirEnvironment }) {
  if (kind === "street") return <Street />;
  if (kind === "hallway") return <Hallway />;
  if (kind === "plaza") return <Plaza />;
  if (kind === "lobby") return <Lobby />;
  if (kind === "range") return <Range />;
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

function Plaza() {
  return (
    <group>
      <Sky top="#8fc0ea" bottom="#e8eef5" />
      <fog attach="fog" args={["#cfdcea", 25, 70]} />
      <Ground color="#a39a8c" />
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -2 - i * 3]}>
          <planeGeometry args={[30, 0.08]} />
          <meshStandardMaterial color="#8a8175" />
        </mesh>
      ))}
      {[-6, 6].map((x) =>
        [-5, -9, -13].map((z) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[2.4, 1.2, 1.2]} />
              <meshStandardMaterial color="#8b5e3c" />
            </mesh>
            <mesh position={[0, 2.1, 0]}>
              <boxGeometry args={[2.8, 0.08, 1.8]} />
              <meshStandardMaterial color={x < 0 ? "#c0392b" : "#2874a6"} />
            </mesh>
            {[-1.2, 1.2].map((px) => (
              <mesh key={px} position={[px, 1.4, 0.8]}>
                <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
                <meshStandardMaterial color="#555" />
              </mesh>
            ))}
          </group>
        ))
      )}
      <mesh position={[0, 4, -22]}>
        <boxGeometry args={[34, 8, 4]} />
        <meshStandardMaterial color="#d8cbb6" />
      </mesh>
      <mesh position={[0, 8.5, -22]}>
        <sphereGeometry args={[4, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3a8fbf" />
      </mesh>
      <CoverWall color="#7f8c8d" />
    </group>
  );
}

function Lobby() {
  return (
    <group>
      <Sky top="#d9dde3" bottom="#eef0f3" />
      <Ground color="#b8bcc4" size={30} />
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -i * 2]}>
          <planeGeometry args={[16, 0.03]} />
          <meshStandardMaterial color="#8f949c" />
        </mesh>
      ))}
      {[-8, 8].map((x) => (
        <mesh key={x} position={[x, 2, -8]}>
          <boxGeometry args={[0.3, 4, 26]} />
          <meshStandardMaterial color="#e6e3dc" />
        </mesh>
      ))}
      <mesh position={[0, 2, -15]}>
        <boxGeometry args={[16, 4, 0.3]} />
        <meshStandardMaterial color="#dcd8d0" />
      </mesh>
      <mesh position={[2.5, 1.1, -14.8]}>
        <boxGeometry args={[1.2, 2.2, 0.1]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
      <mesh position={[1.5, 2, -12]}>
        <cylinderGeometry args={[0.5, 0.5, 4, 16]} />
        <meshStandardMaterial color="#cfd3d8" />
      </mesh>
      <mesh position={[3.5, 0.55, -8.5]}>
        <boxGeometry args={[3, 1.1, 0.9]} />
        <meshStandardMaterial color="#5b6b7c" />
      </mesh>
      <mesh position={[-3, 0.35, -6]}>
        <boxGeometry args={[2.4, 0.7, 0.9]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0, 4, -8]}>
        <boxGeometry args={[16, 0.1, 26]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      {[-3, -7, -11].map((z) => (
        <pointLight key={z} position={[0, 3.8, z]} intensity={70} distance={12} decay={1.6} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.2, 0.01, -6]}>
        <circleGeometry args={[0.6, 20]} />
        <meshBasicMaterial color="#6b0f0f" transparent opacity={0.7} />
      </mesh>
      <CoverWall color="#6b7280" />
    </group>
  );
}

function Range() {
  return (
    <group>
      <Sky top="#b9d5f0" bottom="#e9d9b8" />
      <fog attach="fog" args={["#d9d3c0", 30, 90]} />
      <Ground color="#b39b6e" size={120} />
      <mesh position={[0, 1.5, -22]}>
        <boxGeometry args={[40, 3, 6]} />
        <meshStandardMaterial color="#8c7a55" />
      </mesh>
      {[-18, -6, 8, 20].map((x, i) => (
        <mesh key={x} position={[x, 3, -60]}>
          <coneGeometry args={[10 + i * 2, 12 + (i % 2) * 5, 5]} />
          <meshStandardMaterial color="#7a8ea6" />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1]}>
        <planeGeometry args={[8, 0.1]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>
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
