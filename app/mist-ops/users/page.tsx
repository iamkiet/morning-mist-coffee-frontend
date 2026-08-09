'use client';

import {
  KeyRound,
  UserX,
  UserCheck,
  Pencil,
  Search,
  Users as UsersIcon,
  Zap,
  Hourglass,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../_components/PageHeader';
import { Badge } from '../_components/Badge';
import { DataTable, Pagination, type Column } from '../_components/DataTable';
import { StatCard } from '../_components/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUsers, useUpdateUser, useUpdateUserPassword } from '@/hooks/use-users';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { AdminUser, UserRole, UserStatus } from '@/lib/types';

const roleStyle: Record<UserRole, 'primary' | 'purple'> = {
  admin: 'primary',
  user: 'purple',
};

const statusStyle: Record<UserStatus, 'success' | 'neutral' | 'error'> = {
  active: 'success',
  inactive: 'neutral',
  banned: 'error',
};

const STATUS_VIETNAMESE: Record<UserStatus, string> = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
  banned: 'Bị khóa',
};

const ROLE_VIETNAMESE: Record<UserRole, string> = {
  admin: 'Quản trị viên',
  user: 'Người dùng',
};

interface UserAvatarProps {
  firstName: string;
  lastName: string;
}

function UserAvatar({ firstName, lastName }: UserAvatarProps) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  return (
    <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
      {initials}
    </div>
  );
}

interface EditUserDialogProps {
  user: AdminUser;
  onClose: () => void;
}

const userSchema = z.object({
  role: z.enum(['user', 'admin']),
  status: z.enum(['active', 'inactive', 'banned']),
});

type UserForm = z.infer<typeof userSchema>;

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'user', label: 'Người dùng' },
  { value: 'admin', label: 'Quản trị viên' },
];

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
  { value: 'banned', label: 'Bị cấm' },
];

function EditUserDialog({ user, onClose }: EditUserDialogProps) {
  const update = useUpdateUser();
  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { role: user.role, status: user.status },
  });

  function onSubmit(values: UserForm) {
    update.mutate(
      { id: user.id, payload: values },
      {
        onSuccess: () => {
          toast.success('Đã cập nhật người dùng');
          onClose();
        },
      },
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Chỉnh sửa Người dùng
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <UserAvatar firstName={user.firstName} lastName={user.lastName} />
              <div>
                <p className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {update.isError && (
              <ErrorNotice className="mb-0">
                Không thể cập nhật người dùng. Vui lòng thử lại.
              </ErrorNotice>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="uppercase tracking-wider text-xs"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                className="uppercase tracking-wider text-xs"
                disabled={update.isPending}
              >
                {update.isPending ? 'Đang lưu…' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface ResetPasswordDialogProps {
  user: AdminUser;
  onClose: () => void;
}

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .max(128)
    .regex(/[a-z]/, 'Mật khẩu cần có chữ thường')
    .regex(/[A-Z]/, 'Mật khẩu cần có chữ hoa')
    .regex(/[0-9]/, 'Mật khẩu cần có chữ số')
    .regex(/[^a-zA-Z0-9]/, 'Mật khẩu cần có ký tự đặc biệt'),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordDialog({ user, onClose }: ResetPasswordDialogProps) {
  const resetPassword = useUpdateUserPassword();
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  });

  function onSubmit(values: ResetPasswordForm) {
    resetPassword.mutate(
      { id: user.id, password: values.password },
      {
        onSuccess: () => {
          toast.success('Đã đặt lại mật khẩu');
          onClose();
        },
      },
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[24rem]">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Đặt lại Mật khẩu
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <p className="text-xs text-muted-foreground">
              {user.firstName} {user.lastName} · {user.email}
            </p>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Hoa, thường, số, ký tự đặc biệt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {resetPassword.isError && (
              <ErrorNotice className="mb-0">
                Không thể đặt lại mật khẩu. Vui lòng thử lại.
              </ErrorNotice>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="uppercase tracking-wider text-xs"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                className="uppercase tracking-wider text-xs"
                disabled={resetPassword.isPending}
              >
                {resetPassword.isPending ? 'Đang lưu…' : 'Đặt lại'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const LIMIT = 20;

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isError } = useUsers(page, LIMIT, debouncedSearch);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<AdminUser | null>(null);
  const toggleStatus = useUpdateUser();

  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: 'Chi tiết người dùng',
      render: (r) => (
        <div className="flex items-center gap-4">
          <UserAvatar firstName={r.firstName} lastName={r.lastName} />
          <div>
            <p className="text-sm font-medium">
              {r.firstName} {r.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Vai trò tài khoản',
      render: (r) => <Badge status={roleStyle[r.role]}>{ROLE_VIETNAMESE[r.role]}</Badge>,
    },
    {
      key: 'joined',
      header: 'Ngày tham gia',
      hideOnMobile: true,
      render: (r) => (
        <span className="text-muted-foreground text-sm">
          {new Date(r.createdAt).toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => <Badge status={statusStyle[r.status]}>{STATUS_VIETNAMESE[r.status]}</Badge>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      align: 'right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title="Đặt lại Mật khẩu"
            onClick={() => setResetPasswordUser(r)}
          >
            <KeyRound className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 hover:text-destructive"
            title={r.status === 'banned' ? 'Kích hoạt lại' : 'Vô hiệu hóa'}
            disabled={toggleStatus.isPending}
            onClick={() => {
              const status = r.status === 'banned' ? 'active' : 'banned';
              toggleStatus.mutate(
                { id: r.id, payload: { status } },
                {
                  onSuccess: () =>
                    toast.success(
                      status === 'banned' ? 'Đã vô hiệu hóa tài khoản' : 'Đã kích hoạt lại tài khoản',
                    ),
                },
              );
            }}
          >
            {r.status === 'banned' ? (
              <UserCheck className="size-4" />
            ) : (
              <UserX className="size-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title="Chỉnh sửa"
            onClick={() => setEditUser(r)}
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        eyebrow="Tổng quan về tất cả tài khoản đã đăng ký"
        title="Quản lý Người dùng"
        actions={
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tài khoản..."
              className="pl-10 bg-card w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                // A new query restarts paging — page 3 of the old result set is meaningless
                setPage(1);
              }}
            />
          </div>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Tổng thành viên"
          value={isLoading ? '—' : String(total)}
          icon={UsersIcon}
          tone="primary"
        />
        <StatCard
          label="Quản trị viên"
          value={isLoading ? '—' : String(users.filter((u) => u.role === 'admin').length)}
          delta="Trên trang này"
          icon={Zap}
          tone="secondary"
        />
        <StatCard
          label="Bị khóa"
          value={isLoading ? '—' : String(users.filter((u) => u.status === 'banned').length)}
          delta="Trên trang này"
          icon={Hourglass}
          tone="tertiary"
        />
      </section>

      {isError && (
        <ErrorNotice>Không thể tải danh sách người dùng. Vui lòng thử lại.</ErrorNotice>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={users}
          footer={
            <Pagination
              showing={
                total === 0
                  ? 'Không tìm thấy người dùng nào'
                  : `Hiển thị ${offset + 1}–${Math.min(offset + users.length, total)} trên ${total}`
              }
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          }
        />
      )}

      {editUser && (
        <EditUserDialog user={editUser} onClose={() => setEditUser(null)} />
      )}

      {resetPasswordUser && (
        <ResetPasswordDialog
          user={resetPasswordUser}
          onClose={() => setResetPasswordUser(null)}
        />
      )}
    </div>
  );
}
