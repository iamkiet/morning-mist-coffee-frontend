import { Suspense } from "react";
import { ShopContent } from "./_components/shop-content";

export default function ShopPage() {
  return (
    <main className="pt-36 pb-xl px-4 sm:px-6 md:px-12 max-w-[1920px] mx-auto">
      <header className="mb-10 sm:mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-foreground font-light mb-4">
          The Whole Collection
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-light">
          Explore our curated selection of sustainably sourced beans and artisan equipment,
          designed for the mindful morning ritual.
        </p>
      </header>

      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <ShopContent />
      </Suspense>
    </main>
  );
}
