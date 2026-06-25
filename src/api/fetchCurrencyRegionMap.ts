/**
 * CLDR supplemental currency → territory data (Unicode), fetched at runtime.
 *
 * @see https://github.com/unicode-org/cldr-json
 */
import {
  type CldrCurrencyDataFile,
  parseCldrCurrencyToRegion,
} from '../utils/parseCldrCurrencyToRegion'

const CLDR_CURRENCY_DATA_JSON =
  'https://cdn.jsdelivr.net/gh/unicode-org/cldr-json@main/cldr-json/cldr-core/supplemental/currencyData.json'

export async function fetchCurrencyRegionMap(): Promise<Map<string, string>> {
  const res = await fetch(CLDR_CURRENCY_DATA_JSON)
  if (!res.ok) {
    throw new Error(`CLDR currency data request failed (${res.status})`)
  }
  const json = (await res.json()) as CldrCurrencyDataFile
  return parseCldrCurrencyToRegion(json)
}
