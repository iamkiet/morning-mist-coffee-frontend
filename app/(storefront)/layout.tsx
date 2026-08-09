import type { ReactNode } from 'react';
import { Nav } from '../_components/Nav';
import { Footer } from '../_components/Footer';
import { PromoBanner } from '../_components/PromoBanner';
import { HeaderHeightSync } from '../_components/HeaderHeightSync';

interface StorefrontLayoutProps {
  children: ReactNode;
}

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
  return (
    <>
      <HeaderHeightSync>
        <PromoBanner />
        <Nav />
      </HeaderHeightSync>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
