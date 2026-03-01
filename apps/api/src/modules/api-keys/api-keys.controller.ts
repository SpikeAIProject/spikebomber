import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@ApiTags('API Keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  @ApiOperation({ summary: 'List API keys' })
  list(@CurrentUser() user: { tenantId: string; id: string }) {
    return this.apiKeysService.list(user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new API key' })
  create(
    @CurrentUser() user: { tenantId: string; id: string },
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.apiKeysService.create(user.tenantId, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke an API key' })
  revoke(
    @CurrentUser() user: { tenantId: string },
    @Param('id') id: string,
  ) {
    return this.apiKeysService.revoke(id, user.tenantId);
  }

  @Post(':id/rotate')
  @ApiOperation({ summary: 'Rotate an API key' })
  rotate(
    @CurrentUser() user: { tenantId: string; id: string },
    @Param('id') id: string,
  ) {
    return this.apiKeysService.rotate(id, user.tenantId, user.id);
  }
}
