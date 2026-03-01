'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#00D4FF', '#7B2FFF', '#00FF88', '#FF6B6B', '#FFB347'];

export function ModelSelector() {
  const { data } = useQuery({
    queryKey: ['model-breakdown'],
    queryFn: async () => {
      const res = await api.get('/analytics/models?days=30');
      return (res.data as Array<{ model: string; requests: number; totalTokens: number }>) ?? [];
    },
  });

  if (!data || data.length === 0) {
    return (
      <div className="bg-background-secondary border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold text-text-primary mb-4">Model Usage Breakdown</h3>
        <div className="h-48 flex items-center justify-center text-text-muted text-sm">
          No model data yet
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.model.replace('gemini-', '').replace('1.5-', ''),
    value: item.requests,
    tokens: item.totalTokens,
  }));

  return (
    <div className="bg-background-secondary border border-border rounded-xl p-5">
      <h3 className="text-base font-semibold text-text-primary mb-4">Model Usage (30 days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#12121A',
              border: '1px solid #2A2A3E',
              borderRadius: '8px',
              color: '#E8E8F0',
              fontSize: '12px',
            }}
            formatter={(value: number) => [`${value} requests`, 'Requests']}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: '#9090A8', fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
