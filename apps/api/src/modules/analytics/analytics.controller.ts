import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth('JWT-Auth')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get analytics overview' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getOverview(
    @Request() req: { user: { sub: string } },
    @Query('days') days = 30,
  ) {
    return this.analyticsService.getOverview(req.user.sub, Number(days));
  }

  @Get('models')
  @ApiOperation({ summary: 'Get model usage breakdown' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getModelBreakdown(
    @Request() req: { user: { sub: string } },
    @Query('days') days = 30,
  ) {
    return this.analyticsService.getModelBreakdown(req.user.sub, Number(days));
  }

  @Get('top-prompts')
  @ApiOperation({ summary: 'Get most used prompts' })
  async getTopPrompts(@Request() req: { user: { sub: string } }) {
    return this.analyticsService.getTopPrompts(req.user.sub);
  }
}
