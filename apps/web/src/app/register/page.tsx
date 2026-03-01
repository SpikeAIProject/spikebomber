'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      router.push('/login?registered=true');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 hero-grid-bg opacity-30" />
      <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl font-bold neon-text">SPIKE AI</span>
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary mt-4">Create your account</h1>
          <p className="text-text-secondary mt-1">Start building with AI today</p>
        </div>

        <div className="glass-card">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Full name</label>
              <input
                {...register('name')}
                type="text"
                placeholder="Jane Doe"
                className="w-full h-10 px-3 rounded-md border border-border bg-background-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue transition-all"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full h-10 px-3 rounded-md border border-border bg-background-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue transition-all"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="Min 8 chars, upper, lower, number"
                className="w-full h-10 px-3 rounded-md border border-border bg-background-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue transition-all"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Repeat your password"
                className="w-full h-10 px-3 rounded-md border border-border bg-background-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue transition-all"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-gradient-neon text-white font-semibold shadow-neon-blue hover:shadow-neon-blue-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-text-muted">
            By registering, you agree to our{' '}
            <Link href="/terms" className="text-neon-blue hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-neon-blue hover:underline">Privacy Policy</Link>
          </p>

          <div className="mt-6 text-center">
            <span className="text-text-secondary text-sm">Already have an account? </span>
            <Link href="/login" className="text-neon-blue hover:underline text-sm font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
