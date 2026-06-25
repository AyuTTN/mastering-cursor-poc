# Currency Converter POC

A small **proof of concept** currency converter built with **Cursor** — mostly by describing what I wanted in chat and letting the agent scaffold, wire APIs, and iterate on UX.

![Currency Converter](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

## What it does

- Enter an amount and convert **from → to** using live [Frankfurter](https://www.frankfurter.dev/) rates (ECB reference data).
- Pick currencies from a list loaded from the API, with **flag emojis** derived at runtime from CLDR territory data (no hardcoded flag map).
- **Swap** currencies, block selecting the same code in both dropdowns, and see results only after clicking **Get Exchange Rate**.
- Amount input is capped at **12 digits** before the decimal, with a short hint under the field.

## Quick start

```bash
cd currency-converter
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). You need network access for Frankfurter and jsDelivr.

```bash
npm run build    # production build → dist/
npm run test     # Vitest (fetch mocked in tests)
npm run lint
```

See [DOCUMENTATION.md](./DOCUMENTATION.md) for architecture, folder layout, and full command reference.

## How I built this with Cursor

This repo started from an **empty workspace**. I used Cursor in two modes: **Plan** to agree on structure, then **Agent** to implement and refine.

### 1. First prompt — define the POC

I asked for a currency converter with:

- Mocked rates at first, then real API data later
- Swap between currencies
- A result line like `100 USD = 11816.33 NPR`
- Simple CSS, flags in selects, centered card layout

Cursor scaffolded a **Vite + React + TypeScript** app (`npm create vite`) and split the UI into small components under `src/components/`.

### 2. Replace mocks with Frankfurter

Next prompt: use the **Frankfurter API** instead of hardcoded rates, show the converted result from the network, loading/error states, and a rate date on the result line.

The agent added `src/api/fetchCurrencies.ts`, `getRates.ts`, and refactored `App.tsx` to load currencies on mount and fetch rates on button click.

### 3. UX and validation passes

Follow-up chats tightened behavior without rewriting the whole app:

| Ask in Cursor | What changed |
|---------------|--------------|
| Max 12 digits before decimal + hint | `src/utils/amountInput.ts`, `AmountInput` |
| Disable same currency in both selects | `CurrencySelect` + `disableOptionCode` |
| No hardcoded flags; load all currencies from API | CLDR fetch + `makeFlagFromCurrency` utils |
| Clear result when amount/currencies change | `App.tsx` state + placeholder hint |
| Organize `api/` and `utils/` | Split files: `convertAmount`, `buildCurrencyList`, etc. |

### 4. Tests and docs

I asked for a **Vitest plan**, then had the agent implement it: unit tests for utils and API modules (mocked `fetch`), component tests with Testing Library, and `App.test.tsx` for the main flow.

Finally: **DOCUMENTATION.md** for developers and this README for the “built with Cursor” story.

### Tips that worked for me

1. **Start with a clear UI sentence** — e.g. “100 USD = X NPR” — so layout and copy stay aligned.
2. **One concern per follow-up** — flags, validation, and API swaps are easier to review as separate prompts.
3. **Use Plan mode** for bigger changes (test setup, API migration), then switch to Agent to execute.
4. **Run `npm run test` and `npm run lint`** after each batch; Cursor fixed ESLint issues (e.g. React hooks in effects) when tests failed.
5. **Point at files** — “update `App.tsx` imports to match `src/api/`” reduces drift.

## Tech stack

| Layer | Choice |
|-------|--------|
| UI | React 19, TypeScript |
| Tooling | Vite 8, ESLint |
| Styling | Plain CSS (`src/index.css`) |
| Data | Frankfurter API + CLDR JSON (jsDelivr) |
| Tests | Vitest, jsdom, Testing Library |

## Project structure (short)

```
src/
  api/           # fetchCurrencies, getRates, fetchCurrencyRegionMap
  components/    # AmountInput, CurrencySelect, Result, SwapButton
  utils/         # conversion, flags, CLDR parse, amount clamping
  App.tsx        # main screen
```

## Disclaimer

This is a **POC**, not a production forex product. Rates are reference data from Frankfurter; flags are best-effort from CLDR regions. Use it to explore Cursor-assisted development, not for financial decisions.

## License

Private / educational use unless you add a license file.
