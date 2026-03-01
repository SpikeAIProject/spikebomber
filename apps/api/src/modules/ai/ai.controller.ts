import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtAuthGuard } from '../auth/auth.guard';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { AIService } from './ai.service';
import { GenerateDto } from './dto/generate.dto';
import { ChatDto } from './dto/chat.dto';

@ApiTags('AI')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('models')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'List available AI models' })
  @ApiResponse({ status: 200, description: 'List of available models' })
  getModels() {
    return this.aiService.getAvailableModels();
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'Generate text from a prompt' })
  @ApiResponse({ status: 200, description: 'Generated text response' })
  async generate(
    @Body() dto: GenerateDto,
    @Request() req: { user: { sub: string } },
    @Res() res: Response,
  ) {
    if (dto.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      await this.aiService.generateStream(dto, req.user.sub, (chunk) => {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      });
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      const result = await this.aiService.generate(dto, req.user.sub);
      res.json(result);
    }
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'Multi-turn chat with AI model' })
  @ApiResponse({ status: 200, description: 'Chat response' })
  async chat(
    @Body() dto: ChatDto,
    @Request() req: { user: { sub: string } },
    @Res() res: Response,
  ) {
    if (dto.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      await this.aiService.chatStream(dto, req.user.sub, (chunk) => {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      });
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      const result = await this.aiService.chat(dto, req.user.sub);
      res.json(result);
    }
  }

  @Post('multimodal')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({ summary: 'Multimodal generation with image + text' })
  @ApiResponse({ status: 200, description: 'Multimodal response' })
  async multimodal(
    @Body() dto: GenerateDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.aiService.generate({ ...dto, model: 'gemini-1.5-pro' as any }, req.user.sub);
  }
}
