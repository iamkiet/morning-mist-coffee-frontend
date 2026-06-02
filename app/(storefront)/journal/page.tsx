import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const articles = [
  {
    date: '24 Tháng 10, 2026',
    category: 'Nhà Rang',
    categoryClass: 'bg-accent/20 text-accent-foreground',
    title: 'Nghệ Thuật Của Mẻ Rang Sáng (Light Roast)',
    body: 'Khám phá sự cân bằng tinh tế cần thiết để lưu giữ vị chua thanh hoa cỏ trong khi phát triển vị ngọt sâu lắng ở các giống cà phê cổ truyền Ethiopia.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl_57By8KpPbF48CuhXYe9ODWW8d8uWDvZfhYZoQeLYkz79MIgmvh1HKr4Rby_OSEiVfzRIwcb71cibzA43gmKTHNUCDHReN_i-JuxSeeCwBYarDdduBq90vH-sPci6GoPZAzLl7bNa6eWA_gAb1i0TxzhdS01JtePFdLez5JdN74dWxui5I5HrNUp67xj6PmOEW-veiHDK7dlV_lIXlcgE-Gc3z5FtCXS-HVSgk577c0ZgnDTOSsAEEj7XczFAFwey12jip5ugTw',
  },
  {
    date: '18 Tháng 10, 2026',
    category: 'Nghi Thức Pha',
    categoryClass: 'bg-primary/10 text-primary',
    title: 'Cấu Trúc Của Nghi Thức Pour Over Buổi Sáng',
    body: 'Cẩm nang hướng dẫn sự chính xác về mặt hình học của phương pháp pha V60, tập trung vào tính ổn định nhiệt độ và nhịp điệu của quá trình ngấm nở (bloom).',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbRJKd8DDfCjazsjEOCzW3zN3Pm9w2Q3fZ5-As907pXHfEipH9e6cB-1yEDEGRjzCwIBLGBrKctd9x9ow5zUa-tD5XdVB2vqywp-rK4jS8xu8CjIkQ2Ve5v0QNL_cKN9md6EC49P_lZ3TTYUISxXaSOAGcB2MUDKX2CZvMo8bq2wOWue3scAP9QpZMdg8-w3Hn958wofsklLr1gRNDDvCtwfrvwHPSkoSvcIJP5XjOq0JZcukiccNIhhOqa4IDAQAufIWNZ5uG88s',
  },
  {
    date: '12 Tháng 10, 2026',
    category: 'Thổ Nhưỡng',
    categoryClass: 'bg-muted text-muted-foreground',
    title: 'Bóng Râm và Đất Mẹ: Thổ Nhưỡng Vùng Huila',
    body: 'Tìm hiểu sâu về vùng đất núi lửa giàu khoáng chất của Huila, Colombia và cách phương pháp canh tác dưới bóng râm thay đổi mật độ hạt cà phê.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbifeXvfG8KnZvU0VFdkZOzhGcFj_kqeiFpZ9wfrggND9sKIPe7bi0WTnff2z16Z0Pq90uPzu0AsBFwTYxuvGuv4j4LgU2r-JEbJ8heG0X6Bfi2sd4saiKnuB3luLs6CSX9qfLCt4KpBrBae-XGZkqOR1kkCoOj6_EQJncEfjlH6h0naAgoCpq3nxFA9TsiqxQGPXdUHMwzHdeaS47zIFvAvDtw5dTBsxPT8z77lXPCn7NrVRhyuCbQa0_nKhyeaM6Ll4kcRKX_wY',
  },
];

const filters = ['Tất cả', 'Thổ Nhưỡng', 'Pha Chế', 'Rang Xay'];

