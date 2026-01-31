import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(
  Strategy,
  'admin-jwt'
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ADMIN_JWT_SECRET'),
      issuer: 'pms-admin',
      audience: 'pms-admin'
    });
  }

  async validate(payload: any) {
    return {
      admin_id: payload.sub,
      type: payload.type
    };
  }
}
