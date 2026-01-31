import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminUser } from '../../../entities/admin-user.entity';
import { AdminRefreshToken } from '../../../entities/admin-refresh-token.entity';
import { RegisterAdminDto } from './dtos/register-admin.dto';
import { LoginAdminDto } from './dtos/login-admin.dto';
export declare class AdminAuthService {
    private readonly adminRepo;
    private readonly adminRefreshTokenRepository;
    private readonly jwtService;
    private readonly SALT_ROUNDS;
    constructor(adminRepo: Repository<AdminUser>, adminRefreshTokenRepository: Repository<AdminRefreshToken>, jwtService: JwtService);
    register(dto: RegisterAdminDto): Promise<{
        id: number;
        username: string;
    }>;
    login(dto: LoginAdminDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: string | undefined;
    }>;
}
