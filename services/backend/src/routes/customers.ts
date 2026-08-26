import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';
import { withDb } from '../db/client';
import { createCustomer } from '../domain/customers';
import { getCustomerDetail, listCustomerSummaries } from '../domain/summary';
import { HttpError } from '../domain/http-error';
import type { AppEnv } from '../env';
import { conflictError, jsonError, notFoundError } from '../lib/errors';
import {
  CreateCustomerBodySchema,
  CustomerDetailSchema,
  CustomerSchema,
  CustomerSummarySchema,
  IdParamsSchema,
} from '../lib/zod-schemas';

export const listCustomersRoute = createRoute({
  method: 'get',
  path: '/customers',
  operationId: 'listCustomers',
  tags: ['crm'],
  responses: {
    200: {
      description: 'Customers with order count and completed spend',
      content: {
        'application/json': {
          schema: z.array(CustomerSummarySchema).openapi('CustomerSummaryList'),
        },
      },
    },
  },
});

export const getCustomerRoute = createRoute({
  method: 'get',
  path: '/customers/{id}',
  operationId: 'getCustomer',
  tags: ['crm'],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    200: {
      description: 'Customer with recent orders',
      content: {
        'application/json': {
          schema: CustomerDetailSchema,
        },
      },
    },
    404: notFoundError,
  },
});

export const createCustomerRoute = createRoute({
  method: 'post',
  path: '/customers',
  operationId: 'createCustomer',
  tags: ['crm'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateCustomerBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Customer created',
      content: {
        'application/json': {
          schema: CustomerSchema,
        },
      },
    },
    400: jsonError,
    409: conflictError,
  },
});

export function registerCustomerRoutes(app: OpenAPIHono<AppEnv>) {
  app.openapi(listCustomersRoute, async (c) => {
    const rows = await withDb(c.env.DATABASE_URL, (db) => listCustomerSummaries(db));
    return c.json(rows, 200);
  });

  app.openapi(getCustomerRoute, async (c) => {
    const { id } = c.req.valid('param');
    const customer = await withDb(c.env.DATABASE_URL, (db) => getCustomerDetail(db, id));
    if (!customer) throw new HttpError(404, { error: 'Customer not found' });
    return c.json(customer, 200);
  });

  app.openapi(createCustomerRoute, async (c) => {
    const body = c.req.valid('json');
    const row = await withDb(c.env.DATABASE_URL, (db) => createCustomer(db, body));
    return c.json(row, 201);
  });
}
