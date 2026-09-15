"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ImpactEvent {
  point: THREE.Vector3;
  kind: "dust" | "blood" | "spark";
}

/** Push impacts here from the shooter; the component drains it every frame (no React state). */
export type ImpactQueue = MutableRefObject<ImpactEvent[]>;

const POOL = 24;
const PARTICLES = 10;

/**
 * Bullet impact feedback: a short burst of camera-facing particles (grey dust
 * on walls/ground, red spray on people, sparks on metal). Pooled meshes, all
 * updated in useFrame — nothing re-renders in React.
 */
export function Impacts({ queue }: { queue: ImpactQueue }) {
  const group = useRef<THREE.Group>(null);
  const slots = useMemo(
    () =>
      Array.from({ length: POOL }, () => ({
        t: -1,
        life: 0.35,
        kind: "dust" as ImpactEvent["kind"],
        origin: new THREE.Vector3(),
        vel: Array.from({ length: PARTICLES }, () => new THREE.Vector3()),
      })),
    []
  );
  const next = useRef(0);
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const mats = useMemo(
    () => ({
      dust: new THREE.MeshBasicMaterial({ color: "#b9b3a6", transparent: true, opacity: 0.85, depthWrite: false }),
      blood: new THREE.MeshBasicMaterial({ color: "#8f1414", transparent: true, opacity: 0.95, depthWrite: false }),
      spark: new THREE.MeshBasicMaterial({ color: "#ffd27a", transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending }),
    }),
    []
  );
  useEffect(() => {
    if (group.current) group.current.userData.noHit = true;
  }, []);

  useFrame((s, dt) => {
    const g = group.current;
    if (!g) return;
    // drain queue
    while (queue.current.length) {
      const ev = queue.current.shift()!;
      const slot = slots[next.current];
      next.current = (next.current + 1) % POOL;
      slot.t = 0;
      slot.kind = ev.kind;
      slot.life = ev.kind === "blood" ? 0.45 : 0.3;
      slot.origin.copy(ev.point);
      for (const v of slot.vel) {
        v.set(Math.random() - 0.5, Math.random() * 0.8 + 0.2, Math.random() - 0.5).normalize().multiplyScalar(ev.kind === "blood" ? 1.2 + Math.random() * 1.2 : 0.8 + Math.random() * 1.6);
      }
    }
    // animate
    for (let i = 0; i < POOL; i++) {
      const slot = slots[i];
      const holder = g.children[i] as THREE.Group | undefined;
      if (!holder) continue;
      if (slot.t < 0 || slot.t > slot.life) { holder.visible = false; continue; }
      holder.visible = true;
      slot.t += dt;
      const k = slot.t / slot.life;
      const mat = mats[slot.kind];
      for (let j = 0; j < PARTICLES; j++) {
        const m = holder.children[j] as THREE.Mesh;
        if (!m) continue;
        m.material = mat;
        const v = slot.vel[j];
        m.position.set(slot.origin.x + v.x * slot.t, slot.origin.y + v.y * slot.t - 2.5 * slot.t * slot.t, slot.origin.z + v.z * slot.t);
        const size = (slot.kind === "spark" ? 0.02 : 0.045) * (1 - k * 0.6);
        m.scale.setScalar(size);
        m.quaternion.copy(s.camera.quaternion);
      }
      (holder.children[0] as THREE.Mesh).material = mat;
    }
  });

  return (
    <group ref={group}>
      {slots.map((_, i) => (
        <group key={i} visible={false}>
          {Array.from({ length: PARTICLES }, (__, j) => (
            <mesh key={j} geometry={geo} material={mats.dust} frustumCulled={false} />
          ))}
        </group>
      ))}
    </group>
  );
}
