import type { ReactNode } from 'react';
import Image from 'next/image';
import { HEADER_HEIGHT_CSS } from './Container';

interface HeroProps {
  image: string;
  imageAlt: string;
  imageClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
  justifyClassName?: string;
  children: ReactNode;
}

/**
 * Every hero image on the site renders at this size — source images at
 * 1920x820 (or larger, same ratio) so object-cover never has to upscale.
 */
const HERO_HEIGHT = 'h-[600px] sm:h-[700px] md:h-[820px]';

export function Hero({
  image,
  imageAlt,
  imageClassName = 'object-cover',
  overlayClassName = 'bg-gradient-to-b from-transparent to-background',
  contentClassName = 'text-center max-w-4xl px-4 sm:px-6 md:px-gutter',
  justifyClassName = 'justify-center',
  children,
}: HeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ paddingTop: HEADER_HEIGHT_CSS }}
    >
      <div className={`relative w-full flex items-center ${justifyClassName} ${HERO_HEIGHT}`}>
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className={imageClassName}
          />
          <div className={`absolute inset-0 ${overlayClassName}`} />
        </div>
        <div className={`relative z-10 ${contentClassName}`}>{children}</div>
      </div>
    </section>
  );
}
