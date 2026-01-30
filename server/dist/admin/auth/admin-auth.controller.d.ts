import { AdminAuthService } from './admin-auth.service';
import { RegisterAdminDto } from './dtos/register-admin.dto';
import { LoginAdminDto } from './dtos/login-admin.dto';
export declare class AdminAuthController {
    private readonly authService;
    constructor(authService: AdminAuthService);
    register(dto: RegisterAdminDto): Promise<{
        id: number;
        username: string;
    }>;
    login(dto: LoginAdminDto): Promise<{
        access_token: string;
    }>;
}
