import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { GeminiProvider } from './providers/gemini.provider';
import { VertexProvider } from './providers/vertex.provider';
import { UsageService } from '../usage/usage.service';
import { GenerateDto } from './dto/generate.dto';
import { ChatDto } from './dto/chat.dto';
import { v4 as uuidv4 } from 'uuid';

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private geminiProvider: GeminiProvider,
    private vertexProvider: VertexProvider,
    private usageService: UsageService,
  ) {}

  async generate(dto: GenerateDto, tenantId: string) {
    const startTime = Date.now();
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        const result = await Promise.race([
          this.geminiProvider.generate(dto),
          new Promise((_, reject) =>
            setTimeout(() => reject(new RequestTimeoutException('AI request timed out')), TIMEOUT_MS),
          ),
        ]) as { content: string; promptTokens: number; completionTokens: number };

        const latencyMs = Date.now() - startTime;

        // Log usage
        await this.usageService.log({
          tenantId,
          model: dto.model,
          promptTokens: result.promptTokens,
          completionTokens: result.completionTokens,
          totalTokens: result.promptTokens + result.completionTokens,
          latencyMs,
          endpoint: '/v1/generate',
        });

        return {
          id: uuidv4(),
          model: dto.model,
          content: result.content,
          promptTokens: result.promptTokens,
          completionTokens: result.completionTokens,
          totalTokens: result.promptTokens + result.completionTokens,
          latencyMs,
        };
      } catch (error) {
        attempt++;
        this.logger.warn(`AI generate attempt ${attempt} failed: ${error}`);
        if (attempt >= MAX_RETRIES) throw error;
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  async chat(dto: ChatDto, tenantId: string) {
    const startTime = Date.now();
    const result = await this.geminiProvider.chat(dto);
    const latencyMs = Date.now() - startTime;

    await this.usageService.log({
      tenantId,
      model: dto.model,
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
      totalTokens: result.promptTokens + result.completionTokens,
      latencyMs,
      endpoint: '/v1/chat',
    });

    return {
      id: uuidv4(),
      model: dto.model,
      message: { role: 'assistant', content: result.content },
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
      totalTokens: result.promptTokens + result.completionTokens,
      latencyMs,
    };
  }

  async getUsage(tenantId: string) {
    return this.usageService.getSummary(tenantId);
  }

  getModels() {
    return [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Most capable Gemini model with large context window',
        maxTokens: 1048576,
        inputCostPer1k: 0.00125,
        outputCostPer1k: 0.005,
        supportsVision: true,
        supportsStreaming: true,
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Fast and efficient Gemini model',
        maxTokens: 1048576,
        inputCostPer1k: 0.000075,
        outputCostPer1k: 0.0003,
        supportsVision: true,
        supportsStreaming: true,
      },
      {
        id: 'gemini-1.0-pro',
        name: 'Gemini 1.0 Pro',
        description: 'Balanced Gemini model for text tasks',
        maxTokens: 32768,
        inputCostPer1k: 0.0005,
        outputCostPer1k: 0.0015,
        supportsVision: false,
        supportsStreaming: true,
      },
    ];
  }
}
