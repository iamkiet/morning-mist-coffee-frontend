import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProductProperties,
  createProductProperty,
} from '@/lib/api/product-properties';
import type { PropertyDataType } from '@/lib/types';

export function useProductProperties() {
  return useQuery({
    queryKey: ['productProperties'],
    queryFn: fetchProductProperties,
    staleTime: 1000 * 60 * 5, // Properties change rarely — deliberately longer than the global 60s
  });
}

export function useCreateProductProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, dataType }: { name: string; dataType?: PropertyDataType }) =>
      createProductProperty(name, dataType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productProperties'] });
    },
  });
}
