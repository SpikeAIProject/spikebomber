import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GeminiProvider } from './providers/gemini.provider';
import { VertexProvider } from './providers/vertex.provider';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { UsageModule } from '../usage/usage.module';

@Module({
  imports: [ApiKeysModule, UsageModule],
  controllers: [AiController],
  providers: [AiService, GeminiProvider, VertexProvider],
  exports: [AiService],
})
export class AiModule {}
