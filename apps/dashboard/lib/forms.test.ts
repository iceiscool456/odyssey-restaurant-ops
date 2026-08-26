import { describe, expect, it } from 'vitest';
import {
  validateCategoryName,
  validateGuest,
  validateMenuItem,
  validatePrepTime,
  validateTicket,
} from './forms';

describe('form validation', () => {
  it('rejects a menu item with no name or a non-dollar price', () => {
    expect(validateMenuItem({ name: '  ', price: '32', categoryId: 'cat' }).ok).toBe(false);
    expect(validateMenuItem({ name: 'Steak', price: '-4', categoryId: 'cat' }).ok).toBe(false);
    expect(validateMenuItem({ name: 'Steak', price: '32.50', categoryId: '' }).ok).toBe(false);
  });

  it('parses a valid menu price into integer cents', () => {
    const result = validateMenuItem({ name: 'Steak', price: '32.50', categoryId: 'cat' });
    expect(result).toEqual({ ok: true, value: { name: 'Steak', priceCents: 3250, categoryId: 'cat' } });
  });

  it('requires a guest and at least one ticket line', () => {
    expect(validateTicket({ customerId: '', quantities: { a: 1 } }).ok).toBe(false);
    expect(validateTicket({ customerId: 'ada', quantities: { a: 0, b: 0 } }).ok).toBe(false);
    expect(validateTicket({ customerId: 'ada', quantities: { calamari: 2 } })).toEqual({
      ok: true,
      value: { customerId: 'ada', items: [{ menuItemId: 'calamari', quantity: 2 }] },
    });
  });

  it('requires a valid guest email', () => {
    expect(validateGuest({ name: 'Ada', email: 'not-an-email', phone: '' }).ok).toBe(false);
    expect(validateGuest({ name: 'Ada', email: 'ada@example.com', phone: '555' })).toEqual({
      ok: true,
      value: { name: 'Ada', email: 'ada@example.com', phone: '555' },
    });
  });

  it('rejects negative prep time', () => {
    expect(validatePrepTime('-1').ok).toBe(false);
    expect(validatePrepTime('18')).toEqual({ ok: true, value: 18 });
  });

  it('rejects a blank category name', () => {
    expect(validateCategoryName('   ').ok).toBe(false);
    expect(validateCategoryName('Starters')).toEqual({ ok: true, value: 'Starters' });
  });
});
