import type { DialogScenario } from "../types";
import { case04Agressiv } from "./case04-agressiv";
import { oilaviyNizo } from "./oilaviy-nizo";
import { qoshniNizo } from "./qoshni-nizo";
import { mastShaxs } from "./mast-shaxs";
import { qorqqanOna } from "./qorqqan-ona";
import { migrantIshchi } from "./migrant-ishchi";
import { yoshlarGuruhi } from "./yoshlar-guruhi";

export const DIALOG_SCENARIOS: DialogScenario[] = [
  qoshniNizo,
  case04Agressiv,
  mastShaxs,
  qorqqanOna,
  yoshlarGuruhi,
  migrantIshchi,
  oilaviyNizo,
];
