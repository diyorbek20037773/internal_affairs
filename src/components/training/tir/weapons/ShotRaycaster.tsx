"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { TirHitZone } from "@/data/scenarios/types";
import type { WeaponConfig } from "@/lib/training/weaponConfig";

/**
 * Camera-centre hit-scan. On left pointer-down (while active) casts a ray from
 * the exact centre of the view and reports the first actor hit — found via
 * `userData.actorId` on an ancestor (zone from `userData.zone` on the mesh or
 * `userData.zoneOf(point)` on the actor root). Walls/ground/nothing → miss.
 * Rate-limited by the weapon's fireRate; semi-auto = one shot per click.
 */
export function ShotRaycaster({
  armedRef,
  clickFiresRef,
  weapon,
  onShoot,
  onDryFire,
  onLockTimeout,
  recoilRef,
}: {
  /** Round is playing with the weapon drawn; `canFire` = magazine not empty and not reloading. */
  armedRef: MutableRefObject<{ armed: boolean; canFire: boolean }>;
  /** Pointer is locked, or locking is known to be unavailable — a click is a trigger pull. */
  clickFiresRef: MutableRefObject<boolean>;
  /** Called when a click neither locked the pointer nor errored within ~0.5 s (headless / embedded). */
  onLockTimeout?: () => void;
  weapon: WeaponConfig;
  onShoot: (actorId: string | null, zone: TirHitZone, point: THREE.Vector3) => void;
  onDryFire: () => void;
  recoilRef: MutableRefObject<number>;
}) {
  const { gl, camera, scene } = useThree();
  const lastShot = useRef(0);
  const ray = useRef(new THREE.Raycaster()).current;
  const centre = useRef(new THREE.Vector2(0, 0)).current;
  const cb = useRef({ weapon, onShoot, onDryFire, onLockTimeout });
  cb.current = { weapon, onShoot, onDryFire, onLockTimeout };

  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      const c = cb.current;
      const { armed, canFire } = armedRef.current;
      if (e.button !== 0 || !armed) return;
      if (!clickFiresRef.current) {
        // this click is the lock request; if nothing happens, fall back to click-to-fire
        window.setTimeout(() => { if (!clickFiresRef.current && !document.pointerLockElement) cb.current.onLockTimeout?.(); }, 500);
        return;
      }
      const now = performance.now();
      if (now - lastShot.current < 1000 / c.weapon.fireRate) return;
      lastShot.current = now;
      if (!canFire) { c.onDryFire(); return; }
      ray.setFromCamera(centre, camera);
      ray.far = c.weapon.range;
      const hits = ray.intersectObjects(scene.children, true);
      for (const h of hits) {
        if (!isHittable(h.object)) continue;
        const found = resolveActor(h.object, h.point);
        recoilRef.current += c.weapon.recoil * (0.85 + Math.random() * 0.3);
        if (found) c.onShoot(found.actorId, found.zone, h.point);
        else c.onShoot(null, "miss", h.point);
        return;
      }
      recoilRef.current += c.weapon.recoil;
      c.onShoot(null, "miss", ray.ray.at(30, new THREE.Vector3()));
    };
    el.addEventListener("pointerdown", down);
    return () => el.removeEventListener("pointerdown", down);
  }, [gl, camera, scene, ray, centre, recoilRef, armedRef, clickFiresRef]);

  return null;
}

/** Skip the viewmodel, invisible subtrees and non-mesh helpers. */
function isHittable(o: THREE.Object3D): boolean {
  let cur: THREE.Object3D | null = o;
  while (cur) {
    if (cur.userData?.noHit || cur.visible === false) return false;
    cur = cur.parent;
  }
  return (o as THREE.Mesh).isMesh === true;
}

function resolveActor(o: THREE.Object3D, point: THREE.Vector3): { actorId: string; zone: TirHitZone } | null {
  let zone: TirHitZone | undefined;
  let cur: THREE.Object3D | null = o;
  while (cur) {
    const u = cur.userData as { actorId?: string; zone?: TirHitZone; zoneOf?: (p: THREE.Vector3) => TirHitZone };
    if (!zone && u.zone) zone = u.zone;
    if (u.actorId) {
      const z = u.zoneOf ? u.zoneOf(point) : zone ?? "torso";
      return { actorId: u.actorId, zone: z };
    }
    cur = cur.parent;
  }
  return null;
}
