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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  useProducts,
  useUpdateProduct,
  useCreateProduct,
  useDeleteProduct,
  useCreateProductVariant,
  useUpdateProductVariant,
  useDeleteProductVariant,
} from '@/hooks/use-products';
import { useProductCategories } from '@/hooks/use-product-categories';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { toast } from 'sonner';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { getDefaultVariant, getPriceRange, getTotalStock } from '@/lib/product-variants';
import type { Product, ProductCategory, ProductVariant } from '@/lib/types';

const LIMIT = 10;

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc').max(200),
  sku: z.string().min(1, 'SKU là bắt buộc').max(100),
  price: z
    .string()
    .min(1, 'Giá bán là bắt buộc')
    .regex(/^\d+$/, 'Giá phải là số nguyên không âm'),
  stock: z
    .string()
    .min(1, 'Tồn kho là bắt buộc')
    .regex(/^\d+$/, 'Tồn kho phải là số nguyên không âm'),
  categoryIds: z.array(z.string()),
  description: z.string().max(5000).optional(),
  image: z.union([z.literal(''), z.string().url('Đường dẫn hình ảnh không hợp lệ')]),
});

type ProductForm = z.infer<typeof productSchema>;

function categoryLabel(category: ProductCategory, all: ProductCategory[]): string {
  const parent = category.parentId
    ? all.find((c) => c.id === category.parentId)
    : undefined;
  return parent ? `${parent.name} / ${category.name}` : category.name;
}

