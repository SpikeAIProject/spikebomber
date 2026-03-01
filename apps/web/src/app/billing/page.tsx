'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CreditCard, ExternalLink } from 'lucide-react';

const PLANS = [
  { name: 'Free', tier: 'FREE', price: 0, tokens: '10K', requests: '100' },
  { name: 'Starter', tier: 'STARTER', price: 29, tokens: '500K', requests: '5K' },
  { name: 'Pro', tier: 'PRO', price: 99, tokens: '5M', requests: '50K' },
  { name: 'Enterprise', tier: 'ENTERPRISE', price: null, tokens: 'Unlimited', requests: 'Unlimited' },
];

export default function BillingPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await api.get('/subscriptions/current');
      return (res.data as { plan?: { name?: string; tier?: string }; status?: string; currentPeriodEnd?: string; tokensUsed?: number; requestsUsed?: number });
    },
  });

  const handleSubscribe = async (priceId: string) => {
    setIsRedirecting(true);
    try {
      const res = await api.post('/billing/subscribe', { priceId });
      const { url } = res.data as { url?: string };
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Failed to create checkout session:', err);
    } finally {
      setIsRedirecting(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await api.get('/billing/portal');
      const { url } = res.data as { url?: string };
      if (url) window.open(url, '_blank');
    } catch (err) {
      console.error('Failed to open billing portal:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Billing</h1>
        <p className="text-text-secondary mt-1">Manage your subscription and billing</p>
      </div>

      {/* Current plan */}
      {subscription && (
        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-1">Current Plan</h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold neon-text">{subscription.plan?.name ?? 'Free'}</span>
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs">
                  {subscription.status ?? 'ACTIVE'}
                </span>
              </div>
              {subscription.currentPeriodEnd && (
                <p className="text-sm text-text-secondary mt-1">
                  Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={handleManageBilling}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:border-neon-blue hover:text-text-primary transition-all"
            >
              <CreditCard className="w-4 h-4" />
              Manage Billing
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-background border border-border">
              <p className="text-xs text-text-secondary">Tokens Used</p>
              <p className="text-xl font-bold text-text-primary">
                {(subscription.tokensUsed ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background border border-border">
              <p className="text-xs text-text-secondary">Requests Used</p>
              <p className="text-xl font-bold text-text-primary">
                {(subscription.requestsUsed ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = subscription?.plan?.tier === plan.tier;
            return (
              <div
                key={plan.tier}
                className={`bg-background-secondary rounded-xl p-5 border transition-all ${isCurrent ? 'border-neon-blue shadow-neon-blue' : 'border-border hover:border-border-light'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-text-primary">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
                      Current
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  {plan.price !== null ? (
                    <span className="text-2xl font-bold text-text-primary">${plan.price}<span className="text-sm text-text-secondary">/mo</span></span>
                  ) : (
                    <span className="text-2xl font-bold neon-text">Custom</span>
                  )}
                </div>
                <ul className="space-y-1.5 mb-4 text-xs text-text-secondary">
                  <li>• {plan.tokens} tokens/month</li>
                  <li>• {plan.requests} requests/month</li>
                </ul>
                {!isCurrent && (
                  <button
                    onClick={() => plan.price !== null ? handleSubscribe(`price_${plan.tier.toLowerCase()}_monthly`) : undefined}
                    disabled={isRedirecting}
                    className="w-full h-8 rounded-md text-xs font-medium bg-background border border-border text-text-secondary hover:border-neon-blue hover:text-neon-blue transition-all disabled:opacity-50"
                  >
                    {plan.price === null ? 'Contact Sales' : 'Upgrade'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
