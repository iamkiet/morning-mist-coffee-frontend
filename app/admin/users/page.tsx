import Image from "next/image";
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

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Admin" | "Barista" | "Customer";
  joined: string;
  active: boolean;
}

const users: User[] = [
  { id: "u1", name: "Elena Vance", email: "elena.v@morningmist.coffee", avatar: "https://i.pravatar.cc/100?img=1", role: "Admin", joined: "Oct 12, 2023", active: true },
  { id: "u2", name: "Julian Thorne", email: "j.thorne@morningmist.coffee", avatar: "https://i.pravatar.cc/100?img=12", role: "Barista", joined: "Jan 05, 2024", active: true },
  { id: "u3", name: "Amara Okafor", email: "amara.okafor@gmail.com", avatar: "https://i.pravatar.cc/100?img=5", role: "Customer", joined: "Feb 21, 2024", active: true },
  { id: "u4", name: "Marcus Jensen", email: "m.jensen@studio.io", avatar: "https://i.pravatar.cc/100?img=8", role: "Barista", joined: "Mar 14, 2024", active: false },
  { id: "u5", name: "Sarah Chen", email: "sarah.chen@design.co", avatar: "https://i.pravatar.cc/100?img=10", role: "Customer", joined: "Apr 02, 2024", active: true },
];

const roleStatus = {
  Admin: "primary",
  Barista: "info",
  Customer: "purple",
} as const;

const columns: Column<User>[] = [
  {
    key: "name",
    header: "User Details",
    render: (r) => (
      <div className="flex items-center gap-4">
        <Image src={r.avatar} alt={`${r.name}'s avatar`} width={40} height={40} className="rounded-full object-cover" />
        <div>
          <p className="text-sm font-medium">{r.name}</p>
          <p className="text-xs text-muted-foreground">{r.email}</p>
        </div>
      </div>
    ),
  },
  { key: "role", header: "Account Role", render: (r) => <Badge status={roleStatus[r.role]}>{r.role}</Badge> },
  { key: "joined", header: "Join Date", hideOnMobile: true, render: (r) => <span className="text-muted-foreground text-sm">{r.joined}</span> },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <Badge status={r.active ? "success" : "neutral"}>
        {r.active ? "Active" : "Inactive"}
      </Badge>
    ),
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
        <StatCard label="Total Members" value="1,284" delta="+8%" icon={UsersIcon} tone="primary" progress={68} />
        <StatCard label="Active Today" value="312" delta="Live" icon={Zap} tone="secondary" progress={42} />
        <StatCard label="Pending Approvals" value="03" delta="Action Required" icon={Hourglass} tone="tertiary" />
      </section>

      <DataTable columns={columns} rows={users} />
    </div>
  );
}
