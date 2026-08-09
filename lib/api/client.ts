import { API_URL } from '@/lib/config';
import { postRefresh } from './auth';

// In-memory access token — lost on hard refresh, restored via refresh-token cookie
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
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

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function request(path: string, options: RequestInit = {}): Promise<Response> {
  // Let the browser set its own multipart Content-Type (with boundary) for FormData bodies
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const method = (options.method ?? 'GET').toUpperCase();
  if (!SAFE_METHODS.has(method)) {
    const csrfToken = readCookie('csrf_token');
    if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });
}

// Shared promise — concurrent 401s all wait on the same refresh call
let refreshPromise: Promise<string | null> | null = null;

/**
 * Refreshes the access token and stores it. Deduped: concurrent callers — a
 * 401 retry and the AuthProvider's session restore — share one request.
 */
export function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = postRefresh()
    .catch(() => null)
    .then((token) => {
      accessToken = token;
      return token;
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

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    onAuthFailure?.();
    return res;
  }

  return request(path, options);
}
