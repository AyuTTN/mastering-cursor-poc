# Currency Converter — Developer Documentation

## Project overview

This is a single-page **currency converter** web app. Users enter an amount, choose a **from** and **to** currency, and fetch a conversion using **live exchange rates** from the [Frankfurter](https://www.frankfurter.dev/) API (ECB reference data). Currency lists and names come from Frankfurter; optional **flag emojis** are derived at runtime from **Unicode CLDR** territory data (via jsDelivr) and ISO region codes—no hardcoded flag tables in the repo.

## Key features

- **Live rates** — Frankfurter `/v1/latest` (`getRates`) after the user clicks **Get Exchange Rate**.
- **Dynamic currency list** — Frankfurter `/v1/currencies`, with CLDR-backed region hints for flags when available.
- **Swap** — Exchanges the two selected currencies; the previous result is cleared until the user runs a new conversion.
- **Validation** — Amount must be a positive number; integer part limited to **12 digits** before the decimal (with an inline hint).
- **Distinct currencies** — The currency selected in one dropdown cannot be chosen in the other (disabled options).
- **UX** — Loading states, error messages, retry on failed currency load, placeholder text until a conversion succeeds, `aria-live` on the result region.
- **Tests** — Vitest + Testing Library; all HTTP access mocked in unit tests.

## Technical stack

| Area | Technology |
|------|------------|
| UI | React 19, TypeScript |
| Build / dev server | Vite 8, `@vitejs/plugin-react` |
| Styling | Plain CSS (`src/index.css`) |
| HTTP | Native `fetch` (no axios) |
| Lint | ESLint 10, `typescript-eslint`, `eslint-plugin-react-hooks` |
| Unit tests | Vitest 4, jsdom, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom` |
| Coverage | `@vitest/coverage-v8` |

### External services (runtime)

- **Frankfurter** — `https://api.frankfurter.dev/v1` (currencies + latest rates).
- **CLDR JSON** — `https://cdn.jsdelivr.net/gh/unicode-org/cldr-json@main/.../currencyData.json` (currency → territory for flag emoji generation).

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (ships with Node)

## Setup instructions

### Install dependencies

From the project root (directory that contains `package.json`):

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Vite prints a local URL (typically `http://localhost:5173`). Open it in a browser. The app needs network access for Frankfurter and jsDelivr in dev.

### Production build

```bash
npm run build
```

Outputs static assets to `dist/`. Type-checking runs as part of the build (`tsc -b`).

### Preview the production build

```bash
npm run preview
```

Serves the contents of `dist/` locally.

### Run tests

```bash
npm run test
```

One-shot run (CI-friendly).

```bash
npm run test:watch
```

Watch mode while developing.

```bash
npm run test:coverage
```

Runs tests and writes a coverage report under `coverage/` (ignored by git and ESLint).

### Lint

```bash
npm run lint
```

## Project layout (high level)

```
src/
  api/           # fetchCurrencies, getRates, fetchCurrencyRegionMap, frankfurterBase
  components/    # AmountInput, CurrencySelect, Result, SwapButton
  types/         # shared types (e.g. Currency)
  utils/         # conversion math, amount clamping, CLDR parse, flag helpers, currency list builders
  test/          # Vitest setup + fixtures (not shipped)
  App.tsx        # main screen state and orchestration
  main.tsx       # React root
  index.css      # global + component styles
```

Tests live next to sources as `*.test.ts` / `*.test.tsx`.

## Usage guide (end user flow)

1. **Wait for currencies** — On first load, the app fetches the supported currency list. A short “Loading currency list…” note may appear in the subtitle.
2. **Enter amount** — Type a positive number in **Amount** (fractional part allowed; whole part max 12 digits).
3. **Choose currencies** — Select **From** and **To**; the same code cannot be selected in both fields. Use **Swap** to exchange the two selections.
4. **Convert** — Click **Get Exchange Rate**. While loading, the result area shows “Fetching rate…”. On success, a line like `100 USD = 200 EUR.` appears with the Frankfurter rate date. On failure, an error message appears under the form.
5. **Change inputs** — Editing the amount or either currency (including swap) **clears** the last result until you click **Get Exchange Rate** again. If no result is shown, a short hint explains to run a conversion.
6. **Retry** — If the currency list fails to load, use **Retry** in the error banner.

## Developer notes

- **No API keys** — Frankfurter public endpoints; CLDR file is public on jsDelivr.
- **CORS** — Browsers call these hosts directly; ensure corporate proxies allow them if testing on a restricted network.
- **Large CLDR payload** — The currency-region JSON is large; the app fetches it once per load (and again on **Retry**). Consider caching in `sessionStorage` if you need to optimize repeat visits.

For questions about this codebase, start with `src/App.tsx` (orchestration) and `src/api/` (network boundaries).
