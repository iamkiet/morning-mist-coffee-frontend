'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { useAuth } from '@/lib/auth-context';

const REMEMBERED_EMAIL_KEY = 'remembered_email';

// Only this tab writes the remembered email and it rereads it on submit —
// nothing to subscribe to, so the store never notifies
function subscribeToRememberedEmail() {
  return () => {};
}

const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  // The remembered email lives in localStorage, so it is read as an external
  // store rather than copied into state from an effect.
  const rememberedEmail = useSyncExternalStore(
    subscribeToRememberedEmail,
    () => localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? '',
    () => '',
  );
  const [rememberInput, setRememberMe] = useState<boolean | null>(null);
  const rememberMe = rememberInput ?? rememberedEmail !== '';

  const [error, setError] = useState('');
  const { login, logout, user, isLoading: authLoading, ensureSession } = useAuth();
  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    values: { email: rememberedEmail, password: '' },
    resetOptions: { keepDirtyValues: true },
  });

  useEffect(() => {
    ensureSession();
  }, [ensureSession]);

  // Already signed in as admin (session restored via refresh cookie) — skip the form
  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      router.replace('/mist-ops');
    }
  }, [user, authLoading, router]);

  async function onSubmit(values: LoginForm) {
    setError('');
    try {
      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
      const signedIn = await login(values.email, values.password);
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
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-[420px] bg-card border border-border rounded-xl p-8 sm:p-10 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-light text-foreground mb-2">Đăng Nhập</h1>
          <p className="text-sm text-muted-foreground">
            Yêu cầu quyền truy cập Quản trị
          </p>
        </div>

        {error && <ErrorNotice className="mb-0">{error}</ErrorNotice>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="ten@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Label className="flex items-center gap-2 cursor-pointer select-none font-normal">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 accent-foreground cursor-pointer"
              />
              <span className="text-xs text-muted-foreground normal-case tracking-normal">
                Ghi nhớ email của tôi
              </span>
            </Label>

            <Button
              type="submit"
              size="lg"
              className="w-full uppercase tracking-wider text-xs"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>
          </form>
        </Form>

        <div className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    </main>
  );
}
