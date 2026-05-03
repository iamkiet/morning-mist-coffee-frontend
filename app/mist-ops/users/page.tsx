"use client";

import {
  KeyRound,
  UserX,
  MoreVertical,
  Search,
  UserPlus,
  Users as UsersIcon,
  Zap,
  Hourglass,
} from "lucide-react";
import { PageHeader } from "../_components/PageHeader";
import { Badge } from "../_components/Badge";
import { DataTable, type Column } from "../_components/DataTable";
import { StatCard } from "../_components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/hooks/use-users";
import type { ApiUser, UserRole, UserStatus } from "@/lib/api/users";

const roleStyle: Record<UserRole, "primary" | "purple"> = {
  admin: "primary",
  user: "purple",
};

const statusStyle: Record<UserStatus, "success" | "neutral" | "error"> = {
  active: "success",
  inactive: "neutral",
  banned: "error",
};

function UserAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  return (
    <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
      {initials}
    </div>
  );
}

const columns: Column<ApiUser>[] = [
  {
    key: "name",
    header: "User Details",
    render: (r) => (
      <div className="flex items-center gap-4">
        <UserAvatar firstName={r.firstName} lastName={r.lastName} />
        <div>
          <p className="text-sm font-medium">{r.firstName} {r.lastName}</p>
          <p className="text-xs text-muted-foreground">{r.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Account Role",
    render: (r) => <Badge status={roleStyle[r.role]}>{r.role}</Badge>,
  },
  {
    key: "joined",
    header: "Join Date",
    hideOnMobile: true,
    render: (r) => (
      <span className="text-muted-foreground text-sm">
        {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => <Badge status={statusStyle[r.status]}>{r.status}</Badge>,
  },
  {
    key: "actions",
    header: "Actions",
    align: "right",
    hideOnMobile: true,
    render: () => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" title="Reset Password">
          <KeyRound className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="size-8 hover:text-destructive" title="Deactivate">
          <UserX className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreVertical className="size-4" />
        </Button>
      </div>
    ),
  },
];

export default function AdminUsersPage() {
  const { data, isLoading, isError } = useUsers();

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
          value={isLoading ? "—" : String(data?.total ?? 0)}
          delta="+8%"
          icon={UsersIcon}
          tone="primary"
          progress={68}
        />
        <StatCard label="Active Today" value="312" delta="Live" icon={Zap} tone="secondary" progress={42} />
        <StatCard label="Pending Approvals" value="03" delta="Action Required" icon={Hourglass} tone="tertiary" />
      </section>

      {isError && (
        <p className="text-sm text-destructive mb-4">Failed to load users. Please try again.</p>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground text-center py-12">Loading users…</div>
      ) : (
        <DataTable columns={columns} rows={data?.items ?? []} />
      )}
    </div>
  );
}
