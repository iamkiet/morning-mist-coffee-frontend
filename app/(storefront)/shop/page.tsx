import { Container } from '@/app/_components/Container';
import { Suspense } from 'react';
import { ShopIntro } from './_components/shop-intro';
import { ShopContent } from './_components/shop-content';
import { ProductGridSkeleton } from './_components/product-grid-skeleton';

export default function ShopPage() {
  return (
    <Container navOffset className="pb-20">
      <ShopIntro />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ShopContent />
      </Suspense>
    </Container>
  );
}
