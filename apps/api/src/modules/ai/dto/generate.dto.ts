import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum AIModel {
  GEMINI_PRO = 'gemini-1.5-pro',
  GEMINI_FLASH = 'gemini-1.5-flash',
  GEMINI_PRO_VISION = 'gemini-pro-vision',
}

export class GenerateDto {
  @ApiProperty({ example: 'Write a poem about the ocean', description: 'The prompt to generate from' })
  @IsString()
  @MaxLength(100_000, { message: 'Prompt must not exceed 100,000 characters' })
  prompt: string;

  @ApiPropertyOptional({ enum: AIModel, default: AIModel.GEMINI_FLASH })
  @IsOptional()
  @IsEnum(AIModel)
  model?: AIModel;

  @ApiPropertyOptional({ example: 2048, description: 'Maximum number of tokens to generate' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8192)
  maxTokens?: number;

  @ApiPropertyOptional({ example: 0.7, description: 'Sampling temperature (0.0 - 2.0)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiPropertyOptional({ example: 0.95, description: 'Top-p sampling parameter' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  topP?: number;

  @ApiPropertyOptional({ example: false, description: 'Enable streaming response' })
  @IsOptional()
  @IsBoolean()
  stream?: boolean;

  @ApiPropertyOptional({ example: 'You are a helpful assistant', description: 'System prompt' })
  @IsOptional()
  @IsString()
  @MaxLength(10_000)
  systemPrompt?: string;
}
