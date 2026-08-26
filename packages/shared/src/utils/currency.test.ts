import { describe, expect, it } from 'vitest';
import { centsToDollarInput, parseDollarsToCents } from './currency';

describe('parseDollarsToCents', () => {
  it('parses whole dollars and fractional dollars into integer cents', () => {
    expect(parseDollarsToCents('32')).toBe(3200);
    expect(parseDollarsToCents('32.5')).toBe(3250);
    expect(parseDollarsToCents('32.50')).toBe(3250);
  });

  it('rejects empty or malformed amounts', () => {
    expect(parseDollarsToCents('')).toBeNull();
    expect(parseDollarsToCents('12.345')).toBeNull();
    expect(parseDollarsToCents('-4')).toBeNull();
    expect(parseDollarsToCents('abc')).toBeNull();
  });
});

describe('centsToDollarInput', () => {
  it('formats cents for an editable dollars field', () => {
    expect(centsToDollarInput(3600)).toBe('36.00');
  });
});
