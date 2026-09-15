// Downloads runtime 3D assets that are NOT committed to the repo (size and/or
// licence: RPM animations may be used with RPM avatars but not redistributed).
// Runs as `prebuild`, so Railway fetches them on every deploy. Idempotent.
import { mkdirSync, existsSync, statSync, readFileSync, unlinkSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ROOT = new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const RPM = "https://raw.githubusercontent.com/readyplayerme/animation-library/master";
const PH = "https://dl.polyhaven.org/file/ph-assets";

const files = {
  // Ready Player Me — avatars (T-pose bodies) + animation clips. Licence: use with RPM avatars, no redistribution.
  "models/rpm_m_tpose.glb": `${RPM}/masculine/glb/Masculine_TPose.glb`,
  "models/rpm_f_tpose.glb": `${RPM}/feminine/glb/Feminine_TPose.glb`,
  "models/anim/M_idle.glb": `${RPM}/masculine/glb/idle/M_Standing_Idle_001.glb`,
  "models/anim/M_idle_var.glb": `${RPM}/masculine/glb/idle/M_Standing_Idle_Variations_003.glb`,
  "models/anim/M_walk.glb": `${RPM}/masculine/glb/locomotion/M_Walk_001.glb`,
  "models/anim/M_run.glb": `${RPM}/masculine/glb/locomotion/M_Run_001.glb`,
  "models/anim/M_crouch.glb": `${RPM}/masculine/glb/locomotion/M_Crouch_Walk_003.glb`,
  "models/anim/M_talk1.glb": `${RPM}/masculine/glb/expression/M_Talking_Variations_001.glb`,
  "models/anim/M_expr1.glb": `${RPM}/masculine/glb/expression/M_Standing_Expressions_001.glb`,
  "models/anim/M_expr5.glb": `${RPM}/masculine/glb/expression/M_Standing_Expressions_005.glb`,
  "models/anim/F_idle.glb": `${RPM}/feminine/glb/idle/F_Standing_Idle_001.glb`,
  "models/anim/F_walk.glb": `${RPM}/feminine/glb/locomotion/F_Walk_002.glb`,
  "models/anim/F_run.glb": `${RPM}/feminine/glb/locomotion/F_Run_001.glb`,
  "models/anim/F_talk1.glb": `${RPM}/feminine/glb/expression/F_Talking_Variations_001.glb`,
  // Poly Haven — CC0 photographic HDRIs (real courtyards / streets / squares) and PBR textures.
  "hdri/courtyard_1k.hdr": `${PH}/HDRIs/hdr/1k/courtyard_1k.hdr`,
  "hdri/overcast_industrial_courtyard_1k.hdr": `${PH}/HDRIs/hdr/1k/overcast_industrial_courtyard_1k.hdr`,
  "hdri/urban_street_04_1k.hdr": `${PH}/HDRIs/hdr/1k/urban_street_04_1k.hdr`,
  "hdri/wide_street_01_1k.hdr": `${PH}/HDRIs/hdr/1k/wide_street_01_1k.hdr`,
  "hdri/empty_warehouse_01_1k.hdr": `${PH}/HDRIs/hdr/1k/empty_warehouse_01_1k.hdr`,
  "hdri/palermo_square_1k.hdr": `${PH}/HDRIs/hdr/1k/palermo_square_1k.hdr`,
  "hdri/abandoned_parking_1k.hdr": `${PH}/HDRIs/hdr/1k/abandoned_parking_1k.hdr`,
  "hdri/cinema_lobby_1k.hdr": `${PH}/HDRIs/hdr/1k/cinema_lobby_1k.hdr`,
  "hdri/large_corridor_1k.hdr": `${PH}/HDRIs/hdr/1k/large_corridor_1k.hdr`,
  "hdri/modern_evening_street_1k.hdr": `${PH}/HDRIs/hdr/1k/modern_evening_street_1k.hdr`,
};
// 2k versions for the range PC (HQ); 1k stays for tablets (LQ).
for (const n of ["overcast_industrial_courtyard", "modern_evening_street", "palermo_square", "abandoned_parking", "cinema_lobby", "large_corridor"]) {
  files[`hdri/${n}_2k.hdr`] = `${PH}/HDRIs/hdr/2k/${n}_2k.hdr`;
}
for (const t of ["asphalt_02", "concrete_floor_worn_001", "aerial_grass_rock", "rough_plaster_brick", "floor_tiles_06"]) {
  for (const m of ["diff", "nor_gl", "rough"]) files[`tex/${t}_${m}_1k.jpg`] = `${PH}/Textures/jpg/1k/${t}/${t}_${m}_1k.jpg`;
}

/** A .glb is intact when its header length equals the file size. */
function glbIntact(path) {
  const b = readFileSync(path);
  if (b.length < 12 || b.toString("latin1", 0, 4) !== "glTF") return false;
  return b.readUInt32LE(8) === b.length;
}
function present(dest) {
  if (!existsSync(dest) || statSync(dest).size < 1000) return false;
  if (dest.endsWith(".glb") && !glbIntact(dest)) { unlinkSync(dest); return false; }
  return true;
}

let ok = 0, skipped = 0, failed = 0;
for (const [rel, url] of Object.entries(files)) {
  const dest = join(ROOT, rel);
  if (present(dest)) { skipped++; continue; }
  mkdirSync(dirname(dest), { recursive: true });
  let done = false;
  for (let attempt = 1; attempt <= 3 && !done; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(dest, buf);
      if (dest.endsWith(".glb") && !glbIntact(dest)) throw new Error(`truncated (${buf.length} bytes)`);
      ok++;
      done = true;
      console.log("fetched", rel, `${(buf.length / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.warn(`attempt ${attempt} failed`, rel, String(e));
      if (attempt === 3) failed++;
    }
  }
}
console.log(`assets: ${ok} fetched, ${skipped} present, ${failed} failed`);
// Never fail the build: the scene falls back to procedural figures / flat sky.
