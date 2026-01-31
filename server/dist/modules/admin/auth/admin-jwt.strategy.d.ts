import { ConfigService } from '@nestjs/config';
declare const AdminJwtStrategy_base: new (...args: any) => any;
export declare class AdminJwtStrategy extends AdminJwtStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        admin_id: any;
        type: any;
    }>;
}
export {};
