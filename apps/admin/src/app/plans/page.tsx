import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Plan Management' };

const PLAN_CONFIGS = [
  { name: 'Free', tier: 'FREE', price: '$0', tokens: '10K', status: 'Active' },
  { name: 'Starter', tier: 'STARTER', price: '$29/mo', tokens: '500K', status: 'Active' },
  { name: 'Pro', tier: 'PRO', price: '$99/mo', tokens: '5M', status: 'Active' },
  { name: 'Enterprise', tier: 'ENTERPRISE', price: 'Custom', tokens: 'Unlimited', status: 'Active' },
];

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Plans</h1>
        <p className="text-text-secondary mt-1">Manage subscription plans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLAN_CONFIGS.map((plan) => (
          <div
            key={plan.tier}
            className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-5 hover:border-[#3A3A52] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="font-semibold text-text-primary">{plan.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                {plan.status}
              </span>
            </div>
            <p className="text-2xl font-bold text-text-primary mb-1">{plan.price}</p>
            <p className="text-sm text-text-secondary">{plan.tokens} tokens/mo</p>
          </div>
        ))}
      </div>
    </div>
  );
}
