import { afterEach, describe, expect, it, vi } from 'vitest'
import { FRANKFURTER_API_V1 } from './frankfurterBase'
import { getRates } from './getRates'

describe('getRates', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('returns rate 1 without fetch when from equals to', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-15T12:00:00Z'))
    await expect(getRates('USD', 'USD')).resolves.toEqual({
      date: '2026-03-15',
      rate: 1,
    })
  })

  it('parses successful Frankfurter latest response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              amount: 1,
              base: 'USD',
              date: '2026-01-01',
              rates: { EUR: 0.88 },
            }),
            { status: 200 },
          ),
        ),
      ),
    )
    const out = await getRates('USD', 'EUR')
    expect(out).toEqual({ date: '2026-01-01', rate: 0.88 })
    const url = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(url).toContain(`${FRANKFURTER_API_V1}/latest`)
    expect(url).toContain('from=USD')
    expect(url).toContain('to=EUR')
  })

  it('throws API message when present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ message: 'bad pair' }), {
            status: 400,
          }),
        ),
      ),
    )
    await expect(getRates('USD', 'EUR')).rejects.toThrow('bad pair')
  })

  it('throws generic message when body has no message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('', { status: 502 }))),
    )
    await expect(getRates('USD', 'EUR')).rejects.toThrow(
      'Request failed (502)',
    )
  })

  it('throws when rate missing in JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              amount: 1,
              base: 'USD',
              date: '2026-01-01',
              rates: {},
            }),
            { status: 200 },
          ),
        ),
      ),
    )
    await expect(getRates('USD', 'EUR')).rejects.toThrow(
      'Missing or invalid rate in API response',
    )
  })
})
