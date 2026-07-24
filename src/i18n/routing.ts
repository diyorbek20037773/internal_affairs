import { defineRouting } from "next-intl/routing";

export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});