export default function JournalPage() {
  return (
    <main className="pt-36 bg-background">
      {/* Hero */}
      <section className="relative h-[600px] sm:h-[819px] w-full overflow-hidden flex items-center px-4 sm:px-8 md:px-12 max-w-[1920px] mx-auto">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPaacO7tQx3YPcRFDHlHh8s_p6Ok8T8z7t-HLYOpfsfc_Cw-TfeexNmazgrggtmknuiqgFVxupxjWGYPIlP03ahhgDcOklPYYnCpeS_2X4tLkum7dmQz90MsZAVqD4t6054vkVY5h6XELAN923wSHuCu_mJb-hs6wO7zzPYMnK72FCsX7Bv3jUPAWDnZjyDAGePJQJvP49x0cvq0zkFM10cBeJSDRXxSqeG1CLzK9AUpMqcBh5vk7FPS4EsdtwWdA8aRJnXnLPAsE"
            alt="Misty coffee plantation"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-95 grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-foreground/10" />
        </div>
        <div className="relative z-10 max-w-2xl bg-white/40 backdrop-blur-md p-6 sm:p-12 rounded-2xl shadow-[0_40px_100px_-20px_rgba(169,183,166,0.15)]">
          <span className="text-xs text-primary mb-4 block uppercase tracking-widest font-medium">
            Câu Chuyện Nổi Bật
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-foreground mb-6 tracking-tight font-light">
            Nghi Thức Nguồn Cung
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed font-light">
            Đằng sau mỗi hạt cà phê là một hành trình thầm lặng của sự chính xác và kiên nhẫn. Chúng tôi tìm đến những nông hộ vùng cao xa xôi nhất thế giới để kiến tạo một trải nghiệm giác quan bắt đầu từ rất lâu trước khi giọt cà phê đầu tiên được rót ra.
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-3 text-xs border-b border-foreground pb-1 hover:opacity-60 transition-opacity uppercase tracking-widest"
          >
            Đọc bài viết
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="w-full px-4 sm:px-8 md:px-12 py-12 sm:py-16 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border max-w-[1920px] mx-auto">
        <div>
          <h2 className="text-2xl sm:text-3xl text-foreground font-light">
            Tạp Chí (Journal)
          </h2>
          <p className="text-sm text-muted-foreground mt-2 italic font-light">
            Nơi lưu giữ những suy tư chậm rãi và những quan sát giác quan sâu sắc.
          </p>
        </div>
        <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`text-xs uppercase tracking-widest pb-1 transition-colors cursor-pointer whitespace-nowrap ${
                i === 0
                  ? 'text-foreground border-b border-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Article Grid */}
      <section className="px-4 sm:px-8 md:px-12 py-16 sm:py-24 max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24">
          {articles.map((a) => (
            <article key={a.title} className="group cursor-pointer">
              <div className="relative aspect-[4/5] mb-6 sm:mb-8 overflow-hidden bg-muted rounded-2xl">
                <Image
                  src={a.img}
                  alt={a.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {a.date}
                  </span>
                  <span
                    className={`px-3 py-1 text-[10px] uppercase tracking-tight font-medium ${a.categoryClass}`}
                  >
                    {a.category}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg group-hover:text-primary transition-colors font-normal leading-snug">
                  {a.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 font-light leading-relaxed">
                  {a.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 bg-muted">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1">
            <span className="text-xs text-primary mb-4 block uppercase tracking-widest font-medium">
              Kết Nối Với Chúng Tôi
            </span>
            <h2 className="text-2xl sm:text-3xl mb-4 font-light">
              Đăng Ký Nhận Bản Tin
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
              Nhận những suy ngẫm định kỳ hai tuần một lần về văn hóa cà phê, kỹ thuật pha chế và thông báo về các vụ mùa thu hoạch mới trực tiếp vào hộp thư của bạn.
            </p>
          </div>
          <div className="flex-1 w-full">
            <form className="relative">
              <Input
                className="w-full bg-transparent border-0 border-b border-border rounded-lg pl-0 pr-12 py-4 text-sm tracking-widest uppercase focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50"
                placeholder="địa chỉ email của bạn"
                type="email"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 bottom-1 text-primary hover:text-foreground"
                aria-label="Đăng ký"
              >
                <ArrowRight className="size-5" />
              </Button>
            </form>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground">
              Tôn trọng không gian riêng tư của bạn. Hủy đăng ký bất kỳ lúc nào.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
