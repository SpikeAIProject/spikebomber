import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@spike-ai/ui';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Para explorar e prototipar',
    requests: '100/mês',
    tokens: '100K tokens',
    features: ['API REST básica', 'Gemini 1.5 Flash', '1 API Key', 'Suporte via email'],
    cta: 'Começar grátis',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Starter',
    price: 29,
    description: 'Para projetos em crescimento',
    requests: '5.000/mês',
    tokens: '5M tokens',
    features: ['Todos modelos Gemini', '5 API Keys', 'Rate limiting personalizado', 'Analytics básico', 'Webhooks'],
    cta: 'Começar agora',
    href: '/register?plan=starter',
    highlight: true,
    badge: 'Popular',
  },
  {
    name: 'Pro',
    price: 99,
    description: 'Para aplicações em produção',
    requests: '50.000/mês',
    tokens: '50M tokens',
    features: ['Tudo do Starter', 'Vertex AI', '20 API Keys', 'Multimodal (visão)', 'SLA 99.9%', 'Suporte prioritário'],
    cta: 'Assinar Pro',
    href: '/register?plan=pro',
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'Para grandes empresas',
    requests: 'Ilimitado',
    tokens: 'Ilimitado',
    features: ['Tudo do Pro', 'Modelos customizados', 'SSO/SAML', 'Contrato dedicado', 'SLA 99.99%', 'Suporte 24/7'],
    cta: 'Falar com vendas',
    href: 'mailto:sales@spikeai.com',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Zap className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">SPIKE AI</span>
          </Link>
          <Link href="/login"><Button variant="ghost" size="sm">Entrar</Button></Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Planos simples, poder real</h1>
          <p className="text-muted-foreground text-lg">Escolha o plano certo para o seu projeto</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlight ? 'border-primary shadow-lg shadow-primary/10' : ''}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.badge && <Badge variant="default">{plan.badge}</Badge>}
                </div>
                <div className="mt-2">
                  {plan.price !== null ? (
                    <span className="text-3xl font-bold">
                      R$ {plan.price}
                      <span className="text-base font-normal text-muted-foreground">/mês</span>
                    </span>
                  ) : (
                    <span className="text-2xl font-bold">Sob consulta</span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4 space-y-1">
                  <p>📊 {plan.requests} requisições</p>
                  <p>⚡ {plan.tokens}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
