import { Body, Controller, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { BootstrapCompanyDto } from './dtos/bootstrap-company.dto';

@Controller('admin/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * Create a single company
   */
  @Post()
  async createCompany(
    @Body() dto: CreateCompanyDto,
  ) {
    return this.companyService.createCompany(dto);
  }

  /**
   * Bootstrap parent company with child companies
   */
  @Post('bootstrap')
  async bootstrapCompanies(
    @Body() dto: BootstrapCompanyDto,
  ) {
    return this.companyService.bootstrapCompanies(dto);
  }
}
