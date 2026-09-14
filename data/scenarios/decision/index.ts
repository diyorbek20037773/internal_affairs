import type { DecisionScenario } from "../types";
import { pichoqliShaxs } from "./pichoqli-shaxs";
import { oilaviyChaqiruv } from "./oilaviy-chaqiruv";
import { mastHaydovchi } from "./mast-haydovchi";
import { ikkiGuruhJanjal } from "./ikki-guruh-janjal";

export const DECISION_SCENARIOS: DecisionScenario[] = [
  mastHaydovchi,
  oilaviyChaqiruv,
  pichoqliShaxs,
  ikkiGuruhJanjal,
];
