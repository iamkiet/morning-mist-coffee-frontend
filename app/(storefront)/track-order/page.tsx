import { Suspense } from 'react';
import { Container } from '@/app/_components/Container';
import { TrackOrderIntro } from './_components/track-order-intro';
import { TrackOrderContent } from './_components/track-order-content';

export default function TrackOrderPage() {
  return (
    <Container size="narrow" navOffset className="pb-16 min-h-screen">
      <TrackOrderIntro />
      <Suspense fallback={null}>
        <TrackOrderContent />
      </Suspense>
    </Container>
  );
}
