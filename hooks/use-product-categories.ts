import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  type UpdateProductCategoryPayload,
} from '@/lib/api/product-categories';

export function useProductCategories() {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: fetchProductCategories,
    staleTime: 1000 * 60 * 5, // Categories change rarely — deliberately longer than the global 60s
  });
}

export function useCreateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name }: { name: string }) => createProductCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });
}

export function useUpdateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductCategoryPayload;
    }) => updateProductCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });
}

export function useDeleteProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });
}
