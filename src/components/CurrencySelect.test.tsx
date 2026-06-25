import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Currency } from '../types/currency'
import { CurrencySelect } from './CurrencySelect'

const list: Currency[] = [
  { code: 'USD', name: 'US Dollar', flag: '' },
  { code: 'EUR', name: 'Euro', flag: '' },
]

describe('CurrencySelect', () => {
  it('disables option matching disableOptionCode', () => {
    render(
      <CurrencySelect
        id="from"
        label="From"
        value="USD"
        onChange={() => {}}
        currencies={list}
        disableOptionCode="EUR"
      />,
    )
    const select = screen.getByLabelText('From')
    const eur = within(select).getByRole('option', { name: /EUR/i })
    expect(eur).toBeDisabled()
    const usd = within(select).getByRole('option', { name: /USD/i })
    expect(usd).not.toBeDisabled()
  })
})
