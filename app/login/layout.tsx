import type { ReactNode } from 'react';

interface LoginLayoutProps {
  children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return <div className="fixed inset-0 overflow-auto">{children}</div>;
}
