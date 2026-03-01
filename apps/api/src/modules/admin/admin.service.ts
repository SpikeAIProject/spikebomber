import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AdminService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(AdminService.name);

  async getMetrics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalRevenue,
      mrrData,
      totalTokensThisMonth,
      planDistribution,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCEEDED' },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCEEDED', createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      this.prisma.usageLog.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { totalTokens: true },
      }),
      this.prisma.subscription.groupBy({
        by: ['planId'],
        where: { status: 'ACTIVE' },
        _count: { planId: true },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalRevenue: (totalRevenue._sum.amount ?? 0) / 100,
      mrr: (mrrData._sum.amount ?? 0) / 100,
      totalTokensThisMonth: totalTokensThisMonth._sum.totalTokens ?? 0,
      planDistribution,
    };
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          subscription: { include: { plan: { select: { name: true, tier: true } } } },
          _count: { select: { apiKeys: true, usageLogs: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
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

  async updateUser(id: string, data: { isActive?: boolean; role?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.role && { role: data.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN' }),
      },
      select: { id: true, email: true, name: true, role: true, isActive: true, updatedAt: true },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });
    this.logger.log(`Admin deleted user: ${id}`);
  }

  async getPlans() {
    return this.prisma.plan.findMany({
      include: {
        _count: { select: { subscriptions: true } },
      },
      orderBy: { monthlyPrice: 'asc' },
    });
  }

  async getUsageOverview(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalLogs, dailyData] = await Promise.all([
      this.prisma.usageLog.aggregate({
        where: { createdAt: { gte: since } },
        _sum: { totalTokens: true, cost: true },
        _count: { id: true },
        _avg: { latencyMs: true },
      }),
      this.prisma.$queryRaw<Array<{ date: string; tokens: bigint; requests: bigint }>>`
        SELECT 
          DATE(created_at) as date,
          SUM(total_tokens) as tokens,
          COUNT(*) as requests
        FROM usage_logs
        WHERE created_at >= ${since}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
    ]);

    return {
      summary: {
        totalTokens: totalLogs._sum.totalTokens ?? 0,
        totalCost: (totalLogs._sum.cost ?? 0) / 100,
        totalRequests: totalLogs._count.id,
        avgLatencyMs: Math.round(totalLogs._avg.latencyMs ?? 0),
      },
      daily: dailyData.map((d) => ({
        date: d.date,
        tokens: Number(d.tokens),
        requests: Number(d.requests),
      })),
    };
  }

  async getAuditLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        include: { user: { select: { email: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      data: logs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
