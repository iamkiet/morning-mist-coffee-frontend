'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Flips a flag on and back off after `duration` ms — for "Đã thêm" style
 * confirmations. Clears its timer on unmount so a fast navigation away
 * cannot fire setState on an unmounted component.
 */
export function useTemporaryFlag(duration = 1500) {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const trigger = useCallback(
    (onExpire?: () => void) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setActive(true);
      timerRef.current = setTimeout(() => {
        setActive(false);
        onExpire?.();
      }, duration);
    },
    [duration],
  );

  return [active, trigger] as const;
}
