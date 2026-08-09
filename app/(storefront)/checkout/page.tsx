'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Leaf, ShoppingBag, Minus, Plus, Trash2, Coins } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Container } from '@/app/_components/Container';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { useCart } from '@/lib/cart';
import { useCreateOrder } from '@/hooks/use-orders';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  email: z.string().email('Vui lòng nhập email hợp lệ'),
  fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
  address: z.string().min(5, 'Vui lòng nhập địa chỉ nhận hàng chi tiết'),
  city: z.string().min(1, 'Tỉnh / Thành phố là bắt buộc'),
  postalCode: z.string().min(3, 'Mã bưu chính là bắt buộc'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, itemCount, total, updateQuantity, removeItem, clearCart } =
    useCart();

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
    },
  });

  // Only cash-on-pickup is supported today — no payment gateway is integrated
  const createOrder = useCreateOrder();

  const submitError = createOrder.isError
    ? createOrder.error instanceof Error
      ? createOrder.error.message
      : 'Đặt hàng thất bại. Vui lòng thử lại sau.'
    : '';

  const onSubmit = (data: CheckoutForm) => {
    const nameParts = data.fullName.trim().split(/\s+/);
    const shippingLastName = nameParts.pop() ?? data.fullName;
    const shippingFirstName = nameParts.join(' ') || shippingLastName;

    createOrder.mutate(
      {
        email: data.email,
        totalCents: Math.round(total),
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          priceCents: Math.round(item.price),
          quantity: item.quantity,
        })),
        shippingFirstName,
        shippingLastName,
        shippingAddress: data.address,
        shippingCity: data.city,
        shippingPostalCode: data.postalCode,
      },
      {
        onSuccess: () => {
          clearCart();
          form.reset();
          toast.success('Đặt hàng thành công!', {
            description:
              'Chúng tôi đã nhận được đơn hàng của bạn và đang tiến hành xử lý.',
          });
        },
      },
    );
  };

  return (
    <Container navOffset className="pb-12 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Order Summary - left on desktop, top on mobile */}
        <div className="lg:col-span-5 order-first">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-sm uppercase tracking-widest font-medium">
                Tóm Tắt Đơn Hàng
              </h2>

              {itemCount === 0 ? (
                <div className="flex flex-col items-center py-8 gap-3 text-center">
                  <ShoppingBag className="size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Giỏ hàng của bạn đang trống.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="uppercase tracking-wider text-xs rounded-lg"
                  >
                    <Link href="/shop">Khám Phá Bộ Sưu Tập</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex space-x-4 items-center"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.slug, item.quantity - 1)
                              }
                              className="size-5 flex items-center justify-center border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="text-xs text-muted-foreground w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.slug, item.quantity + 1)
                              }
                              className="size-5 flex items-center justify-center border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                          </span>
                          <button
                            onClick={() => removeItem(item.slug)}
                            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tạm tính</span>
                      <span>{total.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Vận chuyển</span>
                      <span className="text-primary italic">Miễn phí</span>
                    </div>
                    <div className="flex justify-between text-base font-medium pt-2 uppercase tracking-widest">
                      <span>Tổng cộng</span>
                      <span>{total.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  </div>
                  <div className="bg-accent/20 p-4 rounded-lg flex items-start gap-3">
                    <Leaf className="size-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-accent-foreground leading-relaxed uppercase tracking-tight">
                      Đơn hàng của bạn sẽ được giao trong bao bì tự phân hủy sinh học 100% đặc trưng của chúng tôi.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Checkout Form - right on desktop, bottom on mobile */}
        <div className="lg:col-span-7 order-last space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl text-primary mb-2 font-light">
              Thanh Toán
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-accent uppercase tracking-widest">
                    01
                  </span>
                  <h2 className="text-sm uppercase tracking-widest font-medium">
                    Thông Tin Giao Nhận
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                          Họ và Tên
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Họ và tên của bạn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                          Địa chỉ nhận hàng
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Số nhà, tên đường, phường/xã..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                          Tỉnh / Thành phố
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Tên Tỉnh hoặc Thành phố" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                          Mã bưu chính
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Mã bưu điện" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-accent uppercase tracking-widest">
                    02
                  </span>
                  <h2 className="text-sm uppercase tracking-widest font-medium">
                    Phương Thức Thanh Toán
                  </h2>
                </div>

                <div className="border-2 border-primary bg-primary/5 text-primary p-4 rounded-xl flex flex-col items-center justify-center gap-2">
                  <Coins className="size-6 animate-pulse" />
                  <span className="text-xs uppercase tracking-wider font-semibold">
                    Thanh Toán Tiền Mặt Khi Nhận Hàng
                  </span>
                </div>
              </section>

              <div className="space-y-3">
                {submitError && (
                  <ErrorNotice className="mb-0">{submitError}</ErrorNotice>
                )}
                <Button
                  type="submit"
                  disabled={createOrder.isPending || itemCount === 0}
                  className="w-full uppercase tracking-wider h-12"
                  size="lg"
                >
                  {createOrder.isPending
                    ? 'Đang xử lý đặt hàng...'
                    : 'Hoàn Tất Đặt Hàng'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Container>
  );
}
