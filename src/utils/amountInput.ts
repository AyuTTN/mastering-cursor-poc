/** Maximum number of digits allowed in the integer part of the amount. */
export const MAX_AMOUNT_INTEGER_DIGITS = 12

/**
 * Keeps only digits and at most one decimal point; caps the integer part at
 * {@link MAX_AMOUNT_INTEGER_DIGITS} digits (fractional part is unchanged).
 */
export function clampAmountInputString(raw: string): string {
  if (raw === '') return ''

  let out = ''
  let dotSeen = false
  let intDigitCount = 0

  for (const c of raw) {
    if (c === '.' && !dotSeen) {
      dotSeen = true
      out += '.'
      continue
    }
    if (c >= '0' && c <= '9') {
      if (!dotSeen) {
        if (intDigitCount >= MAX_AMOUNT_INTEGER_DIGITS) continue
        intDigitCount++
      }
      out += c
    }
  }

  return out
}
