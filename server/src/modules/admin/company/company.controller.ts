import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { BootstrapCompanyDto } from './dtos/bootstrap-company.dto';
import { AdminAuthGuard } from '../../../guards/admin/admin-auth.guard';
import { Admin, AdminContext } from 'src/common/decorators/admin.decorator';

@Controller('admin/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /* Create a single company at a time */
  @UseGuards(AdminAuthGuard)
  @Post()
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @Admin() admin: AdminContext
  ) {
     return this.companyService.createCompany(createCompanyDto, admin.id);
  }
}
