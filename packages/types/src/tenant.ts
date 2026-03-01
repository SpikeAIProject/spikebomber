export interface TenantDto {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  planId: string;
}

export interface CreateTenantDto {
  name: string;
  slug: string;
}
