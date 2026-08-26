import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';
import { withDb } from '../db/client';
import { getHomeSummary } from '../domain/summary';
import type { AppEnv } from '../env';
import { HomeSummarySchema } from '../lib/zod-schemas';

export const getHomeSummaryRoute = createRoute({
  method: 'get',
  path: '/summary',
  operationId: 'getHomeSummary',
  tags: ['summary'],
  responses: {
    200: {
      description: 'Home KPIs: order volume, completed revenue, pending queue, popular items',
      content: {
        'application/json': {
          schema: HomeSummarySchema,
        },
      },
    },
  },
});

export function registerSummaryRoutes(app: OpenAPIHono<AppEnv>) {
  app.openapi(getHomeSummaryRoute, async (c) => {
    const summary = await withDb(c.env.DATABASE_URL, (db) => getHomeSummary(db));
    return c.json(summary, 200);
  });
}
