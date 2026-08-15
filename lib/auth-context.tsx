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
import { setCsrfToken, setAuthFailureHandler, fetchMe } from '@/lib/api/client';
import { postLogin, postLogout, type User } from '@/lib/api/auth';

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
    setCsrfToken(null);
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

    // The access token lives in an httpOnly cookie now, so it survives a
    // reload — fetchMe() (via authFetch) transparently refreshes on 401 if
    // it turns out to be expired, so a single call covers both cases.
    (async () => {
      try {
        setUser(await fetchMe());
      } catch {
        setUser(null);
      } finally {
        setStatus('ready');
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { csrfToken, user: signedIn } = await postLogin(email, password);
    setCsrfToken(csrfToken);
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
