import { z } from '@hono/zod-openapi';
import { createSchemaFactory } from 'drizzle-zod';
import {
  businessSettings,
  customers,
  menuCategories,
  menuItems,
  orderItems,
  orderStatusEnum,
  orders,
} from '../db/schema';
import { ORDER_ACTIONS } from '../domain/order-status';

/**
 * Bind drizzle-zod to the OpenAPI-aware Zod instance so generated HTTP
 * schemas stay derived from the Drizzle tables instead of being rewritten.
 */
const { createSelectSchema, createInsertSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z,
});

export const OrderStatusSchema = createSelectSchema(orderStatusEnum).openapi('OrderStatus');

export const MenuCategorySchema = createSelectSchema(menuCategories).openapi('MenuCategory');

export const CreateMenuCategoryBodySchema = createInsertSchema(menuCategories, {
  name: (schema) => schema.min(1),
})
  .pick({ name: true, sortOrder: true })
  .openapi('CreateMenuCategoryBody');

export const UpdateMenuCategoryBodySchema = createUpdateSchema(menuCategories, {
  name: (schema) => schema.min(1),
})
  .pick({ name: true, sortOrder: true })
  .openapi('UpdateMenuCategoryBody');

export const MenuItemSchema = createSelectSchema(menuItems).openapi('MenuItem');

export const MenuItemInsertSchema = createInsertSchema(menuItems, {
  name: (schema) => schema.min(1),
  priceCents: (schema) => schema.int().min(0),
}).openapi('MenuItemInsert');

export const CreateMenuItemBodySchema = MenuItemInsertSchema.pick({
  categoryId: true,
  name: true,
  description: true,
  priceCents: true,
  isAvailable: true,
}).openapi('CreateMenuItemBody');

export const UpdateMenuItemBodySchema = createUpdateSchema(menuItems, {
  name: (schema) => schema.min(1),
  priceCents: (schema) => schema.int().min(0),
})
  .pick({
    categoryId: true,
    name: true,
    description: true,
    priceCents: true,
    isAvailable: true,
  })
  .openapi('UpdateMenuItemBody');

export const MenuItemListQuerySchema = z
  .object({
    categoryId: z.uuid().optional(),
    available: z.enum(['true', 'false']).optional(),
  })
  .openapi('MenuItemListQuery');

export const CustomerSchema = createSelectSchema(customers).openapi('Customer');

export const CreateCustomerBodySchema = createInsertSchema(customers, {
  name: (schema) => schema.min(1),
  email: (schema) => schema.email(),
})
  .pick({ name: true, email: true, phone: true })
  .openapi('CreateCustomerBody');

export const CustomerSummarySchema = CustomerSchema.extend({
  orderCount: z.number().int(),
  spendCents: z.number().int(),
}).openapi('CustomerSummary');

export const OrderSchema = createSelectSchema(orders).openapi('Order');

export const OrderItemSchema = createSelectSchema(orderItems).openapi('OrderItem');

export const OrderActionSchema = z.enum(ORDER_ACTIONS).openapi('OrderAction');

export const OrderDetailSchema = OrderSchema.extend({
  customer: CustomerSchema,
  items: z.array(OrderItemSchema),
  availableActions: z.array(OrderActionSchema),
}).openapi('OrderDetail');

export const CreateOrderBodySchema = z
  .object({
    customerId: z.uuid(),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          menuItemId: z.uuid(),
          quantity: z.number().int().min(1),
        }),
      )
      .min(1),
  })
  .openapi('CreateOrderBody');

export const ApplyOrderActionBodySchema = z
  .object({
    action: OrderActionSchema,
  })
  .openapi('ApplyOrderActionBody');

export const OrderListQuerySchema = z
  .object({
    status: OrderStatusSchema.optional(),
    customerId: z.uuid().optional(),
  })
  .openapi('OrderListQuery');

export const CustomerDetailSchema = CustomerSummarySchema.extend({
  recentOrders: z.array(OrderSchema),
}).openapi('CustomerDetail');

export const HomeSummarySchema = z
  .object({
    totalOrders: z.number().int(),
    revenueCents: z.number().int(),
    pendingOrders: z.number().int(),
    popularItems: z.array(
      z.object({
        menuItemId: z.uuid(),
        name: z.string(),
        quantity: z.number().int(),
      }),
    ),
  })
  .openapi('HomeSummary');

export const BusinessSettingsSchema = createSelectSchema(businessSettings).openapi('BusinessSettings');

const DayHoursSchema = z
  .object({
    open: z.string(),
    close: z.string(),
  })
  .nullable();

export const OpeningHoursSchema = z
  .object({
    monday: DayHoursSchema,
    tuesday: DayHoursSchema,
    wednesday: DayHoursSchema,
    thursday: DayHoursSchema,
    friday: DayHoursSchema,
    saturday: DayHoursSchema,
    sunday: DayHoursSchema,
  })
  .openapi('OpeningHours');

export const UpdateSettingsBodySchema = z
  .object({
    prepTimeMinutes: z.number().int().min(0).optional(),
    autoAccept: z.boolean().optional(),
    serviceAvailable: z.boolean().optional(),
    openingHours: OpeningHoursSchema.optional(),
  })
  .openapi('UpdateSettingsBody');

export const ErrorSchema = z
  .object({
    error: z.string(),
  })
  .openapi('ErrorResponse');

export const IdParamsSchema = z
  .object({
    id: z.uuid().openapi({ param: { name: 'id', in: 'path' } }),
  })
  .openapi('IdParams');
