import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface LogUsageDto {
  tenantId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  endpoint?: string;
  userId?: string;
  apiKeyId?: string;
}

@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}

  async log(data: LogUsageDto) {
    return this.prisma.usageLog.create({ data });
  }

  async getSummary(tenantId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [requests, tokens] = await Promise.all([
      this.prisma.usageLog.count({
        where: { tenantId, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.usageLog.aggregate({
        where: { tenantId, createdAt: { gte: startOfMonth } },
        _sum: { totalTokens: true },
      }),
    ]);

    return {
      requestsUsed: requests,
      requestsLimit: 10000, // TODO: Get from subscription plan
      tokensUsed: tokens._sum.totalTokens ?? 0,
      tokensLimit: 1000000,
      resetAt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    };
  }

  async getHistory(tenantId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.usageLog.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.usageLog.count({ where: { tenantId } }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
