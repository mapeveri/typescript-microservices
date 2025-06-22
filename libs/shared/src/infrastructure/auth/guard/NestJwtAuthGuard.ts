import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class NestJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const userId = request.header('x-user-id');
    const userRole = request.header('x-user-role');

    if (!userId || !userRole) {
      throw new UnauthorizedException();
    }

    request.user = {
      id: userId,
      role: userRole,
      email: 'hardcoded@email.com',
    };

    return true;
  }
}
