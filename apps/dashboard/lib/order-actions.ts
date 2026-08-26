import { type OrderAction } from '@odyssey/api-client';

export const ORDER_ACTION_UI: Record<OrderAction, { label: string; variant: 'primary' | 'danger' }> = {
  accept: { label: 'Accept', variant: 'primary' },
  prepare: { label: 'Start prep', variant: 'primary' },
  ready: { label: 'Mark ready', variant: 'primary' },
  complete: { label: 'Complete', variant: 'primary' },
  cancel: { label: 'Cancel', variant: 'danger' },
};

/** Maps API-provided legal actions onto the buttons the ticket drawer may show. */
export function ticketActionButtons(available: readonly OrderAction[]) {
  return available.map((action) => ({ action, ...ORDER_ACTION_UI[action] }));
}

export function ticketIsClosed(available: readonly OrderAction[]) {
  return available.length === 0;
}
