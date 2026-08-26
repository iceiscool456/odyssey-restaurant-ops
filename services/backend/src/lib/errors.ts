import { z } from '@hono/zod-openapi';
import { ErrorSchema } from './zod-schemas';

export const jsonError = {
  description: 'Request could not be processed',
  content: {
    'application/json': {
      schema: ErrorSchema,
    },
  },
} as const;

export const notFoundError = {
  description: 'Resource not found',
  content: {
    'application/json': {
      schema: ErrorSchema,
    },
  },
} as const;

export type ErrorBody = z.infer<typeof ErrorSchema>;
