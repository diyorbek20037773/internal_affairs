"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { TirHitZone } from "@/data/scenarios/types";
import type { WeaponConfig } from "@/lib/training/weaponConfig";
import { isHittable, resolveActor } from "../weapons/ShotRaycaster";
import type { PlayerState } from "../player/playerTypes";

/**
 * WebXR (immersive-vr) for the range, no extra library: plain `gl.xr`.
 *  - Entry/exit via the `h360:xr` window event ({ cmd: "enter" | "exit" }),
 *    dispatched synchronously from the VR button click so the user gesture
 *    still counts for `requestSession`.
 *  - The XR camera is parented to a rig that follows the FPS body (fps mode)
 *    or stays at the officer's spot (fixed mode); `local-floor` puts the
 *    headset at real standing height.
 *  - Right/any controller: `selectstart` (trigger) = shot along the controller
 *    ray; `squeeze` (grip) = reload; left thumbstick = walk (fps mode).
 *  - State is reported through `onPresenting` so the scene can drop
 *    post-processing and the flat viewmodel while in VR.
 */

export const XR_EVENT = "h360:xr";
export const XR_STATE_EVENT = "h360:xr-state";

export type XrCmd = { cmd: "enter" | "exit" };

export function xrSupported(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("xr" in navigator)) return Promise.resolve(false);
  const xr = (navigator as unknown as { xr: { isSessionSupported(m: string): Promise<boolean> } }).xr;
  return xr.isSessionSupported("immersive-vr").catch(() => false);
}

type XrSession = {
  end(): Promise<void>;
  inputSources: ReadonlyArray<{ handedness: "left" | "right" | "none"; gamepad?: Gamepad | null }>;
  addEventListener(t: "end", cb: () => void): void;
};

