import type { CompetencyLevel, LocalizedText } from "../types";

/** Compact trilingual literal. */
export const t = (uz: string, ru: string, en: string): LocalizedText => ({ uz, ru, en });

const LEVEL_TITLES: LocalizedText[] = [
  t("Boshlang'ich", "Начальный", "Beginner"),
  t("Asosiy", "Базовый", "Core"),
  t("Ilg'or", "Продвинутый", "Advanced"),
  t("Ekspert", "Экспертный", "Expert"),
];

/** Build the 4 standard levels from profession-specific descriptions. */
export function levels(desc: [LocalizedText, LocalizedText, LocalizedText, LocalizedText]): CompetencyLevel[] {
  return desc.map((d, i) => ({
    level: (i + 1) as 1 | 2 | 3 | 4,
    title: LEVEL_TITLES[i],
    description: d,
  }));
}
