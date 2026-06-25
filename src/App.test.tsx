import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { minimalCldrFixture } from './test/fixtures/minimalCldr'

const currenciesJson = {
  USD: 'US Dollar',
  EUR: 'Euro',
}

function setupFetchSuccess(
  latest: Record<string, unknown> = {
    amount: 1,
    base: 'USD',
    date: '2026-06-01',
    rates: { EUR: 2 },
  },
) {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo | URL) => {
      const u =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.href
            : (input as Request).url
      if (u.includes('/currencies')) {
        return Promise.resolve(
          new Response(JSON.stringify(currenciesJson), { status: 200 }),
        )
      }
      if (u.includes('currencyData.json')) {
        return Promise.resolve(
          new Response(JSON.stringify(minimalCldrFixture), { status: 200 }),
        )
      }
      if (u.includes('/latest')) {
        return Promise.resolve(
          new Response(JSON.stringify(latest), { status: 200 }),
        )
      }
      return Promise.resolve(new Response('nope', { status: 404 }))
    }),
  )
}

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows hint after load and conversion after Get Exchange Rate', async () => {
    setupFetchSuccess()
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /from/i })).not.toBeDisabled()
    })

    expect(
      screen.getByText(/Choose amount and currencies/i),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /get exchange rate/i }))

    await waitFor(() => {
      const line = document.querySelector('p.result')
      expect(line).toBeTruthy()
      expect(line!.textContent).toMatch(/100/)
      expect(line!.textContent).toMatch(/USD/)
      expect(line!.textContent).toMatch(/200/)
      expect(line!.textContent).toMatch(/EUR/)
    })
  })

  it('clears result when amount changes', async () => {
    setupFetchSuccess()
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: /from/i })).not.toBeDisabled(),
    )
    await user.click(screen.getByRole('button', { name: /get exchange rate/i }))
    await screen.findByText(/100/)

    const amt = screen.getByLabelText('Amount')
    await user.clear(amt)
    await user.type(amt, '50')
    expect(
      screen.getByText(/Choose amount and currencies/i),
    ).toBeInTheDocument()
  })

  it('swap swaps currencies and clears result', async () => {
    setupFetchSuccess()
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: /from/i })).not.toBeDisabled(),
    )
    await user.click(screen.getByRole('button', { name: /get exchange rate/i }))
    await screen.findByText(/100/)

    await user.click(screen.getByRole('button', { name: /swap currencies/i }))
    const from = screen.getByRole('combobox', {
      name: /from/i,
    }) as HTMLSelectElement
    const to = screen.getByRole('combobox', { name: /to/i }) as HTMLSelectElement
    expect(from.value).toBe('EUR')
    expect(to.value).toBe('USD')
    expect(
      screen.getByText(/Choose amount and currencies/i),
    ).toBeInTheDocument()
  })

  it('shows error when Get Exchange Rate fails', async () => {
    setupFetchSuccess()
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: /from/i })).not.toBeDisabled(),
    )

    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const u =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.href
              : (input as Request).url
        if (u.includes('/currencies')) {
          return Promise.resolve(
            new Response(JSON.stringify(currenciesJson), { status: 200 }),
          )
        }
        if (u.includes('currencyData.json')) {
          return Promise.resolve(
            new Response(JSON.stringify(minimalCldrFixture), { status: 200 }),
          )
        }
        if (u.includes('/latest')) {
          return Promise.resolve(
            new Response(JSON.stringify({ message: 'bad' }), { status: 400 }),
          )
        }
        return Promise.resolve(new Response('', { status: 404 }))
      }),
    )

    await user.click(screen.getByRole('button', { name: /get exchange rate/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('bad')
    })
  })

  it('shows banner when currency list request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('', { status: 503 }))),
    )
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Could not load currencies',
      )
    })
  })
})
