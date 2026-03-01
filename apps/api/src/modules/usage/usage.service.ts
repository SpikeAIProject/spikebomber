import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

interface LogUsageInput {
  userId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  success: boolean;
  apiKeyId?: string;
  errorCode?: string;
}

@Injectable()
export class UsageService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(UsageService.name);

  // Cost per 1M tokens (in USD cents)
  private readonly COST_PER_MILLION_TOKENS: Record<string, number> = {
    'gemini-1.5-pro': 350,
    'gemini-1.5-flash': 35,
    'gemini-pro-vision': 250,
    'text-bison': 125,
    'chat-bison': 125,
    default: 100,
  };

  async log(input: LogUsageInput) {
    const costPerMillion = this.COST_PER_MILLION_TOKENS[input.model] ?? this.COST_PER_MILLION_TOKENS.default;
    const cost = Math.round((input.totalTokens / 1_000_000) * costPerMillion);

    try {
      await this.prisma.usageLog.create({
        data: {
          userId: input.userId,
          apiKeyId: input.apiKeyId,
          model: input.model as any,
          promptTokens: input.promptTokens,
          completionTokens: input.completionTokens,
          totalTokens: input.totalTokens,
          latencyMs: input.latencyMs,
          cost,
          success: input.success,
          errorCode: input.errorCode,
          metadata: {},
        },
      });

      // Update subscription usage
      if (input.success) {
        await this.prisma.subscription.updateMany({
          where: { userId: input.userId },
          data: {
            tokensUsed: { increment: input.totalTokens },
            requestsUsed: { increment: 1 },
          },
        });
      }
    } catch (err) {
      this.logger.error(`Failed to log usage: ${(err as Error).message}`);
    }
  }

  async getSummary(userId: string) {
    const [logs, subscription] = await Promise.all([
      this.prisma.usageLog.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        select: {
          totalTokens: true,
          cost: true,
          latencyMs: true,
          success: true,
          model: true,
        },
      }),
      this.prisma.subscription.findUnique({
        where: { userId },
        include: { plan: true },
      }),
    ]);

    const totalTokens = logs.reduce((sum, l) => sum + l.totalTokens, 0);
    const totalCost = logs.reduce((sum, l) => sum + l.cost, 0);
    const successCount = logs.filter((l) => l.success).length;
    const avgLatency =
      logs.length > 0
        ? Math.round(logs.reduce((sum, l) => sum + l.latencyMs, 0) / logs.length)
        : 0;

    const modelCounts = logs.reduce<Record<string, { count: number; tokens: number }>>((acc, log) => {
      const key = log.model as string;
      if (!acc[key]) acc[key] = { count: 0, tokens: 0 };
      acc[key].count++;
      acc[key].tokens += log.totalTokens;
      return acc;
    }, {});

    return {
      totalTokens,
      totalRequests: logs.length,
      totalCost,
      successRate: logs.length > 0 ? (successCount / logs.length) * 100 : 100,
      avgLatencyMs: avgLatency,
      topModels: Object.entries(modelCounts)
        .map(([model, data]) => ({ model, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      subscription: subscription
        ? {
            plan: subscription.plan.name,
            tier: subscription.plan.tier,
            tokensUsed: subscription.tokensUsed,
            tokenLimit: subscription.plan.tokenLimit,
            requestsUsed: subscription.requestsUsed,
            requestLimit: subscription.plan.requestLimit,
          }
        : null,
    };
  }

  async getHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.usageLog.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          model: true,
          promptTokens: true,
          completionTokens: true,
          totalTokens: true,
          latencyMs: true,
          cost: true,
          success: true,
          errorCode: true,
          createdAt: true,
        },
      }),
      this.prisma.usageLog.count({ where: { userId } }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async getDailyUsage(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const logs = await this.prisma.usageLog.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { totalTokens: true, cost: true, success: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMap = new Map<string, { tokens: number; requests: number; cost: number }>();

    for (const log of logs) {
      const date = log.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(date) ?? { tokens: 0, requests: 0, cost: 0 };
      dailyMap.set(date, {
        tokens: existing.tokens + log.totalTokens,
        requests: existing.requests + 1,
        cost: existing.cost + log.cost,
      });
    }

    return Array.from(dailyMap.entries()).map(([date, data]) => ({ date, ...data }));
  }
}
