import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = { title: 'Pricing' };

const plans = [
  {
    name: 'Free',
    tier: 'FREE',
    price: 0,
    annualPrice: 0,
    description: 'Perfect for exploring SPIKE AI',
    features: ['10,000 tokens/month', '100 requests/month', 'Gemini Flash model', '1 API key', 'Community support'],
    cta: 'Start Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Starter',
    tier: 'STARTER',
    price: 29,
    annualPrice: 23,
    description: 'For developers and small teams',
    features: ['500K tokens/month', '5,000 requests/month', 'All Gemini models', '5 API keys', 'Email support', 'Usage analytics'],
    cta: 'Start with Starter',
    href: '/register?plan=starter',
    highlight: false,
  },
  {
    name: 'Pro',
    tier: 'PRO',
    price: 99,
    annualPrice: 79,
    description: 'For growing teams and production apps',
    features: ['5M tokens/month', '50,000 requests/month', 'All Gemini models + Vision', 'Unlimited API keys', 'Priority support', 'Advanced analytics', 'Streaming support', 'Custom system prompts'],
    cta: 'Go Pro',
    href: '/register?plan=pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    tier: 'ENTERPRISE',
    price: null,
    annualPrice: null,
    description: 'For large teams with custom needs',
    features: ['Unlimited tokens', 'Unlimited requests', 'All models including text/chat-bison', 'Dedicated support', 'Custom SLA', 'SSO/SAML', 'White-label option', 'Custom integrations', 'Dedicated infrastructure'],
    cta: 'Contact Sales',
    href: 'mailto:sales@spikeai.io',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-text-primary mb-4">
              Simple, transparent <span className="neon-text">pricing</span>
            </h1>
            <p className="text-text-secondary text-xl max-w-2xl mx-auto">
              Pay only for what you use. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-background-secondary rounded-2xl p-6 flex flex-col ${
                  plan.highlight
                    ? 'border-2 border-neon-blue shadow-neon-blue ring-1 ring-neon-blue/20'
                    : 'border border-border'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-neon rounded-full text-xs font-bold text-white whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-text-primary mb-1">{plan.name}</h3>
                  <p className="text-sm text-text-secondary mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    {plan.price !== null ? (
                      <>
                        <span className="text-4xl font-bold text-text-primary">${plan.price}</span>
                        <span className="text-text-secondary">/month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold neon-text">Custom</span>
                    )}
                  </div>
                  {plan.annualPrice !== null && plan.annualPrice > 0 && (
                    <p className="text-xs text-neon-blue mt-1">
                      ${plan.annualPrice}/mo billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className="text-neon-blue mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                    plan.highlight
                      ? 'bg-gradient-neon text-white shadow-neon-blue hover:shadow-neon-blue-lg'
                      : 'border border-border text-text-primary hover:border-neon-blue'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-text-secondary">
              All plans include:{' '}
              <span className="text-text-primary">HTTPS, JWT auth, rate limiting, 99.9% uptime SLA</span>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
