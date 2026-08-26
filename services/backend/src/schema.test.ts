import { describe, expect, it } from 'vitest';
import { orderStatusEnum } from './db/schema';
import { MenuItemInsertSchema } from './lib/zod-schemas';

describe('order status source of truth', () => {
  it('keeps a closed set of statuses for the state machine', () => {
    expect(orderStatusEnum.enumValues).toEqual([
      'pending',
      'accepted',
      'preparing',
      'ready',
      'completed',
      'cancelled',
    ]);
  });
});

describe('menu item insert schema (drizzle-zod)', () => {
  const valid = {
    categoryId: '11111111-1111-4111-8111-111111111111',
    name: 'Hanger Steak',
    priceCents: 3200,
  };

  it('accepts a valid item payload', () => {
    const parsed = MenuItemInsertSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('rejects a missing name', () => {
    const parsed = MenuItemInsertSchema.safeParse({ ...valid, name: '' });
    expect(parsed.success).toBe(false);
  });

  it('rejects a negative price', () => {
    const parsed = MenuItemInsertSchema.safeParse({ ...valid, priceCents: -1 });
    expect(parsed.success).toBe(false);
  });
});
