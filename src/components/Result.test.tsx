import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Result } from './Result'

describe('Result', () => {
  it('renders conversion line and meta', () => {
    render(
      <Result
        amount={100}
        from="USD"
        to="EUR"
        total={88}
        rateDate="2026-06-01"
      />,
    )
    expect(screen.getByText(/100.*USD.*88.*EUR/)).toBeInTheDocument()
    expect(screen.getByText(/2026-06-01/)).toBeInTheDocument()
    expect(screen.getByText(/Frankfurter/)).toBeInTheDocument()
  })
})
