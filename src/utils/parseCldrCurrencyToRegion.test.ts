import { describe, expect, it } from 'vitest'
import { parseCldrCurrencyToRegion } from './parseCldrCurrencyToRegion'
import { minimalCldrFixture } from '../test/fixtures/minimalCldr'

describe('parseCldrCurrencyToRegion', () => {
  it('returns empty map when region block missing', () => {
    expect(parseCldrCurrencyToRegion({})).toEqual(new Map())
  })

  it('maps currencies from minimal fixture', () => {
    const m = parseCldrCurrencyToRegion(minimalCldrFixture)
    expect(m.get('USD')).toBe('US')
    expect(m.get('EUR')).toBe('EU')
    expect(m.get('GBP')).toBe('GB')
  })

  it('picks hint region when multiple territories share a currency', () => {
    const json = {
      supplemental: {
        currencyData: {
          region: {
            ZZ: [{ XAB: { _from: '2000-01-01' } }],
            ZA: [{ XAB: { _from: '2000-01-01' } }],
          },
        },
      },
    }
    const m = parseCldrCurrencyToRegion(json)
    expect(m.get('XAB')).toBe('ZA')
  })
})
