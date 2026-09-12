'use client';

import {
  KeyRound,
  UserX,
  UserCheck,
  Pencil,
  Trash2,
  Search,
  Users as UsersIcon,
  Zap,
  Hourglass,
  Plus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useUpdateEmployeePassword,
  useDeleteEmployee,
} from '@/hooks/use-employees';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useAuth } from '@/lib/auth-context';
import {
  EMPLOYEE_DEPARTMENTS,
  type AdminEmployee,
  type EmployeeDepartment,
  type EmployeeRole,
  type UserStatus,
} from '@/lib/types';
import { passwordSchema } from '@/lib/validation';
import { getInitials } from '@/lib/utils';

const roleStyle: Record<EmployeeRole, 'primary' | 'neutral'> = {
  admin: 'primary',
  staff: 'neutral',
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

const ROLE_VIETNAMESE: Record<EmployeeRole, string> = {
  admin: 'Quản trị viên',
  staff: 'Nhân viên',
};

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

const ROLE_OPTIONS: { value: EmployeeRole; label: string }[] = [
  { value: 'staff', label: 'Nhân viên' },
  { value: 'admin', label: 'Quản trị viên' },
];

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
  { value: 'banned', label: 'Bị khóa' },
];

const DEPARTMENT_OPTIONS: { value: EmployeeDepartment; label: string }[] =
  EMPLOYEE_DEPARTMENTS.map((d) => ({ value: d, label: d }));

interface CreateEmployeeDialogProps {
  allowAdminRole: boolean;
  onClose: () => void;
}

const createEmployeeSchema = z.object({
  firstName: z.string().min(1, 'Họ là bắt buộc'),
  lastName: z.string().min(1, 'Tên là bắt buộc'),
  companyEmail: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  department: z.enum(EMPLOYEE_DEPARTMENTS).optional(),
  password: passwordSchema,
  role: z.enum(['staff', 'admin']),
  registrationKey: z.string().min(1, 'Mã đăng ký là bắt buộc'),
});

type CreateEmployeeForm = z.infer<typeof createEmployeeSchema>;

