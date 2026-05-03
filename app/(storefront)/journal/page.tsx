import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const articles = [
  {
    date: "Oct 24, 2024",
    category: "Roastery",
    categoryClass: "bg-accent/20 text-accent-foreground",
    title: "The Alchemy of the Light Roast",
    body: "Exploring the delicate balance required to preserve floral acidity while developing deep sweetness in Ethiopian heirloom varieties.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl_57By8KpPbF48CuhXYe9ODWW8d8uWDvZfhYZoQeLYkz79MIgmvh1HKr4Rby_OSEiVfzRIwcb71cibzA43gmKTHNUCDHReN_i-JuxSeeCwBYarDdduBq90vH-sPci6GoPZAzLl7bNa6eWA_gAb1i0TxzhdS01JtePFdLez5JdN74dWxui5I5HrNUp67xj6PmOEW-veiHDK7dlV_lIXlcgE-Gc3z5FtCXS-HVSgk577c0ZgnDTOSsAEEj7XczFAFwey12jip5ugTw",
  },
  {
    date: "Oct 18, 2024",
    category: "Brew Rituals",
    categoryClass: "bg-primary/10 text-primary",
    title: "Architecture of the Morning Pour",
    body: "A guide to the geometric precision of the V60 method, focusing on temperature stability and the rhythm of the bloom.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbRJKd8DDfCjazsjEOCzW3zN3Pm9w2Q3fZ5-As907pXHfEipH9e6cB-1yEDEGRjzCwIBLGBrKctd9x9ow5zUa-tD5XdVB2vqywp-rK4jS8xu8CjIkQ2Ve5v0QNL_cKN9md6EC49P_lZ3TTYUISxXaSOAGcB2MUDKX2CZvMo8bq2wOWue3scAP9QpZMdg8-w3Hn958wofsklLr1gRNDDvCtwfrvwHPSkoSvcIJP5XjOq0JZcukiccNIhhOqa4IDAQAufIWNZ5uG88s",
  },
  {
    date: "Oct 12, 2024",
    category: "Provenance",
    categoryClass: "bg-muted text-muted-foreground",
    title: "Shadow and Soil: The Terroir of Huila",
    body: "Tracing the mineral-rich volcanic soils of Colombia's Huila region and how shade-grown practices alter bean density.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbifeXvfG8KnZvU0VFdkZOzhGcFj_kqeiFpZ9wfrggND9sKIPe7bi0WTnff2z16Z0Pq90uPzu0AsBFwTYxuvGuv4j4LgU2r-JEbJ8heG0X6Bfi2sd4saiKnuB3luLs6CSX9qfLCt4KpBrBae-XGZkqOR1kkCoOj6_EQJncEfjlH6h0naAgoCpq3nxFA9TsiqxQGPXdUHMwzHdeaS47zIFvAvDtw5dTBsxPT8z77lXPCn7NrVRhyuCbQa0_nKhyeaM6Ll4kcRKX_wY",
  },
];

const filters = ["All", "Provenance", "Brewing", "Roastery"];

export default function JournalPage() {
  return (
    <main className="pt-16 sm:pt-24 bg-background">
      {/* Hero */}
      <section className="relative h-[600px] sm:h-[819px] w-full overflow-hidden flex items-center px-4 sm:px-8 md:px-12 max-w-[1920px] mx-auto">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPaacO7tQx3YPcRFDHlHh8s_p6Ok8T8z7t-HLYOpfsfc_Cw-TfeexNmazgrggtmknuiqgFVxupxjWGYPIlP03ahhgDcOklPYYnCpeS_2X4tLkum7dmQz90MsZAVqD4t6054vkVY5h6XELAN923wSHuCu_mJb-hs6wO7zzPYMnK72FCsX7Bv3jUPAWDnZjyDAGePJQJvP49x0cvq0zkFM10cBeJSDRXxSqeG1CLzK9AUpMqcBh5vk7FPS4EsdtwWdA8aRJnXnLPAsE"
            alt="Misty coffee plantation"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-95 grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-foreground/10" />
        </div>
        <div className="relative z-10 max-w-2xl bg-white/40 backdrop-blur-md p-6 sm:p-12 shadow-[0_40px_100px_-20px_rgba(169,183,166,0.15)]">
          <span className="text-xs text-primary mb-4 block uppercase tracking-widest font-medium">
            Featured Story
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-foreground mb-6 tracking-tight font-light">
            The Ritual of Sourcing
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed font-light">
            Beyond the bean lies a quiet journey of precision and patience. We travel to the world&apos;s most remote high-altitude farms to curate a sensory experience that begins long before the first pour.
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-3 text-xs border-b border-foreground pb-1 hover:opacity-60 transition-opacity uppercase tracking-widest"
          >
            Read Story
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="w-full px-4 sm:px-8 md:px-12 py-12 sm:py-16 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border max-w-[1920px] mx-auto">
        <div>
          <h2 className="text-2xl sm:text-3xl text-foreground font-light">Journal</h2>
          <p className="text-sm text-muted-foreground mt-2 italic font-light">
            A collection of slow thoughts and sensory observations.
          </p>
        </div>
        <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`text-xs uppercase tracking-widest pb-1 transition-colors cursor-pointer whitespace-nowrap ${
                i === 0
                  ? "text-foreground border-b border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Article Grid */}
      <section className="px-4 sm:px-8 md:px-12 py-16 sm:py-24 max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24">
          {articles.map((a) => (
            <article key={a.title} className="group cursor-pointer">
              <div className="relative aspect-[4/5] mb-6 sm:mb-8 overflow-hidden bg-muted">
                <Image
                  src={a.img}
                  alt={a.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{a.date}</span>
                  <span className={`px-3 py-1 text-[10px] uppercase tracking-tight font-medium ${a.categoryClass}`}>
                    {a.category}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg group-hover:text-primary transition-colors font-normal leading-snug">
                  {a.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 font-light leading-relaxed">
                  {a.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 bg-muted">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1">
            <span className="text-xs text-primary mb-4 block uppercase tracking-widest font-medium">
              Stay Connected
            </span>
            <h2 className="text-2xl sm:text-3xl mb-4 font-light">
              Journal Updates
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
              Receive bi-weekly reflections on coffee culture, brewing techniques, and new harvest arrivals directly in your inbox.
            </p>
          </div>
          <div className="flex-1 w-full">
            <form className="relative">
              <Input
                className="w-full bg-transparent border-0 border-b border-border rounded-none pl-0 pr-12 py-4 text-sm tracking-widest uppercase focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50"
                placeholder="email address"
                type="email"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 bottom-1 text-primary hover:text-foreground"
                aria-label="Subscribe"
              >
                <ArrowRight className="size-5" />
              </Button>
            </form>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground">
              Respecting your space. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