interface CategoryCheckboxListProps {
  categories: ProductCategory[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

function CategoryCheckboxList({
  categories,
  selected,
  onChange,
}: CategoryCheckboxListProps) {
  if (categories.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">Chưa có danh mục nào.</p>
    );
  }
  return (
    <div className="max-h-40 overflow-y-auto space-y-2 border border-border rounded-lg p-3">
      {categories.map((c) => (
        <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox
            checked={selected.includes(c.id)}
            onCheckedChange={(checked) =>
              onChange(
                checked ? [...selected, c.id] : selected.filter((id) => id !== c.id),
              )
            }
          />
          {categoryLabel(c, categories)}
        </label>
      ))}
    </div>
  );
}

interface VariantsEditorProps {
  product: Product;
}

function VariantsEditor({ product }: VariantsEditorProps) {
  const updateVariant = useUpdateProductVariant();
  const deleteVariant = useDeleteProductVariant();
  const createVariant = useCreateProductVariant();
  const [drafts, setDrafts] = useState<Record<string, { sku: string; price: string; stock: string }>>(
    () =>
      Object.fromEntries(
        product.variants.map((v) => [
          v.id,
          { sku: v.sku, price: String(v.price), stock: String(v.stock) },
        ]),
      ),
  );
  const [newVariant, setNewVariant] = useState({ sku: '', price: '', stock: '0' });
  const [showNewVariant, setShowNewVariant] = useState(false);

  function draftFor(v: ProductVariant) {
    return drafts[v.id] ?? { sku: v.sku, price: String(v.price), stock: String(v.stock) };
  }

  function updateDraft(id: string, field: 'sku' | 'price' | 'stock', value: string) {
    setDrafts((d) => {
      const current = d[id] ?? { sku: '', price: '', stock: '' };
      return { ...d, [id]: { ...current, [field]: value } };
    });
  }

  function saveVariant(v: ProductVariant) {
    const draft = draftFor(v);
    const priceCents = Number(draft.price);
    const stock = Number(draft.stock);
    if (!draft.sku.trim() || Number.isNaN(priceCents) || Number.isNaN(stock)) {
      toast.error('Vui lòng nhập SKU, giá và tồn kho hợp lệ');
      return;
    }
    updateVariant.mutate(
      { variantId: v.id, payload: { sku: draft.sku.trim(), priceCents, stock } },
      { onSuccess: () => toast.success('Đã cập nhật phân loại') },
    );
  }

  function addVariant() {
    const priceCents = Number(newVariant.price);
    const stock = Number(newVariant.stock);
    if (!newVariant.sku.trim() || !Number.isFinite(priceCents) || Number.isNaN(stock)) {
      toast.error('Vui lòng nhập SKU, giá và tồn kho hợp lệ');
      return;
    }
    createVariant.mutate(
      { productId: product.id, payload: { sku: newVariant.sku.trim(), priceCents, stock } },
      {
        onSuccess: () => {
          toast.success('Đã thêm phân loại mới');
          setNewVariant({ sku: '', price: '', stock: '0' });
          setShowNewVariant(false);
        },
      },
    );
  }

  return (
    <div className="space-y-3">
      {product.variants.map((v) => {
        const draft = draftFor(v);
        return (
          <div key={v.id} className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-center">
            <Input
              value={draft.sku}
              onChange={(e) => updateDraft(v.id, 'sku', e.target.value)}
              placeholder="SKU"
              className="h-9"
            />
            <Input
              type="number"
              min="0"
              value={draft.price}
              onChange={(e) => updateDraft(v.id, 'price', e.target.value)}
              placeholder="Giá"
              className="h-9"
            />
            <Input
              type="number"
              min="0"
              value={draft.stock}
              onChange={(e) => updateDraft(v.id, 'stock', e.target.value)}
              placeholder="Tồn kho"
              className="h-9"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs uppercase tracking-wider"
              disabled={updateVariant.isPending}
              onClick={() => saveVariant(v)}
            >
              Lưu
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 hover:text-destructive"
              disabled={deleteVariant.isPending || product.variants.length <= 1}
              title={
                product.variants.length <= 1
                  ? 'Sản phẩm phải có ít nhất một phân loại'
                  : undefined
              }
              onClick={() => deleteVariant.mutate(v.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      })}

      {showNewVariant ? (
        <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-center">
          <Input
            value={newVariant.sku}
            onChange={(e) => setNewVariant((v) => ({ ...v, sku: e.target.value }))}
            placeholder="SKU mới"
            className="h-9"
          />
          <Input
            type="number"
            min="0"
            value={newVariant.price}
            onChange={(e) => setNewVariant((v) => ({ ...v, price: e.target.value }))}
            placeholder="Giá"
            className="h-9"
          />
          <Input
            type="number"
            min="0"
            value={newVariant.stock}
            onChange={(e) => setNewVariant((v) => ({ ...v, stock: e.target.value }))}
            placeholder="Tồn kho"
            className="h-9"
          />
          <Button
            type="button"
            size="sm"
            className="h-9 text-xs uppercase tracking-wider"
            disabled={createVariant.isPending}
            onClick={addVariant}
          >
            Thêm
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={() => setShowNewVariant(false)}
          >
            <XCircle className="size-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs uppercase tracking-wider gap-2"
          onClick={() => setShowNewVariant(true)}
        >
          <Plus className="size-3.5" />
          Thêm phân loại
        </Button>
      )}
    </div>
  );
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
  const { data: catData } = useProductCategories();
  const categories = catData?.items ?? [];
  const defaultVariant = product ? getDefaultVariant(product) : undefined;

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      sku: defaultVariant?.sku ?? '',
      price: defaultVariant ? String(Math.round(defaultVariant.price)) : '',
      stock: String(defaultVariant?.stock ?? 0),
      categoryIds: [],
      description: product?.description ?? '',
      image: product?.image ?? '',
    },
  });

  function onSubmit(values: ProductForm) {
    if (isEdit) {
      update.mutate(
        {
          id: product.id,
          payload: {
            name: values.name.trim(),
            description: values.description?.trim() || null,
            image: values.image.trim() || null,
          },
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
      {
        name: values.name.trim(),
        description: values.description?.trim() || null,
        image: values.image.trim() || null,
        categoryIds: values.categoryIds.length > 0 ? values.categoryIds : undefined,
        variant: {
          sku: values.sku.trim(),
          priceCents: Number(values.price),
          stock: Number(values.stock),
        },
      },
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
      <DialogContent className="sm:max-w-[28rem] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            {isEdit ? 'Chỉnh sửa Sản phẩm' : 'Thêm sản phẩm mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
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

            {!isEdit && (
              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục sản phẩm</FormLabel>
                    <CategoryCheckboxList
                      categories={categories}
                      selected={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!isEdit && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="VD: DALAT-250G" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            )}

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

            {isEdit && (
              <>
                <Separator />
                <div className="space-y-2">
                  <FormLabel>Phân loại &amp; tồn kho</FormLabel>
                  <VariantsEditor product={product} />
                </div>
              </>
            )}

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
                {isEdit ? 'Đóng' : 'Hủy'}
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
            <div className="text-sm text-muted-foreground">
              {r.variants.length} phân loại
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Giá',
      render: (r) => {
        const { min, max } = getPriceRange(r);
        return (
          <span className="font-medium">
            {min === max
              ? `${min.toLocaleString('vi-VN')} ₫`
              : `${min.toLocaleString('vi-VN')}–${max.toLocaleString('vi-VN')} ₫`}
          </span>
        );
      },
    },
    {
      key: 'stock',
      header: 'Kho hàng',
      render: (r) => {
        const qty = getTotalStock(r);
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
              : String(
                  items.filter((p) => getTotalStock(p) > 0 && getTotalStock(p) <= 5)
                    .length,
                )
          }
          delta="Trên trang này"
          icon={AlertTriangle}
          tone="secondary"
        />
        <StatCard
          label="Hết hàng"
          value={isLoading ? '—' : String(items.filter((p) => getTotalStock(p) === 0).length)}
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
