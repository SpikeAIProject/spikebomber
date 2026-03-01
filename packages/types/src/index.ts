// =============================================================================
// SPIKE AI - Shared TypeScript Types
// =============================================================================

// --------------------------------
// Enums
// --------------------------------
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  API_CONSUMER = 'API_CONSUMER',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  TRIALING = 'TRIALING',
  PAUSED = 'PAUSED',
}

export enum PlanTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELED = 'CANCELED',
}

export enum APIKeyStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
}

export enum AIModel {
  GEMINI_PRO = 'gemini-1.5-pro',
  GEMINI_FLASH = 'gemini-1.5-flash',
  GEMINI_PRO_VISION = 'gemini-pro-vision',
  TEXT_BISON = 'text-bison',
  CHAT_BISON = 'chat-bison',
}

export enum WebhookEvent {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  SUBSCRIPTION_CREATED = 'subscription.created',
  SUBSCRIPTION_UPDATED = 'subscription.updated',
  SUBSCRIPTION_CANCELED = 'subscription.canceled',
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  USAGE_LIMIT_REACHED = 'usage.limit_reached',
  API_KEY_CREATED = 'api_key.created',
  API_KEY_REVOKED = 'api_key.revoked',
}

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  API_KEY_CREATE = 'API_KEY_CREATE',
  API_KEY_REVOKE = 'API_KEY_REVOKE',
  SUBSCRIPTION_CREATE = 'SUBSCRIPTION_CREATE',
  SUBSCRIPTION_CANCEL = 'SUBSCRIPTION_CANCEL',
  PLAN_CHANGE = 'PLAN_CHANGE',
  ADMIN_USER_UPDATE = 'ADMIN_USER_UPDATE',
  ADMIN_USER_DELETE = 'ADMIN_USER_DELETE',
  AI_GENERATE = 'AI_GENERATE',
}

// --------------------------------
// Core Interfaces
// --------------------------------

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  primaryColor?: string;
  settings: Record<string, unknown>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  tenantId?: string;
  tenant?: Tenant;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithSubscription extends User {
  subscription?: Subscription;
  apiKeys?: APIKey[];
}

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  tokenLimit: number;
  requestLimit: number;
  modelAccess: AIModel[];
  features: string[];
  stripePriceMonthlyId?: string;
  stripePriceAnnualId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  user?: User;
  planId: string;
  plan?: Plan;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  tokensUsed: number;
  requestsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface APIKey {
  id: string;
  userId: string;
  user?: User;
  name: string;
  keyPrefix: string;
  keyHash: string;
  status: APIKeyStatus;
  lastUsedAt?: Date;
  expiresAt?: Date;
  permissions: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface APIKeyWithRaw extends APIKey {
  rawKey?: string;
}

export interface UsageLog {
  id: string;
  userId: string;
  user?: User;
  apiKeyId?: string;
  model: AIModel;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  cost: number;
  success: boolean;
  errorCode?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface Prompt {
  id: string;
  userId: string;
  user?: User;
  title?: string;
  content: string;
  response: string;
  model: AIModel;
  tokens: number;
  isFavorite: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  user?: User;
  subscriptionId?: string;
  stripePaymentIntentId: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  user?: User;
  paymentId?: string;
  stripeInvoiceId: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  pdfUrl?: string;
  dueDate?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  user?: User;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, unknown>;
  createdAt: Date;
}

export interface Webhook {
  id: string;
  userId: string;
  user?: User;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  lastDeliveredAt?: Date;
  failureCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------------------
// API Response Types
// --------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// --------------------------------
// Auth Types
// --------------------------------

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  iat?: number;
  exp?: number;
}

// --------------------------------
// AI Types
// --------------------------------

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface GenerateRequest {
  prompt: string;
  model?: AIModel;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
  systemPrompt?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: AIModel;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  systemPrompt?: string;
}

export interface GenerateResponse {
  text: string;
  model: AIModel;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  finishReason: string;
}

// --------------------------------
// Analytics Types
// --------------------------------

export interface UsageSummary {
  totalTokens: number;
  totalRequests: number;
  totalCost: number;
  successRate: number;
  avgLatencyMs: number;
  topModels: { model: AIModel; count: number; tokens: number }[];
}

export interface DailyUsage {
  date: string;
  tokens: number;
  requests: number;
  cost: number;
}

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  mrr: number;
  totalTokensUsed: number;
  activePlans: Record<PlanTier, number>;
}
