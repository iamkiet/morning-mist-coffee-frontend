import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Coffee, Thermometer, Leaf } from 'lucide-react';
import { Container } from '@/app/_components/Container';
import { fetchProduct } from '@/lib/api/products';
import { getProductAttributes } from '@/lib/product-attributes';
import { AddToBag } from './AddToBag';

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  const { roastLevel, processMethod, brewingNote, temperatureNote } =
    getProductAttributes(product.name);

  return (
    <Container navOffset className="pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[4/5] bg-muted rounded-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(85,98,84,0.1)] group">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply pointer-events-none" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src="/statics/detail_brewing.png"
                alt="Phương pháp pha chế"
                fill
                sizes="(max-width: 1024px) 50vw, 29vw"
                className="object-cover opacity-90"
              />
            </div>
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src="/statics/detail_enjoying.png"
                alt="Không gian thưởng thức"
                fill
                sizes="(max-width: 1024px) 50vw, 29vw"
                className="object-cover opacity-90"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center">
          <header className="mb-6">
            <span className="text-primary tracking-[0.2em] mb-2 block uppercase text-xs">
              Bộ Sưu Tập Đặc Sản (Reserve)
            </span>
            <h1 className="text-4xl md:text-5xl text-foreground mb-1">
              {product.name}
            </h1>
          </header>

          <div className="mb-12">
            <p className="text-muted-foreground leading-relaxed">
              {product.description ||
                'Một sự thể hiện tinh tế của bình minh nơi cao nguyên. Dòng sản phẩm giới hạn này được thu hoạch ở độ chín tối đa, mang lại sự trong trẻo, nhẹ nhàng đan xen giữa sương mai thanh khiết và hương hoa cỏ tao nhã.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-12">
            <div className="p-6 bg-card rounded-lg border border-border text-center">
              <span className="text-muted-foreground block mb-1 uppercase text-xs tracking-wider">
                Mức Độ Rang
              </span>
              <span className="text-primary font-medium">{roastLevel}</span>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border text-center">
              <span className="text-muted-foreground block mb-1 uppercase text-xs tracking-wider">
                Phương Pháp Chế Biến
              </span>
              <span className="text-primary font-medium">{processMethod}</span>
            </div>
          </div>

          <div className="mb-12 space-y-2">
            <h3 className="text-foreground border-b border-border pb-1 uppercase text-xs tracking-wider">
              Hướng Dẫn Pha Chế
            </h3>
            <div className="flex items-start gap-6 py-2">
              <Coffee className="size-5 text-primary shrink-0" />
              <p className="text-muted-foreground text-sm">{brewingNote}</p>
            </div>
            <div className="flex items-start gap-6 py-2">
              <Thermometer className="size-5 text-primary shrink-0" />
              <p className="text-muted-foreground text-sm">{temperatureNote}</p>
            </div>
          </div>

          <div className="space-y-6">
            <AddToBag product={product} />
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Leaf className="size-3.5" />
              <span>
                Nguồn cung ứng có trách nhiệm &amp; Bao bì tự phân hủy
              </span>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
