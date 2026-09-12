'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useCreateOrderReviewReply } from '@/hooks/use-order-reviews';
import type { OrderReview, OrderReviewReply } from '@/lib/types';

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

function replyLabel(reply: OrderReviewReply): string {
  if (reply.authorType === 'customer') return reply.authorName || 'Khách hàng';
  return 'Phản hồi từ Morning Mist Coffee';
}

function ReplyItem({ reply }: { reply: OrderReviewReply }) {
  const date = new Date(reply.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="pl-4 border-l-2 border-border space-y-1">
      <p className="text-xs font-medium text-primary uppercase tracking-wider">
        {replyLabel(reply)}
      </p>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {reply.replyText}
      </p>
      <p className="text-xs text-muted-foreground/70">{date}</p>
    </div>
  );
}

const replySchema = z.object({
  authorName: z.string().max(100).optional(),
  replyText: z.string().min(2).max(1000),
});

type ReplyForm = z.infer<typeof replySchema>;

function ReviewReplyForm({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const create = useCreateOrderReviewReply();
  const form = useForm<ReplyForm>({
    resolver: zodResolver(replySchema),
    defaultValues: { authorName: '', replyText: '' },
  });

  function onSubmit(values: ReplyForm) {
    create.mutate(
      { reviewId, payload: values },
      {
        onSuccess: () => {
          toast.success('Đã gửi phản hồi của bạn');
          form.reset({ authorName: '', replyText: '' });
          setOpen(false);
          router.refresh();
        },
      },
    );
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-xs uppercase tracking-wider text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        Trả lời
      </Button>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 pt-1">
        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Tên của bạn (không bắt buộc)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="replyText"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Viết phản hồi..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            className="uppercase tracking-wider text-xs"
            disabled={create.isPending}
          >
            {create.isPending ? 'Đang gửi…' : 'Gửi'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="uppercase tracking-wider text-xs"
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ReviewCard({ review }: { review: OrderReview }) {
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

      <ReviewReplyForm reviewId={review.id} />
    </div>
  );
}
