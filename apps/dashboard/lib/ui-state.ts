export type QuerySurface = 'loading' | 'error' | 'empty' | 'ready';

export function querySurface(input: { isLoading: boolean; error: unknown; isEmpty?: boolean }): QuerySurface {
  if (input.isLoading) return 'loading';
  if (input.error) return 'error';
  if (input.isEmpty) return 'empty';
  return 'ready';
}
