import Image from "next/image";
import { MoreHorizontal, Search, Plus, TrendingUp } from "lucide-react";
import { PageHeader } from "../_components/PageHeader";
import { Badge } from "../_components/Badge";
import { DataTable, Pagination, type Column } from "../_components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Order {
  id: string;
  customer: { name: string; email: string; initials: string };
  status: "Processing" | "Delivered" | "Draft";
  origin: string;
  amount: number;
}

const orders: Order[] = [
  { id: "ORD-2841", customer: { name: "Elena Moretti", email: "elena.m@morningmist.coffee", initials: "EM" }, status: "Processing", origin: "Ethiopian Yirgacheffe", amount: 42.5 },
  { id: "ORD-2842", customer: { name: "James Kenway", email: "j.kenway@morningmist.coffee", initials: "JK" }, status: "Delivered", origin: "Sumatra Mandheling", amount: 38 },
  { id: "ORD-2843", customer: { name: "Satoshi Lee", email: "slee@morningmist.coffee", initials: "SL" }, status: "Draft", origin: "Columbian Supremo", amount: 124.2 },
  { id: "ORD-2844", customer: { name: "Aria Bennett", email: "aria@morningmist.coffee", initials: "AB" }, status: "Processing", origin: "Guatemalan Antigua", amount: 56 },
  { id: "ORD-2845", customer: { name: "Noor Hassan", email: "noor.h@morningmist.coffee", initials: "NH" }, status: "Delivered", origin: "Kenya Nyeri", amount: 64.5 },
];

const statusMap = {
  Processing: "info",
  Delivered: "success",
  Draft: "neutral",
} as const;

const columns: Column<Order>[] = [
  {
    key: "id",
    header: "Order ID",
    render: (r) => <span className="text-xs font-medium text-muted-foreground">#{r.id}</span>,
  },
  {
    key: "customer",
    header: "Customer",
    render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-bold">
          {r.customer.initials}
        </div>
        <div>
          <p className="text-sm">{r.customer.name}</p>
          <p className="text-[10px] text-muted-foreground">{r.customer.email}</p>
        </div>
      </div>
    ),
  },
  { key: "status", header: "Status", render: (r) => <Badge status={statusMap[r.status]}>{r.status}</Badge> },
  { key: "origin", header: "Origin", hideOnMobile: true, render: (r) => <span className="italic text-muted-foreground">{r.origin}</span> },
  { key: "amount", header: "Amount", align: "right", hideOnMobile: true, render: (r) => <span className="font-medium">${r.amount.toFixed(2)}</span> },
  {
    key: "actions",
    header: "",
    align: "right",
    render: () => (
      <Button variant="ghost" size="icon" className="size-8">
        <MoreHorizontal className="size-4" />
      </Button>
    ),
  },
];

export default function AdminOrdersPage() {
  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        eyebrow="Orders"
        title="Morning Mist Overview"
        description="Each order, brewed and honored with intention."
        actions={
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10 w-full sm:w-64 bg-card"
              />
            </div>
            <Button>
              <Plus className="size-4" />
              New Batch
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={orders}
        footer={
          <Pagination
            showing="Showing 1–5 of 48 orders"
            current={1}
            total={3}
            showEllipsis={false}
          />
        }
      />

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 group overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Morning Mist Coffee Admin
              </p>
              <h3 className="text-base mb-4 font-medium">Roastery Performance</h3>
              <div className="flex items-end gap-4">
                <div className="text-3xl font-light">
                  98%{" "}
                  <span className="text-xs text-muted-foreground font-medium tracking-widest">
                    EFFICIENCY
                  </span>
                </div>
                <div className="pb-2 text-primary">
                  <TrendingUp className="size-5" />
                </div>
              </div>
            </div>
            <div className="hidden sm:block relative w-48 h-32 rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWsTLsdoTDI_GDXjxR54VXkq5h_RompGiymV52_9aRS8Okmf1tqotSJET0IjRNFd3zN390f5hnqkjvFld1ZS6kitoJTxBppidk5_Y0kxkEtfce063cgbps1qSCIB856f8C_s9XisG2Z-n_IKZRyWl08M_RWPyZVk7XkCpsNFtN5Idk3aABLDHb224oGkSq0-UQxJycL7xBnOIyLNKy79h8yDijxRdVBCoFaG6naZ3WfsYUnSe_4ds8NqCMglLDeIz3s9F6E_A8kMk"
                alt="Roasting"
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/30">
          <CardContent className="p-6 flex flex-col justify-between gap-4 h-full">
            <p className="text-xs text-accent-foreground uppercase tracking-widest">
              Supply Chain
            </p>
            <div>
              <h3 className="text-base font-medium mb-1">The Morning Mist Set</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Guatemalan Antigua is running low. Schedule a restock soon.
              </p>
            </div>
            <Button variant="outline" size="sm" className="uppercase tracking-widest text-[10px]">
              Reorder Batch
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
