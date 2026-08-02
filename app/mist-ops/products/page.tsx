'use client';

import Image from 'next/image';
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Package,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../_components/PageHeader';
import { StatCard } from '../_components/StatCard';
import { DataTable, Pagination, type Column } from '../_components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts, useUpdateProduct, useCreateProduct, useDeleteProduct } from '@/hooks/use-products';
import { useProductTypes } from '@/hooks/use-product-types';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { toast } from 'sonner';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import type { Product } from '@/lib/types';

const LIMIT = 10;

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc').max(200),
  productTypeId: z.string().min(1, 'Vui lòng chọn danh mục'),
  price: z
    .string()
    .min(1, 'Giá bán là bắt buộc')
    .regex(/^\d+$/, 'Giá phải là số nguyên không âm'),
  stock: z
    .string()
    .min(1, 'Tồn kho là bắt buộc')
    .regex(/^\d+$/, 'Tồn kho phải là số nguyên không âm'),
  origin: z.string().max(200).optional(),
  tastingNotes: z.string().optional(),
  description: z.string().max(5000).optional(),
  image: z.union([z.literal(''), z.string().url('Đường dẫn hình ảnh không hợp lệ')]),
});

type ProductForm = z.infer<typeof productSchema>;

// The API stores tasting notes as an array; the form edits them one per line
function parseNotes(raw: string | undefined): string[] {
  return (raw ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

interface ProductDialogProps {
  product?: Product;
  onClose: () => void;
}

function ProductDialog({ product, onClose }: ProductDialogProps) {
  const isEdit = product !== undefined;
  const update = useUpdateProduct();
  const create = useCreateProduct();
  const mutation = isEdit ? update : create;
  const { data: catData } = useProductTypes();
  const categories = catData?.items ?? [];

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      productTypeId: product?.productTypeId ?? '',
      price: product ? String(Math.round(product.price)) : '',
      stock: String(product?.stockQuantity ?? 0),
      origin: product?.origin ?? '',
      tastingNotes: product?.tastingNotes.join('\n') ?? '',
      description: product?.description ?? '',
      image: product?.image ?? '',
    },
  });

  function onSubmit(values: ProductForm) {
    const shared = {
      origin: values.origin?.trim() || null,
      tastingNotes: parseNotes(values.tastingNotes),
      description: values.description?.trim() || null,
      priceCents: Number(values.price),
      image: values.image.trim() || null,
      stockQuantity: Number(values.stock),
    };

    if (isEdit) {
      update.mutate(
        {
          id: product.id,
          payload: { ...shared, name: values.name.trim(), productTypeId: values.productTypeId },
        },
        {
          onSuccess: () => {
            toast.success('Đã cập nhật sản phẩm');
            onClose();
          },
        },
      );
      return;
    }

    create.mutate(
      { ...shared, name: values.name.trim(), productTypeId: values.productTypeId },
      {
        onSuccess: () => {
          toast.success('Đã thêm sản phẩm mới');
          onClose();
        },
      },
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            {isEdit ? 'Chỉnh sửa Sản phẩm' : 'Thêm sản phẩm mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="productTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục sản phẩm</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn danh mục..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên sản phẩm..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá bán (VNĐ)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng tồn kho</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nguồn gốc</FormLabel>
                  <FormControl>
                    <Input placeholder="Cầu Đất • Đà Lạt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tastingNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nốt hương (mỗi dòng một nốt)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder={'Hoa nhài\nChua thanh'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Mô tả ngắn về hương vị..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đường dẫn hình ảnh</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mutation.isError && (
              <ErrorNotice className="mb-0">
                {isEdit
                  ? 'Không thể cập nhật sản phẩm. Vui lòng thử lại.'
                  : 'Không thể thêm sản phẩm mới. Vui lòng thử lại.'}
              </ErrorNotice>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="uppercase tracking-wider text-xs"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                className="uppercase tracking-wider text-xs"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Đang lưu…' : isEdit ? 'Lưu' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
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
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isError } = useProducts(page, LIMIT, debouncedSearch);
  const deleteMut = useDeleteProduct();

  const items = data?.items ?? [];
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
          {r.tastingNotes.length > 0 ? r.tastingNotes[0] : '—'}
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
        description="Morning Mist được khai sinh từ làn sương sớm tĩnh lặng nơi đại ngàn, nơi mỗi hạt cà phê là một câu chuyện kể về vùng thổ nhưỡng đã nuôi dưỡng chúng."
        actions={
          <>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 bg-card w-full"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  // A new query restarts paging — page 3 of the old result set is meaningless
                  setPage(1);
                }}
              />
            </div>
            <Button size="sm" className="uppercase tracking-wider" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="size-4" />
              Thêm sản phẩm
            </Button>
          </>
        }
      />
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Tổng sản phẩm"
          value={isLoading ? '—' : String(total)}
          icon={Package}
          tone="primary"
        />
        <StatCard
          label="Sắp hết hàng"
          value={
            isLoading
              ? '—'
              : String(items.filter((p) => (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= 5).length)
          }
          delta="Trên trang này"
          icon={AlertTriangle}
          tone="secondary"
        />
        <StatCard
          label="Hết hàng"
          value={isLoading ? '—' : String(items.filter((p) => (p.stockQuantity ?? 0) === 0).length)}
          delta="Trên trang này"
          icon={XCircle}
          tone="tertiary"
        />
      </section>

      {isError && (
        <ErrorNotice>Không thể tải danh sách sản phẩm. Vui lòng thử lại.</ErrorNotice>
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
          rows={items}
          footer={
            <Pagination
              showing={
                total === 0
                  ? 'Không tìm thấy sản phẩm nào'
                  : `Hiển thị ${offset + 1}–${Math.min(offset + items.length, total)} trên ${total}`
              }
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          }
        />
      )
      }

      {editProduct && (
        <ProductDialog product={editProduct} onClose={() => setEditProduct(null)} />
      )}

      {createDialogOpen && (
        <ProductDialog onClose={() => setCreateDialogOpen(false)} />
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
                    onSuccess: () => {
                      toast.success('Đã xóa sản phẩm');
                      setDeleteProductConfirm(null);
                    },
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
