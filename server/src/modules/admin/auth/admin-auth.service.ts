import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { addDays } from 'date-fns';
import * as crypto from 'crypto';

import { AdminUser } from '../../../entities/admin-user.entity';
import { AdminRefreshToken } from '../../../entities/admin-refresh-token.entity';
import { RegisterAdminDto } from './dtos/register-admin.dto';
import { LoginAdminDto } from './dtos/login-admin.dto';

@Injectable()
export class AdminAuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepo: Repository<AdminUser>,
    @InjectRepository(AdminRefreshToken)
    private readonly adminRefreshTokenRepository: Repository<AdminRefreshToken>,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterAdminDto) {
    const existing = await this.adminRepo.findOne({
      where: { username: dto.username }
    });

    if (existing) {
      throw new ConflictException('Admin already exists');
    }

    const password_hash = await bcrypt.hash(
      dto.password,
      this.SALT_ROUNDS
    );

    const admin = this.adminRepo.create({
      username: dto.username,
      password_hash,
      recovery_email: dto.recovery_email
    });

    await this.adminRepo.save(admin);

    return {
      id: admin.id,
      username: admin.username
    };
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.adminRepo.findOne({
      where: { username: dto.username },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      dto.password,
      admin.password_hash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    /* ---------------- ACCESS TOKEN ---------------- */

    const payload = {
      sub: admin.id,
      type: 'admin',
    };

    const accessToken = this.jwtService.sign(payload);

    /* ---------------- REFRESH TOKEN ---------------- */

    const refreshToken = crypto.randomBytes(64).toString('hex');

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    const refreshTokenExpiry = addDays(
      new Date(),
      Number(process.env.ADMIN_REFRESH_TOKEN_EXPIRY_DAYS),
    );

    await this.adminRefreshTokenRepository.save({
      adminId: admin.id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshTokenExpiry,
      isValid: true,
    });

    /* ---------------- RESPONSE ---------------- */

    return {
      access_token: `Bearer ${accessToken}`,
      refresh_token: refreshToken,
      expires_in: process.env.ADMIN_ACCESS_TOKEN_EXPIRY,
    };
  }
}
