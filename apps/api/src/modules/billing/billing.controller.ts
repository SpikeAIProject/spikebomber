import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

import { JwtAuthGuard } from '../auth/auth.guard';
import { BillingService } from './billing.service';

class SubscribeDto {
  @ApiProperty({ example: 'price_starter_monthly' })
  @IsString()
  priceId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  annual?: boolean;
}

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all billing plans' })
  getPlans() {
    return this.billingService.getPlans();
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'Create a new subscription checkout session' })
  @ApiResponse({ status: 200, description: 'Stripe checkout session URL' })
  async subscribe(
    @Body() dto: SubscribeDto,
    @Request() req: { user: { sub: string; email: string } },
  ) {
    return this.billingService.createCheckoutSession(req.user.sub, req.user.email, dto.priceId);
  }

  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'Cancel current subscription' })
  async cancel(@Request() req: { user: { sub: string } }) {
    return this.billingService.cancelSubscription(req.user.sub);
  }

  @Get('portal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'Get Stripe customer portal URL' })
  async portal(@Request() req: { user: { sub: string } }) {
    return this.billingService.createPortalSession(req.user.sub);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async webhook(
    @Req() req: RawBodyRequest<ExpressRequest>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    return this.billingService.handleWebhook(rawBody ?? Buffer.alloc(0), signature);
  }
}
