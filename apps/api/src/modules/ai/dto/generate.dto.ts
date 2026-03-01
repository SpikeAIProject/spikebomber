import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AIModel {
  GEMINI_15_PRO = 'gemini-1.5-pro',
  GEMINI_15_FLASH = 'gemini-1.5-flash',
  GEMINI_10_PRO = 'gemini-1.0-pro',
}

export class GenerateDto {
  @ApiProperty({ enum: AIModel, default: AIModel.GEMINI_15_FLASH })
  @IsEnum(AIModel)
  model: AIModel;

  @ApiProperty({ example: 'Explain quantum computing in simple terms' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({ example: 1024 })
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

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  stream?: boolean;
}
