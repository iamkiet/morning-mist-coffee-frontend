import type { ReactNode } from 'react';
import { Nav } from '../_components/Nav';
import { Footer } from '../_components/Footer';

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] bg-accent text-accent-foreground text-center py-1 px-4 text-[10px] tracking-[0.2em] uppercase font-semibold">
        ✦ DEMO PROJECT — ALL ORDERS &amp; DATA ARE SIMULATED ✦
      </div>
      <Nav />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
