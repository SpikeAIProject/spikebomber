export type AIModel =
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  | 'gemini-1.0-pro'
  | 'gemini-pro-vision';

export interface GenerateRequestDto {
  model: AIModel;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequestDto {
  model: AIModel;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface GenerateResponseDto {
  id: string;
  model: AIModel;
  content: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
}

export interface UsageResponseDto {
  requestsUsed: number;
  requestsLimit: number;
  tokensUsed: number;
  tokensLimit: number;
  resetAt: Date;
}

export interface ModelInfoDto {
  id: AIModel;
  name: string;
  description: string;
  maxTokens: number;
  inputCostPer1k: number;
  outputCostPer1k: number;
  supportsVision: boolean;
  supportsStreaming: boolean;
}
