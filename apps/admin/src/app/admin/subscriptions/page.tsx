'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@spike-ai/ui';

export default function AdminSubscriptionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Assinaturas</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie assinaturas de tenants</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Assinaturas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Em desenvolvimento — dados serão carregados via API</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
