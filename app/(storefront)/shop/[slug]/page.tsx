import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Coffee, Thermometer, Leaf } from 'lucide-react';
import { Container } from '@/app/_components/Container';
import { Badge } from '@/components/ui/badge';
import { fetchProduct } from '@/lib/api/products';
import { AddToBag } from './AddToBag';

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  return (
    <Container className="pt-32 pb-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-7 space-y-md">
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
          <div className="grid grid-cols-2 gap-md">
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

        {(() => {
          const isRobusta = ['Tĩnh Lặng Ban Trưa', 'Hồn Đất Tây Nguyên', 'Hoài Niệm Phố Cổ', 'Gió Mùa Ấn Độ', 'Sumatra Rừng Già', 'Đại Ngàn Hùng Vĩ', 'Bugisu Hoang Dã'].some(name => product.name.includes(name));

          let roastLevel = 'Rang Sáng (Light)';
          if (product.name.includes('Đậm') || product.name.includes('Đại Ngàn') || product.name.includes('Bugisu')) {
            roastLevel = 'Rang Đậm (Dark)';
          } else if (product.name.includes('Trưa') || product.name.includes('Hoài Niệm') || product.name.includes('Mật Ong') || product.name.includes('Ấn Độ') || product.name.includes('Sumatra') || product.name.includes('Nam Mỹ')) {
            roastLevel = 'Rang Vừa (Medium)';
          }

          let processMethod = 'Washed (Sơ Chế Ướt)';
          if (product.name.includes('Mật Ong')) {
            processMethod = 'Honey (Sơ Chế Mật Ong)';
          } else if (product.name.includes('Nam Mỹ') || product.name.includes('Tự Nhiên')) {
            processMethod = 'Natural (Sơ Chế Khô)';
          } else if (product.name.includes('Ấn Độ') || product.name.includes('Gió Mùa')) {
            processMethod = 'Monsooned (Phơi Gió Mùa)';
          } else if (product.name.includes('Sumatra') || product.name.includes('Rừng Già')) {
            processMethod = 'Wet-Hulled (Giling Basah)';
          }

          return (
            <div className="lg:col-span-5 flex flex-col justify-center">
              <header className="mb-md">
                <span className="text-primary tracking-[0.2em] mb-2 block uppercase text-xs">
                  Bộ Sưu Tập Đặc Sản (Reserve)
                </span>
                <h1 className="text-4xl md:text-5xl text-foreground mb-1">
                  {product.name}
                </h1>
                <p className="text-muted-foreground font-light">
                  Nguồn Gốc: {product.origin}
                </p>
              </header>

              <div className="mb-lg">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'Một sự thể hiện tinh tế của bình minh nơi cao nguyên. Dòng sản phẩm giới hạn này được thu hoạch ở độ chín tối đa, mang lại sự trong trẻo, nhẹ nhàng đan xen giữa sương mai thanh khiết và hương hoa cỏ tao nhã.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-lg">
                <div className="p-md bg-card rounded-lg border border-border text-center">
                  <span className="text-muted-foreground block mb-1 uppercase text-xs tracking-wider">
                    Mức Độ Rang
                  </span>
                  <span className="text-primary font-medium">{roastLevel}</span>
                </div>
                <div className="p-md bg-card rounded-lg border border-border text-center">
                  <span className="text-muted-foreground block mb-1 uppercase text-xs tracking-wider">
                    Phương Pháp Chế Biến
                  </span>
                  <span className="text-primary font-medium">{processMethod}</span>
                </div>
                <div className="col-span-2 p-md bg-card rounded-lg border border-border flex flex-col items-center">
                  <span className="text-muted-foreground block mb-2 uppercase text-xs tracking-wider">
                    Nốt Hương Đặc Trưng
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {product.notes.length > 0 ? (
                      product.notes.map((note) => (
                        <Badge
                          key={note}
                          variant="outline"
                          className="uppercase tracking-wider text-[11px]"
                        >
                          {note}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="uppercase tracking-wider text-[11px]">
                        Thơm Ngát • Đặc Trưng
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-lg space-y-2">
                <h3 className="text-foreground border-b border-border pb-1 uppercase text-xs tracking-wider">
                  Nghi Thức Pha Chế
                </h3>
                <div className="flex items-start gap-md py-2">
                  <Coffee className="size-5 text-primary shrink-0" />
                  <p className="text-muted-foreground text-sm">
                    {isRobusta
                      ? 'Thưởng thức trọn vẹn nhất với phin pha truyền thống hoặc máy Espresso để cảm nhận lớp crema sánh mịn cùng vị đắng đậm đà.'
                      : 'Phù hợp nhất cho phương pháp pha Pour Over (phễu lọc V60 hoặc Chemex) để cảm nhận trọn vẹn hương hoa thanh tao và hậu vị chua dịu tinh tế.'}
                  </p>
                </div>
                <div className="flex items-start gap-md py-2">
                  <Thermometer className="size-5 text-primary shrink-0" />
                  <p className="text-muted-foreground text-sm">
                    {isRobusta
                      ? 'Nên dùng nước sôi từ 90°C - 95°C để chiết xuất trọn vẹn vị đậm sâu và hương thơm nồng nàn.'
                      : 'Nên dùng nước mềm ở nhiệt độ 92°C để lưu giữ tốt nhất độ chua thanh tự nhiên của hạt.'}
                  </p>
                </div>
              </div>

              <div className="space-y-md">
                <AddToBag product={product} />
                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Leaf className="size-3.5" />
                  <span>Nguồn cung ứng có trách nhiệm &amp; Bao bì tự phân hủy</span>
                </p>
              </div>
            </div>
          );
        })()}
      </div>
    </Container>
  );
}
