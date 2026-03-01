import Link from 'next/link';
import { Button } from '@spike-ai/ui';
import { ArrowRight, Zap, Shield, BarChart3, Code2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Zap className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              SPIKE AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
          <Zap className="h-3.5 w-3.5" />
          Powered by Gemini 1.5 Pro
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
            IA Enterprise
          </span>
          <br />
          para o seu negócio
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Plataforma SaaS de IA com Gemini e Vertex AI. API robusta, controle total de uso,
          billing integrado e observabilidade de nível enterprise.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="xl" variant="glow">
              Começar gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/playground">
            <Button size="xl" variant="outline">
              Ver playground
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tudo que você precisa para escalar com IA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: 'API de Alta Performance', desc: 'Endpoints REST com suporte a streaming, retry automático e timeouts configuráveis.' },
            { icon: Shield, title: 'Segurança Enterprise', desc: 'JWT + API Keys, rate limiting por tenant, audit logs e RBAC completo.' },
            { icon: BarChart3, title: 'Analytics & Billing', desc: 'Controle de tokens e requests em tempo real, faturas automáticas via Stripe.' },
            { icon: Code2, title: 'Multi-modelo', desc: 'Gemini 1.5 Pro, Flash, e integração com Vertex AI para modelos customizados.' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <feature.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8 text-center text-sm text-muted-foreground">
        <p>© 2024 SPIKE AI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
