import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, updateUser, type UpdateUserPayload } from '@/lib/api/users';

export function useUsers(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => fetchUsers(limit, offset),
    staleTime: 1000 * 60,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
