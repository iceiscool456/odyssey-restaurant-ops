import { OrderStatus, type OrderStatusProperty } from '@odyssey/api-client';
import { type StatusTone } from '@odyssey/shared';

/** Generated order status → design-system badge tone. A new Drizzle status fails this Record. */
export const orderBadgeTone = {
  pending: 'pending',
  accepted: 'accepted',
  preparing: 'preparing',
  ready: 'ready',
  completed: 'completed',
  cancelled: 'cancelled',
} as const satisfies Record<OrderStatus, StatusTone> & Record<OrderStatusProperty, StatusTone>;
