import { API_URL } from '@/lib/config';

// In-memory access token — lost on hard refresh, restored via refresh-token cookie
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

function request(path: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });
}

// Shared promise — concurrent 401s all wait on the same refresh call
let refreshPromise: Promise<boolean> | null = null;

async function refresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  // Use plain fetch — must NOT send the expired Bearer token, only the HttpOnly refresh cookie
  refreshPromise = fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
    .then(async (r) => {
      if (!r.ok) return false;
      const data = await r.json();
      accessToken = data.accessToken ?? null;
      return true;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export type OnAuthFailure = () => void;
let onAuthFailure: OnAuthFailure | null = null;

export function setAuthFailureHandler(handler: OnAuthFailure) {
  onAuthFailure = handler;
}

export async function authFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await request(path, options);
  if (res.status !== 401) return res;

  const refreshed = await refresh();
  if (!refreshed) {
    onAuthFailure?.();
    return res;
  }

  return request(path, options);
}
