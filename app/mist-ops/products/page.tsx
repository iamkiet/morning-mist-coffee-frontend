'use client';

import Image from 'next/image';
import {
  Pencil,
  Trash2,
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../_components/PageHeader';
import { DataTable, type Column } from '../_components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useProducts, useUpdateProduct, useCreateProduct, useDeleteProduct } from '@/hooks/use-products';
import { useProductTypes } from '@/hooks/use-product-types';
import type { Product } from '@/app/_components/ProductCard';

const LIMIT = 10;

interface EditState {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  stock: string;
  productTypeId: string;
}

function buildDescription(origin: string, notes: string[]): string {
  return [origin, ...notes].filter(Boolean).join('\n');
}

function EditProductDialog({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const update = useUpdateProduct();
  const { data: catData } = useProductTypes();
  const categories = catData?.items ?? [];

  const [form, setForm] = useState<EditState>({
    id: product.id,
    name: product.name,
    price: String(Math.round(product.price)),
    description: buildDescription(product.origin, product.notes),
    image: product.image,
    stock: String(product.stockQuantity ?? 0),
    productTypeId: product.productTypeId || '',
  });

  const field = (key: keyof EditState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  function handleSave() {
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) return;
    const stockNum = parseInt(form.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) return;
    update.mutate(
      {
        id: form.id,
        payload: {
          name: form.name.trim() || undefined,
          description: form.description.trim() || null,
          priceCents: Math.round(priceNum),
          image: form.image.trim() || null,
          stockQuantity: stockNum,
          productTypeId: form.productTypeId || undefined,
        },
      },
      { onSuccess: onClose },
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Chỉnh sửa Sản phẩm
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="ep-category"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Danh mục sản phẩm
            </Label>
            <select
              id="ep-category"
              className="w-full h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={form.productTypeId}
              onChange={(e) => setForm((prev) => ({ ...prev, productTypeId: e.target.value }))}
            >
              <option value="" disabled>Chọn danh mục...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="ep-name"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Tên sản phẩm
            </Label>
            <Input id="ep-name" {...field('name')} />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="ep-price"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Giá bán (VNĐ)
            </Label>
            <Input
              id="ep-price"
              type="number"
              step="0.01"
              min="0"
              {...field('price')}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="ep-stock"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Số lượng tồn kho
            </Label>
            <Input
              id="ep-stock"
              type="number"
              step="1"
              min="0"
              {...field('stock')}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="ep-desc"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Mô tả
            </Label>
            <textarea
              id="ep-desc"
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              {...field('description')}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="ep-img"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Đường dẫn hình ảnh
            </Label>
            <Input id="ep-img" type="url" {...field('image')} />
          </div>
          {update.isError && (
            <p className="text-xs text-destructive">
              Không thể cập nhật sản phẩm. Vui lòng thử lại.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="uppercase tracking-wider text-xs"
          >
            Hủy
          </Button>
          <Button
            size="sm"
            className="uppercase tracking-wider text-xs"
            disabled={update.isPending}
            onClick={handleSave}
          >
            {update.isPending ? 'Đang lưu…' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CreateState {
  name: string;
  price: string;
  description: string;
  image: string;
  stock: string;
  productTypeId: string;
}

function CreateProductDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const create = useCreateProduct();
  const { data: catData } = useProductTypes();
  const categories = catData?.items ?? [];
  
  const [form, setForm] = useState<CreateState>({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '0',
    productTypeId: '',
  });

  const field = (key: keyof CreateState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  function handleSave() {
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) return;
    const stockNum = parseInt(form.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) return;
    if (!form.productTypeId) return;

    create.mutate(
      {
        name: form.name.trim(),
        description: form.description.trim() || null,
        priceCents: Math.round(priceNum),
        image: form.image.trim() || null,
        productTypeId: form.productTypeId,
        stockQuantity: stockNum,
      },
      { onSuccess: onClose },
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Thêm sản phẩm mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="cp-name"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Tên sản phẩm
            </Label>
            <Input id="cp-name" {...field('name')} placeholder="Tên sản phẩm..." />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="cp-category"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Danh mục sản phẩm
            </Label>
            <select
              id="cp-category"
              className="w-full h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={form.productTypeId}
              onChange={(e) => setForm((prev) => ({ ...prev, productTypeId: e.target.value }))}
            >
              <option value="" disabled>Chọn danh mục...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="cp-price"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Giá bán (VNĐ)
            </Label>
            <Input
              id="cp-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...field('price')}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="cp-stock"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Số lượng tồn kho
            </Label>
            <Input
              id="cp-stock"
              type="number"
              step="1"
              min="0"
              {...field('stock')}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="cp-desc"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Mô tả
            </Label>
            <textarea
              id="cp-desc"
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              placeholder="Mô tả sản phẩm, nguồn gốc và nốt hương..."
              {...field('description')}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="cp-img"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Đường dẫn hình ảnh
            </Label>
            <Input id="cp-img" type="url" placeholder="https://..." {...field('image')} />
          </div>
          {create.isError && (
            <p className="text-xs text-destructive">
              Không thể thêm sản phẩm mới. Vui lòng thử lại.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="uppercase tracking-wider text-xs"
          >
            Hủy
          </Button>
          <Button
            size="sm"
            className="uppercase tracking-wider text-xs"
            disabled={create.isPending || !form.productTypeId || !form.name}
            onClick={handleSave}
          >
            {create.isPending ? 'Đang thêm…' : 'Thêm mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteProductConfirm, setDeleteProductConfirm] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  
  const { data, isLoading, error } = useProducts(page, LIMIT);
  const deleteMut = useDeleteProduct();

  const items = data?.items ?? [];
  const filteredItems = items.filter((item) => {
    const s = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(s) ||
      (item.origin && item.origin.toLowerCase().includes(s)) ||
      (item.description && item.description.toLowerCase().includes(s)) ||
      item.notes.some((note) => note.toLowerCase().includes(s))
    );
  });
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  const columns: Column<Product>[] = [
    {
      key: 'details',
      header: 'Chi tiết sản phẩm',
      render: (r) => (
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-card flex-shrink-0">
            <Image
              src={r.image}
              alt={r.name}
              fill
              sizes="64px"
              className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div>
            <div className="text-base font-medium text-foreground">
              {r.name}
            </div>
            <div className="text-sm text-muted-foreground">{r.origin}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Giá',
      render: (r) => <span className="font-medium">{r.price.toLocaleString('vi-VN')} ₫</span>,
    },
    {
      key: 'stock',
      header: 'Kho hàng',
      render: (r) => {
        const qty = r.stockQuantity ?? 0;
        if (qty === 0)
          return (
            <span className="text-xs font-medium text-destructive uppercase tracking-wider">
              Hết hàng
            </span>
          );
        if (qty <= 5)
          return (
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Sắp hết · {qty}
            </span>
          );
        return <span className="text-sm text-foreground">{qty}</span>;
      },
    },
    {
      key: 'notes',
      header: 'Nốt hương',
      hideOnMobile: true,
      render: (r) => (
        <span className="text-muted-foreground text-sm">
          {r.notes.length > 0 ? r.notes[0] : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setEditProduct(r)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 hover:text-destructive"
            onClick={() => setDeleteProductConfirm(r)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Quản lý Kho hàng"
        description="Todaywegrind được khai sinh từ làn sương sớm tĩnh lặng nơi đại ngàn, nơi mỗi hạt cà phê là một câu chuyện kể về vùng thổ nhưỡng đã nuôi dưỡng chúng."
        actions={
          <>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 bg-card w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="uppercase tracking-wider"
            >
              <Download className="size-4" />
              Xuất tệp CSV
            </Button>
            <Button size="sm" className="uppercase tracking-wider" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="size-4" />
              Thêm sản phẩm
            </Button>
          </>
        }
      />
      {error && (
        <div className="mb-4 p-3 border border-border text-destructive text-sm">
          Không thể tải danh sách sản phẩm. Vui lòng thử lại.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filteredItems}
          footer={
            <div className="px-4 py-3 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Hiển thị {offset + 1}–{Math.min(offset + filteredItems.length, total)}{' '}
                trên {total}
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          }
        />
      )
      }

      {editProduct && (
        <EditProductDialog
          product={editProduct}
          onClose={() => setEditProduct(null)}
        />
      )}

      {createDialogOpen && (
        <CreateProductDialog
          onClose={() => setCreateDialogOpen(false)}
        />
      )}

      {deleteProductConfirm && (
        <Dialog open onOpenChange={(open) => !open && setDeleteProductConfirm(null)}>
          <DialogContent className="sm:max-w-[24rem]">
            <DialogHeader>
              <DialogTitle className="text-sm uppercase tracking-widest font-medium">
                Xác nhận Xóa
              </DialogTitle>
            </DialogHeader>
            <div className="py-2 text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa sản phẩm <strong>{deleteProductConfirm.name}</strong> không? Hành động này không thể hoàn tác.
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteProductConfirm(null)}
                className="uppercase tracking-wider text-xs"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="uppercase tracking-wider text-xs"
                disabled={deleteMut.isPending}
                onClick={() => {
                  deleteMut.mutate(deleteProductConfirm.id, {
                    onSuccess: () => setDeleteProductConfirm(null),
                  });
                }}
              >
                {deleteMut.isPending ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
