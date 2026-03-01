import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly stripe: Stripe;
  private readonly prisma = new PrismaClient();

  constructor(
    private readonly configService: ConfigService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY', '');
    this.stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
  }

  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  async createCheckoutSession(userId: string, email: string, priceId: string) {
    const appUrl = this.configService.get<string>('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');

    // Get or create Stripe customer
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let customerId = user.stripeCustomerId ?? undefined;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email,
        metadata: { userId },
      });
      customerId = customer.id;
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing?canceled=true`,
      metadata: { userId },
      subscription_data: {
        metadata: { userId },
      },
    });

    return { url: session.url, sessionId: session.id };
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.subscriptionsService.findByUserId(userId);
    if (!subscription?.stripeSubscriptionId) {
      throw new BadRequestException('No active subscription found');
    }

    await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await this.prisma.subscription.update({
      where: { userId },
      data: { cancelAtPeriodEnd: true },
    });

    return { message: 'Subscription will be canceled at the end of the billing period' };
  }

  async createPortalSession(userId: string) {
    const appUrl = this.configService.get<string>('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user?.stripeCustomerId) {
      throw new BadRequestException('No billing account found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET', '');

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      const error = err as Error;
      this.logger.error(`Webhook signature verification failed: ${error.message}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Processing Stripe webhook: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        this.logger.debug(`Unhandled webhook event: ${event.type}`);
    }

    return { received: true };
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    const priceId = subscription.items.data[0]?.price.id;
    const plan = priceId
      ? await this.prisma.plan.findFirst({
          where: {
            OR: [
              { stripePriceMonthlyId: priceId },
              { stripePriceAnnualId: priceId },
            ],
          },
        })
      : null;

    if (!plan) {
      this.logger.warn(`No plan found for Stripe price: ${priceId}`);
      return;
    }

    const statusMap: Record<string, string> = {
      active: 'ACTIVE',
      canceled: 'CANCELED',
      past_due: 'PAST_DUE',
      trialing: 'TRIALING',
      paused: 'PAUSED',
      incomplete: 'INACTIVE',
    };

    await this.subscriptionsService.updateStripeSubscription(
      userId,
      subscription.id,
      plan.id,
      statusMap[subscription.status] ?? 'INACTIVE',
      new Date(subscription.current_period_start * 1000),
      new Date(subscription.current_period_end * 1000),
    );
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    await this.prisma.subscription.update({
      where: { userId },
      data: { status: 'CANCELED', canceledAt: new Date() },
    });
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;
    const user = await this.prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
    if (!user) return;

    await this.prisma.payment.create({
      data: {
        userId: user.id,
        stripePaymentIntentId: invoice.payment_intent as string ?? invoice.id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'SUCCEEDED',
        description: `Invoice payment - ${invoice.number}`,
        metadata: {},
      },
    });
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;
    const user = await this.prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
    if (!user) return;

    if (user.id) {
      await this.prisma.subscription.update({
        where: { userId: user.id },
        data: { status: 'PAST_DUE' },
      });
    }

    this.logger.warn(`Payment failed for user ${user.id}, invoice: ${invoice.id}`);
  }
}
