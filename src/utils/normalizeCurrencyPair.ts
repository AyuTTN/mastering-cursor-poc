import type { Currency } from '../types/currency'

/** Ensure both codes exist in `list` and are not identical when possible. */
export function normalizeCurrencyPair(
  list: Currency[],
  prevFrom: string,
  prevTo: string,
): [string, string] {
  if (list.length === 0) return [prevFrom, prevTo]

  const codes = new Set(list.map((c) => c.code))
  const from = codes.has(prevFrom) ? prevFrom : list[0]!.code
  let to = codes.has(prevTo)
    ? prevTo
    : (list.find((c) => c.code !== from)?.code ?? from)

  if (from === to && list.length > 1) {
    to = list.find((c) => c.code !== from)!.code
  }

  return [from, to]
}
