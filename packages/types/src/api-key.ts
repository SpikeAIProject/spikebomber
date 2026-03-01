export interface ApiKeyDto {
  id: string;
  name: string;
  prefix: string;
  tenantId: string;
  createdAt: Date;
  lastUsedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface CreateApiKeyDto {
  name: string;
  expiresAt?: Date;
}

export interface ApiKeyCreatedDto extends ApiKeyDto {
  key: string; // Only shown once at creation
}
