/**
 * Formats an integer amount of cents as a currency string.
 * Money is stored as integer cents end-to-end to avoid float drift.
 */
export function formatCurrency(cents: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
}
