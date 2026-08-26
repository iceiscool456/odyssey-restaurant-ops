import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import type { AppEnv } from './env';
import { healthRoute } from './routes/health';
import { registerMenuRoutes } from './routes/menu';

const app = new OpenAPIHono<AppEnv>();

app.use(
  '*',
  cors({
    origin: ['http://localhost:8081', 'http://localhost:19006', 'http://localhost:8082'],
    allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
);

app.openapi(healthRoute, (c) => c.json({ status: 'ok' as const }, 200));
registerMenuRoutes(app);

app.doc31('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Odyssey Restaurant Ops API',
    version: '0.1.0',
  },
});

export default app;
export type { AppEnv };
