export type PlayerMotion = "IDLE" | "WALKING" | "SPRINTING" | "CROUCHING" | "JUMPING" | "FALLING";

/** Mutable per-frame player body. Lives in a ref — never in React state. */
export interface PlayerState {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  yaw: number;
  crouch: boolean;
  sprint: boolean;
  grounded: boolean;
  motion: PlayerMotion;
}

export const PLAYER_CFG = {
  walk: 3.2,
  sprint: 5.4,
  crouch: 1.5,
  eye: 1.6,
  crouchEye: 1.05,
  gravity: 18,
  jump: 4.2,
  /** Horizontal acceleration / deceleration (1/s). */
  accel: 16,
  /** Mouse look multiplier (PointerLockControls pointerSpeed; 1 = 0.002 rad/px). */
  sensitivity: 0.65,
  bobAmp: 0.02,
  sprintBobAmp: 0.035,
  pitchLimitDeg: 85,
} as const;

export const initialPlayer = (): PlayerState => ({
  x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, yaw: 0, crouch: false, sprint: false, grounded: true, motion: "IDLE",
});

/** Game phase derived from engine state + UI (CS-style state machine, adapted). */
export type TirGameState = "MENU" | "PLAYING" | "PAUSED" | "PLAYER_DEAD" | "ROUND_WON" | "ROUND_LOST";
