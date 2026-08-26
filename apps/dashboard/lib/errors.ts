import { ApiError } from '@odyssey/api-client';

export function errorMessage(error: unknown, fallback = 'Request failed') {
  if (error instanceof ApiError && error.body && typeof error.body === 'object' && 'error' in error.body) {
    const body = error.body as { error: unknown };
    if (typeof body.error === 'string' && body.error.length > 0) return body.error;
  }
  if (error && typeof error === 'object' && 'error' in error && typeof error.error === 'string') {
    return error.error;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
