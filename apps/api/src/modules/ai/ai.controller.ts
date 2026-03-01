import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
  Version,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateDto } from './dto/generate.dto';
import { ChatDto } from './dto/chat.dto';
import { ApiKeysService } from '../api-keys/api-keys.service';

@ApiTags('AI (v1)')
@ApiSecurity('api-key')
@Controller({ path: 'v1', version: '1' })
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  private async validateApiKey(apiKey: string) {
    if (!apiKey) throw new UnauthorizedException('API key required');
    const key = await this.apiKeysService.validateApiKey(apiKey);
    if (!key) throw new UnauthorizedException('Invalid API key');
    return key;
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate text with AI model' })
  async generate(
    @Headers('x-api-key') apiKey: string,
    @Body() dto: GenerateDto,
  ) {
    const keyData = await this.validateApiKey(apiKey);
    return this.aiService.generate(dto, keyData.tenantId);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI model' })
  async chat(
    @Headers('x-api-key') apiKey: string,
    @Body() dto: ChatDto,
  ) {
    const keyData = await this.validateApiKey(apiKey);
    return this.aiService.chat(dto, keyData.tenantId);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get current usage stats' })
  async getUsage(@Headers('x-api-key') apiKey: string) {
    const keyData = await this.validateApiKey(apiKey);
    return this.aiService.getUsage(keyData.tenantId);
  }

  @Get('models')
  @ApiOperation({ summary: 'List available AI models' })
  getModels() {
    return this.aiService.getModels();
  }
}
