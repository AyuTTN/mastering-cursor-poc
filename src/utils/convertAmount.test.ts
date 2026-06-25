import { describe, expect, it } from 'vitest'
import { convertAmount, toConversionTotals } from './convertAmount'

describe('convertAmount', () => {
  it('multiplies amount by rate', () => {
    expect(convertAmount(100, 1.25)).toBe(125)
  })
})

describe('toConversionTotals', () => {
  it('returns date, rate, and total', () => {
    expect(toConversionTotals(10, 2, '2026-01-01')).toEqual({
      date: '2026-01-01',
      rate: 2,
      total: 20,
    })
  })
})
