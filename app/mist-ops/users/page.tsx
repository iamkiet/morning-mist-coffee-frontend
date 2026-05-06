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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Edit User
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
              Role
            </Label>
            <select
              id="eu-role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eu-status" className="text-xs uppercase tracking-wider text-muted-foreground">
              Status
            </Label>
            <select
              id="eu-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} className="uppercase tracking-wider text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            className="uppercase tracking-wider text-xs"
            disabled={update.isPending}
            onClick={handleSave}
          >
            {update.isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsersPage() {
  const { data, isLoading, isError } = useUsers();
  const [editUser, setEditUser] = useState<ApiUser | null>(null);

  const columns: Column<ApiUser>[] = [
    {
      key: 'name',
      header: 'User Details',
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
      header: 'Account Role',
      render: (r) => <Badge status={roleStyle[r.role]}>{r.role}</Badge>,
    },
    {
      key: 'joined',
      header: 'Join Date',
      hideOnMobile: true,
      render: (r) => (
        <span className="text-muted-foreground text-sm">
          {new Date(r.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge status={statusStyle[r.status]}>{r.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      hideOnMobile: true,
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title="Reset Password"
          >
            <KeyRound className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 hover:text-destructive"
            title="Deactivate"
          >
            <UserX className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title="Edit"
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
        eyebrow="Overview of all registered accounts"
        title="User Management"
        actions={
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search accounts..."
                className="w-full sm:w-64 pl-10 bg-card"
              />
            </div>
            <Button>
              <UserPlus className="size-4" />
              Invite User
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Members"
          value={isLoading ? '—' : String(data?.total ?? 0)}
          delta="+8%"
          icon={UsersIcon}
          tone="primary"
          progress={68}
        />
        <StatCard
          label="Active Today"
          value="312"
          delta="Live"
          icon={Zap}
          tone="secondary"
          progress={42}
        />
        <StatCard
          label="Pending Approvals"
          value="03"
          delta="Action Required"
          icon={Hourglass}
          tone="tertiary"
        />
      </section>

      {isError && (
        <p className="text-sm text-destructive mb-4">
          Failed to load users. Please try again.
        </p>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground text-center py-12">
          Loading users…
        </div>
      ) : (
        <DataTable columns={columns} rows={data?.items ?? []} />
      )}

      {editUser && (
        <EditUserDialog user={editUser} onClose={() => setEditUser(null)} />
      )}
    </div>
  );
}
