const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/${path.replace(/^\//, '')}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const apiClient = {
  get: <T>(path: string, options?: FetchOptions) => apiFetch<T>(path, { method: 'GET', ...options }),
  post: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body), ...options }),
};
