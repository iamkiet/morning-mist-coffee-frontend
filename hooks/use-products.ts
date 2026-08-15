import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProducts,
  updateProduct,
  createProduct,
  deleteProduct,
  setProductCategories,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  setVariantPropertyValues,
  type UpdateProductPayload,
  type CreateProductPayload,
  type CreateProductVariantPayload,
  type UpdateProductVariantPayload,
} from '@/lib/api/products';

export function useProducts(page: number, limit: number, q = '') {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ['products', page, limit, q],
    queryFn: () => fetchProducts(limit, offset, q),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSetProductCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, categoryIds }: { id: string; categoryIds: string[] }) =>
      setProductCategories(id, categoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useCreateProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: CreateProductVariantPayload;
    }) => createProductVariant(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      payload,
    }: {
      variantId: string;
      payload: UpdateProductVariantPayload;
    }) => updateProductVariant(variantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) => deleteProductVariant(variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSetVariantPropertyValues() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      values,
    }: {
      variantId: string;
      values: Array<{ propertyId: string; value: string }>;
    }) => setVariantPropertyValues(variantId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
