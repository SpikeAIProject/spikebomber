import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

import { JwtAuthGuard } from '../auth/auth.guard';
import { UsageService } from './usage.service';

@ApiTags('Usage')
@ApiBearerAuth('JWT-Auth')
@UseGuards(JwtAuthGuard)
@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get()
  @ApiOperation({ summary: 'Get current usage summary' })
  async getSummary(@Request() req: { user: { sub: string } }) {
    return this.usageService.getSummary(req.user.sub);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get usage history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHistory(
    @Request() req: { user: { sub: string } },
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.usageService.getHistory(req.user.sub, Number(page), Number(limit));
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get daily usage breakdown' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getDaily(
    @Request() req: { user: { sub: string } },
    @Query('days') days = 30,
  ) {
    return this.usageService.getDailyUsage(req.user.sub, Number(days));
  }
}
