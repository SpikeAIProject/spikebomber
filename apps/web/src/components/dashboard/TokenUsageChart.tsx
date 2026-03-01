'use client';

import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import { Skeleton } from '@spike-ai/ui';

export function TokenUsageChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['daily-usage'],
    queryFn: async () => {
      const res = await api.get('/usage/daily?days=14');
      return (res.data as Array<{ date: string; tokens: number; requests: number }>) ?? [];
    },
  });

  const chartData = data?.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tokensK: Math.round(d.tokens / 1000),
  })) ?? [];

  return (
    <div className="bg-background-secondary border border-border rounded-xl p-5">
      <h3 className="text-base font-semibold text-text-primary mb-4">Token Usage (14 days)</h3>
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-text-muted text-sm">
          No usage data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3E" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#9090A8', fontSize: 11 }}
              axisLine={{ stroke: '#2A2A3E' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9090A8', fontSize: 11 }}
              axisLine={{ stroke: '#2A2A3E' }}
              tickLine={false}
              tickFormatter={(v: number) => `${v}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121A',
                border: '1px solid #2A2A3E',
                borderRadius: '8px',
                color: '#E8E8F0',
              }}
              formatter={(value: number) => [`${value}K tokens`, 'Usage']}
            />
            <Area
              type="monotone"
              dataKey="tokensK"
              stroke="#00D4FF"
              strokeWidth={2}
              fill="url(#tokenGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
