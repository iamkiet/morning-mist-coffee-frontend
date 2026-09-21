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
import {
  postEmployeeLogin,
  postCustomerLogin,
  postLogout,
  type User,
} from '@/lib/api/auth';
import { ACCOUNT_TYPE, type AccountType } from '@/lib/types';

export type { User };

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  // Restores the session from the refresh cookie. Idempotent — AuthProvider
  // itself calls this once on mount for every page. Exposed so a route can
  // still call it explicitly (e.g. right after a redirect) without waiting
  // on a re-render.
  ensureSession: () => void;
  // Returns the signed-in user so callers can branch on role without
  // waiting for a context re-render. `accountType` selects which table/endpoint
  // to authenticate against — employees and customers are verified separately.
  login: (email: string, password: string, accountType: AccountType) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  // 'idle' until the mount-time ensureSession() call below starts; 'ready' once it settles
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

  // Runs once on mount for every page, not just auth-gated ones, so the
  // signed-in state (e.g. the account icon in Nav) is correct even on a
  // hard reload of a public page — the access-token cookie can't be read
  // by JS to decide this locally, so a single /me check on load is the
  // only way to know.
  useEffect(() => {
    ensureSession();
  }, [ensureSession]);

  const login = useCallback(
    async (email: string, password: string, accountType: AccountType) => {
      const postLogin =
        accountType === ACCOUNT_TYPE.EMPLOYEE ? postEmployeeLogin : postCustomerLogin;
      const { csrfToken, user: signedIn } = await postLogin(email, password);
      setCsrfToken(csrfToken);
      setUser(signedIn);
      restoreStarted.current = true;
      setStatus('ready');
      return signedIn;
    },
    [],
  );

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
