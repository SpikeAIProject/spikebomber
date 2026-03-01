'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    const result = await signIn('credentials', { ...data, redirect: false });
    if (result?.error) {
      setError('Invalid admin credentials');
      setIsLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-neon-blue/10 border border-neon-blue/30 mb-4">
            <ShieldCheck className="w-7 h-7 text-neon-blue" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Access</h1>
          <p className="text-text-secondary text-sm mt-1">SPIKE AI Administration Panel</p>
        </div>

        <div className="glass-card p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full h-10 px-3 rounded-md border border-[#2A2A3E] bg-[#12121A] text-text-primary text-sm focus:outline-none focus:border-neon-blue transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <input
                {...register('password')}
                type="password"
                className="w-full h-10 px-3 rounded-md border border-[#2A2A3E] bg-[#12121A] text-text-primary text-sm focus:outline-none focus:border-neon-blue transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-gradient-neon text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #7B2FFF 100%)' }}
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isLoading ? 'Authenticating...' : 'Sign in to Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
