import { regionCodeToFlagEmoji } from './regionCodeToFlagEmoji'

/**
 * Returns a flag emoji for an ISO 4217 currency code using CLDR-derived
 * currency → territory mapping, or an empty string when none applies.
 */
export function makeFlagFromCurrency(
  currencyCode: string,
  currencyToRegion: Map<string, string>,
): string {
  const region = currencyToRegion.get(currencyCode)
  return regionCodeToFlagEmoji(region)
}
