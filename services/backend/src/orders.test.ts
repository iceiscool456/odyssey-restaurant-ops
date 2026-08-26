import { describe, expect, it } from 'vitest';
import { resolveDatabaseUrl } from '../scripts/env';
import app from './index';

const env = { DATABASE_URL: resolveDatabaseUrl() };

const seed = {
  ada: '33333333-3333-4333-8333-333333333331',
  calamari: '22222222-2222-4222-8222-222222222221',
  soldOut: '22222222-2222-4222-8222-222222222227',
};

async function post(path: string, body: unknown) {
  const response = await app.request(
    path,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    env,
  );
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

describe('order API', () => {
  it('creates an order and calculates totals server-side', async () => {
    const result = await post('/orders', {
      customerId: seed.ada,
      notes: 'Extra lemon',
      items: [{ menuItemId: seed.calamari, quantity: 2 }],
      totalCents: 1,
    });

    expect(result.status).toBe(201);
    expect(result.body.status).toBe('pending');
    expect(result.body.subtotalCents).toBe(2800);
    expect(result.body.taxCents).toBe(238);
    expect(result.body.totalCents).toBe(3038);
    expect(result.body.availableActions).toEqual(['accept', 'cancel']);
  });

  it('rejects an empty item list', async () => {
    const result = await post('/orders', {
      customerId: seed.ada,
      items: [],
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Invalid request');
  });

  it('rejects unavailable menu items', async () => {
    const result = await post('/orders', {
      customerId: seed.ada,
      items: [{ menuItemId: seed.soldOut, quantity: 1 }],
    });

    expect(result.status).toBe(409);
    expect(String(result.body.error)).toMatch(/unavailable/i);
  });

  it('rejects an illegal status transition', async () => {
    const created = await post('/orders', {
      customerId: seed.ada,
      items: [{ menuItemId: seed.calamari, quantity: 1 }],
    });
    expect(created.status).toBe(201);
    const id = created.body.id as string;

    const result = await post(`/orders/${id}/actions`, { action: 'complete' });
    expect(result.status).toBe(409);
    expect(String(result.body.error)).toMatch(/cannot complete/i);
  });
});
