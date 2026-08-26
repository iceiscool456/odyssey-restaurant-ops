import { OrderAction } from '@odyssey/api-client';
import { describe, expect, it } from 'vitest';
import { ticketActionButtons, ticketIsClosed } from './order-actions';

describe('ticket action visibility', () => {
  it('shows accept and cancel on a pending ticket, never complete', () => {
    const buttons = ticketActionButtons([OrderAction.accept, OrderAction.cancel]);
    expect(buttons.map((button) => button.action)).toEqual(['accept', 'cancel']);
    expect(buttons.map((button) => button.label)).toEqual(['Accept', 'Cancel']);
    expect(buttons.find((button) => button.action === 'cancel')?.variant).toBe('danger');
    expect(buttons.some((button) => button.action === OrderAction.complete)).toBe(false);
  });

  it('shows prepare after accept, still not complete', () => {
    const buttons = ticketActionButtons([OrderAction.prepare, OrderAction.cancel]);
    expect(buttons.map((button) => button.action)).toEqual(['prepare', 'cancel']);
    expect(buttons.some((button) => button.action === OrderAction.accept)).toBe(false);
    expect(buttons.some((button) => button.action === OrderAction.complete)).toBe(false);
  });

  it('shows complete only when the API says the ticket is ready', () => {
    const buttons = ticketActionButtons([OrderAction.complete, OrderAction.cancel]);
    expect(buttons.map((button) => button.action)).toEqual(['complete', 'cancel']);
  });

  it('hides every action on a closed ticket', () => {
    expect(ticketActionButtons([])).toEqual([]);
    expect(ticketIsClosed([])).toBe(true);
    expect(ticketIsClosed([OrderAction.accept, OrderAction.cancel])).toBe(false);
  });
});
