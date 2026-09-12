'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { useCreateOrderReview } from '@/hooks/use-order-reviews';

const reviewSchema = z.object({
  orderId: z.string().trim().uuid('Mã đơn hàng không hợp lệ'),
  rating: z.number().int().min(1, 'Vui lòng chọn số sao đánh giá').max(5),
  commentText: z
    .string()
    .min(10, 'Vui lòng nhập tối thiểu 10 ký tự')
    .max(2000, 'Tối đa 2000 ký tự'),
});

type ReviewForm = z.infer<typeof reviewSchema>;

function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: 5 }, (_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} sao`}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}
            className="p-0.5"
          >
            <Star
              className={`size-6 transition-colors ${
                star <= active ? 'fill-primary text-primary' : 'text-border'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const create = useCreateOrderReview();
  const form = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { orderId: '', rating: 0, commentText: '' },
  });

  function onSubmit(values: ReviewForm) {
    create.mutate(
      {
        productId,
        orderId: values.orderId,
        rating: values.rating,
        commentText: values.commentText,
        source: 'app',
      },
      {
        onSuccess: () => {
          toast.success('Cảm ơn bạn đã gửi đánh giá!');
          form.reset({ orderId: '', rating: 0, commentText: '' });
          router.refresh();
        },
      },
    );
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border space-y-4">
      <h4 className="text-foreground text-sm uppercase tracking-widest font-medium">
        Viết Đánh Giá Của Bạn
      </h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã đơn hàng</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mã đơn hàng trong email xác nhận đơn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đánh giá</FormLabel>
                <FormControl>
                  <RatingInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commentText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cảm nhận của bạn</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {create.isError && (
            <ErrorNotice className="mb-0">
              {create.error.message || 'Không thể gửi đánh giá. Vui lòng thử lại.'}
            </ErrorNotice>
          )}
          <Button
            type="submit"
            size="lg"
            className="uppercase tracking-wider text-xs"
            disabled={create.isPending}
          >
            {create.isPending ? 'Đang gửi…' : 'Gửi Đánh Giá'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
