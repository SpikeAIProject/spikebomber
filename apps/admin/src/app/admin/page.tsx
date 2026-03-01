'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@spike-ai/ui';
import { Users, Building2, Zap, Activity } from 'lucide-react';
import { useAdminAuthStore } from '@/store/admin-auth.store';
import { apiClient } from '@/lib/api-client';

export default function AdminDashboardPage() {
  const { accessToken } = useAdminAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiClient.get<{
      totalUsers: number;
      totalTenants: number;
      totalRequests: number;
      totalTokens: number;
    }>('admin/stats', { token: accessToken || '' }),
    enabled: !!accessToken,
  });

  const metrics = [
    { title: 'Total de Usuários', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-blue-400' },
    { title: 'Tenants Ativos', value: stats?.totalTenants ?? 0, icon: Building2, color: 'text-purple-400' },
    { title: 'Requisições Totais', value: stats?.totalRequests?.toLocaleString() ?? 0, icon: Activity, color: 'text-green-400' },
    { title: 'Tokens Consumidos', value: stats?.totalTokens?.toLocaleString() ?? 0, icon: Zap, color: 'text-yellow-400' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da plataforma SPIKE AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma atividade recente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status dos Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['API', 'Database', 'Redis', 'AI Provider'].map((service) => (
                <div key={service} className="flex items-center justify-between py-1">
                  <span className="text-sm">{service}</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                    Operacional
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
