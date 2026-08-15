import { API_URL } from '@/lib/config';
import type { User } from '@/lib/types';

export type { User };

export interface LoginResult {
  user: User;
  csrfToken: string;
}

// `/api/v1/auth/*` is CSRF-exempt server-side, so these plain `fetch` calls
// don't need to attach X-CSRF-Token. They avoid `authFetch` on purpose: they
// either run before a session exists or must not trigger its 401→refresh
// retry (which would recurse through `postRefresh`).
function post(path: string, body: unknown = {}): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** Rotates the httpOnly refresh cookie server-side; returns the new CSRF token. */
export async function postRefresh(): Promise<string | null> {
  const res = await post('/api/v1/auth/refresh');
  if (!res.ok) return null;
  const data = await res.json();
  return data.csrfToken ?? null;
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
