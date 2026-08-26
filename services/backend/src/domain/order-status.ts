import { orderStatusEnum } from '../db/schema';
import { HttpError } from './http-error';

export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];

export const ORDER_ACTIONS = ['accept', 'prepare', 'ready', 'complete', 'cancel'] as const;
export type OrderAction = (typeof ORDER_ACTIONS)[number];

const TRANSITIONS: Record<OrderAction, { from: readonly OrderStatus[]; to: OrderStatus }> = {
  accept: { from: ['pending'], to: 'accepted' },
  prepare: { from: ['accepted'], to: 'preparing' },
  ready: { from: ['preparing'], to: 'ready' },
  complete: { from: ['ready'], to: 'completed' },
  cancel: { from: ['pending', 'accepted', 'preparing', 'ready'], to: 'cancelled' },
};

export function availableActions(status: OrderStatus): OrderAction[] {
  return ORDER_ACTIONS.filter((action) => TRANSITIONS[action].from.includes(status));
}

/**
 * Maps a deliberate action onto the next status. Callers never write `status`
 * as a free-form field — illegal moves throw.
 */
export function nextStatus(current: OrderStatus, action: OrderAction): OrderStatus {
  const transition = TRANSITIONS[action];
  if (!transition.from.includes(current)) {
    throw new HttpError(409, {
      error: `Cannot ${action} an order that is ${current}`,
    });
  }
  return transition.to;
}
