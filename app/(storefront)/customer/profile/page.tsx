'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, LogOut } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { Container } from '@/app/_components/Container';
import { useAuth } from '@/lib/auth-context';
import { useMyAccount, useUpdateMyAccount } from '@/hooks/use-customers';
import { toast } from 'sonner';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Họ là bắt buộc'),
  lastName: z.string().min(1, 'Tên là bắt buộc'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function CustomerProfilePage() {
  const { user, isLoading: authLoading, ensureSession, logout } = useAuth();
  const router = useRouter();
  const isCustomer = user?.role === 'customer';
  const { data: account, isLoading, isError } = useMyAccount(isCustomer);
  const update = useUpdateMyAccount();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: account
      ? {
          firstName: account.firstName,
          lastName: account.lastName,
          phone: account.phone ?? '',
          address: account.address ?? '',
        }
      : undefined,
  });

  useEffect(() => {
    ensureSession();
  }, [ensureSession]);

  useEffect(() => {
    if (authLoading || isCustomer) return;
    // A staff/admin session (or no session) landed here — clear any leftover
    // cookies before bouncing to /customer/login.
    if (user) {
      logout().then(() => router.replace('/customer/login'));
    } else {
      router.replace('/customer/login');
    }
  }, [authLoading, isCustomer, user, logout, router]);

  function onSubmit(values: ProfileForm) {
    update.mutate(values, {
      onSuccess: () => toast.success('Đã cập nhật thông tin'),
    });
  }

  if (authLoading || !isCustomer) {
    return (
      <Container navOffset size="narrow" className="pb-20">
        <p className="text-center text-muted-foreground">Đang tải...</p>
      </Container>
    );
  }

  return (
    <Container navOffset size="narrow" className="pb-20">
      <div className="max-w-[480px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light text-foreground">Tài Khoản Của Tôi</h1>
          <Button
            variant="outline"
            size="sm"
            className="uppercase tracking-wider text-xs gap-2"
            onClick={logout}
          >
            <LogOut className="size-3.5" />
            Đăng xuất
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isError || !account ? (
          <ErrorNotice>Không thể tải thông tin tài khoản.</ErrorNotice>
        ) : (
          <>
            <div className="bg-accent/20 p-4 rounded-xl flex items-center gap-3">
              <Star className="size-5 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                Điểm thân thiết: <span className="font-medium">{account.loyaltyPoints}</span>
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    {account.email}
                  </p>
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {update.isError && (
                    <ErrorNotice className="mb-0">
                      Không thể cập nhật thông tin. Vui lòng thử lại.
                    </ErrorNotice>
                  )}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full uppercase tracking-wider text-xs"
                    disabled={update.isPending}
                  >
                    {update.isPending ? 'Đang lưu…' : 'Lưu Thay Đổi'}
                  </Button>
                </form>
              </Form>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
