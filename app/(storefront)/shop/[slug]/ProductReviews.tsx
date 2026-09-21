import { fetchProductReviews } from '@/lib/api/product-reviews';
import { ReviewCard } from './ReviewCard';

export async function ProductReviews({ productId }: { productId: string }) {
  const { items } = await fetchProductReviews(productId);
  if (items.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-foreground border-b border-border pb-1 uppercase text-xs tracking-widest">
        Khách Hàng Nói Gì
      </h3>
      <div className="flex flex-col gap-4">
        {items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
