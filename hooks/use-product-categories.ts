import { useQuery } from '@tanstack/react-query';
import { fetchProductCategories } from '@/lib/api/product-categories';

export function useProductCategories() {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: fetchProductCategories,
    staleTime: 1000 * 60 * 5, // Categories change rarely — deliberately longer than the global 60s
  });
}
