import { describe, expect, it } from 'vitest'
import { regionCodeToFlagEmoji } from './regionCodeToFlagEmoji'

const REGIONAL_A = 0x1f1e6

describe('regionCodeToFlagEmoji', () => {
  it('returns empty for undefined or wrong length', () => {
    expect(regionCodeToFlagEmoji(undefined)).toBe('')
    expect(regionCodeToFlagEmoji('U')).toBe('')
    expect(regionCodeToFlagEmoji('')).toBe('')
  })

  it('returns empty for non A-Z', () => {
    expect(regionCodeToFlagEmoji('U1')).toBe('')
  })

  it('builds regional indicators for US', () => {
    const s = regionCodeToFlagEmoji('US')
    const cps = [...s].map((ch) => ch.codePointAt(0)!)
    expect(cps.length).toBe(2)
    expect(cps[0]).toBe(REGIONAL_A + 20)
    expect(cps[1]).toBe(REGIONAL_A + 18)
  })

  it('accepts lowercase and uppercases', () => {
    const a = regionCodeToFlagEmoji('eu')
    const b = regionCodeToFlagEmoji('EU')
    expect(a).toBe(b)
  })
})
