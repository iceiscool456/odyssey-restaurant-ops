import { and, desc, eq, inArray } from 'drizzle-orm';
import type { Database } from '../db/client';
import { menuItems, orderItems, orders } from '../db/schema';
import { HttpError } from './http-error';
import { lineTotalCents, orderTotals } from './money';
import { availableActions, nextStatus, type OrderAction, type OrderStatus } from './order-status';
import { requireCustomer } from './customers';
import { getSettings } from './settings';

export async function getOrderDetail(db: Database, id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) throw new HttpError(404, { error: 'Order not found' });

  const customer = await requireCustomer(db, order.customerId);
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  return {
    ...order,
    customer,
    items,
    availableActions: availableActions(order.status),
  };
}

export async function listOrders(
  db: Database,
  filters: { status?: OrderStatus; customerId?: string },
) {
  const clauses = [
    filters.status ? eq(orders.status, filters.status) : undefined,
    filters.customerId ? eq(orders.customerId, filters.customerId) : undefined,
  ].filter((clause) => clause !== undefined);

  return db
    .select()
    .from(orders)
    .where(clauses.length > 0 ? and(...clauses) : undefined)
    .orderBy(desc(orders.createdAt));
}

export async function createOrder(
  db: Database,
  input: {
    customerId: string;
    notes?: string;
    items: { menuItemId: string; quantity: number }[];
  },
) {
  const settings = await getSettings(db);
  if (!settings.serviceAvailable) {
    throw new HttpError(409, { error: 'Service is not currently available' });
  }

  await requireCustomer(db, input.customerId);

  const menuItemIds = [...new Set(input.items.map((item) => item.menuItemId))];
  const catalog = await db.select().from(menuItems).where(inArray(menuItems.id, menuItemIds));
  const byId = new Map(catalog.map((item) => [item.id, item]));

  const lines = input.items.map((line) => {
    const item = byId.get(line.menuItemId);
    if (!item) {
      throw new HttpError(400, { error: `Unknown menu item ${line.menuItemId}` });
    }
    if (!item.isAvailable) {
      throw new HttpError(409, { error: `${item.name} is unavailable` });
    }
    return {
      menuItemId: item.id,
      nameSnapshot: item.name,
      unitPriceCents: item.priceCents,
      quantity: line.quantity,
      lineTotalCents: lineTotalCents(item.priceCents, line.quantity),
    };
  });

  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);
  const totals = orderTotals(subtotalCents);
  const status: OrderStatus = settings.autoAccept ? 'accepted' : 'pending';

  const created = await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        customerId: input.customerId,
        status,
        notes: input.notes,
        ...totals,
      })
      .returning();

    if (!order) throw new HttpError(400, { error: 'Failed to create order' });

    await tx.insert(orderItems).values(lines.map((line) => ({ ...line, orderId: order.id })));
    return order;
  });

  return getOrderDetail(db, created.id);
}

export async function applyOrderAction(db: Database, id: string, action: OrderAction) {
  await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!order) throw new HttpError(404, { error: 'Order not found' });

    const status = nextStatus(order.status, action);
    await tx.update(orders).set({ status }).where(eq(orders.id, id));
  });

  return getOrderDetail(db, id);
}
