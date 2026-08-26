import { z } from '@hono/zod-openapi';
import { createSchemaFactory } from 'drizzle-zod';
import { menuCategories, menuItems, orderStatusEnum } from '../db/schema';

/**
 * Bind drizzle-zod to the OpenAPI-aware Zod instance so generated HTTP
 * schemas stay derived from the Drizzle tables instead of being rewritten.
 */
const { createSelectSchema, createInsertSchema } = createSchemaFactory({
  zodInstance: z,
});

export const OrderStatusSchema = createSelectSchema(orderStatusEnum).openapi('OrderStatus');

export const MenuCategorySchema = createSelectSchema(menuCategories).openapi('MenuCategory');

export const MenuItemSchema = createSelectSchema(menuItems).openapi('MenuItem');

export const MenuItemInsertSchema = createInsertSchema(menuItems, {
  name: (schema) => schema.min(1),
  priceCents: (schema) => schema.int().min(0),
}).openapi('MenuItemInsert');

export const MenuItemListQuerySchema = z
  .object({
    categoryId: z.uuid().optional(),
    available: z.enum(['true', 'false']).optional(),
  })
  .openapi('MenuItemListQuery');

export const ErrorSchema = z
  .object({
    error: z.string(),
  })
  .openapi('ErrorResponse');
