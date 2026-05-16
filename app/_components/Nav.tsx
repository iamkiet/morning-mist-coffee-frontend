'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const CartCount = dynamic(() => import('./CartCount'), { ssr: false });

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/story', label: 'Our Story' },
  { href: '/journal', label: 'Journal' },
  { href: '/track-order', label: 'Track Order' },
];

export function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-[24px] w-full z-50 bg-white/70 border-b border-border/20 backdrop-blur-xl">
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-12 py-6 max-w-[1920px] mx-auto">
        <Link
          href="/"
          onClick={closeMenu}
          className="text-xl sm:text-2xl font-light tracking-tighter text-accent uppercase transition-opacity hover:opacity-70"
        >
          Todaywegrind Coffee
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
            size="icon"
            className="relative h-11 w-11 sm:h-12 sm:w-12"
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
                size="icon"
                className="lg:hidden h-11 w-11 sm:h-12 sm:w-12"
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
                    className={`text-2xl sm:text-3xl font-light uppercase tracking-[0.3em] transition-colors ${
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
      </div>
    </nav>
  );
}
