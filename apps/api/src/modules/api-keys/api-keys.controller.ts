import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/auth.guard';
import { ApiKeysService } from './api-keys.service';

class CreateApiKeyDto {
  @ApiProperty({ example: 'Production Key' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: ['ai:generate', 'ai:chat'] })
  @IsOptional()
  @IsArray()
  permissions?: string[];
}

@ApiTags('API Keys')
@ApiBearerAuth('JWT-Auth')
@UseGuards(JwtAuthGuard)
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  @ApiOperation({ summary: 'List all API keys' })
  @ApiResponse({ status: 200, description: 'List of API keys' })
  async list(@Request() req: { user: { sub: string } }) {
    return this.apiKeysService.findByUserId(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({ status: 201, description: 'API key created with raw key value (shown once)' })
  async create(
    @Body() dto: CreateApiKeyDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.apiKeysService.create(req.user.sub, dto.name, dto.permissions);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke an API key' })
  @ApiResponse({ status: 204, description: 'API key revoked' })
  async revoke(
    @Param('id') id: string,
    @Request() req: { user: { sub: string } },
  ) {
    await this.apiKeysService.revoke(req.user.sub, id);
  }

  @Post(':id/rotate')
  @ApiOperation({ summary: 'Rotate an API key (creates new key, revokes old)' })
  @ApiResponse({ status: 200, description: 'New API key (shown once)' })
  async rotate(
    @Param('id') id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.apiKeysService.rotate(req.user.sub, id);
  }
}
