import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AdminUser } from '../../entities/admin-user.entity';
import { RegisterAdminDto } from './dtos/register-admin.dto';
import { LoginAdminDto } from './dtos/login-admin.dto';

@Injectable()
export class AdminAuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepo: Repository<AdminUser>,
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
      where: { username: dto.username }
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(
      dto.password,
      admin.password_hash
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      type: 'admin'
    };

    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
