'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, ShoppingBag, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import CartCount from './CartCount';
import { Container } from './Container';
import { useAuth } from '@/lib/auth-context';

const links = [
  { href: '/', label: 'Trang chủ' },
  { href: '/shop', label: 'Cửa hàng' },
  { href: '/story', label: 'Câu chuyện' },
  { href: '/journal', label: 'Tạp chí' },
  { href: '/track-order', label: 'Theo dõi đơn hàng' },
];

interface NavProps {
  className?: string;
}

export function Nav({ className }: NavProps = {}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const { user } = useAuth();
  const accountHref = user?.role === 'customer' ? '/customer/profile' : '/customer/login';

  return (
    <nav className={`w-full bg-background/70 border-b border-border/20 backdrop-blur-xl ${className ?? ''}`}>
      <Container className="flex justify-between items-center py-3 sm:py-4">
        <Link
          href="/"
          onClick={closeMenu}
          className="text-xl sm:text-2xl font-light tracking-tighter text-accent uppercase transition-opacity hover:opacity-70"
        >
          Morning Mist Coffee
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`text-sm font-light uppercase transition-colors ${
                pathname === l.href
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="icon-xl"
          >
            <Link href={accountHref} onClick={closeMenu} aria-label="Tài khoản">
              <User className="size-5" fill={user ? 'currentColor' : 'none'} />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="icon-xl"
            className="relative"
          >
            <Link
              href="/checkout"
              onClick={closeMenu}
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="size-5" />
              <CartCount />
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xl"
                className="lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="!w-full sm:!max-w-sm bg-card">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Main site navigation
              </SheetDescription>
              <div className="flex flex-col items-center justify-start pt-16 space-y-8 sm:space-y-10 px-4">
                {links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={closeMenu}
                    className={`text-2xl sm:text-3xl font-light uppercase tracking-widest transition-colors ${
                      pathname === l.href
                        ? 'text-accent'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </nav>
  );
}
