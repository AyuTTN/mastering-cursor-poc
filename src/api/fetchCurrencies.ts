import { FRANKFURTER_API_V1 } from './frankfurterBase'

export async function fetchCurrencies(): Promise<Record<string, string>> {
  const res = await fetch(`${FRANKFURTER_API_V1}/currencies`)
  if (!res.ok) {
    throw new Error(`Could not load currencies (${res.status})`)
  }
  return res.json() as Promise<Record<string, string>>
}
