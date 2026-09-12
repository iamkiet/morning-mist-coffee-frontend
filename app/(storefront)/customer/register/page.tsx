'use client';

import { useState } from 'react';
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
import { createCustomer } from '@/lib/api/customers';
import { ACCOUNT_TYPE } from '@/lib/types';

const registerSchema = z.object({
  firstName: z.string().min(1, 'Họ là bắt buộc'),
  lastName: z.string().min(1, 'Tên là bắt buộc'),
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .max(128)
    .regex(/[a-z]/, 'Mật khẩu cần có chữ thường')
    .regex(/[A-Z]/, 'Mật khẩu cần có chữ hoa')
    .regex(/[0-9]/, 'Mật khẩu cần có chữ số')
    .regex(/[^a-zA-Z0-9]/, 'Mật khẩu cần có ký tự đặc biệt'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function CustomerRegisterPage() {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  });

  async function onSubmit(values: RegisterForm) {
    setError('');
    try {
      await createCustomer(values);
      await login(values.email, values.password, ACCOUNT_TYPE.CUSTOMER);
      router.replace('/customer/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    }
  }

  return (
    <Container navOffset size="narrow" className="pb-20">
      <div className="max-w-[420px] mx-auto bg-card border border-border rounded-xl p-8 sm:p-10 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-light text-foreground mb-2">Đăng Ký</h1>
          <p className="text-sm text-muted-foreground">
            Tạo tài khoản để theo dõi đơn hàng và tích điểm
          </p>
        </div>

        {error && <ErrorNotice className="mb-0">{error}</ErrorNotice>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                    <Input type="password" placeholder="Hoa, thường, số, ký tự đặc biệt" {...field} />
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
              {form.formState.isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký'}
            </Button>
          </form>
        </Form>

        <div className="text-center text-xs text-muted-foreground">
          Đã có tài khoản?{' '}
          <Link href="/customer/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </Container>
  );
}
