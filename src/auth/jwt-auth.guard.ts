import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const [, token] = authHeader.split(' ');
    const secret = this.configService.get<string>('JWT_SECRET');

    console.log('[JWT Guard] Token recibido:', token.substring(0, 50) + '...');
    console.log('[JWT Guard] Secret usado para verificar:', secret);

    try {
      const payload = this.jwtService.verify(token, {
        secret: secret,
      });
      console.log('[JWT Guard] ✅ Token válido. Payload:', payload);
      req['user'] = payload; // puedes acceder al user en controllers
      return true;
    } catch (err) {
      console.log('[JWT Guard] ❌ Error al verificar token:', err.message);
      console.log('[JWT Guard] Error completo:', err);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
