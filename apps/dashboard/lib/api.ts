import { useQueryClient } from '@tanstack/react-query';

export { errorMessage } from './errors';

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
