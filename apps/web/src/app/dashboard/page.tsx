'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@spike-ai/ui';
import { BarChart3, Zap, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api-client';

export default function DashboardPage() {
  const { accessToken } = useAuthStore();

  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: () => apiClient.get<{
      requestsUsed: number;
      requestsLimit: number;
      tokensUsed: number;
      tokensLimit: number;
      resetAt: string;
    }>('usage', { token: accessToken || '' }),
    enabled: !!accessToken,
  });

  const stats = [
    {
      title: 'Requisições este mês',
      value: usage?.requestsUsed?.toLocaleString() ?? '0',
      limit: usage?.requestsLimit?.toLocaleString() ?? '10.000',
      icon: BarChart3,
      trend: '+12%',
    },
    {
      title: 'Tokens consumidos',
      value: usage?.tokensUsed?.toLocaleString() ?? '0',
      limit: usage?.tokensLimit?.toLocaleString() ?? '1.000.000',
      icon: Zap,
      trend: '+8%',
    },
    {
      title: 'Latência média',
      value: '324ms',
      limit: null,
      icon: Clock,
      trend: '-5%',
    },
    {
      title: 'Taxa de sucesso',
      value: '99.8%',
      limit: null,
      icon: TrendingUp,
      trend: '+0.1%',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">
          Métricas e status da sua conta SPIKE AI
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.limit && (
                <p className="text-xs text-muted-foreground mt-1">
                  de {stat.limit}
                </p>
              )}
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="success" className="text-xs">
                  <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" />
                  {stat.trend}
                </Badge>
                <span className="text-xs text-muted-foreground">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhuma atividade ainda</p>
            <p className="text-sm mt-1">Faça sua primeira requisição no Playground</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
