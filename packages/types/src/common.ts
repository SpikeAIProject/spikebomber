export interface PaginationDto {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export type UserRole = 'admin' | 'user' | 'super_admin';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive';
export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise';
