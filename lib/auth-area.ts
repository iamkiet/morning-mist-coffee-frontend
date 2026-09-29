export const AUTH_AREA_ADMIN = 'admin';
export const AUTH_AREA_STORE = 'store';
export type AuthArea = typeof AUTH_AREA_ADMIN | typeof AUTH_AREA_STORE;

const AUTH_AREA_ADMIN_PAGES = ['/mist-ops', '/login'];

export function authAreaForPath(pathname: string): AuthArea {
  const isAdminPage = AUTH_AREA_ADMIN_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );
  return isAdminPage ? AUTH_AREA_ADMIN : AUTH_AREA_STORE;
}

export function currentAuthArea(): AuthArea {
  if (typeof window === 'undefined') return AUTH_AREA_STORE;
  return authAreaForPath(window.location.pathname);
}

export function areaApiPath(path: string): string {
  return path.replace(/^\/api\/v1\//, `/api/v1/${currentAuthArea()}/`);
}
