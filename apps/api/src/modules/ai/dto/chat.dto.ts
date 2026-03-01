import { IsArray, IsOptional, IsNumber, IsBoolean, IsEnum, ValidateNested, IsString, IsIn, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AIModel } from './generate.dto';

export class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant', 'system'] })
  @IsIn(['user', 'assistant', 'system'])
  role: 'user' | 'assistant' | 'system';

  @ApiProperty()
  @IsString()
  content: string;
}

export class ChatDto {
  @ApiProperty({ enum: AIModel, default: AIModel.GEMINI_15_FLASH })
  @IsEnum(AIModel)
  model: AIModel;

  @ApiProperty({ type: [ChatMessageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8192)
  maxTokens?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  stream?: boolean;
}
