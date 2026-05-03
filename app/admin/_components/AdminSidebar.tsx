"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  Receipt,
  Package,
  Users,
  Settings,
  HelpCircle,
  Coffee,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  onClose?: () => void;
}

const nav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: LineChart },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/products", label: "Inventory", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
];

const footerNav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "#", label: "Settings", icon: Settings },
  { href: "#", label: "Support", icon: HelpCircle },
];

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <aside className="h-full lg:h-screen w-full lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:border-r border-border/30 bg-sidebar flex flex-col p-6 space-y-6 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <Coffee size={18} className="text-accent-foreground" />
        </span>
        <span className="text-xl font-light text-foreground tracking-tighter">
          Management
        </span>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGFL_QIR0eN-BEOcEZHB3iFmxkb3j6dpTy85oKmSIKLljVxfviZy9zBvsLA6p0m9YHGNXOE7HJljksrbP23PRVGHpcgw16v3hAp_whj9YbhZdQLHIsUo6j_7BtUPDoRClDHl87mGLCVhFwT-Pbh5mSmubENzrvvIpBNLBm3UEQbFlSkkBZOcudKBvR71eeDDg3riTRAfSxy9Cmp1AjIsMxVV7SnU25CuA3g9OCjRukJCxtTzI4nnliHuJQCce3-m69KL6Pt86zjZ8"
          alt="Admin Profile"
          width={40}
          height={40}
          className="rounded-full object-cover border border-border/30"
        />
        <div>
          <p className="text-xs font-medium tracking-wider uppercase text-foreground">
            Julian Thorne
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Morning Mist Coffee Admin
          </p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-grow space-y-1">
        {nav.map((n) => {
          const active = n.href === pathname;
          const Icon = n.icon;
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                active
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-card/50"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs tracking-wider uppercase font-medium">
                {n.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="space-y-3 pt-4 border-t border-border/30">
        <Button className="w-full uppercase tracking-wider text-xs" size="sm">
          New Batch
        </Button>
        <div className="space-y-1">
          {footerNav.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.label}
                href={n.href}
                className="flex items-center gap-3 text-muted-foreground py-2 px-4 hover:bg-card/50 rounded-lg transition-colors"
              >
                <Icon size={18} />
                <span className="text-xs tracking-wider uppercase font-medium">
                  {n.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
