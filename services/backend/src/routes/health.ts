import { createRoute, z } from '@hono/zod-openapi';

const HealthResponseSchema = z
  .object({
    status: z.literal('ok'),
  })
  .openapi('HealthResponse');

export const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  operationId: 'getHealth',
  tags: ['system'],
  responses: {
    200: {
      description: 'Service is healthy',
      content: {
        'application/json': {
          schema: HealthResponseSchema,
        },
      },
    },
  },
});
