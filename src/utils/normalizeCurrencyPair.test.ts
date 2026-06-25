import { describe, expect, it } from 'vitest'
import type { Currency } from '../types/currency'
import { normalizeCurrencyPair } from './normalizeCurrencyPair'

const usd: Currency = { code: 'USD', name: 'US Dollar', flag: '' }
const eur: Currency = { code: 'EUR', name: 'Euro', flag: '' }
const gbp: Currency = { code: 'GBP', name: 'Pound', flag: '' }

describe('normalizeCurrencyPair', () => {
  it('returns previous pair when list empty', () => {
    expect(normalizeCurrencyPair([], 'USD', 'EUR')).toEqual(['USD', 'EUR'])
  })

  it('keeps valid selections', () => {
    expect(normalizeCurrencyPair([usd, eur], 'USD', 'EUR')).toEqual([
      'USD',
      'EUR',
    ])
  })

  it('replaces unknown from with first list code', () => {
    expect(normalizeCurrencyPair([usd, eur], 'ZZZ', 'EUR')).toEqual([
      'USD',
      'EUR',
    ])
  })

  it('fixes from === to when at least two currencies exist', () => {
    expect(normalizeCurrencyPair([usd, eur, gbp], 'USD', 'USD')).toEqual([
      'USD',
      'EUR',
    ])
  })
})
