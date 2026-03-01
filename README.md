# SPIKE AI - Enterprise SaaS Platform

> Enterprise-grade AI platform powered by **Google Vertex AI** and **Gemini**, built as a production-ready Turborepo monorepo.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SPIKE AI Platform                        │
├──────────────┬────────────────────┬─────────────────────────────┤
│  Web App     │   Admin Panel      │   NestJS REST API           │
│  (Next.js 14)│   (Next.js 14)     │   (NestJS 10)               │
│  :3000       │   :3001            │   :4000/v1                  │
├──────────────┴────────────────────┴─────────────────────────────┤
│                    Shared Packages                              │
│  @spike-ai/types │ @spike-ai/ui │ @spike-ai/config             │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL 16  │  Redis 7    │  Google Vertex AI / Gemini     │
│  (Prisma ORM)   │  (Bull MQ)  │  (AI Generation & Chat)        │
└─────────────────────────────────────────────────────────────────┘
```

## Features

- 🤖 **Google Vertex AI & Gemini** - Full integration with Gemini 1.5 Pro/Flash and Vision
- 🔐 **Enterprise Security** - JWT auth with refresh rotation, AES-256 API key encryption, rate limiting
- 💳 **Stripe Billing** - Subscription management, webhooks, customer portal
- 📊 **Usage Analytics** - Real-time token tracking, cost monitoring, model breakdowns
- 🔑 **API Key Management** - Create, rotate, revoke keys with granular permissions
- 🌊 **Streaming Support** - Server-sent events for real-time AI responses
- 👑 **Admin Panel** - Full user management, metrics, audit logs
- �� **Dark Neon UI** - Beautiful dark theme with neon blue (#00D4FF) and purple (#7B2FFF)

## Monorepo Structure

```
spikebomber/
├── apps/
│   ├── api/                    # NestJS REST API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # JWT auth + bcrypt
│   │   │   │   ├── users/      # User CRUD
│   │   │   │   ├── ai/         # Vertex AI + Gemini
│   │   │   │   ├── subscriptions/
│   │   │   │   ├── billing/    # Stripe integration
│   │   │   │   ├── usage/      # Usage tracking
│   │   │   │   ├── api-keys/   # API key management
│   │   │   │   ├── admin/      # Admin endpoints
│   │   │   │   └── analytics/
│   │   │   └── common/
│   │   │       ├── decorators/
│   │   │       ├── guards/
│   │   │       ├── interceptors/
│   │   │       ├── filters/
│   │   │       └── pipes/
│   │   └── prisma/
│   │       └── schema.prisma   # Full DB schema
│   ├── web/                    # User-facing Next.js 14 App
│   │   └── src/
│   │       ├── app/
│   │       │   ├── page.tsx    # Landing page
│   │       │   ├── pricing/
│   │       │   ├── dashboard/
│   │       │   ├── playground/ # AI chat interface
│   │       │   ├── settings/   # API key management
│   │       │   └── billing/
│   │       ├── components/
│   │       └── lib/
│   └── admin/                  # Admin Next.js 14 App
│       └── src/
│           ├── app/
│           │   ├── dashboard/
│           │   ├── users/
│           │   ├── plans/
│           │   ├── analytics/
│           │   └── audit-logs/
│           └── components/
└── packages/
    ├── types/                  # Shared TypeScript interfaces
    ├── config/                 # Shared configs (Tailwind, ESLint)
    └── ui/                     # Shared component library
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `REDIS_URL` | Redis connection string | ✅ |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | ✅ |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | ✅ |
| `GOOGLE_CLOUD_PROJECT` | GCP project ID for Vertex AI | ✅ |
| `VERTEX_AI_LOCATION` | Vertex AI region (e.g. us-central1) | ✅ |
| `GEMINI_API_KEY` | Google AI Studio API key | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js secret | ✅ |
| `NEXTAUTH_URL` | App URL for NextAuth | ✅ |
| `NEXT_PUBLIC_API_URL` | Public API URL | ✅ |
| `AES_ENCRYPTION_KEY` | 32-byte AES key for API key encryption | ✅ |
| `BCRYPT_ROUNDS` | Bcrypt hash rounds (default: 12) | ⚠️ |
| `RATE_LIMIT_TTL` | Rate limit window in seconds | ⚠️ |
| `RATE_LIMIT_MAX` | Max requests per window | ⚠️ |
| `ADMIN_EMAIL` | Initial admin email | ⚠️ |
| `ADMIN_PASSWORD` | Initial admin password | ⚠️ |

