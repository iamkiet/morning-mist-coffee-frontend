'use client';

import {
  KeyRound,
  UserX,
  UserCheck,
  Pencil,
  Search,
  Users as UsersIcon,
  Star,
  Hourglass,
  Plus,
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
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useUpdateCustomerPassword,
} from '@/hooks/use-customers';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { AdminCustomer, UserStatus } from '@/lib/types';
import { passwordSchema, registrationKeySchema } from '@/lib/validation';
import { getInitials } from '@/lib/utils';

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

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
  { value: 'banned', label: 'Bị khóa' },
];

interface UserAvatarProps {
  firstName: string;
  lastName: string;
}

function UserAvatar({ firstName, lastName }: UserAvatarProps) {
  const initials = getInitials(firstName, lastName);
  return (
    <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
      {initials}
    </div>
  );
}

const createCustomerSchema = z.object({
  firstName: z.string().min(1, 'Họ là bắt buộc'),
  lastName: z.string().min(1, 'Tên là bắt buộc'),
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  phone: z.string().optional(),
  address: z.string().optional(),
  password: passwordSchema,
  registrationKey: registrationKeySchema,
});

type CreateCustomerForm = z.infer<typeof createCustomerSchema>;

function CreateCustomerDialog({ onClose }: { onClose: () => void }) {
  const create = useCreateCustomer();
  const form = useForm<CreateCustomerForm>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      registrationKey: '',
    },
  });

  function onSubmit(values: CreateCustomerForm) {
    create.mutate(values, {
      onSuccess: () => {
        toast.success('Đã tạo khách hàng mới');
        onClose();
      },
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Tạo Khách Hàng Mới
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="registrationKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã đăng ký</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {create.isError && (
              <ErrorNotice className="mb-0">
                {create.error instanceof Error
                  ? create.error.message
                  : 'Không thể tạo khách hàng. Vui lòng thử lại.'}
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
                disabled={create.isPending}
              >
                {create.isPending ? 'Đang tạo…' : 'Tạo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface EditCustomerDialogProps {
  customer: AdminCustomer;
  onClose: () => void;
}

const customerSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  loyaltyPoints: z
    .string()
    .min(1, 'Điểm thân thiết là bắt buộc')
    .regex(/^\d+$/, 'Điểm thân thiết phải là số nguyên không âm'),
  status: z.enum(['active', 'inactive', 'banned']),
});

type CustomerForm = z.infer<typeof customerSchema>;

function EditCustomerDialog({ customer, onClose }: EditCustomerDialogProps) {
  const update = useUpdateCustomer();
  const form = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      phone: customer.phone ?? '',
      address: customer.address ?? '',
      loyaltyPoints: String(customer.loyaltyPoints),
      status: customer.status,
    },
  });

  function onSubmit(values: CustomerForm) {
    update.mutate(
      {
        id: customer.id,
        payload: { ...values, loyaltyPoints: Number(values.loyaltyPoints) },
      },
      {
        onSuccess: () => {
          toast.success('Đã cập nhật khách hàng');
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
            Chỉnh sửa Khách hàng
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <UserAvatar firstName={customer.firstName} lastName={customer.lastName} />
              <div>
                <p className="text-sm font-medium">
                  {customer.firstName} {customer.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              </div>
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
            <FormField
              control={form.control}
              name="loyaltyPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm thân thiết</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
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
                Không thể cập nhật khách hàng. Vui lòng thử lại.
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
  customer: AdminCustomer;
  onClose: () => void;
}

const resetPasswordSchema = z.object({ password: passwordSchema });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordDialog({ customer, onClose }: ResetPasswordDialogProps) {
  const resetPassword = useUpdateCustomerPassword();
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  });

  function onSubmit(values: ResetPasswordForm) {
    resetPassword.mutate(
      { id: customer.id, password: values.password },
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
              {customer.firstName} {customer.lastName} · {customer.email}
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

export default function AdminCustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isError } = useCustomers(page, LIMIT, debouncedSearch);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<AdminCustomer | null>(null);
  const [resetPasswordCustomer, setResetPasswordCustomer] = useState<AdminCustomer | null>(null);
  const toggleStatus = useUpdateCustomer();

  const customers = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  const columns: Column<AdminCustomer>[] = [
    {
      key: 'name',
      header: 'Chi tiết khách hàng',
      width: '30%',
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
      key: 'phone',
      header: 'Điện thoại',
      hideOnMobile: true,
      width: '15%',
      render: (r) => <span className="text-sm text-muted-foreground">{r.phone ?? '—'}</span>,
    },
    {
      key: 'loyaltyPoints',
      header: 'Điểm thân thiết',
      hideOnMobile: true,
      width: '15%',
      render: (r) => <span className="text-sm font-medium">{r.loyaltyPoints}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '15%',
      render: (r) => <Badge status={statusStyle[r.status]}>{STATUS_VIETNAMESE[r.status]}</Badge>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      align: 'right',
      width: '10%',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title="Đặt lại Mật khẩu"
            onClick={() => setResetPasswordCustomer(r)}
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
            onClick={() => setEditCustomer(r)}
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
        eyebrow="Khách hàng"
        title="Quản lý Khách hàng"
        actions={
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                className="pl-10 bg-card w-full"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Button
              size="default"
              className="uppercase tracking-wider text-xs gap-2"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" />
              Thêm khách hàng
            </Button>
          </div>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Tổng khách hàng"
          value={isLoading ? '—' : String(total)}
          icon={UsersIcon}
          tone="primary"
        />
        <StatCard
          label="Tổng điểm thân thiết"
          value={
            isLoading ? '—' : String(customers.reduce((sum, c) => sum + c.loyaltyPoints, 0))
          }
          delta="Trên trang này"
          icon={Star}
          tone="secondary"
        />
        <StatCard
          label="Bị khóa"
          value={isLoading ? '—' : String(customers.filter((c) => c.status === 'banned').length)}
          delta="Trên trang này"
          icon={Hourglass}
          tone="tertiary"
        />
      </section>

      {isError && (
        <ErrorNotice>Không thể tải danh sách khách hàng. Vui lòng thử lại.</ErrorNotice>
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
          rows={customers}
          footer={
            <Pagination
              showing={
                total === 0
                  ? 'Không tìm thấy khách hàng nào'
                  : `Hiển thị ${offset + 1}–${Math.min(offset + customers.length, total)} trên ${total}`
              }
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          }
        />
      )}

      {createOpen && <CreateCustomerDialog onClose={() => setCreateOpen(false)} />}

      {editCustomer && (
        <EditCustomerDialog customer={editCustomer} onClose={() => setEditCustomer(null)} />
      )}

      {resetPasswordCustomer && (
        <ResetPasswordDialog
          customer={resetPasswordCustomer}
          onClose={() => setResetPasswordCustomer(null)}
        />
      )}
    </div>
  );
}
