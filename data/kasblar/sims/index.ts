import type { ProfessionId, ProfessionSim } from "../types";
import { SIM_PROFILAKTIKA } from "./profilaktika";
import { SIM_TERGOVCHI } from "./tergovchi";
import { SIM_SURISHTIRUVCHI } from "./surishtiruvchi";
import { SIM_EKSPERT } from "./ekspert";
import { SIM_KIBER } from "./kiber";
import { SIM_BOJXONA } from "./bojxona";
import { SIM_TAHLILCHI } from "./tahlilchi";
import { SIM_PROKUROR } from "./prokuror";
import { SIM_PSIXOLOG } from "./psixolog";
import { SIM_GVARDIYACHI } from "./gvardiyachi";
import { SIM_QUTQARUVCHI } from "./qutqaruvchi";

/** Registry of all authored profession simulators (Kasb simulyatorlari), in PROFESSION_IDS order. */
export const ALL_SIMS: ProfessionSim[] = [
  SIM_PROFILAKTIKA,
  SIM_TERGOVCHI,
  SIM_SURISHTIRUVCHI,
  SIM_EKSPERT,
  SIM_KIBER,
  SIM_BOJXONA,
  SIM_TAHLILCHI,
  SIM_PROKUROR,
  SIM_PSIXOLOG,
  SIM_GVARDIYACHI,
  SIM_QUTQARUVCHI,
];

export function getSim(id: string): ProfessionSim | undefined {
  return ALL_SIMS.find((s) => s.id === id);
}

export function simsByProfession(p: ProfessionId | string): ProfessionSim[] {
  return ALL_SIMS.filter((s) => s.professionId === p);
}
