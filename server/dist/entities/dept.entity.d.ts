import { Role } from './role.entity';
export declare class Dept {
    id: number;
    name: string;
    type: string;
    roles: Role[];
    created_at: Date;
    updated_at: Date;
}
