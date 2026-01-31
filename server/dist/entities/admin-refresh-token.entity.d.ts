import { AdminUser } from './admin-user.entity';
export declare class AdminRefreshToken {
    id: number;
    adminId: number;
    admin: AdminUser;
    tokenHash: string;
    isValid: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
