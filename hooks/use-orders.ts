import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, updateOrderStatus, type OrderStatus } from "@/lib/api/orders";

export function useOrders(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => fetchOrders(limit, offset),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
