import { OrderStatus } from '@odyssey/api-client';
import { describe, expect, it } from 'vitest';
import { orderBadgeTone } from './order-badge';
import { asOpeningHours, weekdayLabel, WEEKDAYS } from './opening-hours';
import { isEnvelope } from './result';

describe('envelope unwrap', () => {
  it('narrows generated success envelopes by status', () => {
    const ok = { status: 200 as const, data: ['ok'] };
    const err = { status: 409 as const, data: { error: 'no' } };
    expect(isEnvelope(ok, 200) ? ok.data : undefined).toEqual(['ok']);
    expect(isEnvelope(err, 200)).toBe(false);
    expect(isEnvelope(undefined, 200)).toBe(false);
  });
});

describe('opening hours', () => {
  it('labels weekdays from the generated OpeningHours keys', () => {
    expect(WEEKDAYS).toHaveLength(7);
    expect(weekdayLabel('monday')).toBe('Monday');
  });

  it('nulls a closed day without dropping the generated shape', () => {
    const hours = asOpeningHours({ monday: { open: '10:00', close: '16:00' }, tuesday: null });
    expect(hours.monday).toEqual({ open: '10:00', close: '16:00' });
    expect(hours.tuesday).toBeNull();
  });
});

describe('order badge tones', () => {
  it('covers every generated OrderStatus', () => {
    expect(Object.keys(orderBadgeTone).sort()).toEqual(Object.values(OrderStatus).slice().sort());
  });
});
