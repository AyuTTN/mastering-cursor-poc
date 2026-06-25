const fmt = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n)

type ResultProps = {
  amount: number
  from: string
  to: string
  total: number
  /** Frankfurter rate date (YYYY-MM-DD). */
  rateDate: string
}

export function Result({
  amount,
  from,
  to,
  total,
  rateDate,
}: ResultProps) {
  return (
    <div className="result-block">
      <p className="result">
        {fmt(amount)} {from} = {fmt(total)} {to}.
      </p>
      <p className="result-meta">
        ECB reference rates via Frankfurter · as of {rateDate}
      </p>
    </div>
  )
}
