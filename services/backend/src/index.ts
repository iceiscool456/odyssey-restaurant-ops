import { OpenAPIHono } from '@hono/zod-openapi';
import { healthRoute } from './routes/health';

export type AppEnv = {
  Bindings: {
    DATABASE_URL: string;
  };
};

const app = new OpenAPIHono<AppEnv>();

app.openapi(healthRoute, (c) => c.json({ status: 'ok' as const }, 200));

app.doc31('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Odyssey Restaurant Ops API',
    version: '0.1.0',
  },
});

export default app;
