'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@spike-ai/ui';
import { Zap, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api-client';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', tenantName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiClient.post<{ accessToken: string }>('auth/register', form);
      const user = await apiClient.get<{ id: string; email: string; name: string; role: string; tenantId: string }>('users/me', { token: data.accessToken });
      setAuth(user, data.accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Zap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            SPIKE AI
          </span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Criar conta gratuita</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Nome completo</label>
                <Input
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Senha</label>
                <Input
                  type="password"
                  placeholder="Mín. 8 caracteres"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Nome da empresa (opcional)</label>
                <Input
                  placeholder="Acme Corp"
                  value={form.tenantName}
                  onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Criar conta
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Já tem conta?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
