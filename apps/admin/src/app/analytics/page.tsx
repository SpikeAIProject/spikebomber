import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Analytics' };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="text-text-secondary mt-1">Platform usage analytics and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['API Calls Today', 'Tokens Generated', 'Active Users'].map((metric) => (
          <div
            key={metric}
            className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-5"
          >
            <p className="text-sm text-text-secondary">{metric}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">—</p>
          </div>
        ))}
      </div>

      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">Usage Over Time</h2>
        <p className="text-text-muted text-sm">Analytics charts loading...</p>
      </div>
    </div>
  );
}
