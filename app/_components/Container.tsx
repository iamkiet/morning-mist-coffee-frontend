import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'narrow' | 'default' | 'wide';
  /** Rendered element — use `section` for page sections so semantics survive. */
  as?: 'div' | 'section' | 'header' | 'footer' | 'main';
  /**
   * Adds the standard clearance for the fixed Nav. Every storefront page that
   * is not a full-bleed hero needs it — hard-coding a `pt-*` per page is how
   * the pages drifted to 28 / 32 / 36 apart from one another.
   */
  navOffset?: boolean;
}

const MAX_WIDTH = {
  narrow: 'max-w-2xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1920px]',
} as const;

const NAV_OFFSET = 'pt-28 sm:pt-32 md:pt-36';

export function Container({
  children,
  className = '',
  size = 'default',
  navOffset = false,
  as: Tag = 'div',
}: ContainerProps) {
  const classes = [
    MAX_WIDTH[size],
    'mx-auto px-4 sm:px-6 md:px-gutter',
    navOffset ? NAV_OFFSET : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classes}>{children}</Tag>;
}
