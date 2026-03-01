import { IsString, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWebhookDto {
  @ApiProperty({ example: 'https://your-app.com/webhook' })
  @IsUrl()
  url: string;

  @ApiProperty({ example: ['usage.limit.reached', 'subscription.updated'] })
  @IsArray()
  @IsString({ each: true })
  events: string[];
}
