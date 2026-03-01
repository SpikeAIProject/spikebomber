import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async list(tenantId: string) {
    return this.prisma.apiKey.findMany({
      where: { tenantId, isActive: true },
      select: {
        id: true,
        name: true,
        prefix: true,
        isActive: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, userId: string, dto: CreateApiKeyDto) {
    const rawKey = `sk-${uuidv4().replace(/-/g, '')}`;
    const prefix = rawKey.substring(0, 10);
    const keyHash = await bcrypt.hash(rawKey, 12);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name: dto.name,
        keyHash,
        prefix,
        tenantId,
        userId,
        expiresAt: dto.expiresAt,
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      prefix: apiKey.prefix,
      key: rawKey, // Only shown once
      createdAt: apiKey.createdAt,
    };
  }

  async revoke(id: string, tenantId: string) {
    const key = await this.prisma.apiKey.findFirst({ where: { id, tenantId } });
    if (!key) throw new NotFoundException('API key not found');

    await this.prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'API key revoked' };
  }

  async rotate(id: string, tenantId: string, userId: string) {
    const key = await this.prisma.apiKey.findFirst({ where: { id, tenantId } });
    if (!key) throw new NotFoundException('API key not found');

    // Revoke old key
    await this.prisma.apiKey.update({ where: { id }, data: { isActive: false } });

    // Create new key
    return this.create(tenantId, userId, { name: `${key.name} (rotated)` });
  }

  async validateApiKey(rawKey: string) {
    const prefix = rawKey.substring(0, 10);
    const candidates = await this.prisma.apiKey.findMany({
      where: { prefix, isActive: true },
    });

    for (const candidate of candidates) {
      const isValid = await bcrypt.compare(rawKey, candidate.keyHash);
      if (isValid) {
        // Check expiry
        if (candidate.expiresAt && candidate.expiresAt < new Date()) {
          return null;
        }
        // Update last used
        await this.prisma.apiKey.update({
          where: { id: candidate.id },
          data: { lastUsedAt: new Date() },
        });
        return candidate;
      }
    }
    return null;
  }
}
