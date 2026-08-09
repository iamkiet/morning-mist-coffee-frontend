'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';

interface HeaderHeightSyncProps {
  children: ReactNode;
}

/**
 * Measures the fixed header's real rendered height (it varies — the promo
 * banner and logo can wrap on narrow phones) and publishes it as
 * `--header-height` so Container/Hero can clear it exactly instead of
 * guessing a fixed pt-* value per breakpoint.
 */
export function HeaderHeightSync({ children }: HeaderHeightSyncProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${el.offsetHeight}px`,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={ref} className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {children}
    </header>
  );
}
