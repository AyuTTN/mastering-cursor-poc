import { MAX_AMOUNT_INTEGER_DIGITS, clampAmountInputString } from '../utils/amountInput'

type AmountInputProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function AmountInput({
  id,
  label,
  value,
  onChange,
  disabled = false,
}: AmountInputProps) {
  const hintId = `${id}-hint`

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        min={0}
        step="0.01"
        inputMode="decimal"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(clampAmountInputString(e.target.value))}
        placeholder="0.00"
        aria-describedby={hintId}
      />
      <p id={hintId} className="field-hint">
        You can enter up to {MAX_AMOUNT_INTEGER_DIGITS} digits before the
        decimal point (fractional digits are not limited).
      </p>
    </div>
  )
}
