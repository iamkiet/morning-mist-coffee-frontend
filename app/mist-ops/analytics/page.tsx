import Image from 'next/image';
import { Calendar, ChevronDown, Plus } from 'lucide-react';
import { PageHeader } from '../_components/PageHeader';
import { StatCard } from '../_components/StatCard';
import { Button } from '@/components/ui/button';

const topProducts = [
  {
    name: 'Morning Mist Blend',
    sold: 342,
    revenue: '$6,840',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuQBHxJhtIZi_sbq64m4yk8ORb9QXxS853Ps5E7Ib_8bqIATGx6lTYLAdgPpnLVWaLwpfSwp7usyYY0CnUPstT7DUXjGcMUhdrJL44poKdPOhHe4PWxo1_I9mFOQcU61awaQN4SEL7aNltGElJ6dKnNz9PacRODfF5SQaFqbvz62yUSn295VuJXbocZahd_DTtmys0O-sVybA_GGvqeyC5IL3L2Dy2gi8TXtTpFnInxtJtlNBe5-rbYzF1GEYQUqG6cG_Z26CWg6E',
  },
  {
    name: 'Ethereal Dusk',
    sold: 215,
    revenue: '$5,375',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWsTLsdoTDI_GDXjxR54VXkq5h_RompGiymV52_9aRS8Okmf1tqotSJET0IjRNFd3zN390f5hnqkjvFld1ZS6kitoJTxBppidk5_Y0kxkEtfce063cgbps1qSCIB856f8C_s9XisG2Z-n_IKZRyWl08M_RWPyZVk7XkCpsNFtN5Idk3aABLDHb224oGkSq0-UQxJycL7xBnOIyLNKy79h8yDijxRdVBCoFaG6naZ3WfsYUnSe_4ds8NqCMglLDeIz3s9F6E_A8kMk',
  },
  {
    name: 'Ceramic V60',
    sold: 98,
    revenue: '$4,410',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqlu9gOLFxMTIBNUj1TN0E0ddkkQkDp7Ux1G5G-tLoquyslc_SEKBV67LWzI4uVi0zUoQxgni-LtnaVCHJ5Zxnw79x627NncoUP5oHa_laO4l9Dqwv7zUebo747kYYyRwjjqIsrO_PsglmRUN7S1ExQdR_9Ik7TFpAJCYZ-WPgBQJJP_zHgPLwcK8nCNlPVoy1m-6zmTJtxqqw4tkciTd7uUe4_v6ox6try48lWgZEmaABevEW4uTEtwksHIMtop0lSZwTZ2ryDV0',
  },
];

const feed = [
  {
    dot: 'active',
    title: 'Đơn hàng mới',
    body: ' từ Julian A. trị giá $42.00',
    when: 'Vừa xong',
  },
  {
    dot: 'muted',
    title: 'Gia hạn gói đăng ký',
    body: ': Elena P.',
    when: '12 phút trước',
  },
  {
    dot: 'muted',
    title: 'Cảnh báo kho hàng',
    body: ': Hạt Morning Mist Blend sắp hết',
    when: '45 phút trước',
  },
  {
    dot: 'muted',
    title: 'Thành viên mới',
    body: ': Marcus Thorne đã tham gia Câu lạc bộ Cà phê',
    when: '1 giờ trước',
  },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        eyebrow="Bảng theo dõi hiệu suất"
        title="Phân tích Kinh doanh"
        actions={
          <>
            <div className="px-3 py-2 bg-card rounded-lg shadow-sm border border-border/30 flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
              <Calendar className="size-4" />
              <span>30 ngày qua</span>
              <ChevronDown className="size-4" />
            </div>
            <Button>
              <Plus className="size-4" />
              Mẻ rang mới
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Doanh thu thuần"
          value="$24,500.00"
          delta="+12%"
          progress={70}
        />
        <StatCard label="Tổng đơn hàng" value="842" delta="+5%" progress={55} />
        <StatCard label="Giá trị đơn hàng TB" value="$29.10" progress={45} />
        <StatCard label="Khách hàng hoạt động" value="1,284" progress={82} />
      </section>

      <section className="mb-6 bg-card p-6 rounded-xl shadow-[0_8px_30px_rgba(169,183,166,0.05)] border border-border/20">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-base font-medium text-foreground">
            Xu hướng doanh thu
          </h4>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-[10px] text-xs uppercase tracking-wider text-muted-foreground uppercase">
              Sản lượng hàng tháng
            </span>
          </div>
        </div>
        <div className="relative h-[320px] w-full">
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 300"
          >
            <defs>
              <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-primary-container)"
                  stopOpacity="0.4"
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary-container)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d="M0,250 Q100,230 200,240 T400,180 T600,150 T800,100 T1000,80"
              fill="none"
              stroke="var(--color-primary-container)"
              strokeWidth="2"
            />
            <path
              d="M0,250 Q100,230 200,240 T400,180 T600,150 T800,100 T1000,80 V300 H0 Z"
              fill="url(#revGrad)"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i}>
                <span className="inline sm:hidden">T{i + 1}</span>
                <span className="hidden sm:inline">Tuần {i + 1}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-xl shadow-[0_8px_30px_rgba(169,183,166,0.05)] border border-border/20">
          <h4 className="text-base font-medium text-foreground mb-6">
            Sản phẩm bán chạy nhất
          </h4>
          <div className="space-y-6">
            {topProducts.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 bg-card rounded-lg overflow-hidden">
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      Đã bán: {p.sold}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-light text-muted-foreground">
                  {p.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-[0_8px_30px_rgba(169,183,166,0.05)] border border-border/20 flex flex-col">
          <h4 className="text-base font-medium text-foreground mb-6">
            Nguồn tiếp cận khách hàng
          </h4>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="transparent"
                  stroke="var(--color-surface-container)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="transparent"
                  stroke="var(--color-primary-container)"
                  strokeDasharray="65, 100"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-light text-foreground">65%</span>
                <span className="text-[9px] text-xs uppercase tracking-wider text-muted-foreground uppercase">
                  Tự nhiên
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Mạng xã hội</p>
                <p className="text-sm font-medium text-foreground">22%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Giới thiệu</p>
                <p className="text-sm font-medium text-foreground">13%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-[0_8px_30px_rgba(169,183,166,0.05)] border border-border/20">
          <h4 className="text-base font-medium text-foreground mb-6">
            Hoạt động thời gian thực
          </h4>
          <div className="space-y-4">
            {feed.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                    f.dot === 'active' ? 'bg-accent' : 'bg-border'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {f.title}
                    </span>
                    {f.body}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    {f.when}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
