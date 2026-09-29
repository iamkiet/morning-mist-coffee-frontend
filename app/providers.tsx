'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/lib/cart';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';
import { authAreaForPath } from '@/lib/auth-area';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const area = authAreaForPath(usePathname());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  // QueryClientProvider wraps AuthProvider so logout can clear the query cache
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider key={area} area={area}>
        <CartProvider>{children}</CartProvider>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
