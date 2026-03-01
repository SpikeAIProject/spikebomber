'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@spike-ai/ui';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api-client';

export default function SettingsPage() {
  const { user, accessToken } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.patch('users/me', { name }, { token: accessToken || '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie seu perfil e preferências</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nome</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <Input value={user?.email || ''} disabled />
          </div>
          {success && <p className="text-sm text-emerald-500">Salvo com sucesso!</p>}
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
