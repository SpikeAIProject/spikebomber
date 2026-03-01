import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsageService } from './usage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Usage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get()
  getSummary(@CurrentUser() user: { tenantId: string }) {
    return this.usageService.getSummary(user.tenantId);
  }

  @Get('history')
  getHistory(
    @CurrentUser() user: { tenantId: string },
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.usageService.getHistory(user.tenantId, parseInt(page), parseInt(limit));
  }
}