function CreateEmployeeDialog({ allowAdminRole, onClose }: CreateEmployeeDialogProps) {
  const create = useCreateEmployee();
  const form = useForm<CreateEmployeeForm>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      companyEmail: '',
      department: undefined,
      password: '',
      role: 'staff',
      registrationKey: '',
    },
  });

  function onSubmit(values: CreateEmployeeForm) {
    create.mutate(values, {
      onSuccess: () => {
        toast.success('Đã tạo nhân viên mới');
        onClose();
      },
    });
  }

  const roleOptions = allowAdminRole
    ? ROLE_OPTIONS
    : ROLE_OPTIONS.filter((o) => o.value !== 'admin');

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Tạo Nhân Viên Mới
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
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email công ty</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ten@todaywegrind.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phòng ban</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn phòng ban" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEPARTMENT_OPTIONS.map((o) => (
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
                      {roleOptions.map((o) => (
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
                  : 'Không thể tạo nhân viên. Vui lòng thử lại.'}
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

interface EditEmployeeDialogProps {
  employee: AdminEmployee;
  allowAdminRole: boolean;
  onClose: () => void;
}

const employeeSchema = z.object({
  role: z.enum(['staff', 'admin']),
  status: z.enum(['active', 'inactive', 'banned']),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

function EditEmployeeDialog({ employee, allowAdminRole, onClose }: EditEmployeeDialogProps) {
  const update = useUpdateEmployee();
  const form = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { role: employee.role, status: employee.status },
  });

  function onSubmit(values: EmployeeForm) {
    update.mutate(
      { id: employee.id, payload: values },
      {
        onSuccess: () => {
          toast.success('Đã cập nhật nhân viên');
          onClose();
        },
      },
    );
  }

  const roleOptions = allowAdminRole
    ? ROLE_OPTIONS
    : ROLE_OPTIONS.filter((o) => o.value !== 'admin');

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Chỉnh sửa Nhân viên
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <UserAvatar firstName={employee.firstName} lastName={employee.lastName} />
              <div>
                <p className="text-sm font-medium">
                  {employee.firstName} {employee.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{employee.companyEmail}</p>
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
                      {roleOptions.map((o) => (
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
                {update.error instanceof Error
                  ? update.error.message
                  : 'Không thể cập nhật nhân viên. Vui lòng thử lại.'}
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
  employee: AdminEmployee;
  onClose: () => void;
}

const resetPasswordSchema = z.object({ password: passwordSchema });
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordDialog({ employee, onClose }: ResetPasswordDialogProps) {
  const resetPassword = useUpdateEmployeePassword();
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  });

  function onSubmit(values: ResetPasswordForm) {
    resetPassword.mutate(
      { id: employee.id, password: values.password },
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
              {employee.firstName} {employee.lastName} · {employee.companyEmail}
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

export default function AdminEmployeesPage() {
  const router = useRouter();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (!authLoading && !isAdmin) router.replace('/mist-ops');
  }, [authLoading, isAdmin, router]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isError } = useEmployees(
    page,
    LIMIT,
    debouncedSearch,
    isAdmin,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<AdminEmployee | null>(null);
  const [resetPasswordEmployee, setResetPasswordEmployee] = useState<AdminEmployee | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminEmployee | null>(null);
  const toggleStatus = useUpdateEmployee();
  const deleteMut = useDeleteEmployee();

  if (authLoading || !isAdmin) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  const employees = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  const columns: Column<AdminEmployee>[] = [
    {
      key: 'name',
      header: 'Chi tiết nhân viên',
      width: '30%',
      render: (r) => (
        <div className="flex items-center gap-4">
          <UserAvatar firstName={r.firstName} lastName={r.lastName} />
          <div>
            <p className="text-sm font-medium">
              {r.firstName} {r.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{r.companyEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Phòng ban',
      hideOnMobile: true,
      width: '15%',
      render: (r) => (
        <span className="text-sm text-muted-foreground">{r.department ?? '—'}</span>
      ),
    },
    {
      key: 'role',
      header: 'Vai trò',
      width: '15%',
      render: (r) => <Badge status={roleStyle[r.role]}>{ROLE_VIETNAMESE[r.role]}</Badge>,
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
      width: '15%',
      render: (r) => {
        const canDelete = isAdmin || r.role !== 'admin';
        const canEdit = isAdmin || r.id === currentUser?.id;
        return (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              title={canEdit ? 'Đặt lại Mật khẩu' : 'Chỉ tự đặt lại mật khẩu của chính mình'}
              disabled={!canEdit}
              onClick={() => setResetPasswordEmployee(r)}
            >
              <KeyRound className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:text-destructive"
              title={
                !canEdit
                  ? 'Chỉ tự chỉnh sửa tài khoản của chính mình'
                  : r.status === 'banned'
                    ? 'Kích hoạt lại'
                    : 'Vô hiệu hóa'
              }
              disabled={toggleStatus.isPending || !canEdit}
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
              title={canEdit ? 'Chỉnh sửa' : 'Chỉ tự chỉnh sửa tài khoản của chính mình'}
              disabled={!canEdit}
              onClick={() => setEditEmployee(r)}
            >
              <Pencil className="size-4" />
            </Button>
            {r.id !== currentUser?.id && canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:text-destructive"
                title="Xóa"
                onClick={() => setDeleteConfirm(r)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        eyebrow="Nhân viên"
        title="Quản lý Nhân viên"
        actions={
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
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
              Thêm nhân viên
            </Button>
          </div>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Tổng nhân viên"
          value={isLoading ? '—' : String(total)}
          icon={UsersIcon}
          tone="primary"
        />
        <StatCard
          label="Quản trị viên"
          value={isLoading ? '—' : String(employees.filter((u) => u.role === 'admin').length)}
          delta="Trên trang này"
          icon={Zap}
          tone="secondary"
        />
        <StatCard
          label="Bị khóa"
          value={isLoading ? '—' : String(employees.filter((u) => u.status === 'banned').length)}
          delta="Trên trang này"
          icon={Hourglass}
          tone="tertiary"
        />
      </section>

      {isError && (
        <ErrorNotice>Không thể tải danh sách nhân viên. Vui lòng thử lại.</ErrorNotice>
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
          rows={employees}
          footer={
            <Pagination
              showing={
                total === 0
                  ? 'Không tìm thấy nhân viên nào'
                  : `Hiển thị ${offset + 1}–${Math.min(offset + employees.length, total)} trên ${total}`
              }
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          }
        />
      )}

      {createOpen && (
        <CreateEmployeeDialog allowAdminRole={isAdmin} onClose={() => setCreateOpen(false)} />
      )}

      {editEmployee && (
        <EditEmployeeDialog
          employee={editEmployee}
          allowAdminRole={isAdmin}
          onClose={() => setEditEmployee(null)}
        />
      )}

      {resetPasswordEmployee && (
        <ResetPasswordDialog
          employee={resetPasswordEmployee}
          onClose={() => setResetPasswordEmployee(null)}
        />
      )}

      {deleteConfirm && (
        <Dialog open onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-[24rem]">
            <DialogHeader>
              <DialogTitle className="text-sm uppercase tracking-widest font-medium">
                Xác nhận Xóa
              </DialogTitle>
            </DialogHeader>
            <div className="py-2 text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa tài khoản{' '}
              <strong>
                {deleteConfirm.firstName} {deleteConfirm.lastName}
              </strong>{' '}
              không? Hành động này không thể hoàn tác.
            </div>
            {deleteMut.isError && (
              <ErrorNotice className="mb-0">
                {deleteMut.error instanceof Error
                  ? deleteMut.error.message
                  : 'Không thể xóa nhân viên. Vui lòng thử lại.'}
              </ErrorNotice>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirm(null)}
                className="uppercase tracking-wider text-xs"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="uppercase tracking-wider text-xs"
                disabled={deleteMut.isPending}
                onClick={() => {
                  deleteMut.mutate(deleteConfirm.id, {
                    onSuccess: () => {
                      toast.success('Đã xóa nhân viên');
                      setDeleteConfirm(null);
                    },
                  });
                }}
              >
                {deleteMut.isPending ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
