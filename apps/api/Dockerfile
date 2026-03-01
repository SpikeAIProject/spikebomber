# ---- Base ----
FROM node:20-alpine AS base
RUN npm install -g pnpm@9
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
RUN pnpm install --frozen-lockfile

# ---- Builder ----
FROM deps AS builder
COPY . .
RUN pnpm --filter api run build

# ---- Runner (Production) ----
FROM node:20-alpine AS runner
RUN npm install -g pnpm@9
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["node", "dist/main"]
