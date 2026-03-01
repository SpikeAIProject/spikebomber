'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@spike-ai/ui';
import { useAdminAuthStore } from '@/store/admin-auth.store';
import { apiClient } from '@/lib/api-client';

export default function AdminUsagePage() {
  const { accessToken } = useAdminAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () =>
      apiClient.get<{
        totalUsers: number;
        totalTenants: number;
        totalRequests: number;
        totalTokens: number;
      }>('admin/stats', { token: accessToken || '' }),
    enabled: !!accessToken,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Uso & Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Métricas globais de uso da plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Total de Requisições
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalRequests?.toLocaleString() ?? 0}</p>
            <Badge variant="success" className="mt-2">Acumulado</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Total de Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalTokens?.toLocaleString() ?? 0}</p>
            <Badge variant="info" className="mt-2">Acumulado</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uso por Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Detalhamento por tenant em desenvolvimento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
