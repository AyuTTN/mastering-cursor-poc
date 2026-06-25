import { describe, expect, it } from 'vitest'
import { MAX_AMOUNT_INTEGER_DIGITS, clampAmountInputString } from './amountInput'

describe('clampAmountInputString', () => {
  it('returns empty for empty input', () => {
    expect(clampAmountInputString('')).toBe('')
  })

  it('allows digits and one decimal point', () => {
    expect(clampAmountInputString('12.34')).toBe('12.34')
  })

  it('strips letters and extra dots', () => {
    expect(clampAmountInputString('1a2.3.4')).toBe('12.34')
  })

  it('caps integer part at MAX_AMOUNT_INTEGER_DIGITS', () => {
    const int = '1'.repeat(MAX_AMOUNT_INTEGER_DIGITS + 3)
    const out = clampAmountInputString(int)
    expect(out.length).toBe(MAX_AMOUNT_INTEGER_DIGITS)
  })

  it('does not cap fractional digits', () => {
    const int = '1'.repeat(MAX_AMOUNT_INTEGER_DIGITS)
    expect(clampAmountInputString(`${int}.123456789`)).toBe(`${int}.123456789`)
  })

  it('preserves trailing dot while typing', () => {
    expect(clampAmountInputString('5.')).toBe('5.')
  })
})
