'use client';

import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';

export function UsageChart() {
  const { data } = useQuery({
    queryKey: ['admin-usage-chart'],
    queryFn: async () => {
      const res = await api.get('/admin/usage?days=14');
      return (res.data as { daily?: Array<{ date: string; tokens: number }> }).daily ?? [];
    },
  });

  return (
    <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-5">
      <h3 className="text-base font-semibold text-text-primary mb-4">Token Usage (14 days)</h3>
      {!data || data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-text-muted text-sm">No data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3E" />
            <XAxis dataKey="date" tick={{ fill: '#9090A8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9090A8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#12121A', border: '1px solid #2A2A3E', borderRadius: '8px', color: '#E8E8F0' }}
            />
            <Line type="monotone" dataKey="tokens" stroke="#00D4FF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
