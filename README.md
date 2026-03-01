# SPIKE AI — Plataforma Enterprise de IA

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img src="https://img.shields.io/badge/NestJS-10-red?logo=nestjs" />
  <img src="https://img.shields.io/badge/Prisma-5-blue?logo=prisma" />
  <img src="https://img.shields.io/badge/Turborepo-2-blueviolet?logo=turborepo" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/pnpm-9-orange?logo=pnpm" />
</div>

<br />

Monorepo completo para a plataforma SaaS enterprise **SPIKE AI** — uma plataforma de IA empresarial alimentada por Gemini e Vertex AI, com billing integrado, controle multi-tenant, observabilidade e API versionada.

---

## 📋 Índice

- [Descrição](#-descrição)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Como rodar localmente](#-como-rodar-localmente)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Migrations Prisma](#-migrations-prisma)
- [Configuração GCP / Vertex AI / Gemini](#-configuração-gcp--vertex-ai--gemini)
- [Deploy](#-deploy)
- [Estrutura do Monorepo](#-estrutura-do-monorepo)
- [API Endpoints](#-api-endpoints)
- [Roadmap](#-roadmap)
- [Monetização](#-monetização)

---

## 📌 Descrição

SPIKE AI é uma plataforma SaaS de IA enterprise que permite a empresas e desenvolvedores integrar modelos de linguagem de última geração (Gemini 1.5 Pro, Flash, Vertex AI) via API REST simples. A plataforma oferece:

- **Multi-tenancy**: cada cliente tem seu workspace isolado
- **API Keys**: criação, rotação e revogação
- **Rate Limiting**: por tenant e por API key, usando Redis
- **Billing**: planos e assinaturas via Stripe
- **Observabilidade**: logs estruturados, audit trail, analytics
- **Admin Panel**: gestão completa da plataforma

---

## 🏗️ Arquitetura

```
spikebomber/
├── apps/
│   ├── web/          # Frontend público (Next.js 14, porta 3000)
│   ├── admin/        # Painel admin (Next.js 14, porta 3002)
│   └── api/          # Backend REST (NestJS 10, porta 3001)
├── packages/
│   ├── ui/           # Componentes compartilhados (shadcn/ui + Tailwind)
│   ├── types/        # Tipos TypeScript compartilhados (DTOs)
│   └── config/       # Configurações compartilhadas (ESLint, TSConfig, Prettier)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

### Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend | Next.js 14 (App Router), TailwindCSS, shadcn/ui |
| State | Zustand + React Query (TanStack) |
| Backend | NestJS 10 (TypeScript) |
| ORM | Prisma 5 + PostgreSQL 16 |
| Cache | Redis 7 (ioredis) |
| Auth | JWT (access + refresh) + bcrypt |
| AI | Gemini API + Vertex AI (Google Cloud) |
| Billing | Stripe (scaffold) |
| Observabilidade | Pino, OpenTelemetry (scaffold) |

---

## ⚙️ Pré-requisitos

- **Node.js** >= 20
- **pnpm** >= 9 (`npm install -g pnpm@9`)
- **Docker** + **Docker Compose** (para PostgreSQL e Redis local)
- **Git**

---

## 🚀 Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/SpikeAIProject/spikebomber.git
cd spikebomber
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 3. Suba os serviços de infraestrutura (Postgres + Redis)

```bash
docker compose up -d
```

Para subir também o pgAdmin (interface visual para o banco):
```bash
docker compose --profile tools up -d
# pgAdmin disponível em http://localhost:5050
# Email: admin@spikeai.com | Senha: admin123
```

### 4. Instale as dependências

```bash
pnpm install
```

### 5. Execute as migrations do Prisma

```bash
pnpm db:migrate
# Gera o client Prisma automaticamente
```

### 6. Rode em modo desenvolvimento

```bash
# Roda todos os apps em paralelo
pnpm dev

# Ou individualmente:
pnpm --filter api dev        # API em http://localhost:3001
pnpm --filter web dev        # Frontend em http://localhost:3000
pnpm --filter admin dev      # Admin em http://localhost:3002
```

### 7. Acesse os serviços

| Serviço | URL |
|---------|-----|
| Frontend (web) | http://localhost:3000 |
| Admin Panel | http://localhost:3002 |
| API REST | http://localhost:3001 |
| Swagger Docs | http://localhost:3001/docs |
| pgAdmin | http://localhost:5050 (com profile `tools`) |

---

## 🔐 Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha as variáveis:

```env
# Banco de dados PostgreSQL
DATABASE_URL="postgresql://spike:spike123@localhost:5432/spikeai?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT (altere em produção!)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# URLs dos apps
PORT=3001
API_URL=http://localhost:3001
WEB_URL=http://localhost:3000
ADMIN_URL=http://localhost:3002

# Google AI (Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Google Cloud (Vertex AI)
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Stripe (billing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🗄️ Migrations Prisma

```bash
# Criar e aplicar nova migration
pnpm db:migrate
# Informe o nome da migration quando solicitado, ex: "init" ou "add-webhooks"

# Gerar o Prisma Client (sem migration)
pnpm db:generate

# Abrir Prisma Studio (GUI para o banco)
pnpm db:studio
```

**Schema localizado em:** `apps/api/prisma/schema.prisma`

Tabelas criadas:
- `tenants` — workspaces dos clientes
- `users` — usuários com hash de senha
- `plans` — planos de assinatura (Free, Starter, Pro, Enterprise)
- `subscriptions` — assinaturas ativas por tenant
- `api_keys` — chaves de API com hash bcrypt
- `usage_logs` — log de cada chamada à IA
- `prompts` — histórico de prompts salvos
- `payments` / `invoices` — billing
- `audit_logs` / `admin_actions` — auditoria
- `webhooks` — webhooks configurados por tenant

---

## 🌐 Configuração GCP / Vertex AI / Gemini

### Opção A: Gemini API (mais simples)

1. Acesse [Google AI Studio](https://aistudio.google.com)
2. Gere uma API Key
3. Adicione ao `.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

### Opção B: Vertex AI (para produção enterprise)

1. **Crie um projeto no Google Cloud Platform**
   ```bash
   gcloud projects create spike-ai-prod
   gcloud config set project spike-ai-prod
   ```

2. **Habilite as APIs necessárias**
   ```bash
   gcloud services enable aiplatform.googleapis.com
   gcloud services enable generativelanguage.googleapis.com
   ```

3. **Crie uma Service Account**
   ```bash
   gcloud iam service-accounts create spike-ai-sa \
     --display-name="SPIKE AI Service Account"
   
   gcloud projects add-iam-policy-binding spike-ai-prod \
     --member="serviceAccount:spike-ai-sa@spike-ai-prod.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   
   gcloud iam service-accounts keys create ./service-account.json \
     --iam-account=spike-ai-sa@spike-ai-prod.iam.gserviceaccount.com
   ```

4. **Configure o `.env`**
   ```env
   GOOGLE_CLOUD_PROJECT=spike-ai-prod
   GOOGLE_CLOUD_LOCATION=us-central1
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
   ```

5. **Implemente o VertexProvider** em `apps/api/src/modules/ai/providers/vertex.provider.ts`
   - Instale: `pnpm --filter api add @google-cloud/aiplatform`
   - Descomente e adapte o código scaffold existente

---

## 🚀 Deploy

### ⚠️ Importante: Next.js e NestJS requerem Node.js runtime

> **Atenção para hospedagem em VPS:** Next.js (SSR/App Router) e NestJS são aplicações Node.js que requerem um servidor Node em execução contínua. **Não é possível fazer deploy apenas como arquivos estáticos** em hospedagem HTML tradicional.
>
> O `next export` (geração estática) tem limitações severas: não suporta Server Components dinâmicos, API Routes, middleware, autenticação via servidor ou qualquer feature que dependa de servidor Node. Para esta plataforma, o export estático **não é adequado**.

### Opções de Deploy

#### 1. VPS (Recomendado para começar)

**Requisitos:** Ubuntu 22.04+, Node 20+, Docker

```bash
# Na VPS: instale Docker e clone o repo
git clone https://github.com/SpikeAIProject/spikebomber.git
cd spikebomber

# Configure variáveis de produção
cp .env.example .env
nano .env  # Edite com valores de produção

# Build e run com Docker Compose
docker compose up -d  # Postgres + Redis

# Build e start das apps
pnpm install
pnpm build
pnpm --filter api start &   # Porta 3001
pnpm --filter web start &   # Porta 3000
pnpm --filter admin start & # Porta 3002
```

**Reverse Proxy com Nginx:**
```nginx
# /etc/nginx/sites-available/spikeai
server {
    listen 80;
    server_name api.seudominio.com;
    location / { proxy_pass http://localhost:3001; }
}
server {
    listen 80;
    server_name app.seudominio.com;
    location / { proxy_pass http://localhost:3000; }
}
server {
    listen 80;
    server_name admin.seudominio.com;
    location / { proxy_pass http://localhost:3002; }
}
```

Use **Certbot** para SSL:
```bash
certbot --nginx -d api.seudominio.com -d app.seudominio.com
```

**Gerenciamento de processos com PM2:**
```bash
npm install -g pm2
pm2 start "node apps/api/dist/main" --name api
pm2 start "node apps/web/.next/standalone/server.js" --name web
pm2 startup && pm2 save
```

#### 2. Google Cloud Run

```bash
# Build e push das imagens
docker build -f apps/api/Dockerfile -t gcr.io/PROJECT_ID/spike-api .
docker build -f apps/web/Dockerfile -t gcr.io/PROJECT_ID/spike-web .
docker push gcr.io/PROJECT_ID/spike-api
docker push gcr.io/PROJECT_ID/spike-web

# Deploy
gcloud run deploy spike-api \
  --image gcr.io/PROJECT_ID/spike-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=...,JWT_SECRET=...

gcloud run deploy spike-web \
  --image gcr.io/PROJECT_ID/spike-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Banco de dados:** Use Cloud SQL (PostgreSQL) com Cloud SQL Proxy.
**Redis:** Use Memorystore for Redis.

#### 3. Google Kubernetes Engine (GKE)

Para escala enterprise, use GKE com:
- HPA (Horizontal Pod Autoscaler)
- Cloud SQL Proxy sidecar
- Secret Manager para variáveis sensíveis
- Cloud Load Balancing

```bash
# Crie o cluster
gcloud container clusters create spike-ai-cluster \
  --num-nodes=3 --region=us-central1

# Aplique os manifestos Kubernetes (não incluídos, mas scaffoldáveis)
kubectl apply -f k8s/
```

#### 4. Vercel + Railway (Alternativa rápida)

- **apps/web e apps/admin**: Deploy no [Vercel](https://vercel.com) (suporte nativo a Next.js)
- **apps/api**: Deploy no [Railway](https://railway.app) ou [Render](https://render.com)
- **PostgreSQL**: Railway, Supabase ou Neon
- **Redis**: Upstash Redis

---

## 📁 Estrutura do Monorepo

```
apps/api/src/
├── main.ts                    # Bootstrap (Swagger, Helmet, CORS, Pipes)
├── app.module.ts              # Root module
├── prisma/                    # PrismaService (global)
├── redis/                     # RedisService (global)
└── modules/
    ├── auth/                  # JWT auth, login, register, refresh, guards, decorators
    ├── users/                 # Perfil de usuário
    ├── tenants/               # Multi-tenancy
    ├── ai/                    # Gemini + Vertex providers, endpoints /v1
    │   ├── providers/
    │   │   ├── gemini.provider.ts
    │   │   └── vertex.provider.ts
    │   └── dto/
    ├── api-keys/              # CRUD de API Keys com bcrypt
    ├── usage/                 # Logs de uso e métricas
    ├── subscriptions/         # Planos e assinaturas
    ├── billing/               # Stripe checkout e portal
    ├── analytics/             # Métricas agregadas
    ├── webhooks/              # Configuração de webhooks
    └── admin/                 # Endpoints admin (RBAC)

apps/web/src/
├── app/                       # App Router
│   ├── page.tsx               # Landing page "Dark Tech"
│   ├── pricing/               # Página de preços
│   ├── login/ + register/     # Auth
│   ├── dashboard/             # Dashboard com métricas
│   ├── playground/            # Interface para testar a API
│   ├── settings/              # Configurações do usuário
│   └── billing/               # Assinatura e faturas
├── store/                     # Zustand (auth, preferences)
├── lib/                       # API client (fetch wrapper)
└── components/                # Providers (React Query, Theme)

apps/admin/src/app/admin/
├── page.tsx                   # Dashboard admin com métricas
├── login/                     # Login com validação de role ADMIN
├── users/                     # CRUD de usuários
├── plans/                     # Gestão de planos
├── subscriptions/             # Gestão de assinaturas
├── audit-logs/                # Audit logs
└── usage/                     # Analytics de uso

packages/
├── ui/                        # Button, Card, Input, Badge + Tailwind config
├── types/                     # DTOs: Auth, User, AI, ApiKey, Subscription
└── config/                    # tsconfig (base, nextjs, nestjs), eslint, prettier
```

---

## 📡 API Endpoints

### Health
```
GET /health   → status da API
```

### Auth
```
POST /auth/register    → registrar usuário + criar tenant
POST /auth/login       → login email + senha
POST /auth/refresh     → refresh access token
POST /auth/logout      → invalidar refresh token
```

### Users
```
GET   /users/me        → perfil do usuário atual (JWT)
PATCH /users/me        → atualizar perfil
```

### AI (Autenticação por API Key: x-api-key header)
```
POST /v1/generate      → gerar texto com modelo selecionado
POST /v1/chat          → conversa multi-turno
GET  /v1/usage         → métricas de uso do mês atual
GET  /v1/models        → listar modelos disponíveis
```

### API Keys
```
GET    /api-keys       → listar chaves
POST   /api-keys       → criar nova chave
DELETE /api-keys/:id   → revogar chave
POST   /api-keys/:id/rotate → rotacionar chave
```

### Billing
```
GET  /billing/invoices    → listar faturas
POST /billing/checkout    → criar sessão de checkout Stripe
POST /billing/portal      → abrir portal de gerenciamento Stripe
```

### Admin (Requer role ADMIN ou SUPER_ADMIN)
```
GET /admin/stats          → métricas gerais da plataforma
GET /admin/users          → listar todos os usuários
GET /admin/tenants        → listar todos os tenants
GET /admin/audit-logs     → logs de auditoria
```

### Documentação completa
Acesse: **http://localhost:3001/docs** (Swagger UI)

---

## 🗺️ Roadmap

### v0.1 — Bootstrap (atual)
- [x] Monorepo Turborepo com pnpm
- [x] Schema Prisma completo (11 tabelas)
- [x] Auth JWT com access + refresh token
- [x] Endpoints /v1 (generate, chat, usage, models)
- [x] Multi-tenancy básico
- [x] API Keys com bcrypt
- [x] Frontend Dark Tech completo
- [x] Admin panel básico
- [x] Docker Compose para dev local

### v0.2 — Integração AI
- [ ] Implementar Gemini API (remover mocks)
- [ ] Implementar Vertex AI provider
- [ ] Streaming de respostas (SSE)
- [ ] Upload multimodal (imagens)
- [ ] Context window management

### v0.3 — Billing & Subscription
- [ ] Integração completa com Stripe
- [ ] Webhooks Stripe (checkout.completed, etc.)
- [ ] Planos com limites reais via Redis
- [ ] Portal de auto-serviço de assinatura

### v0.4 — Observabilidade & Segurança
- [ ] OpenTelemetry com exportador para GCP/Datadog
- [ ] Rate limiting por API key via Redis
- [ ] Email de verificação e reset de senha
- [ ] 2FA (TOTP)
- [ ] Alertas de uso (webhook quando próximo do limite)

### v0.5 — Enterprise
- [ ] SSO/SAML
- [ ] Roles customizados por tenant
- [ ] Custom fine-tuning models via Vertex AI
- [ ] White-labeling
- [ ] SLA monitoring

---

## 💰 Monetização

### Modelo de Preços

| Plano | Preço | Requests | Tokens |
|-------|-------|----------|--------|
| **Free** | Grátis | 100/mês | 100K |
| **Starter** | R$ 29/mês | 5.000/mês | 5M |
| **Pro** | R$ 99/mês | 50.000/mês | 50M |
| **Enterprise** | Sob consulta | Ilimitado | Ilimitado |

### Estratégias

1. **Freemium**: Plano gratuito com limites para aquisição de usuários
2. **Usage-based pricing**: Cobranças adicionais por requests/tokens acima do plano
3. **Add-ons enterprise**: SSO, suporte dedicado, SLA, modelos customizados
4. **Marketplace de templates**: Prompts e integrações pré-configuradas
5. **API reseller**: Permitir que clientes revendam acesso à plataforma

### Métricas para acompanhar
- MRR (Monthly Recurring Revenue)
- Churn rate por plano
- Custo por request (COGS)
- Token utilization por tenant
- Conversão Free → Pago

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'feat: adicionar minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

MIT © 2024 SPIKE AI Project

---

<div align="center">
  <strong>Feito com ❤️ pela equipe SPIKE AI</strong>
</div>