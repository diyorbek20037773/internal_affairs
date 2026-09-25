import type { ProfessionId, ProfessionStandard } from "../types";
import { profilaktika } from "./profilaktika";
import { tergovchi } from "./tergovchi";
import { surishtiruvchi } from "./surishtiruvchi";
import { ekspert } from "./ekspert";
import { kiber } from "./kiber";
import { bojxona } from "./bojxona";
import { tahlilchi } from "./tahlilchi";
import { prokuror } from "./prokuror";
import { psixolog } from "./psixolog";
import { gvardiyachi } from "./gvardiyachi";
import { qutqaruvchi } from "./qutqaruvchi";

/** All profession standards, in PROFESSION_IDS order. */
export const PROFESSIONS: ProfessionStandard[] = [
  profilaktika,
  tergovchi,
  surishtiruvchi,
  ekspert,
  kiber,
  bojxona,
  tahlilchi,
  prokuror,
  psixolog,
  gvardiyachi,
  qutqaruvchi,
];

export function getProfession(id: string): ProfessionStandard | undefined {
  return PROFESSIONS.find((p) => p.id === id);
}

export function isProfessionId(id: string): id is ProfessionId {
  return PROFESSIONS.some((p) => p.id === id);
}
