import { AdminRefreshToken } from './admin-refresh-token.entity';
export declare class AdminUser {
    id: number;
    username: string;
    password_hash: string;
    recovery_email: string;
    refreshTokens: AdminRefreshToken[];
    created_at: Date;
    updated_at: Date;
}
