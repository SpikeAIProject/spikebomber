import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateWebhookDto } from './dto/create-webhook.dto';

@ApiTags('Webhooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  list(@CurrentUser() user: { tenantId: string }) {
    return this.webhooksService.list(user.tenantId);
  }

  @Post()
  create(
    @CurrentUser() user: { tenantId: string },
    @Body() dto: CreateWebhookDto,
  ) {
    return this.webhooksService.create(user.tenantId, dto);
  }

  @Delete(':id')
  delete(
    @CurrentUser() user: { tenantId: string },
    @Param('id') id: string,
  ) {
    return this.webhooksService.delete(id, user.tenantId);
  }
}
