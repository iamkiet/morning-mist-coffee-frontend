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
  Tags,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useProducts,
  useUpdateProduct,
  useCreateProduct,
  useDeleteProduct,
  useCreateProductVariant,
  useUpdateProductVariant,
  useDeleteProductVariant,
} from '@/hooks/use-products';
import {
  useProductCategories,
  useCreateProductCategory,
} from '@/hooks/use-product-categories';
import {
  useProductProperties,
  useCreateProductProperty,
} from '@/hooks/use-product-properties';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { toast } from 'sonner';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import {
  getDefaultVariant,
  getPriceRange,
  getTotalStock,
} from '@/lib/product-variants';
import type {
  Product,
  ProductCategory,
  ProductVariant,
  PropertyDataType,
} from '@/lib/types';

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
  imageUrl: z.union([
    z.literal(''),
    z.string().url('Đường dẫn hình ảnh không hợp lệ'),
  ]),
});

type ProductForm = z.infer<typeof productSchema>;

function categoryLabel(
  category: ProductCategory,
  all: ProductCategory[],
): string {
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
        <label
          key={c.id}
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <Checkbox
            checked={selected.includes(c.id)}
            onCheckedChange={(checked) =>
              onChange(
                checked
                  ? [...selected, c.id]
                  : selected.filter((id) => id !== c.id),
              )
            }
          />
          {categoryLabel(c, categories)}
        </label>
      ))}
    </div>
  );
}

const PROPERTY_DATA_TYPES: { value: PropertyDataType; label: string }[] = [
  { value: 'text', label: 'Văn bản' },
  { value: 'number', label: 'Số' },
  { value: 'enum', label: 'Lựa chọn' },
];

const NO_PARENT = '__none__';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc').max(100),
  parentId: z.string(),
});

type CategoryForm = z.infer<typeof categoryFormSchema>;

interface CategoryCreateFormProps {
  categories: ProductCategory[];
}

