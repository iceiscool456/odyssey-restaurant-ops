import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';
import { withDb } from '../db/client';
import { getSettings, updateSettings } from '../domain/settings';
import type { AppEnv } from '../env';
import { jsonError, notFoundError } from '../lib/errors';
import { BusinessSettingsSchema, UpdateSettingsBodySchema } from '../lib/zod-schemas';

export const getSettingsRoute = createRoute({
  method: 'get',
  path: '/settings',
  operationId: 'getSettings',
  tags: ['settings'],
  responses: {
    200: {
      description: 'Ordering-related business settings',
      content: {
        'application/json': {
          schema: BusinessSettingsSchema,
        },
      },
    },
    404: notFoundError,
  },
});

export const updateSettingsRoute = createRoute({
  method: 'patch',
  path: '/settings',
  operationId: 'updateSettings',
  tags: ['settings'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateSettingsBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Settings updated',
      content: {
        'application/json': {
          schema: BusinessSettingsSchema,
        },
      },
    },
    400: jsonError,
    404: notFoundError,
  },
});

export function registerSettingsRoutes(app: OpenAPIHono<AppEnv>) {
  app.openapi(getSettingsRoute, async (c) => {
    const row = await withDb(c.env.DATABASE_URL, (db) => getSettings(db));
    return c.json(row, 200);
  });

  app.openapi(updateSettingsRoute, async (c) => {
    const body = c.req.valid('json');
    const row = await withDb(c.env.DATABASE_URL, (db) => updateSettings(db, body));
    return c.json(row, 200);
  });
}
