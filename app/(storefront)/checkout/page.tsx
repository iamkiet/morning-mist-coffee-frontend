'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Leaf, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
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
import { useCart } from '@/lib/cart';
import { createOrder } from '@/lib/api/orders';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
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

  const onSubmit = async (_data: CheckoutForm) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const totalCents = Math.round(total * 100);
      await createOrder(_data.email, totalCents);
      clearCart();
      toast.success('Order placed!', {
        description: "We've received your order and will process it shortly.",
      });
    } catch {
      setSubmitError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto pt-32 sm:pt-40 pb-12 px-4 sm:px-6 md:px-gutter min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Order Summary - left on desktop, top on mobile */}
        <div className="lg:col-span-5 order-first">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-sm uppercase tracking-widest font-medium">
                Order Summary
              </h2>

              {itemCount === 0 ? (
                <div className="flex flex-col items-center py-8 gap-3 text-center">
                  <ShoppingBag className="size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Your bag is empty.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="uppercase tracking-widest text-xs rounded-none"
                  >
                    <Link href="/shop">Browse Collection</Link>
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
                              className="size-5 flex items-center justify-center border border-border rounded text-muted-foreground hover:text-foreground transition-colors"
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
                              className="size-5 flex items-center justify-center border border-border rounded text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-sm font-medium text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.slug)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
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
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-primary italic">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-base font-medium pt-2 uppercase tracking-widest">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-accent/20 p-4 rounded-lg flex items-start gap-3">
                    <Leaf className="size-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-accent-foreground leading-relaxed uppercase tracking-tight">
                      Your order will be shipped in our signature 100%
                      compostable packaging.
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
              Checkout
            </h1>
            <p className="text-muted-foreground italic">
              Refining your morning ritual with care.
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
                    Shipping Information
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
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Julian" {...field} />
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
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Mist" {...field} />
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
                          Shipping Address
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="128 Serenity Lane" {...field} />
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
                          City
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Portland" {...field} />
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
                          Postal Code
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="97201" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                  {isSubmitting ? 'Placing Order...' : 'Complete Purchase'}
                </Button>
                <p className="text-center text-xs text-muted-foreground tracking-widest uppercase flex items-center justify-center gap-2">
                  <Lock className="size-3" />
                  Secure SSL encrypted transaction
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
