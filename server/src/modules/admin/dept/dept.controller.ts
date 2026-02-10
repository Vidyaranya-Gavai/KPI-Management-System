import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { DeptService } from './dept.service';
import { AdminAuthGuard } from 'src/guards/admin/admin-auth.guard';
import { CreateDeptDto } from './dtos/create/create-dept.dto';
import { Admin, AdminContext } from 'src/common/decorators/admin.decorator';

@Controller('admin')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @UseGuards(AdminAuthGuard)
  @Post('company/:companyId/dept')
  async createDept(
    @Param('companyId') companyId: number,
    @Body() createDeptDto: CreateDeptDto,
    @Admin() admin: AdminContext,
  ) {
    return this.deptService.createDept(createDeptDto, companyId, admin.id);
  }
}
