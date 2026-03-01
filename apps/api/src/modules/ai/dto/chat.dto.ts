import {
  IsArray,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsString,
  ValidateNested,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum AIModel {
  GEMINI_PRO = 'gemini-1.5-pro',
  GEMINI_FLASH = 'gemini-1.5-flash',
}

class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant', 'system'] })
  @IsEnum(['user', 'assistant', 'system'])
  role: 'user' | 'assistant' | 'system';

  @ApiProperty({ example: 'Hello!' })
  @IsString()
  @MaxLength(100_000)
  content: string;
}

export class ChatDto {
  @ApiProperty({ type: [ChatMessageDto], description: 'Chat message history' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @ApiPropertyOptional({ enum: AIModel, default: AIModel.GEMINI_FLASH })
  @IsOptional()
  @IsEnum(AIModel)
  model?: AIModel;

  @ApiPropertyOptional({ example: 2048 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8192)
  maxTokens?: number;

  @ApiPropertyOptional({ example: 0.7 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  stream?: boolean;

  @ApiPropertyOptional({ example: 'You are a helpful assistant' })
  @IsOptional()
  @IsString()
  @MaxLength(10_000)
  systemPrompt?: string;
}
