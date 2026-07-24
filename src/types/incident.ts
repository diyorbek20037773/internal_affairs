export const INCIDENT_TYPES = [
  "theft",
  "fraud",
  "robbery",
  "mugging",
  "hooliganism",
  "domestic_violence",
  "traffic_accident",
  "missing_person",
  "found_body",
  "cybercrime",
  "admin_offense",
  "other",
] as const;

export type IncidentType = (typeof INCIDENT_TYPES)[number];

/** lucide-react icon name per incident type (resolved in the UI). */
export const INCIDENT_ICON: Record<IncidentType, string> = {
  theft: "PackageOpen",
  fraud: "CreditCard",
  robbery: "Swords",
  mugging: "UserMinus",
  hooliganism: "Megaphone",
  domestic_violence: "HeartCrack",
  traffic_accident: "Car",
  missing_person: "UserSearch",
  found_body: "Skull",
  cybercrime: "Bug",
  admin_offense: "ScrollText",
  other: "CircleHelp",
};
