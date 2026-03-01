import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

interface UsageSummary {
  totalTokens: number;
  totalRequests: number;
  totalCost: number;
  successRate: number;
  avgLatencyMs: number;
  subscription: {
    plan: string;
    tier: string;
    tokensUsed: number;
    tokenLimit: number;
    requestsUsed: number;
    requestLimit: number;
  } | null;
}

export function useUsage() {
  return useQuery<UsageSummary>({
    queryKey: ['usage-summary'],
    queryFn: async () => {
      const res = await api.get('/usage');
      return res.data as UsageSummary;
    },
    staleTime: 30_000,
  });
}

export function useUsageHistory(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['usage-history', page, limit],
    queryFn: async () => {
      const res = await api.get(`/usage/history?page=${page}&limit=${limit}`);
      return res.data as {
        data: Array<{
          id: string;
          model: string;
          totalTokens: number;
          latencyMs: number;
          success: boolean;
          createdAt: string;
        }>;
        meta: { total: number; totalPages: number };
      };
    },
  });
}
