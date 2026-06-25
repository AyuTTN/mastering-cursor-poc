import { describe, expect, it } from 'vitest'
import { buildCurrencyList } from './buildCurrencyList'

describe('buildCurrencyList', () => {
  it('sorts by currency code and attaches flags from region map', () => {
    const names = { EUR: 'Euro', USD: 'US Dollar' }
    const regions = new Map([
      ['USD', 'US'],
      ['EUR', 'EU'],
    ])
    const list = buildCurrencyList(names, regions)
    expect(list.map((c) => c.code)).toEqual(['EUR', 'USD'])
    expect(list[0]!.name).toBe('Euro')
    expect(list[0]!.flag.length).toBeGreaterThan(0)
  })
})
