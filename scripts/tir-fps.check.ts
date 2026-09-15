// FPS-phase engine checks: officer position/collision, ammo/reload, hp zones, chase toward officer. Run: npm run check:tir:fps
import { initTir, setOfficer, clampOfficer, applyAction, tick, primarySuspect } from "../src/lib/training/tirEngine";
import { TIR_SCENARIOS } from "../data/scenarios/tir";

let pass = 0, fail = 0;
const ok = (n: string, c: boolean, note = "") => { if (c) pass++; else fail++; console.log(`${c ? "PASS" : "FAIL"}  ${n}${note ? " — " + note : ""}`); };

const crowd = TIR_SCENARIOS.find((s) => s.id === "tir-olomon-pichoq")!;
const bld = TIR_SCENARIOS.find((s) => s.id === "tir-bino-otuvchi")!;
const car = TIR_SCENARIOS.find((s) => s.id === "tir-mashina-balon")!;

// setOfficer + clamp
let st = initTir(crowd);
ok("init officer at origin, health 100, ammo 15/30", st.officer.x === 0 && st.health === 100 && st.ammo.mag === 15 && st.ammo.reserve === 30);
st = setOfficer(st, crowd, 20, 0, false);
ok("bounds clamp radius 6", Math.abs(Math.hypot(st.officer.x, st.officer.z) - 6) < 1e-6, `${st.officer.x.toFixed(2)},${st.officer.z.toFixed(2)}`);
const c = clampOfficer(1.4, -0.6, crowd, st.actors);
ok("cover AABB pushes out", !(c.x > 1.1 && c.x < 1.7 && c.z > -1.4 && c.z < 0.2), `${c.x.toFixed(2)},${c.z.toFixed(2)}`);
const s1 = crowd.actors.find((a) => a.id === "s1")!;
const c2 = clampOfficer(s1.x, s1.z, crowd, initTir(crowd).actors);
ok("actor body pushes out (≥0.8 m)", Math.hypot(c2.x - s1.x, c2.z - s1.z) >= 0.79, Math.hypot(c2.x - s1.x, c2.z - s1.z).toFixed(2));
st = setOfficer(initTir(crowd), crowd, 1.0, 0.4, true);
ok("crouch behind block = inCover", st.inCover === true);
st = setOfficer(st, crowd, 1.0, 0.4, false);
ok("stand up = not inCover", st.inCover === false);
st = setOfficer(st, crowd, -3, -1, true);
ok("crouch elsewhere ≠ cover", st.inCover === false);

// distance relative to officer
st = initTir(crowd);
const d0 = st.events[0].distance;
st = setOfficer(st, crowd, 0, -3, false);
st = tick(st, crowd, 0.1);
const p = primarySuspect(st)!;
ok("distance measured from officer", Math.hypot(p.x - st.officer.x, p.z - st.officer.z) < d0, `${d0} → ${Math.hypot(p.x - st.officer.x, p.z - st.officer.z).toFixed(2)}`);

// chase toward officer (approaching)
st = initTir(crowd);
st = setOfficer(st, crowd, -4, -2, false);
st = { ...st, actors: st.actors.map((a) => (a.id === "s1" ? { ...a, state: "approaching" as const, agitation: 60, compliance: 0 } : a)) };
const before = st.actors.find((a) => a.id === "s1")!;
const dBefore = Math.hypot(before.x - st.officer.x, before.z - st.officer.z);
for (let i = 0; i < 20; i++) st = tick(st, crowd, 0.1);
const after = st.actors.find((a) => a.id === "s1")!;
const dAfter = Math.hypot(after.x - st.officer.x, after.z - st.officer.z);
ok("approaching actor moves toward the officer", dAfter < dBefore - 0.3, `${dBefore.toFixed(2)} → ${dAfter.toFixed(2)}`);

// ammo / reload
st = initTir(bld);
st = applyAction(st, bld, "draw").state;
for (let i = 0; i < 15; i++) st = applyAction(st, bld, "shoot", { hit: "miss" }).state;
ok("15 shots empty the magazine", st.ammo.mag === 0 && st.shotsFired === 15, `mag=${st.ammo.mag} shots=${st.shotsFired}`);
const dry = applyAction(st, bld, "shoot", { hit: "miss" });
ok("dry fire: no shot, message", dry.state.shotsFired === 15 && /Magazin bo'sh/.test(dry.text));
st = applyAction(st, bld, "reload").state;
ok("reload starts", st.ammo.reloadLeft > 0);
const duringReload = applyAction(st, bld, "shoot", { hit: "miss" });
ok("no shot while reloading", duringReload.state === st);
for (let i = 0; i < 20; i++) st = tick(st, bld, 0.1);
ok("reload completes 15/15", st.ammo.mag === 15 && st.ammo.reserve === 15, `${st.ammo.mag}/${st.ammo.reserve}`);

// hp zones: limb 0.35 doesn't stop; torso 0.6 + limb stops
st = initTir(bld);
st = { ...st, actors: st.actors.map((a) => (a.id === "g1" ? { ...a, hidden: false, state: "aiming" as const } : a)) };
st = applyAction(st, bld, "draw").state;
let r = applyAction(st, bld, "shoot", { hit: "limb", actorId: "g1" });
const g1 = r.state.actors.find((a) => a.id === "g1")!;
ok("limb hit: hp 0.65, still up", Math.abs(g1.hp - 0.65) < 1e-6 && g1.state !== "down", `hp=${g1.hp} state=${g1.state}`);
r = applyAction(r.state, bld, "shoot", { hit: "torso", actorId: "g1" });
ok("torso hit after limb: down", r.state.actors.find((a) => a.id === "g1")!.state === "down");
st = initTir(bld);
st = { ...st, actors: st.actors.map((a) => (a.id === "g1" ? { ...a, hidden: false, state: "aiming" as const } : a)) };
st = applyAction(st, bld, "draw").state;
r = applyAction(st, bld, "shoot", { hit: "head", actorId: "g1" });
ok("head hit: down at once, lawful", r.state.actors.find((a) => a.id === "g1")!.state === "down" && r.legality === 3);

// officer health via shock
st = initTir(bld);
st = { ...st, actors: st.actors.map((a) => (a.id === "g1" ? { ...a, hidden: false, state: "aiming" as const, aimTimer: 2.5, agitation: 100 } : a)) };
let hits = 0;
for (let i = 0; i < 400 && !st.outcome; i++) { st = tick(st, bld, 0.1); hits = st.officerHits; }
ok("health drops per hit, officer_down at fail count", st.health === 100 - Math.ceil(100 / bld.rules.officerHitsToFail) * hits, `health=${st.health} hits=${hits} outcome=${st.outcome}`);

// vehicle charges toward moved officer
st = initTir(car);
st = setOfficer(st, car, -4, -3, false);
st = { ...st, actors: st.actors.map((a) => (a.kind === "vehicle" ? { ...a, state: "charging" as const } : a)) };
const v0 = st.actors.find((a) => a.kind === "vehicle")!;
const dv0 = Math.hypot(v0.x - st.officer.x, v0.z - st.officer.z);
for (let i = 0; i < 5; i++) st = tick(st, car, 0.1);
const v1 = st.actors.find((a) => a.kind === "vehicle")!;
const dv1 = Math.hypot(v1.x - st.officer.x, v1.z - st.officer.z);
ok("charging car heads for the officer", dv1 < dv0 - 2, `${dv0.toFixed(1)} → ${dv1.toFixed(1)}`);

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
