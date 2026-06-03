'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from './_components/AdminSidebar';
import { useAuth } from '@/lib/auth-context';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-w-0 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-20 bg-card border-b border-border/30 px-4 py-3 flex items-center justify-between">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="!w-72 !max-w-72 p-0 gap-0"
            >
              <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Admin panel navigation
              </SheetDescription>
              <AdminSidebar onClose={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            aria-label="Logout"
          >
            <LogOut className="size-4" />
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex sticky top-0 z-20 bg-card border-b border-border/30 px-6 py-3 items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[10px] text-muted-foreground tracking-widest">
              {user.email}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={logout}
            className="rounded-lg text-xs uppercase tracking-widest gap-2"
          >
            <LogOut className="size-3.5" />
            Đăng xuất
          </Button>
        </div>

        {children}
      </main>
    </div>
  );
}
