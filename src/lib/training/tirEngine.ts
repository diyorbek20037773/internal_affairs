import type {
  Score03,
  TirAction,
  TirActorDef,
  TirActorState,
  TirEvent,
  TirHitZone,
  TirOutcome,
  TirScenario,
} from "@/data/scenarios/types";
import { PISTOL, ZONE_DAMAGE } from "./weaponConfig";

/**
 * TIR v2 — multi-actor immersive range engine (VirTra V-300 style).
 * Pure + deterministic. Actors: suspects (knife/gun), bystanders, hostages,
 * uniformed police (don't shoot!), vehicles (tire shot as last resort),
 * marksmanship plates. Every officer action logged with legality /
 * proportionality; shooting a non-threat ends the run.
 */

export interface TirActor extends TirActorDef {
  agitation: number;
  compliance: number;
  stateSince: number;
  aimTimer: number;
  hidden: boolean;
  hp: number;
}

/** First-person officer body on the platform (metres; looks down -Z at start). */
export interface OfficerPos {
  x: number;
  z: number;
  crouch: boolean;
}

export interface TirState {
  t: number;
  actors: TirActor[];
  officer: OfficerPos;
  /** 0-100; each hit taken removes 100 / rules.officerHitsToFail. */
  health: number;
  ammo: { mag: number; reserve: number; reloadLeft: number };
  weaponDrawn: boolean;
  inCover: boolean;
  backupCalled: boolean;
  backupEta: number | null;
  backupArrived: boolean;
  lastTalkAt: number | null;
  talkCount: number;
  shotsFired: number;
  hits: number;
  officerHits: number;
  lastShotAt: number | null;
  firstShotAt: number | null;
  score: number;
  outcome: TirOutcome | null;
  events: TirEvent[];
  currentLine: { actorId: string; text: string } | null;
  lineSeq: number;
  shockSeq: number; // increments on every shock (client feedback)
  scriptDone: number[];
  paused: boolean;
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const dist = (a: { x: number; z: number }, o: { x: number; z: number }) => Math.hypot(a.x - o.x, a.z - o.z);

/* ------------------------------------------------------------------------ */
/* Officer body / collision (FPS mode)                                       */
/* ------------------------------------------------------------------------ */

/** Concrete cover block on the platform (see Environments.CoverWall). */
export const COVER_AABB = { minX: 1.1, maxX: 1.7, minZ: -1.4, maxZ: 0.2 } as const;
const PLAYER_RADIUS = 0.3;
const DEFAULT_BOUNDS = 6;

/** Crouching right behind the cover block counts as being in cover. */
export function inCoverZone(x: number, z: number): boolean {
  return x >= COVER_AABB.minX - 0.9 && x <= COVER_AABB.maxX + 0.2 && z >= COVER_AABB.minZ - 0.3 && z <= COVER_AABB.maxZ + 1.0;
}

/** Push the officer out of the bounds circle, the cover block and actor bodies. Pure, no physics lib. */
export function clampOfficer(x: number, z: number, s: TirScenario, actors: readonly TirActor[]): { x: number; z: number } {
  const R = s.bounds?.radius ?? DEFAULT_BOUNDS;
  // bounds circle
  const d0 = Math.hypot(x, z);
  if (d0 > R) { x *= R / d0; z *= R / d0; }
  // cover AABB (inflated by player radius)
  const minX = COVER_AABB.minX - PLAYER_RADIUS, maxX = COVER_AABB.maxX + PLAYER_RADIUS;
  const minZ = COVER_AABB.minZ - PLAYER_RADIUS, maxZ = COVER_AABB.maxZ + PLAYER_RADIUS;
  if (x > minX && x < maxX && z > minZ && z < maxZ) {
    const push = [x - minX, maxX - x, z - minZ, maxZ - z];
    const i = push.indexOf(Math.min(...push));
    if (i === 0) x = minX; else if (i === 1) x = maxX; else if (i === 2) z = minZ; else z = maxZ;
  }
  // actor bodies
  for (const a of actors) {
    if (a.hidden || a.state === "down" || a.state === "fled") continue;
    const r = (a.kind === "vehicle" ? 2.2 : a.kind === "plate" ? 0.3 : 0.5) + PLAYER_RADIUS;
    const dx = x - a.x, dz = z - a.z;
    const d = Math.hypot(dx, dz);
    if (d < r) {
      if (d < 1e-4) { x = a.x + r; continue; }
      x = a.x + (dx / d) * r; z = a.z + (dz / d) * r;
    }
  }
  return { x, z };
}

/** Client → engine: where the first-person officer is now. Not logged. */
export function setOfficer(st: TirState, s: TirScenario, x: number, z: number, crouch: boolean): TirState {
  const c = clampOfficer(x, z, s, st.actors);
  const inCover = crouch && inCoverZone(c.x, c.z);
  if (st.officer.x === c.x && st.officer.z === c.z && st.officer.crouch === crouch && st.inCover === inCover) return st;
  return { ...st, officer: { x: c.x, z: c.z, crouch }, inCover };
}

/** No visible unresolved hostile AND nothing hidden waiting to be spawned. */
const allHostilesResolved = (st: TirState) =>
  !st.actors.some((x) => (x.role === "suspect" || x.role === "vehicle") && (x.hidden || !RESOLVED.has(x.state)));

const HUMAN_THREAT: ReadonlySet<TirActorState> = new Set(["weapon_raised", "aiming", "lunging"]);
const RESOLVED: ReadonlySet<TirActorState> = new Set(["kneeling", "down", "calm", "fleeing", "hands_up", "stopped", "fled", "hit"]);

export const ACTOR_TEXT: Partial<Record<TirActorState, string>> = {
  shouting: "baqirmoqda",
  approaching: "yaqinlashmoqda",
  weapon_raised: "qurolni ko'tardi",
  aiming: "QUROLNI XODIMGA QARATDI",
  lunging: "TASHLANDI!",
  dropping: "qurolni tashlamoqda",
  kneeling: "tiz cho'kdi — itoat qildi",
  fleeing: "qochmoqda",
  down: "yerda",
  calm: "tinchlandi",
  hands_up: "qo'llarini ko'tardi",
  cowering: "yerga yotdi",
  held: "garovda",
  walking: "yurib o'tmoqda",
  revving: "motorni gazladi",
  charging: "MASHINA TO'G'RI KELMOQDA!",
  stopped: "mashina to'xtadi",
  fled: "mashina qochdi",
  parked: "to'xtab turibdi",
  idle: "turibdi",
};

/* ------------------------------------------------------------------------ */

export function initTir(s: TirScenario): TirState {
  const actors: TirActor[] = s.actors.map((d) => ({
    ...d,
    agitation: d.agitation ?? 50,
    compliance: d.compliance ?? 20,
    stateSince: 0,
    aimTimer: 0,
    hidden: !!d.hidden,
    hp: 1,
  }));
  let st: TirState = {
    t: 0, actors, officer: { x: 0, z: 0, crouch: false }, health: 100, ammo: { mag: PISTOL.magazine, reserve: PISTOL.reserve, reloadLeft: 0 },
    weaponDrawn: false, inCover: false, backupCalled: false, backupEta: null, backupArrived: false,
    lastTalkAt: null, talkCount: 0, shotsFired: 0, hits: 0, officerHits: 0, lastShotAt: null, firstShotAt: null, score: 0,
    outcome: null, events: [], currentLine: null, lineSeq: 0, shockSeq: 0, scriptDone: [], paused: false,
  };
  st = pushEvent(st, { kind: "system", text: s.briefing.uz });
  const primary = primarySuspect(st);
  if (primary) st = say(st, primary.id, primary.state);
  return st;
}

export function primarySuspect(st: TirState): TirActor | undefined {
  const hostile = st.actors.filter((a) => !a.hidden && (a.role === "suspect" || a.role === "vehicle") && !RESOLVED.has(a.state));
  hostile.sort((a, b) => dist(a, st.officer) - dist(b, st.officer));
  return hostile[0] ?? st.actors.find((a) => a.role === "suspect" || a.role === "vehicle");
}

function snapshot(st: TirState) {
  const p = primarySuspect(st);
  return {
    distance: p ? Math.round(dist(p, st.officer) * 10) / 10 : 0,
    agitation: p ? Math.round(p.agitation) : 0,
    compliance: p ? Math.round(p.compliance) : 0,
  };
}

function pushEvent(st: TirState, e: Omit<TirEvent, "t" | "distance" | "agitation" | "compliance">): TirState {
  return { ...st, events: [...st.events, { t: Math.round(st.t * 10) / 10, ...snapshot(st), ...e }] };
}

function say(st: TirState, actorId: string, state: TirActorState): TirState {
  const a = st.actors.find((x) => x.id === actorId);
  const lines = a?.lines?.[state];
  if (!a || !lines || lines.length === 0) return st;
  return { ...st, currentLine: { actorId, text: lines[st.lineSeq % lines.length] }, lineSeq: st.lineSeq + 1 };
}

function updateActor(st: TirState, id: string, patch: Partial<TirActor>): TirState {
  return { ...st, actors: st.actors.map((a) => (a.id === id ? { ...a, ...patch } : a)) };
}

function setActorState(st: TirState, id: string, next: TirActorState, text?: string): TirState {
  const a = st.actors.find((x) => x.id === id);
  if (!a || a.state === next) return st;
  let out = updateActor(st, id, { state: next, stateSince: st.t, aimTimer: 0 });
  out = pushEvent(out, { kind: "actor", actorId: id, actorState: next, text: text ?? `${a.name} ${ACTOR_TEXT[next] ?? next}` });
  return say(out, id, next);
}

function shock(st: TirState, s: TirScenario, text: string): TirState {
  const dmg = Math.ceil(100 / Math.max(1, s.rules.officerHitsToFail));
  const out: TirState = { ...st, officerHits: st.officerHits + 1, shockSeq: st.shockSeq + 1, health: Math.max(0, st.health - dmg) };
  return pushEvent(out, { kind: "shock", text });
}

/* ------------------------------------------------------------------------ */
/* Officer actions                                                          */
/* ------------------------------------------------------------------------ */

export interface ActionResult {
  state: TirState;
  legality: Score03;
  proportionality: Score03;
  text: string;
}
const noop = (st: TirState): ActionResult => ({ state: st, legality: 3, proportionality: 3, text: "" });

export function applyAction(
  st: TirState,
  s: TirScenario,
  action: TirAction,
  detail?: { hit?: TirHitZone; actorId?: string; phrase?: string }
): ActionResult {
  if (st.outcome || st.paused) return noop(st);
  let n: TirState = { ...st };
  let L: Score03 = 3;
  let P: Score03 = 3;
  let text = "";
  const p = primarySuspect(st);
  const a = p?.state ?? "idle";
  const d = p ? dist(p, st.officer) : 99;
  const threatVisible = !!p && p.weapon !== "none";
  const sinceTalk = st.lastTalkAt == null ? 99 : st.t - st.lastTalkAt;
  const talkEff = sinceTalk < 2.5 ? 0.35 : sinceTalk < 5 ? 0.7 : 1;

  const talkAll = (agitDelta: number, complyBase: number) => {
    n = {
      ...n,
      actors: n.actors.map((x) =>
        x.role === "suspect" && x.kind === "human" && !RESOLVED.has(x.state)
          ? {
              ...x,
              agitation: clamp(x.agitation + agitDelta * talkEff),
              compliance: clamp(x.compliance + complyBase * talkEff * Math.max(0.4, 1.25 - x.agitation / 100)),
            }
          : x.role === "vehicle" && !RESOLVED.has(x.state)
            ? { ...x, compliance: clamp(x.compliance + complyBase * 0.6 * talkEff) }
            : x
      ),
      lastTalkAt: st.t,
      talkCount: st.talkCount + 1,
    };
  };

  switch (action) {
    case "talk_calm": {
      talkAll(a === "weapon_raised" || a === "aiming" ? -7 : -11, 10);
      text = detail?.phrase ?? "Xotirjam muloqot";
      if (a === "lunging" || a === "charging") { P = 1; text += " (kech — xavf rivojlanib bo'lgan)"; }
      break;
    }
    case "talk_command": {
      if ((p?.agitation ?? 0) < 60 || HUMAN_THREAT.has(a) || a === "revving" || a === "parked") talkAll(0, 12);
      else talkAll(4, 0);
      text = detail?.phrase ?? "Buyruq";
      break;
    }
    case "talk_threat": {
      talkAll(14, -5);
      text = detail?.phrase ?? "Tahdid";
      L = a === "lunging" || a === "aiming" ? 3 : 2;
      P = HUMAN_THREAT.has(a) ? 2 : 1;
      break;
    }
    case "draw": {
      if (n.weaponDrawn) return noop(st);
      n.weaponDrawn = true;
      const gunThreat = !!p && p.weapon === "gun";
      const vehicleThreat = !!p && p.role === "vehicle" && (a === "revving" || a === "charging");
      const justified = vehicleThreat || (threatVisible && (HUMAN_THREAT.has(a) || gunThreat || d <= 5));
      L = justified ? 3 : 2;
      P = justified ? 2 : 1;
      if (!justified) n = { ...n, actors: n.actors.map((x) => (x.role === "suspect" ? { ...x, agitation: clamp(x.agitation + 10) } : x)) };
      text = justified ? "Qurol chiqarildi (past tayyor holat)" : "Qurol muddatidan oldin chiqarildi";
      break;
    }
    case "holster": {
      if (!n.weaponDrawn) return noop(st);
      n.weaponDrawn = false;
      const safe = !HUMAN_THREAT.has(a) && a !== "charging";
      P = safe ? 3 : 1;
      text = safe ? "Qurol g'ilofga solindi" : "Xavf paytida qurol g'ilofga solindi";
      break;
    }
    case "taser": {
      if (!p || p.kind !== "human") { text = "Elektroshok — maqsad yo'q"; L = 2; P = 1; break; }
      const inRange = d <= 6;
      const threat = threatVisible && p.weapon !== "gun" && (HUMAN_THREAT.has(a) || (a === "approaching" && p.agitation > 70 && d <= 4));
      if (!inRange) { text = "Elektroshok — masofa uzoq, ta'sir yo'q"; L = threat ? 3 : 1; P = threat ? 2 : 0; break; }
      if (p.weapon === "gun" && HUMAN_THREAT.has(a)) { text = "Elektroshok o'qotar qurolga qarshi — xavfli, ta'sirsiz"; L = 2; P = 1; break; }
      if (threat) {
        L = 3; P = st.talkCount >= 1 ? 3 : 2;
        text = "Elektroshok qo'llanildi — shaxs yerga tushdi";
        n = setActorState(n, p.id, "down", `${p.name} elektroshokdan yerga tushdi`);
        if (allHostilesResolved(n)) n.outcome = "resolved_less_lethal";
      } else {
        L = 1; P = 0;
        text = "Elektroshok xavf bo'lmagan holatda — nomutanosib kuch";
        n = setActorState(n, p.id, "down", `${p.name} elektroshokdan yerga tushdi`);
        n.outcome = "unlawful_force";
      }
      break;
    }
    case "reload": {
      if (n.ammo.reloadLeft > 0 || n.ammo.reserve <= 0 || n.ammo.mag >= PISTOL.magazine) return noop(st);
      n.ammo = { ...n.ammo, reloadLeft: PISTOL.reloadSec };
      text = "Magazin almashtirilmoqda";
      break;
    }
    case "shoot": {
      if (!n.weaponDrawn) return noop(st);
      if (n.ammo.reloadLeft > 0) return { state: st, legality: 3, proportionality: 3, text: "" };
      if (n.ammo.mag <= 0) return { state: st, legality: 3, proportionality: 3, text: "Magazin bo'sh — R (qayta zaryad)" };
      n.ammo = { ...n.ammo, mag: n.ammo.mag - 1 };
      const zone: TirHitZone = detail?.hit ?? "miss";
      const target = detail?.actorId ? n.actors.find((x) => x.id === detail.actorId) : undefined;
      const split = st.lastShotAt == null ? undefined : Math.round((st.t - st.lastShotAt) * 100) / 100;
      n.shotsFired++;
      n.lastShotAt = st.t;
      if (n.firstShotAt == null) n.firstShotAt = st.t;

      // Marksmanship plate
      if (s.mode === "marksmanship") {
        if (target && target.kind === "plate" && target.state === "standing" && zone !== "miss") {
          n.hits++;
          n.score += 1;
          n = updateActor(n, target.id, { state: "hit", stateSince: st.t });
          text = `Plastina ${target.name} — TEGDI`;
          if (n.actors.filter((x) => x.kind === "plate").every((x) => x.state === "hit")) {
            n.outcome = "range_complete";
          }
        } else text = "O'q — o'tib ketdi";
        return { state: pushEvent(n, { kind: "action", action, text, hit: zone, split, actorId: target?.id }), legality: 3, proportionality: 3, text };
      }

      if (!target || zone === "miss") {
        // Missing near bystanders is still a decision. Was there a lawful reason to fire at all?
        const lawful =
          !!p && (p.role === "vehicle" ? p.state === "charging" : shootLegality(p, s, st.officer).legality >= 2);
        L = lawful ? 2 : 0;
        P = lawful ? 2 : 0;
        text = lawful ? "O'q uzildi — tegmadi" : "O'q uzildi xavf shartlarisiz — tegmadi";
        if (!lawful) n.outcome = "unlawful_force";
        return { state: pushEvent(n, { kind: "action", action, text, hit: zone, split }), legality: L, proportionality: P, text };
      }

      // Non-threat human hit → fail.
      if (target.role === "bystander" || target.role === "hostage" || target.role === "police") {
        L = 0; P = 0;
        text =
          target.role === "police" ? `FORMADAGI XODIM otildi (${target.name})` :
          target.role === "hostage" ? `GAROVDAGI SHAXS otildi (${target.name})` : `TINCH FUQARO otildi (${target.name})`;
        n.hits++;
        n = setActorState(n, target.id, "down", `${target.name} yerga tushdi`);
        n.outcome = "civilian_hit";
        return { state: pushEvent(n, { kind: "action", action, text, hit: zone, split, actorId: target.id }), legality: L, proportionality: P, text };
      }

      // Vehicle
      if (target.role === "vehicle") {
        const charging = target.state === "charging";
        const close = dist(target, st.officer) <= s.rules.vehicleThreatDistance;
        if (zone === "tire") {
          if (charging) { L = 3; P = 3; text = "Balonga o'q — oxirgi chora, mashina to'xtadi"; n.hits++; n = setActorState(n, target.id, "stopped", "Mashina balonlari yorildi — to'xtadi"); n.outcome = "vehicle_stopped"; }
          else if (target.state === "revving") { L = 1; P = 1; text = "Balonga o'q — mashina hali harakatlanmagan (muddatidan oldin)"; n.hits++; n = setActorState(n, target.id, "stopped"); n.outcome = "unlawful_force"; }
          else { L = 0; P = 0; text = "To'xtab turgan mashinaga o'q — qonunsiz"; n.hits++; n.outcome = "unlawful_force"; }
        } else if (zone === "driver") {
          if (charging && close) { L = 2; P = 2; text = "Haydovchiga o'q — bevosita xavf, ammo balon afzal edi"; n.hits++; n = setActorState(n, target.id, "stopped", "Haydovchi jarohatlandi, mashina to'xtadi"); n.outcome = "resolved_lethal_lawful"; }
          else { L = 0; P = 0; text = "Haydovchiga o'q — xavf shartlari yo'q"; n.hits++; n.outcome = "unlawful_force"; }
        } else {
          L = charging ? 2 : 0; P = charging ? 1 : 0; text = charging ? "Mashina tanasiga o'q — ta'sirsiz" : "Mashinaga o'q — qonunsiz";
          n.hits++;
          if (!charging) n.outcome = "unlawful_force";
        }
        return { state: pushEvent(n, { kind: "action", action, text, hit: zone, split, actorId: target.id }), legality: L, proportionality: P, text };
      }

      // Suspect human
      const leg = shootLegality(target, s, st.officer);
      L = leg.legality; P = leg.proportionality;
      n.hits++;
      text = `${leg.text} (${target.name}, ${zone})`;
      // hit zones: head 1.0 / torso 0.6 / limb 0.35 of hp — a limb hit rarely stops an attacker
      const dmg = PISTOL.damage * (zone === "head" || zone === "torso" || zone === "limb" ? ZONE_DAMAGE[zone] : 0.6);
      const hpLeft = Math.max(0, target.hp - dmg);
      n = updateActor(n, target.id, { hp: hpLeft });
      const stays = hpLeft > 0.001;
      if (!stays) {
        n = setActorState(n, target.id, "down", `${target.name} o'qdan yerga tushdi`);
        // hostage released
        if (target.holds) n = setActorState(n, target.holds, "cowering", "Garovdagi shaxs ozod");
      } else text += " — to'xtamadi";
      if (L === 0) n.outcome = "unlawful_force";
      else if (allHostilesResolved(n)) n.outcome = "resolved_lethal_lawful";
      return { state: pushEvent(n, { kind: "action", action, text, hit: zone, split, actorId: target.id }), legality: L, proportionality: P, text };
    }
    case "backup": {
      if (n.backupCalled) return noop(st);
      n.backupCalled = true;
      n.backupEta = s.rules.backupEtaSec;
      text = `Qo'shimcha kuch va tez yordam chaqirildi (≈${s.rules.backupEtaSec}s)`;
      break;
    }
    case "retreat": {
      n = { ...n, actors: n.actors.map((x) => (x.kind !== "plate" ? { ...x, z: x.z - 2 } : x)) };
      P = d < 6 ? 3 : 2;
      text = "Masofa oshirildi (vaqt + masofa)";
      break;
    }
    case "cover": {
      n.inCover = !n.inCover;
      text = n.inCover ? "To'siq ortiga o'tildi" : "To'siqdan chiqildi";
      P = n.inCover ? 3 : 2;
      break;
    }
  }
  return { state: pushEvent(n, { kind: "action", action, text, legality: L, proportionality: P, actorId: p?.id }), legality: L, proportionality: P, text };
}

/** Legality of shooting THIS suspect right now. */
function shootLegality(a: TirActor, s: TirScenario, o: OfficerPos): { legality: Score03; proportionality: Score03; text: string } {
  const d = dist(a, o);
  if (a.weapon === "gun") {
    if (a.state === "aiming") return { legality: 3, proportionality: 3, text: "O'q — o'qotar qurol xodimga/fuqaroga qaratilgan" };
    if (a.state === "weapon_raised") return { legality: 3, proportionality: 3, text: "O'q — o'qotar qurol ko'tarilgan" };
    if (a.state === "fleeing") return { legality: 1, proportionality: 1, text: "Qochayotgan shaxsga o'q — bevosita xavf yo'q" };
    if (a.state === "hands_up" || a.state === "kneeling" || a.state === "dropping") return { legality: 0, proportionality: 0, text: "Taslim bo'lgan shaxsga o'q" };
    return { legality: 1, proportionality: 1, text: "Qurol ko'rinadi, ammo qaratilmagan — muloqot/buyruq kerak edi" };
  }
  if (a.state === "lunging" && d <= s.rules.lungeDistance + 0.5) return { legality: 3, proportionality: 3, text: "O'q — oxirgi chora (tashlanish)" };
  if (a.state === "weapon_raised" && d <= 3 && a.agitation >= 85) return { legality: 2, proportionality: 2, text: "O'q — bevosita xavf" };
  if (a.weapon === "none") return { legality: 0, proportionality: 0, text: "Qurolsiz shaxsga o'q" };
  return { legality: 0, proportionality: 0, text: "O'q — xavf shartlari YO'Q" };
}

/* ------------------------------------------------------------------------ */
/* Tick                                                                     */
/* ------------------------------------------------------------------------ */

export function tick(st: TirState, s: TirScenario, dt: number): TirState {
  if (st.outcome || st.paused) return st;
  let n: TirState = { ...st, t: st.t + dt };
  const r = s.rules;
  const sinceTalk = n.lastTalkAt == null ? n.t : n.t - n.lastTalkAt;

  // Script
  s.script.forEach((op, idx) => {
    if (n.scriptDone.includes(idx) || n.t < op.atSec) return;
    n = { ...n, scriptDone: [...n.scriptDone, idx] };
    if (op.op === "spawn") {
      n = updateActor(n, op.actorId, { hidden: false, stateSince: n.t });
      const a = n.actors.find((x) => x.id === op.actorId);
      n = pushEvent(n, { kind: "actor", actorId: op.actorId, actorState: a?.state, text: op.text ?? `${a?.name ?? op.actorId} paydo bo'ldi` });
      if (a) n = say(n, a.id, a.state);
    } else if (op.op === "set_state") n = setActorState(n, op.actorId, op.state, op.text);
    else if (op.op === "move") n = updateActor(n, op.actorId, { x: op.x, z: op.z });
    else if (op.op === "say") { n = { ...n, currentLine: { actorId: op.actorId, text: op.text }, lineSeq: n.lineSeq + 1 }; }
    else if (op.op === "system") n = pushEvent(n, { kind: "system", text: op.text });
    else if (op.op === "escalate_if_hostile") {
      const a = n.actors.find((x) => x.id === op.actorId);
      if (a && !RESOLVED.has(a.state) && a.compliance < r.complyCompliance) n = setActorState(n, op.actorId, op.state, op.text);
    }
  });

  // Reload
  if (n.ammo.reloadLeft > 0) {
    const left = Math.max(0, n.ammo.reloadLeft - dt);
    if (left === 0) {
      const need = PISTOL.magazine - n.ammo.mag;
      const take = Math.min(need, n.ammo.reserve);
      n = { ...n, ammo: { mag: n.ammo.mag + take, reserve: n.ammo.reserve - take, reloadLeft: 0 } };
      n = pushEvent(n, { kind: "action", action: "reload", text: `Magazin almashtirildi (${n.ammo.mag}/${n.ammo.reserve})`, legality: 3, proportionality: 3 });
    } else n = { ...n, ammo: { ...n.ammo, reloadLeft: left } };
  }

  // Backup
  if (n.backupCalled && n.backupEta != null && !n.backupArrived) {
    n.backupEta = Math.max(0, n.backupEta - dt);
    if (n.backupEta === 0) {
      n.backupArrived = true;
      n = { ...n, actors: n.actors.map((x) => (x.role === "suspect" ? { ...x, agitation: clamp(x.agitation - 15), compliance: HUMAN_THREAT.has(x.state) ? x.compliance : clamp(x.compliance + 15) } : x)) };
      n = pushEvent(n, { kind: "system", text: "Qo'shimcha kuch yetib keldi" });
    }
  }

  // Per-actor dynamics
  for (const a0 of n.actors) {
    if (a0.hidden || RESOLVED.has(a0.state)) continue;
    let a = { ...a0 };
    const o = n.officer;
    const d = dist(a, o);
    const since = n.t - a.stateSince;
    /** Step toward the officer by `metres`, never closer than `stop`. */
    const stepTo = (metres: number, stop: number) => {
      if (d <= stop || d < 1e-3) return;
      const step = Math.min(metres, d - stop);
      a.x += ((o.x - a.x) / d) * step;
      a.z += ((o.z - a.z) / d) * step;
    };

    if (a.kind === "human" && a.role === "suspect") {
      if ((a.state === "shouting" || a.state === "approaching" || a.state === "weapon_raised") && sinceTalk > 6) a.agitation = clamp(a.agitation + r.silenceDrift * dt);
      if (n.weaponDrawn && !HUMAN_THREAT.has(a.state) && a.weapon !== "gun") a.agitation = clamp(a.agitation + 1.5 * dt);
      const speed = a.speed ?? 0.45;
      const moveTowards = (v: number) => stepTo(v * dt, r.minDistance);
      let next: TirActorState | null = null;
      switch (a.state) {
        case "shouting":
          if (a.agitation >= 55 && since > 4) next = "approaching";
          else if (a.compliance >= r.complyCompliance && a.agitation < 45) next = a.weapon === "none" ? "calm" : "dropping";
          break;
        case "approaching":
          moveTowards(speed);
          if (a.weapon !== "none" && a.agitation >= 70) next = "weapon_raised";
          else if (a.compliance >= r.complyCompliance && a.agitation < 55) next = a.weapon === "none" ? "calm" : "dropping";
          else if (a.agitation < 40) next = "shouting";
          break;
        case "weapon_raised":
          if (a.weapon === "gun") {
            if (a.agitation >= 80 && since > 2) next = "aiming";
            else if (a.compliance >= r.complyCompliance) next = "dropping";
          } else {
            if (a.agitation >= 60) moveTowards(speed * 0.6);
            if (a.agitation >= r.lungeAgitation && d <= r.lungeDistance) next = "lunging";
            else if (a.compliance >= r.complyCompliance) next = "dropping";
            else if (a.agitation < 50 && since > 6) next = "approaching";
          }
          break;
        case "aiming": {
          a.aimTimer += dt;
          const aimSec = a.aimSec ?? 3;
          if (a.aimTimer >= aimSec) {
            a.aimTimer = a.keepsFiring ? aimSec - 2.2 : 0;
            const hitChance = n.inCover ? 0.25 : 0.65;
            n = { ...n, actors: n.actors.map((x) => (x.id === a.id ? a : x)) };
            if (Math.random() < hitChance) n = shock(n, s, `${a.name} xodimga o'q uzdi — TEGDI (elektroshok)`);
            else n = pushEvent(n, { kind: "actor", actorId: a.id, text: `${a.name} xodimga o'q uzdi — o'tib ketdi` });
            if (!a.keepsFiring) next = "weapon_raised";
            if (n.officerHits >= r.officerHitsToFail || n.health <= 0) n.outcome = "officer_down";
            a = n.actors.find((x) => x.id === a.id)!;
          }
          if (a.compliance >= r.complyCompliance + 15) next = "dropping";
          break;
        }
        case "lunging":
          stepTo(3.2 * dt, 0.3);
          if (d <= 0.5) {
            if (n.inCover) {
              a.agitation = clamp(a.agitation - 20);
              const ux = d > 0.05 ? (a.x - o.x) / d : 0, uz = d > 0.05 ? (a.z - o.z) / d : -1;
              a.x = o.x + ux * 2; a.z = o.z + uz * 2;
              next = "weapon_raised";
              n = pushEvent(n, { kind: "system", text: `${a.name} to'siqqa urildi — xodim to'siq ortida` });
            } else { n = shock(n, s, `${a.name} xodimga yetib keldi — jarohat (elektroshok)`); n.outcome = "officer_injured"; }
          }
          break;
        case "dropping":
          if (since > 2) next = "kneeling";
          break;
        default:
          break;
      }
      n = { ...n, actors: n.actors.map((x) => (x.id === a.id ? a : x)) };
      if (next) n = setActorState(n, a.id, next);
    } else if (a.kind === "vehicle") {
      switch (a.state) {
        case "revving":
          if (a.compliance >= r.complyCompliance) { n = setActorState(n, a.id, "stopped", "Haydovchi motorni o'chirdi — itoat qildi"); }
          break;
        case "charging": {
          const v = a.speed ?? 6;
          stepTo(v * dt, 0);
          n = { ...n, actors: n.actors.map((x) => (x.id === a.id ? a : x)) };
          if (d <= 1.2) {
            if (n.inCover) { n = pushEvent(n, { kind: "system", text: "Mashina to'siq yonidan o'tib ketdi — xodim to'siq ortida" }); n = setActorState(n, a.id, "fled"); n.outcome = "timeout"; }
            else { n = shock(n, s, "Mashina xodimga urildi (elektroshok)"); n.outcome = "officer_down"; }
          }
          break;
        }
        default:
          break;
      }
    }
  }

  // Resolution checks
  if (!n.outcome && s.mode === "scenario") {
    const hostiles = n.actors.filter((x) => !x.hidden && (x.role === "suspect" || x.role === "vehicle") && !RESOLVED.has(x.state));
    const pendingSpawns = s.script.some((op, i) => op.op === "spawn" && !n.scriptDone.includes(i));
    if (hostiles.length === 0 && !pendingSpawns) {
      const allCalm = n.actors.filter((x) => x.role === "suspect" || x.role === "vehicle").every((x) => x.state === "kneeling" || x.state === "calm" || x.state === "hands_up" || x.state === "stopped");
      const settled = n.actors.filter((x) => (x.role === "suspect" || x.role === "vehicle") && RESOLVED.has(x.state)).every((x) => n.t - x.stateSince > 3);
      if (settled) {
        n.outcome = allCalm ? (n.actors.some((x) => x.role === "vehicle") ? "vehicle_stopped" : "resolved_verbal") : "resolved_lethal_lawful";
        n = pushEvent(n, { kind: "system", text: allCalm ? "Vaziyat kuch ishlatmasdan hal qilindi" : "Vaziyat hal qilindi" });
      }
    }
    if (!n.outcome && n.t >= r.durationSec) {
      n.outcome = "timeout";
      n = pushEvent(n, { kind: "system", text: "Vaqt tugadi — vaziyat hal qilinmadi" });
    }
  } else if (!n.outcome && s.mode === "marksmanship" && n.t >= r.durationSec) {
    n.outcome = "range_complete";
  }
  return n;
}

/* ------------------------------------------------------------------------ */
/* Instructor (ghost mode) commands                                          */
/* ------------------------------------------------------------------------ */

export type InstructorCmd =
  | { cmd: "escalate" }
  | { cmd: "deescalate" }
  | { cmd: "spawn"; actorId: string }
  | { cmd: "set_state"; actorId: string; state: TirActorState }
  | { cmd: "pause" }
  | { cmd: "resume" }
  | { cmd: "all_stop" };

export function applyInstructor(st: TirState, s: TirScenario, c: InstructorCmd): TirState {
  let n = { ...st };
  switch (c.cmd) {
    case "escalate":
      n = { ...n, actors: n.actors.map((x) => (x.role === "suspect" && !RESOLVED.has(x.state) ? { ...x, agitation: clamp(x.agitation + 20), compliance: clamp(x.compliance - 10) } : x)) };
      return pushEvent(n, { kind: "system", text: "Instruktor: vaziyat keskinlashtirildi" });
    case "deescalate":
      n = { ...n, actors: n.actors.map((x) => (x.role === "suspect" && !RESOLVED.has(x.state) ? { ...x, agitation: clamp(x.agitation - 20), compliance: clamp(x.compliance + 10) } : x)) };
      return pushEvent(n, { kind: "system", text: "Instruktor: vaziyat yumshatildi" });
    case "spawn": {
      n = updateActor(n, c.actorId, { hidden: false, stateSince: n.t });
      const a = n.actors.find((x) => x.id === c.actorId);
      return pushEvent(n, { kind: "actor", actorId: c.actorId, actorState: a?.state, text: `Instruktor: ${a?.name ?? c.actorId} sahnaga kiritildi` });
    }
    case "set_state":
      return setActorState(n, c.actorId, c.state, `Instruktor: ${n.actors.find((x) => x.id === c.actorId)?.name ?? c.actorId} → ${ACTOR_TEXT[c.state] ?? c.state}`);
    case "pause":
      return { ...n, paused: true };
    case "resume":
      return { ...n, paused: false };
    case "all_stop":
      n.outcome = "timeout";
      return pushEvent(n, { kind: "system", text: "ALL STOP — instruktor ssenariyni to'xtatdi" });
  }
  void s;
  return n;
}

/* ------------------------------------------------------------------------ */
/* Scoring helpers (HUD)                                                    */
/* ------------------------------------------------------------------------ */

export function hitFactor(st: TirState): number {
  if (st.firstShotAt == null || st.lastShotAt == null) return 0;
  const total = Math.max(st.lastShotAt - st.firstShotAt, 0.01);
  return Math.round((st.hits / total) * 1000) / 1000;
}

/* ------------------------------------------------------------------------ */
/* Talk classification                                                      */
/* ------------------------------------------------------------------------ */

const THREAT_WORDS = ["otaman", "o'ldiraman", "sindiraman", "urib", "ot!", "tashla bo'lmasa", "стреля", "убью", "сломаю"];
const COMMAND_WORDS = ["qo'ying", "qo'y", "tashlang", "tashla", "to'xtang", "to'xta", "orqaga", "yerga", "qo'lingizni", "motorni", "chiqing", "положи", "брось", "стой", "назад", "руки", "выходи"];
const CALM_WORDS = ["tushunaman", "eshitaman", "yordam", "xotirjam", "ismingiz", "gaplashamiz", "kerak emas", "hech kim", "ishonaman", "понимаю", "помогу", "спокойно", "поговорим"];

export function classifyTalk(text: string): TirAction {
  const t = text.toLowerCase();
  if (THREAT_WORDS.some((w) => t.includes(w))) return "talk_threat";
  const cmd = COMMAND_WORDS.some((w) => t.includes(w));
  const calm = CALM_WORDS.some((w) => t.includes(w));
  if (cmd && !calm) return "talk_command";
  return "talk_calm";
}

export const TIR_PRESET_PHRASES: { action: TirAction; uz: string }[] = [
  { action: "talk_calm", uz: "Men ichki ishlar xodimi. Sizga yordam berish uchun keldim — meni eshiting." },
  { action: "talk_calm", uz: "Tushunaman, sizga og'ir. Hech kim sizga tegmaydi. Ismingiz nima?" },
  { action: "talk_command", uz: "Qurolni yerga qo'ying va orqaga bir qadam tashlang!" },
  { action: "talk_command", uz: "To'xtang! Motorni o'chiring, qo'llaringizni ko'rsating!" },
  { action: "talk_threat", uz: "Tashla, bo'lmasa otaman!" },
];

export function outcomeSummary(o: TirOutcome): { uz: string; tone: "good" | "partial" | "bad" } {
  switch (o) {
    case "resolved_verbal": return { uz: "Kuch ishlatmasdan hal qilindi — a'lo natija", tone: "good" };
    case "resolved_less_lethal": return { uz: "Elektroshok bilan, qonuniy va mutanosib", tone: "good" };
    case "resolved_lethal_lawful": return { uz: "O'q uzildi — oxirgi chora sifatida qonuniy", tone: "partial" };
    case "vehicle_stopped": return { uz: "Mashina to'xtatildi — xavf bartaraf", tone: "good" };
    case "unlawful_force": return { uz: "Nomutanosib / qonunsiz kuch", tone: "bad" };
    case "civilian_hit": return { uz: "TINCH FUQARO / GAROVDAGI / XODIM otildi — nishonni farqlash xatosi", tone: "bad" };
    case "officer_injured": return { uz: "Xodim jarohatlandi — vaziyat nazoratdan chiqdi", tone: "bad" };
    case "officer_down": return { uz: "Xodim safdan chiqdi", tone: "bad" };
    case "timeout": return { uz: "Vaqt tugadi / to'xtatildi", tone: "partial" };
    case "range_complete": return { uz: "Marksmanship yakunlandi", tone: "good" };
  }
}
