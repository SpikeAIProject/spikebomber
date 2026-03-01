import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { VertexProvider } from './providers/vertex.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { UsageModule } from '../usage/usage.module';

@Module({
  imports: [UsageModule],
  controllers: [AIController],
  providers: [AIService, VertexProvider, GeminiProvider],
  exports: [AIService],
})
export class AIModule {}
