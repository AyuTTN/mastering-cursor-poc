# Currency Converter POC — Cursor Prompts

This file records the prompts used to build the currency converter with Cursor, in roughly the order they were given. Use **Plan mode** when you want a design before code; **Ask mode** for research; **Agent mode** to implement.

---

## 1. Initial app (Plan mode)

### Prompt to write a Plan

> The app must convert an entered amount from one currency to another (mocked rates), allow swapping currencies, and show a result like “100 USD = 11816.33 NPR.”
>
> Keep simple CSS, flags in selects, and a clean centered card layout.

### Plan outcome

Vite + React + TypeScript scaffold, mocked USD-based rates, swap control, flag labels in `<select>` options, centered card UI, components under `src/`.

### Prompt to build from the Plan (Agent mode)

> Build the Currency Converter App from the Plan

**Reference plan (summary):**

```markdown
# Currency Converter – Build Plan (Vite + React + TypeScript)

## Project Setup

1. Create project with Vite (React + TS).
   - `npm create vite@latest currency-converter -- --template react-ts`
   - `cd currency-converter && npm i && npm run dev`

2. Clean scaffold; implement App, components, mocked rates, card layout.
```

---

## 2. Fetch live exchange rates

### Prompt to compare libraries (Ask mode)

> What are the most popular external currency exchange rate APIs for JavaScript? Compare them briefly with pros and cons, and highlight which ones do not require an API key.

**Outcome:** Compared Frankfurter, ExchangeRate-API, Open Exchange Rates, Fixer, etc.; highlighted keyless options (Frankfurter public API, ExchangeRate-API open access with attribution).

### Prompt to use selected library (Agent mode)

> Replace the mock exchange rates with the Frankfurter API in this app and update the UI to show the converted result from the API.

**Outcome:** `fetchCurrencies`, `getRates`, live result line, loading/error states, rate date on result.

---

## 3. Support more currencies and control amount limits

### Prompt to limit max amount (Agent mode)

> Limit the amount input to a maximum of 12 digits before decimals. Show a small info message below the input that explains the limit to the user.

**Outcome:** `src/utils/amountInput.ts` (`clampAmountInputString`), hint under `AmountInput`.

### Prompt to disable selecting same currencies (Agent mode)

> Disable selecting the same currency in both dropdowns. If the user selects a From currency, disable the same option in the To dropdown, and do the opposite as well. Make sure users can only choose two different currencies at all times.

**Outcome:** `disableOptionCode` on `CurrencySelect`; disabled `<option>` for the other field’s selection.

### Prompt to support all currencies (Agent mode)

> Never hardcode currency flags or emojis. If an emoji cannot be generated, show only the currency code.
>
> Dynamically load all supported currencies from the Frankfurter API and dynamically generate flag emojis for each currency. Remove all mock data and replace it with real data from the API.

**Outcome:** Currencies from Frankfurter `/currencies`; flags from CLDR region data + `regionCodeToFlagEmoji` / `makeFlagFromCurrency`; code-only label when no flag.

---

## 4. Improve app structure and fix result display

### Prompt to clean up mock data (Agent mode)

> Delete src/data/currencies.ts and remove all its imports.

**Outcome:** Logic moved to `src/utils/currencyList.ts` (later split further into dedicated util files).

### Prompt to improve app structure (Agent mode)

> Move all API calls to src/api folder in separate files fetchCurrencies.ts and getRates.ts. Move conversion logic from data/rates.ts to src/utils/convertAmount.ts. Move helper functions like makeFlagFromCurrency to src/utils folder, one file per util. Update App.tsx imports to match new paths.

**Outcome:** `src/api/fetchCurrencies.ts`, `getRates.ts`, `fetchCurrencyRegionMap.ts`; `src/utils/convertAmount.ts`, `makeFlagFromCurrency.ts`, etc.

### Prompt to fix result display (Agent mode)

> Clear the result display when the user changes the amount or currencies. Show the result only after a new conversion is completed. If no conversion yet, keep the result area empty or show a short hint message.

**Outcome:** `setResult(null)` on amount/currency/swap changes; placeholder hint in `.result-area` until **Get Exchange Rate** succeeds; swap no longer auto-refetches.

---

## 5. Write and run unit tests with Cursor

### Prompt to write a Plan (Plan mode)

> Create a step-by-step plan to add and run unit tests in this app using Vitest. Cover all functionality and API requests (mock network calls).

### Plan outcome (summary)

```markdown
# Vitest Unit Test Setup and Coverage Plan

## Steps

### 1. Add Vitest to the Project
- Install vitest, @vitest/coverage-v8, jsdom, @testing-library/react, user-event, jest-dom
- Scripts: test, test:watch, test:coverage

### 2. Configure Vitest
- test block in vite.config.ts; src/test/setup.ts; ESLint vitest globals

### 3. Tests
- Utils: amountInput, convertAmount, flags, CLDR parse, buildCurrencyList, normalizeCurrencyPair
- API: fetchCurrencies, getRates, fetchCurrencyRegionMap (mock fetch)
- Components: AmountInput, CurrencySelect, Result, SwapButton
- App.test.tsx: load, convert, clear on edit, swap, errors

### 4. Run
- npm run test / npm run test:coverage
```

### Prompt to build from the Plan (Agent mode)

> Implement the plan as specified. Do NOT edit the plan file itself.

**Outcome:** 43+ tests, `npm run test`, `npm run test:coverage`, coverage in `coverage/` (gitignored).

---

## 6. Generate project documentation with AI

### Prompt to generate documentation (Agent mode)

> Generate developer documentation for this project and save it as DOCUMENTATION.md in the repo root. Include a short project overview and key features, technical stack, setup instructions (install, run, build, test), and usage guide with basic steps.

**Outcome:** [DOCUMENTATION.md](../DOCUMENTATION.md) at project root.

---

## Quick reference — Cursor modes used

| Mode   | Used for |
|--------|----------|
| Plan   | Initial app design, Vitest test plan |
| Ask    | Compare FX APIs without changing code |
| Agent  | Scaffold, API integration, refactors, tests, docs |

## Related files

- [README.md](../README.md) — POC overview and “how I built this with Cursor”
- [DOCUMENTATION.md](../DOCUMENTATION.md) — developer setup and architecture
