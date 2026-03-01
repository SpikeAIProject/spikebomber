import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GeminiProvider } from './providers/gemini.provider';
import { VertexProvider } from './providers/vertex.provider';
import { UsageService } from '../usage/usage.service';
import { GenerateDto } from './dto/generate.dto';
import { ChatDto } from './dto/chat.dto';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const DEFAULT_TIMEOUT_MS = 30_000;

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(
    private readonly geminiProvider: GeminiProvider,
    private readonly vertexProvider: VertexProvider,
    private readonly usageService: UsageService,
    private readonly configService: ConfigService,
  ) {}

  getAvailableModels() {
    return {
      models: [
        {
          id: 'gemini-1.5-pro',
          name: 'Gemini 1.5 Pro',
          provider: 'google',
          maxTokens: 1_048_576,
          supportsVision: true,
          supportsStreaming: true,
          tier: 'pro',
        },
        {
          id: 'gemini-1.5-flash',
          name: 'Gemini 1.5 Flash',
          provider: 'google',
          maxTokens: 1_048_576,
          supportsVision: true,
          supportsStreaming: true,
          tier: 'starter',
        },
        {
          id: 'gemini-pro-vision',
          name: 'Gemini Pro Vision',
          provider: 'google',
          maxTokens: 16_384,
          supportsVision: true,
          supportsStreaming: false,
          tier: 'pro',
        },
      ],
    };
  }

  async generate(dto: GenerateDto, userId: string) {
    const startTime = Date.now();

    if (!dto.prompt?.trim()) {
      throw new BadRequestException('Prompt cannot be empty');
    }

    const model = dto.model ?? 'gemini-1.5-flash';

    let result: { text: string; promptTokens: number; completionTokens: number };

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        result = await Promise.race([
          this.geminiProvider.generate(dto.prompt, {
            model,
            maxTokens: dto.maxTokens,
            temperature: dto.temperature,
            topP: dto.topP,
            systemPrompt: dto.systemPrompt,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), DEFAULT_TIMEOUT_MS),
          ),
        ]);
        break;
      } catch (err) {
        const error = err as Error;
        this.logger.warn(`AI generation attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);
        if (attempt === MAX_RETRIES) {
          throw new ServiceUnavailableException('AI service temporarily unavailable. Please try again.');
        }
        await this.delay(RETRY_DELAY_MS * attempt);
      }
    }

    const latencyMs = Date.now() - startTime;
    const totalTokens = result!.promptTokens + result!.completionTokens;

    await this.usageService.log({
      userId,
      model,
      promptTokens: result!.promptTokens,
      completionTokens: result!.completionTokens,
      totalTokens,
      latencyMs,
      success: true,
    });

    return {
      text: result!.text,
      model,
      promptTokens: result!.promptTokens,
      completionTokens: result!.completionTokens,
      totalTokens,
      latencyMs,
      finishReason: 'stop',
    };
  }

  async generateStream(dto: GenerateDto, userId: string, onChunk: (chunk: string) => void) {
    const startTime = Date.now();
    const model = dto.model ?? 'gemini-1.5-flash';
    let totalChars = 0;

    await this.geminiProvider.generateStream(
      dto.prompt,
      { model, maxTokens: dto.maxTokens, temperature: dto.temperature, systemPrompt: dto.systemPrompt },
      (chunk) => {
        onChunk(chunk);
        totalChars += chunk.length;
      },
    );

    const latencyMs = Date.now() - startTime;
    const estimatedTokens = Math.ceil(totalChars / 4);

    await this.usageService.log({
      userId,
      model,
      promptTokens: Math.ceil(dto.prompt.length / 4),
      completionTokens: estimatedTokens,
      totalTokens: Math.ceil(dto.prompt.length / 4) + estimatedTokens,
      latencyMs,
      success: true,
    });
  }

  async chat(dto: ChatDto, userId: string) {
    const startTime = Date.now();
    const model = dto.model ?? 'gemini-1.5-flash';

    const result = await this.geminiProvider.chat(dto.messages, {
      model,
      maxTokens: dto.maxTokens,
      temperature: dto.temperature,
      systemPrompt: dto.systemPrompt,
    });

    const latencyMs = Date.now() - startTime;
    const totalTokens = result.promptTokens + result.completionTokens;

    await this.usageService.log({
      userId,
      model,
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
      totalTokens,
      latencyMs,
      success: true,
    });

    return { ...result, model, latencyMs, finishReason: 'stop' };
  }

  async chatStream(dto: ChatDto, userId: string, onChunk: (chunk: string) => void) {
    const model = dto.model ?? 'gemini-1.5-flash';
    const startTime = Date.now();
    let totalChars = 0;

    await this.geminiProvider.chatStream(
      dto.messages,
      { model, maxTokens: dto.maxTokens, temperature: dto.temperature, systemPrompt: dto.systemPrompt },
      (chunk) => {
        onChunk(chunk);
        totalChars += chunk.length;
      },
    );

    const latencyMs = Date.now() - startTime;
    const estimatedTokens = Math.ceil(totalChars / 4);

    await this.usageService.log({
      userId,
      model,
      promptTokens: 100, // estimated
      completionTokens: estimatedTokens,
      totalTokens: 100 + estimatedTokens,
      latencyMs,
      success: true,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
