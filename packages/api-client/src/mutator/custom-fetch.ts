const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';

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
 * This is the single place where base URL, headers, and error
 * normalization are handled for the whole app.
 *
 * Returns the `{ data, status, headers }` shape that Orval-generated
 * response types expect from a custom fetch mutator.
 */
export async function customFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return { data, status: response.status, headers: response.headers } as T;
}
