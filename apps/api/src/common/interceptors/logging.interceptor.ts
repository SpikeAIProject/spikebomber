import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = req;
    const userAgent = req.get('user-agent') ?? '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse<Response>();
          const { statusCode } = res;
          const latency = Date.now() - startTime;

          this.logger.log(
            `${method} ${url} ${statusCode} +${latency}ms - ${ip} ${userAgent}`,
          );
        },
        error: (err: Error) => {
          const latency = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} ERROR +${latency}ms - ${err.message}`,
          );
        },
      }),
    );
  }
}
