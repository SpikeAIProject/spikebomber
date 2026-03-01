import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async list(tenantId: string) {
    return this.prisma.webhook.findMany({
      where: { tenantId },
      select: { id: true, url: true, events: true, isActive: true, createdAt: true },
    });
  }

  async create(tenantId: string, dto: CreateWebhookDto) {
    return this.prisma.webhook.create({
      data: {
        ...dto,
        tenantId,
        secret: uuidv4(),
      },
    });
  }

  async delete(id: string, tenantId: string) {
    await this.prisma.webhook.deleteMany({ where: { id, tenantId } });
    return { message: 'Webhook deleted' };
  }
}
