'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';

export function RevenueChart() {
  const { data } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: async () => {
      const res = await api.get('/admin/usage?days=30');
      return (res.data as { daily?: Array<{ date: string; requests: number }> }).daily ?? [];
    },
  });

  return (
    <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-5">
      <h3 className="text-base font-semibold text-text-primary mb-4">Revenue (30 days)</h3>
      {!data || data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-text-muted text-sm">No data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3E" />
            <XAxis dataKey="date" tick={{ fill: '#9090A8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9090A8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#12121A', border: '1px solid #2A2A3E', borderRadius: '8px', color: '#E8E8F0' }}
            />
            <Bar dataKey="requests" fill="#7B2FFF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
