import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TokenUsageChart } from '@/components/dashboard/TokenUsageChart';
import { PromptHistory } from '@/components/dashboard/PromptHistory';
import { ModelSelector } from '@/components/dashboard/ModelSelector';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {session?.user?.name?.split(' ')[0] ?? 'User'} 👋
          </h1>
          <p className="text-text-secondary mt-1">Here&apos;s your AI usage overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/30">
          <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
          <span className="text-xs text-neon-blue font-medium">API Online</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tokens This Month', value: '0', subtext: 'of 10,000 limit', color: 'blue' },
          { label: 'Requests Today', value: '0', subtext: '+0 from yesterday', color: 'purple' },
          { label: 'API Keys', value: '0', subtext: 'active keys', color: 'blue' },
          { label: 'Avg Response', value: '—', subtext: 'last 7 days', color: 'purple' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-background-secondary border border-border rounded-xl p-5 hover:border-neon-blue/40 transition-colors"
          >
            <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted mt-1">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenUsageChart />
        <ModelSelector />
      </div>

      {/* Prompt history */}
      <PromptHistory />
    </div>
  );
}
