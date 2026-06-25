import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCurrencyRegionMap } from './fetchCurrencyRegionMap'
import { minimalCldrFixture } from '../test/fixtures/minimalCldr'

describe('fetchCurrencyRegionMap', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(minimalCldrFixture), { status: 200 }),
        ),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches CLDR JSON and returns parsed map', async () => {
    const map = await fetchCurrencyRegionMap()
    expect(map.get('USD')).toBe('US')
    expect((fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]).toContain(
      'currencyData.json',
    )
  })

  it('throws when response not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('', { status: 503 }))),
    )
    await expect(fetchCurrencyRegionMap()).rejects.toThrow(
      'CLDR currency data request failed (503)',
    )
  })
})
