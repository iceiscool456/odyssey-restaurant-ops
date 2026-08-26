const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API error ${status}`);
    this.name = 'ApiError';
  }
}

/**
 * Fetch wrapper used by all Orval-generated endpoints.
 * Returns the `{ data, status, headers }` shape that Orval-generated
 * response types expect from a custom fetch mutator.
 */
export async function customFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const method = (init?.method ?? 'GET').toUpperCase();
  const hasBody = init?.body !== undefined && init.body !== null && method !== 'GET' && method !== 'HEAD';

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...init,
    headers,
  });

  const contentType = response.headers.get('content-type') ?? '';
  let data: unknown = null;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text.length > 0 ? text : null;
  }

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return { data, status: response.status, headers: response.headers } as T;
}
