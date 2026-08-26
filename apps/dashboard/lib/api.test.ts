import { ApiError } from '@odyssey/api-client';
import { describe, expect, it } from 'vitest';
import { errorMessage } from './errors';
import { querySurface } from './ui-state';

describe('errorMessage', () => {
  it('reads the contract error body from ApiError', () => {
    expect(errorMessage(new ApiError(409, { error: 'Whole Branzino is unavailable' }))).toBe(
      'Whole Branzino is unavailable',
    );
  });

  it('falls back when the payload is unstructured', () => {
    expect(errorMessage(new Error('network down'), 'Could not reach the pass')).toBe('network down');
    expect(errorMessage(null, 'Could not reach the pass')).toBe('Could not reach the pass');
  });
});

describe('query surfaces', () => {
  it('prefers loading, then error, then empty, then ready', () => {
    expect(querySurface({ isLoading: true, error: new Error('x'), isEmpty: true })).toBe('loading');
    expect(querySurface({ isLoading: false, error: new Error('x'), isEmpty: true })).toBe('error');
    expect(querySurface({ isLoading: false, error: null, isEmpty: true })).toBe('empty');
    expect(querySurface({ isLoading: false, error: null, isEmpty: false })).toBe('ready');
  });
});
