import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { AmountInput } from './AmountInput'
import { MAX_AMOUNT_INTEGER_DIGITS } from '../utils/amountInput'

function Harness() {
  const [value, setValue] = useState('')
  return <AmountInput id="amt" label="Amount" value={value} onChange={setValue} />
}

describe('AmountInput', () => {
  it('controlled input accepts decimal amount', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const input = screen.getByLabelText('Amount')
    await user.type(input, '99.5')
    expect(input).toHaveValue(99.5)
    expect(screen.getByDisplayValue('99.5')).toBeInTheDocument()
  })

  it('clamps integer digits via onChange', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const input = screen.getByLabelText('Amount')
    await user.type(input, '1'.repeat(15))
    expect(input).toHaveValue(Number('1'.repeat(12)))
  })

  it('shows hint about digit limit', () => {
    render(
      <AmountInput
        id="amt"
        label="Amount"
        value="1"
        onChange={() => {}}
      />,
    )
    expect(
      screen.getByText(new RegExp(`${MAX_AMOUNT_INTEGER_DIGITS}`, 'i')),
    ).toBeInTheDocument()
  })
})