## Quick Start

### Prerequisites

- Node.js >= 18
- Docker + Docker Compose
- Google Cloud account with Vertex AI enabled

### 1. Clone and install dependencies

```bash
git clone https://github.com/your-org/spikebomber.git
cd spikebomber
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start infrastructure with Docker

```bash
npm run docker:up
# Starts PostgreSQL + Redis
```

### 4. Run database migrations

```bash
cd apps/api
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:seed       # Seed initial data (plans, admin user)
```

### 5. Start all apps in development

```bash
npm run dev
# Web:   http://localhost:3000
# Admin: http://localhost:3001
# API:   http://localhost:4000/v1
# Docs:  http://localhost:4000/v1/docs
```

## Docker Setup

Run everything with Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## Google Cloud / Vertex AI Setup

1. Create a GCP project and enable billing
2. Enable the **Vertex AI API** in GCP Console
3. Create a Service Account with `Vertex AI User` role
4. Download the JSON key file
5. Set environment variables:
   ```bash
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
   VERTEX_AI_LOCATION=us-central1
   ```

Alternatively, use the **Gemini API** (Google AI Studio):
```bash
GEMINI_API_KEY=your-gemini-api-key
```

## API Documentation

Swagger UI is available at: `http://localhost:4000/v1/docs`

### Key Endpoints

```
POST /v1/auth/register     - Register new user
POST /v1/auth/login        - Login
POST /v1/auth/refresh      - Refresh access token
GET  /v1/users/me          - Current user
POST /v1/ai/generate       - Generate text
POST /v1/ai/chat           - Multi-turn chat
GET  /v1/ai/models         - Available models
GET  /v1/usage             - Usage summary
GET  /v1/api-keys          - List API keys
POST /v1/api-keys          - Create API key
POST /v1/billing/subscribe - Subscribe to plan
POST /v1/billing/webhook   - Stripe webhook
```

## Pricing Model

| Plan | Price | Tokens/mo | Requests/mo |
|---|---|---|---|
| Free | $0 | 10K | 100 |
| Starter | $29/mo | 500K | 5K |
| Pro | $99/mo | 5M | 50K |
| Enterprise | Custom | Unlimited | Unlimited |

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Backend API | NestJS 10 + TypeScript |
| Frontend | Next.js 14 App Router |
| Database | PostgreSQL 16 + Prisma ORM |
| Cache/Queue | Redis 7 + Bull |
| AI Provider | Google Vertex AI + Gemini |
| Auth | JWT + NextAuth.js |
| Payments | Stripe |
| UI | TailwindCSS + Radix (custom) |
| State | Zustand + TanStack Query |
| Validation | Zod + class-validator |
| Testing | Jest + Testing Library |
| DevOps | Docker Compose |

## Roadmap

- [ ] WebSocket support for real-time usage updates
- [ ] Multi-tenancy / Organization support
- [ ] Custom model fine-tuning via Vertex AI
- [ ] OpenAI-compatible API layer
- [ ] Webhook delivery with retry logic
- [ ] Usage alerts and budget limits
- [ ] Team collaboration features
- [ ] Grafana/Prometheus observability
- [ ] Kubernetes deployment configs
- [ ] SAML/SSO enterprise auth

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ by the SPIKE AI team. Powered by [Google Vertex AI](https://cloud.google.com/vertex-ai) and [Gemini](https://ai.google.dev/).
