import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const features = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Sub-second response times with Gemini 1.5 Flash for high-throughput workloads.',
  },
  {
    icon: '🧠',
    title: 'Gemini 1.5 Pro',
    description: 'Access the most capable Gemini models with 1M token context window.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    description: 'SOC2 Type II, AES-256 encryption, JWT auth, and full audit logging.',
  },
  {
    icon: '📊',
    title: 'Usage Analytics',
    description: 'Real-time dashboards, cost tracking, and detailed usage breakdowns.',
  },
  {
    icon: '🔑',
    title: 'API Key Management',
    description: 'Rotate, revoke, and scope API keys with granular permission control.',
  },
  {
    icon: '🚀',
    title: 'Streaming Support',
    description: 'Server-sent events for real-time streaming responses in your applications.',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '1M', label: 'Token Context' },
  { value: '<200ms', label: 'Avg Latency' },
  { value: '10K+', label: 'API Calls/min' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Grid background */}
        <div className="absolute inset-0 hero-grid-bg opacity-40" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
            <span className="text-sm text-neon-blue font-medium">Powered by Google Vertex AI & Gemini</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="text-text-primary">The Enterprise </span>
            <span className="neon-text">AI Platform</span>
            <br />
            <span className="text-text-primary">Built for Scale</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-10 animate-slide-up">
            SPIKE AI gives your team instant access to Google&apos;s most advanced AI models through a
            secure, scalable API. From startups to Fortune 500 companies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 h-14 px-8 rounded-lg bg-gradient-neon text-white font-semibold text-lg shadow-neon-blue hover:shadow-neon-blue-lg transition-all duration-300 hover:scale-105"
            >
              Start Free Trial
              <span>→</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 h-14 px-8 rounded-lg border border-border bg-background-secondary text-text-primary font-semibold text-lg hover:border-neon-blue transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>

          {/* Code preview */}
          <div className="max-w-2xl mx-auto glass-card text-left animate-fade-in">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-text-muted font-mono">api-example.ts</span>
            </div>
            <pre className="font-mono text-sm overflow-x-auto">
              <code className="text-text-secondary">
                {`const response = await fetch(
  'https://api.spikeai.io/v1/ai/generate',
  {
    method: 'POST',
    headers: {
      'X-API-Key': '`}<span className="text-neon-blue">spike_your_api_key</span>{`',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: '`}<span className="text-neon-purple">Write a REST API in TypeScript</span>{`',
      model: '`}<span className="text-green-400">gemini-1.5-pro</span>{`',
      stream: true
    })
  }
);`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold neon-text mb-2">{stat.value}</div>
                <div className="text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Everything you need to build with AI
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              SPIKE AI provides all the infrastructure, tooling, and APIs to integrate advanced AI
              into your products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background-secondary border border-border rounded-xl p-6 hover:border-neon-blue/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-neon-blue group"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gradient-border rounded-2xl p-12 bg-background-secondary">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Ready to supercharge your AI?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Join thousands of developers building the next generation of AI applications with
              SPIKE AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-lg bg-gradient-neon text-white font-semibold shadow-neon-blue hover:shadow-neon-blue-lg transition-all duration-300"
              >
                Get Started Free
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center h-12 px-8 rounded-lg border border-border text-text-primary hover:border-neon-blue transition-colors"
              >
                See all plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
