import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  status: string;
  permissions: string[];
  lastUsedAt: string | null;
  createdAt: string;
}

interface CreateKeyResult extends APIKey {
  rawKey: string;
}

export function useApiKeys() {
  const queryClient = useQueryClient();

  const query = useQuery<APIKey[]>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const res = await api.get('/api-keys');
      return (res.data as APIKey[]) ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post<CreateKeyResult>('/api-keys', { name });
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api-keys/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const rotateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<CreateKeyResult>(`/api-keys/${id}/rotate`);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  return {
    apiKeys: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createKey: createMutation.mutateAsync,
    revokeKey: revokeMutation.mutateAsync,
    rotateKey: rotateMutation.mutateAsync,
  };
}
