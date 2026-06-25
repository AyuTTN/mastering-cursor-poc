import { FRANKFURTER_API_V1 } from './frankfurterBase'

export type FrankfurterLatest = {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

export type RatesResult = { date: string; rate: number }

/**
 * Latest exchange rate from Frankfurter (`from` → `to`).
 */
export async function getRates(from: string, to: string): Promise<RatesResult> {
  if (from === to) {
    return {
      date: new Date().toISOString().slice(0, 10),
      rate: 1,
    }
  }

  const url = new URL(`${FRANKFURTER_API_V1}/latest`)
  url.searchParams.set('from', from)
  url.searchParams.set('to', to)

  const res = await fetch(url.toString())
  const body: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      body &&
      typeof body === 'object' &&
      'message' in body &&
      typeof (body as { message: unknown }).message === 'string'
        ? (body as { message: string }).message
        : `Request failed (${res.status})`
    throw new Error(message)
  }

  const data = body as FrankfurterLatest
  const rate = data.rates[to]
  if (typeof rate !== 'number' || !Number.isFinite(rate)) {
    throw new Error('Missing or invalid rate in API response')
  }

  return { date: data.date, rate }
}
