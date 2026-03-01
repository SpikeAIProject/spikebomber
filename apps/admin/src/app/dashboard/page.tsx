import { Metadata } from 'next';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { Users, TrendingUp, Zap, DollarSign } from 'lucide-react';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Platform overview and metrics</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value="—"
          change={0}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Monthly Revenue"
          value="$—"
          change={0}
          icon={<DollarSign className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Tokens Used (month)"
          value="—"
          change={0}
          icon={<Zap className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Active Subscriptions"
          value="—"
          change={0}
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <UsageChart />
      </div>
    </div>
  );
}