function CategoryCreateForm({ categories }: CategoryCreateFormProps) {
  const createCategory = useCreateProductCategory();
  const form = useForm<CategoryForm>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: '', parentId: NO_PARENT },
  });

  function onSubmit(values: CategoryForm) {
    createCategory.mutate(
      {
        name: values.name.trim(),
        parentId: values.parentId === NO_PARENT ? null : values.parentId,
      },
      {
        onSuccess: () => {
          toast.success('Đã thêm danh mục');
          form.reset();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-[1fr_1fr_auto] gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Tên danh mục mới" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Danh mục cha (tùy chọn)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NO_PARENT}>Không có</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {categoryLabel(c, categories)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          className="text-xs uppercase tracking-wider"
          disabled={createCategory.isPending}
        >
          Thêm
        </Button>
      </form>
    </Form>
  );
}

const propertyFormSchema = z.object({
  name: z.string().min(1, 'Tên thuộc tính là bắt buộc').max(100),
  dataType: z.enum(['text', 'number', 'enum']),
});

type PropertyForm = z.infer<typeof propertyFormSchema>;

function PropertyCreateForm() {
  const createProperty = useCreateProductProperty();
  const form = useForm<PropertyForm>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: { name: '', dataType: 'text' },
  });

  function onSubmit(values: PropertyForm) {
    createProperty.mutate(
      { name: values.name.trim(), dataType: values.dataType },
      {
        onSuccess: () => {
          toast.success('Đã thêm thuộc tính');
          form.reset();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-[1fr_1fr_auto] gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Tên thuộc tính mới" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataType"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROPERTY_DATA_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          className="text-xs uppercase tracking-wider"
          disabled={createProperty.isPending}
        >
          Thêm
        </Button>
      </form>
    </Form>
  );
}

interface ManageTaxonomyDialogProps {
  onClose: () => void;
}

function ManageTaxonomyDialog({ onClose }: ManageTaxonomyDialogProps) {
  const { data: catData, isLoading: catLoading } = useProductCategories();
  const { data: propData, isLoading: propLoading } = useProductProperties();

  const categories = catData?.items ?? [];
  const properties = propData?.items ?? [];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[32rem] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Quản lý Danh mục &amp; Thuộc tính
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Danh mục sản phẩm
            </h3>
            {catLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : categories.length > 0 ? (
              <ul className="max-h-32 overflow-y-auto text-sm space-y-1 border border-border rounded-lg p-3">
                {categories.map((c) => (
                  <li key={c.id} className="text-foreground">
                    {categoryLabel(c, categories)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                Chưa có danh mục nào.
              </p>
            )}
            <CategoryCreateForm categories={categories} />
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Thuộc tính sản phẩm
            </h3>
            {propLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : properties.length > 0 ? (
              <ul className="max-h-32 overflow-y-auto text-sm space-y-1 border border-border rounded-lg p-3">
                {properties.map((p) => (
                  <li
                    key={p.id}
                    className="text-foreground flex justify-between"
                  >
                    <span>{p.name}</span>
                    <span className="text-muted-foreground text-xs uppercase">
                      {
                        PROPERTY_DATA_TYPES.find((t) => t.value === p.dataType)
                          ?.label
                      }
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                Chưa có thuộc tính nào.
              </p>
            )}
            <PropertyCreateForm />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="uppercase tracking-wider text-xs"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const variantFormSchema = z.object({
  sku: z.string().min(1, 'SKU là bắt buộc').max(100),
  price: z
    .string()
    .min(1, 'Giá là bắt buộc')
    .regex(/^\d+$/, 'Giá phải là số nguyên không âm'),
  stock: z
    .string()
    .min(1, 'Tồn kho là bắt buộc')
    .regex(/^\d+$/, 'Tồn kho phải là số nguyên không âm'),
});

type VariantForm = z.infer<typeof variantFormSchema>;

const VARIANT_ROW_CLASS =
  'grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-start';

interface VariantRowProps {
  variant: ProductVariant;
  deletable: boolean;
}

function VariantRow({ variant, deletable }: VariantRowProps) {
  const updateVariant = useUpdateProductVariant();
  const deleteVariant = useDeleteProductVariant();
  const form = useForm<VariantForm>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      sku: variant.sku,
      price: String(variant.price),
      stock: String(variant.stock),
    },
  });

  function onSubmit(values: VariantForm) {
    updateVariant.mutate(
      {
        variantId: variant.id,
        payload: {
          sku: values.sku.trim(),
          priceCents: Number(values.price),
          stock: Number(values.stock),
        },
      },
      { onSuccess: () => toast.success('Đã cập nhật phân loại') },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={VARIANT_ROW_CLASS}
      >
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="SKU" {...field} />
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
              <FormControl>
                <Input type="number" min="0" placeholder="Giá" {...field} />
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
              <FormControl>
                <Input type="number" min="0" placeholder="Tồn kho" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="outline"
          size="default"
          className="text-xs uppercase tracking-wider"
          disabled={updateVariant.isPending}
        >
          Lưu
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 hover:text-destructive"
          disabled={deleteVariant.isPending || !deletable}
          title={
            deletable ? undefined : 'Sản phẩm phải có ít nhất một phân loại'
          }
          onClick={() => deleteVariant.mutate(variant.id)}
        >
          <Trash2 className="size-4" />
        </Button>
      </form>
    </Form>
  );
}

interface NewVariantFormProps {
  productId: string;
  onDone: () => void;
}

function NewVariantForm({ productId, onDone }: NewVariantFormProps) {
  const createVariant = useCreateProductVariant();
  const form = useForm<VariantForm>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: { sku: '', price: '', stock: '0' },
  });

  function onSubmit(values: VariantForm) {
    createVariant.mutate(
      {
        productId,
        payload: {
          sku: values.sku.trim(),
          priceCents: Number(values.price),
          stock: Number(values.stock),
        },
      },
      {
        onSuccess: () => {
          toast.success('Đã thêm phân loại mới');
          onDone();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={VARIANT_ROW_CLASS}
      >
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="SKU mới" {...field} />
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
              <FormControl>
                <Input type="number" min="0" placeholder="Giá" {...field} />
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
              <FormControl>
                <Input type="number" min="0" placeholder="Tồn kho" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          className="text-xs uppercase tracking-wider"
          disabled={createVariant.isPending}
        >
          Thêm
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onDone}>
          <XCircle className="size-4" />
        </Button>
      </form>
    </Form>
  );
}

interface VariantsEditorProps {
  product: Product;
}

function VariantsEditor({ product }: VariantsEditorProps) {
  const [showNewVariant, setShowNewVariant] = useState(false);

  return (
    <div className="space-y-3">
      {product.variants.map((v) => (
        <VariantRow
          key={v.id}
          variant={v}
          deletable={product.variants.length > 1}
        />
      ))}

      {showNewVariant ? (
        <NewVariantForm
          productId={product.id}
          onDone={() => setShowNewVariant(false)}
        />
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
      imageUrl: product?.imageUrl ?? '',
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
            imageUrl: values.imageUrl.trim() || null,
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
        imageUrl: values.imageUrl.trim() || null,
        categoryIds:
          values.categoryIds.length > 0 ? values.categoryIds : undefined,
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
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
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          {...field}
                        />
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
                    <Textarea
                      rows={3}
                      placeholder="Mô tả ngắn về hương vị..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
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
  const [taxonomyDialogOpen, setTaxonomyDialogOpen] = useState(false);
  const [deleteProductConfirm, setDeleteProductConfirm] =
    useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isError } = useProducts(
    page,
    LIMIT,
    debouncedSearch,
  );
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
              src={r.imageUrl}
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
              {r.variants.length === 1
                ? r.variants[0].sku
                : `${r.variants.length} phân loại`}
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
        eyebrow="Sản phẩm"
        title="Quản lý Kho hàng"
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
            <Button
              variant="outline"
              className="uppercase tracking-wider"
              onClick={() => setTaxonomyDialogOpen(true)}
            >
              <Tags className="size-4" />
              Danh mục &amp; Thuộc tính
            </Button>
            <Button
              className="uppercase tracking-wider"
              onClick={() => setCreateDialogOpen(true)}
            >
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
                  items.filter(
                    (p) => getTotalStock(p) > 0 && getTotalStock(p) <= 5,
                  ).length,
                )
          }
          delta="Trên trang này"
          icon={AlertTriangle}
          tone="secondary"
        />
        <StatCard
          label="Hết hàng"
          value={
            isLoading
              ? '—'
              : String(items.filter((p) => getTotalStock(p) === 0).length)
          }
          delta="Trên trang này"
          icon={XCircle}
          tone="tertiary"
        />
      </section>

      {isError && (
        <ErrorNotice>
          Không thể tải danh sách sản phẩm. Vui lòng thử lại.
        </ErrorNotice>
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
      )}

      {editProduct && (
        <ProductDialog
          product={editProduct}
          onClose={() => setEditProduct(null)}
        />
      )}

      {createDialogOpen && (
        <ProductDialog onClose={() => setCreateDialogOpen(false)} />
      )}

      {taxonomyDialogOpen && (
        <ManageTaxonomyDialog onClose={() => setTaxonomyDialogOpen(false)} />
      )}

      {deleteProductConfirm && (
        <Dialog
          open
          onOpenChange={(open) => !open && setDeleteProductConfirm(null)}
        >
          <DialogContent className="sm:max-w-[24rem]">
            <DialogHeader>
              <DialogTitle className="text-sm uppercase tracking-widest font-medium">
                Xác nhận Xóa
              </DialogTitle>
            </DialogHeader>
            <div className="py-2 text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa sản phẩm{' '}
              <strong>{deleteProductConfirm.name}</strong> không? Hành động này
              không thể hoàn tác.
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
