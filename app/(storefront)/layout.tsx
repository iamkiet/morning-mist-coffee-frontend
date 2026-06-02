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
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        <div className="bg-accent text-accent-foreground text-center py-1 px-4 text-[9px] sm:text-[10px] tracking-[0.1em] sm:tracking-[0.2em] uppercase font-semibold select-none">
          ✦ DỰ ÁN THỬ NGHIỆM — TẤT CẢ ĐƠN HÀNG &amp; DỮ LIỆU ĐỀU LÀ MÔ PHỎNG ✦
        </div>
        <Nav />
      </header>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
