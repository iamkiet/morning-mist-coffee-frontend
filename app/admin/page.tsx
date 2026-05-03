import Image from "next/image";
import {
  Wallet,
  ShoppingBasket,
  UserPlus,
  AlertTriangle,
  Check,
  User,
  History,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "./_components/PageHeader";
import { StatCard } from "./_components/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const bars = [
  { day: "Mon", h: 40 },
  { day: "Tue", h: 65 },
  { day: "Wed", h: 90, active: true },
  { day: "Thu", h: 55 },
  { day: "Fri", h: 75 },
  { day: "Sat", h: 45 },
  { day: "Sun", h: 85 },
];

type ActivityColor = "primary" | "secondary" | "tertiary" | "neutral";

const activity: {
  icon: LucideIcon;
  color: ActivityColor;
  body: string;
  when: string;
}[] = [
  {
    icon: AlertTriangle,
    color: "secondary",
    body: "New batch of Ethiopian Yirgacheffe roasted.",
    when: "12 minutes ago",
  },
  {
    icon: Check,
    color: "primary",
    body: "Order #4920 fulfilled and dispatched.",
    when: "1 hour ago",
  },
  {
    icon: User,
    color: "tertiary",
    body: "New wholesale inquiry from Lumière Café.",
    when: "3 hours ago",
  },
  {
    icon: History,
    color: "neutral",
    body: "Inventory restock: 50kg Organic Sage beans.",
    when: "Yesterday",
  },
];

const colorMap: Record<ActivityColor, string> = {
  primary: "bg-emerald-100 text-emerald-700",
  secondary: "bg-amber-100 text-amber-700",
  tertiary: "bg-sky-100 text-sky-700",
  neutral: "bg-muted text-muted-foreground",
};

export default function AdminOverviewPage() {
  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Morning Mist Overview"
        description="A quiet reflection of today's progress."
        descriptionItalic={true}
        size="display"
        titleColor="primary"
        actions={
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Local Time
            </p>
            <p className="text-base text-foreground">08:42 AM</p>
          </div>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Revenue"
          value="$14,280.00"
          delta="+12% vs last week"
          icon={Wallet}
          tone="primary"
        />
        <StatCard
          label="Active Orders"
          value="42"
          delta="Processing now"
          icon={ShoppingBasket}
          tone="tertiary"
        />
        <StatCard
          label="New Customers"
          value="156"
          delta="New members"
          icon={UserPlus}
          tone="secondary"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-medium">Sales Trends</h3>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="text-[10px] uppercase tracking-widest h-7">
                  Daily
                </Button>
                <Button variant="default" size="sm" className="text-[10px] uppercase tracking-widest h-7">
                  Weekly
                </Button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 px-2 relative">
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                <div className="border-t border-border w-full" />
                <div className="border-t border-border w-full" />
                <div className="border-t border-border w-full" />
              </div>
              <div className="flex-grow h-full flex items-end justify-between z-10">
                {bars.map((b) => (
                  <div
                    key={b.day}
                    className={`flex-1 mx-1 rounded-t-lg transition-all duration-500 ${
                      b.active ? "bg-primary/40" : "bg-accent/20"
                    }`}
                    style={{ height: `${b.h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between px-2 mt-4 text-xs text-muted-foreground uppercase">
              {bars.map((b) => (
                <span key={b.day} className="flex-1 text-center">
                  {b.day}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base font-medium mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {activity.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="flex gap-4 relative">
                    {i < activity.length - 1 && (
                      <div className="absolute left-[14px] top-8 bottom-[-1.5rem] w-px bg-border/50" />
                    )}
                    <div
                      className={`z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${colorMap[a.color]}`}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-sm">{a.body}</p>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">
                        {a.when}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative rounded-xl overflow-hidden h-64 border border-border/30 group">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ3Jyip5nRIN3QyLB7MQ8HCPJ1nu_Kzb9UMGA3zEoO0pxOtgbSC51vvolk3aWVow_HDWU-FzQ4VcNM3Ri700_KkvPLidGj6If26K1W8dE8_w5kQZdjnKH9xl8BMlpv4ruPw3i2g7tIw8BHLKAX1wwk8v1CrN-ZcCDGG0kmDzTb-d2PjqlvUOW8q0K03kT6hURtQ0kvpFQ6588StRndETpiVVs8hD29SxVvEKLGNBc4Y3ltn0s7BkWI9csRjQ6kNqFgegoARohKQ1I"
            alt="Roastery Process"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-4">
            <p className="text-xs text-white/80 uppercase tracking-wider">
              Active Roastery Status
            </p>
            <p className="text-base text-white">Optimal Environment: 22°C / 45% Hum.</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-4 sm:p-6 flex flex-col justify-center items-center text-center space-y-4 h-full">
            <div className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-[spin_8s_linear_infinite]" />
            <div>
              <h4 className="text-base text-primary font-medium">
                Live Quality Monitoring
              </h4>
              <p className="text-sm text-muted-foreground px-4 mt-2">
                Our sensors are tracking bean quality in real-time across all our roasteries.
              </p>
            </div>
            <Button variant="outline" size="sm" className="uppercase tracking-wider rounded-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
