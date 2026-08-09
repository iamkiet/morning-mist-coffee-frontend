import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'narrow' | 'default' | 'wide';
  /** Rendered element — use `section` for page sections so semantics survive. */
  as?: 'div' | 'section' | 'header' | 'footer' | 'main';
  /**
   * Adds the standard clearance for the fixed header (promo strip + Nav,
   * 104px tall). Every storefront page that is not a full-bleed hero needs
   * it — hard-coding a `pt-*` per page is how the pages drifted apart.
   */
  navOffset?: boolean;
}

const MAX_WIDTH = {
  narrow: 'max-w-2xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1920px]',
} as const;

/**
 * Fallback for the first paint / no-JS, before HeaderHeightSync measures the
 * real header and publishes `--header-height`. Keep in sync with Nav.tsx +
 * PromoBanner.tsx at the common (non-wrapped) width.
 */
export const HEADER_HEIGHT_FALLBACK_PX = 104;
export const HEADER_HEIGHT_CSS = `var(--header-height, ${HEADER_HEIGHT_FALLBACK_PX}px)`;

/** Breathing room below the header before page content starts — Hero stays flush against it on purpose, so this only applies to navOffset. */
const NAV_OFFSET_GAP = '2rem';

export function Container({
  children,
  className = '',
  size = 'default',
  navOffset = false,
  as: Tag = 'div',
}: ContainerProps) {
  const classes = [MAX_WIDTH[size], 'mx-auto px-4 sm:px-6 md:px-gutter', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      className={classes}
      style={
        navOffset
          ? { paddingTop: `calc(${HEADER_HEIGHT_CSS} + ${NAV_OFFSET_GAP})` }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
