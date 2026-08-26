import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
};

/**
 * Canonical order status. Every other layer (OpenAPI, generated hooks, UI)
 * must derive from this enum — never redeclare the union by hand.
 */
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'accepted',
  'preparing',
  'ready',
  'completed',
  'cancelled',
]);

export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
});

export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => menuCategories.id, { onDelete: 'restrict' }),
  name: text('name').notNull(),
  description: text('description'),
  /** Integer cents — never store money as a float. */
  priceCents: integer('price_cents').notNull(),
  isAvailable: boolean('is_available').notNull().default(true),
  ...timestamps,
});

export const customers = pgTable(
  'customers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    ...timestamps,
  },
  (table) => [uniqueIndex('customers_email_idx').on(table.email)],
);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'restrict' }),
  status: orderStatusEnum('status').notNull().default('pending'),
  subtotalCents: integer('subtotal_cents').notNull(),
  taxCents: integer('tax_cents').notNull(),
  totalCents: integer('total_cents').notNull(),
  notes: text('notes'),
  ...timestamps,
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id')
    .notNull()
    .references(() => menuItems.id, { onDelete: 'restrict' }),
  nameSnapshot: text('name_snapshot').notNull(),
  unitPriceCents: integer('unit_price_cents').notNull(),
  quantity: integer('quantity').notNull(),
  lineTotalCents: integer('line_total_cents').notNull(),
  ...timestamps,
});

export type DayHours = { open: string; close: string } | null;

export type OpeningHours = {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
};

export const businessSettings = pgTable('business_settings', {
  id: text('id').primaryKey().default('default'),
  prepTimeMinutes: integer('prep_time_minutes').notNull().default(15),
  autoAccept: boolean('auto_accept').notNull().default(false),
  serviceAvailable: boolean('service_available').notNull().default(true),
  openingHours: jsonb('opening_hours').$type<OpeningHours>().notNull(),
  ...timestamps,
});

export const menuCategoriesRelations = relations(menuCategories, ({ many }) => ({
  items: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
  orderItems: many(orderItems),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));
