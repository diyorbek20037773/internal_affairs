import type { AgencyId, TutorTopic } from "@/data/kasblar/types";
import { IIV_TOPICS } from "./iiv";
import { GVARDIYA_TOPICS } from "./gvardiya";
import { BOJXONA_TOPICS } from "./bojxona";
import { PROKURATURA_TOPICS } from "./prokuratura";
import { FVV_TOPICS } from "./fvv";

/** All AI-tutor lesson cards (authored data, never generated at runtime). */
export const TUTOR_TOPICS: TutorTopic[] = [
  ...IIV_TOPICS,
  ...GVARDIYA_TOPICS,
  ...BOJXONA_TOPICS,
  ...PROKURATURA_TOPICS,
  ...FVV_TOPICS,
];

export function topicsByAgency(agency: AgencyId): TutorTopic[] {
  return TUTOR_TOPICS.filter((t) => t.agency === agency);
}

export function getTopic(id: string): TutorTopic | undefined {
  return TUTOR_TOPICS.find((t) => t.id === id);
}
