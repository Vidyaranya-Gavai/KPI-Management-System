import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { BootstrapCompanyDto } from './dtos/bootstrap-company.dto';

@Injectable()
export class CompanyService {
  /**
   * Create a single company
   */
  async createCompany(dto: CreateCompanyDto) {
    // TODO:
    // 1. Validate parent_company_id (if provided)
    // 2. Normalize domains
    // 3. Check domain uniqueness
    // 4. Persist company
    // 5. Persist domains
    // 6. Return response DTO

    return {
      message: 'Company created successfully',
    };
  }

  /**
   * Bootstrap parent + child companies (atomic operation)
   */
  async bootstrapCompanies(dto: BootstrapCompanyDto) {
    const { parent, children } = dto;

    // TODO:
    // 1. Start transaction
    // 2. Create parent company
    // 3. Persist parent domains
    // 4. Loop children:
    //    - attach parent_company_id
    //    - create company
    //    - persist domains
    // 5. Commit transaction
    // 6. Rollback on error

    return {
      message: 'Companies bootstrapped successfully',
    };
  }
}
