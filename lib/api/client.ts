const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function request(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
}

// Shared promise so concurrent 401s don't each trigger their own refresh
let refreshPromise: Promise<boolean> | null = null;

async function refresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = request("/api/v1/auth/refresh", { method: "POST", body: JSON.stringify({}) })
    .then((r) => r.ok)
    .finally(() => { refreshPromise = null; });
  return refreshPromise;
}

export type OnAuthFailure = () => void;
let onAuthFailure: OnAuthFailure | null = null;

export function setAuthFailureHandler(handler: OnAuthFailure) {
  onAuthFailure = handler;
}

export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const res = await request(path, options);
  if (res.status !== 401) return res;

  const refreshed = await refresh();
  if (!refreshed) {
    onAuthFailure?.();
    return res;
  }

  return request(path, options);
}
