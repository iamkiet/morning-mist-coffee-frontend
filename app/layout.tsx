import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from './providers';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Morning Mist Coffee',
  description: 'Specialty coffee, slowly served.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn('h-full antialiased font-sans', geist.variable)}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <div className="w-full bg-accent text-accent-foreground text-center py-2 px-4 text-xs tracking-[0.2em] uppercase font-semibold">
          ✦ DEMO PROJECT — ALL ORDERS &amp; DATA ARE SIMULATED ✦
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
