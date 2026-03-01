import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(tenantId: string) {
    const [totalRequests, totalTokens, recentLogs] = await Promise.all([
      this.prisma.usageLog.count({ where: { tenantId } }),
      this.prisma.usageLog.aggregate({
        where: { tenantId },
        _sum: { totalTokens: true },
      }),
      this.prisma.usageLog.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalRequests,
      totalTokens: totalTokens._sum.totalTokens ?? 0,
      recentActivity: recentLogs,
    };
  }
}
