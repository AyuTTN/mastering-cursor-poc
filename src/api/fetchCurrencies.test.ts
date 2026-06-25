import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FRANKFURTER_API_V1 } from './frankfurterBase'
import { fetchCurrencies } from './fetchCurrencies'

describe('fetchCurrencies', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ USD: 'Dollar' }), { status: 200 }),
        ),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests Frankfurter currencies endpoint', async () => {
    const data = await fetchCurrencies()
    expect(data).toEqual({ USD: 'Dollar' })
    expect(fetch).toHaveBeenCalledWith(`${FRANKFURTER_API_V1}/currencies`)
  })

  it('throws when response not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('', { status: 500 }))),
    )
    await expect(fetchCurrencies()).rejects.toThrow(
      'Could not load currencies (500)',
    )
  })
})
