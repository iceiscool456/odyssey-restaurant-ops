import { describe, expect, it } from 'vitest';
import { orderTotals, TAX_BPS } from './money';
import { availableActions, nextStatus } from './order-status';
import { HttpError } from './http-error';

describe('order totals', () => {
  it('computes tax server-side in integer cents', () => {
    expect(TAX_BPS).toBe(850);
    expect(orderTotals(4600)).toEqual({
      subtotalCents: 4600,
      taxCents: 391,
      totalCents: 4991,
    });
  });

  it('does not trust a client-supplied total', () => {
    const clientTotal = 1;
    expect(orderTotals(2800).totalCents).not.toBe(clientTotal);
    expect(orderTotals(2800).totalCents).toBe(3038);
  });
});

describe('order status machine', () => {
  it('allows the kitchen happy path', () => {
    expect(nextStatus('pending', 'accept')).toBe('accepted');
    expect(nextStatus('accepted', 'prepare')).toBe('preparing');
    expect(nextStatus('preparing', 'ready')).toBe('ready');
    expect(nextStatus('ready', 'complete')).toBe('completed');
  });

  it('rejects skipping ahead to complete', () => {
    expect(() => nextStatus('pending', 'complete')).toThrow(HttpError);
    try {
      nextStatus('pending', 'complete');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(409);
    }
  });

  it('does not offer actions on a completed order', () => {
    expect(availableActions('completed')).toEqual([]);
    expect(availableActions('cancelled')).toEqual([]);
  });
});
