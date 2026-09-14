import { applyAction, applyInstructor, initTir, tick } from "@/lib/training/tirEngine";
import { tirBino, tirMashinaBalon, tirOlomon, tirPlateRack } from "@/data/scenarios/tir";

let pass = 0, fail = 0;
const check = (name: string, ok: boolean, note = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${note ? " — " + note : ""}`); };

// 1) Vehicle
{
  let st = initTir(tirMashinaBalon);
  let r = applyAction(st, tirMashinaBalon, "draw"); st = r.state;
  check("vehicle: draw while parked → premature (L2/P1)", r.legality === 2 && r.proportionality === 1, r.text);
  r = applyAction(st, tirMashinaBalon, "shoot", { hit: "tire", actorId: "car" });
  check("vehicle: tire shot while PARKED → unlawful", r.legality === 0 && r.state.outcome === "unlawful_force", r.text);

  st = initTir(tirMashinaBalon);
  st = applyInstructor(st, tirMashinaBalon, { cmd: "set_state", actorId: "car", state: "charging" });
  r = applyAction(st, tirMashinaBalon, "draw"); st = r.state;
  check("vehicle: draw while CHARGING → justified (L3)", r.legality === 3, r.text);
  const miss = applyAction(st, tirMashinaBalon, "shoot", { hit: "miss" });
  check("vehicle: miss while charging → lawful, run continues", miss.legality >= 2 && miss.state.outcome === null, miss.text);
  r = applyAction(miss.state, tirMashinaBalon, "shoot", { hit: "tire", actorId: "car" });
  check("vehicle: TIRE shot while CHARGING → lawful, vehicle_stopped", r.legality === 3 && r.state.outcome === "vehicle_stopped", r.text);
  let near = st; for (let i = 0; i < 6; i++) near = tick(near, tirMashinaBalon, 0.1); // car closes to ~10 m
  const drv = applyAction(near, tirMashinaBalon, "shoot", { hit: "driver", actorId: "car" });
  check("vehicle: driver shot while charging → L2 (tire preferred)", drv.legality === 2 && drv.state.outcome === "resolved_lethal_lawful", drv.text);

  // charging car reaches officer without cover → officer_down + shock
  let s2 = initTir(tirMashinaBalon);
  s2 = applyInstructor(s2, tirMashinaBalon, { cmd: "set_state", actorId: "car", state: "charging" });
  for (let i = 0; i < 60 && !s2.outcome; i++) s2 = tick(s2, tirMashinaBalon, 0.1);
  check("vehicle: charging car hits officer → officer_down + shock", s2.outcome === "officer_down" && s2.shockSeq === 1, `${s2.outcome} shock=${s2.shockSeq}`);
}

// 2) Crowd / hostage
{
  let st = initTir(tirOlomon);
  st = applyAction(st, tirOlomon, "draw").state;
  let r = applyAction(st, tirOlomon, "shoot", { hit: "torso", actorId: "h1" });
  check("crowd: shooting HOSTAGE → civilian_hit", r.state.outcome === "civilian_hit" && r.legality === 0, r.text);
  r = applyAction(st, tirOlomon, "shoot", { hit: "torso", actorId: "b2" });
  check("crowd: shooting BYSTANDER → civilian_hit", r.state.outcome === "civilian_hit", r.text);
  r = applyAction(st, tirOlomon, "shoot", { hit: "torso", actorId: "s1" });
  check("crowd: shooting knife-man while only shouting → unlawful", r.legality === 0 && r.state.outcome === "unlawful_force", r.text);
  // de-escalate by talking every 5s → resolves verbally
  let s3 = initTir(tirOlomon);
  for (let t = 0; t < 900 && !s3.outcome; t++) {
    if (t % 50 === 0) s3 = applyAction(s3, tirOlomon, t % 100 === 0 ? "talk_calm" : "talk_command").state;
    s3 = tick(s3, tirOlomon, 0.1);
  }
  check("crowd: steady calm talk → resolved_verbal within 90s", s3.outcome === "resolved_verbal", `${s3.outcome} t=${s3.t.toFixed(0)}`);
}

// 3) Building
{
  let st = initTir(tirBino);
  for (let i = 0; i < 60; i++) st = tick(st, tirBino, 0.1); // t=6 → g1 spawned + aiming
  st = applyAction(st, tirBino, "draw").state;
  const g1 = st.actors.find((a) => a.id === "g1")!;
  check("building: gunman spawned and aiming by t=6", !g1.hidden && g1.state === "aiming", g1.state);
  let r = applyAction(st, tirBino, "shoot", { hit: "torso", actorId: "g1" });
  check("building: shooting AIMING gunman → lawful L3", r.legality === 3 && r.proportionality === 3, r.text);
  let s2 = r.state;
  for (let i = 0; i < 90; i++) s2 = tick(s2, tirBino, 0.1); // t=15 → cop spawned
  const cop = s2.actors.find((a) => a.id === "cop")!;
  check("building: uniformed cop spawned at t=14", !cop.hidden, cop.state);
  r = applyAction(s2, tirBino, "shoot", { hit: "torso", actorId: "cop" });
  check("building: shooting UNIFORMED COP → civilian_hit", r.state.outcome === "civilian_hit", r.text);
  let s4 = s2;
  for (let i = 0; i < 80; i++) s4 = tick(s4, tirBino, 0.1); // t=23 → g2 hands up
  const g2 = s4.actors.find((a) => a.id === "g2")!;
  r = applyAction(s4, tirBino, "shoot", { hit: "torso", actorId: "g2" });
  check("building: shooting HANDS-UP man → unlawful", g2.state === "hands_up" && r.legality === 0, `${g2.state}: ${r.text}`);
  // unaddressed aiming gunman fires → shock
  let s5 = initTir(tirBino);
  for (let i = 0; i < 120 && !s5.outcome; i++) s5 = tick(s5, tirBino, 0.1);
  const fired = s5.events.filter((e) => e.kind === "shock" || /o'q uzdi/.test(e.text)).length;
  check("building: ignored gunman keeps firing (shock or miss events)", fired >= 2, `fired=${fired} shocks=${s5.shockSeq} outcome=${s5.outcome}`);
}

// 4) Marksmanship
{
  let st = initTir(tirPlateRack);
  st = applyAction(st, tirPlateRack, "draw").state;
  for (let i = 1; i <= 6; i++) { st = tick(st, tirPlateRack, 0.4); st = applyAction(st, tirPlateRack, "shoot", { hit: "plate", actorId: `p${i}` }).state; }
  check("range: 6 plates → range_complete, score 6", st.outcome === "range_complete" && st.score === 6, `score=${st.score} hits=${st.hits} shots=${st.shotsFired}`);
  const splits = st.events.filter((e) => e.action === "shoot").map((e) => e.split);
  check("range: splits recorded", splits.slice(1).every((x) => typeof x === "number" && x > 0), JSON.stringify(splits));
}

console.log(`\n${pass}/${pass + fail} engine checks passed`);
process.exit(fail ? 1 : 0);
