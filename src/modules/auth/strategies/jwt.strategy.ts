import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secretKey = configService.get<string>('NEXTAUTH_SECRET');
    
    if (!secretKey) {
      throw new Error('NEXTAUTH_SECRET is not configured in environment variables');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    
    // This matches what NextAuth.js provides in the token
    return { 
      userId: payload.sub,  // For compatibility with existing controllers
      id: payload.sub, 
      email: payload.email, 
      role: payload.role,
      name: payload.name
    };
  }
}