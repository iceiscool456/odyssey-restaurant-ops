import { eq } from 'drizzle-orm';
import type { Database } from '../db/client';
import { menuCategories, menuItems } from '../db/schema';
import { HttpError } from './http-error';

export async function createCategory(db: Database, input: { name: string; sortOrder?: number }) {
  const [row] = await db.insert(menuCategories).values(input).returning();
  return row;
}

export async function updateCategory(
  db: Database,
  id: string,
  patch: { name?: string; sortOrder?: number },
) {
  const [row] = await db.update(menuCategories).set(patch).where(eq(menuCategories.id, id)).returning();
  if (!row) throw new HttpError(404, { error: 'Category not found' });
  return row;
}

export async function createMenuItem(
  db: Database,
  input: {
    categoryId: string;
    name: string;
    description?: string | null;
    priceCents: number;
    isAvailable?: boolean;
  },
) {
  const [category] = await db.select().from(menuCategories).where(eq(menuCategories.id, input.categoryId)).limit(1);
  if (!category) throw new HttpError(400, { error: 'Unknown menu category' });

  const [row] = await db.insert(menuItems).values(input).returning();
  return row;
}

export async function updateMenuItem(
  db: Database,
  id: string,
  patch: {
    categoryId?: string;
    name?: string;
    description?: string | null;
    priceCents?: number;
    isAvailable?: boolean;
  },
) {
  if (patch.categoryId) {
    const [category] = await db
      .select()
      .from(menuCategories)
      .where(eq(menuCategories.id, patch.categoryId))
      .limit(1);
    if (!category) throw new HttpError(400, { error: 'Unknown menu category' });
  }

  const [row] = await db.update(menuItems).set(patch).where(eq(menuItems.id, id)).returning();
  if (!row) throw new HttpError(404, { error: 'Menu item not found' });
  return row;
}
