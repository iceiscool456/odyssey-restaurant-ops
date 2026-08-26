import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { HttpError } from './domain/http-error';
import type { AppEnv } from './env';
import { healthRoute } from './routes/health';
import { registerCustomerRoutes } from './routes/customers';
import { registerMenuRoutes } from './routes/menu';
import { registerOrderRoutes } from './routes/orders';
import { registerSettingsRoutes } from './routes/settings';
import { registerSummaryRoutes } from './routes/summary';

const app = new OpenAPIHono<AppEnv>({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid request' }, 400);
    }
  },
});

app.use(
  '*',
  cors({
    origin: ['http://localhost:8081', 'http://localhost:19006', 'http://localhost:8082'],
    allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
);

app.onError((error, c) => {
  if (error instanceof HttpError) {
    return c.json(error.body, error.status);
  }
  console.error(error);
  return c.json({ error: 'Internal server error' }, 500);
});

app.openapi(healthRoute, (c) => c.json({ status: 'ok' as const }, 200));
registerMenuRoutes(app);
registerOrderRoutes(app);
registerCustomerRoutes(app);
registerSettingsRoutes(app);
registerSummaryRoutes(app);

app.doc31('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Odyssey Restaurant Ops API',
    version: '0.1.0',
  },
});

export default app;
export type { AppEnv };
