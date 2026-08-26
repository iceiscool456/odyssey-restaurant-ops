/** Sales tax as basis points (850 = 8.5%). Applied server-side only. */
export const TAX_BPS = 850;

export function lineTotalCents(unitPriceCents: number, quantity: number): number {
  return unitPriceCents * quantity;
}

export function orderTotals(subtotalCents: number, taxBps = TAX_BPS) {
  const taxCents = Math.round((subtotalCents * taxBps) / 10_000);
  return {
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
  };
}
