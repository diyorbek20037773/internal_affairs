/**
 * Officer weapon configuration (shared by the engine and the 3D viewmodel).
 * Original values — no third-party game data. Damage is expressed as a
 * fraction of an actor's hp (1.0 = incapacitating) and is multiplied by the
 * hit-zone factor below.
 */
export interface WeaponConfig {
  id: "pistol" | "taser";
  name: string;
  /** Base damage as a fraction of actor hp before the zone multiplier. */
  damage: number;
  /** Max shots per second (client-side rate limit). */
  fireRate: number;
  /** One shot per trigger pull. */
  semiAuto: boolean;
  magazine: number;
  reserve: number;
  reloadSec: number;
  /** Camera pitch kick per shot (radians). */
  recoil: number;
  /** Max effective range in metres. */
  range: number;
}

export const PISTOL: WeaponConfig = {
  id: "pistol",
  name: "Xizmat tapanchasi",
  damage: 1,
  fireRate: 4,
  semiAuto: true,
  magazine: 15,
  reserve: 30,
  reloadSec: 1.8,
  recoil: 0.028,
  range: 60,
};

export const TASER: WeaponConfig = {
  id: "taser",
  name: "Elektroshok",
  damage: 1,
  fireRate: 0.2,
  semiAuto: true,
  magazine: 1,
  reserve: 2,
  reloadSec: 5,
  recoil: 0.006,
  range: 6,
};

/** Damage multiplier per hit zone (humans). */
export const ZONE_DAMAGE: Record<"head" | "torso" | "limb", number> = { head: 1, torso: 0.65, limb: 0.35 };
