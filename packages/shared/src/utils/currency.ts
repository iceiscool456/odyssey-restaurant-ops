/**
 * Formats an integer amount of cents as a currency string.
 * Money is stored as integer cents end-to-end to avoid float drift.
 */
export function formatCurrency(cents: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
}

/** Parses a dollars string like "32" or "32.50" into integer cents. */
export function parseDollarsToCents(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const [whole, fraction = ''] = trimmed.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

export function centsToDollarInput(cents: number): string {
  return (cents / 100).toFixed(2);
}
