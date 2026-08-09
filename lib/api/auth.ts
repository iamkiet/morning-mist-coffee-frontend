import { API_URL } from '@/lib/config';
import type { User } from '@/lib/types';

export type { User };

export interface LoginResult {
  accessToken: string;
  user: User;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// These use plain `fetch` rather than `authFetch` on purpose: they either run
// before a token exists or must not send an expired one. `authFetch` also
// refreshes on 401, which would recurse through `postRefresh`.
function post(path: string, body: unknown = {}): Promise<Response> {
  const csrfToken = readCookie('csrf_token');
  return fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    body: JSON.stringify(body),
  });
}

/** Exchanges the HttpOnly refresh cookie for a new access token. */
export async function postRefresh(): Promise<string | null> {
  const res = await post('/api/v1/auth/refresh');
  if (!res.ok) return null;
  const data = await res.json();
  return data.accessToken ?? null;
}

export async function postLogin(
  email: string,
  password: string,
): Promise<LoginResult> {
  const res = await post('/api/v1/auth/login', { email, password });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? 'Invalid email or password',
    );
  }
  return res.json();
}

export async function postLogout(): Promise<void> {
  await post('/api/v1/auth/logout').catch(() => {});
}

export async function fetchMe(accessToken: string): Promise<User | null> {
  const res = await fetch(`${API_URL}/api/v1/auth/me`, {
    credentials: 'include',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.ok ? res.json() : null;
}
