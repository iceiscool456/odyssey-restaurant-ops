// Shared hand-authored domain types live here.
// API request/response types are NOT defined here — they come from
// @odyssey/api-client (generated from the backend OpenAPI spec).

/** Query / async surfaces used by dashboard screens. */
export type QuerySurface = 'loading' | 'error' | 'empty' | 'ready';

/** Utility type for values that may not have loaded yet. */
export type Loadable<T> =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: T };
