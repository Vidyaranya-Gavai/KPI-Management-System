import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';

import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminJwtStrategy } from './admin-jwt.strategy';
import { AdminUser } from '../../../entities/admin-user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminRefreshToken } from '../../../entities/admin-refresh-token.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([AdminUser, AdminRefreshToken]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('ADMIN_JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('ADMIN_ACCESS_TOKEN_EXPIRY') as StringValue || '30m',
          issuer: 'pms-admin',
          audience: 'pms-admin'
        }
      })
    })
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminJwtStrategy],
  exports: [JwtModule, PassportModule]
})
export class AdminAuthModule {}
