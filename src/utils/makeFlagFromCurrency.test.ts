import { describe, expect, it } from 'vitest'
import { makeFlagFromCurrency } from './makeFlagFromCurrency'

describe('makeFlagFromCurrency', () => {
  it('returns flag when region exists for currency', () => {
    const map = new Map([['USD', 'US']])
    const flag = makeFlagFromCurrency('USD', map)
    expect(flag.length).toBeGreaterThan(0)
  })

  it('returns empty string when currency missing from map', () => {
    expect(makeFlagFromCurrency('XXX', new Map())).toBe('')
  })
})
