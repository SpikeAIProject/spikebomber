import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(AnalyticsService.name);

  async getOverview(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const previousPeriodStart = new Date(since);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days);

    const [current, previous] = await Promise.all([
      this.prisma.usageLog.aggregate({
        where: { userId, createdAt: { gte: since } },
        _sum: { totalTokens: true, cost: true },
        _count: { id: true },
        _avg: { latencyMs: true },
      }),
      this.prisma.usageLog.aggregate({
        where: { userId, createdAt: { gte: previousPeriodStart, lt: since } },
        _sum: { totalTokens: true },
        _count: { id: true },
      }),
    ]);

    const tokenChange =
      (previous._sum.totalTokens ?? 0) > 0
        ? (((current._sum.totalTokens ?? 0) - (previous._sum.totalTokens ?? 0)) /
            (previous._sum.totalTokens ?? 1)) *
          100
        : 0;

    const requestChange =
      previous._count.id > 0
        ? ((current._count.id - previous._count.id) / previous._count.id) * 100
        : 0;

    return {
      period: `${days} days`,
      totalTokens: current._sum.totalTokens ?? 0,
      totalRequests: current._count.id,
      totalCost: (current._sum.cost ?? 0) / 100,
      avgLatencyMs: Math.round(current._avg.latencyMs ?? 0),
      tokenChange: Math.round(tokenChange),
      requestChange: Math.round(requestChange),
    };
  }

  async getModelBreakdown(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const breakdown = await this.prisma.usageLog.groupBy({
      by: ['model'],
      where: { userId, createdAt: { gte: since } },
      _sum: { totalTokens: true, cost: true },
      _count: { id: true },
      _avg: { latencyMs: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return breakdown.map((item) => ({
      model: item.model,
      totalTokens: item._sum.totalTokens ?? 0,
      totalCost: (item._sum.cost ?? 0) / 100,
      requests: item._count.id,
      avgLatencyMs: Math.round(item._avg.latencyMs ?? 0),
    }));
  }

  async getTopPrompts(userId: string) {
    return this.prisma.prompt.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        content: true,
        model: true,
        tokens: true,
        isFavorite: true,
        tags: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
}
