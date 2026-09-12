'use client';

import { useEffect, useState } from 'react';
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
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { Container } from '@/app/_components/Container';
import { useAuth } from '@/lib/auth-context';
import { ACCOUNT_TYPE } from '@/lib/types';

const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function CustomerLoginPage() {
  const [error, setError] = useState('');
  const { login, logout, user, isLoading: authLoading, ensureSession } = useAuth();
  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    ensureSession();
  }, [ensureSession]);

  useEffect(() => {
    if (authLoading || !user) return;
    if (user.role === 'customer') {
      router.replace('/customer/profile');
      return;
    }
    // A staff/admin session landed on the customer login page — clear it so
    // the two areas never mix sessions/cookies.
    logout();
  }, [user, authLoading, logout, router]);

  async function onSubmit(values: LoginForm) {
    setError('');
    try {
      // /customer-login only ever authenticates against the customers table,
      // so a staff/admin account can never sign in here.
      await login(values.email, values.password, ACCOUNT_TYPE.CUSTOMER);
      router.replace('/customer/profile');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Email hoặc mật khẩu không hợp lệ',
      );
    }
  }

  return (
    <Container navOffset size="narrow" className="pb-20">
      <div className="max-w-[420px] mx-auto bg-card border border-border rounded-xl p-8 sm:p-10 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-light text-foreground mb-2">Đăng Nhập</h1>
          <p className="text-sm text-muted-foreground">
            Đăng nhập để xem đơn hàng và điểm thân thiết
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
                    <Input type="email" autoComplete="email" placeholder="ten@email.com" {...field} />
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
                    <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          Chưa có tài khoản?{' '}
          <Link href="/customer/register" className="text-primary hover:underline">
            Đăng ký
          </Link>
        </div>
      </div>
    </Container>
  );
}
