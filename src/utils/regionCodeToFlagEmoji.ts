/** Unicode Regional Indicator Symbol Letter A (U+1F1E6). */
const REGIONAL_INDICATOR_BASE = 0x1f1e6

/**
 * Builds a regional-indicator flag emoji from an ISO 3166-1 alpha-2 code.
 * Returns an empty string if the code cannot be represented (non A–Z pair).
 */
export function regionCodeToFlagEmoji(region: string | undefined): string {
  if (!region || region.length !== 2) return ''
  const a = region.toUpperCase()
  if (!/^[A-Z]{2}$/.test(a)) return ''

  const cp1 = REGIONAL_INDICATOR_BASE + (a.charCodeAt(0) - 65)
  const cp2 = REGIONAL_INDICATOR_BASE + (a.charCodeAt(1) - 65)
  const max = REGIONAL_INDICATOR_BASE + 25
  if (cp1 < REGIONAL_INDICATOR_BASE || cp1 > max) return ''
  if (cp2 < REGIONAL_INDICATOR_BASE || cp2 > max) return ''

  return String.fromCodePoint(cp1, cp2)
}
