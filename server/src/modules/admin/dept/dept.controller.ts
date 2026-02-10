import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DeptService } from './dept.service';
import { AdminAuthGuard } from 'src/guards/admin/admin-auth.guard';
import { CreateDeptDto } from './dtos/create/create-dept.dto';
import { Admin, AdminContext } from 'src/common/decorators/admin.decorator';
import { UpdateDeptDto } from './dtos/update/update-dept.dto';

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

  @UseGuards(AdminAuthGuard)
  @Patch('dept/:deptId')
  async updateDept(
    @Param('deptId') deptId: number,
    @Body() updateDeptDto: UpdateDeptDto,
    @Admin() admin: AdminContext,
  ) {
    return this.deptService.updateDept(deptId, updateDeptDto, admin.id);
  }
}
