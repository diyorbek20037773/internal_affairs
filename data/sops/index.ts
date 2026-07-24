import type { IncidentType } from "@/types/incident";
import type { LocalizedText, Sop } from "./types";
import { theftSop } from "./theft";
import { buildGenericSop } from "./generic";

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

const DEDICATED: Partial<Record<IncidentType, Sop>> = {
  theft: theftSop,
};

export function getSop(type: IncidentType): Sop {
  return DEDICATED[type] ?? buildGenericSop(type, INCIDENT_TITLES[type]);
}
