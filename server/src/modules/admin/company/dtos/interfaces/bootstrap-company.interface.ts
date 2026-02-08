import { CompanyEmailDomainDto } from '../create/company-domain.dto';

export interface IBootstrapCompany {
  name: string;
  code: string;
  is_active?: boolean;
  email_domains: CompanyEmailDomainDto[];
}
