import { Package } from 'lucide-react';

export function TrackOrderIntro() {
  return (
    <header className="mb-10 sm:mb-16">
      <div className="flex items-center gap-3 mb-3">
        <Package className="size-5 text-primary" />
        <h1 className="text-3xl font-light text-foreground">
          Theo Dõi Đơn Hàng
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Nhập mã đơn hàng (in trên biên nhận) để tra cứu thông tin đơn hàng.
      </p>
    </header>
  );
}
