'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  LineChart,
  Receipt,
  Package,
  Users,
  Settings,
  HelpCircle,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AdminSidebarProps {
  onClose?: () => void;
}

const nav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/mist-ops', label: 'Overview', icon: LayoutDashboard },
  { href: '/mist-ops/analytics', label: 'Analytics', icon: LineChart },
  { href: '/mist-ops/orders', label: 'Orders', icon: Receipt },
  { href: '/mist-ops/products', label: 'Inventory', icon: Package },
  { href: '/mist-ops/users', label: 'Users', icon: Users },
];

const footerNav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '#', label: 'Settings', icon: Settings },
  { href: '#', label: 'Support', icon: HelpCircle },
];

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const handleLinkClick = () => {
    onClose?.();
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '??';

  return (
    <aside className="h-full lg:h-screen w-full lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:border-r border-border/30 bg-sidebar flex flex-col p-6 space-y-6 z-40">
      {/* Logo */}
      <div className="px-4">
        <p className="text-sm font-medium text-foreground tracking-tight leading-none">
          Todaywegrind Coffee
        </p>
        <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">
          Management
        </p>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 px-4">
        <div className="w-10 h-10 rounded-full bg-muted border border-border/30 flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wider uppercase text-foreground truncate">
            {user ? `${user.firstName} ${user.lastName}` : '—'}
          </p>
          <p className="text-[10px] text-muted-foreground tracking-widest truncate">
            {user?.email ?? ''}
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
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-card/50'
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
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 text-muted-foreground py-2 px-4 hover:bg-card/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-xs tracking-wider uppercase font-medium">
              Back to Store
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
