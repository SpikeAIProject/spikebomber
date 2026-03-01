'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@spike-ai/ui';
import { Shield, Loader2 } from 'lucide-react';
import { useAdminAuthStore } from '@/store/admin-auth.store';
import { apiClient } from '@/lib/api-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAdminAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiClient.post<{ accessToken: string }>('auth/login', { email, password });
      const user = await apiClient.get<{ id: string; email: string; name: string; role: string }>(
        'users/me',
        { token: data.accessToken },
      );
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        throw new Error('Acesso negado: permissões insuficientes');
      }
      setAuth(user, data.accessToken);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <p className="font-bold text-xl">SPIKE AI</p>
            <p className="text-xs text-muted-foreground">Painel Administrativo</p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input
                  type="email"
                  placeholder="admin@spikeai.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Entrar no painel admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
