import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { createCipheriv, createDecipheriv, createHmac, randomBytes, scryptSync } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiKeysService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(ApiKeysService.name);
  private readonly encryptionKey: Buffer;
  private readonly hmacSecret: string;
  private readonly IV_LENGTH = 16;
  private readonly KEY_PREFIX = 'spike_';

  constructor(private readonly configService: ConfigService) {
    const rawKey = this.configService.get<string>('AES_ENCRYPTION_KEY', 'dev-key-32-chars-minimum-padding!');
    // Derive a 32-byte key using scrypt
    this.encryptionKey = scryptSync(rawKey, 'spike-ai-salt', 32);
    this.hmacSecret = this.configService.get<string>('HMAC_SECRET', rawKey);
  }

  async findByUserId(userId: string) {
    const keys = await this.prisma.aPIKey.findMany({
      where: { userId, status: { not: 'REVOKED' } },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        status: true,
        permissions: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return keys;
  }

  async create(userId: string, name: string, permissions: string[] = ['ai:generate', 'ai:chat']) {
    const rawKey = this.generateRawKey();
    const keyPrefix = rawKey.slice(0, 12);
    const keyHash = this.hashKey(rawKey);

    const apiKey = await this.prisma.aPIKey.create({
      data: {
        userId,
        name,
        keyPrefix,
        keyHash,
        status: 'ACTIVE',
        permissions,
        metadata: {},
      },
    });

    this.logger.log(`API key created for user ${userId}: ${apiKey.id}`);

    return {
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      rawKey, // Shown only once
      permissions: apiKey.permissions,
      createdAt: apiKey.createdAt,
      message: 'Store this key securely - it will not be shown again',
    };
  }

  async revoke(userId: string, keyId: string) {
    const key = await this.prisma.aPIKey.findUnique({ where: { id: keyId } });
    if (!key) throw new NotFoundException('API key not found');
    if (key.userId !== userId) throw new ForbiddenException('Access denied');

    await this.prisma.aPIKey.update({
      where: { id: keyId },
      data: { status: 'REVOKED' },
    });

    this.logger.log(`API key revoked: ${keyId}`);
  }

  async rotate(userId: string, keyId: string) {
    const oldKey = await this.prisma.aPIKey.findUnique({ where: { id: keyId } });
    if (!oldKey) throw new NotFoundException('API key not found');
    if (oldKey.userId !== userId) throw new ForbiddenException('Access denied');

    // Revoke old key
    await this.revoke(userId, keyId);

    // Create new key with same name and permissions
    return this.create(userId, `${oldKey.name} (rotated)`, oldKey.permissions as string[]);
  }

  async validateApiKey(rawKey: string) {
    const keyHash = this.hashKey(rawKey);

    const apiKey = await this.prisma.aPIKey.findFirst({
      where: { keyHash, status: 'ACTIVE' },
      include: { user: { select: { id: true, email: true, role: true, isActive: true } } },
    });

    if (!apiKey) throw new UnauthorizedException('Invalid API key');
    if (!apiKey.user.isActive) throw new UnauthorizedException('Account is disabled');

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      await this.prisma.aPIKey.update({ where: { id: apiKey.id }, data: { status: 'EXPIRED' } });
      throw new UnauthorizedException('API key has expired');
    }

    // Update last used
    await this.prisma.aPIKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return { apiKey, user: apiKey.user };
  }

  private generateRawKey(): string {
    const bytes = randomBytes(32);
    const hex = bytes.toString('hex');
    return `${this.KEY_PREFIX}${hex}`;
  }

  private hashKey(rawKey: string): string {
    return createHmac('sha256', this.hmacSecret).update(rawKey).digest('hex');
  }

  private encrypt(text: string): string {
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  private decrypt(text: string): string {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString();
  }
}
