import { CompanyEmailDomain } from "./company-email-domain.entity";
export declare class Company {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
    email_domains: CompanyEmailDomain[];
    created_at: Date;
    updated_at: Date;
}
