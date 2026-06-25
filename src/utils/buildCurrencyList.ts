import type { Currency } from '../types/currency'
import { makeFlagFromCurrency } from './makeFlagFromCurrency'

export function buildCurrencyList(
  namesByCode: Record<string, string>,
  currencyToRegion: Map<string, string>,
): Currency[] {
  return Object.entries(namesByCode)
    .map(([code, name]) => ({
      code,
      name,
      flag: makeFlagFromCurrency(code, currencyToRegion),
    }))
    .sort((a, b) => a.code.localeCompare(b.code))
}
