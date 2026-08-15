import { API_URL } from '@/lib/config';
import type { User } from '@/lib/types';
import { postRefresh } from './auth';

// In-memory CSRF token — lost on hard refresh, restored via the httpOnly
// refresh-token cookie (access/refresh tokens live entirely in httpOnly
// cookies now; this is the one value the browser client needs to hold,
// since it must echo it back as a header on mutating requests).
let csrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

/** Shared querystring for the paginated list endpoints (products, users, orders). */
export function listQuery(limit: number, offset: number, q: string): string {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (q) params.set('q', q);
  return params.toString();
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function request(path: string, options: RequestInit = {}): Promise<Response> {
  // Let the browser set its own multipart Content-Type (with boundary) for FormData bodies
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  const method = (options.method ?? 'GET').toUpperCase();
  if (!SAFE_METHODS.has(method) && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });
}

// Shared promise — concurrent 401s all wait on the same refresh call
let refreshPromise: Promise<boolean> | null = null;

/**
 * Rotates the httpOnly access/refresh cookies via the backend and refreshes
 * the in-memory CSRF token. Deduped: concurrent callers — a 401 retry and
 * the AuthProvider's session restore — share one request.
 */
export function refreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = postRefresh()
    .catch(() => null)
    .then((token) => {
      csrfToken = token;
      return token !== null;
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

  const refreshed = await refreshSession();
  if (!refreshed) {
    onAuthFailure?.();
    return res;
  }

  return request(path, options);
}

export async function fetchMe(): Promise<User | null> {
  const res = await authFetch('/api/v1/auth/me');
  return res.ok ? res.json() : null;
}
