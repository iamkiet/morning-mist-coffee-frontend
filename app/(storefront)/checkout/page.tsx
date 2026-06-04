'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Leaf, ShoppingBag, Minus, Plus, Trash2, CheckCircle, CreditCard, Coins } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { useCart } from '@/lib/cart';
import { createOrder, type Order } from '@/lib/api/orders';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  email: z.string().email('Vui lòng nhập email hợp lệ'),
  firstName: z.string().min(1, 'Họ và tên đệm là bắt buộc'),
  lastName: z.string().min(1, 'Tên là bắt buộc'),
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
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const cashReceivedAmount = parseFloat(cashReceived) || 0;
  const changeAmount = paymentMethod === 'cash' && cashReceivedAmount >= total
    ? cashReceivedAmount - total
    : 0;

  const onSubmit = async (_data: CheckoutForm) => {
    setIsSubmitting(true);
    setSubmitError('');

    if (paymentMethod === 'cash' && cashReceivedAmount < total) {
      setSubmitError('Số tiền khách đưa không đủ để thanh toán đơn hàng');
      setIsSubmitting(false);
      return;
    }

    try {
      const totalCents = Math.round(total);
      const orderItems = items.map((item) => ({
        productId: item.id,
        name: item.name,
        priceCents: Math.round(item.price),
        quantity: item.quantity,
      }));
      const cashReceivedCents = paymentMethod === 'cash' ? Math.round(cashReceivedAmount) : undefined;
      const order = await createOrder(_data.email, totalCents, orderItems, 'VND', cashReceivedCents);
      clearCart();
      setPlacedOrder(order);
      toast.success('Đặt hàng thành công!', {
        description: "Chúng tôi đã nhận được đơn hàng của bạn và đang tiến hành xử lý.",
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Đặt hàng thất bại. Vui lòng thử lại sau.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <main className="max-w-xl mx-auto pt-36 pb-12 px-4 sm:px-6 min-h-screen flex flex-col justify-center animate-in fade-in duration-500">
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-primary mb-4">
              <CheckCircle className="size-10 text-primary" />
            </div>
            <h1 className="text-3xl text-primary font-light">Đặt Hàng Thành Công!</h1>
            <p className="text-muted-foreground text-sm">
              Cảm ơn bạn đã mua sắm tại <strong>Morning Mist Coffee</strong>. Đơn hàng của bạn đã được nhận và đang chuẩn bị.
            </p>
            <div className="border border-border rounded-lg p-5 text-left space-y-4 bg-muted/20">
              <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-widest">
                <span>Mã đơn hàng:</span>
                <span className="font-mono text-foreground font-medium">#{placedOrder.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                {placedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
                    <span>{(item.priceCents * item.quantity).toLocaleString('vi-VN')} ₫</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Tổng cộng:</span>
                <span>{placedOrder.totalCents.toLocaleString('vi-VN')} ₫</span>
              </div>
              {placedOrder.cashReceivedCents !== null && placedOrder.cashReceivedCents !== undefined && (
                <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t border-dashed border-border">
                  <div className="flex justify-between">
                    <span>Tiền nhận từ khách:</span>
                    <span>{placedOrder.cashReceivedCents.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiền thối lại:</span>
                    <span className="font-medium text-foreground">{(placedOrder.changeCents ?? 0).toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild variant="outline" className="flex-1 uppercase tracking-widest text-xs h-11">
                <Link href="/shop">Tiếp tục mua sắm</Link>
              </Button>
              <Button asChild className="flex-1 uppercase tracking-widest text-xs h-11">
                <Link href="/track-order">Theo dõi đơn hàng</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto pt-36 pb-12 px-4 sm:px-6 md:px-gutter min-h-screen">
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
                    className="uppercase tracking-widest text-xs rounded-lg"
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
                              className="size-5 flex items-center justify-center border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                              className="size-5 flex items-center justify-center border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
            <p className="text-muted-foreground italic">
              Chăm chút tỉ mỉ cho nghi thức sáng lành của bạn.
            </p>
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
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                          Họ và tên đệm
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Tên họ đệm của bạn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                          Tên
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Tên của bạn" {...field} />
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

                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod('cash')}
                    className={`border-2 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-border-hover bg-card text-muted-foreground'
                    }`}
                  >
                    <Coins className="size-6 animate-pulse" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Tiền Mặt (Cash)</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`border-2 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-border-hover bg-card text-muted-foreground'
                    }`}
                  >
                    <CreditCard className="size-6" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Thanh Toán Thẻ</span>
                  </div>
                </div>

                {paymentMethod === 'cash' && (
                  <div className="bg-muted/30 p-5 rounded-xl border border-border space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="cash-received" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Tiền nhận từ khách (VNĐ)
                      </Label>
                      <Input
                        id="cash-received"
                        type="number"
                        placeholder="Nhập số tiền khách đưa..."
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        className="bg-card font-medium"
                      />
                    </div>
                    {cashReceivedAmount > 0 && (
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-border/40">
                        <span className="text-muted-foreground">Tiền thối lại (Change):</span>
                        <span className={`text-base font-semibold ${cashReceivedAmount >= total ? 'text-primary' : 'text-destructive'}`}>
                          {cashReceivedAmount >= total
                            ? `${changeAmount.toLocaleString('vi-VN')} ₫`
                            : 'Chưa đủ tiền thanh toán'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </section>

              <div className="space-y-3">
                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || itemCount === 0}
                  className="w-full uppercase tracking-wider h-12"
                  size="lg"
                >
                  {isSubmitting ? 'Đang xử lý đặt hàng...' : 'Hoàn Tất Đặt Hàng'}
                </Button>
                <p className="text-center text-xs text-muted-foreground tracking-widest uppercase flex items-center justify-center gap-2">
                  <Lock className="size-3" />
                  Giao dịch an toàn mã hóa SSL
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
