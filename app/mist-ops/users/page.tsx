'use client';

import {
  KeyRound,
  UserX,
  Pencil,
  Search,
  UserPlus,
  Users as UsersIcon,
  Zap,
  Hourglass,
} from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../_components/PageHeader';
import { Badge } from '../_components/Badge';
import { DataTable, type Column } from '../_components/DataTable';
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
import { Label } from '@/components/ui/label';
import { useUsers, useUpdateUser } from '@/hooks/use-users';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { ApiUser, UserRole, UserStatus } from '@/lib/api/users';

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

function UserAvatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  return (
    <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
      {initials}
    </div>
  );
}

function EditUserDialog({
  user,
  onClose,
}: {
  user: ApiUser;
  onClose: () => void;
}) {
  const update = useUpdateUser();
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);

  function handleSave() {
    update.mutate(
      { id: user.id, payload: { role, status } },
      { onSuccess: onClose },
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
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <UserAvatar firstName={user.firstName} lastName={user.lastName} />
            <div>
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eu-role" className="text-xs uppercase tracking-wider text-muted-foreground">
              Vai trò
            </Label>
            <select
              id="eu-role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eu-status" className="text-xs uppercase tracking-wider text-muted-foreground">
              Trạng thái
            </Label>
            <select
              id="eu-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="banned">Bị cấm</option>
            </select>
          </div>
          {update.isError && (
            <p className="text-xs text-destructive">Không thể cập nhật người dùng. Vui lòng thử lại.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} className="uppercase tracking-wider text-xs">
            Hủy
          </Button>
          <Button
            size="sm"
            className="uppercase tracking-wider text-xs"
            disabled={update.isPending}
            onClick={handleSave}
          >
            {update.isPending ? 'Đang lưu…' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const LIMIT = 20;

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isError } = useUsers(1, LIMIT, debouncedSearch);
  const [editUser, setEditUser] = useState<ApiUser | null>(null);

  const users = data?.items ?? [];

  const columns: Column<ApiUser>[] = [
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
          >
            <KeyRound className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 hover:text-destructive"
            title="Vô hiệu hóa"
          >
            <UserX className="size-4" />
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
          <>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tài khoản..."
                className="pl-10 bg-card w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button>
              <UserPlus className="size-4" />
              Mời người dùng
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Tổng thành viên"
          value={isLoading ? '—' : String(data?.total ?? 0)}
          delta="+8%"
          icon={UsersIcon}
          tone="primary"
          progress={68}
        />
        <StatCard
          label="Hoạt động hôm nay"
          value="312"
          delta="Trực tuyến"
          icon={Zap}
          tone="secondary"
          progress={42}
        />
        <StatCard
          label="Đang chờ phê duyệt"
          value="03"
          delta="Yêu cầu xử lý"
          icon={Hourglass}
          tone="tertiary"
        />
      </section>

      {isError && (
        <p className="text-sm text-destructive mb-4">
          Không thể tải danh sách người dùng. Vui lòng thử lại.
        </p>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground text-center py-12">
          Đang tải danh sách người dùng…
        </div>
      ) : (
        <DataTable columns={columns} rows={users} />
      )}

      {editUser && (
        <EditUserDialog user={editUser} onClose={() => setEditUser(null)} />
      )}
    </div>
  );
}
