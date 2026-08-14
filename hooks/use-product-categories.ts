import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProductCategories,
  createProductCategory,
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
    mutationFn: ({ name, parentId }: { name: string; parentId?: string | null }) =>
      createProductCategory(name, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });
}
