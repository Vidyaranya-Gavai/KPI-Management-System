import { CompanyEmailDomainDto } from '../company-domain.dto';

export interface IBootstrapCompany {
  name: string;
  code: string;
  is_active?: boolean;
  email_domains: CompanyEmailDomainDto[];
}
