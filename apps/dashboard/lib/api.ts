import { ApiError } from '@odyssey/api-client';
import { useQueryClient } from '@tanstack/react-query';

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

export function useInvalidateOps() {
  const queryClient = useQueryClient();

  const invalidatePrefix = (prefix: string) =>
    queryClient.invalidateQueries({
      predicate: (query) => typeof query.queryKey[0] === 'string' && String(query.queryKey[0]).startsWith(prefix),
    });

  return {
    menu: () => Promise.all([invalidatePrefix('/menu'), invalidatePrefix('/summary')]),
    orders: () =>
      Promise.all([invalidatePrefix('/orders'), invalidatePrefix('/customers'), invalidatePrefix('/summary')]),
    customers: () => Promise.all([invalidatePrefix('/customers'), invalidatePrefix('/orders')]),
    settings: () => Promise.all([invalidatePrefix('/settings'), invalidatePrefix('/summary')]),
    summary: () => invalidatePrefix('/summary'),
  };
}
