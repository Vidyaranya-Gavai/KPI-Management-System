import { Company } from "./company.entity";
export declare class CompanyEmailDomain {
    id: number;
    company: Company;
    domain: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
