import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AdminAuthGuard } from 'src/guards/admin/admin-auth.guard';
import { Admin, AdminContext } from 'src/common/decorators/admin.decorator';
import { CreateRoleDto } from './dtos/create/create-role.dto';

@Controller('admin')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AdminAuthGuard)
  @Post('dept/:deptId/role')
  async createRole(
    @Param('deptId') deptId: number,
    @Body() createRoleDto: CreateRoleDto,
    @Admin() admin: AdminContext,
  ) {
    return this.roleService.createRole(deptId, createRoleDto, admin.id);
  }
}
