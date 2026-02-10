import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { addDays } from 'date-fns';
import * as crypto from 'crypto';
import { Response, Request } from 'express';

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
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterAdminDto) {
    const existing = await this.adminRepo.findOne({
      where: { username: dto.username },
    });

    if (existing) {
      throw new ConflictException('Admin already exists');
    }

    const password_hash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const admin = this.adminRepo.create({
      username: dto.username,
      password_hash,
      recovery_email: dto.recovery_email,
    });

    await this.adminRepo.save(admin);

    return {
      id: admin.id,
      username: admin.username,
    };
  }

  async login(dto: LoginAdminDto, res: Response) {
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

    /* ---------------- SET COOKIE ---------------- */

    res.cookie('admin_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/admin/auth/refresh',
      maxAge:
        Number(process.env.ADMIN_REFRESH_TOKEN_EXPIRY_DAYS) *
        24 *
        60 *
        60 *
        1000,
    });

    /* ---------------- RESPONSE ---------------- */

    return {
      access_token: `Bearer ${accessToken}`,
      expires_in: process.env.ADMIN_ACCESS_TOKEN_EXPIRY,
    };
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.admin_refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    /* ---------------- FIND TOKEN ---------------- */

    const tokens = await this.adminRefreshTokenRepository.find({
      where: { isValid: true },
      relations: ['admin'],
    });

    const matchedToken = await this.findMatchingToken(refreshToken, tokens);

    if (!matchedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (matchedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    /* ---------------- ROTATE TOKEN ---------------- */

    matchedToken.isValid = false;
    await this.adminRefreshTokenRepository.save(matchedToken);

    const newRefreshToken = crypto.randomBytes(64).toString('hex');
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    const newExpiry = addDays(
      new Date(),
      Number(process.env.ADMIN_REFRESH_TOKEN_EXPIRY_DAYS),
    );

    await this.adminRefreshTokenRepository.save({
      adminId: matchedToken.adminId,
      tokenHash: newRefreshTokenHash,
      expiresAt: newExpiry,
      isValid: true,
    });

    /* ---------------- SET NEW COOKIE ---------------- */

    res.cookie('admin_refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/admin/auth/refresh',
      maxAge:
        Number(process.env.ADMIN_REFRESH_TOKEN_EXPIRY_DAYS) *
        24 *
        60 *
        60 *
        1000,
    });

    /* ---------------- NEW ACCESS TOKEN ---------------- */

    const payload = {
      sub: matchedToken.adminId,
      type: 'admin',
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: `Bearer ${accessToken}`,
      expires_in: process.env.ADMIN_ACCESS_TOKEN_EXPIRY,
    };
  }

  /* ---------------- HELPER ---------------- */

  private async findMatchingToken(
    incomingToken: string,
    tokens: AdminRefreshToken[],
  ): Promise<AdminRefreshToken | null> {
    for (const token of tokens) {
      const match = await bcrypt.compare(incomingToken, token.tokenHash);
      if (match) return token;
    }
    return null;
  }
}
