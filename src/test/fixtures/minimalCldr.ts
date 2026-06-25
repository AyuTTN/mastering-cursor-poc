import type { CldrCurrencyDataFile } from '../../utils/parseCldrCurrencyToRegion'

/** Tiny CLDR-shaped fixture for tests (no real file download). */
export const minimalCldrFixture: CldrCurrencyDataFile = {
  supplemental: {
    currencyData: {
      region: {
        US: [{ USD: { _from: '2000-01-01' } }],
        EU: [{ EUR: { _from: '1999-01-01' } }],
        GB: [{ GBP: { _from: '1971-01-01' } }],
        ZZ: [{ XYZ: { _from: '2001-01-01' } }],
      },
    },
  },
}
