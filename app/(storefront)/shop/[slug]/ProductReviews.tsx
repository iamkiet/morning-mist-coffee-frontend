import { Star } from 'lucide-react';
import { fetchProductReviews } from '@/lib/api/order-reviews';
import type { OrderReview } from '@/lib/types';

function ReviewStars({ rating }: { rating: number | null }) {
  if (rating === null) return null;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating ? 'fill-primary text-primary' : 'text-border'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: OrderReview }) {
  const date = new Date(review.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-6 bg-card rounded-xl border border-border space-y-3">
      <ReviewStars rating={review.rating} />
      <p className="text-muted-foreground text-sm leading-relaxed">
        {review.commentText}
      </p>
      <p className="text-xs text-muted-foreground/70">{date}</p>
    </div>
  );
}

export async function ProductReviews({ productId }: { productId: string }) {
  const { items } = await fetchProductReviews(productId);
  if (items.length === 0) return null;

  return (
    <div className="mt-16 space-y-6">
      <h3 className="text-foreground border-b border-border pb-1 uppercase text-xs tracking-widest">
        Khách Hàng Nói Gì
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
