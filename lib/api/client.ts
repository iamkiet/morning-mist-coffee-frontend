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

export interface ListQueryOptions {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  filters?: Record<string, string | number | undefined>;
}

export function listQuery(
  limit: number,
  offset: number,
  q = '',
  opts: ListQueryOptions = {},
): string {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (q) params.set('q', q);
  if (opts.sortBy) params.set('sortBy', opts.sortBy);
  if (opts.sortDir) params.set('sortDir', opts.sortDir);
  for (const [key, value] of Object.entries(opts.filters ?? {})) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
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

function refreshSession(): Promise<boolean> {
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

// The backend's CSRF middleware always throws this exact message — every other
// 403 (wrong registration key, role checks, ...) uses a different message, so
// checking it keeps the /me resync from firing on unrelated 403s.
const CSRF_FAILURE_MESSAGE = 'Invalid or missing CSRF token';

async function isCsrfFailure(res: Response): Promise<boolean> {
  try {
    const data = await res.clone().json();
    return data?.message === CSRF_FAILURE_MESSAGE;
  } catch {
    return false;
  }
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

  if (res.status === 403 && (await isCsrfFailure(res))) {
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
