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

export const conflictError = {
  description: 'Request conflicts with current state',
  content: {
    'application/json': {
      schema: ErrorSchema,
    },
  },
} as const;
