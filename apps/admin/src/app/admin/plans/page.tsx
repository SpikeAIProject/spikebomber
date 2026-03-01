'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@spike-ai/ui';
import { Plus } from 'lucide-react';
import { useAdminAuthStore } from '@/store/admin-auth.store';
import { apiClient } from '@/lib/api-client';

interface Plan {
  id: string;
  name: string;
  tier: string;
  monthlyPrice: string;
  requestsPerMonth: number;
  isActive: boolean;
}

export default function AdminPlansPage() {
  const { accessToken } = useAdminAuthStore();

  const { data: plans } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: () =>
      apiClient.get<Plan[]>('subscriptions/plans', { token: accessToken || '' }),
    enabled: !!accessToken,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planos</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie os planos disponíveis</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans?.map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{plan.name}</CardTitle>
              <div className="flex gap-1">
                <Badge variant={plan.isActive ? 'success' : 'warning'}>
                  {plan.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
                <Badge variant="info">{plan.tier}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">
                R$ {plan.monthlyPrice}
                <span className="text-sm font-normal text-muted-foreground">/mês</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {plan.requestsPerMonth.toLocaleString()} requisições/mês
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">Editar</Button>
                <Button variant="ghost" size="sm">Desativar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!plans?.length && (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            <p>Nenhum plano cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
