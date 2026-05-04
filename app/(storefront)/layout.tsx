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
      <Nav />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
