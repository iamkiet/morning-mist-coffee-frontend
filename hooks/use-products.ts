import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProduct } from "@/lib/api/products";

export function useProducts(page = 1, limit = 8) {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => fetchProducts(limit, offset),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  });
}
