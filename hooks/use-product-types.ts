import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProductTypes, createProductType } from '@/lib/api/product-types';

export function useProductTypes() {
  return useQuery({
    queryKey: ['productTypes'],
    queryFn: fetchProductTypes,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time since categories rarely change
  });
}

export function useCreateProductType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createProductType(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
    },
  });
}
