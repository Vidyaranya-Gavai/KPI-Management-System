import { Body, Controller, Post, UseGuards, Req, Patch, Param, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create/create-company.dto';
import { BootstrapCompanyDto } from './dtos/create/bootstrap-company.dto';
import { AdminAuthGuard } from '../../../guards/admin/admin-auth.guard';
import { Admin, AdminContext } from 'src/common/decorators/admin.decorator';
import { UpdateCompanyDto } from './dtos/update/update-company.dto';

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

  /* Create bootstrap companies */
  @UseGuards(AdminAuthGuard)
  @Post('bootstrap')
  async bootstrapCompanies(
    @Body() bootstrapCompanyDto: BootstrapCompanyDto,
    @Admin() admin: AdminContext,
  ) {
    return this.companyService.createBootstrapCompanies(bootstrapCompanyDto, admin.id);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':companyId')
  async updateCompany(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Admin() admin: AdminContext,
  ) {
    return this.companyService.updateCompany(
      Number(companyId),
      admin.id,
      updateCompanyDto,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':companyId')
  async deleteCompany(
    @Param('companyId') companyId: string,
    @Admin() admin: AdminContext,
  ) {
    return this.companyService.deleteCompany(
      Number(companyId),
      admin.id,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':companyId/domain/:domainId')
  async deleteCompanyDomain(
    @Param('companyId') companyId: string,
    @Param('domainId') domainId: string,
    @Admin() admin: AdminContext,
  ) {
    return this.companyService.deleteCompanyDomain(
      Number(companyId),
      Number(domainId),
      admin.id,
    );
  }
}
