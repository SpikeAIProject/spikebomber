interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'purple';
}

export function MetricCard({ title, value, change, icon, color = 'blue' }: MetricCardProps) {
  const colors = {
    blue: { bg: 'rgba(0,212,255,0.1)', text: '#00D4FF', border: 'rgba(0,212,255,0.2)' },
    purple: { bg: 'rgba(123,47,255,0.1)', text: '#7B2FFF', border: 'rgba(123,47,255,0.2)' },
  };
  const c = colors[color];

  return (
    <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-5 hover:border-[#3A3A52] transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last period
            </p>
          )}
        </div>
        {icon && (
          <div
            className="p-2.5 rounded-lg"
            style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
