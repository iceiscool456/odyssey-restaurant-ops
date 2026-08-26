import { eq } from 'drizzle-orm';
import type { Database } from '../db/client';
import { customers } from '../db/schema';
import { HttpError } from './http-error';

export async function requireCustomer(db: Database, id: string) {
  const [row] = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  if (!row) throw new HttpError(404, { error: 'Customer not found' });
  return row;
}

export async function createCustomer(
  db: Database,
  input: { name: string; email: string; phone?: string | null },
) {
  try {
    const [row] = await db.insert(customers).values(input).returning();
    return row;
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('customers_email_idx') || message.includes('unique')) {
      throw new HttpError(409, { error: 'A customer with that email already exists' });
    }
    throw error;
  }
}
