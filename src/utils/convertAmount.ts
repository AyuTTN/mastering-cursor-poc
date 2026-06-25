export type ConversionTotals = {
  date: string
  rate: number
  total: number
}

export function convertAmount(amount: number, rate: number): number {
  return amount * rate
}

export function toConversionTotals(
  amount: number,
  rate: number,
  date: string,
): ConversionTotals {
  return {
    date,
    rate,
    total: convertAmount(amount, rate),
  }
}
