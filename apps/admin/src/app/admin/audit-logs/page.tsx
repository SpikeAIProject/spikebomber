'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@spike-ai/ui';
import { useAdminAuthStore } from '@/store/admin-auth.store';
import { apiClient } from '@/lib/api-client';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  createdAt: string;
  user?: { email: string; name: string };
  ipAddress?: string;
}

export default function AdminAuditLogsPage() {
  const { accessToken } = useAdminAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () =>
      apiClient.get<{ data: AuditLog[]; total: number }>(
        'admin/audit-logs?limit=50',
        { token: accessToken || '' },
      ),
    enabled: !!accessToken,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Histórico de ações na plataforma ({data?.total ?? 0} registros)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground text-sm">Carregando...</p>
          ) : !data?.data?.length ? (
            <p className="text-center py-8 text-muted-foreground text-sm">Nenhum log encontrado</p>
          ) : (
            <div className="space-y-2">
              {data.data.map((log) => (
                <div key={log.id} className="p-3 rounded-md border border-border/50 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-primary">{log.action}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {log.entity} {log.entityId && `• ${log.entityId}`}
                    {log.user && ` • ${log.user.email}`}
                    {log.ipAddress && ` • ${log.ipAddress}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
