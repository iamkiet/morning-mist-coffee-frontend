'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

// Only this tab writes 'remembered_email', and it rereads it on submit —
// nothing to subscribe to, so the store never notifies
function subscribeToRememberedEmail() {
  return () => {};
}

export default function LoginPage() {
  // The remembered email lives in localStorage, so it is read as an external
  // store rather than copied into state from an effect. `null` means the user
  // has not touched the field yet, so the stored value still applies.
  const rememberedEmail = useSyncExternalStore(
    subscribeToRememberedEmail,
    () => localStorage.getItem('remembered_email') ?? '',
    () => '',
  );
  const [emailInput, setEmail] = useState<string | null>(null);
  const [rememberInput, setRememberMe] = useState<boolean | null>(null);
  const email = emailInput ?? rememberedEmail;
  const rememberMe = rememberInput ?? rememberedEmail !== '';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, user, isLoading: authLoading, ensureSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    ensureSession();
  }, [ensureSession]);

  // Already signed in as admin (session restored via refresh cookie) — skip the form
  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      router.replace('/mist-ops');
    }
  }, [user, authLoading, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      const signedIn = await login(email, password);
      // Reject non-admins here rather than in an effect — letting them reach
      // the admin layout bounces them straight back and loops
      if (signedIn.role !== 'admin') {
        await logout();
        setError('Tài khoản này không có quyền truy cập quản trị viên.');
        return;
      }
      router.replace('/mist-ops');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Email hoặc mật khẩu không hợp lệ',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-[420px] bg-card border border-border rounded-2xl p-8 sm:p-10 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-light text-foreground mb-2">Đăng Nhập</h1>
          <p className="text-sm text-muted-foreground">Yêu cầu quyền truy cập Quản trị</p>
        </div>

        {error && (
          <div className="p-3 bg-muted border border-border rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ten@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs uppercase tracking-widest text-muted-foreground">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground text-sm"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 accent-foreground cursor-pointer"
            />
            <span className="text-xs text-muted-foreground">
              Ghi nhớ email của tôi
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-foreground text-background uppercase tracking-widest text-xs font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    </main>
  );
}