export function XrRig({
  armedRef,
  weapon,
  playerRef,
  clamp,
  onMove,
  onShoot,
  onDryFire,
  onReload,
  onPresenting,
}: {
  armedRef: MutableRefObject<{ armed: boolean; canFire: boolean }>;
  weapon: WeaponConfig;
  /** FPS body (fps mode) — the rig follows it and thumbstick locomotion writes into it. */
  playerRef?: MutableRefObject<PlayerState>;
  clamp?: (x: number, z: number) => { x: number; z: number };
  onMove?: (x: number, z: number, crouch: boolean) => void;
  onShoot: (actorId: string | null, zone: TirHitZone, point: THREE.Vector3) => void;
  onDryFire: () => void;
  onReload: () => void;
  onPresenting: (on: boolean) => void;
}) {
  const { gl, camera, scene } = useThree();
  const rig = useRef<THREE.Group>(null);
  const session = useRef<XrSession | null>(null);
  const ray = useRef(new THREE.Raycaster()).current;
  const lastShot = useRef(0);
  const cb = useRef({ onShoot, onDryFire, onReload, onPresenting, onMove, clamp, weapon });
  cb.current = { onShoot, onDryFire, onReload, onPresenting, onMove, clamp, weapon };
  const tmp = useRef({ m: new THREE.Matrix4(), o: new THREE.Vector3(), d: new THREE.Vector3(), q: new THREE.Quaternion(), fwd: new THREE.Vector3(), right: new THREE.Vector3() }).current;
  const lastReport = useRef(0);

  // shot along a controller's ray
  const fireFrom = (ctrl: THREE.Object3D) => {
    const { armed, canFire } = armedRef.current;
    if (!armed) return;
    const now = performance.now();
    if (now - lastShot.current < 1000 / cb.current.weapon.fireRate) return;
    lastShot.current = now;
    if (!canFire) { cb.current.onDryFire(); return; }
    tmp.m.identity().extractRotation(ctrl.matrixWorld);
    tmp.o.setFromMatrixPosition(ctrl.matrixWorld);
    tmp.d.set(0, 0, -1).applyMatrix4(tmp.m).normalize();
    ray.set(tmp.o, tmp.d);
    ray.far = cb.current.weapon.range;
    const hits = ray.intersectObjects(scene.children, true);
    for (const h of hits) {
      if (!isHittable(h.object)) continue;
      const found = resolveActor(h.object, h.point);
      if (found) cb.current.onShoot(found.actorId, found.zone, h.point);
      else cb.current.onShoot(null, "miss", h.point);
      return;
    }
    cb.current.onShoot(null, "miss", ray.ray.at(30, new THREE.Vector3()));
  };

  useEffect(() => {
    const xr = (navigator as unknown as { xr?: { requestSession(m: string, o: unknown): Promise<XrSession> } }).xr;
    const g = rig.current!;
    const controllers = [0, 1].map((i) => gl.xr.getController(i));
    const onSelect = (e: { target: THREE.Object3D }) => fireFrom(e.target);
    const onSqueeze = () => cb.current.onReload();
    for (const c of controllers) {
      c.addEventListener("selectstart", onSelect);
      c.addEventListener("squeezestart", onSqueeze);
      g.add(c);
    }

    const announce = (presenting: boolean) => {
      cb.current.onPresenting(presenting);
      window.dispatchEvent(new CustomEvent(XR_STATE_EVENT, { detail: { presenting } }));
    };

    const enter = async () => {
      if (!xr || session.current) return;
      try {
        const s = await xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor", "bounded-floor"] });
        session.current = s;
        gl.xr.enabled = true;
        gl.xr.setReferenceSpaceType("local-floor");
        await gl.xr.setSession(s as unknown as XRSession);
        g.add(camera); // XR camera pose is applied relative to its parent → the rig
        announce(true);
        s.addEventListener("end", () => {
          session.current = null;
          gl.xr.enabled = false;
          g.remove(camera);
          camera.position.set(g.position.x, 1.6, g.position.z);
          announce(false);
        });
      } catch (e) {
        console.warn("[tir/xr] session failed", e);
        window.dispatchEvent(new CustomEvent(XR_STATE_EVENT, { detail: { presenting: false, error: String((e as Error)?.message ?? e) } }));
      }
    };
    const onCmd = (e: Event) => {
      const { cmd } = (e as CustomEvent<XrCmd>).detail;
      if (cmd === "enter") void enter();
      else void session.current?.end();
    };
    window.addEventListener(XR_EVENT, onCmd);
    return () => {
      window.removeEventListener(XR_EVENT, onCmd);
      for (const c of controllers) {
        c.removeEventListener("selectstart", onSelect);
        c.removeEventListener("squeezestart", onSqueeze);
        g.remove(c);
      }
      void session.current?.end();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, camera]);

  useFrame((_, dt) => {
    const g = rig.current;
    const s = session.current;
    if (!g || !s) return;
    const body = playerRef?.current;
    if (body) {
      // left thumbstick locomotion, relative to where the headset looks
      const left = s.inputSources.find((i) => i.handedness === "left")?.gamepad ?? s.inputSources[0]?.gamepad;
      const ax = left?.axes ?? [];
      const sx = ax[2] ?? ax[0] ?? 0;
      const sy = ax[3] ?? ax[1] ?? 0;
      if (Math.abs(sx) > 0.15 || Math.abs(sy) > 0.15) {
        const xrCam = gl.xr.getCamera();
        xrCam.getWorldQuaternion(tmp.q);
        tmp.fwd.set(0, 0, -1).applyQuaternion(tmp.q); tmp.fwd.y = 0; tmp.fwd.normalize();
        tmp.right.set(1, 0, 0).applyQuaternion(tmp.q); tmp.right.y = 0; tmp.right.normalize();
        const speed = 2.6 * Math.min(dt, 0.05);
        let nx = body.x + (tmp.fwd.x * -sy + tmp.right.x * sx) * speed;
        let nz = body.z + (tmp.fwd.z * -sy + tmp.right.z * sx) * speed;
        if (cb.current.clamp) ({ x: nx, z: nz } = cb.current.clamp(nx, nz));
        body.x = nx; body.z = nz; body.motion = "WALKING";
        const now = performance.now();
        if (now - lastReport.current > 100) { lastReport.current = now; cb.current.onMove?.(nx, nz, false); }
      }
      g.position.set(body.x, 0, body.z);
    }
  });

  return <group ref={rig} name="xr-rig" />;
}
