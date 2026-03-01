import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(SubscriptionsService.name);

  async findByUserId(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });
    return subscription;
  }

  async getPlans() {
    return this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { monthlyPrice: 'asc' },
    });
  }

  async createFreeSubscription(userId: string) {
    const freePlan = await this.prisma.plan.findFirst({
      where: { tier: 'FREE' },
    });

    if (!freePlan) {
      this.logger.warn('No FREE plan found - cannot create free subscription');
      return null;
    }

    return this.prisma.subscription.create({
      data: {
        userId,
        planId: freePlan.id,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        tokensUsed: 0,
        requestsUsed: 0,
        cancelAtPeriodEnd: false,
      },
      include: { plan: true },
    });
  }

  async updateUsage(userId: string, tokens: number, requests = 1) {
    await this.prisma.subscription.update({
      where: { userId },
      data: {
        tokensUsed: { increment: tokens },
        requestsUsed: { increment: requests },
      },
    });
  }

  async updateStripeSubscription(
    userId: string,
    stripeSubscriptionId: string,
    planId: string,
    status: string,
    periodStart: Date,
    periodEnd: Date,
  ) {
    return this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        planId,
        stripeSubscriptionId,
        status: status as 'ACTIVE',
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        tokensUsed: 0,
        requestsUsed: 0,
      },
      update: {
        planId,
        stripeSubscriptionId,
        status: status as 'ACTIVE',
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      },
    });
  }
}
