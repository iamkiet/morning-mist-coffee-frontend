import Link from 'next/link';
import { Camera, Globe, Video } from 'lucide-react';

const sitemapLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Our Story', href: '/story' },
  { label: 'Journal', href: '/journal' },
  { label: 'Brewing Guides', href: '#' },
  { label: 'Wholesale', href: '#' },
];

const socialLinks = [
  { Icon: Camera, label: 'Instagram', href: '#' },
  { Icon: Globe, label: 'Website', href: '#' },
  { Icon: Video, label: 'YouTube', href: '#' },
];

const legalLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Shipping', href: '#' },
];

export function Footer() {
  return (
    <footer className="w-full bg-muted border-t border-border/30 pt-16 md:pt-24 pb-10 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-gutter">
        {/* Main grid: single col on mobile, 12-col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-xl mb-16 md:mb-24">
          {/* Brand — col 4 */}
          <div className="md:col-span-4 flex flex-col space-y-6">
            <span className="text-2xl font-light tracking-tighter text-accent uppercase">
              Morning Mist
            </span>
            <p className="text-base text-muted-foreground font-light leading-relaxed">
              An exploration of sensory precision. Crafting stillness through
              artisanal coffee and ceramics.
            </p>
            <div className="flex space-x-6 pt-2">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Sitemap — col 3 */}
          <div className="md:col-span-3">
            <h5 className="text-xs text-primary tracking-[0.2em] uppercase mb-8 font-medium">
              Explore
            </h5>
            <ul className="flex flex-col space-y-4">
              {sitemapLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations — col 2 */}
          <div className="md:col-span-2">
            <h5 className="text-xs text-primary tracking-[0.2em] uppercase mb-8 font-medium">
              Locations
            </h5>
            <div className="flex flex-col space-y-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-foreground mb-1">
                  Portland
                </p>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  412 NW 13th Ave
                  <br />
                  Oregon, USA
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-foreground mb-1">
                  Kyoto
                </p>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  23-1 Nakagyo-ku
                  <br />
                  Kyoto, Japan
                </p>
              </div>
            </div>
          </div>

          {/* Inquiries — col 3 */}
          <div className="md:col-span-3">
            <h5 className="text-xs text-primary tracking-[0.2em] uppercase mb-8 font-medium">
              Inquiries
            </h5>
            <div className="flex flex-col space-y-4">
              <a
                href="mailto:hello@morningmist.coffee"
                className="text-base text-muted-foreground hover:text-primary transition-colors font-light"
              >
                hello@morningmist.coffee
              </a>
              <p className="text-base text-muted-foreground font-light">
                +1 234 567 890
              </p>
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/70 leading-relaxed">
                  Support Hours:
                  <br />
                  Mon—Fri 9am—5pm PST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 md:pt-12 border-t border-border/30 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60">
            © 2026 Morning Mist Coffee. Crafted for slow living.
          </p>
          <div className="flex space-x-8">
            {legalLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
