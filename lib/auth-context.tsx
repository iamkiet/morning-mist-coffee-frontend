'use client';

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setAccessToken, setAuthFailureHandler, refreshAccessToken } from '@/lib/api/client';
import { fetchMe, postLogin, postLogout, type User } from '@/lib/api/auth';

export type { User };

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  // Restores the session from the refresh cookie. Idempotent — the routes that
  // need a session (admin, login) call this on mount, so public pages never
  // fire an auth request. Keeping the decision here rather than sniffing
  // `window.location` means it also survives client-side navigation.
  ensureSession: () => void;
  // Returns the signed-in user so callers can branch on role without
  // waiting for a context re-render
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  // 'idle' until a route asks for a session; 'ready' once an attempt settled
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready'>('idle');
  const queryClient = useQueryClient();
  const restoreStarted = useRef(false);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    // Admin data cached under the previous identity must not leak into the next
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    setAuthFailureHandler(clearSession);
  }, [clearSession]);

  const ensureSession = useCallback(() => {
    if (restoreStarted.current) return;
    restoreStarted.current = true;
    setStatus('loading');

    // On page load the access token is gone (in-memory), so try the HttpOnly cookie
    (async () => {
      try {
        const token = await refreshAccessToken();
        setUser(token ? await fetchMe(token) : null);
      } catch {
        setUser(null);
      } finally {
        setStatus('ready');
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, user: signedIn } = await postLogin(email, password);
    setAccessToken(accessToken);
    setUser(signedIn);
    restoreStarted.current = true;
    setStatus('ready');
    return signedIn;
  }, []);

  const logout = useCallback(async () => {
    await postLogout();
    clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status !== 'ready',
        ensureSession,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
