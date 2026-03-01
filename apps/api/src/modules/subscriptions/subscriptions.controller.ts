import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@ApiBearerAuth('JWT-Auth')
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current user subscription' })
  async getCurrent(@Request() req: { user: { sub: string } }) {
    return this.subscriptionsService.findByUserId(req.user.sub);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get all available plans' })
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }
}
