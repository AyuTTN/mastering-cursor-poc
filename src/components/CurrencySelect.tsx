import type { Currency } from '../types/currency'

type CurrencySelectProps = {
  id: string
  label: string
  value: string
  onChange: (code: string) => void
  currencies: Currency[]
  disabled?: boolean
  /** If set, that currency option is disabled (e.g. other dropdown’s selection). */
  disableOptionCode?: string
}

export function CurrencySelect({
  id,
  label,
  value,
  onChange,
  currencies,
  disabled = false,
  disableOptionCode,
}: CurrencySelectProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {currencies.map((c) => (
          <option
            key={c.code}
            value={c.code}
            disabled={c.code === disableOptionCode}
            title={c.name}
          >
            {[c.flag, c.code].filter(Boolean).join(' ')}
          </option>
        ))}
      </select>
    </div>
  )
}
