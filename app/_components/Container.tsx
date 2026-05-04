import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'wide';
}

export function Container({
  children,
  className = '',
  size = 'default',
}: ContainerProps) {
  const max = size === 'wide' ? 'max-w-[1920px]' : 'max-w-7xl';
  return (
    <div className={`${max} mx-auto px-4 sm:px-6 md:px-gutter ${className}`}>
      {children}
    </div>
  );
}
