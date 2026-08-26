import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';
import { withDb } from '../db/client';
import { applyOrderAction, createOrder, getOrderDetail, listOrders } from '../domain/orders';
import type { AppEnv } from '../env';
import { conflictError, jsonError, notFoundError } from '../lib/errors';
import {
  ApplyOrderActionBodySchema,
  CreateOrderBodySchema,
  IdParamsSchema,
  OrderDetailSchema,
  OrderListQuerySchema,
  OrderSchema,
} from '../lib/zod-schemas';

export const listOrdersRoute = createRoute({
  method: 'get',
  path: '/orders',
  operationId: 'listOrders',
  tags: ['orders'],
  request: {
    query: OrderListQuerySchema,
  },
  responses: {
    200: {
      description: 'Orders, newest first',
      content: {
        'application/json': {
          schema: z.array(OrderSchema).openapi('OrderList'),
        },
      },
    },
    400: jsonError,
  },
});

export const getOrderRoute = createRoute({
  method: 'get',
  path: '/orders/{id}',
  operationId: 'getOrder',
  tags: ['orders'],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    200: {
      description: 'Order with customer, line items, and legal actions',
      content: {
        'application/json': {
          schema: OrderDetailSchema,
        },
      },
    },
    404: notFoundError,
  },
});

export const createOrderRoute = createRoute({
  method: 'post',
  path: '/orders',
  operationId: 'createOrder',
  tags: ['orders'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateOrderBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Order created. Totals are calculated server-side.',
      content: {
        'application/json': {
          schema: OrderDetailSchema,
        },
      },
    },
    400: jsonError,
    404: notFoundError,
    409: conflictError,
  },
});

export const applyOrderActionRoute = createRoute({
  method: 'post',
  path: '/orders/{id}/actions',
  operationId: 'applyOrderAction',
  tags: ['orders'],
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: ApplyOrderActionBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Order after a valid status action',
      content: {
        'application/json': {
          schema: OrderDetailSchema,
        },
      },
    },
    400: jsonError,
    404: notFoundError,
    409: conflictError,
  },
});

export function registerOrderRoutes(app: OpenAPIHono<AppEnv>) {
  app.openapi(listOrdersRoute, async (c) => {
    const query = c.req.valid('query');
    const rows = await withDb(c.env.DATABASE_URL, (db) => listOrders(db, query));
    return c.json(rows, 200);
  });

  app.openapi(getOrderRoute, async (c) => {
    const { id } = c.req.valid('param');
    const order = await withDb(c.env.DATABASE_URL, (db) => getOrderDetail(db, id));
    return c.json(order, 200);
  });

  app.openapi(createOrderRoute, async (c) => {
    const body = c.req.valid('json');
    const order = await withDb(c.env.DATABASE_URL, (db) => createOrder(db, body));
    return c.json(order, 201);
  });

  app.openapi(applyOrderActionRoute, async (c) => {
    const { id } = c.req.valid('param');
    const { action } = c.req.valid('json');
    const order = await withDb(c.env.DATABASE_URL, (db) => applyOrderAction(db, id, action));
    return c.json(order, 200);
  });
}
