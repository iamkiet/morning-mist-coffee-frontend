import { Container } from '@/app/_components/Container';
import { Hero } from '@/app/_components/Hero';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Paintbrush, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <>
      <Hero
        image="/statics/home-hero.jpg"
        imageAlt="Misty highland coffee plantation"
        imageClassName="object-cover opacity-70"
      >
        <div className="py-12 sm:py-16 md:py-20">
          <span className="text-primary tracking-[0.3em] mb-4 sm:mb-6 block uppercase text-xs sm:text-sm font-medium">
            Nuôi Dưỡng Trong Tĩnh Lặng
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 sm:mb-8 leading-tight font-light">
            Nghệ Thuật Sống <br /> Qua Lăng Kính Cà Phê.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 font-light">
            Morning Mist là cuộc thám hiểm của sự chính xác giác quan. Chúng tôi tuyển chọn những hạt cà phê quý hiếm và tác phẩm gốm sứ thủ công để biến thói quen buổi sáng của bạn thành một khoảnh khắc thiền định yên bình.
          </p>
          <Button
            asChild
            size="lg"
            className="px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-wider rounded-lg"
          >
            <Link href="/shop">Mua Ngay Bộ Sưu Tập</Link>
          </Button>
        </div>
      </Hero>

      {/* Featured Collections */}
      <Container as="section" className="py-12 sm:py-16 md:py-20">
        <div className="flex flex-col mb-8 sm:mb-12 md:mb-20">
          <span className="text-primary tracking-[0.2em] mb-2 sm:mb-4 uppercase text-xs font-medium">
            Tác Phẩm Tuyển Chọn
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-foreground font-light">
            Bộ Sưu Tập Nổi Bật
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-gutter">
          {/* Large Feature */}
          <div className="md:col-span-7 group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden bg-card mb-6">
              <Image
                src="/statics/ethereal_glass.png"
                alt="Minimalist coffee brewing apparatus"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-lg sm:text-xl text-foreground mb-2 font-normal">
                  Dòng Sản Phẩm Ethereal
                </h3>
                <p className="text-sm text-muted-foreground font-light">
                  Đồ Thủy Tinh Phiên Bản Giới Hạn
                </p>
              </div>
              <ArrowRight className="size-5 text-primary group-hover:translate-x-2 transition-transform duration-300 shrink-0" />
            </div>
          </div>
          {/* Column */}
          <div className="md:col-span-5 flex flex-col gap-gutter">
            <div className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden bg-card mb-4 sm:mb-6">
                <Image
                  src="/statics/roasted_beans.png"
                  alt="Roasted coffee beans"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-base sm:text-lg text-foreground mb-1 font-normal">
                Nguồn Gốc 01: Ethiopia
              </h3>
              <p className="text-sm text-muted-foreground font-light">
                Hương Hoa / Cam Bergamot / Mật Ong
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden bg-card mb-4 sm:mb-6">
                <Image
                  src="/statics/ceramic_mugs.png"
                  alt="Minimalist sage and grey ceramic mugs"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-base sm:text-lg text-foreground mb-1 font-normal">
                Bộ Ly Tách Morning Mist
              </h3>
              <p className="text-sm text-muted-foreground font-light">
                Gốm Sứ Thủ Công Rang Mộc
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Our Story / Philosophy */}
      <section className="bg-muted py-12 sm:py-16 md:py-20 overflow-hidden">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center">
          <div className="relative order-2 md:order-1">
            <div className="relative aspect-[3/4] overflow-hidden border-[8px] sm:border-[12px] md:border-[16px] border-white/50 shadow-sm">
              <Image
                src="/statics/pouring_coffee.png"
                alt="Craftsman pouring coffee"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 sm:-bottom-8 md:-bottom-10 -right-6 sm:-right-8 md:-right-10 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-accent/20 blur-3xl" />
          </div>
          <div className="flex flex-col space-y-6 sm:space-y-8 order-1 md:order-2">
            <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium">
              Triết Lý Của Chúng Tôi
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground font-light">
              Kiến Tạo <br /> Những Khoảnh Khắc Tĩnh Lặng.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
              Morning Mist Coffee được thành lập trên niềm tin rằng cà phê không đơn thuần là một sản phẩm thương mại, mà là một vũ điệu của nghệ thuật. Chúng tôi dành hàng tháng trời để tìm kiếm những hạt cà phê từ các trang trại vùng cao bền vững, rang chúng theo từng mẻ nhỏ nhằm tôn vinh hương hoa quả tự nhiên vốn có của hạt.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
              Các tác phẩm gốm sứ của chúng tôi là sự hợp tác với các nghệ nhân gốm địa phương, được thiết kế để mang lại cảm giác đằm tay nhưng vô cùng thanh thoát trong lòng bàn tay bạn — điểm tựa vật lý cho khoảng thời gian yên bình nhất trong ngày.
            </p>
            <Link
              href="/journal"
              className="inline-flex items-center text-primary uppercase tracking-widest group text-xs font-medium"
            >
              Đọc Tạp Chí Của Chúng Tôi
              <ArrowRight className="size-4 ml-2 sm:ml-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Philosophy Feature Cards */}
      <section className="py-12 sm:py-16 md:py-32 bg-muted/50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-6">
            {[
              {
                Icon: Leaf,
                title: 'Nguồn Cung Bền Vững',
                body: 'Quan hệ đối tác trực tiếp đảm bảo bồi thường công bằng và bảo tồn sinh thái thông qua việc lựa chọn vùng trồng có ý thức.',
              },
              {
                Icon: Paintbrush,
                title: 'Chế Tác Thủ Công',
                body: 'Mỗi chiếc ly tách đều được hoàn thiện thủ công bởi các nghệ nhân gốm master, biến mỗi món đồ thành tác phẩm độc bản.',
              },
              {
                Icon: Settings2,
                title: 'Rang Theo Mẻ Nhỏ',
                body: 'Hồ sơ rang được phát triển với độ chính xác kỹ thuật cao nhằm tôn vinh vùng trồng phức hợp và nốt hương hoa của hạt.',
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="p-6 sm:p-8 md:p-12 bg-card border border-border/40 flex flex-col items-start text-left transition-all duration-500 hover:shadow-sm rounded-xl"
              >
                <div className="w-12 h-12 bg-accent flex items-center justify-center mb-8 sm:mb-10 shrink-0 rounded-lg">
                  <Icon className="size-6 text-white" />
                </div>
                <h4 className="text-base sm:text-lg md:text-xl uppercase tracking-[0.15em] text-foreground mb-4 sm:mb-6 font-normal">
                  {title}
                </h4>
                <div className="w-8 h-px bg-accent mb-4 sm:mb-6" />
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed tracking-wide font-light">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
