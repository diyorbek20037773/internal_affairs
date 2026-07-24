import type { IncidentType } from "@/types/incident";
import type { LocalizedText, Sop } from "./types";
import { buildCrimeSop } from "./crime";
import { buildGenericSop } from "./generic";
import { LAWS } from "./laws";
import {
  domesticViolenceSop,
  missingPersonSop,
  foundBodySop,
  adminOffenseSop,
} from "./special";

export const INCIDENT_TITLES: Record<IncidentType, LocalizedText> = {
  theft: { uz: "O'g'irlik", ru: "Кража", en: "Theft" },
  fraud: { uz: "Firibgarlik", ru: "Мошенничество", en: "Fraud" },
  robbery: { uz: "Bosqinchilik", ru: "Разбой", en: "Robbery" },
  mugging: { uz: "Talonchilik", ru: "Грабёж", en: "Mugging" },
  hooliganism: { uz: "Bezorilik", ru: "Хулиганство", en: "Hooliganism" },
  domestic_violence: {
    uz: "Oilaviy zo'ravonlik",
    ru: "Семейное насилие",
    en: "Domestic violence",
  },
  traffic_accident: {
    uz: "Yo'l-transport hodisasi",
    ru: "ДТП",
    en: "Traffic accident",
  },
  missing_person: {
    uz: "Yo'qolgan shaxs",
    ru: "Пропавший человек",
    en: "Missing person",
  },
  found_body: { uz: "Topilgan jasad", ru: "Найденное тело", en: "Found body" },
  cybercrime: { uz: "Kiberjinoyat", ru: "Киберпреступление", en: "Cybercrime" },
  admin_offense: {
    uz: "Ma'muriy huquqbuzarlik",
    ru: "Административное правонарушение",
    en: "Administrative offense",
  },
  other: { uz: "Boshqa", ru: "Другое", en: "Other" },
};

/** Build the SOP for an incident type — dedicated where researched, else generic. */
export function getSop(type: IncidentType): Sop {
  switch (type) {
    case "theft":
      return buildCrimeSop(type, INCIDENT_TITLES.theft, LAWS.jkTheft);
    case "fraud":
      return buildCrimeSop(type, INCIDENT_TITLES.fraud, LAWS.jkFraud);
    case "robbery":
      return buildCrimeSop(type, INCIDENT_TITLES.robbery, LAWS.jkRobbery);
    case "mugging":
      return buildCrimeSop(type, INCIDENT_TITLES.mugging, LAWS.jkMugging);
    case "hooliganism":
      return buildCrimeSop(type, INCIDENT_TITLES.hooliganism, LAWS.jkHooliganism);
    case "cybercrime":
      return buildCrimeSop(type, INCIDENT_TITLES.cybercrime, LAWS.jkCyber);
    case "domestic_violence":
      return domesticViolenceSop;
    case "missing_person":
      return missingPersonSop;
    case "found_body":
      return foundBodySop;
    case "admin_offense":
      return adminOffenseSop;
    default:
      return buildGenericSop(type, INCIDENT_TITLES[type]);
  }
}
