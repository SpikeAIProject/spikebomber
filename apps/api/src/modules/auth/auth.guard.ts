import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser>(err: Error, user: TUser, info: Error): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Access token has expired. Please refresh your token.');
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid access token.');
    }
    if (err || !user) {
      throw new UnauthorizedException('Authentication required.');
    }
    return user;
  }
}
