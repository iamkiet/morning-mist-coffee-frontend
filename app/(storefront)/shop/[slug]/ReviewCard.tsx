'use client';

import { Star } from 'lucide-react';
import type { ProductReview, ProductReviewReply } from '@/lib/types';

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

function ReplyItem({ reply }: { reply: ProductReviewReply }) {
  const date = new Date(reply.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="pl-4 border-l-2 border-border space-y-1">
      <p className="text-xs font-medium text-primary uppercase tracking-wider">
        {reply.authorName || 'Phản hồi từ Morning Mist Coffee'}
      </p>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {reply.replyText}
      </p>
      <p className="text-xs text-muted-foreground/70">{date}</p>
    </div>
  );
}

export function ReviewCard({ review }: { review: ProductReview }) {
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

      {review.replies.length > 0 && (
        <div className="space-y-3 pt-2">
          {review.replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
