import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Messages = the main file + per-module fragments (`messages/<module>/<locale>.json`,
 * each holding one top-level namespace). Fragments keep module work out of the
 * big shared files.
 */
const FRAGMENTS = ["kasb", "kasbsim", "tutor"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale;
  }

  const main = (await import(`../../messages/${locale}.json`)).default;
  const parts = await Promise.all(
    FRAGMENTS.map(async (m) => (await import(`../../messages/${m}/${locale}.json`)).default as Record<string, unknown>)
  );

  return {
    locale,
    messages: Object.assign({}, main, ...parts),
  };
});
