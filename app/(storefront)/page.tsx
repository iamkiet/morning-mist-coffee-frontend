import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Paintbrush, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSfhF3-krjMmBranRpxy2Zf_1dqU6-zYPNqrX6uXestvYx5Ps3kHZl-k8Kqm8Y72Ld3t1OR3IqHOVjRge2yijVuJQ3R0Z8ceQD6vy4wtFNs6q9QR0_tlceh__7BZigUdSnWgVVG2h4PG0q95tC7myWQ2QhHx6PmEOHqBryMrjdA8FydUgvPzV2mMvnAMuI-mkzA5XnUhddg8oTktDcT8XzX9vWOlgbuAD_RdN8UanFx1_KxKb9P8l3evroOR3Ubd2qlbfymC2BeOI"
            alt="Misty highland coffee plantation"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 md:px-gutter py-12 sm:py-16 md:py-20">
          <span className="text-primary tracking-[0.3em] mb-4 sm:mb-6 block uppercase text-xs sm:text-sm font-medium">
            Grown in Silence
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 sm:mb-8 leading-tight font-light">
            The Art of Living <br /> through the lens of Coffee.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 font-light">
            Todaywegrind is an exploration of sensory precision. We curate rare
            beans and artisanal ceramics to transform your morning routine into
            a meditative practice.
          </p>
          <Button
            asChild
            size="lg"
            className="px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-widest rounded-none"
          >
            <Link href="/shop">Shop the Collection</Link>
          </Button>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-12 sm:py-16 md:py-xl max-w-7xl mx-auto px-4 sm:px-6 md:px-gutter">
        <div className="flex flex-col mb-8 sm:mb-12 md:mb-xl">
          <span className="text-primary tracking-[0.2em] mb-2 sm:mb-4 uppercase text-xs font-medium">
            Curated Objects
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-foreground font-light">
            Featured Collections
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-gutter">
          {/* Large Feature */}
          <div className="md:col-span-7 group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden bg-card mb-6">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWbadIzgvuAbSrnaWcueBpAMHwtHukoxy2AYiZ1JsqRVRbAlWbElcqOGWOGyyDV4gZsftnYmWcigtls8SZXGI1W7wd4fTP9i7BI0wqRo8-O0eKqyLvAGH7aufjW-SazMkXyqejMzwXw0g1F0IXcj3N1-u31kD8_kuUwHv6SQB6pK6RaflABl0-p8aXd-NJMWsVDq-6Rq2izIHvSCdq3USUva9lONwqMrf-P9AEhwW9INAkJAdnuolP15iRWot9W14osQZwse62uuk"
                alt="Minimalist coffee brewing apparatus"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-lg sm:text-xl text-foreground mb-2 font-normal">
                  The Ethereal Series
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  Limited Edition Glassware
                </p>
              </div>
              <ArrowRight className="size-5 text-primary group-hover:translate-x-2 transition-transform duration-300 shrink-0" />
            </div>
          </div>
          {/* Column */}
          <div className="md:col-span-5 flex flex-col gap-gutter">
            <div className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden bg-card mb-4 sm:mb-6">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZQtGwrRNsn4ENNFSjECNF0e3d44uU0fvvF9_X3GdsAqKg8Qx35qEs0noq8h7Kf-TRySFS7-GS6l4bCLrJxUDKSe9uRqF3khdx03HUbhb829oh6lWDnZwXZxqX_0iiMOHJUWSFoQmoWM21vfnU28d_TD6OlF_Z0LqXQFQWuWcIYB3rsu_VmUQDaauRsLA9IkrZ1o14TkfYoSnIwssgT8aUYO1tJd2jCW5cgykAwcDvj3kGj3_Eyg_PE4eF9KOS3AVOfjheFd4aTJE"
                  alt="Roasted coffee beans"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-base sm:text-lg text-foreground mb-1 font-normal">
                Origin 01: Ethiopia
              </h3>
              <p className="text-sm text-muted-foreground font-light">
                Floral / Bergamot / Honey
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden bg-card mb-4 sm:mb-6">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGCY0lqdGenwYCBL8JEZn2cdmRNAcnsS-zKkrY15MwLT6msYGsE1SkmrOvUsOVVdt-lnWOSeujI8W98njqy6dsZ7L5XJXmgL9cUXg2bi-fj8VUKPwYJaBGcZvDXpJgtfV5zERZ_GaXuE2G_bgda6D5YSJfUsKYtVmBH3jr7npNbb0R9oB7GrtfGyhZ2kQl2BmkXoP7_FOxz1Ydl-K8F5ouDlHr6NXbbvSsRvI46P2C3kx6uGl8S3uT-1HZiKtMXynTYOBlwPK6A64"
                  alt="Minimalist sage and grey ceramic mugs"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-base sm:text-lg text-foreground mb-1 font-normal">
                The Morning Mist Set
              </h3>
              <p className="text-sm text-muted-foreground font-light">
                Hand-thrown Stoneware
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story / Philosophy */}
      <section className="bg-muted py-12 sm:py-16 md:py-xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-gutter grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-xl items-center">
          <div className="relative order-2 md:order-1">
            <div className="relative aspect-[3/4] overflow-hidden border-[8px] sm:border-[12px] md:border-[16px] border-white/50 shadow-sm">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYI7P2r_cpASZVX3FpoCKu05fAxq52v0Zht8kJM_46TtfMsAOjSraNT3uVY01jMf1iPNinKtC4C_1UZ-i9T8HqbUzob1yr4_2tkd7cSrv64VZSJKgt3Uq0dDuv5l1Bisxxq_hIZB5YsFGGOoPTWYIpHIwN87FG-XLa2zmqzEZf4iUfjxDgiXOCX8io861tvnWrJgW2wKDnM6a5qnDxbftJshCNiqFyRnmCNMf41rpCATV-OG0PdohHQJKAvbDi5ya6jMO_3MPmOHk"
                alt="Craftsman pouring coffee"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 sm:-bottom-8 md:-bottom-10 -right-6 sm:-right-8 md:-right-10 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-accent/20 blur-3xl" />
          </div>
          <div className="flex flex-col space-y-6 sm:space-y-8 order-1 md:order-2">
            <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium">
              The Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground font-light">
              Crafting the <br /> Silent Moments.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
              Todaywegrind Coffee was founded on the belief that coffee is not a
              commodity, but a choreography. We spend months sourcing beans from
              sustainable high-altitude farms, roasting them in small batches
              that respect the bean&apos;s inherent floral and fruit notes.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
              Our ceramics are collaborations with local potters, designed to
              feel weighted yet effortless in your palm—a physical anchor for
              your most peaceful time of day.
            </p>
            <Link
              href="/journal"
              className="inline-flex items-center text-primary uppercase tracking-widest group text-xs font-medium"
            >
              Read Our Journal
              <ArrowRight className="size-4 ml-2 sm:ml-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Feature Cards */}
      <section className="py-12 sm:py-16 md:py-32 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-md">
            {[
              {
                Icon: Leaf,
                title: 'Sustainable Sourcing',
                body: 'Direct trade partnerships that ensure fair compensation and ecological preservation through conscious selection.',
              },
              {
                Icon: Paintbrush,
                title: 'Artisanal Craft',
                body: 'Every vessel is hand-finished by master potters, making each piece in your collection a unique work of quiet art.',
              },
              {
                Icon: Settings2,
                title: 'Small Batch Roast',
                body: 'Roasting profiles developed with technical precision to highlight the complex terroir and floral notes of each origin.',
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="p-6 sm:p-8 md:p-12 bg-card border border-border/40 flex flex-col items-start text-left transition-all duration-500 hover:shadow-sm rounded-none"
              >
                <div className="w-12 h-12 bg-accent flex items-center justify-center mb-8 sm:mb-10 shrink-0 rounded-none">
                  <Icon className="size-6 text-white" />
                </div>
                <h4 className="text-base sm:text-lg md:text-xl uppercase tracking-[0.15em] text-foreground mb-4 sm:mb-6 font-normal">
                  {title}
                </h4>
                <div className="w-8 h-px bg-accent mb-4 sm:mb-6" />
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed tracking-wide font-light">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
