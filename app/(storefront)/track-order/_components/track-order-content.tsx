'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Search } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { OrderCard } from './order-card';
import { useLookupOrders } from '@/hooks/use-orders';

const trackOrderSchema = z.object({
  code: z.string().trim().uuid('Mã đơn hàng không hợp lệ'),
});

type TrackOrderForm = z.infer<typeof trackOrderSchema>;

export function TrackOrderContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code') ?? '';
  const lookup = useLookupOrders();
  const orders = lookup.data ?? null;
  const autoSubmitted = useRef(false);

  const form = useForm<TrackOrderForm>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { code: codeFromUrl },
  });

  function onSubmit(values: TrackOrderForm) {
    lookup.mutate(values.code);
  }

  // A link from the order confirmation email carries ?code=<orderId> — look it up right away
  const { mutate: lookupMutate } = lookup;
  useEffect(() => {
    if (autoSubmitted.current) return;
    const parsed = trackOrderSchema.safeParse({ code: codeFromUrl });
    if (!parsed.success) return;
    autoSubmitted.current = true;
    lookupMutate(parsed.data.code);
  }, [codeFromUrl, lookupMutate]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row sm:items-start gap-3 mb-8"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Mã đơn hàng"
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={lookup.isPending}
            className="gap-2 uppercase tracking-wider text-xs"
          >
            <Search className="size-4" />
            {lookup.isPending ? 'Đang tìm...' : 'Tìm kiếm'}
          </Button>
        </form>
      </Form>

      {lookup.isError && (
        <ErrorNotice className="mb-6">
          Đã xảy ra lỗi. Vui lòng thử lại sau.
        </ErrorNotice>
      )}

      {orders !== null &&
        (orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="size-10 mx-auto mb-4 opacity-40" />
            <p className="text-sm">
              Không tìm thấy đơn hàng nào khớp với mã đơn hàng này.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ))}
    </>
  );
}
