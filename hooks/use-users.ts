import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/users";

export function useUsers(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => fetchUsers(limit, offset),
  });
}
