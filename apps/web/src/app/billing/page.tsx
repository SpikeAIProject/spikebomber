'use client';

import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@spike-ai/ui';
import { CreditCard, Download } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api-client';

export default function BillingPage() {
  const { accessToken } = useAuthStore();

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiClient.get<{ plan: { name: string; tier: string }; status: string; currentPeriodEnd: string } | null>('subscriptions/current', { token: accessToken || '' }),
    enabled: !!accessToken,
  });

  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => apiClient.get<Array<{ id: string; amount: string; status: string; createdAt: string }>>('billing/invoices', { token: accessToken || '' }),
    enabled: !!accessToken,
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">Gerencie sua assinatura e faturas</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Plano Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{subscription?.plan?.name || 'Free'}</p>
              <Badge variant={subscription?.status === 'ACTIVE' ? 'success' : 'warning'}>
                {subscription?.status || 'Inativo'}
              </Badge>
              {subscription?.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground mt-1">
                  Renova em {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Gerenciar assinatura
              </Button>
              <Button>Fazer upgrade</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          {!invoices?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>Nenhuma fatura encontrada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-md border border-border">
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(invoice.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground">R$ {invoice.amount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={invoice.status === 'PAID' ? 'success' : 'warning'}>
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
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
