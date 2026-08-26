import { desc, eq, sql } from 'drizzle-orm';
import type { Database } from '../db/client';
import { customers, orderItems, orders } from '../db/schema';

export async function getHomeSummary(db: Database) {
  const [counts] = await db
    .select({
      totalOrders: sql<number>`count(*)::int`,
      pendingOrders: sql<number>`coalesce(sum(case when ${orders.status} = 'pending' then 1 else 0 end), 0)::int`,
      revenueCents: sql<number>`coalesce(sum(case when ${orders.status} = 'completed' then ${orders.totalCents} else 0 end), 0)::int`,
    })
    .from(orders);

  const popularItems = await db
    .select({
      menuItemId: orderItems.menuItemId,
      name: orderItems.nameSnapshot,
      quantity: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(eq(orders.status, 'completed'))
    .groupBy(orderItems.menuItemId, orderItems.nameSnapshot)
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(5);

  return {
    totalOrders: counts?.totalOrders ?? 0,
    pendingOrders: counts?.pendingOrders ?? 0,
    revenueCents: counts?.revenueCents ?? 0,
    popularItems,
  };
}

export async function listCustomerSummaries(db: Database) {
  return db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      createdAt: customers.createdAt,
      updatedAt: customers.updatedAt,
      orderCount: sql<number>`count(${orders.id})::int`,
      spendCents: sql<number>`coalesce(sum(case when ${orders.status} = 'completed' then ${orders.totalCents} else 0 end), 0)::int`,
    })
    .from(customers)
    .leftJoin(orders, eq(orders.customerId, customers.id))
    .groupBy(customers.id)
    .orderBy(customers.name);
}

export async function getCustomerDetail(db: Database, id: string) {
  const [summary] = await db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      createdAt: customers.createdAt,
      updatedAt: customers.updatedAt,
      orderCount: sql<number>`count(${orders.id})::int`,
      spendCents: sql<number>`coalesce(sum(case when ${orders.status} = 'completed' then ${orders.totalCents} else 0 end), 0)::int`,
    })
    .from(customers)
    .leftJoin(orders, eq(orders.customerId, customers.id))
    .where(eq(customers.id, id))
    .groupBy(customers.id)
    .limit(1);

  if (!summary) return null;

  const recentOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, id))
    .orderBy(desc(orders.createdAt))
    .limit(10);

  return { ...summary, recentOrders };
}
