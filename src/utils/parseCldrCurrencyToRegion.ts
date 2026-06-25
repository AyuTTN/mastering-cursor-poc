type CldrRegionSeries = Array<Record<string, { _from?: string; _to?: string }>>

export type CldrCurrencyDataFile = {
  supplemental?: {
    currencyData?: {
      region?: Record<string, CldrRegionSeries | undefined>
    }
  }
}

function pickRegionForCurrency(
  currency: string,
  regions: string[],
): string | null {
  if (regions.length === 0) return null
  const hint = currency.slice(0, 2)
  if (regions.includes(hint)) return hint
  const sorted = [...regions].sort()
  return sorted[0] ?? null
}

/**
 * Returns ISO 4217 currency code → ISO 3166-1 alpha-2 region code
 * (one territory per currency, derived from CLDR).
 */
export function parseCldrCurrencyToRegion(
  json: CldrCurrencyDataFile,
): Map<string, string> {
  const regionBlock = json.supplemental?.currencyData?.region
  const currencyToRegions = new Map<string, string[]>()

  if (!regionBlock || typeof regionBlock !== 'object') {
    return new Map()
  }

  for (const [regionCode, series] of Object.entries(regionBlock)) {
    if (typeof regionCode !== 'string' || regionCode.length !== 2) continue
    if (!/^[A-Z]{2}$/.test(regionCode)) continue
    if (!Array.isArray(series) || series.length === 0) continue

    const head = series[0]
    if (!head || typeof head !== 'object') continue

    const currencyCode = Object.keys(head).find((k) => /^[A-Z]{3}$/.test(k))
    if (!currencyCode) continue

    const list = currencyToRegions.get(currencyCode) ?? []
    list.push(regionCode)
    currencyToRegions.set(currencyCode, list)
  }

  const result = new Map<string, string>()
  for (const [currencyCode, regions] of currencyToRegions) {
    const chosen = pickRegionForCurrency(currencyCode, regions)
    if (chosen) result.set(currencyCode, chosen)
  }

  return result
}
