import type { SubscriptionStatus, PlanTier } from './common';

export interface PlanDto {
  id: string;
  name: string;
  tier: PlanTier;
  monthlyPrice: number;
  yearlyPrice: number;
  requestsPerMonth: number;
  tokensPerMonth: number;
  features: string[];
}

export interface SubscriptionDto {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  plan: PlanDto;
}
