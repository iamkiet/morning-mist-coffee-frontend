import Image from "next/image";
import { Pencil, Trash2, Download, Plus, Search, ChevronDown } from "lucide-react";
import { PageHeader } from "../_components/PageHeader";
import { Badge } from "../_components/Badge";
import { DataTable, type Column } from "../_components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface InventoryItem {
  id: string;
  name: string;
  detail: string;
  image: string;
  category: string;
  stock: number;
  capacity: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const items: InventoryItem[] = [
  { id: "p1", name: "Ethiopian Yirgacheffe", detail: "Heirloom Varietal, Light Roast", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuQBHxJhtIZi_sbq64m4yk8ORb9QXxS853Ps5E7Ib_8bqIATGx6lTYLAdgPpnLVWaLwpfSwp7usyYY0CnUPstT7DUXjGcMUhdrJL44poKdPOhHe4PWxo1_I9mFOQcU61awaQN4SEL7aNltGElJ6dKnNz9PacRODfF5SQaFqbvz62yUSn295VuJXbocZahd_DTtmys0O-sVybA_GGvqeyC5IL3L2Dy2gi8TXtTpFnInxtJtlNBe5-rbYzF1GEYQUqG6cG_Z26CWg6E", category: "Whole Bean", stock: 42, capacity: 60, price: 28, status: "In Stock" },
  { id: "p2", name: "Morning Mist Ceramic V60", detail: "Limited Edition Sage Matte", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqlu9gOLFxMTIBNUj1TN0E0ddkkQkDp7Ux1G5G-tLoquyslc_SEKBV67LWzI4uVi0zUoQxgni-LtnaVCHJ5Zxnw79x627NncoUP5oHa_laO4l9Dqwv7zUebo747kYYyRwjjqIsrO_PsglmRUN7S1ExQdR_9Ik7TFpAJCYZ-WPgBQJJP_zHgPLwcK8nCNlPVoy1m-6zmTJtxqqw4tkciTd7uUe4_v6ox6try48lWgZEmaABevEW4uTEtwksHIMtop0lSZwTZ2ryDV0", category: "Equipment", stock: 8, capacity: 30, price: 45, status: "Low Stock" },
  { id: "p3", name: "Morning Mist Ceramic Mug", detail: "Sage Matte · 12oz", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWsTLsdoTDI_GDXjxR54VXkq5h_RompGiymV52_9aRS8Okmf1tqotSJET0IjRNFd3zN390f5hnqkjvFld1ZS6kitoJTxBppidk5_Y0kxkEtfce063cgbps1qSCIB856f8C_s9XisG2Z-n_IKZRyWl08M_RWPyZVk7XkCpsNFtN5Idk3aABLDHb224oGkSq0-UQxJycL7xBnOIyLNKy79h8yDijxRdVBCoFaG6naZ3WfsYUnSe_4ds8NqCMglLDeIz3s9F6E_A8kMk", category: "Merchandise", stock: 124, capacity: 150, price: 22, status: "In Stock" },
  { id: "p4", name: "Kyoto Cold Brew Kit", detail: "Concentrate · 500ml", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8QEDeawhSGXwMhz1q7-gtPaK8KLK600UJi2vnA61OerMa6u953F1HjXxWZwbL5f2FU-ggKmHRCYNoio0m0JL5NVNnnkRF207BcSfUWaU4c2rulvMAoZHYJFgACmH4UvBrWW0fM4Z2sB0Ts1FG_uRmA5usQDYSlnH4-6ZKi-JP5snoOpYnPhIiqpfbipwRZU64DQqy4ZN5LLSnrnZ04C2QbkL27sOaSfIlO2mo4dM_2vQU3wKMU55o19cu67BnmiTCqhqsffKmpj0", category: "Coffee Beans", stock: 0, capacity: 50, price: 32, status: "Out of Stock" },
  { id: "p5", name: "Highland Brightness", detail: "Kenya Nyeri AA", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG07lb1YGXB-tjqfZdAveDZgc4RWZ3dM3mFo8BTs5LMC7273947PO5VdRS8TYs0QRTl-VXLxEEtKZKscs5Es3sDBxhYeQprq_lJUL3G__FH0NZbzskBM9V0nk32XVH1ljK5e4kdJms1AKy1q-pGhNPNe8Ji6Avp0lp3VH6k_4rFIimtmCs7aMwVx5j9Tbgp8YWiXsW4Kz_sAEUakvcCpjUdu2v-HsDNiYDHNGLEPJmId9yjpkM9Wvi24UXDR1xNqN9VLuJimFNWc8", category: "Whole Bean", stock: 36, capacity: 60, price: 30, status: "In Stock" },
];

const statusMap = {
  "In Stock": "success",
  "Low Stock": "warning",
  "Out of Stock": "error",
} as const;

const columns: Column<InventoryItem>[] = [
  {
    key: "details",
    header: "Product Details",
    render: (r) => (
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-card flex-shrink-0">
          <Image src={r.image} alt={r.name} fill sizes="64px" className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
        </div>
        <div>
          <div className="text-base font-medium text-foreground">{r.name}</div>
          <div className="text-sm text-muted-foreground text-sm">{r.detail}</div>
        </div>
      </div>
    ),
  },
  { key: "category", header: "Category", hideOnMobile: true, render: (r) => <span className="text-muted-foreground">{r.category}</span> },
  {
    key: "stock",
    header: "Stock Level",
    render: (r) => (
      <div>
        <div className="text-foreground">{r.stock} Units</div>
        <div className="w-24 h-1 bg-muted mt-2 rounded-full overflow-hidden">
          <div
            className={`h-full ${r.stock === 0 ? "bg-error/40" : r.stock < 15 ? "bg-amber-200" : "bg-accent"}`}
            style={{ width: `${Math.min(100, (r.stock / r.capacity) * 100)}%` }}
          />
        </div>
      </div>
    ),
  },
  { key: "price", header: "Price", hideOnMobile: true, render: (r) => <span>${r.price.toFixed(2)}</span> },
  { key: "status", header: "Status", render: (r) => <Badge status={statusMap[r.status]}>{r.status}</Badge> },
  {
    key: "actions",
    header: "Actions",
    align: "right",
    hideOnMobile: true,
    render: () => (
      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="size-8">
          <Pencil className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="size-8 hover:text-destructive">
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  },
];

export default function AdminProductsPage() {
  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Inventory Management"
        description="Morning Mist was born from the quiet clarity of a high-altitude mist, where every bean tells the story of the soil it was cradled in."
        actions={
          <>
            <Button variant="outline" size="sm" className="uppercase tracking-wider">
              <Download className="size-4" />
              Export CSV
            </Button>
            <Button size="sm" className="uppercase tracking-wider">
              <Plus className="size-4" />
              Add Product
            </Button>
          </>
        }
      />

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-grow w-full sm:max-w-[32rem]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-10 bg-muted border-0"
              placeholder="Search beans, brewers, or accessories..."
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="rounded-full uppercase tracking-wider text-xs">
              Category: All
              <ChevronDown className="size-3" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full uppercase tracking-wider text-xs">
              Status: Active
              <ChevronDown className="size-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={columns} rows={items} />
    </div>
  );
}
