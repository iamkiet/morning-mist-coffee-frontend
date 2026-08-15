import { API_URL } from '@/lib/config';
import type { User } from '@/lib/types';
import { postRefresh } from './auth';

const CSRF_STORAGE_KEY = 'morning-mist-csrf-token';

function getCsrfToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CSRF_STORAGE_KEY);
}

export function setCsrfToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(CSRF_STORAGE_KEY, token);
  else localStorage.removeItem(CSRF_STORAGE_KEY);
}

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
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(!isFormData && options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>),
  };

  const method = (options.method ?? 'GET').toUpperCase();
  if (!SAFE_METHODS.has(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });
}

let refreshPromise: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = postRefresh()
    .catch(() => null)
    .then((token) => {
      setCsrfToken(token);
      return token !== null;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

async function resyncCsrfToken(): Promise<boolean> {
  const res = await request('/api/v1/auth/me');
  if (!res.ok) return false;
  const data = await res.json();
  setCsrfToken(data.csrfToken ?? null);
  return Boolean(data.csrfToken);
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
  let res = await request(path, options);

  if (res.status === 401) {
    const refreshed = await refreshSession();
    if (!refreshed) {
      onAuthFailure?.();
      return res;
    }
    res = await request(path, options);
  }

  if (res.status === 403) {
    const resynced = await resyncCsrfToken();
    if (resynced) res = await request(path, options);
  }

  return res;
}

export async function fetchMe(): Promise<User | null> {
  const res = await authFetch('/api/v1/auth/me');
  if (!res.ok) return null;
  const data = await res.json();
  setCsrfToken(data.csrfToken ?? null);
  return data.user ?? null;
}
