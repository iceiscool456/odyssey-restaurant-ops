import { describe, expect, it } from 'vitest';
import { statusTone } from './status';

describe('status tones', () => {
  it('covers every order status used by the backend enum', () => {
    expect(Object.keys(statusTone)).toEqual(
      expect.arrayContaining(['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled']),
    );
  });
});
