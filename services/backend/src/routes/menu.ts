import { createRoute, z } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import type { OpenAPIHono } from '@hono/zod-openapi';
import { withDb } from '../db/client';
import { menuCategories, menuItems } from '../db/schema';
import type { AppEnv } from '../env';
import { jsonError, notFoundError } from '../lib/errors';
import { MenuCategorySchema, MenuItemListQuerySchema, MenuItemSchema } from '../lib/zod-schemas';

export const listMenuCategoriesRoute = createRoute({
  method: 'get',
  path: '/menu/categories',
  operationId: 'listMenuCategories',
  tags: ['menu'],
  responses: {
    200: {
      description: 'Menu categories ordered for display',
      content: {
        'application/json': {
          schema: z.array(MenuCategorySchema).openapi('MenuCategoryList'),
        },
      },
    },
  },
});

export const listMenuItemsRoute = createRoute({
  method: 'get',
  path: '/menu/items',
  operationId: 'listMenuItems',
  tags: ['menu'],
  request: {
    query: MenuItemListQuerySchema,
  },
  responses: {
    200: {
      description: 'Menu items, optionally filtered',
      content: {
        'application/json': {
          schema: z.array(MenuItemSchema).openapi('MenuItemList'),
        },
      },
    },
    400: jsonError,
  },
});

export const getMenuItemRoute = createRoute({
  method: 'get',
  path: '/menu/items/{id}',
  operationId: 'getMenuItem',
  tags: ['menu'],
  request: {
    params: z.object({
      id: z.uuid().openapi({ param: { name: 'id', in: 'path' } }),
    }),
  },
  responses: {
    200: {
      description: 'A single menu item',
      content: {
        'application/json': {
          schema: MenuItemSchema,
        },
      },
    },
    404: notFoundError,
  },
});

export function registerMenuRoutes(app: OpenAPIHono<AppEnv>) {
  app.openapi(listMenuCategoriesRoute, async (c) => {
    const rows = await withDb(c.env.DATABASE_URL, (db) =>
      db.select().from(menuCategories).orderBy(menuCategories.sortOrder),
    );
    return c.json(rows, 200);
  });

  app.openapi(listMenuItemsRoute, async (c) => {
    const { categoryId, available } = c.req.valid('query');

    const filters = [
      categoryId ? eq(menuItems.categoryId, categoryId) : undefined,
      available === 'true' ? eq(menuItems.isAvailable, true) : undefined,
      available === 'false' ? eq(menuItems.isAvailable, false) : undefined,
    ].filter((clause) => clause !== undefined);

    const rows = await withDb(c.env.DATABASE_URL, (db) =>
      db
        .select()
        .from(menuItems)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(menuItems.name),
    );

    return c.json(rows, 200);
  });

  app.openapi(getMenuItemRoute, async (c) => {
    const { id } = c.req.valid('param');
    const item = await withDb(c.env.DATABASE_URL, async (db) => {
      const [row] = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
      return row;
    });
    if (!item) return c.json({ error: 'Menu item not found' }, 404);
    return c.json(item, 200);
  });
}
