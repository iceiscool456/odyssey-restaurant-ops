import { eq } from 'drizzle-orm';
import type { Database } from '../db/client';
import { businessSettings, type OpeningHours } from '../db/schema';
import { HttpError } from './http-error';

export async function getSettings(db: Database) {
  const [row] = await db.select().from(businessSettings).where(eq(businessSettings.id, 'default')).limit(1);
  if (!row) throw new HttpError(404, { error: 'Business settings not found' });
  return row;
}

export async function updateSettings(
  db: Database,
  patch: {
    prepTimeMinutes?: number;
    autoAccept?: boolean;
    serviceAvailable?: boolean;
    openingHours?: OpeningHours;
  },
) {
  const [row] = await db
    .update(businessSettings)
    .set(patch)
    .where(eq(businessSettings.id, 'default'))
    .returning();
  if (!row) throw new HttpError(404, { error: 'Business settings not found' });
  return row;
}
