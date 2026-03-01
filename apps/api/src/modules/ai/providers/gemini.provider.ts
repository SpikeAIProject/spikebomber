import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GenerateOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  systemPrompt?: string;
}

interface GenerateResult {
  text: string;
  promptTokens: number;
  completionTokens: number;
}

@Injectable()
export class GeminiProvider implements OnModuleInit {
  private readonly logger = new Logger(GeminiProvider.name);
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY', '');
    if (!this.apiKey) {
      this.logger.warn('GEMINI_API_KEY not configured - using Vertex AI fallback');
    } else {
      this.logger.log('Gemini API provider initialized');
    }
  }

  async generate(prompt: string, options: GenerateOptions): Promise<GenerateResult> {
    const model = this.mapModel(options.model ?? 'gemini-1.5-flash');

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      ...(options.systemPrompt && {
        systemInstruction: { parts: [{ text: options.systemPrompt }] },
      }),
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 2048,
        temperature: options.temperature ?? 0.7,
        topP: options.topP ?? 0.95,
      },
    };

    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${error}`);
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const usage = data.usageMetadata;

    return {
      text,
      promptTokens: usage?.promptTokenCount ?? Math.ceil(prompt.length / 4),
      completionTokens: usage?.candidatesTokenCount ?? Math.ceil(text.length / 4),
    };
  }

  async generateStream(
    prompt: string,
    options: GenerateOptions,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const model = this.mapModel(options.model ?? 'gemini-1.5-flash');

    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      ...(options.systemPrompt && {
        systemInstruction: { parts: [{ text: options.systemPrompt }] },
      }),
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 2048,
        temperature: options.temperature ?? 0.7,
      },
    };

    const url = `${this.baseUrl}/models/${model}:streamGenerateContent?key=${this.apiKey}&alt=sse`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Gemini streaming API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

      for (const line of lines) {
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;
        try {
          const parsed = JSON.parse(jsonStr) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) onChunk(text);
        } catch {
          // Skip malformed chunks
        }
      }
    }
  }

  async chat(messages: ChatMessage[], options: GenerateOptions): Promise<GenerateResult> {
    const model = this.mapModel(options.model ?? 'gemini-1.5-flash');

    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const systemMessage = messages.find((m) => m.role === 'system');
    const systemPrompt = options.systemPrompt ?? systemMessage?.content;

    const body = {
      contents,
      ...(systemPrompt && {
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }),
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 2048,
        temperature: options.temperature ?? 0.7,
      },
    };

    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini chat API error ${response.status}: ${error}`);
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const usage = data.usageMetadata;

    return {
      text,
      promptTokens: usage?.promptTokenCount ?? 0,
      completionTokens: usage?.candidatesTokenCount ?? Math.ceil(text.length / 4),
    };
  }

  async chatStream(
    messages: ChatMessage[],
    options: GenerateOptions,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const model = this.mapModel(options.model ?? 'gemini-1.5-flash');

    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const systemMessage = messages.find((m) => m.role === 'system');
    const systemPrompt = options.systemPrompt ?? systemMessage?.content;

    const body = {
      contents,
      ...(systemPrompt && {
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }),
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 2048,
        temperature: options.temperature ?? 0.7,
      },
    };

    const url = `${this.baseUrl}/models/${model}:streamGenerateContent?key=${this.apiKey}&alt=sse`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Gemini streaming chat error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

      for (const line of lines) {
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;
        try {
          const parsed = JSON.parse(jsonStr) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) onChunk(text);
        } catch {
          // Skip malformed chunks
        }
      }
    }
  }

  private mapModel(model: string): string {
    const modelMap: Record<string, string> = {
      'gemini-1.5-pro': 'gemini-1.5-pro',
      'gemini-1.5-flash': 'gemini-1.5-flash',
      'gemini-pro-vision': 'gemini-pro-vision',
      'text-bison': 'text-bison-001',
      'chat-bison': 'chat-bison-001',
    };
    return modelMap[model] ?? model;
  }
}
