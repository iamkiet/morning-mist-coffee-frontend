'use client';

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { API_URL } from '@/lib/config';
import { setAccessToken, setAuthFailureHandler } from '@/lib/api/client';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setAuthFailureHandler(clearSession);
  }, [clearSession]);

  // On page load: access token is gone (in-memory), so try refresh via HttpOnly cookie
  useEffect(() => {
    async function loadUser() {
      try {
        const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        if (!refreshRes.ok) {
          setUser(null);
          return;
        }

        const { accessToken } = await refreshRes.json();
        setAccessToken(accessToken);

        const meRes = await fetch(`${API_URL}/api/v1/auth/me`, {
          credentials: 'include',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(meRes.ok ? await meRes.json() : null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? 'Invalid email or password');
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function logout() {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => {});
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
