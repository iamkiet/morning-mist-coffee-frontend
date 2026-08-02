import { useQuery } from '@tanstack/react-query';
import { fetchProductTypes } from '@/lib/api/product-types';

export function useProductTypes() {
  return useQuery({
    queryKey: ['productTypes'],
    queryFn: fetchProductTypes,
    staleTime: 1000 * 60 * 5, // Categories change rarely — deliberately longer than the global 60s
  });
}
