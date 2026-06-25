import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SwapButton } from './SwapButton'

describe('SwapButton', () => {
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<SwapButton onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: /swap currencies/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<SwapButton onClick={onClick} disabled />)
    await user.click(screen.getByRole('button', { name: /swap currencies/i }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
