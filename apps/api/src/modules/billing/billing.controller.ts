import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoices')
  getInvoices(@CurrentUser() user: { tenantId: string }) {
    return this.billingService.getInvoices(user.tenantId);
  }

  @Post('checkout')
  createCheckout(
    @CurrentUser() user: { tenantId: string },
    @Body() body: { planId: string; interval: 'month' | 'year' },
  ) {
    return this.billingService.createCheckout(user.tenantId, body.planId, body.interval);
  }

  @Post('portal')
  createPortal(@CurrentUser() user: { tenantId: string }) {
    return this.billingService.createPortal(user.tenantId);
  }
}
