import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VertexAI, GenerativeModel } from '@google-cloud/vertexai';

@Injectable()
export class VertexProvider implements OnModuleInit {
  private readonly logger = new Logger(VertexProvider.name);
  private vertexAI: VertexAI;
  private models = new Map<string, GenerativeModel>();

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const project = this.configService.get<string>('GOOGLE_CLOUD_PROJECT');
    const location = this.configService.get<string>('VERTEX_AI_LOCATION', 'us-central1');

    if (!project) {
      this.logger.warn('GOOGLE_CLOUD_PROJECT not configured - Vertex AI provider disabled');
      return;
    }

    this.vertexAI = new VertexAI({ project, location });
    this.logger.log(`Vertex AI initialized for project: ${project}, location: ${location}`);
  }

  getModel(modelId: string): GenerativeModel {
    if (!this.vertexAI) {
      throw new Error('Vertex AI not initialized - GOOGLE_CLOUD_PROJECT not configured');
    }

    if (!this.models.has(modelId)) {
      const model = this.vertexAI.getGenerativeModel({
        model: modelId,
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.7,
          topP: 0.95,
        },
        safetySettings: [],
      });
      this.models.set(modelId, model);
    }

    return this.models.get(modelId)!;
  }

  async generate(
    prompt: string,
    options: { model?: string; maxTokens?: number; temperature?: number; systemPrompt?: string },
  ) {
    const model = this.getModel(options.model ?? 'gemini-1.5-flash-001');

    const contents = [{ role: 'user' as const, parts: [{ text: prompt }] }];
    const systemInstruction = options.systemPrompt
      ? { parts: [{ text: options.systemPrompt }] }
      : undefined;

    const result = await model.generateContent({
      contents,
      ...(systemInstruction && { systemInstruction }),
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 2048,
        temperature: options.temperature ?? 0.7,
      },
    });

    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const usage = response.usageMetadata;

    return {
      text,
      promptTokens: usage?.promptTokenCount ?? 0,
      completionTokens: usage?.candidatesTokenCount ?? 0,
    };
  }
}
