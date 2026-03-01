import type { UserRole } from './common';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  avatarUrl?: string;
}

export interface UpdateUserDto {
  name?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
