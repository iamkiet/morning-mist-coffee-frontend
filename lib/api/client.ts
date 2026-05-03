const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
