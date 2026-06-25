import { useCallback, useEffect, useRef, useState } from 'react'
import type { Currency } from './types/currency'
import { fetchCurrencies } from './api/fetchCurrencies'
import { fetchCurrencyRegionMap } from './api/fetchCurrencyRegionMap'
import { getRates } from './api/getRates'
import { AmountInput } from './components/AmountInput'
import { CurrencySelect } from './components/CurrencySelect'
import { Result } from './components/Result'
import { SwapButton } from './components/SwapButton'
import { buildCurrencyList } from './utils/buildCurrencyList'
import { toConversionTotals } from './utils/convertAmount'
import { normalizeCurrencyPair } from './utils/normalizeCurrencyPair'

function parseAmount(raw: string): number | null {
  const n = Number.parseFloat(raw)
  if (!Number.isFinite(n) || n <= 0) return null
  return n
}

export default function App() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [currenciesError, setCurrenciesError] = useState<string | null>(null)
  const [currenciesLoading, setCurrenciesLoading] = useState(true)

  const [result, setResult] = useState<{
    amount: number
    total: number
    rateDate: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [convertLoading, setConvertLoading] = useState(false)

  const selectionRef = useRef({ from, to })
  useEffect(() => {
    selectionRef.current = { from, to }
  }, [from, to])

  const parsed = parseAmount(amount)
  const convertDisabled =
    parsed === null ||
    currenciesLoading ||
    convertLoading ||
    currencies.length === 0

  const loadCurrencies = useCallback(async () => {
    setCurrenciesLoading(true)
    setCurrenciesError(null)
    setResult(null)
    try {
      const [namesByCode, currencyToRegion] = await Promise.all([
        fetchCurrencies(),
        fetchCurrencyRegionMap().catch(() => new Map<string, string>()),
      ])
      const list = buildCurrencyList(namesByCode, currencyToRegion)
      const [nextFrom, nextTo] = normalizeCurrencyPair(
        list,
        selectionRef.current.from,
        selectionRef.current.to,
      )
      setCurrencies(list)
      setFrom(nextFrom)
      setTo(nextTo)
    } catch (e) {
      setCurrenciesError(
        e instanceof Error ? e.message : 'Failed to load currency list.',
      )
      setCurrencies([])
    } finally {
      setCurrenciesLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => loadCurrencies())
  }, [loadCurrencies])

  function handleAmountChange(value: string) {
    setAmount(value)
    setResult(null)
    setError(null)
  }

  function handleFromChange(code: string) {
    setFrom(code)
    setResult(null)
    setError(null)
  }

  function handleToChange(code: string) {
    setTo(code)
    setResult(null)
    setError(null)
  }

  async function handleConvert() {
    const n = parseAmount(amount)
    if (n === null) {
      setError('Enter a valid amount greater than zero.')
      setResult(null)
      return
    }
    setError(null)
    setConvertLoading(true)
    try {
      const { date, rate } = await getRates(from, to)
      const { total, date: rateDate } = toConversionTotals(n, rate, date)
      setResult({ amount: n, total, rateDate })
    } catch (e) {
      setResult(null)
      setError(
        e instanceof Error ? e.message : 'Could not fetch exchange rate.',
      )
    } finally {
      setConvertLoading(false)
    }
  }

  function handleSwap() {
    setFrom(to)
    setTo(from)
    setResult(null)
    setError(null)
  }

  return (
    <div className="app-shell">
      <main className="card">
        <h1 className="title">Currency Converter</h1>
        <p className="subtitle">
          Live rates from{' '}
          <a
            href="https://www.frankfurter.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Frankfurter
          </a>{' '}
          (ECB reference data)
          {currenciesLoading ? ' · Loading currency list…' : null}
        </p>

        {currenciesError ? (
          <div className="banner error" role="alert">
            <p>{currenciesError}</p>
            <button
              type="button"
              className="secondary"
              onClick={() => void loadCurrencies()}
            >
              Retry
            </button>
          </div>
        ) : null}

        <AmountInput
          id="amount"
          label="Amount"
          value={amount}
          onChange={handleAmountChange}
          disabled={currenciesLoading}
        />

        <div className="currency-row">
          <CurrencySelect
            id="from"
            label="From"
            value={from}
            onChange={handleFromChange}
            currencies={currencies}
            disabled={currenciesLoading || currencies.length === 0}
            disableOptionCode={to}
          />
          <SwapButton
            onClick={handleSwap}
            disabled={currenciesLoading || currencies.length === 0}
          />
          <CurrencySelect
            id="to"
            label="To"
            value={to}
            onChange={handleToChange}
            currencies={currencies}
            disabled={currenciesLoading || currencies.length === 0}
            disableOptionCode={from}
          />
        </div>

        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          className="primary"
          onClick={() => void handleConvert()}
          disabled={convertDisabled}
          aria-busy={convertLoading}
        >
          {convertLoading ? 'Loading…' : 'Get Exchange Rate'}
        </button>

        <div className="result-area" aria-live="polite">
          {result ? (
            <Result
              amount={result.amount}
              from={from}
              to={to}
              total={result.total}
              rateDate={result.rateDate}
            />
          ) : convertLoading ? (
            <p className="result-placeholder">Fetching rate…</p>
          ) : !currenciesLoading && currencies.length > 0 ? (
            <p className="result-placeholder">
              Choose amount and currencies, then click &ldquo;Get Exchange
              Rate&rdquo; to see a conversion.
            </p>
          ) : null}
        </div>
      </main>
    </div>
  )
}
