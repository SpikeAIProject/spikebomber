'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@spike-ai/ui';

export function PromptHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ['usage-history'],
    queryFn: async () => {
      const res = await api.get('/usage/history?limit=5');
      return (res.data as { data?: Array<{ id: string; model: string; totalTokens: number; latencyMs: number; success: boolean; createdAt: string }> }).data ?? [];
    },
  });

  return (
    <div className="bg-background-secondary border border-border rounded-xl p-5">
      <h3 className="text-base font-semibold text-text-primary mb-4">Recent Requests</h3>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="text-center py-8 text-text-muted text-sm">
          <p>No requests yet. Try the AI Playground!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border hover:border-border-light transition-colors"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.success ? 'bg-green-400' : 'bg-red-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neon-blue">{log.model}</span>
                  <span className="text-xs text-text-muted">{log.totalTokens.toLocaleString()} tokens</span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="text-xs text-text-muted flex-shrink-0">{log.latencyMs}ms</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
